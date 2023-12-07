const path = "./input.txt";
const text = await Deno.readTextFile(path);

const lines = text.split("\n");

type GameState = {
  gameID: number;
  turns: TurnState;
};

type TurnState = {
  amount: number;
  colour: string;
}[][];

type Maxs = {
  gameID: number;
  maxs: {
    red: number;
    blue: number;
    green: number;
  };
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

const maxForGame = (game: GameState): Maxs => {
  const turns = game.turns;
  const red = turns.map((moves) =>
    moves.filter((move) => move.colour === "red")
  );
  const blue = turns.map((moves) =>
    moves.filter((move) => move.colour === "blue")
  );
  const green = turns.map((moves) =>
    moves.filter((move) => move.colour === "green")
  );
  const colourMax = (turn: TurnState) =>
    turn
      .flatMap((turn) => turn.map((move) => move.amount))
      .sort((a, b) => a - b)
      .reverse()[0] || 0;
  const redMax = colourMax(red);
  const blueMax = colourMax(blue);
  const greenMax = colourMax(green);
  return {
    gameID: game.gameID,
    maxs: {
      red: redMax,
      blue: blueMax,
      green: greenMax,
    },
  };
};

const powerOf = (maxs: Maxs) =>
  maxs.maxs.blue * maxs.maxs.green * maxs.maxs.red;

console.log(
  lines
    .map(parseGameIDAndGame)
    .map(maxForGame)
    .map(powerOf)
    .reduce((x, y) => x + y, 0)
);
