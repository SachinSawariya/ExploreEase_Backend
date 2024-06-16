// payment.routes.js
import { Router } from 'express';
import { createOrder, paymentVerification } from '../controllers/payment.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = Router();

router.route('/order').post(verifyJWT, createOrder);
router.route('/verify').post(paymentVerification);

export default router;
