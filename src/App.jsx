import React, { useCallback } from 'react';
import { decode } from 'html-entities';
import './App.css';
import { Question } from './Question';
import blob1 from './Images/blob-1-top.png';
import blob2 from './Images/blob-1-bottom.png';
import blob3 from './Images/blob-2-top.png';
import blob4 from './Images/blob-2-bottom.png';

export function App() {
  const [startGame, setStartGame] = React.useState(false);
  const [quizData, setQuizData] = React.useState([]);
  const [checkAll, setCheckAll] = React.useState(false);
  const [disable, setDisable] = React.useState(false);
  const [score, setScore] = React.useState(0);

  function startQuiz() {
    setStartGame(true);
  }

  // function allChecked() {
  //   if (quizData.every((item) => item.selectedAnswer !== undefined) && quizData.length > 0) {
  //     setDisable(true);
  //   }
  // }
  const allChecked = useCallback(() => {
    if (quizData.every((item) => item.selectedAnswer !== undefined) && quizData.length > 0) {
      setDisable(true);
    }
  }, [quizData]);

  React.useEffect(() => {
    fetch('https://opentdb.com/api.php?amount=5&difficulty=easy&type=multiple')
      .then((res) => res.json())
      .then((data) => setQuizData(data.results.map((item, i) => ({
        ...item,
        answers:
        decode(
          (item.incorrect_answers.concat(item.correct_answer)).sort(() => Math.random() - 0.5),
        ),
        question: decode(item.question),
        correctAnswer: item.correct_answer,
        selectedAnswer: undefined,
        id: i,
      }))));
  }, [startGame]);

  React.useEffect(() => {
    let count = 0;
    for (let i = 0; i < quizData.length; i += 1) {
      if (quizData[i].selectedAnswer !== undefined) {
        if (quizData[i].selectedAnswer === quizData[i].correctAnswer) count += 1;
      }
    }
    setScore(count);
    allChecked();
  }, [allChecked, quizData]);

  function clickAnswer(e, questionIndex) {
    setQuizData((prevData) => prevData.map((item, itemId) => {
      if (questionIndex === itemId) {
        return {
          ...item,
          selectedAnswer: e.target.textContent,
        };
      }
      return item;
    }));
  }

  const elements = quizData.map((item, i) => (
    <Question
      // eslint-disable-next-line react/no-array-index-key
      key={i}
      topic={item.question}
      answers={item.answers}
      // eslint-disable-next-line react/jsx-no-bind
      clickAnswer={clickAnswer}
      selectedAnswer={item.selectedAnswer}
      correctAnswer={item.correctAnswer}
      id={i}
      checkAll={checkAll}
    />
  ));

  function checkAnswers() {
    setCheckAll(true);
  }

  function playAgain() {
    setStartGame(false);
    setCheckAll(false);
    setScore(0);
    setDisable(false);
  }

  return (
    <div>
      { startGame
        ? (
          <div>
            <div>
              <img className="blob top-right" alt="blob img" src={blob3} />
              <img className="blob bottom-left" alt="blob img" src={blob4} />
              {elements}
            </div>
            {checkAll
              ? (
                <div className="game-results">
                  <span className="text-results">
                    You scored
                    {' '}
                    {score}
                    /
                    {quizData.length}
                    {' '}
                    correct answers
                  </span>
                  <button type="button" className="button play" onClick={playAgain}>Play again</button>
                </div>
              )
              : <button type="button" className={!disable ? 'button check disabled' : 'button check'} disabled={!disable} onClick={checkAnswers}>Check answers</button>}
          </div>
        )
        : (
          <div>
            <img className="blob top-right" alt="blob img" src={blob1} />
            <img className="blob bottom-left" alt="blob img" src={blob2} />
            <div className="main">
              <h1 className="main-header">Quizzical</h1>
              <p className="main-text">Check your knowledge and have fun!</p>
              <button type="button" className="main-button" onClick={startQuiz}>Start Quiz</button>
            </div>
          </div>
        )}

    </div>
  );
}
