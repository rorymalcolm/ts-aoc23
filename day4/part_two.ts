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
  const extractNumeric = (str: string) => {
    const matches = str.match(/\d+/g);
    if (matches) {
      return matches.map((match) => parseInt(match))[0];
    } else {
      return [];
    }
  };
  return {
    cardNumber: extractNumeric(sides[0].split(":")[0]) as number,
    winningNumbers: winningNumbersArray,
    myNumbers: myNumbersArray,
  };
};

const scoreGame = (game: ReturnType<typeof parseGame>) => {
  const winningNumbers = game.winningNumbers;
  const myNumbers = game.myNumbers;
  const score = myNumbers.filter((n) => winningNumbers.includes(n)).length;
  return { cardNumber: game.cardNumber, score: score };
};

const cardCount: { [k: string]: number } = {};

lines
  .map((line) => parseGame(line))
  .map(scoreGame)
  .forEach((game) => {
    if (cardCount[game.cardNumber]) {
      cardCount[game.cardNumber] += 1;
    } else {
      cardCount[game.cardNumber] = 1;
    }
    for (let i = 1; i < game.score + 1; i++) {
      if (game.cardNumber + i > lines.length) {
        continue;
      }
      if (cardCount[game.cardNumber + i]) {
        cardCount[game.cardNumber + i] += cardCount[game.cardNumber];
      } else {
        cardCount[game.cardNumber + i] = 1;
      }
      console.table(cardCount);
    }
  });

console.table(cardCount);
console.log(Object.values(cardCount).reduce((a, b) => a + b, 0));
