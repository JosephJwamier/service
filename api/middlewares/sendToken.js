const jwt = require("jsonwebtoken");
require('dotenv').config()

exports.sendToken = (req, res, user) => {
  // create Jwt token 
  var token = jwt.sign({ user: user }, process.env.JWT_KEY,
   { expiresIn: process.env.JWT_EXPIRES_IN,}
    );
  // Options for cookie
  const options = {
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPIRES_TIME * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  req.session.isAuth = true;
  req.session.user = user;
  req.session.userAgent = req.get('User-Agent');
  req.session.token = token
  req.session.UserId = user.id

  // console.log()
  res.status(200)
    .header('auth-token', token)
    .cookie(
      "token",
      token,
      options).json({
        success: true,
        message: 'Auth successful',
        token,
        user,
        sessionID: req.sessionID,
        session: req.session
      })

}

