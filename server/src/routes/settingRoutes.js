const express = require('express');
const router = express.Router();
const { getSetting, updateSetting } = require('../controllers/settingController');
const { verifyAdmin } = require('../middleware/auth');

router.route('/:key')
  .get(getSetting)
  .put(verifyAdmin, updateSetting);

module.exports = router;
