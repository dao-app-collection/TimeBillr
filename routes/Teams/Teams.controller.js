const db = require('../../database/models/index');
module.exports = {
    // returns all organizations that one user is a member of
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
                } else if(memberships){
                    teams = await memberships.getTeam();
                } else {
                    return [];
                }
                console.log(teams);
                return teams;
            })
            res.status(200).json(result);
        } catch (error) {
            console.log(error);
        }
    },
    // creates a new organization, with the creator as a Member with role Owner
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
    },
    // Creates a member of the organization with role = req.role,
    // Only an owner / manager can add a member
    // An owner can create a manager or a member,
    // A manager can create a member or a manager
    // An email is sent with the request to join the team
    async addMember(req,res){

    },
    // Removes a member of the organization
    // each role can only delete a member roles below them
    // Associated records remain
    async removeMember(req,res){

    },
    // When a user accepts a request to join a team,
    // this route is pinged, a new membership is created from the membership request
    async acceptRequest(req,res){

    },
    // When a user denys a request to join a team,
    // this route is pinged, the membership request is deleted.
    async denyRequest(req,res){

    }
};

