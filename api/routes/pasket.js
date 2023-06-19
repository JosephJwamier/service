const router = require('express').Router();
const controller = require('../controllers/pasket');
const {isAuthenticatedUser} = require('../middlewares/isAuth');


router.post("/add",isAuthenticatedUser,controller.create);
router.delete("/delete",isAuthenticatedUser,controller.deleteItemsById);


module.exports = router;