require('dotenv').config();
const nodemailer = require("nodemailer");

console.log("SMTP_USERNAME:", process.env.SMTP_USERNAME);
console.log("SMTP_PASSWORD:", process.env.SMTP_PASSWORD ? "Loaded" : "Missing");
if (!process.env.SMTP_USERNAME || !process.env.SMTP_PASSWORD) {
    throw new Error("SMTP credentials are missing. Check your .env file.");
}

exports.handler = async (event) => {
    if (event.httpMethod !== "POST") {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: "Method Not Allowed" }),
        };
    }

    try {
        const { name, email, message } = JSON.parse(event.body);

        if (!name || !email || !message) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: "All fields are required." }),
            };
        }

        if (!process.env.SMTP_USERNAME || !process.env.SMTP_PASSWORD) {
            throw new Error("SMTP credentials are missing. Check your .env file.");
        }

        const transporter = nodemailer.createTransport({
            service: "gmail",
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            auth: {
                user: process.env.SMTP_USERNAME,
                pass: process.env.SMTP_PASSWORD,
            },
        });

        const mailOptions = {
            from: `"${name}" <${email}>`,
            to: process.env.SMTP_USERNAME,
            subject: `Message from ${name}`,
            text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
        };

        await transporter.sendMail(mailOptions);

        return {
            statusCode: 200,
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ message: "Email sent successfully!" }),
        };
    } catch (error) {
        console.error("Error sending email:", error.message);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Failed to send email. " + error.message }),
        };
    }
};
