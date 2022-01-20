import React, {useState, useEffect} from 'react';
import {useParams} from 'react-router-dom';

import { useQuery, useMutation } from '@apollo/client';
import { QUERY_QUIZ, QUERY_ME_BASIC } from '../utils/queries';
import { ADD_UPVOTE, UPDATE_USER_SCORES } from '../utils/mutations';
import Auth from '../utils/auth';

import { Link } from 'react-router-dom';

const SingleQuiz = props => {
  // quiz data
  const { id: quizId } = useParams();
  const {loading, data} = useQuery(QUERY_QUIZ, {
    variables: {id: quizId}
  });

  const { data: userData } = useQuery(QUERY_ME_BASIC);

  const [updateUserScores, { errorScore }] = useMutation(UPDATE_USER_SCORES);
  const [addUpvote, { errorUpvote }] = useMutation(ADD_UPVOTE);

  const quiz = data?.quiz || {};

  // tracked variables
  const [ questions, setQuestions ] = useState([]);
  const [ score, setScore ] = useState(null);
  const [ userHighScore, setUserHighScore ] = useState(null);

  useEffect(() => {
    //initialize the questions array
    if (Object.keys(quiz).length > 0) {
      const list = quiz.questions.map((question) => {
        const options = question.options.map(option => {
          return {
            isCorrect: option.isCorrect,
            isChecked: "false"
          };
        });
        return options
      });

      const scores = userData ? userData.me.scores.map(score => {
        if (score.quizId === quizId) {
          return parseFloat(score.score.slice(0, -1)).toFixed(2);
        }
      }) : null;

      if (scores !== null) {
        setUserHighScore(scores.sort(function(a, b){return b - a})[0])
      }

      setQuestions(list);
    }
  }, [quiz, userData]);

  if (loading) {
    return <div>Loading...</div>
  }

  const handleAnswerChange = (event, index, optionIndex, signal = null) => {
    const value = event.target.checked;
    const list = [...questions];

    if (signal === "checkbox") {
      list[index][optionIndex].isChecked = value;


    }

    setQuestions(list);
  };

  const handleFormSubmit = async event => {
    event.preventDefault();

    const list = [...questions];

    let rawScore = 0;

    list.forEach(question => {
      let correctCount = 0;
      let currentCorrect = 0;
  
      question.forEach(option => {
        correctCount += option.isCorrect === true ? 1 : 0;
        currentCorrect += option.isCorrect === true && option.isChecked === true ? 1 : 0;
        currentCorrect -= option.isCorrect === false && option.isChecked === true ? 1 : 0;
      })

      rawScore += correctCount === currentCorrect && correctCount > 0 ? 1 : 0;
    });

    const newScore = `${((rawScore / list.length) * 100).toFixed(2)}%`;
    await setScore(newScore);

    try {
      await updateUserScores({
        variables: {
          score: {
            score: newScore,
            quizId
          }
        }
      });
      
    } catch (e) {
      console.log(e);
    }
  };

  const handleUpvote = async (event) => {
    event.preventDefault();

    try {
      const hasUpvoted = quiz.upvote.some(upvote => {
        return upvote.username === userData.me.username;
      });
      
      if (!hasUpvoted) {
        await addUpvote({
          variables: {quizId}
        });
      }
    } catch (e) {
      console.log(e)
    }
  }

  return (
    <div>
      <div className="card mb-3">
        <p className="card-header">
          
          <Link to={`/profile/${quiz.username}`} className="text-light" style={{ fontWeight: 700 }}>
            <span style={{ fontWeight: 700 }} className="text-light">
              {quiz.username}
            </span>{' '}
            created this quiz on {quiz.createdAt}
          </Link>

        </p>
        {!score ? (
        <form className="card-body" onSubmit={handleFormSubmit}>
          <p>
            {userData ? (
              userHighScore ? <>Your High Score on this Quiz: {userHighScore}%</> : <>You haven't attempted this quiz yet! Good luck!</>
              ) : <>Log in or sign up to see your high scores!</>}
          </p>
          {quiz.questions.map((question, index) => {
            return (
              <div key={index} className='card'>
                    <p className='card-header question-header'>{question.questionText}</p>
                    <div className='card-body flex-column justify-space-between question-body'>
                        {question.options.map((option, j) => {
                          return (
                            <div key={j} className='mb-2 lg-flex'>
                              <input className='mr-3 check-input' type="checkbox" name={`option.${j}`} ischecked={questions.length ? questions[index][j].isChecked.toString() : "false"} onChange={e => handleAnswerChange(e, index, j, "checkbox")}/> 
                              <label className='check-label' htmlFor={`option.${j}`}>{String.fromCharCode(97 + j)}: {option.optionText}</label>
                            </div>
                          )
                        })}
                    </div>
              </div>
            );
          })}

          <button className="btn col-12 col-md-3 btn-long" type="submit">Submit</button>
        </form>
        ) : (
          <div className="card-body" key="reactisasillyframework">
            <p>
              Final Score: {score}
            </p>
            <p>
            {parseFloat(score.slice(0, -1)).toFixed(2) > 98 || parseFloat(score.slice(0, -1)).toFixed(2) >= userHighScore ? <>Congratulations!</> : <>Better luck next time!</>}
            </p>
            {Auth.loggedIn() && <button className='btn' onClick={handleUpvote}>Upvote</button>}
          </div>
        )}
      </div>

      {/* {quiz.reactionCount > 0 && <ReactionList reactions={quiz.reactions} />}
      {Auth.loggedIn() && <ReactionForm quizId={quiz._id} />} */}
    </div>
  );
};

export default SingleQuiz;
