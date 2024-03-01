import twilio from 'twilio';

const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID, 
  process.env.TWILIO_AUTH_TOKEN,
);

export const sendSMS = async (to: string, messageToSend: string) => {
  try {
    const message = await twilioClient.messages.create({
      body: messageToSend,
      from: process.env.TWILIO_PHONE_NUMBER, // Votre numéro de téléphone Twilio
      to: to // Le numéro de téléphone du destinataire
    });

    return {
      code: 200,
      message: 'Message sent!',
      data: message,
    };
  } catch (error) {
    
    return {
      code: 200,
      message: 'Failed to send SMS!',
      data: error,
    };
  }
};
