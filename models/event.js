// import mongoose from 'mongoose';

// const eventSchema = new mongoose.Schema({
//   eventType: { type: String, required: true },
//   eventCategory: { type: String, required: true },
//   eventSubcategory: { type: String },
//   venueName: { type: String, required: true },
//   venueAddress: { type: String, required: true },
//   date: { type: Date, required: true }, 
//   time: { type: String, required: true },
//   images: { type: [String], required: true },
//   description: { type: String, required: true },
//   fees: { type: Number, required: true },
//   interests: { type: [String], required: true },
//   createdBy: { type: String, required: true },
//   creatorProfilePic: { type: String, required: true }, 
//   creatorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//   createdAt: { type: Date, default: Date.now }
// });

// const Event = mongoose.model('Event', eventSchema);

// export default Event;





import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  eventType: String,
  eventCategory: String,
  eventSubcategory: String,
  venueName: String,
  venueAddress: String,
  date: Date,
  time: String,
  images: [String],
  description: String,
  fees: Number,
  interests: [String],
  createdBy: String,
  creatorProfilePic: String,
  creatorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});

const Event = mongoose.model('Event', eventSchema);
export default Event;

