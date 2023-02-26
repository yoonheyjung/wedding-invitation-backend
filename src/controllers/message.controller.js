/* eslint-disable spaced-comment */
import { client } from '../config/redis.config';

const convertKst = (time) => {
  // UTC to KST (UTC + 9시간)
  const KR_TIME_DIFF = 9 * 60 * 60 * 1000;
  const kr_curr = new Date(Number(time) + KR_TIME_DIFF);

  return kr_curr.toISOString().replace('T', ' ').substring(0, 19);
};

export default {
  findmessage: async (req, res) => {
    try {
      const messageData = [];

      await client.lRange(`Messages`, 0, -1, (err, result) => {
        if (err) throw err;

        for (let j = 0; j < result.length; j++) {
          const data = result[j].split(':!');
          for (let i = 0; i < data.length; i++) {
            messageData[j] = {
              name: data[0],
              createdAt: convertKst(data[1]),
              message: data[2],
            };
          }
        }

        res.status(200).json({
          code: 2000,
          msg: 'Success',
          totalCount: result.length,
          data: messageData,
        });
      });
    } catch (error) {
      throw new Error(error);
    }
  },

  saveComment: async (req, res) => {
    const { user, message } = req.body;
    console.log(`🚀 ~ saveComment: ~ user, message :`, user, message);

    // 1. 현재 시간(Locale)
    const now = new Date();

    // 2. UTC 시간 계산
    const utc = now.getTime() + now.getTimezoneOffset() * 60 * 1000;

    // 3. UTC to KST (UTC + 9시간)
    const KR_TIME_DIFF = 9 * 60 * 60 * 1000;
    const kst = new Date(utc + KR_TIME_DIFF);

    await client.rPush(
      `Messages`,
      `${user}:!${password}:!${kst.getTime()}:!${message}`,
    );
    res.status(200).json({ code: 2000, msg: 'Success', data: { message } });
  },

  deleteComment: async (req, res) => {
    const { userNo } = req.token;
    const { commentNo } = req.params;
    const { type } = req.query;
    const affectedRows = await deleteComment({ type, userNo, commentNo });

    if (affectedRows === 0) {
      res.status(404).json({ code: 4041, msg: '이미 삭제되었습니다.' });
    }

    res.status(200).json({ code: 2000, msg: 'Success' });
  },
};
