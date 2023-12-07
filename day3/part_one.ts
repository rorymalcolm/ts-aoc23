const path = "./input.txt";
const text = await Deno.readTextFile(path);

type NumberPosition = {
  line: number;
  startAt: number;
  endAt: number;
};

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

const hasSymbolNearby = (grid: string[][], position: NumberPosition) => {
  for (let i = position.line - 1; i <= position.line + 1; i++) {
    for (let j = position.startAt - 1; j <= position.endAt + 1; j++) {
      if (i >= 0 && i < grid.length && j >= 0 && j < grid[i].length) {
        const char = grid[i][j];
        if (!isNaN(parseInt(char)) || char === ".") {
          continue;
        }
        return true;
      }
    }
  }
  return false;
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

const sum = numberPositionsOnGrid(searchGrid)
  .filter((position) => hasSymbolNearby(searchGrid, position))
  .map((position) => extractNumber(searchGrid, position))
  .reduce((x, y) => x + y, 0);

console.log(sum);
