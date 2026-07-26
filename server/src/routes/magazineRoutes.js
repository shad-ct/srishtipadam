const express = require('express');
const router = express.Router();
const { getMagazines, getMagazineById, createMagazine, updateMagazine, deleteMagazine } = require('../controllers/magazineController');
const { verifyAdmin } = require('../middleware/auth');

router.route('/')
  .get(getMagazines)
  .post(verifyAdmin, createMagazine);

router.route('/:id')
  .get(getMagazineById)
  .put(verifyAdmin, updateMagazine)
  .delete(verifyAdmin, deleteMagazine);

module.exports = router;
