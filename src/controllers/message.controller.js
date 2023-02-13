/* eslint-disable spaced-comment */
import { ValidationError } from '../helpers/errors.helper';
import { rpushAsync, lrangeAsync } from '../config/redis.config';

export default {
  findmessage: async (req, res) => {
    const { limit, offset } = req.query;
    console.log(`🚀 ~ findmessage: ~ limit, offset `, limit, offset);

    const result = await lrangeAsync(`Messages`, 0, -1);
    await expireRedis(`Messages:${castCode}:${targetUserId}`, 60 * 60 * 48);
    console.log(`🚀 ~ findmessage: ~ result`, result);

    return res.status(200).json({
      code: 2000,
      msg: 'Success',
      data: { total, comments },
    });
  },

  saveComment: async (req, res) => {
    const { user } = req.query;
    const { password, message } = req.body;

    // 1. 현재 시간(Locale)
    const now = new Date();

    // 2. UTC 시간 계산
    const utc = now.getTime() + now.getTimezoneOffset() * 60 * 1000;

    // 3. UTC to KST (UTC + 9시간)
    const KR_TIME_DIFF = 9 * 60 * 60 * 1000;
    const kst = new Date(utc + KR_TIME_DIFF);

    const result = await rpushAsync(
      `Messages`,
      `${user}:${password}:${kst}:${message}`,
    );

    console.log(`🚀 ~ saveComment: ~ result`, result);

    return res
      .status(200)
      .json({ code: 2000, msg: 'Success', data: { message } });
  },

  deleteComment: async (req, res) => {
    // try {
    //   await schemaType.validateAsync(req.query);
    // } catch (error) {
    //   throw new ValidationError(4000, error.message);
    // }

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
