// const app = require("./config");
const {
  handleError,
  ErrorHandler,
} = require("./routes/Middleware/ErrorHandler");

const application = require("./config");

const UserRouter = require("./routes/User/User");
const TeamsRouter = require("./routes/Teams/Teams");
const EmployeeRouter = require('./routes/Employee/Employee');

const CronTasks = require('./CronTasks/index');

application.use("/api/user", UserRouter);
application.use("/api/teams", TeamsRouter);
application.use('/api/employee', EmployeeRouter);

application.use((err, req, res, next) => {
  console.log(
    "||||||||||||||||||||||||||||||||||in error handler middleware |||||||||||||||||||||||||||||||||||||||||||"
  );
  console.log(err);
  console.log("An error has been thrown");
  handleError(err, res);
});

application.get("*", (req, res) => {
  res.sendFile(__dirname + "/frontend/build/index.html");
});

application.listen(8080);

module.exports = application;
