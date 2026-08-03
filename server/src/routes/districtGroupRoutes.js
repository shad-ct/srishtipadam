const express = require('express');
const router = express.Router();
const {
  getDistrictGroups,
  createDistrictGroup,
  updateDistrictGroup,
  deleteDistrictGroup,
} = require('../controllers/districtGroupController');
const { verifyAdmin } = require('../middleware/auth');

router.route('/')
  .get(getDistrictGroups)
  .post(verifyAdmin, createDistrictGroup);

router.route('/:id')
  .put(verifyAdmin, updateDistrictGroup)
  .delete(verifyAdmin, deleteDistrictGroup);

module.exports = router;
