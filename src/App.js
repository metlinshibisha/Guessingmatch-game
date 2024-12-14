// This is the React and Java code snippet for the Guessing Number Game.
// Full integration and deployment will require setting up a backend server and a database.

// React Frontend (App.js)
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [playerName, setPlayerName] = useState('');
  const [gameStarted, setGameStarted] = useState(false);
  const [computerNumber, setComputerNumber] = useState('');
  const [guess, setGuess] = useState('');
  const [feedback, setFeedback] = useState('');
  const [moves, setMoves] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [bestScore, setBestScore] = useState(null);

  useEffect(() => {
    fetchBestScore();
  }, []);

  const fetchBestScore = async () => {
    const response = await axios.get('/api/best-score');
    setBestScore(response.data);
  };

  const startNewGame = () => {
    const name = prompt('Enter your name:');
    if (name) {
      setPlayerName(name);
      setGameStarted(true);
      setMoves(0);
      setFeedback('');
      setStartTime(Date.now());
      setComputerNumber(generateRandomNumber());
    }
  };

  const generateRandomNumber = () => {
    let digits = new Set();
    while (digits.size < 4) {
      digits.add(Math.floor(Math.random() * 10));
    }
    return Array.from(digits).join('');
  };

  const handleGuess = () => {
    if (guess.length !== 4 || new Set(guess).size !== 4) {
      setFeedback('Please enter a valid 4-digit number with unique digits.');
      return;
    }

    setMoves((prev) => prev + 1);

    let plus = 0;
    let minus = 0;
    for (let i = 0; i < 4; i++) {
      if (guess[i] === computerNumber[i]) {
        plus++;
      } else if (computerNumber.includes(guess[i])) {
        minus++;
      }
    }

    if (plus === 4) {
      const endTime = Date.now();
      const timeTaken = Math.floor((endTime - startTime) / 1000);
      setFeedback(`Congratulations ${playerName}! You guessed the number in ${moves} moves and ${timeTaken} seconds.`);
      saveScore({ name: playerName, moves, time: timeTaken });
      setGameStarted(false);
    } else {
      setFeedback(`Feedback: ${'+'.repeat(plus)}${'-'.repeat(minus)}`);
    }
  };

  const saveScore = async (score) => {
    await axios.post('/api/save-score', score);
    fetchBestScore();
  };

  return (
    <div>
      <h1>Guessing Number Game</h1>
      {!gameStarted && <button onClick={startNewGame}>New Game</button>}
      {gameStarted && (
        <div>
          <h2>Player: {playerName}</h2>
          <input
            type="text"
            value={guess}
            onChange={(e) => setGuess(e.target.value)}
            placeholder="Enter your guess"
          />
          <button onClick={handleGuess}>Submit Guess</button>
          <p>{feedback}</p>
        </div>
      )}
      {bestScore && (
        <div>
          <h3>Best Score</h3>
          <p>
            {bestScore.name} - {bestScore.moves} moves, {bestScore.time} seconds
          </p>
        </div>
      )}
    </div>
  );
}

export default App;

