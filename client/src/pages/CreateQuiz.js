import React, { useState } from 'react';

import QuizForm from '../components/QuizForm';

const CreateQuiz = () => {
    //if param, then just render description as solid, then show question adding forms
    //question forms should have option form with "add option" button which allows adding of new options (checkbox for is true)

    return (
        <div>
            <QuizForm />
        </div>
    );
};

export default CreateQuiz;