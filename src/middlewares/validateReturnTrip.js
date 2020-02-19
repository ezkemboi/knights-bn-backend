import JoiBase from '@hapi/joi';
import JoiDate from '@hapi/joi-date';
import models from '../db/models';

export default async (req, res, next) => {
try{
  const {
    userId, origin, destination, departureDate, returnDate, reason, accommodation
  } = req.body;

  const Joi = JoiBase.extend(JoiDate);
  let schema = Joi.object({
    origin: Joi.string().required(),
    destination:Joi.string().required(),
    departureDate: Joi.date().format('YYYY-MM-DD').required(),
    returnDate:Joi.date().format('YYYY-MM-DD').required(),
    reason: Joi.string().max(256).required(),
    accommodation: Joi.string().required(),
  })
  
    const isOriginDiffersFromDestination = (origin, destination) => {
      if( origin != destination) return true;
      else return false;
    }
    const getTodayDate = () => {
      let today = new Date();
      let dd = String(today.getDate());
      let mm = String(today.getMonth() + 1);
      let yyyy = today.getFullYear();
      return yyyy + '-' + mm + '-' + dd;
    }
    const isReturnDateValid = (departureTime, returnDate) => (returnDate > departureTime);
    
    const isTravelDateValid = async (travelDate) => {
      const todayDate = new Date(getTodayDate());
      travelDate = new Date(travelDate);
      
      if(travelDate >= todayDate){
        //check whether travelDate is set after the prev requested trip.
        const latestRequest = await models.Request.findAll({
          where : {
            requesterId: userId
          },
          limit: 1,
          order: [ [ 'returnDate', 'DESC' ]] ,    
          raw: true
         })         
         let latestRequestDate;
         if(!latestRequest.length) return true;
         else {           
           latestRequestDate = new Date(latestRequest[0].departureDate);
           if(travelDate > latestRequestDate) return true;
           else return false;
         }
      } else return false;
    }
  const { error } = schema.validate({ origin, destination, departureDate, returnDate, reason, accommodation});
  if (error) {
    res.status(422).json({
      status: res.statusCode,
      error: error.message,
    });

  } else{
    const condition1 = isOriginDiffersFromDestination(origin,destination);
    const condition2 = isReturnDateValid(departureDate,returnDate);
    const condition3 = await isTravelDateValid(departureDate);
    if(condition1 === true && condition2 === true && condition3 === false){
      res.status(422).json({
        status: res.statusCode,
        error: "Departure date should be chosen from today's date and has to not collide with your previous requested trip!",
      });
    }
    if(condition1 === true && condition3 === true && condition2 === false){
      res.status(422).json({
        status: res.statusCode,
        error: "Returning date has to be the day after your departure's date!",
      });
    }
    if(condition2 === true && condition3 === true && condition1 === false){
      res.status(422).json({
        status: res.statusCode,
        error: "Origin has to differ from destination.",
      });
    }
    if((condition1 && condition2 && condition3) === true) next();
    else (error) => {
    res.status(422).json({
      status: res.statusCode,
      error: error.message,
    });
  }
  } 
}catch(error){
  res.status(500).json({
    error: error.message,
  });
}
};
