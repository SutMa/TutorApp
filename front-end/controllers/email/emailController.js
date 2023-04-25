import { createDoc } from "../firebaseCrud";

const MAIL_COLLECTION = 'mail';

export const sendEmail = async (to, subject, html) => {
  console.log('here');
  
  const appendSubject = `Tutor4330 App: ${subject}`;

  const emailData = {
    to,
    message: {
      subject: appendSubject,
      html,
    }
  };

  await createDoc(MAIL_COLLECTION, emailData); 
}
