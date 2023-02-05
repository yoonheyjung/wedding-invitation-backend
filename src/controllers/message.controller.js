/* eslint-disable spaced-comment */
import { ValidationError } from '../helpers/errors.helper';
import commentsService from '../services/comments.service';
import {
  redisClient,
  zaddRedis,
  zrangeRedis,
  zremRedis,
} from '../config/redis.config';

const {
  getNickName,
  getTotalComments,
  findCommentList,
  saveComment,
  deleteComment,
} = commentsService;
const {
  schemaCommentMessage,
  schemaComment,
  schemaType,
} = require('../config/validate.config');

export default {
  findComments: async (req, res) => {
    try {
      await schemaComment.validateAsync(req.query);
    } catch (error) {
      throw new ValidationError(4000, error.message);
    }

    const { limit, type, castCode, castId, startNo } = req.query;
    const total = await getTotalComments({ type, castId, castCode });
    let comments = {};

    if (total > 0) {
      if (type === 'channel' || type === 'live')
        comments = await findCommentList({
          type,
          castCode,
          castId,
          limit,
          startNo,
        });
      else throw new ValidationError(4000, '잘못된 타입입니다');
    }

    return res.status(200).json({
      code: 2000,
      msg: 'Success',
      data: { total, comments },
    });
  },

  saveComment: async (req, res) => {
    try {
      await schemaCommentMessage.validateAsync(req.body);
    } catch (error) {
      throw new ValidationError(4000, error.message);
    }

    if (process.env.NODE_ENV === 'test') {
      req.token = JSON.parse(req.headers.token);
    } else {
      /** NOTE: boilerplate에는 일반 유저 login 구현이 안되어있어 추가했습니다. **/
      req.token = { userNo: '140', userId: 'cheez.sian@gmail.com' };
    }

    const { userNo, userId } = req.token;
    const { type, castId, castCode } = req.body;
    const { message } = req.body;
    const nickName = await getNickName({ userNo, userId });

    if (type === 'channel' && !castId) {
      throw new ValidationError(4000, 'chaneelCode 누락');
    }
    if (type === 'live' && !castCode) {
      throw new ValidationError(4000, 'castCode 누락');
    }

    await saveComment({ type, userNo, castId, castCode, nickName, message });

    return res
      .status(200)
      .json({ code: 2000, msg: 'Success', data: { message } });
  },

  deleteComment: async (req, res) => {
    try {
      await schemaType.validateAsync(req.query);
    } catch (error) {
      throw new ValidationError(4000, error.message);
    }

    if (process.env.NODE_ENV === 'test') {
      req.token = JSON.parse(req.headers.token);
    } else {
      /** NOTE: boilerplate에는 일반 유저 login 구현이 안되어있어 추가했습니다. **/
      req.token = { userNo: '140', userId: 'cheez.sian@gmail.com' };
    }

    const { userNo } = req.token;
    const { commentNo } = req.params;
    const { type } = req.query;
    const affectedRows = await deleteComment({ type, userNo, commentNo });

    if (affectedRows === 0) {
      return res.status(404).json({ code: 4041, msg: '이미 삭제되었습니다.' });
    }

    return res.status(200).json({ code: 2000, msg: 'Success' });
  },
};
