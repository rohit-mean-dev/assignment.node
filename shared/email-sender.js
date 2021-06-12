const nodemailer = require("nodemailer");

const email = async (email, subject, body) => {
    try {

        let transporter = nodemailer.createTransport({
            service: "Yahoo",
            auth: {
                user: process.env.EMAIL_ID,
                pass: process.env.EMAIL_PASSWORD,
            },
        });
        const mailOptions = {
            from: `"Rohit Bhagat 👻" <${process.env.EMAIL_ID}>`, // sender address
            to: email, // list of receivers
            subject: subject, // Subject line
            html: body, // html body
        };
        let info = await transporter.sendMail(mailOptions);
        return info;

    } catch (error) {
        throw error;
    }

}

module.exports = { email };

// main().catch(console.error);
