import { gql } from '@apollo/client';

export const QUERY_QUIZZES = gql`
query quizzes($username: String) {
    quizzes(username: $username) {
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
    }
  }
`;

export const QUERY_QUIZ = gql`
  query quiz($id: ID!) {
    quiz(_id: $id) {
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

export const QUERY_USER = gql`
  query user($username: String!) {
    user(username: $username) {
      _id
      username
      email
      quizzes(username: $username) {
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
      }
      scores {
        quizId
        score
        createdAt
      }
    }
  }
`;

export const QUERY_ME = gql`
  {
    me {
      _id
      username
      email
      quizzes(username: $username) {
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
      }
      scores {
        quizId
        score
        createdAt
      }
    }
  }
`;

export const QUERY_ME_BASIC = gql`
  {
    me {
      _id
      username
      email
    }
  }
`;