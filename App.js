import "./App.css";
import { useEffect, useState } from "react";

const App = () => {
  const [allPokemon, setAllPokemon] = useState([]);
  const [displayPokemon, setDisplayPokemon] = useState([]);
  const [winningPokemon, setWinningPokemon] = useState(null);
  const [winningImage, setWinningImage] = useState("");
  const [isStarted, setIsStarted] = useState(false);
  const [scoreboardCorrect, setScoreboardCorrect] = useState(0);
  const [loading, setLoading] = useState(true);
  const [winningPokemonIndex, setWinningPokemonIndex] = useState(0);

  useEffect(() => {
    const fetchAllPokemon = async () => {
      const result = await fetch("https://pokeapi.co/api/v2/pokemon?limit=20");
      const data = await result.json();
      setAllPokemon(data.results);
    };

    fetchAllPokemon();
  }, []);

  const getDisplayPokemon = () => {
    if (winningPokemonIndex < 20) {
      const randomArray = [...allPokemon];
      let i = randomArray.length - 1;
      let j;
      let temp;

      setWinningPokemon(randomArray.splice(winningPokemonIndex, 1)[0]);

      while (--i > 0) {
        j = Math.floor(Math.random() * (i + 1));
        temp = randomArray[j];
        randomArray[j] = randomArray[i];
        randomArray[i] = temp;
      }
      const firstFour = randomArray.slice(0, 3);

      firstFour.splice(
        Math.floor(Math.random() * firstFour.length + 1),
        0,
        winningPokemon
      );
      setDisplayPokemon(firstFour);
    } else {
      setIsStarted((prev) => !prev);
      if (winningPokemonIndex) {
        alert(
          `Game over! You scored ${Math.trunc(
            (scoreboardCorrect / (winningPokemonIndex + 1)) * 100
          )}%`
        );
      }
    }
  };

  useEffect(() => {
    if (winningPokemon) {
      const fetchWinningPokemonImage = async () => {
        const result = await fetch(winningPokemon.url);
        const data = await result.json();
        setWinningImage(data.sprites.front_default);
        setLoading(false);
      };
      fetchWinningPokemonImage();
      getDisplayPokemon();
    }
  }, [winningPokemon]);

  const checkWinner = (pokemon) => {
    if (pokemon.name === winningPokemon.name) {
      setScoreboardCorrect((prev) => prev + 1);
    }
    setWinningPokemonIndex((prev) => prev + 1);

    console.log(winningPokemonIndex);
  };

  useEffect(getDisplayPokemon, [winningPokemonIndex]);

  const startGame = () => {
    setIsStarted((prev) => !prev);
    getDisplayPokemon();
    setScoreboardCorrect(0);
  };

  useEffect(() => {
    setScoreboardCorrect(0);
    setWinningPokemonIndex(0);
  }, [isStarted]);

  if (isStarted) {
    return (
      <div className=" background">
        <div className="App">
          {loading ? (
            "Loading..."
          ) : (
            <div className="body">
              <div className="header">Name that Pokemon!</div>
              <div>Round {winningPokemonIndex} out of 20</div>
              <img className="img" src={winningImage} />
              <div className="btn-container">
                {displayPokemon.map((pokemon) => (
                  <button className="btn" onClick={() => checkWinner(pokemon)}>
                    {pokemon.name}
                  </button>
                ))}
              </div>
              <div>Total Score: {scoreboardCorrect} Correct</div>
            </div>
          )}
        </div>
      </div>
    );
  } else {
    return (
      <div className="App background">
        <button className="btn" onClick={() => startGame()}>
          Start Game
        </button>
      </div>
    );
  }
};

export default App;
