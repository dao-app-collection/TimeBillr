const Email = require("email-templates");
const nodemailer = require("nodemailer");
const path = require("path");

const transport = nodemailer.createTransport({
  host: "smtp-mail.outlook.com",
  secureConnection: false,
  port: 587,
  tls: {
    ciphers: "SSLv3",
  },
  auth: {
    user: "clintongillespie@outlook.com",
    pass: "clintoncunt2",
  },
});

const teamInviteEmailRender = (teamName, inviteId) => {

  const email = new Email({
    juice: true,
    juiceResources: {
      preserveImportant: true,
      webResources: path.resolve('emails')
    }
  });

  return email.render('teaminvite/teaminvite', {
    teamName: teamName,
    inviteId: inviteId,
    email: emailAddress
  })
};


const verificationEmailRender = (emailAddress, link) => {
  console.log(emailAddress);
  const email = new Email({
    juice: true,
    juiceResources: {
      preserveImportant: true,
      webResources: {
        relativeTo: path.resolve("emails"),
      },
    },
  });

  return email.render("verification/verification", {
    email: emailAddress,
    link: link,
  });
};

const shiftReminderEmailRender = (emailAddress, link) => {
  const email = new Email({
    juice: true,
    juiceResources: {
      preserveImportant: true,
      webResources: {
        relativeTo: path.resolve('emails'),
      },
    },
  });

  return email.render('reminder/newshifts', {
    // the variables to be accessed
    email: emailAddress,
  })
};

module.exports = { verificationEmailRender, shiftReminderEmailRender, teamInviteEmailRender };
