import React, { useState } from 'react';

import { useParams } from 'react-router-dom';

import QuizForm from '../components/QuizForm';

import { useMutation, useQuery } from '@apollo/client';
import { ADD_QUIZ } from '../utils/mutations';
import { QUERY_QUIZ } from '../utils/queries';
import QuestionForm from '../components/QuestionForm';

const CreateQuiz = () => {
    //if param, then just render description as solid, then show question adding forms
    //question forms should have option form with "add option" button which allows adding of new options (checkbox for is true)

    const  { quizId: quizParam } = useParams();

    
    return (
        <div>
            {quizParam ? <QuestionForm quizId={quizParam} /> : <QuizForm />}
        </div>
    );
};

export default CreateQuiz;