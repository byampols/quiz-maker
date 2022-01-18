//import the gql tagged template func
const {gql} = require('apollo-server-express');

//create our typeDefs
const typeDefs = gql`
    type User {
        _id: ID
        username: String
        email: String
        quizzes: [Quiz]
        scores: [Score]
    }
    type Auth {
        token: ID!
        user: User
    }
    type Quiz {
        _id: ID
        description: String
        createdAt: String
        username: String
        questions: [Question]
        upvote: [Upvote]
        scores: [Score]
        upvoteCount: Int
        questionCount: Int
    }
    type Score {
        _id: ID
        username: String
        quizId: String
        score: Float
        createdAt: String
    }
    type Question {
        _id: ID
        questionText: String
        options: [Option]
    }
    type Option {
        questionId: String
        optionText: String
        isCorrect: Boolean
    }
    type Upvote {
        username: String
        createdAt: String
    }
    type Query {
        me: User
        users: [User]
        user(username: String!): User
        quizzes(username: String): [Quiz]
        quiz(_id: ID!): Quiz
    }
    type Mutation {
        login(email: String!, password: String!): Auth
        addUser(username: String!, email: String!, password: String!): Auth
        addQuiz(description: String!): Quiz
        addQuestion(quizId: ID!, questionText: String!): Question
        addOption(questionID: ID!, optionText: String!, isCorrect: Boolean!): Question
        addUpvote(quizId: ID!): Quiz
    }
`;

//export
module.exports = typeDefs;