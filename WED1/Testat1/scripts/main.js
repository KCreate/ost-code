// template game-service API
import {
  HANDS,
  isConnected,
  getRankings,
  evaluateHand
} from './game-service.js';

window.someglobal = {
  isConnected,
  getRankings,
};

// register DOM nodes
const domStartPage                         = document.getElementById("startpage");
const domStartPageScoreBoardContainer      = document.getElementById("startpage-scoreboard-container");
const domStartPageScoreBoardEntryContainer = document.getElementById("startpage-scoreboard-entry-container");
const domStartPageFormContainer            = document.getElementById("startpage-form-container");
const domStartPageFormStatusline           = document.getElementById("startpage-statusline");
const domStartPageForm                     = document.getElementById("startpage-form");
const domStartPageFormName                 = document.getElementById("startpage-form-name");

const domGamePage                = document.getElementById("gamepage");
const domGamePageUsername        = document.getElementById("gamepage-username");
const domGamePageChoiceContainer = document.getElementById("gamepage-choice-container");
const domGamePageChoiceScissor   = document.getElementById("gamepage-choice-scissor");
const domGamePageChoiceStone     = document.getElementById("gamepage-choice-stone");
const domGamePageChoicePaper     = document.getElementById("gamepage-choice-paper");
const domGamePageActivity        = document.getElementById("gamepage-activity");
const domGamePageStatusline      = document.getElementById("gamepage-statusline");
const domGamePageEnemyChoice     = document.getElementById("gamepage-enemy-choice");
const domGamePageBackButton      = document.getElementById("gamepage-back-button");
const domGamePageHistory         = document.getElementById("gamepage-history");

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
const kStateMain       = 0;
const kStateChooseMove = 1;
const kStateBattle     = 2;
const kStateTimeout    = 3;

// moves
const kMoveScissor = "scissors";
const kMoveStone = "stone";
const kMovePaper = "paper";

// UI text
const kErrorInvalidUsername = "Bitte geben Sie einen validen Nutzernamen ein!";
const kErrorInvalidGameState = "Invalider Spielzustand!";

const kGameDelay = 300; // ms to wait between turns

// builds the DOM structure for a scoreboard entry
function createStartScoreboardEntryNode(ranking) {
  const node = document.createElement("div");
  node.classList.add("startpage-scoreboard-entry");

  const header = document.createElement("p");
  const player_list = document.createElement("p");

  header.textContent = "" + ranking.rank + ". Platz mit " + ranking.wins + " Siegen";

  for (let i = 0; i < ranking.players.length; i++) {
    const player = ranking.players[i];

    if (i != 0) {
      player_list.textContent += ", ";
    }

    player_list.textContent += player;
  }

  node.appendChild(header);
  node.appendChild(player_list);

  return node;
}

// builds the DOM structure for a game screen scoreboard entry
function createGameScoreboardEntryNode(ranking) {
  const node = document.createElement("tr");

  const result = document.createElement("td");
  const user_hand = document.createElement("td");
  const enemy_hand = document.createElement("td");


  // -1     -> win
  //  0     -> tied
  //  1     -> lose
  result.textContent = ["Gewonnen", "Unentschieden", "Verloren"][ranking.gameEval + 1];
  user_hand.textContent = ranking.playerHand;
  enemy_hand.textContent = ranking.systemHand;

  node.appendChild(result);
  node.appendChild(user_hand);
  node.appendChild(enemy_hand);

  return node;
}

