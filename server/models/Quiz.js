const { Schema, model } = require('mongoose');
const upvoteSchema = require('./Upvote');
const questionSchema = require('./Question');
const scoreSchema = require('./Score');
const dateFormat = require('../utils/dateFormat');

const quizSchema = new Schema(
  {
    description: {
      type: String,
      required: 'You need to leave a thought!',
      minlength: 1,
      maxlength: 280
    },
    createdAt: {
      type: Date,
      default: Date.now,
      get: timestamp => dateFormat(timestamp)
    },
    username: {
      type: String,
      required: true
    },
    questions: [questionSchema],
    upvote: [upvoteSchema],
    scores: [scoreSchema]
  },
  {
    toJSON: {
      getters: true,
      virtuals: true
    }
  }
);

quizSchema.virtual('upvoteCount').get(function() {
  return this.upvotes.length;
});


quizSchema.virtual('questionCount').get(function() {
  return this.questions.length;
});

const Quiz = model('Quiz', quizSchema);

module.exports = Quiz;
