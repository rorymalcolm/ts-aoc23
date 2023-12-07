const path = "./input.txt";
const text = await Deno.readTextFile(path);

const lines = text.split("\n");

const onlyNumeric = (line: string) => {
  for (const char of line) {
    if (isNaN(parseInt(char))) {
      return false;
    }
    return true;
  }
};

const sum = lines
  .map((line) => {
    line = line.split("").filter(onlyNumeric).join("");
    if (line === "" || line.length === 0) {
      return 0;
    } else if (line.length === 1) {
      return parseInt(`${line[0]}${line[0]}`);
    } else {
      const first = parseInt(line[0]);
      const last = parseInt(line[line.length - 1]);
      return parseInt(`${first}${last}`);
    }
  })
  .reduce((acc, curr) => acc + curr);

console.log(sum);
