const { z } = require('zod');

const validate = (schema) => (req, res, next) => {
  try {
    req.body = schema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400);
      throw new Error(error.errors.map(e => e.message).join(', '));
    }
    next(error);
  }
};

const orderSchema = z.object({
  bookId: z.string().min(1, 'Book ID is required'),
  fullName: z.string().min(1, 'Full name is required'),
  mobile: z.string().min(10, 'Mobile number must be valid'),
  address: z.string().min(1, 'Address is required'),
  notes: z.string().optional()
});

const joinSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  district: z.string().min(1, 'District is required'),
  mobile: z.string().min(10, 'Mobile number must be valid'),
  reason: z.string().min(1, 'Reason is required')
});

module.exports = { validate, orderSchema, joinSchema };
