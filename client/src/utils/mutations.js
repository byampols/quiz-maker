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

export const UPDATE_USER_SCORES = gql`
  mutation updateUserScores($score: ScoreInput!) {
    updateUserScores(score: $score) {
      _id
      username
      scores {
        quizId
        score
        createdAt
      }
    }
  }
`;

export const ADD_QUIZ = gql`
  mutation addQuiz($description: String!, $questions: [QuestionInput]!) {
    addQuiz(description: $description, questions: $questions) {
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