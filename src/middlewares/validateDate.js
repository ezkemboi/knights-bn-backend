import BaseJoi from 'joi';
import Extension from 'joi-date-extensions';
import models from '../db/models';
const Joi = BaseJoi.extend(Extension);
export const tripInformation = (req, res, next) => {
  const schema = Joi.object({
    origin: Joi.string().required(),
    destination: Joi.string().required(),
    accommodation: Joi.string().required(),
    type: Joi.string().required(),
    reason: Joi.string().required(),
    passportNumber: Joi.string().required(),
    departureDate: Joi.date().format('YYYY-MM-DD').required(),
    returnDate: Joi.date().format('YYYY-MM-DD').min(Joi.ref('departureDate')).required(),
    cities: Joi.required(),
  });
  const { error } = Joi.validate(req.body, schema);
  if (error) {
    return res.status(400).json({
      status: 400,
      error: error.details[0].message
    });
  }
  return next();
};

export const multicity = (req, res, next) => {
  const returnDate = new Date(req.body.returnDate);
  const schema = Joi.object({
    name: Joi.string().required(),
    from: Joi.date().format('YYYY-MM-DD').required(),
    to: Joi.date().format('YYYY-MM-DD').min(Joi.ref('from')).max(returnDate).required(),
  });
  let errors = [];
  if(typeof req.body.cities !== 'undefined'){
    req.body.cities.forEach((city)=>{
      const { error } = Joi.validate(city, schema);
      if (error) {
       errors.push(error);
      }
    });

    if(errors.length>0){
      return res.status(400).json({
        status: 400,
        error: 'Make sure that your to date is equal to return date and greater than from date'
      });
    }
  }

  next();
};

export const checkIfRequestExists = async(req, res, next) => {
 const request = await models.Request.findAll({ where: { requesterId: req.user.id } });
 if(request.length===0){
 next();
 }
 const pendingRequest = [];
 request.forEach((request) => {
     if(request.status === 'pending' ){
       pendingRequest.push(request);
    }
});

if(pendingRequest.length!==0){
   return res.status(409).json({satatus:409,error:'You still have pending request just wait for approval'})
}
};

export const validateRequestDate = (req,res,next) => {
 const insertedDate = new Date(req.body.returnDate);
  if (insertedDate.getFullYear() < new Date().getFullYear()|| insertedDate.getFullYear() > new Date().getFullYear()+2) {
    return res.status(400).json({ status: 400, error: 'Make sure that the date you choose is near by this year' });
  }
  next();
};


export const validateCityDate = (req,res,next) => {
  let errors = [];
  if(typeof req.body.cities !== 'undefined'){
    req.body.cities.forEach((city)=>{
      const insertedDate = new Date(city.to);
      if (insertedDate.getFullYear() < new Date().getFullYear()|| insertedDate.getFullYear() > new Date().getFullYear()+2) {
         errors.push(insertedDate.getFullYear())
      }
    });
    if(errors.length>0){
      return res.status(400).json({
        status: 400,
        error: 'to and from have to be correct dates please'
      });
    }
  }
  
  
  next();
};
