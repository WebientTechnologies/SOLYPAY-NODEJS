const { createTransport } = require("nodemailer")


exports.emailUser = async (to , subject , text)=>{
    const transporter =  createTransport({
        host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "216528f924c316",
    pass: "80841ec3155f40"
  }
    });

    await transporter.sendMail({to,text,subject});

}