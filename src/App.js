/* CSS */
import './App.css';

/* React */
import { useCallback, useEffect, useState } from 'react';

/* Data */
import { wordsList } from './folder-data/Words';

/* Components */
import StartScreen from './folder.components/JS/StartScreen';
import Game from './folder.components/JS/Game';
import GameOver from './folder.components/JS/GameOver';

const stages = [
  {id: 0, name: "start"},
  {id: 1, name: "game"},
  {id: 2, name: "end"}
]

const guessesQty = 3;

/* React */
function App() {
  const [gameStage, setGameStage] = useState(stages[0].name);
  const [words] = useState(wordsList);
  const [pickedWord, setPickedWord] = useState("");
  const [pickedCategory, setPickedCategory] = useState("");
  const [letters, setLetters] = useState([]);
  const [guessedLetters, setGuessedLetters] = useState([]);
  const [wrongLetters, setWrongLetters] = useState([]);
  const [guesses, setGuesses] = useState(guessesQty);
  const [score, setScore] = useState(0);

  const wordAndCategory = useCallback(() => {
    const categories = Object.keys(words);
    const category = categories[Math.floor(Math.random() * Object.keys(categories).length)]
 
    const word = words[category][Math.floor(Math.random() * words[category].length)]
    return {word, category}
  }, [words]);

  const startGame = useCallback(() => {
    const {word, category} = wordAndCategory();
    let wordLetters = word.split("");
    wordLetters = wordLetters.map((l) => l.toLowerCase())

    setPickedWord(word)
    setPickedCategory(category)
    setLetters(wordLetters)

    clearLetterStates();

    setGameStage(stages[1].name)
  }, [wordAndCategory]);

  const verifyLetter = (letter) => {
    const normalizedLetter = letter.toLowerCase();

    if(guessedLetters.includes(normalizedLetter) || wrongLetters.includes(normalizedLetter)){
      return;
    }

    if(letters.includes(normalizedLetter)){
      setGuessedLetters((actualGuessedLetters) => [
        ...actualGuessedLetters, normalizedLetter
      ])
    } else {
      setWrongLetters((actualWrongLetters) => [
        ...actualWrongLetters, normalizedLetter
      ])

      setGuesses((actualGuesses) => actualGuesses - 1)
    }
  }

  const clearLetterStates = () => {
    setGuessedLetters([]);
    setWrongLetters([]);
  }

  useEffect(() => {
    if (guesses <= 0) {
      clearLetterStates();
      setGameStage(stages[2].name)
    }
  }, [guesses]);

  useEffect(() => {
    const uniqueLetters = [... new Set(letters)];

    if(guessedLetters.length === uniqueLetters.length && gameStage === stages[1].name){
      setScore((actualScore) => (actualScore += 100));

      startGame();
    }

  }, [guessedLetters])

  const retry = () => {
    setScore(0);
    setGuesses(guessesQty);
    setGameStage(stages[0].name)
  }

  return (
    <div className="App">
      {gameStage === "start" && <StartScreen startGame={startGame}/>}
      {gameStage === "game" && 
        <Game 
          verifyLetter={verifyLetter}
          pickedWord={pickedWord}
          pickedCategory={pickedCategory}
          letters={letters}
          guessedLetters={guessedLetters}
          wrongLetters={wrongLetters}
          guesses={guesses}
          score={score}
        />}
      {gameStage === "end" && <GameOver retry={retry} score={score}/>}
    </div>
  );
}

export default App;
