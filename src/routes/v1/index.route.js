import express from 'express';
import _ from 'lodash';
import messageRoutes from './message.route';

const router = express.Router();

const defaultRoutes = [
  {
    path: '/message',
    route: messageRoutes,
  },
];

// 개발 환경만 적용되는 라우트
const devRoutes = [];

_.forEach(defaultRoutes, (route) => {
  router.use(route.path, route.route);
});

if (['development', 'staging'].includes(process.env.NODE_ENV)) {
  _.forEach(devRoutes, (route) => {
    router.use(route.path, route.route);
  });
}

export default router;
