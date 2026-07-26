const express = require('express');
const router = express.Router();
const { getEvents, createEvent, updateEvent, deleteEvent } = require('../controllers/eventController');
const { verifyAdmin } = require('../middleware/auth');

router.route('/')
  .get(getEvents)
  .post(verifyAdmin, createEvent);

router.route('/:id')
  .put(verifyAdmin, updateEvent)
  .delete(verifyAdmin, deleteEvent);

module.exports = router;
