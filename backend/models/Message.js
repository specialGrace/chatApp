import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  content: { type: String, required: [true, "field is required"] },
  userId: { type: String, required: [true, "field is required"] },
  channelId: { type: String, required: [true, "field is required"] },
  timestamp: true
});


const Message = mongoose.model('Message', messageSchema);

module.exports = Message;

