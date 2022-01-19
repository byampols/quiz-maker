import React from 'react';
import { Link } from 'react-router-dom';

const QuizList = ({quizzes, title}) => {
    if (!quizzes.length) {
        return <h3>No Quizzes Yet</h3>;
    }

    return (
        <div>
            <h3>{title}</h3>
            {quizzes && quizzes.map(quiz => (
                <div key={quiz.id} className='card mb-3'>
                    <p className='card-header'>
                        <Link to={`/profile/${quiz.username}`} style={{fontWeight: 700}} className='text-light'>
                            {quiz.username}
                        </Link>
                        {' '}quiz on {quiz.createdAt}
                    </p>
                    <div className='card-body'>
                        <Link to={`/quiz/${quiz._id}`}>
                            <p>{quiz.description}</p>
                            <p className='mb-0'>
                                Upvotes: {quiz.upvoteCount}
                            </p>
                        </Link>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default QuizList;