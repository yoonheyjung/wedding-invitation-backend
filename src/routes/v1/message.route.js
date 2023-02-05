import express from 'express';

import catchAsync from '../../middlewares/catchAsync.middleware';
import { verifyRights } from '../../middlewares/verifyRights.middleware';
import messageController from '../../controllers/message.controller';

const { findmessage, saveComment, deleteComment } = messageController;
const router = express.Router();

router.get('/', catchAsync(findComments));
router.post(
  '/',
  verifyRights('comments.writeComment'),
  catchAsync(saveComment),
);
router.delete(
  '/:commentNo',
  verifyRights('comments.deleteComment'),
  catchAsync(deleteComment),
);

export default router;
