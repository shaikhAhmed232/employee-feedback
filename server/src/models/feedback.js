const mongoose = require('mongoose');
const { Schema } = mongoose;

const feedbackSchema = new Schema(
  {
    feedback: {
      type: String,
      required: [true, 'Feedback text is required'],
      trim: true
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Category is required']
    },
    reviewed: {
      type: Boolean,
      default: false
    },
    anonymous: {
      type: Boolean,
      default: true,
    }
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    }
  }
);

const Feedback = mongoose.model('Feedback', feedbackSchema);

module.exports = Feedback;