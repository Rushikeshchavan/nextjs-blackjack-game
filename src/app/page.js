"use client"

// 1. Start Game
// 2. Create Deck
// 3. First Assign single card to player and dealer
// 4. Turn -> Player
// 5. Player will have button -> draw card or pause (pause will be enabled only when player score is >= 17)
// 6. If Player score becomes greater than 21. Then automatically dealer wins
// 7. Otherwise, Dealer draws cards (set Turn -> Dealer)
// 8. Dealer will have button -> draw card or pause (pause will be enabled only when Dealer score is >= 17)
// 9. If Dealer score becomes greater than 21. Then automatically player wins
// 10. Otherwise, If dealer hits pause button, and both of them havent yet lost automatically due to score being more than 21,
// then compare their scores and whoever has higher score, that person will be the winner
// 11. Show winner name
// 12. Reset Game

import React, { useState, useEffect } from 'react';

const Card = ({ suit, rank, value }) => {
  return (
    <div className={`border-2 border-gray-800 rounded-lg p-4 flex flex-col items-center justify-center text-center`}>
      <div className="text-2xl">{rank}</div>
      <div className="text-3xl">{suit}</div>
      <div className="text-lg mt-2">{value}</div>
    </div>
  );
};

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function calculateCardValue(rank) {
  if (rank === 'A') {
    return 1;
  } else if (['K', 'Q', 'J'].includes(rank)) {
    return 10;
  } else {
    return parseInt(rank, 10);
  }
}

const Deck = () => {
  const suits = ['♠', '♣', '♥', '♦'];
  const ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

  const [dealerCount, setDealerCount] = useState(0);
  const [playerCount, setPlayerCount] = useState(0);
  const [playerHand, setPlayerHand] = useState([]);
  const [dealerHand, setDealerHand] = useState([]);
  const [gameResult, setGameResult] = useState('');
  const [isShuffling, setIsShuffling] = useState(false);
  const [turn, setTurn] = useState('');
  const [disabled, setDisabled] = useState(false);
  const [isPlayerPaused, setIsPlayerPaused] = useState(false);
  const [isDealerPaused, setIsDealerPaused] = useState(false);
  const [gameEnded, setGameEnded] = useState(false);


  function generateDeck() {
    const newDeck = [];
    for (let suit of suits) {
      for (let rank of ranks) {
        const value = calculateCardValue(rank);
        newDeck.push({ suit, rank, value });
      }
    }
    return shuffleArray(newDeck);
  }

  useEffect(() => {
    generateDeck();
  }, []);

  function handlePlayGame() {
    const deck = generateDeck();
    if (deck.length < 2) {
      alert('Insufficient cards in the deck. Please reset the game.');
      return;
    }

    const drawnCardPlayer = deck.shift();
    const drawnCardDealer = deck.shift();

    setPlayerHand([drawnCardPlayer]);
    setPlayerCount(drawnCardPlayer.value);

    setDealerHand([drawnCardDealer]);
    setDealerCount(drawnCardDealer.value);

    setTurn('player');
  }

  function handlePlayerDraw() {
    const deck = generateDeck();

    const drawnCard = deck.shift();

    setPlayerHand([...playerHand, drawnCard]);
    setPlayerCount(playerCount + drawnCard.value);

    if (playerCount + drawnCard.value > 21) {
      setGameResult('Dealer Wins!');
      setDisabled(true);
    }
  }

  function handleDealerDraw() {
    const deck = generateDeck();

    const drawnCard = deck.shift();

    setDealerHand([...dealerHand, drawnCard]);
    setDealerCount(dealerCount + drawnCard.value);

    if (dealerCount + drawnCard.value > 21) {
      setGameResult('Player Wins!');
      setDisabled(true);
    }
  }


  function handleReset() {
    setDealerCount(0);
    setPlayerCount(0);
    setPlayerHand([]);
    setDealerHand([]);
    setGameResult('');
    setTurn('');
    setDisabled(false);
    setIsPlayerPaused(false);
    setIsDealerPaused(false);
    setGameEnded(false);
  }

  function handleShuffle() {
    setIsShuffling(true);
    setTimeout(() => {
      setIsShuffling(false);
    }, 1000);
  }

  function handlePause() {
    if (turn === 'player') {
      setIsPlayerPaused(true);
      setTurn('dealer');
    } else if (turn === 'dealer') {
      setIsDealerPaused(true);
      handleEndGame();
    }
  }

  function handleEndGame() {
    setDisabled(true);
    setGameEnded(true);

    if (playerCount <= 21 && (dealerCount > 21 || playerCount > dealerCount)) {
      setGameResult('Player Wins!');
    } else if (dealerCount <= 21 && (playerCount > 21 || dealerCount > playerCount)) {
      setGameResult('Dealer Wins!');
    } else {
      setGameResult('It\'s a Tie!');
    }
  }

  return (
    <div>
      <h2 className="text-2xl">Dealer Count: {dealerCount}</h2>
      <h2 className="text-2xl">Player Count: {playerCount}</h2>
      <div className="mt-4 flex flex-row space-x-2">
        {!turn && (
          <button
            className={`bg-blue-500 hover:bg-blue-300 text-white rounded-lg px-4 py-2`}
            onClick={handlePlayGame}
          >
            Start Game
          </button>
        )}
        {turn && (
          <div className={"space-x-2"}>
            <button
              className={`bg-blue-500 hover:bg-blue-300 text-white rounded-lg px-4 py-2 `}
              onClick={turn === 'player' ? handlePlayerDraw : handleDealerDraw}
              disabled={disabled}
            >
              {turn === 'player' ? 'Player Draw' : 'Dealer Draw'}
            </button>
            <button
              className={`bg-red-500 hover:bg-red-300 text-white rounded-lg px-4 py-2 `}
              onClick={handlePause}
              disabled={disabled || (turn === 'player' ? isPlayerPaused : isDealerPaused) || gameEnded}
            >
              Pause
            </button>
          </div>
        )}
        <div className={"space-x-2"}>
          <button
            className={`bg-green-500 text-white rounded-lg px-4 py-2 hover:bg-green-300`}
            onClick={handleReset}
          >
            Reset
          </button>
          <button
            className={`bg-green-500 hover:bg-green-300 text-white rounded-lg px-4 py-2  ${isShuffling ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={handleShuffle}
            disabled={isShuffling}
          >
            Shuffle
          </button>
        </div>
      </div>
      <div className="flex mt-4 gap-x-10">
        <div className={"flex flex-col"}>
          <h2 className="text-2xl">Player's Hand</h2>
          <div className={"flex flex-row gap-x-4"}>
            {playerHand.map((card, index) => (
              <Card
                key={`${card.suit}-${card.rank}-${index}`}
                suit={card.suit}
                rank={card.rank}
                value={card.value}
              />
            ))}
          </div>
        </div>
        <div className={"flex flex-col"}>
          <h2 className="text-2xl ">Dealer's Hand</h2>
          {dealerHand.length > 0 && (
            <div className="flex flex-row gap-x-4">
              {dealerHand.map((card, index) => (
                <Card
                  key={`${card.suit}-${card.rank}-${index}`}
                  suit={card.suit}
                  rank={card.rank}
                  value={card.value}
                />
              ))}
            </div>
          )}
        </div>
      </div>
      {gameResult && <h2 className="text-2xl mt-4">{gameResult}</h2>}
    </div>
  );
};

const Page = () => {
  return (
    <div className="bg-gray-200 min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-8">Blackjack Game</h1>
      <Deck />
    </div>
  );
};

export default Page;





