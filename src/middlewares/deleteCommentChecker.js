import models from '../db/models';
import commentQuery from '../helpers/commentQueries';

const checkAuthorizedCommenter = async (req, res, next) => {
    
    const commenterId = req.user.id; 
    const { commentId } = req.query;
    
    const comment = await commentQuery.getComment('id', commentId);
    
  
    if (!comment) {
      return res.status(404).json({
        status: 404,
        error: 'no comment found'
      });
    }

    if (comment && !comment.isVisible) {
      return res.status(403).json({
        status: 403,
        error: 'comment Already deleted'
      });
    }

    if (comment.commenterId !== commenterId) {
      return res.status(404).json({
        status: 403,
        error: 'Not authorized: only the comment author can delete the comment'
      });
    }
    next();
};

export default checkAuthorizedCommenter;
