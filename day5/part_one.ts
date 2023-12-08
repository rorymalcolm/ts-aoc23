const path = "./input.txt";
const text = await Deno.readTextFile(path);
const lines = text.split("\n");

const seeds = lines[0]
  .split(":")[1]
  .split(" ")
  .filter((n) => !isNaN(parseInt(n)))
  .map((n) => parseInt(n));

console.log(seeds);
