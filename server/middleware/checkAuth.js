const jwt = require('jsonwebtoken');
const User = require('../model/employee');


const Authenticate = async (req, res, next) => {
    try {
        //get cookie
        const token = req.cookies.jwtLogin;
        // console.log('token', token);

        //verify token 
        const verifyToken = jwt.verify(token, process.env.SECRET_KEY)
        
        //find the authenticateuser
        const authenticateUser = await User.findOne({ _id: verifyToken._id, "Token.token": token })

        if (!authenticateUser) {
            throw new Error('User not found')
        }
        req.token = token;
        req.authenticateUser = authenticateUser;
        req.userId = authenticateUser._id;

        next();
    }
    catch (err) {
        res.status(401).send('Unauthorized: No token Provided');
        console.log(err)
    }

}

module.exports = Authenticate;