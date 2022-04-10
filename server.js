import * as http from 'http';
import * as url from 'url';
import { readFile, writeFile } from 'fs/promises';

let words = [];
let games = [];

const JSONfile = 'words.json';
const JSONfile2 = 'games.json';

const headerFields = { 'Content-Type': 'application/json' };

async function reload(filename) {
  try {
    const data = await readFile(filename, { encoding: 'utf8' });
    words = JSON.parse(data);
  } catch (err) {
    words = [];
  }
}

async function saveWords() {
  try {
    const data = JSON.stringify(words);
    await writeFile(JSONfile, data, { encoding: 'utf8' });
  } catch (err) {
    console.log(err);
  }
}

async function saveGames() {
  try {
    const data = JSON.stringify(games);
    await writeFile(JSONfile2, data, { encoding: 'utf8' });
  } catch (err) {
    console.log(err);
  }
}


async function wordScore(response, name, word, score) {
  if (score === undefined || name === undefined || word === undefined) {
    // 400 - Bad Request
    response.writeHead(400, headerFields);
    response.write({ error: 'Score, Name, or Word Required' });
    response.end();
  } else {
    await reload(JSONfile);
    words.push({ name: name, word: word, score: score });
    await saveWords();
    response.writeHead(200, headerFields);
    response.end();
  }
}

async function bestWordScores(response) {
  await reload(JSONfile);
  if (words.length <= 10){
    response.writeHead(200, headerFields);
    response.write(JSON.stringify(words));
    response.end();
  }
  else{
    let sortedArray = words.sort((a,b) => b.score - a.score);
    let result = [];
    for (let i = 0; i < 10; ++i){
      result.push(sortedArray[i]);
    }
    response.writeHead(200, headerFields);
    response.write(JSON.stringify(result));
    response.end();
  }
}

async function gameScore(response, name, score) {
  if (score === undefined || name === undefined) {
    // 400 - Bad Request
    response.writeHead(400, headerFields);
    response.write({ error: 'Score or Name Required' });
    response.end();
  } else {
    await reload(JSONfile);
    games.push({ name: name, score: score });
    await saveGames();
    response.writeHead(200, headerFields);
    response.end();
  }
}

async function bestGameScores(response) {
  await reload(JSONfile);
  if (words.length <= 10){
    response.write(JSON.stringify(games));
    response.end();
  }
  else{
    let sortedArray = games.sort((a,b) => b.score - a.score);
    let result = [];
    for (let i = 0; i < 10; ++i){
      result.push(sortedArray[i]);
    }
    response.writeHead(200, headerFields);
    response.write(JSON.stringify(result));
    response.end();
  }
}


async function basicServer(request, response) {
  const parsedURL = url.parse(request.url, true);
  const options = parsedURL.query;
  const pathname = parsedURL.pathname;
  const method = request.method;

  if (method == 'POST' && pathname.startsWith('/wordScore')) {
    wordScore(response, options.name, options.word, options.score);
  } 
  else if (method == 'GET' && pathname.startsWith('/highestWordScores')) {
    bestWordScores(response);
  }
  else if (method == 'POST' && pathname.startsWith('/gameScore')) {
    gameScore(response, options.name, options.score);
  }
  else if (method == 'GET' && pathname.startsWith('/highestGameScores')) {
    bestGameScores(response);
  } 
  else {
    response.writeHead(404, headerFields);
    response.write(JSON.stringify({ error: 'Not Found' }));
    response.end();
  }
}

// Start the server on port 3000.
http.createServer(basicServer).listen(3000, () => {
  console.log('Server started on port 3000');
});
