import express from 'express';
import catchAsync from '../../middlewares/catchAsync.middleware';
import messageController from '../../controllers/message.controller';

const { findmessage, saveComment, deleteComment } = messageController;
const router = express.Router();

router.get('/', catchAsync(findmessage));
router.post('/', catchAsync(saveComment));
router.delete('/:commentNo', catchAsync(deleteComment));

export default router;
