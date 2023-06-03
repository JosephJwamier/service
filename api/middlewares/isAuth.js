const jwt = require('jsonwebtoken');
const Session = require('../models/Session');
const User = require('../models/User');



exports.isAuthenticatedUser = async (req, res, next) => {
    try {
        const token = req.header('token')
        if (!token) {
            return res.send({ success: false, message: 'Login first ' })
        }
        jwt.verify(token, process.env.JWT_KEY, async (err, decoded) => {
            if (err) {
                return res.send({
                    success: false, message: err.message
                })
            }
            const checkUserId = await User.findOne({
                where: { id: decoded.user.id }
            })
            if (!checkUserId) {
                return res.send({ success: false, message: 'Login first ' })
            }
            req.user = decoded.user;
            next()
        });

    } catch (err) {
        
        res.send(err.message)
    }

}


