/* eslint-disable react/prop-types */
import React from 'react';

export function Question(props) {
  const {
    topic, answers, clickAnswer, id, correctAnswer, selectedAnswer, checkAll,
  } = props;

  function styleButton(item) {
    if (checkAll) {
      if (correctAnswer === item) {
        return 'container-button correct';
      } if (selectedAnswer === item) {
        return 'container-button wrong';
      }
      return 'container-button disable';
    }
    if (selectedAnswer === item) {
      return 'container-button clicked';
    }
    return 'container-button options';
  }
  const options = answers.map((item, i) => (
    <button
      type="button"
      // eslint-disable-next-line react/no-array-index-key
      key={i}
      data-question-index={id}
      className={styleButton(item)}
      onClick={(e) => clickAnswer(e, id)}
      disabled={checkAll}
    >
      {item}
    </button>
  ));

  return (
    <div className="container">
      <div>
        <p className="container-header">{topic}</p>
        <div className="container-options">
          {options}
        </div>
      </div>

    </div>
  );
}
