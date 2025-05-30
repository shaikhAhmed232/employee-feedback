const { Router } = require('express');
const tryCatchWrapper = require('../utils/tryCatchWrapper');
const { registerValidation, loginValidation } = require('../utils/validators');
const { validateRequest, authenticate, requireAdmin } = require('../middlewares');
const { register, login, getProfile, createAdmin } = require('../controllers/auth');

const router = Router();

router.post('/register', validateRequest(registerValidation), tryCatchWrapper(register));
router.post('/login', validateRequest(loginValidation), tryCatchWrapper(login));

router.get('/profile', authenticate, tryCatchWrapper(getProfile));

router.post('/admin', authenticate, requireAdmin, validateRequest(registerValidation), tryCatchWrapper(createAdmin));

module.exports = router;