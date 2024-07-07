import twilio from 'twilio';

const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID, 
  process.env.TWILIO_AUTH_TOKEN,
);

export const sendWhatsAppMessage = async (
  to: string, 
  messageToSend: string,
) => {
  try {
    const message = await twilioClient.messages.create({
      from: process.env.TWILIO_WHATSAPP_NUMBER, // Votre numéro de téléphone WhatsApp Twilio
      body: messageToSend,
      to: `whatsapp:${to}` // Assurez-vous d'inclure 'whatsapp:' devant le numéro du destinataire
    });

    return {
      code: 200,
      message: 'WhatsApp message sent !',
      data: message,
    };
  } catch (error) {

    return {
      code: 200,
      message: 'Failed to send WhatsApp message !',
      data: error,
    };
  }
};
