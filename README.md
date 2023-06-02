# DeliveryAppBackend

The Node.js application allows user registration and includes routes for
handling orders, offers, and sellers. It has the capability to send emails to
clients. Currently, email sending is implemented for email verification, and
when an order is received, an email with order details is sent to the client.

The application can be launched with two commands: "yarn start:dev" for
development, which displays detailed request information in the console, and
"yarn start" to start the production server.

The application is integrated with MongoDB Atlas for database storage.

User avatars are uploaded to the Cloudinary service.

Password encryption is implemented using the bcrypt package.

Database queries are performed using Mongoose.

The core framework of the application is Express.

Joi is used for validation.

Emails are sent using Nodemailer.

Jsonwebtoken (JWT) are responsible for token management.
