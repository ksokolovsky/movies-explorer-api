const express = require('express');

const router = express.Router();
const {
  updateProfile, getCurrentUser,
} = require('../controllers/users');
const { updateProfileSchema } = require('../middlewares/validationSchemas');

router.get('/me', getCurrentUser);
router.patch('/me', updateProfileSchema, updateProfile);

module.exports = router;
