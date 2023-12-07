const path = "./input.txt";
const text = await Deno.readTextFile(path);

const lines = text.split("\n");

type GameState = {
  gameID: number;
  turns: {
    amount: number;
    colour: string;
  }[][];
};

const parseGameIDAndGame = (line: string) => {
  const [gameID, game] = line.split(":");
  const gameIDNumber = parseInt(gameID.split(" ")[1]);
  const turns = game
    .split(";")
    .map((turn) => turn.trim())
    .map((turn) => {
      const moves = turn.split(",");
      return moves.map((move) => {
        const trim = move.trim();
        const [amount, colour] = trim.split(" ");
        return { amount: parseInt(amount), colour };
      });
    });
  return { gameID: gameIDNumber, turns };
};

const validTurn = (
  redCount: number,
  blueCount: number,
  greenCount: number,
  turn: {
    amount: number;
    colour: string;
  }[]
) => {
  const red = turn.filter((move) => move.colour === "red");
  const blue = turn.filter((move) => move.colour === "blue");
  const green = turn.filter((move) => move.colour === "green");
  let valid = true;
  if (red.length === 1 && red[0].amount > redCount) {
    valid = false;
  }
  if (blue.length === 1 && blue[0].amount > blueCount) {
    valid = false;
  }
  if (green.length === 1 && green[0].amount > greenCount) {
    valid = false;
  }
  return valid;
};

const validGame = (
  redCount: number,
  blueCount: number,
  greenCount: number,
  game: GameState
) => {
  return game.turns.every((turn) =>
    validTurn(redCount, blueCount, greenCount, turn)
  );
};

const validGames = (
  redCount: number,
  blueCount: number,
  greenCount: number,
  games: GameState[]
) => {
  return games.filter((game) =>
    validGame(redCount, blueCount, greenCount, game)
  );
};

console.log(
  validGames(12, 14, 13, lines.map(parseGameIDAndGame))
    .map((game) => game.gameID)
    .reduce((acc, curr) => acc + curr)
);
