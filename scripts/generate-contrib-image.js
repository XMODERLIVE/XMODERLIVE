import fs from "fs";
import fetch from "node-fetch";
import { createCanvas } from "canvas";

const username = process.argv[2];
const API_URL = `https://github-contributions-api.deno.dev/${username}.json`;

const response = await fetch(API_URL);
const data = await response.json();

// Canvas setup
const cellSize = 12;
const padding = 2;
const cols = data.contributions.length;
const rows = data.contributions[0].weeks.length;
const width = cols * (cellSize + padding);
const height = rows * (cellSize + padding);

const canvas = createCanvas(width, height);
const ctx = canvas.getContext("2d");

ctx.fillStyle = "#0d1117"; // background (GitHub dark)
ctx.fillRect(0, 0, width, height);

// Draw cells
data.contributions.forEach((day, i) => {
  day.weeks.forEach((week, j) => {
    const level = week.level;
    const colors = ["#161b22", "#0e4429", "#006d32", "#26a641", "#39d353"];
    ctx.fillStyle = colors[level];
    ctx.fillRect(i * (cellSize + padding), j * (cellSize + padding), cellSize, cellSize);
  });
});

const buffer = canvas.toBuffer("image/png");
fs.writeFileSync("contributions.png", buffer);

console.log("✅ Contribution image generated as contributions.png");
