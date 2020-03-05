import models from '../db/models';

export default class commentController {

    static async createComment(req,res) {
        try{
    
          const commenterId = req.user.id; 
          const { comment } = req.body;
          const { requestId } = req.query;
          
              const newComment = await models.Comment.create({
                commenterId,
                requestId,
                comment,
              });

              if(newComment){
              return res.status(201).json({
                  status: 201,
                  message: `comment successfully added`,
              })
            }
        } 
        catch(error){
            return res.status(500).json({
                error: error,
                })
            }
      }

      static async deleteComment(req, res) {
        
        const commenterId = req.user.id; 
        const { commentId } = req.query;
    
        await models.Comment.update({ isVisible: false }, {
          where: { id: commentId },
          returning: true,
          plain: true
        });
    
        return res.status(200).json({
          status: 200,
          message: 'Comment deleted successfully!'
        });
    }
    }
