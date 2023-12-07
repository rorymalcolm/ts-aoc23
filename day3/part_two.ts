const path = "./input.txt";
const text = await Deno.readTextFile(path);

type NumberPosition = {
  line: number;
  startAt: number;
  endAt: number;
};

function cogPositionsOnGrid(searchGrid: string[][]) {
  const pos = [];
  for (let i = 0; i < searchGrid.length; i++) {
    const line = searchGrid[i];
    for (let j = 0; j < line.length; j++) {
      const char = line[j];
      if (char === "*") {
        pos.push({
          line: i,
          startAt: j,
          endAt: j,
        });
      }
    }
  }
  return pos;
}

function numberPositionsOnGrid(searchGrid: string[][]) {
  const pos = [];
  for (let i = 0; i < searchGrid.length; i++) {
    const line = searchGrid[i];
    let currentNumberLength = 0;
    let currentStartAt = -1;
    for (let j = 0; j < line.length; j++) {
      const char = line[j];
      if (!isNaN(parseInt(char))) {
        if (currentStartAt === -1) {
          currentStartAt = j;
        }
        currentNumberLength++;
      } else {
        if (currentNumberLength > 0) {
          pos.push({
            line: i,
            startAt: currentStartAt,
            endAt: currentStartAt + currentNumberLength - 1,
          });
          currentNumberLength = 0;
          currentStartAt = -1;
        }
      }
    }
    // Check if the last character of the line is a number
    if (currentNumberLength > 0) {
      pos.push({
        line: i,
        startAt: currentStartAt,
        endAt: currentStartAt + currentNumberLength - 1,
      });
    }
  }
  return pos;
}

const cogWithinTwoLines = (cog: NumberPosition, num: NumberPosition) =>
  cog.line === num.line ||
  cog.line === num.line + 1 ||
  cog.line === num.line - 1;

const cogWithinOneSquare = (cog: NumberPosition, num: NumberPosition) =>
  cog.startAt === num.startAt - 1 ||
  cog.endAt === num.endAt + 1 ||
  (cog.startAt >= num.startAt && cog.endAt <= num.endAt);

const cogNumberPair = (cogs: NumberPosition[], nums: NumberPosition[]) => {
  const pairs: {
    [k: number]: {
      pair: NumberPosition[];
    };
  } = [];
  for (let i = 0; i < cogs.length; i++) {
    const cog = cogs[i];
    for (let j = 0; j < nums.length; j++) {
      const num = nums[j];
      if (cogWithinTwoLines(cog, num) && cogWithinOneSquare(cog, num)) {
        if (!pairs[i]) {
          pairs[i] = {
            pair: [num],
          };
        } else {
          pairs[i].pair.push(num);
        }
      }
    }
  }
  return Object.entries(pairs)
    .filter((k) => k[1].pair.length === 2)
    .map((k) => k[1].pair);
};

export const extractNumber = (grid: string[][], position: NumberPosition) => {
  let number = "";
  for (let i = position.startAt; i <= position.endAt; i++) {
    const char = grid[position.line][i];
    if (parseInt(char) || char === "0") {
      number += char;
    }
  }
  return parseInt(number);
};

const searchGrid = text.split("\n").map((line) => line.split(""));

const cogs = cogPositionsOnGrid(searchGrid);
const nums = numberPositionsOnGrid(searchGrid);

console.log(
  cogNumberPair(cogs, nums)
    .map(
      (pair) =>
        extractNumber(searchGrid, pair[0]) * extractNumber(searchGrid, pair[1])
    )
    .reduce((x, y) => x + y, 0)
);
