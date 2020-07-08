const app = require('./config');

const application = require('./config');

const UserRouter = require('./routes/User/User');
const TeamsRouter = require('./routes/Teams/Teams');

application.use('/api/user', UserRouter);
application.use('/api/teams', TeamsRouter);


application.get('/verification', (req, res) => {
    res.sendFile(__dirname + '/views/verification.html');
});

application.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/landing.html');
});

application.get('/*', (req, res) => {
    res.sendFile(__dirname + '/frontend/build/index.html');
});

application.listen(8080);