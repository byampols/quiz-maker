import React, { useState } from 'react';

import { useMutation, useQuery } from '@apollo/client';
import { ADD_QUESTION } from '../../utils/mutations';
import { QUERY_QUIZ } from '../../utils/queries';

const QuestionForm = (props) => {
    const [questionText, setText] = useState('');
    const [characterCount, setCharacterCount] = useState(0);

    console.log(props.quizId);

    const { loading, data } = useQuery(QUERY_QUIZ, {
        variables: { id: props.quizId }
    });

    const quiz = data?.quiz || {};

    console.log(quiz);

    const [addQuestion, { error }] = useMutation(ADD_QUESTION);

    if (loading) {
        return <div>Loading...</div>;
    }



    const handleChange = event => {
        if (event.target.value.length <= 280) {
          setText(event.target.value);
          setCharacterCount(event.target.value.length);
        }
    };

    const handleFormSubmit = async event => {
        event.preventDefault();

        try {
            await addQuestion({
                variables: {questionText}
            });
            setText('');
            setCharacterCount(0);
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <div>
        <p className='m-0 text-bold'>{quiz.description}</p>
        <p className={`m-0 ${characterCount === 280 || error ? 'text-error' : ''}`} >
            Character Count: {characterCount}/280
            {error && <span className="ml-2">Something went wrong...</span>}
        </p>
        <form className="flex-row justify-center justify-space-between-md align-stretch" onSubmit={handleFormSubmit}>
        <textarea
            placeholder="Here's a new question..."
            value={questionText}
            className="form-input col-12 col-md-9"
            onChange={handleChange}
        ></textarea>
            <button className="btn col-12 col-md-3" type="submit">
            Submit
            </button>
        </form>
        </div>
    );
};

export default QuestionForm;