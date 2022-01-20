import React, { useState } from 'react';

import { useMutation } from '@apollo/client';
import { ADD_QUIZ } from '../../utils/mutations';

const QuizForm = () => {
    // tracked states 

    const [description, setDescription] = useState('');
    const [questionList, setQuestionList] = useState([{questionText: "", count: 0, options: [{optionText: '', isCorrect: false, count: 0}, {optionText: '', isCorrect: false, count: 0}, {optionText: '', isCorrect: false, count: 0}, {optionText: '', isCorrect: false, count: 0}]}]);
    const [descriptionCount, setDescriptionCount] = useState(0);
    const [errorMessage, setErrorMessage] = useState(null);
    
    const [addQuiz, { error }] = useMutation(ADD_QUIZ);

    // character count trackers

    const handleDescriptionChange = event => {
        if (event.target.value.length <= 280) {
          setDescription(event.target.value);
          setDescriptionCount(event.target.value.length);
        }
    };

    const handleQuestionChange = (event, index, optionIndex = null, signal = null) => {
        let { name, value } = event.target;

        if (signal === "checkbox") {
            value = event.target.checked;
        }
        
        const list = [...questionList];

        if (signal === "text") {
            if (value.length <= 280) {
                optionIndex !== null ? list[index].options[optionIndex].count = value.length : list[index].count = value.length;
            } 
        }

        if (optionIndex === null) {
            list[index][name] = value;
        } else {
            list[index].options[optionIndex][name] = value;
        }

        if (signal === "text") {
            if (value.length <= 280) {
                setQuestionList(list);
                optionIndex !== null ? list[index].options[optionIndex].count = value.length : list[index].count = value.length;
            } 
        } else if (signal === "checkbox") {
            setQuestionList(list);
        }
    };

    // dynamic removal

    const handleRemoveQuestion = index => {
        const list = [...questionList];
        list.splice(index, 1);
        setQuestionList(list);
    };

    // dynamic addition

    const handleAddQuestion = async () => {
        setQuestionList([...questionList, {questionText: "", count: 0, options: [{optionText: '', isCorrect: false, count: 0}, {optionText: '', isCorrect: false, count: 0}, {optionText: '', isCorrect: false, count: 0}, {optionText: '', isCorrect: false, count: 0}]}]);
    };

    // form submission
    const verifyOptions = (options) => {
        let truthCount = 0;
        let emptyCount = 0;
        const cleanList =  options.map(option => {
            if (option.isCorrect) truthCount++;
            if (option.optionText.length < 1) emptyCount++;
            return {
                optionText: option.optionText,
                isCorrect: option.isCorrect
            }
        });

        return truthCount > 0 && emptyCount === 0 ? cleanList : null;
    }

    const handleFormSubmit = async event => {
        event.preventDefault();
        try {
            if (description.length < 1) {
                throw new Error('Please describe your quiz!');
            } 
            const questions = [...questionList];
            const cleanQuestions = questions.map(question => {
                const checkOptions = verifyOptions(question.options);
                if (question.questionText.length < 1) {
                    throw new Error('Question descriptions must have text!');
                }
                if (!checkOptions) {
                    throw new Error('A question requires at least one correct answer!');
                }
                return {
                    questionText: question.questionText,
                    options: checkOptions
                }
            });

            setErrorMessage(null);

            await addQuiz({
                variables: {
                    description,
                    questions: cleanQuestions
                }
            });

            window.location.assign(`/profile`);
            
        } catch (e) {
            console.log(e);
            setErrorMessage(e.message);
        }
    };

    return (
        <div>
        <form className="flex-row justify-center justify-space-between-md align-stretch" onSubmit={handleFormSubmit}>
            {error || errorMessage && <span className="col-12 col-md-9 ml-0 text-bold text-error">{errorMessage ? errorMessage : 'Something went wrong...'}</span>}
            <div className='col-12 col-md-9'>
                <p className={`m-0 ${descriptionCount === 280 || error || errorMessage ? 'text-error' : ''}`} >
                    Quiz Description: {descriptionCount}/280
                </p>
                <textarea
                    placeholder="What is this quiz about?"
                    value={description}
                    className="form-input"
                    onChange={handleDescriptionChange}
                ></textarea>
            </div>
            {questionList.map((question, i) => {
                return (
                    <div className='col-12 col-md-9' key={i}>
                        <p className={`m-0 ${question.count === 280 || error || errorMessage ? 'text-error' : ''}`} >
                            Question {i + 1}: {question.count}/280
                        </p>
                        <textarea
                            placeholder="Here's a question..."
                            value={question.questionText}
                            name="questionText"
                            className="form-input"
                            onChange={e => handleQuestionChange(e, i, undefined, "text")}
                        ></textarea>
                        <div className='flex-row justify-center justify-space-between-md align-stretch'>
                            {question.options.map((option, j) => {

                                return (
                                    <div className='col-2 col-md-2' key={j}>
                                        <div>
                                            <p className={`m-0 ${option.count === 280 || error || errorMessage ? 'text-error' : ''}`} >
                                                Option {j + 1}: {option.count}/280
                                            </p>
                                            <div>
                                                <textarea
                                                    value={option.optionText}
                                                    className="form-input"
                                                    onChange={e => handleQuestionChange(e, i, j, "text")}
                                                    name="optionText"
                                                ></textarea>
                                                <label htmlFor={`${j}.isCorrect`}>Correct </label>
                                                <input type="checkbox" id={`${j}.isCorrect`} name={`isCorrect`} checked={option.isCorrect} onChange={e => handleQuestionChange(e, i, j, 'checkbox')} />
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>

                        <div className="btn-box">
                        {questionList.length !== 1 && <button
                            className="mr10"
                            onClick={() => handleRemoveQuestion(i)}>Remove Question</button>}
                        {questionList.length - 1 === i && <button onClick={handleAddQuestion}>Add Question</button>}
                        </div>
                    </div>
                )
            })}
            <div>
                <button className="btn col-12 col-md-3" type="submit">Submit</button>
            </div>
        </form>
        </div>
    );
};

export default QuizForm;