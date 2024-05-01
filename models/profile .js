

module.exports = function (Schema) {
  const Profile = new Schema({
    _id: {
      type: String,
      default: uuidv4(),
    },
    userId: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['Explorer', 'Creator'],
      required: true,
    },
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    username: {
      type: String,
      unique: true,
    },
    interestedCategories: {
      type: [String],
    },
    isPrivateProfile: {
      type: Boolean,
    },
    isProfilePhotoUploaded: {
      type: Boolean,
    },
    isBannerUploaded: {
      type: Boolean,
    },
    socialLinks: {
      linkedin: {
        type: String,
      },
      instagram: {
        type: String,
      },
      facebook: {
        type: String,
      },
      twitter: {
        type: String,
      },
      pinterest: {
        type: String,
      },
      personal: {
        type: String,
      },
    },
  }, { timestamps: true });

  return Profile;
};