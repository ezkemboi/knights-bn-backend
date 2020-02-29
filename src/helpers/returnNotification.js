import { config } from 'dotenv';

config();
export default (notification, url) => {
  const html = `<p> ${notification.message} click here https://${process.env.HOST_NAME}/${url} to see the changes
   </p><br><p>Modified date: ${notification.updatedAt}</p> `;

  return html;
};
