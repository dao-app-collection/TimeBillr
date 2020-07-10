const db = require('../../database/models/index');
const mailer = require('../../mailer/config');
const mailOptions = require('../../mailer/mailOptions');

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
    // creates a new organization, with the creator as a Member with permissions Owner
    async create(req, res){
        const {name, description} = req.body;

        try {
            console.log(req.userId);
            const result = await db.sequelize.transaction(async t => {
                newTeam = await db.Team.create({name: name, description: description});
                console.log(newTeam.dataValues.id);
                
                newMembership = await db.TeamMembership.create({permissions: 'owner', TeamId: newTeam.dataValues.id, UserId: req.userId});
                console.log(newMembership);
                return newTeam;
            })
            res.status(200).json(result);
        } catch (error) {
            console.log(error);
        }
    },
    // Middleware passes to this route, the permissions of the sender for this team on req.permissions
    // Creates a member of the organization with permissions = req.data.permissions
    // Only an owner / manager can add a member
    // An owner can create a manager or a member,
    // A manager can create a member or a manager
    // An email is sent with the request to join the team
    async addMember(req,res){
        if(req.permissions !== 'member'){
            try {
                const result = await db.sequelize.transaction(async t => {
                    let team = await db.Team.findOne({where: {id: req.body.teamId}});
                    let newMembershipRequest = 
                    await db.TeamMembershipRequest.create({email: req.body.email, permissions: req.body.permissions, TeamId: req.body.teamId});
                    mailer.sendMail(mailOptions.createTeamInviteEmailOptions(req.body.email, team.dataValues.name, newMembershipRequest.dataValues.id), (err, info)=>{
                        if(err){
                            console.log(err)
                        } else {
                            console.log(info.response)
                        }
                    })
                    return newMembershipRequest
                })
                res.status(200).send({success: `Invitation sent to ${req.body.email}`});
            } catch (error) {
                console.log(error);
                res.status(400).send({error: error});
            }
            
        } else {
            res.status(400).send({error: 'You can not add a new member if you are only a member of the team. You need higher permissions.'});
        }
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

