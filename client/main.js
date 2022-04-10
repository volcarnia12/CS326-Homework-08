import { Game } from './game.js';
import * as utils from './scrabbleUtils.js';
//import { dictionary } from './dictionary.js';
import { Rack } from './rack.js';

async function loadDictionary(){
  const value = await fetch('./dictionary.JSON');
  dictionary = await value.json(); 
  return dictionary;
}

let dictionary = loadDictionary();

const turn = document.getElementById('playerTurn');
const player1 = document.getElementById('player1');
const player2 = document.getElementById('player2');
//document.getElementById('playerTurn').innerText = "Hello";
if (!turn.hasChildNodes()){
  let node = document.createTextNode("Input player names. The name in the first rack will go first!")
  turn.appendChild(node);
}

const game = new Game();
const board = document.getElementById('board');
game.render(board);

let playerTurn = true;

const rack1 = new Rack();
const rack2 = new Rack();
rack1.takeFromBag(7, game);
rack1.render(document.getElementById('rack'));
rack2.takeFromBag(7, game);
rack2.render(document.getElementById('rack2'));

document.getElementById('reset').addEventListener('click', () => {
  game.reset();
  game.render(board);
});

document.getElementById('play').addEventListener('click', () => {


  const word = document.getElementById('word').value;
  const x = parseInt(document.getElementById('x').value);
  const y = parseInt(document.getElementById('y').value);
  const direction = document.getElementById('direction').value === 'horizontal';

  if (playerTurn){
    if (
      !utils.canConstructWord(rack1.getAvailableTiles(), word) ||
      !dictionary.includes(word)
    ) {
      alert(`The word ${word} cannot be constructed.`);
      console.log(utils.canConstructWord(rack1.getAvailableTiles(), word));
      console.log(dictionary.includes(word));
      console.log('---');
    } else {
      if (
        game.playAt(
          utils.constructWord(rack1.getAvailableTiles(), word).join(''),
          { x, y },
          direction
        ) !== -1
      ) {
        game.render(board);
  
        const used = utils.constructWord(rack1.getAvailableTiles(), word);
        used.forEach((tile) => rack1.removeTile(tile));
        rack1.takeFromBag(used.length, game);
        rack1.render(document.getElementById('rack'));
      }
    }
  }
  else{
    if (
      !utils.canConstructWord(rack2.getAvailableTiles(), word) ||
      !dictionary.includes(word)
    ) {
      alert(`The word ${word} cannot be constructed.`);
      console.log(utils.canConstructWord(rack2.getAvailableTiles(), word));
      console.log(dictionary.includes(word));
      console.log('---');
    } else {
      if (
        game.playAt(
          utils.constructWord(rack2.getAvailableTiles(), word).join(''),
          { x, y },
          direction
        ) !== -1
      ) {
        game.render(board);
  
        const used = utils.constructWord(rack2.getAvailableTiles(), word);
        used.forEach((tile) => rack2.removeTile(tile));
        rack2.takeFromBag(used.length, game);
        rack2.render(document.getElementById('rack2'));
      }
    }
  }
  if (!playerTurn){
    turn.removeChild(turn.firstChild);
    let value = player1.value;
    let node = document.createTextNode("It is " + value + "'s Turn!")
    turn.appendChild(node);
  }
  else{
    turn.removeChild(turn.firstChild);
    let value = player2.value;
    let node = document.createTextNode("It is " + value + "'s Turn!")
    turn.appendChild(node);
  }
  playerTurn = !playerTurn;
});

document.getElementById('help').addEventListener('click', () => {
  if (playerTurn){
    const possibilities = utils.bestPossibleWords(rack1.getAvailableTiles());
    const hint = possibilities[Math.floor(Math.random() * possibilities.length)];
    document.getElementById('hint').innerText = hint;
  }
  else{
    const possibilities = utils.bestPossibleWords(rack2.getAvailableTiles());
    const hint = possibilities[Math.floor(Math.random() * possibilities.length)];
    document.getElementById('hint').innerText = hint;
  }
});
