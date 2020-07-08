const jwt = require('jsonwebtoken');
const secret = (process.env.SECRET || 'TimeBillr');
const {User} = require('../../database/models/index');

module.exports = async (req,res,next) => {
    emailCookie = req.cookies.jwt;

    if(!emailCookie){
        console.log('valid cookie not recieved');
        res.status(403).json({error: 'Unauthorized: No Logged in User'});
    } else {
        jwt.verify(emailCookie, secret, async (err, decoded) => {
            if(err){
                res.status(401).send('Unauthorized: No logged in user');
            } else {
                // the cookie is set to expire in process.env.EXPIRY_TIME
                // check that the current time is < the expiry time
                let current = new Date().getTime() / 1000;
                if(current < decoded.exp){
                    loggedInUser = await User.findOne({where: {email: decoded.email}});
                    if(loggedInUser){
                        req.userId = loggedInUser.dataValues.id;
                        res.cookie('jwt', req.cookies.jwt);
                        next()
                    } else {
                        res.status(401).json({error: 'Unauthorized: Invalid token'});
                    }
                } else {
                    res.status(401).json({error: 'Expired JWT'});
                }
            }
        })
    }
};