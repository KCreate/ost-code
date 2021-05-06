const DELAY_MS = 1000;

const playerStats = {};

function getRankingsFromPlayerStats() {
  const playerNames = Object.keys(playerStats);

  // compute the ranking
  let ranking = [];
  for (let i = 0; i < playerNames.length; i++) {
    const playerName = playerNames[i];
    const stats = playerStats[playerName];

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

export const HANDS = ['Schere', 'Stein', 'Papier', 'Brunnen', 'Streichholz'];

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

const resultWin = -1;
const resultTie = 0;
const resultLose = 1;
const evalLookup = {
  Schere: {
    Schere: resultTie,
    Stein: resultLose,
    Papier: resultWin,
    Brunnen: resultLose,
    Streichholz: resultWin,
  },
  Stein: {
    Schere: resultWin,
    Stein: resultTie,
    Papier: resultLose,
    Brunnen: resultLose,
    Streichholz: resultWin,
  },
  Papier: {
    Schere: resultLose,
    Stein: resultWin,
    Papier: resultTie,
    Brunnen: resultWin,
    Streichholz: resultLose,
  },
  Brunnen: {
    Schere: resultWin,
    Stein: resultWin,
    Papier: resultLose,
    Brunnen: resultTie,
    Streichholz: resultLose,
  },
  Streichholz: {
    Schere: resultLose,
    Stein: resultLose,
    Papier: resultWin,
    Brunnen: resultWin,
    Streichholz: resultTie,
  },
};

function getGameEval(playerHand, systemHand) {
  return evalLookup[playerHand][systemHand];
}

function updateRanking(playerName, gameEval) {
  // initialite a record for the player
  if (playerStats[playerName] === undefined) {
    playerStats[playerName] = {
      name: playerName,
      win: 0,
      lost: 0,
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
  const systemHand = HANDS[Math.floor(Math.random() * HANDS.length)];
  const gameEval = getGameEval(playerHand, systemHand);

  updateRanking(playerName, gameEval);

  setTimeout(() => gameRecordHandlerCallbackFn({ playerHand, systemHand, gameEval }), DELAY_MS);
}

// local functions
