const path = "./input.txt";
const text = await Deno.readTextFile(path);
const lines = text.split("\n");

const parseGame = (line: string) => {
  const sides = line.split("|");
  const winningNumbers = sides[0].split(":")[1];
  const myNumbers = sides[1];
  const winningNumbersArray = winningNumbers
    .split(" ")
    .filter((n) => !isNaN(parseInt(n)))
    .map((n) => parseInt(n));
  const myNumbersArray = myNumbers
    .split(" ")
    .filter((n) => !isNaN(parseInt(n)))
    .map((n) => parseInt(n));
  return {
    winningNumbers: winningNumbersArray,
    myNumbers: myNumbersArray,
  };
};

const pointAllocation = (score: number) => {
  if (score === 0) {
    return 0;
  } else if (score === 1) {
    return 1;
  } else {
    let currentScore = 1;
    for (let i = 1; i < score; i++) {
      currentScore = currentScore * 2;
    }
    return currentScore;
  }
};

const scoreGame = (game: ReturnType<typeof parseGame>) => {
  const winningNumbers = game.winningNumbers;
  const myNumbers = game.myNumbers;
  const score = myNumbers.filter((n) => winningNumbers.includes(n)).length;
  return score;
};

console.log(
  lines
    .map((line) => parseGame(line))
    .map(scoreGame)
    .map(pointAllocation)
    .reduce((a, b) => a + b, 0)
);
