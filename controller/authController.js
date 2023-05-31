const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { nanoid } = require('nanoid');

require('dotenv').config();

const { User, Order } = require('../schemas');
const { httpError, ctrlWrapper, sendEmail } = require('../helpers');

const { ACCESS_SECRET, REFRESH_SECRET, BASE_URL } = process.env;

/**
 * ============================ Регистрация пользователя
 */
const registerUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user) {
    throw httpError(409, `Email in use`);
  }

  const hashPassword = await bcrypt.hash(password, 10);

  const avatarUrl =
    'https://res.cloudinary.com/dqejymgnk/image/upload/v1684344303/avatar/Group_1000002112_2x_i1bd8a.png';

  const verificationToken = nanoid();

  const newUser = await User.create({
    ...req.body,
    password: hashPassword,
    avatarUrl,
    verificationToken: verificationToken,
  });

  const verificationEmail = {
    to: email,
    subject: 'Verification email',
    html: `<a target="_blank" href="http://localhost:5173/verify/${verificationToken}" >Click here to verify your email</a>`,
  };

  await sendEmail.nodemailer(verificationEmail);

  res.status(201).json({
    name: newUser.name,
    email: newUser.email,
  });
};

/**
 * ============================ Верификация пользователя
 */
const verify = async (req, res) => {
  const { verificationToken } = req.params;

  const user = await User.findOne({ verificationToken: verificationToken });

  if (!user) {
    throw httpError(404, 'User not found');
  }

  const payload = {
    _id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    address: user.address,
    avatarUrl: user.avatarUrl,
    verify: user.verify,
  };

  const accessToken = jwt.sign(payload, ACCESS_SECRET, { expiresIn: '2m' });
  const refreshToken = jwt.sign(payload, REFRESH_SECRET, { expiresIn: '7d' });

  await User.findByIdAndUpdate(user._id, {
    verify: true,
    verificationToken: null,
    accessToken,
    refreshToken,
  });

  res.status(200).json({
    message: `Verification successful`,
    user: payload,
    accessToken,
    refreshToken,
  });
};

/**
 * ============================ Повторная отсылка письма верификации пользователя
 */
const reVerify = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    throw httpError(404, 'Email not found');
  }

  if (user.verify) {
    throw httpError(400, 'Verification has already been passed');
  }

  const verificationEmail = {
    to: email,
    subject: 'Verification email',
    html: `<a target="_blank" href="${BASE_URL}/api/users/verify/${user.verificationToken}">Click here to verify your email</a>`,
  };

  await sendEmail.nodemailer(verificationEmail);

  res.status(200).json({
    message: `Verification email sent`,
  });
};

/**
 * ============================ Login пользователя
 */
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    throw httpError(401, `Email or password is wrong`);
  }

  if (!user.verify) {
    throw httpError(401, `Email not verify`);
  }

  const checkPassword = await bcrypt.compare(password, user.password);

  if (!checkPassword) {
    throw httpError(401, `Email or password is wrong`);
  }

  const payload = {
    _id: user._id,
    name: user.name,
    email: user.email,
    avatarUrl: user.avatarUrl,
    verify: user.verify,
  };

  const accessToken = jwt.sign(payload, ACCESS_SECRET, { expiresIn: '1m' });
  const refreshToken = jwt.sign(payload, REFRESH_SECRET, { expiresIn: '7d' });

  await User.findByIdAndUpdate(user._id, {
    accessToken,
    refreshToken,
  });

  res.status(200).json({
    accessToken,
    refreshToken,
    user: payload,
  });
};

/**
 * ============================ Refresh токена пользователя
 */
const userRefresh = async (req, res) => {
  const { refreshToken: token } = req.body;
  try {
    const { _id } = jwt.verify(token, REFRESH_SECRET);

    const isExist = await User.find({ refreshToken: token });

    const user = await User.findById(_id);

    if (!isExist) {
      throw httpError(403, 'Invalid token');
    }

    const payload = {
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      address: user.address,
      avatarUrl: user.avatarUrl,
      verify: user.verify,
    };

    const accessToken = jwt.sign(payload, ACCESS_SECRET, { expiresIn: '1m' });
    const refreshToken = jwt.sign(payload, REFRESH_SECRET, { expiresIn: '7d' });

    await User.findByIdAndUpdate(user._id, {
      accessToken,
      refreshToken,
    });

    res.status(200).json({ accessToken, refreshToken });
  } catch (error) {
    throw httpError(403, error.message);
  }
};

/**
 * ============================ Текущий пользователь
 */
const getCurrentUser = async (req, res) => {
  const { name, email, phone, address, avatarUrl, verify, _id } = req.user;

  res.status(200).json({ name, email, phone, address, avatarUrl, verify, _id });
};

/**
 * ============================ Получение истории
 */
const getHistory = async (req, res) => {
  const { _id } = req.user;

  const history = await Order.find({ 'client._id': _id })
    .sort({ createdAt: -1 })
    .populate('seller');

  if (history.length === 0) {
    res.status(200).json('No orders in history');
  }

  res.status(200).json({
    history,
  });
};

/**
 * ============================ Logout пользователя
 */
const logout = async (req, res) => {
  const { id } = req.user;

  await User.findByIdAndUpdate(id, { accessToken: null, refreshToken: null });

  res.status(200).json({ message: `Successfully logout` });
};

/**
 * ============================ Обновление аватарки пользователя
 */
const updateAvatar = async (req, res) => {
  const { _id } = req.user;

  try {
    const result = await User.findByIdAndUpdate(
      _id,
      { avatarUrl: req.file.path },
      {
        new: true,
        fields: {
          avatarUrl: 1,
        },
      }
    );

    res.status(200).json({
      avatarUrl: result.avatarUrl,
      message: `Avatar successfully updated`,
    });
  } catch (error) {
    throw httpError(400);
  }
};

module.exports = {
  register: ctrlWrapper(registerUser),
  verify: ctrlWrapper(verify),
  reVerify: ctrlWrapper(reVerify),
  login: ctrlWrapper(loginUser),
  refresh: ctrlWrapper(userRefresh),
  current: ctrlWrapper(getCurrentUser),
  history: ctrlWrapper(getHistory),
  logout: ctrlWrapper(logout),
  updateAvatar: ctrlWrapper(updateAvatar),
};
