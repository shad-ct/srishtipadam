const express = require('express');
const router = express.Router();
const { getCommitteeMembers, createCommitteeMember, updateCommitteeMember, deleteCommitteeMember } = require('../controllers/committeeController');
const { verifyAdmin } = require('../middleware/auth');

router.route('/')
  .get(getCommitteeMembers)
  .post(verifyAdmin, createCommitteeMember);

router.route('/:id')
  .put(verifyAdmin, updateCommitteeMember)
  .delete(verifyAdmin, deleteCommitteeMember);

module.exports = router;
