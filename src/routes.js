import Router from 'express';
import multer from 'multer';

import authMiddleware, { privillageCheck } from './app/middlewares/auth';
import RecipientController from './app/controllers/Recipients';
import SessionController from './app/controllers/Session';
import FileController from './app/controllers/File';
import DeliverymanController from './app/controllers/Deliveryman';
import DeliveryController from './app/controllers/Delivery';
import multerConfig from './configs/multer';

const routes = Router();
const upload = multer(multerConfig);

routes.post('/session', SessionController.store);

routes.use(authMiddleware);
routes.get('/recipients', RecipientController.index);
routes.get('/recipients/:id', RecipientController.show);
routes.post('/files', upload.single('file'), FileController.store);

routes.use(privillageCheck);
routes.post('/recipients', RecipientController.store);
routes.put('/recipients/:id', RecipientController.put);
routes.delete('/recipients/:id', RecipientController.delete);

routes.get('/deliveryman', DeliverymanController.index);
routes.get('/deliveryman/:id', DeliverymanController.show);
routes.post('/deliveryman', DeliverymanController.store);
routes.put('/deliveryman/:id', DeliverymanController.update);
routes.delete('/deliveryman/:id', DeliverymanController.delete);

routes.post('/delivery', DeliveryController.store);
routes.delete('/delivery/:id', DeliveryController.delete);

export default routes;
