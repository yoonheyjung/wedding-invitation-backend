import { AuthenticationError } from '../../helpers/errors.helper';

// eslint-disable-next-line import/prefer-default-export
export const requireAuth = (req, res, next) => {
  if (!req.currentUser) {
    throw new AuthenticationError('로그인 혹은 회원가입을 진행해주세요', 4010);
  }
  next();
};
