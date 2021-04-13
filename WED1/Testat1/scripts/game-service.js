const DELAY_MS = 1000;

const playerStats = {
  // MaxMustermann: {
  //   name: 'MaxMustermann',
  //   win: 420,
  //   lost: 0,
  // },
};

function getRankingsFromPlayerStats() {
  const playerNames = Object.keys(playerStats);

  // compute the ranking
  let ranking = [];
  for (let i = 0; i < playerNames.length; i++) {
    const playerName = playerNames[i];
    const stats = playerStats[playerName];

    // initialize entry or append to players array
    if (ranking[stats.win] === undefined) {
      ranking[stats.win] = { rank: null, wins: stats.win, players: [stats.name] };
    } else {
      ranking[stats.win].players.push(stats.name);
    }
  }

  // remove holes from ranking array
  ranking = ranking.filter((element) => element != null);

  // sort by win amount
  ranking.sort((lhs, rhs) => rhs.wins - lhs.wins);

  // set rank property
  for (let i = 0; i < ranking.length; i++) {
    ranking[i].rank = i + 1;
  }

  return ranking;
}

export const HANDS = ['scissors', 'stone', 'paper'];

let isConnectedState = false;

export function setConnected(newIsConnected) {
  isConnectedState = Boolean(newIsConnected);
}

export function isConnected() {
  return isConnectedState;
}

export function getRankings(rankingsCallbackHandlerFn) {
  const rankingsArray = getRankingsFromPlayerStats();
  // setTimeout(() => rankingsCallbackHandlerFn(rankingsArray), DELAY_MS);
  setTimeout(() => rankingsCallbackHandlerFn(rankingsArray), 0);
}

const evalLookup = {
  scissors: {
    scissors: 0,
    stone: 1,
    paper: -1,
  },
  stone: {
    scissors: -1,
    stone: 0,
    paper: 1,
  },
  paper: {
    scissors: 1,
    stone: -1,
    paper: 0,
  },
};

function getGameEval(playerHand, systemHand) {
  return evalLookup[playerHand][systemHand];
}

export function evaluateHand(playerName, playerHand, gameRecordHandlerCallbackFn) {
  // TODO: replace calculation of didWin and update rankings while doing so.
  //
  // TODO: in local-mode (isConnected == false) store rankings in
  // the browser localStorage
  //
  // TODO: https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API
  const systemHand = HANDS[Math.floor(Math.random() * 3)];
  const gameEval = Math.floor(Math.random() * 3) - 1; // eval and hand do not match yet -> TODO
  setTimeout(() => gameRecordHandlerCallbackFn({ playerHand, systemHand, gameEval }), DELAY_MS);
}

// local functions
