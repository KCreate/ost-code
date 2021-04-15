// template game-service API
import {
  getRankings,
  evaluateHand,
} from './game-service.js';

// register DOM nodes
const domStartPage = document.getElementById('startpage');
const domStartPageScoreBoardEntryContainer = document.getElementById('startpage-scoreboard-entry-container');
const domStartPageForm = document.getElementById('startpage-form');
const domStartPageFormName = document.getElementById('startpage-form-name');

const domGamePage = document.getElementById('gamepage');
const domGamePageUsername = document.getElementById('gamepage-username');
const domGamePageChoiceScissor = document.getElementById('gamepage-choice-scissor');
const domGamePageChoiceStone = document.getElementById('gamepage-choice-stone');
const domGamePageChoicePaper = document.getElementById('gamepage-choice-paper');
const domGamePageStatusline = document.getElementById('gamepage-statusline');
const domGamePageEnemyChoice = document.getElementById('gamepage-enemy-choice');
const domGamePageBackButton = document.getElementById('gamepage-back-button');
const domGamePageHistory = document.getElementById('gamepage-history');

// game states
//
//          ┌──────┐
//          │ Main │ application is on the landing page,
//          └─▲───┬┘ the leaderboard is shown
//            │   │
//            │   │
//            │   │
//      ┌─────┴───▼───┐
//      │ Choose Move │ user has ability to choose a move
//      └─▲─────────┬─┘
//        │         │
//        │         │
//        │         │
// ┌──────┴──┐     ┌▼───────┐
// │ Timeout ◄─────┤ Battle │ enemy is now choosing a move
// └─────────┘     └────────┘
//
const kStateMain = 0;
const kStateChooseMove = 1;
const kStateBattle = 2;
const kStateTimeout = 3;

// moves
const kMoveScissor = 'scissors';
const kMoveStone = 'stone';
const kMovePaper = 'paper';

const kMoveDisplayNames = {
  scissors: 'Schere',
  stone: 'Stein',
  paper: 'Papier',
};

// ms to wait between turns
const kGameDelay = 1500;

// builds the DOM structure for a scoreboard entry
function createStartScoreboardEntryNode(ranking) {
  const node = document.createElement('div');
  node.classList.add('startpage-scoreboard-entry');

  const header = document.createElement('p');
  const playerList = document.createElement('p');

  header.textContent = `${ranking.rank}. Platz mit ${ranking.wins} Siegen`;

  for (let i = 0; i < ranking.players.length; i++) {
    const player = ranking.players[i];

    if (i !== 0) {
      playerList.textContent += ', ';
    }

    playerList.textContent += player;
  }

  node.appendChild(header);
  node.appendChild(playerList);

  return node;
}

// builds the DOM structure for a game screen scoreboard entry
function createGameScoreboardEntryNode(ranking) {
  const node = document.createElement('tr');

  const result = document.createElement('td');
  const userHand = document.createElement('td');
  const enemyHand = document.createElement('td');

  result.dataset.gameEval = ranking.gameEval;

  // -1     -> win
  //  0     -> tied
  //  1     -> lose
  result.textContent = ['Gewonnen', 'Unentschieden', 'Verloren'][ranking.gameEval + 1];
  userHand.textContent = kMoveDisplayNames[ranking.playerHand];
  enemyHand.textContent = kMoveDisplayNames[ranking.systemHand];

  node.appendChild(result);
  node.appendChild(userHand);
  node.appendChild(enemyHand);

  return node;
}

// the StonePaperScissorGame class manages the game model and the UI update lifecycle
class StonePaperScissorGame {
  constructor() {
    this.state = kStateMain;
    this.username = null;
    this.user_choice = null;
    this.enemy_choice = null;
    this.game_eval = null;
    this.game_history = [];

    this.selected_choice_dom_button = null;

    // start page username form submit
    domStartPageForm.onsubmit = () => {
      this.playGame(domStartPageFormName.value);
      return false; // don't reload page
    };

    // game page back button
    domGamePageBackButton.onclick = () => {
      this.exitGame();
    };

    // move choice buttons
    domGamePageChoiceScissor.onclick = () => {
      this.chooseMove(kMoveScissor);
    };
    domGamePageChoiceStone.onclick = () => {
      this.chooseMove(kMoveStone);
    };
    domGamePageChoicePaper.onclick = () => {
      this.chooseMove(kMovePaper);
    };

    this.updateView();
  }

  playGame(username) {
    if (this.state !== kStateMain) {
      throw new Error('Invalider Spielzustand!');
    }

    this.state = kStateChooseMove;
    this.username = username;
    this.updateView();
  }

  exitGame() {
    if (this.state !== kStateChooseMove) {
      throw new Error('Invalider Spielzustand!');
    }

    this.state = kStateMain;
    this.username = null;
    this.game_history = [];
    this.updateView();
  }

