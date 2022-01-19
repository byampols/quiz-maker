import React, { useState } from 'react';

import { useMutation } from '@apollo/client';
import { ADD_QUIZ } from '../../utils/mutations';

const QuizForm = () => {
    const [description, setText] = useState('');
    const [characterCount, setCharacterCount] = useState(0);
    
    const [addQuiz, { error }] = useMutation(ADD_QUIZ);

    const handleChange = event => {
        if (event.target.value.length <= 280) {
          setText(event.target.value);
          setCharacterCount(event.target.value.length);
        }
    };

    const handleFormSubmit = async event => {
        event.preventDefault();

        try {
            const newQuiz = await addQuiz({
                variables: {description}
            });
            window.location.assign(`/CreateQuiz/${newQuiz.data.addQuiz._id}`);
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <div>
        <p className={`m-0 ${characterCount === 280 || error ? 'text-error' : ''}`} >
            Character Count: {characterCount}/280
            {error && <span className="ml-2">Something went wrong...</span>}
        </p>
        <form className="flex-row justify-center justify-space-between-md align-stretch" onSubmit={handleFormSubmit}>
        <textarea
            placeholder="What is this quiz about?"
            value={description}
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

export default QuizForm;