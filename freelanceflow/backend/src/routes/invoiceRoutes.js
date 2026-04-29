// Invoice routes.
const express = require('express');
const { protect } = require('../middleware/auth');
const { validateCreateInvoice, validateUpdateInvoice, validateCreatePayment } = require('../middleware/validate');
const invoiceService = require('../services/invoiceService');
const paymentService = require('../services/paymentService');
const { successResponse } = require('../utils/response');

const router = express.Router();
const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

router.get(
  '/',
  protect,
  asyncHandler(async (req, res) => {
    const data = await invoiceService.getAllInvoices(req.user.userId, req.query);
    return successResponse(res, 200, 'Invoices fetched', data);
  })
);

router.post(
  '/',
  protect,
  validateCreateInvoice,
  asyncHandler(async (req, res) => {
    const data = await invoiceService.createInvoice(req.user.userId, req.body);
    return successResponse(res, 201, 'Invoice created', data);
  })
);

router.get(
  '/:id',
  protect,
  asyncHandler(async (req, res) => {
    const data = await invoiceService.getInvoiceById(req.params.id, req.user.userId);
    return successResponse(res, 200, 'Invoice fetched', data);
  })
);

router.put(
  '/:id',
  protect,
  validateUpdateInvoice,
  asyncHandler(async (req, res) => {
    const data = await invoiceService.updateInvoice(req.params.id, req.user.userId, req.body);
    return successResponse(res, 200, 'Invoice updated', data);
  })
);

router.patch(
  '/:id/send',
  protect,
  asyncHandler(async (req, res) => {
    const data = await invoiceService.sendInvoice(req.params.id, req.user.userId);
    return successResponse(res, 200, 'Invoice sent', data);
  })
);

router.get(
  '/:id/pdf',
  protect,
  asyncHandler(async (req, res) => {
    const pdfBuffer = await invoiceService.generatePDF(req.params.id, req.user.userId);
    res.setHeader('Content-Type', 'application/pdf');
    return res.status(200).send(pdfBuffer);
  })
);

router.post(
  '/:id/payments',
  protect,
  validateCreatePayment,
  asyncHandler(async (req, res) => {
    const data = await paymentService.recordPayment(req.params.id, req.user.userId, req.body);
    return successResponse(res, 201, 'Payment recorded', data);
  })
);

module.exports = router;
