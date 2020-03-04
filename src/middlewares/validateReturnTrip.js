import models from '../db/models';
import getTodayDate from '../utils/getTodayDate';
import {editRequestSchema, createTwoWayTripSchema} from '../utils/validationSchemas';
import isObjectEmpty from '../utils/isObjectEmpty';

let conflictingTripRequest;

export default async (req, res, next) => {
try{
  let schema;
  let address;
  const {
    id, origin, destination, departureDate, returnDate, reason, accommodation
   } = req.body;
   const todayDate = new Date(getTodayDate());
   let reqDepartureDate = new Date(departureDate);
   let reqReturnDate = new Date(returnDate);


   const urlSections = req.urlPathSections;
   if(urlSections)
    address = urlSections[urlSections.length -2 ] || null;
   
   if(address === 'edit') {
    const isRequestEmpty = isObjectEmpty(req.body);    
    if(isRequestEmpty === true) throw('Empty request');
    else schema = editRequestSchema;
    } else schema = createTwoWayTripSchema;
   
   const { error } = schema.validate({ origin, destination, departureDate, returnDate, reason, accommodation});
   
    if (error) throw error;
    else if(origin === destination) throw 'similar origin and destination';
    else if(reqReturnDate < reqDepartureDate) throw 'departureDate > returnDate' ;
    else if(reqDepartureDate < todayDate) throw 'past departure date' ; 
    else if(departureDate || returnDate){
    const requests = await models.Request.findAll({
          where : {
            requesterId: req.user.id
          },raw: true
        })  
        let totalRequests = requests.length;

      for(let index = 0; index < totalRequests; index ++){
  
        if( ((requests[index].departureDate <= reqDepartureDate) && ( reqDepartureDate <= requests[index].returnDate))
              || ((requests[index].departureDate <= reqReturnDate) && ( reqReturnDate <= requests[index].returnDate))){
          if(requests[index].type === 'one_way'){
            let { createdAt, updatedAt, returnDate, cities, ...otherTripInfo} = requests[index];
            conflictingTripRequest = otherTripInfo;
          }
          else if(requests[index].type === 'two_way'){
            let { createdAt, updatedAt, cities, ...otherTripInfo} = requests[index];
            conflictingTripRequest = otherTripInfo;
          }
          else if(requests[index].type === 'multi_way'){
            let { createdAt, updatedAt, ...otherTripInfo} = requests[index];
            conflictingTripRequest = otherTripInfo;
          }
          throw 'conflicting trip' ;          
        }
      }
  }
  next();
 } catch(error){ 
    
  if(error === 'Empty request'){
    return res.status(200).json({
      error: 'Empty request body.'
    })
  }
  else if(error.name === 'ValidationError'){
      return res.status(422).json({
       status: res.statusCode,
       error: error.message,
     });
  }
  else if(error === 'similar origin and destination'){
    return res.status(422).json({
        status: res.statusCode,
        error: "Origin has to differ from destination.",
      });
}
else if(error === 'departureDate > returnDate'){
  return res.status(422).json({
          status: res.statusCode,
          error: "Returning date has to be the day after your departure's date!",
        });
}
else if(error === 'past departure date'){
  return res.status(422).json({
    status: res.statusCode,
    error: "Please select travel date starting from today.",
  });
}
else if(error === 'conflicting trip'){
  return res.status(422).json({
    status: res.statusCode,
    error: 'conflicting trip request.',
    conflictingTripRequest
  });
}
else {
  return res.status(500).json({
    error: error.message,
  });
}
  }
};
