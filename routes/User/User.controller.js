const {User, sequelize} = require('../../database/models/index');
const Sequelize = require('sequelize');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const saltRounds = (process.env.SALTROUNDS || 10);
const secret = (process.env.SECRET || 'TimeBillr');

const UserController = {
    all(req,res){
        console.log('haha');
    },
    async register(req, res){
        console.log('hit the register route');
        console.log(User);
        console.log(req.body);
        const {name, password, email} = req.body;
        console.log(`Name: ${name}, Password: ${password}, Email: ${email}`);
        // User.create({})
        try{
            let hash = await bcrypt.hash(password, saltRounds);
            console.log(hash);
            const result = await sequelize.transaction(async t => {
                const newUser = await User.create({
                    name: name,
                    email: email,
                    password: hash,
                })
                return newUser;
            })
            
        } catch(error){
            console.log(error);
            res.status(500).send(error);
        }
        // create a jwt from the users email, as email is unique.
        const payload = {email};
        const token = jwt.sign(payload, secret, {
            expiresIn: '24h'
        });
        res.status(200).cookie('jwt', token).send();
    },
    async logIn(req, res){
       const {email, password} = req.body;

       try{
           let user = await User.findOne({where: {email: email}});
           if(!user){
               res.status(400).json({error: 'User does not exist, please sign up'});
           }else{
               
               bcrypt.compare(password, user.dataValues.password, (err, result) => {
                   if(!result){
                       res.status(401).json({error: 'Invalid Password'})
                   } else {
                       
                       const payload = {email};
                       
                       const token = jwt.sign(payload, secret, {
                        expiresIn: '24h'
                    });
                       res.status(200).cookie('jwt', token).send();
                   }
               })
           }
       } catch(error){
           console.log(error);
       }
    },
    logOut(req, res){
        console.log('haha');
    }
};

module.exports = UserController;