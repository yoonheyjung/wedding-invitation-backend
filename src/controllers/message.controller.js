import { client } from '../config/redis.config';

const convertKst = (time) => {
  const krCurrentTime = new Date(Number(time));

  return krCurrentTime.toISOString().replace('T', ' ').substring(0, 19);
};

const shuffle = (array) => {
  return array.sort(() => Math.random() - 0.5);
};

export default {
  /**
   * 댓글리스트 출력 : 페이지네이션 x
   * @param {*} req 
   * @param {*} res 
   */
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
          totalCount: result.length ?? 0,
          data: shuffle(messageData) ?? [],
        });
      });
    } catch (error) {
      throw new Error(error);
    }
  },

  /**
   * 댓글 저장
   * 
   * @param {*} req 
   * @param {*} res 
   */
  saveComment: async (req, res) => {
    try {
      const { user, message } = req.body;
      console.log(
        `🚀 ~ saveComment: ~ user, message :`,
        user,
        new Date(),
        message,
      );

      // 1. 현재 시간(Locale)
      const now = new Date();

      // 2. UTC 시간 계산
      const utc = now.getTime() + now.getTimezoneOffset() * 60 * 1000;

      // 3. UTC to KST (UTC + 9시간)
      const KR_TIME_DIFF = 9 * 60 * 60 * 1000;
      const kst = new Date(utc + KR_TIME_DIFF);

      await client.rPush(`Messages`, `${user}:!${kst.getTime()}:!${message}`);
      res.status(200).json({ code: 2000, msg: 'Success' });
    } catch (error) {
      console.log(`🚀 ~ saveComment: ~ error:`, error);
    }
  },

  /**
   * 댓글 삭제 
   * @param {*} req 
   * @param {*} res 
   */
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
