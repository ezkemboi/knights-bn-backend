import nodemailer from 'nodemailer';
import models from '../db/models';
import html from '../helpers/returnNotification';
import { config} from 'dotenv'; 
config();
export const  editEventHandler = async (data) => {
try{
  const { userId, title, managerId, id } = data;
  const user = await models.User.findOne({ where: { id: managerId } }); 

  const subUrl = `api/v1/view/request/${id}`;
   const notification = await models.Notification.create({
      requesterId: userId,
      managerId,
      status: 'non_read',
      message: `${title} request is modified `,
      type: 'new_request'
    });
    const notifications = await models.Notification.findAll({ where: { managerId } });
     data.res.status(200).send({status:200, badge: notifications.length, notify:html(notification, subUrl) });
    
        const transporter = nodemailer.createTransport({
          service: process.env.MAIL_SERVICE,
          host: process.env.MAIL_HOST,
          auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS,
          }
        });
        const mailOptions = {
          to: `${user.email}`,
          subject: `${title} request is modified`,
          html:html(notification, subUrl),
        }; 
    
       await transporter.sendMail(mailOptions)
      } catch(error){
        return console.log({status:500,error, errorMessage:'email service fails to work'});
      }
  
  };
  

  