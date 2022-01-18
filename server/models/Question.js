const { Schema } = require('mongoose');
const optionSchema = require('./Option');

const questionSchema = new Schema(
  {
    questionText: {
      type: String,
      required: 'You need to create a question!',
      minlength: 1
    },
    option: [optionSchema]
  },
  {
    toJSON: {
      getters: true
    }
  }
);

module.exports = questionSchema;
