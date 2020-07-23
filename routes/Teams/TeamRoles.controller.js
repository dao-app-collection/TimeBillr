const db = require("../../database/models/index");
const mailer = require("../../mailer/config");
const mailOptions = require("../../mailer/mailOptions");

const { ErrorHandler } = require("../Middleware/ErrorHandler");
const { sequelize } = require("../../database/models/index");

const TeamRolesController ={
    async create (req,res){
        console.log('in the team roles create route');
        console.log(req.body);
        console.log(db.TeamRoles);
        console.log(req.body.casualRate === 16.50);
        let {TeamId, title, casualRate, partTimeRate, fullTimeRate} = req.body;

        casualRate = parseFloat(casualRate);
        console.log(casualRate);
        console.log(casualRate === 16.50);


        try {
            let newRole= await db.TeamRoles.create({
                TeamId:  TeamId,
                title: title,
                casualRate:  parseFloat(casualRate),
                partTimeRate:  parseFloat(partTimeRate),
                fullTimeRate: parseFloat(fullTimeRate),
            });

            newRole.title = title;
            newRole.casualRate = parseFloat(casualRate);
            newRole.partTimeRate = parseFloat(partTimeRate);
            newRole.fullTimeRate = parseFloat(fullTimeRate);
            newRole.save();

            console.log(newRole);
            res.status(200).send({success: `The role ${newRole.title} has been added`});
        } catch (error) {
            
        }
    },

    async delete(){

    },

    async update(){

    }
};

module.exports = TeamRolesController;