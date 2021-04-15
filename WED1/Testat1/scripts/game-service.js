const DELAY_MS = 1000;

const playerStats = {};

function getRankingsFromPlayerStats() {
  const playerNames = Object.keys(playerStats);

  // compute the ranking
  let ranking = [];
  for (let i = 0; i < playerNames.length; i++) {
    const playerName = playerNames[i];
    const stats = playerStats[playerName];

    // players with 0 wins are not listed on the scoreboard
    if (stats.win === 0) {
      continue;
    }

    // initialize entry or append to players array
    if (ranking[stats.win] === undefined) {
      ranking[stats.win] = { rank: null, wins: stats.win, players: [stats.name] };
    } else {
      ranking[stats.win].players.push(stats.name);
    }
  }

  // remove holes from ranking array
  ranking = ranking.filter((element) => element !== null);

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
  setTimeout(() => rankingsCallbackHandlerFn(rankingsArray), DELAY_MS);
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

function updateRanking(playerName, gameEval) {
  // initialite a record for the player
  if (!playerStats.hasOwnProperty(playerName)) {
    playerStats[playerName] = {
      name: playerName,
      win: 0,
      lost: 0
    };
  }

  // update scoreboard
  if (gameEval === -1) {
    playerStats[playerName].win++;
  } else if (gameEval === 1) {
    playerStats[playerName].lost++;
  }
}

export function evaluateHand(playerName, playerHand, gameRecordHandlerCallbackFn) {
  const systemHand = HANDS[Math.floor(Math.random() * 3)];
  const gameEval = getGameEval(playerHand, systemHand);

  updateRanking(playerName, gameEval);

  setTimeout(() => gameRecordHandlerCallbackFn({ playerHand, systemHand, gameEval }), DELAY_MS);
}

// local functions
