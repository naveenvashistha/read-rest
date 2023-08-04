const nodemailer = require("nodemailer");
const handlebars = require("handlebars");
const fs = require("fs");
const path = require("path");

const sendEmail = async (email,payload)=>{
  try{
    const source = fs.readFileSync(path.join(__dirname, "template.handlebars"), "utf8");
    const compiledTemplate = handlebars.compile(source);
    let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      type: 'OAuth2',
      user: process.env.MAIL_USERNAME,
      pass: process.env.MAIL_PASSWORD,
      clientId: process.env.OAUTH_CLIENT_ID,
      clientSecret: process.env.OAUTH_CLIENT_SECRET,
      refreshToken: process.env.REFRESH_TOKEN
    }
  });

  let mailOptions = {
    from: process.env.MAIL_USERNAME,
    to: email,
    subject: 'Password Reset',
    html: compiledTemplate(payload),
  };
  await transporter.sendMail(mailOptions);
  return true;
}catch(error){
    console.log(error);
    return false;
}
}

module.exports = sendEmail;
