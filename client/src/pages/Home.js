import React from 'react';
import {useQuery} from '@apollo/client';
import { QUERY_QUIZZES } from '../utils/queries';

import QuizList from '../components/QuizList';

import Auth from '../utils/auth';

const Home = () => {
  const {loading, data} = useQuery(QUERY_QUIZZES);

  const quizzes = data?.quizzes || [];

  const loggedIn = Auth.loggedIn();

  return (
    <main>
      <div className='flex-row justify-space-between'>
        <div className={`col-12 mb-3`}>
          {loading ? (
            <div>Loading</div>
          ) : (
            <QuizList quizzes={quizzes} title="Test your mind with these..."/>
          )}
        </div>
      </div>
    </main>
  );
};

export default Home;
