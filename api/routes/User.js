const router = require('express').Router();
const controller = require('../controllers/User');
const {isAuthenticatedUser} = require('../middlewares/isAuth');


router.post('/login', controller.login)
router.post('/register',isAuthenticatedUser, controller.register)
router.get('/logout',isAuthenticatedUser, controller.logout)
router.get('/profile',isAuthenticatedUser, controller.getUserById)
router.put('/edit', isAuthenticatedUser,controller.UpdateUserById)
router.get('/getAll',isAuthenticatedUser, controller.getAllUsers)
router.delete('/delete',isAuthenticatedUser, controller.deleteUserById)



module.exports = router