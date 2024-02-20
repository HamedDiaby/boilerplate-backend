import nodemailer from 'nodemailer';

function createTransporter() {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.NODE_MAILER_EMAIL,
      pass: process.env.NODE_MAILER_PASSWORD,
    },
  });
}

export async function sendEmail(
  to: string, 
  subject: string,  
  text: string, 
) {
  
  const transporter = createTransporter();

  const mailOptions = {
    from: process.env.NODE_MAILER_EMAIL, // L'expéditeur
    to: to, // Le destinataire
    subject: subject,
    text: text,
  };

  try {
    const result = await transporter.sendMail(mailOptions);

    return {
      code: 200,
      result
    };
  } catch (error) {
    return {
      code: 500,
      error
    };
  }
}
