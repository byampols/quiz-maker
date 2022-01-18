const { Schema } = require('mongoose');

const optionSchema = new Schema(
  {
    questionId: {
      type: String
    },
    optionText: {
      type: String,
      required: 'You need to create an option!',
      minlength: 1,
      maxlength: 280
    },
    isCorrect: {
      type: Boolean,
      required: 'Is it correct or not?',
      default: false
    }
  },
  {
    toJSON: {
      getters: true
    }
  }
);

module.exports = optionSchema;
