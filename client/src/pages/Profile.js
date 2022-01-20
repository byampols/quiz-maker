import React from 'react';
import { Redirect, useParams } from 'react-router-dom';

import QuizList from '../components/QuizList';
//import ThoughtForm from '../components/ThoughtForm';

import { useQuery } from '@apollo/client';
import { QUERY_USER, QUERY_ME } from '../utils/queries';

import Auth from '../utils/auth';

const Profile = () => {
  const { username: userParam } = useParams();

  const { loading, data } = useQuery(userParam ? QUERY_USER : QUERY_ME, {
    variables: { username: userParam }
  });

  const user = data?.me || data?.user || {};

  // redirect to personal profile page if username is the logged-in user's
  if (Auth.loggedIn() && Auth.getProfile().data.username === userParam) {
    return <Redirect to="/profile" />;
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user?.username) {
    return (
      <h4>
        You need to be logged in to see this page. Use the navigation links above to sign up or log in!
      </h4>
    );
  }

  const getHighScores = () => {
    let scoreObj = {}
    user.scores.forEach(score => {
      if (scoreObj[score.quizId]) {
        scoreObj = score.score > scoreObj[score.quizId] ? {...scoreObj, [score.quizId]: score.score} : scoreObj;
      } else {
        scoreObj = {...scoreObj, [score.quizId]: score.score}
      }
    });

    const scoreObjKeys = Object.keys(scoreObj);
    const highScoresFull = scoreObjKeys.map(quizId => {
      return {
        quizId,
        score: scoreObj[quizId]
      }
    });
    const highScores = highScoresFull.sort((a, b) => parseFloat(a.score.slice(0, -1)).toFixed(2) > parseFloat(b.score.slice(0, -1)).toFixed(2) ? 1 : -1).slice(0, 2);
    return highScores;
  }

  return (
    <div>
      <div className="flex-row mb-3">
        <h2 className="bg-dark text-secondary p-3 display-inline-block">
          Viewing {userParam ? `${user.username}'s` : 'your'} profile.
        </h2>

        <button className="btn ml-auto-lg btn-long-sm" onClick={() => window.location.assign('/create-quiz')}>
            Create New Quiz
        </button>
      </div>

      <div className='flex-row justify-space-between mb-3'>
        <div className='col-12 mb-3 col-md-8'>
          <QuizList quizzes={user.quizzes} title={`${user.username}'s quizzes`} />
        </div>

        <div className='col-1 mb-3 col-lg-2'>
          <div className='ml-auto'>
            <h4>Top High Scores:</h4>
            <ol>
              {
                getHighScores().map(score => {
                  return <li key={score.quizId}><a href={`/quiz/${score.quizId}`}>{score.score}</a></li>
                })
              }
            </ol>
          </div>
        </div>
      </div>

      <div className="mb-3">{!userParam && "asdf"}</div>
    </div>
  );
};

export default Profile;
