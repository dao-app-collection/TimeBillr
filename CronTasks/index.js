// schedules all cron tasks.
const ShiftReminderTask = require('./ShiftReminderTask');

const cron = require('node-cron');

cron.schedule('* 00 12 * * Saturday', ShiftReminderTask, {timezone: 'Australia/Brisbane'});

module.exports = cron;