import mongoose from 'mongoose';
import messageSchema from "../models/Message"     // Importing the schema from message.js

const channelSchema = new mongoose.Schema({
  name: { type: String, required: [true, "field is required"] },
  messages: [messageSchema]
});

const Channel = mongoose.model('Channel', channelSchema);

module.exports = Channel;



