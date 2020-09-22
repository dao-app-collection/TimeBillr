require("dotenv").config();
const { verificationEmailRender, shiftReminderEmailRender } = require("../Email");

let mailOptions = {
  from: '"TimeBillr" <clintongillespie@outlook.com>',
  to: "",
  subject: "hello",
  text: "",
  html: "",
};

const createVerificationEmailOptions = async (email, link) => {
  options = {
    from: '"TimeBillr" <clintongillespie@outlook.com>',
    to: `${email}`,
    subject: "Email Verification",
    text: "Verify your e-mail address",
    // html: `<p><a href='${process.env.HOSTNAME}/app/verification/${link}'>Verify your email </a></p>`
    html: await verificationEmailRender(email, link),
  };
  console.log(options);
  return Promise.resolve(options);
};

const createTeamInviteEmailOptions = (email, teamName, inviteId) => {
  return {
    from: '"TimeBillr" <clintongillespie@outlook.com>',
    to: `${email}`,
    subject: `An Invitation to join ${teamName}`,
    text: `An Invitated to join ${teamName}`,
    html: `<p><a href='${process.env.HOSTNAME}/app/invitation/${inviteId}'>An Invitation to join ${teamName}</a></p>`,
  };
};

const createShiftReminderEmail = async(email) => {
  // console.log(email);
  options = {
    from: `"TimeBillr" <clintongillespie@outlook.com`,
    to: `${email}`,
    subject: 'New Scheduled shifts!',
    text: 'Log In to view and confirm your new shifts.',
    html: await shiftReminderEmailRender(email)
  };
  // console.log(options);
  return Promise.resolve(options);
};

module.exports = {
  createVerificationEmailOptions,
  createTeamInviteEmailOptions,
  createShiftReminderEmail,
};
