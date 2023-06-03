const router = require('express').Router();
const controller = require('../controllers/Session');
const { isAuthenticatedUser } = require('../middlewares/isAuth');

router.get('/getAll/',isAuthenticatedUser, controller.getAllSessionsByUser)
router.delete('/delete/',isAuthenticatedUser, controller.deleteSession)
router.delete('/deleteAll/',isAuthenticatedUser, controller.deleteAllSession)

module.exports = router