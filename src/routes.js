import Router from 'express';

import authMiddleware, { privillageCheck } from './app/middlewares/auth';
import RecipientController from './app/controllers/Recipients';
import SessionController from './app/controllers/Session';

const routes = Router();

routes.post('/session', SessionController.store);

routes.use(authMiddleware);
routes.get('/recipients', RecipientController.index);
routes.get('/recipients/:id', RecipientController.show);

routes.use(privillageCheck);
routes.post('/recipients', RecipientController.store);
routes.put('/recipients/:id', RecipientController.put);
routes.delete('/recipients/:id', RecipientController.delete);

export default routes;
