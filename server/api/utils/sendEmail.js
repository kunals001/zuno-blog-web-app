import "dotenv/config";
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";


const ses = new SESClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});


export const sendEmail = async ({ to, subject, html }) => {
  const params = {
    Source: "your-verified-email@example.com", 
    Destination: {
      ToAddresses: [to],
    },
    Message: {
      Subject: {
        Data: subject,
      },
      Body: {
        Html: {
          Data: html,
        },
      },
    },
  };

  try {
    const command = new SendEmailCommand(params);
    const response = await ses.send(command);
    return response;
  } catch (error) {
    console.error("Email sending failed:", error);
    throw error;
  }
};