// the StonePaperScissorGame class manages the game model and the UI update lifecycle
class StonePaperScissorGame {
  constructor() {
    this.state = kStateMain;
    this.username = null;
    this.user_choice = null;
    this.enemy_choice = null;
    this.error_message = null;
    this.game_history = [];

    // start page username form submit
    domStartPageForm.onsubmit = (event) => {
      this.playGame(domStartPageFormName.value);
      return false; // don't reload page
    };

    // game page back button
    domGamePageBackButton.onclick = (event) => {
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
    if (this.state != kStateMain) {
      throw new Error(kErrorInvalidGameState);
    }

    // validate username
    if (username.length === 0) {
      this.error_message = kErrorInvalidUsername;
      this.updateView();
      return;
    } else {
      this.error_message = null;
    }

    this.state = kStateChooseMove;
    this.username = username;
    this.updateView();
  }

  exitGame() {
    if (this.state != kStateChooseMove) {
      throw new Error(kErrorInvalidGameState);
    }

    this.state = kStateMain;
    this.username = null;
    this.game_history = [];
    this.updateView();
  }

  chooseMove(choice) {
    if (this.state != kStateChooseMove) {
      throw new Error(kErrorInvalidGameState);
    }

    this.user_choice = choice;

    // change into battle mode until the enemy has choosen his move
    this.state = kStateBattle;
    this.updateView();

    evaluateHand(this.username, choice, (result) => {
      this.enemy_choice = result.systemHand;
      this.game_history.push(result);

      this.state = kStateTimeout;
      this.updateView();

      setTimeout(() => {
        this.user_choice = null;
        this.enemy_choice = null;

        this.state = kStateChooseMove;
        this.updateView();
      }, kGameDelay);
    });
  }

  updateView() {
    // hide or show the relevant containers
    if (this.state === kStateMain) {
      domStartPage.classList.remove("element-hidden");
      domGamePage.classList.add("element-hidden");
    } else {
      domStartPage.classList.add("element-hidden");
      domGamePage.classList.remove("element-hidden");
    }

    switch (this.state) {
      case kStateMain: {
        this.updateMainScoreboard();

        if (this.error_message) {
          domStartPageFormStatusline.classList.remove("element-hidden");
          domStartPageFormStatusline.textContent = this.error_message;
        } else {
          domStartPageFormStatusline.classList.add("element-hidden");
        }

        domStartPageFormName.value = "";

        break;
      }
      case kStateChooseMove: {
        domGamePageChoiceScissor.disabled = false;
        domGamePageChoiceStone.disabled = false;
        domGamePageChoicePaper.disabled = false;
        domGamePageBackButton.disabled = false;

        domGamePageUsername.textContent = this.username;
        domGamePageStatusline.textContent = "Du bist am Zug...";
        domGamePageEnemyChoice.textContent = "??";
        this.updateGameScoreboard();
        break;
      }
      case kStateBattle: {
        domGamePageChoiceScissor.disabled = true;
        domGamePageChoiceStone.disabled = true;
        domGamePageChoicePaper.disabled = true;
        domGamePageBackButton.disabled = true;

        domGamePageStatusline.textContent = "Gegner ist am Zug...";
        this.updateGameScoreboard();
        break;
      }
      case kStateTimeout: {
        domGamePageChoiceScissor.disabled = true;
        domGamePageChoiceStone.disabled = true;
        domGamePageChoicePaper.disabled = true;
        domGamePageBackButton.disabled = true;

        domGamePageStatusline.textContent = "Nächste Runde beginnt in Kürze";
        domGamePageEnemyChoice.textContent = this.enemy_choice;
        this.updateGameScoreboard();
        break;
      }
      default: {
        throw new Error("invalid game state");
      }
    }
  }

  updateMainScoreboard() {
    getRankings((ranking) => {

      // clear scoreboard
      while (domStartPageScoreBoardEntryContainer.lastElementChild) {
        domStartPageScoreBoardEntryContainer.removeChild(domStartPageScoreBoardEntryContainer.lastElementChild);
      }

      // display the top 10 ranks
      for (let i = 0; i < ranking.length && i < 10; i++) {
        const entry = ranking[i];
        const entry_dom_node = createStartScoreboardEntryNode(entry);
        domStartPageScoreBoardEntryContainer.appendChild(entry_dom_node);
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
      const result_dom_node = createGameScoreboardEntryNode(result);
      domGamePageHistory.appendChild(result_dom_node);
    }
  }
};

// wait for the document to be ready
document.addEventListener("DOMContentLoaded", () => {
  const game = new StonePaperScissorGame();
});
