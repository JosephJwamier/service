const Session = require("../models//Session");



//* get all sessions by User done || logger done
exports.getAllSessionsByUser = async (req, res) => {
    try {
        const id = req.query.userId;
        const options = {
            page: req.query.page ? parseInt(req.query.page) : 1, // Default 1
            paginate: req.query.paginate ? parseInt(req.query.paginate) : 25, // Default 25
            where: {
                UserId: id
            }
        }
        const sessions = await Session.paginate(options)
        res.send({
            success: true,
            message: `sessions for user with id= ${id} info`,
            sessions
        });
    } catch (err) {
       
        res.send({
            success: false,
            message: err.message
        });
    }
}

//* delete session by id with logger done //
exports.deleteSession = async (req, res) => {
    try {
        const id = req.query.sessionId
        
        const session = await Session.destroy({
            where: {
                sid: id,
            }
        })
        if (session == 1) {
            
            res.send({
                success: true,
                message: `session with id=${id} was deleted successfully!`,
            });
        } else {
            
            res.send({
                success: false,
                message: `Cannot delete session with id=${id} . Maybe Session was not found!`,
            });
        }

    } catch (err) {
       
        res.send({
            success: false,
            message: err.message
        })
    }
}


//* delete sessions with loggers done //
exports.deleteAllSession = async (req, res) => {
    try {
        const id = req.query.userId
        const session = await Session.destroy({
            where: {
                UserId: id,
            }
        })
        if (session) {
           
            res.send({
                success: true,
                message: `session with user id=${id} was deleted successfully!`,
            });
        } else {
            
            res.send({
                success: false,
                message: `Cannot delete sessions with user id=${id} . Maybe Session was not found!`,
            });
        }

    } catch (err) {
        
        res.send({
            success: false,
            message: err.message
        })
    }
}
