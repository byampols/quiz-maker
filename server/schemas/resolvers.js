const { User, Quiz, Question } = require("../models");
const { AuthenticationError } = require('apollo-server-express');
const { signToken } = require('../utils/auth');

const resolvers = {
    Query: {
        me: async(parent, args, context) => {
            if (context.user) {
                const userData = await User.findOne({_id: context.user._id}).select('-__v -password').populate('friends').populate('thoughts');
                return userData
            }
            
            throw new AuthenticationError('Not logged in');
        },
        users: async () => {
            return User.find().select('-__v -password').populate('scores').populate('quizzes');
        },
        user: async (parent, {username}) => {
            return User.findOne({username}).select('-__v -password').populate('scores').populate('quizzes');
        },
        quizzes: async (parent, {username}) => {
            const params = username ? {username} : {};
            return Quiz.find(params).sort({ createdAt: -1 }).populate('questions').populate('questions.options').populate('upvote').populate('scores');
        },
        quiz: async (parent, {_id}) => {
            return Quiz.findOne({_id}).populate('questions').populate('questions.options').populate('upvote').populate('scores');
        }
    },
    Mutation: {
        addUser: async (parent, args) => {
            const user = await User.create(args);
            const token = signToken(user);
            return {token, user};
        },
        login: async (parent, {email, password}) => {
            const user = await User.findOne({email});

            if (!user) {
                throw new AuthenticationError('Incorrect credentials');
            }

            const correctPw = await user.isCorrectPassword(password);

            if (!correctPw) {
                throw new AuthenticationError('Incorrect credentials');
            }

            const token = signToken(user);
            return {token, user};
        },
        addQuiz: async (parent, args, context) => {
            if (context.user) {
                const quiz = await Quiz.create({ ...args, username: context.user.username });

                await User.findByIdAndUpdate(
                    {_id: context.user._id},
                    {$push: {quizzes: quiz._id}},
                    {new: true}
                );

                return quiz;
            }

            throw new AuthenticationError('You need to be logged in!');
        },
        addQuestion: async (parent, args, context) => {
            if (context.user) {
                const question = await Question.create({ ...args });

                await Quiz.findByIdAndUpdate(
                    {_id: context.user._id},
                    {$push: {questions: question._id}},
                    {new: true}
                );

                return question;
            }

            throw new AuthenticationError('You need to be logged in!');
        },
        addOption: async (parent, {questionId, optionText, isCorrect}, context) => {
            if (context.user) {
                const updatedQuestion = await Question.findOneAndUpdate(
                    { _id: questionId },
                    { $push: { options: { questionId, optionText, isCorrect } } },
                    { new: true, runValidators: true }
                  );

                return updatedQuestion;
            }

            throw new AuthenticationError('You need to be logged in!');
        },
        addUpvote: async (parent, {quizId}, context) => {
            if (context.user) {
                const updatedQuiz = await Quiz.findOneAndUpdate(
                    { _id: quizId },
                    { $push: { upvote: { username: context.user.username } } },
                    { new: true, runValidators: true }
                  );

                return updatedQuiz;
            }

            throw new AuthenticationError('You need to be logged in!');
        }
    }
};

module.exports = resolvers;