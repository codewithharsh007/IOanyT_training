// Joi schemas and validation middleware.
const Joi = require('joi');
const { errorResponse } = require('../utils/response');

const objectId = () => Joi.string().hex().length(24);

const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: false });
  if (error) {
    const details = error.details.map((detail) => detail.message).join(', ');
    return errorResponse(res, 400, 'Validation error', details);
  }
  return next();
};

const validateRegister = validate(
  Joi.object({
    name: Joi.string().min(2).max(50).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
  })
);

const validateLogin = validate(
  Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  })
);

const validateForgotPassword = validate(
  Joi.object({
    email: Joi.string().email().required(),
  })
);

const validateResetPassword = validate(
  Joi.object({
    token: Joi.string().required(),
    newPassword: Joi.string().min(8).required(),
  })
);

const validateCreateClient = validate(
  Joi.object({
    name: Joi.string().min(2).max(100).required(),
    company: Joi.string().max(100).allow(''),
    email: Joi.string().email().required(),
    phone: Joi.string().allow(''),
    notes: Joi.string().max(500).allow(''),
  })
);

const validateUpdateClient = validate(
  Joi.object({
    name: Joi.string().min(2).max(100),
    company: Joi.string().max(100).allow(''),
    email: Joi.string().email(),
    phone: Joi.string().allow(''),
    notes: Joi.string().max(500).allow(''),
  })
);

const validateCreateProject = validate(
  Joi.object({
    name: Joi.string().min(2).max(100).required(),
    clientId: objectId().required(),
    status: Joi.string().valid('Active', 'Draft', 'OnHold'),
    description: Joi.string().max(500).allow(''),
    startDate: Joi.date().iso(),
    deadline: Joi.date().iso(),
    budget: Joi.number().min(0),
    hourlyRate: Joi.number().min(0),
  })
);

const validateUpdateProject = validate(
  Joi.object({
    name: Joi.string().min(2).max(100),
    clientId: objectId(),
    status: Joi.string().valid('Active', 'Draft', 'OnHold', 'Completed', 'Archived'),
    description: Joi.string().max(500).allow(''),
    startDate: Joi.date().iso(),
    deadline: Joi.date().iso(),
    budget: Joi.number().min(0),
    hourlyRate: Joi.number().min(0),
  })
);

const validateCreateTimeLog = validate(
  Joi.object({
    projectId: objectId().required(),
    date: Joi.date().iso().required(),
    hours: Joi.number().integer().min(0).max(23).required(),
    minutes: Joi.number().integer().min(0).max(59).required(),
    description: Joi.string().max(500).allow(''),
  })
);

const validateUpdateTimeLog = validate(
  Joi.object({
    projectId: objectId(),
    date: Joi.date().iso(),
    hours: Joi.number().integer().min(0).max(23),
    minutes: Joi.number().integer().min(0).max(59),
    description: Joi.string().max(500).allow(''),
  })
);

const validateCreateInvoice = validate(
  Joi.object({
    clientId: objectId().required(),
    projectId: objectId().allow(null, ''),
    invoiceNumber: Joi.string().allow(''),
    issueDate: Joi.date().iso().required(),
    dueDate: Joi.date().iso().required(),
    lineItems: Joi.array()
      .items(
        Joi.object({
          description: Joi.string().min(1).max(200).required(),
          quantity: Joi.number().min(0.01).required(),
          rate: Joi.number().min(0).required(),
        })
      )
      .min(1)
      .required(),
    taxPercent: Joi.number().min(0).max(100),
    notes: Joi.string().max(1000).allow(''),
    timeLogIds: Joi.array().items(objectId()),
  })
);

const validateUpdateInvoice = validate(
  Joi.object({
    clientId: objectId(),
    projectId: objectId().allow(null, ''),
    invoiceNumber: Joi.string().allow(''),
    issueDate: Joi.date().iso(),
    dueDate: Joi.date().iso(),
    lineItems: Joi.array().items(
      Joi.object({
        description: Joi.string().min(1).max(200).required(),
        quantity: Joi.number().min(0.01).required(),
        rate: Joi.number().min(0).required(),
      })
    ),
    taxPercent: Joi.number().min(0).max(100),
    notes: Joi.string().max(1000).allow(''),
    timeLogIds: Joi.array().items(objectId()),
  })
);

const validateCreatePayment = validate(
  Joi.object({
    amount: Joi.number().min(0.01).required(),
    method: Joi.string().valid('manual', 'bank_transfer', 'cash', 'cheque'),
    notes: Joi.string().allow(''),
  })
);

const validateUpdateSettings = validate(
  Joi.object({
    name: Joi.string().min(2).max(50),
    company: Joi.string().max(100).allow(''),
    notifications: Joi.object({
      emailOnInvoiceView: Joi.boolean(),
      emailOnPaymentReceived: Joi.boolean(),
      overdueInvoiceAlerts: Joi.boolean(),
      emailOnTimeLogs: Joi.boolean(),
    }),
  })
);

module.exports = {
  validateRegister,
  validateLogin,
  validateForgotPassword,
  validateResetPassword,
  validateCreateClient,
  validateUpdateClient,
  validateCreateProject,
  validateUpdateProject,
  validateCreateTimeLog,
  validateUpdateTimeLog,
  validateCreateInvoice,
  validateUpdateInvoice,
  validateCreatePayment,
  validateUpdateSettings,
};
