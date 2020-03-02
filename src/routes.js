import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import RecipientController from './app/controllers/RecipientController';
import FileController from './app/controllers/FileController';
import SignatureController from './app/controllers/SignatureController';
import DeliverymanController from './app/controllers/Deliveryman';
import OrderController from './app/controllers/OrderController';
import DeliveryStart from './app/controllers/DeliveryStart';
import DeliveryDone from './app/controllers/DeliveryDone';
import DeliveryShow from './app/controllers/DeliveryShow';
import DeliveryProblemController from './app/controllers/DeliveryProblemController';
import CancelDeliveryController from './app/controllers/CancelDeliveryController';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();
const upload = multer(multerConfig);

routes.post('/sessions', SessionController.store);
routes.get('/deliveryshow/:id', DeliveryShow.index);

routes.post('/delivery/:order_id/problems', DeliveryProblemController.store);

routes.use(authMiddleware);

routes.post('/users', UserController.store);
routes.put('/users', UserController.update);

routes.post('/recipients', RecipientController.store);
routes.put('/recipients/:id', RecipientController.update);
routes.delete('/recipients/:id', RecipientController.delete);

routes.post('/files', upload.single('file'), FileController.store);
routes.post('/signatures', upload.single('file'), SignatureController.store);

routes.post('/deliveryman', DeliverymanController.store);
routes.put('/deliveryman', DeliverymanController.update);
routes.delete('/deliveryman/:id', DeliverymanController.delete);

routes.get('/orders/:id', OrderController.index);
routes.post('/orders', OrderController.store);
routes.put('/orders/:id', OrderController.update);
routes.delete('/orders/:id', OrderController.delete);

routes.put('/delivery/start/:deliveryman_id/:order_id', DeliveryStart.update);
routes.put('/delivery/done/:deliveryman_id/:order_id', DeliveryDone.update);

routes.delete(
  '/problem/:order_id/cancel-delivery',
  CancelDeliveryController.delete
);

export default routes;
