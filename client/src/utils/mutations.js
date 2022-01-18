import { gql } from '@apollo/client';

export const LOGIN_USER = gql`
    mutation login($email: String!, $password: String!) {
        login(email: $email, password: $password) {
            token
            user {
                _id
                username
            }
        }
    }
`;

export const ADD_USER = gql`
  mutation addUser($username: String!, $email: String!, $password: String!) {
    addUser(username: $username, email: $email, password: $password) {
      token
      user {
        _id
        username
      }
    }
  }
`;

export const ADD_QUIZ = gql`
  mutation addQuiz($description: String!) {
    addQuiz(description: $description) {
      _id
      description
      createdAt
      username
      upvoteCount
      questionCount
      scores {
        username
        score
        createdAt
      }
      upvote {
        username
      }
      questions {
        questionText
        options {
          optionText
          isCorrect
        }
      }
    }
  }
`;

export const ADD_UPVOTE = gql`
  mutation addUpvote($quizId: ID!) {
    addUpvote(quizId: $quizId) {
      _id
      description
      createdAt
      username
      upvoteCount
      questionCount
      scores {
        username
        score
        createdAt
      }
      upvote {
        username
      }
      questions {
        questionText
        options {
          optionText
          isCorrect
        }
      }
    }
  }
`;

export const ADD_QUESTION = gql`
  mutation addQuestion($quizId: ID!, $questionText: String!) {
    addQuestion(quizId: $quizId, questionText: $questionText) {
      _id
      questionText
      options {
        optionText
        isCorrect
      }
    }
  }
`;

export const ADD_OPTION = gql`
  mutation addOption($questionId: ID!, $optionText: String!, $isCorrect: Boolean!) {
    addOption(quizId: $questionId, optionText: $optionText, isCorrect: $isCorrect) {
      _id
      questionText
      options {
        optionText
        isCorrect
      }
    }
  }
`;