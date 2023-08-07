import {useState} from 'react';
import './App.css';
import QuestionCard from './components/QuestionCard';
import {fetchQuestions, Difficulty, QuestionState} from './API';
import {GlobalStyle, Wrapper} from './App.styles';

export type AnswerObject = {
  question: string;
  answer: string;
  correct: boolean;
  correctAnswer: string;
};

const TOTAL_QUESTIONS = 10;

function App() {
  const [Loading, setLoading] = useState(false);
  const [Questions, setQuestions] = useState<QuestionState[]>([]);
  const [number, setNumber] = useState(0);
  const [userAnswers, setUserAnswers] = useState<AnswerObject[]>([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(true);

  const startTrivia = async () => {
    setLoading(true);
    setGameOver(false);

    const newQuestions = await fetchQuestions(
      TOTAL_QUESTIONS,
      Difficulty.EASY
    );
    setScore(0);
    setUserAnswers([]);
    setNumber(0);
    setLoading(false);

    setQuestions(newQuestions);
    console.log(Questions);
  };

  const checkAnswer = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!gameOver) {
      const answer = e.currentTarget.value;
      const correct = Questions[number].correct_answer === answer;
      if (correct) setScore((prev) => prev + 1);
      const AnswerObject = {
        question: Questions[number].question,
        answer,
        correct,
        correctAnswer: Questions[number].correct_answer,
      };
      setUserAnswers((prev) => [...prev, AnswerObject]);
    }
  };

  const nextQuestion = () => {
    const nextQuestion = number + 1;

    if (nextQuestion === TOTAL_QUESTIONS) {
      setGameOver(true);
    } else {
      setNumber(nextQuestion);
    }
  };

  return (
    <>
      <GlobalStyle />
      <Wrapper>
        <h1>React Quiz</h1>
        {gameOver || userAnswers.length === TOTAL_QUESTIONS ? (
          <button className="start" onClick={startTrivia}>
            Start
          </button>
        ) : null}
        {!gameOver ? <p className="score">Score:{score}</p> : null}
        {Loading && <p>Loading Questions...</p>}

        {!Loading && !gameOver && (
          <QuestionCard
            questionNr={number + 1}
            totalQuestions={TOTAL_QUESTIONS}
            question={Questions[number].question}
            answers={Questions[number].answers}
            userAnswer={userAnswers ? userAnswers[number] : undefined}
            callback={checkAnswer}
          />
        )}
        {!gameOver &&
        !Loading &&
        userAnswers.length === number + 1 &&
        number != TOTAL_QUESTIONS - 1 ? (
          <button className="next" onClick={nextQuestion}>
            Next Question
          </button>
        ) : null}
      </Wrapper>
    </>
  );
}

export default App;
