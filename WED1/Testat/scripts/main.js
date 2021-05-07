// game-service API
import {
  HANDS,
  setConnected,
  isConnected,
  getRankings,
  evaluateHand,
  RESULT_WIN,
  RESULT_TIE,
  RESULT_LOSE,
} from './game-service.js';

const libGameService = {
  HANDS,
  setConnected,
  isConnected,
  getRankings,
  evaluateHand,
};

// register DOM nodes
const domStartPage = document.getElementById('startpage');
const domStartPageModeSwitchButton = document.getElementById('startpage-mode-switch-button');
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
const stateMain = 0;
const stateChooseMove = 1;
const stateBattle = 2;
const stateTimeout = 3;

// ms to wait between turns
const gameDelay = 1500;

// german translations of gameService result states
const resultGermanTranslation = {
  [RESULT_WIN]: 'Gewonnen',
  [RESULT_TIE]: 'Unentschieden',
  [RESULT_LOSE]: 'Verloren',
};

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

  result.textContent = resultGermanTranslation[ranking.gameEval];
  userHand.textContent = ranking.playerHand;
  enemyHand.textContent = ranking.systemHand;

  node.appendChild(result);
  node.appendChild(userHand);
  node.appendChild(enemyHand);

  return node;
}

// builds the DOM structure for a specific user choice button
function createUserChoiceButton(name) {
  const node = document.createElement('button');

  node.classList.add('big-button');
  node.textContent = name;
  node.dataset.choiceName = name;

  return node;
}

// the StonePaperScissorGame class manages the game model and the UI update lifecycle
class StonePaperScissorGame {
  constructor(gameService) {
    this.gameService = gameService;
    this.state = stateMain;
    this.username = null;
    this.choice_buttons = [];
    this.user_choice = null;
    this.enemy_choice = null;
    this.game_eval = null;
    this.game_history = [];

    this.selected_choice_dom_button = null;

    // mode switch button
    domStartPageModeSwitchButton.onclick = () => {
      this.toggleMode();
    };

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
    for (let i = 0; i < this.gameService.HANDS.length; i++) {
      const choice = this.gameService.HANDS[i];
      const choiceButton = createUserChoiceButton(choice);
      this.choice_buttons.push(choiceButton);
      domGamePageChoiceContainer.appendChild(choiceButton);
    }

    // listen for bubbling click events
    domGamePageChoiceContainer.onclick = (event) => {
      if (event.target.nodeName === 'BUTTON') {
        this.chooseMove(event.target.dataset.choiceName);
      }
    };

    this.updateView();
  }

  playGame(username) {
    if (this.state !== stateMain) {
      throw new Error('Invalider Spielzustand!');
    }

    this.state = stateChooseMove;
    this.username = username;
    this.updateView();
  }

  exitGame() {
    if (this.state !== stateChooseMove) {
      throw new Error('Invalider Spielzustand!');
    }

    this.state = stateMain;
    this.username = null;
    this.game_history = [];
    this.updateView();
  }

  chooseMove(choice) {
    if (this.state !== stateChooseMove) {
      throw new Error('Invalider Spielzustand!');
    }

    this.user_choice = choice;

    // change into battle mode until the enemy has choosen his move
    this.state = stateBattle;
    this.updateView();

    this.gameService.evaluateHand(this.username, choice, (result) => {
      this.enemy_choice = result.systemHand;
      this.game_eval = result.gameEval;
      this.game_history.push(result);

      this.state = stateTimeout;
      this.updateView();

      setTimeout(() => {
        this.user_choice = null;
        this.enemy_choice = null;
        this.game_eval = null;
        this.selected_choice_dom_button = null;

        this.state = stateChooseMove;
        this.updateView();
      }, gameDelay);
    });
  }

  toggleMode() {
    if (this.state === stateMain) {
      const isOnline = this.gameService.isConnected();
      this.gameService.setConnected(!isOnline);
      this.updateView();
    }
  }

  updateView() {
    // hide or show relevant game pages
    if (this.state === stateMain) {
      domStartPage.classList.remove('element-hidden');
      domGamePage.classList.add('element-hidden');
    } else {
      domStartPage.classList.add('element-hidden');
      domGamePage.classList.remove('element-hidden');
    }

    switch (this.state) {
      case stateMain: {
        this.updateMainScoreboard();

        // update mode toggle button message
        if (this.gameService.isConnected()) {
          domStartPageModeSwitchButton.textContent = 'Wechsel zur Offline-Version';
        } else {
          domStartPageModeSwitchButton.textContent = 'Wechsel zur Online-Version';
        }

        domStartPageFormName.value = '';

        break;
      }
      case stateChooseMove: {
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
      case stateBattle: {
        for (let i = 0; i < this.choice_buttons.length; i++) {
          const button = this.choice_buttons[i];
          button.disabled = true;

          if (button.dataset.choiceName === this.user_choice) {
            button.classList.add('selected_by_user');
            this.selected_choice_dom_button = button;
          }
        }
        domGamePageBackButton.disabled = true;

        domGamePageStatusline.textContent = 'Gegner ist am Zug...';
        this.updateGameScoreboard();
        break;
      }
      case stateTimeout: {
        for (let i = 0; i < this.choice_buttons.length; i++) {
          const button = this.choice_buttons[i];
          button.disabled = true;
        }
        domGamePageBackButton.disabled = true;

        this.selected_choice_dom_button.classList.remove('selected_by_user');

        switch (this.game_eval) {
          case RESULT_WIN: { // won
            this.selected_choice_dom_button.classList.add('winning_choice');
            domGamePageEnemyChoice.classList.add('lost_choice');
            break;
          }
          case RESULT_TIE: { // tie
            this.selected_choice_dom_button.classList.add('tie_choice');
            domGamePageEnemyChoice.classList.add('tie_choice');
            break;
          }
          case RESULT_LOSE: { // lost
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
    container.classList.add('loading');
    container.textContent = 'Rangliste wird geladen...';

    this.gameService.getRankings((ranking) => {
      if (this.state === stateMain) {
        container.classList.remove('loading');
        container.textContent = undefined;

        if (ranking.length === 0) {
          container.textContent = 'Keine Einträge vorhanden.';
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
document.addEventListener('DOMContentLoaded', () => {
  const game = new StonePaperScissorGame(libGameService);
  game.updateView();
});
