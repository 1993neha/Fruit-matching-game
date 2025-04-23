// src/components/FruitMatcher.jsx
import React, { useState, useEffect } from 'react';

const fruits = ["🍎", "🍌", "🍓", "🍒", "🍍", "🍉", "🍇", "🥝"];

const FruitMatcher = () => {
  const [shuffledFruits, setShuffledFruits] = useState([]);
  const [tiles, setTiles] = useState([]);
  const [selected, setSelected] = useState([]);
  const [score, setScore] = useState(0);
  const [moves, setMoves] = useState(0);
  const [gameComplete, setGameComplete] = useState(false);
  const [flippedCount, setFlippedCount] = useState(0);
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  // Initialize game
  const initGame = () => {
    const newShuffledFruits = [...fruits, ...fruits]
      .sort(() => Math.random() - 0.5);
    setShuffledFruits(newShuffledFruits);
    setTiles(newShuffledFruits.map(fruit => ({ fruit, matched: false })));
    setScore(0);
    setMoves(0);
    setSelected([]);
    setGameComplete(false);
    setFlippedCount(0);
    setTime(0);
    setIsRunning(true);
  };

  // Timer effect
  useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(() => {
        setTime(prevTime => prevTime + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  useEffect(() => {
    initGame();
  }, []);

  useEffect(() => {
    if (tiles.length > 0 && tiles.every(tile => tile.matched)) {
      setIsRunning(false);
      setGameComplete(true);
    }
  }, [tiles]);

  const handleTileClick = (index) => {
    if (selected.length === 2 || tiles[index].matched || selected.includes(index)) return;

    const newSelected = [...selected, index];
    setSelected(newSelected);
    setFlippedCount(prev => prev + 1);
    setMoves(prev => prev + 0.5); // Each pair counts as 1 move

    if (newSelected.length === 2) {
      const [first, second] = newSelected;
      if (tiles[first].fruit === tiles[second].fruit) {
        const updatedTiles = tiles.map((tile, idx) =>
          newSelected.includes(idx) ? { ...tile, matched: true } : tile
        );
        setTiles(updatedTiles);
        setScore(score + 10); // 10 points per match
      }
      setTimeout(() => setSelected([]), 800);
    }
  };

  const calculateAccuracy = () => {
    if (moves === 0) return 0;
    const matchedPairs = score / 10;
    return Math.round((matchedPairs / moves) * 100);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-100 to-indigo-200 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden p-6">
        <header className="text-center mb-6">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-2">
            Fruit Memory Match
          </h1>
          <p className="text-gray-600 text-sm font-medium">Match the pairs to win!</p>
        </header>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6 bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-xl shadow-inner">
          <div className="text-center">
            <p className="text-xs text-gray-600 font-semibold uppercase tracking-wider">Time</p>
            <p className="text-xl font-bold text-indigo-700">{formatTime(time)}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-600 font-semibold uppercase tracking-wider">Score</p>
            <p className="text-xl font-bold text-purple-700">{score}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-600 font-semibold uppercase tracking-wider">Moves</p>
            <p className="text-xl font-bold text-blue-700">{Math.floor(moves)}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-600 font-semibold uppercase tracking-wider">Accuracy</p>
            <p className="text-xl font-bold text-green-600">{calculateAccuracy()}%</p>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-3 mb-6">
          {tiles.map((tile, idx) => (
            <button
              key={idx}
              className={`aspect-square rounded-xl flex items-center justify-center text-4xl transition-all duration-300 transform ${
                tile.matched 
                  ? 'bg-gradient-to-br from-green-100 to-green-200 scale-95 cursor-default shadow-inner' 
                  : selected.includes(idx)
                    ? 'bg-gradient-to-br from-blue-100 to-blue-200 scale-95 shadow-md'
                    : 'bg-gradient-to-br from-yellow-100 to-orange-100 hover:from-yellow-200 hover:to-orange-200 hover:scale-105 cursor-pointer shadow-md'
              }`}
              onClick={() => handleTileClick(idx)}
              disabled={tile.matched}
            >
              <span className={`transition-all duration-300 ${
                tile.matched || selected.includes(idx) ? 'opacity-100 rotate-0' : 'opacity-0 rotate-45'
              }`}>
                {tile.fruit}
              </span>
              {!(tile.matched || selected.includes(idx)) && (
                <span className="absolute text-3xl text-gray-300">?</span>
              )}
            </button>
          ))}
        </div>

        <div className="flex justify-center gap-4">
          <button
            onClick={initGame}
            className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-2 px-5 rounded-lg font-semibold shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105 text-sm"
          >
            Restart Game
          </button>
        </div>

        {gameComplete && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-xl max-w-sm w-full text-center animate-pop-in">
              <h2 className="text-2xl font-bold text-purple-600 mb-3">You Win! 🎉</h2>
              <div className="mb-4 space-y-2">
                <p className="text-gray-700">Time: <span className="font-bold">{formatTime(time)}</span></p>
                <p className="text-gray-700">Final Score: <span className="font-bold">{score}</span></p>
                <p className="text-gray-700">Moves: <span className="font-bold">{Math.floor(moves)}</span></p>
                <p className="text-gray-700">Accuracy: <span className="font-bold">{calculateAccuracy()}%</span></p>
              </div>
              <button
                onClick={initGame}
                className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-2 px-5 rounded-lg font-medium hover:scale-105 transition-transform text-sm w-full"
              >
                Play Again
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FruitMatcher;