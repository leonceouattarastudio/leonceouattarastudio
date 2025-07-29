// Export de tous les modèles pour faciliter les imports
const User = require('./User');
const Project = require('./Project');
const BlogPost = require('./BlogPost');
const Contact = require('./Contact');
const Newsletter = require('./Newsletter');
const Appointment = require('./Appointment');
const ChatMessage = require('./ChatMessage');
const Service = require('./Service');
const TimeSlot = require('./TimeSlot');

module.exports = {
  User,
  Project,
  BlogPost,
  Contact,
  Newsletter,
  Appointment,
  ChatMessage,
  Service,
  TimeSlot
};