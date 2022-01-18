const { Schema } = require('mongoose');
const dateFormat = require('../utils/dateFormat');

const scoreSchema = new Schema(
  {
    username: {
      type: String,
      required: true
    },
    quizId: {
      type: String,
      required: true
    },
    score: {
      type: Number,
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now,
      get: timestamp => dateFormat(timestamp)
    }
  },
  {
    toJSON: {
      virtuals: true
    }
  }
);

module.exports = scoreSchema;
