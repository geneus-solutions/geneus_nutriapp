const jwt = require('jsonwebtoken');
const secreat = "yash"
const User = require('../models/User')
const Auth = (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'] || req.headers['Authorization'];
        console.log('authHeader : ', authHeader);

        if (!authHeader) return next(new ErrorHandler(401, "Please log in to access"));

        const token = authHeader.split(' ')[1];
        console.log('token : ', token);

        if (!token) return next(new ErrorHandler(401, "Please log in to access"));

        
        try {
            const decodedData = jwt.verify(token, secreat);
            console.log('decodedData : ', decodedData);
             if (!decodedData.id) {
            return next(new ErrorHandler(403, "Invalid token"));
        }

        
        req.user = { userId: decodedData.id };
        next();
          } catch (verifyError) {
            console.error('Token verification failed:', verifyError);
            return next(new ErrorHandler(403, "Invalid token"));
          }
       
       
    } catch (error) {
        console.log('error : ', error);
        next(new ErrorHandler(403, "Forbidden"));
    }
};



const generateAccessToken = (user) => {
  return jwt.sign({ id: user._id, email: user.email }, secreat, { expiresIn: '10m' });
};

const generateRefreshToken = (user) => {
  return jwt.sign({ id: user._id, email: user.email }, secreat , { expiresIn: '1h' });
};

const refreshTokenHandler = async (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken) return res.sendStatus(401);

    try {
        console.log('refreshToken : ', refreshToken);
        const user = await User.findOne({ refreshToken });
        if (!user) return res.sendStatus(403);

        jwt.verify(refreshToken, secreat, (err, decoded) => {
            if (err) return res.sendStatus(403);
            
            const accessToken = generateAccessToken(user);
            res.json({ accessToken });
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
module.exports = { generateAccessToken, generateRefreshToken, Auth, refreshTokenHandler };


