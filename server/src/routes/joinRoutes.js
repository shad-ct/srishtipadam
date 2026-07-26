const express = require('express');
const router = express.Router();
const { createJoinRequest, getJoinRequests } = require('../controllers/joinController');
const { verifyAdmin } = require('../middleware/auth');
const { validate, joinSchema } = require('../middleware/validate');
const rateLimit = require('express-rate-limit');

const joinLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { message: 'Too many join requests created from this IP, please try again after 15 minutes' }
});

router.route('/')
  .post(joinLimiter, validate(joinSchema), createJoinRequest)
  .get(verifyAdmin, getJoinRequests);

module.exports = router;
