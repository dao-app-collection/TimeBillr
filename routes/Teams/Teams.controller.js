const db = require('../../database/models/index');
module.exports = {
    async findAll (req, res){
        console.log('in Find All')
        console.log(req.userId);
        try {
            const result = await db.sequelize.transaction(async t => {
                memberships = await db.TeamMembership.findAll({where: {UserId: req.userId}})
                console.log(memberships);
                let teams;
                if(memberships.length > 0){
                    teams = await Promise.all( memberships.map(async membership => {
                        return  membership.getTeam();
                    }));
                } else {
                    teams = await memberships.getTeam();
                }
                console.log(teams);
                return teams;
            })
            res.status(200).json(result);
        } catch (error) {
            console.log(error);
        }
    },
    async create(req, res){
        const {name, description} = req.body;

        try {
            console.log(req.userId);
            const result = await db.sequelize.transaction(async t => {
                newTeam = await db.Team.create({name: name, description: description});
                console.log(newTeam.dataValues.id);
                
                newMembership = await db.TeamMembership.create({role: 'Owner', TeamId: newTeam.dataValues.id, UserId: req.userId});
                console.log(newMembership);
                return newTeam;
            })
            res.status(200).json(result);
        } catch (error) {
            console.log(error);
        }
    }
};

