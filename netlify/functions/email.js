const nodemailer = require("nodemailer");

exports.handler = async (event) => {
  // Allow only POST requests
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method Not Allowed" }),
    };
  }

  try {
    // Parse the incoming request body
    const { name, email, message } = JSON.parse(event.body);

    // Validate required fields
    if (!name || !email || !message) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "All fields (name, email, message) are required." }),
      };
    }

    // Validate SMTP credentials
    if (!process.env.SMTP_USERNAME || !process.env.SMTP_PASSWORD) {
      throw new Error("SMTP credentials are missing. Check your Netlify environment variables.");
    }

    // Configure the SMTP transport using nodemailer
    const transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // Use TLS
      auth: {
        user: process.env.SMTP_USERNAME, // Gmail address
        pass: process.env.SMTP_PASSWORD, // App password
      },
    });

    // Email options
    const mailOptions = {
      from: `"${name}" <${email}>`, // Sender info
      to: process.env.SMTP_USERNAME, // Receiver (your email)
      subject: `New message from ${name}`, // Email subject
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`, // Email body
    };

    // Send the email
    const info = await transporter.sendMail(mailOptions);

    // Return success response
    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message: "Email sent successfully!", info }),
    };
  } catch (error) {
    console.error("Error sending email:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to send email. " + error.message }),
    };
  }
};
