import models from '../db/models';

export default class allowAcess{

    static async canAccessRequest (req,res, next){
       const requestId = req.params.id;
       if(Object.keys(req.body).length === 0) return res.status(400).json({status:400, erroMessage:'You are sending empty fields'})
       const myRequest = await models.Request.findOne({where:{id:requestId}});
       const user = await models.User.findOne({where:{id:myRequest.requesterId}});
       if(parseInt(user.id,10) !== parseInt(req.user.id,10)){
        return res.status(401).json({status:401,erroMessage:'You are not authorized to access this information'})
       } else if(myRequest.status !=='pending'){
        return res.status(401).json({status:409,erroMessage:`This request was ${myRequest.status} no need to edit`})
       } 
       else{
           next();
       }
    }
}
