const nodemailer = require("nodemailer");

const email = async (email, subject, body) => {
    try {

        let transporter = nodemailer.createTransport({
            service: "Yahoo",
            auth: {
                user: "rohit.bhagat27@yahoo.com",
                pass: "xvdwlznadtziyjnl",
            },
        });
        const mailOptions = {
            from: '"Rohit Bhagat 👻" <rohit.bhagat27@yahoo.com>', // sender address
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
