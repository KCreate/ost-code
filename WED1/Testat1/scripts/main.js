// game-service API
const libGameService = await import('./game-service.js');

// register DOM nodes
const domStartPage = document.getElementById('startpage');
const domStartPageScoreBoardEntryContainer = document.getElementById('startpage-scoreboard-entry-container');
const domStartPageForm = document.getElementById('startpage-form');
const domStartPageFormName = document.getElementById('startpage-form-name');

const domGamePage = document.getElementById('gamepage');
const domGamePageUsername = document.getElementById('gamepage-username');
const domGamePageChoiceContainer = document.getElementById('gamepage-choice-container');
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
  userHand.textContent = ranking.playerHand;
  enemyHand.textContent = ranking.systemHand;

  node.appendChild(result);
  node.appendChild(userHand);
  node.appendChild(enemyHand);

  return node;
}

// builds the DOM structure for a specific user choice button
function createUserChoiceButton(choice_name) {
  const node = document.createElement('button');

  node.classList.add("big-button");
  node.textContent = choice_name;
  node.dataset.choiceName = choice_name;

  return node;
}

// the StonePaperScissorGame class manages the game model and the UI update lifecycle
class StonePaperScissorGame {
  constructor(game_service) {
    this.game_service = game_service;
    this.state = kStateMain;
    this.username = null;
    this.choice_buttons = [];
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

    // inject user choice buttons into the user choice container div
    for (let i = 0; i < this.game_service.HANDS.length; i++) {
      const choice = this.game_service.HANDS[i];
      const choice_button = createUserChoiceButton(choice);
      this.choice_buttons.push(choice_button);
      domGamePageChoiceContainer.appendChild(choice_button);
    }

    // listen for bubbling click events
    domGamePageChoiceContainer.onclick = (event) => {
      this.chooseMove(event.target.dataset.choiceName);
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

    this.game_service.evaluateHand(this.username, choice, (result) => {
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
        domGamePageBackButton.disabled = false;

        for (let i = 0; i < this.choice_buttons.length; i++) {
          const button = this.choice_buttons[i];
          button.disabled = false;
          button.classList.remove('selected_by_user', 'winning_choice', 'tie_choice', 'lost_choice');
        }

        domGamePageEnemyChoice.classList.remove('winning_choice', 'tie_choice', 'lost_choice');

        domGamePageUsername.textContent = this.username;
        domGamePageStatusline.textContent = 'Du bist am Zug...';
        domGamePageEnemyChoice.textContent = '??';
        this.updateGameScoreboard();
        break;
      }
      case kStateBattle: {
        for (let i = 0; i < this.choice_buttons.length; i++) {
          const button = this.choice_buttons[i];
          button.disabled = true;

          if (button.dataset.choiceName == this.user_choice) {
            button.classList.add('selected_by_user');
            this.selected_choice_dom_button = button;
          }
        }
        domGamePageBackButton.disabled = true;

        domGamePageStatusline.textContent = 'Gegner ist am Zug...';
        this.updateGameScoreboard();
        break;
      }
      case kStateTimeout: {
        for (let i = 0; i < this.choice_buttons.length; i++) {
          const button = this.choice_buttons[i];
          button.disabled = true;
        }
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
        domGamePageEnemyChoice.textContent = this.enemy_choice;
        this.updateGameScoreboard();
        break;
      }
      default: {
        throw new Error('unexpected state');
      }
    }
  }

  updateMainScoreboard() {

    // clear scoreboard and insert 'waiting' banner
    const container = domStartPageScoreBoardEntryContainer;
    while (container.lastElementChild) {
      container.removeChild(container.lastElementChild);
    }
    container.classList.add("loading");
    container.textContent = "Rangliste wird geladen...";

    this.game_service.getRankings((ranking) => {
      if (this.state === kStateMain) {
        container.classList.remove("loading");
        container.textContent = undefined;

        if (ranking.length === 0) {
          container.textContent = "Keine Einträge vorhanden.";
        } else {
          // display the top 10 ranks
          for (let i = 0; i < ranking.length && i < 10; i++) {
            const entry = ranking[i];
            const entryDomNode = createStartScoreboardEntryNode(entry);
            container.appendChild(entryDomNode);
          }
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
const game = new StonePaperScissorGame(libGameService);
document.addEventListener('DOMContentLoaded', () => {
  game.updateView();
});