  chooseMove(choice) {
    if (this.state !== kStateChooseMove) {
      throw new Error('Invalider Spielzustand!');
    }

    this.user_choice = choice;

    // change into battle mode until the enemy has choosen his move
    this.state = kStateBattle;
    this.updateView();

    evaluateHand(this.username, choice, (result) => {
      this.enemy_choice = result.systemHand;
      this.game_eval = result.gameEval;
      this.game_history.push(result);

      this.state = kStateTimeout;
      this.updateView();

      setTimeout(() => {
        this.user_choice = null;
        this.enemy_choice = null;
        this.game_eval = null;
        this.selected_choice_dom_button = null;

        this.state = kStateChooseMove;
        this.updateView();
      }, kGameDelay);
    });
  }

  updateView() {
    // hide or show relevant game pages
    if (this.state === kStateMain) {
      domStartPage.classList.remove('element-hidden');
      domGamePage.classList.add('element-hidden');
    } else {
      domStartPage.classList.add('element-hidden');
      domGamePage.classList.remove('element-hidden');
    }

    switch (this.state) {
      case kStateMain: {
        this.updateMainScoreboard();

        domStartPageFormName.value = '';

        break;
      }
      case kStateChooseMove: {
        domGamePageChoiceScissor.disabled = false;
        domGamePageChoiceStone.disabled = false;
        domGamePageChoicePaper.disabled = false;
        domGamePageBackButton.disabled = false;

        domGamePageChoiceScissor.classList.remove('selected_by_user', 'winning_choice', 'tie_choice', 'lost_choice');
        domGamePageChoiceStone.classList.remove('selected_by_user', 'winning_choice', 'tie_choice', 'lost_choice');
        domGamePageChoicePaper.classList.remove('selected_by_user', 'winning_choice', 'tie_choice', 'lost_choice');

        domGamePageEnemyChoice.classList.remove('winning_choice', 'tie_choice', 'lost_choice');

        domGamePageUsername.textContent = this.username;
        domGamePageStatusline.textContent = 'Du bist am Zug...';
        domGamePageEnemyChoice.textContent = '??';
        this.updateGameScoreboard();
        break;
      }
      case kStateBattle: {
        domGamePageChoiceScissor.disabled = true;
        domGamePageChoiceStone.disabled = true;
        domGamePageChoicePaper.disabled = true;
        domGamePageBackButton.disabled = true;

        switch (this.user_choice) {
          case kMoveScissor: {
            domGamePageChoiceScissor.classList.add('selected_by_user');
            this.selected_choice_dom_button = domGamePageChoiceScissor;
            break;
          }
          case kMoveStone: {
            domGamePageChoiceStone.classList.add('selected_by_user');
            this.selected_choice_dom_button = domGamePageChoiceStone;
            break;
          }
          case kMovePaper: {
            domGamePageChoicePaper.classList.add('selected_by_user');
            this.selected_choice_dom_button = domGamePageChoicePaper;
            break;
          }
          default: {
            throw new Error('unexpected choice');
          }
        }

        domGamePageStatusline.textContent = 'Gegner ist am Zug...';
        this.updateGameScoreboard();
        break;
      }
      case kStateTimeout: {
        domGamePageChoiceScissor.disabled = true;
        domGamePageChoiceStone.disabled = true;
        domGamePageChoicePaper.disabled = true;
        domGamePageBackButton.disabled = true;

        this.selected_choice_dom_button.classList.remove('selected_by_user');

        switch (this.game_eval) {
          case -1: { // won
            this.selected_choice_dom_button.classList.add('winning_choice');
            domGamePageEnemyChoice.classList.add('lost_choice');
            break;
          }
          case 0: { // tie
            this.selected_choice_dom_button.classList.add('tie_choice');
            domGamePageEnemyChoice.classList.add('tie_choice');
            break;
          }
          case 1: { // lost
            this.selected_choice_dom_button.classList.add('lost_choice');
            domGamePageEnemyChoice.classList.add('winning_choice');
            break;
          }
          default: {
            throw new Error('unexpected value');
          }
        }

        domGamePageStatusline.textContent = 'Nächste Runde beginnt in Kürze';
        domGamePageEnemyChoice.textContent = kMoveDisplayNames[this.enemy_choice];
        this.updateGameScoreboard();
        break;
      }
      default: {
        throw new Error('unexpected state');
      }
    }
  }

  updateMainScoreboard() {
    getRankings((ranking) => {
      if (this.state === kStateMain) {
        // clear scoreboard
        const container = domStartPageScoreBoardEntryContainer;
        while (container.lastElementChild) {
          container.removeChild(container.lastElementChild);
        }

        // display the top 10 ranks
        for (let i = 0; i < ranking.length && i < 10; i++) {
          const entry = ranking[i];
          const entryDomNode = createStartScoreboardEntryNode(entry);
          domStartPageScoreBoardEntryContainer.appendChild(entryDomNode);
        }
      }
    });
  }

  updateGameScoreboard() {
    // remove all the previous entries, except for the table header
    while (domGamePageHistory.childElementCount > 1) {
      domGamePageHistory.removeChild(domGamePageHistory.lastElementChild);
    }

    // insert new entries
    for (let i = 0; i < this.game_history.length; i++) {
      const result = this.game_history[i];
      const resultDomNode = createGameScoreboardEntryNode(result);
      domGamePageHistory.appendChild(resultDomNode);
    }
  }
}

// wait for the document to be ready
const game = new StonePaperScissorGame();
document.addEventListener('DOMContentLoaded', () => {
  game.updateView();
});
