import React from 'react';
import { Link } from 'react-router-dom';

const QuizList = ({quizzes, title, userQuizzes}) => {
    if (!quizzes.length) {
        return <h3>No Quizzes Yet</h3>;
    }


    return (
        <div>
            <h3>{title}</h3>
            {quizzes && quizzes.map(quiz => (
                <div key={quiz._id} className={`card mb-3 ${userQuizzes ? (
                        userQuizzes.includes(quiz._id) ? 'card-highlight' : ''
                    ) : ''}`}>
                    <p className={`card-header ${userQuizzes ? (
                        userQuizzes.includes(quiz._id) ? 'card-header-highlight' : ''
                    ) : ''}`}>
                        <Link to={`/profile/${quiz.username}`} style={{fontWeight: 700}} className='text-light'>
                            {quiz.username}
                        </Link>
                        <Link to={`/quiz/${quiz._id}`}>{' '}created this quiz on {quiz.createdAt}</Link>
                    </p>
                    <div className={`card-body ${userQuizzes ? (
                        userQuizzes.includes(quiz._id) ? 'card-body-highlight' : 'text-dark'
                    ) : 'text-dark'}`}>
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