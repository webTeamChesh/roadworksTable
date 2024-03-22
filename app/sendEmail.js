const sendEmail = (transporter, subject, text, EMAIL, TO) => {
  const mailOptions = { from: EMAIL, to: TO, subject, text };
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
};

export { sendEmail };
