import fs from "fs";
import fetch from "node-fetch";
import { createCanvas } from "canvas";

const username = process.argv[2];
if (!username) {
  console.error("❌ Please provide a username, e.g. `node generate-contrib-image.js XMODERLIVE`");
  process.exit(1);
}

const API_URL = `https://github-contributions-api.deno.dev/${username}.json`;
const response = await fetch(API_URL);
const data = await response.json();

if (!data.contributions || data.contributions.length === 0) {
  console.error("❌ No contribution data found.");
  process.exit(1);
}

const contributions = data.contributions;

// Canvas settings
const cellSize = 10;
const padding = 2;
const cols = 53; // 53 weeks
const rows = 7;  // 7 days per week
const width = cols * (cellSize + padding);
const height = rows * (cellSize + padding);

const canvas = createCanvas(width, height);
const ctx = canvas.getContext("2d");

// Background
ctx.fillStyle = "#0d1117";
ctx.fillRect(0, 0, width, height);

// Color levels (GitHub-like)
const colors = ["#161b22", "#0e4429", "#006d32", "#26a641", "#39d353"];

// Draw each day's square
contributions.forEach((day, i) => {
  const col = Math.floor(i / 7);
  const row = i % 7;
  const level = day.level ?? 0;
  ctx.fillStyle = colors[level];
  ctx.fillRect(col * (cellSize + padding), row * (cellSize + padding), cellSize, cellSize);
});

// Save the image
fs.writeFileSync("contributions.png", canvas.toBuffer("image/png"));
console.log("✅ contributions.png generated for", username);
