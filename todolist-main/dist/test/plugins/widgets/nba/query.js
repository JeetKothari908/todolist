"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.gameQuery = void 0;
const gameQuery = (date) => `query {
  schedule(date: "${date}") {
    gameId
    clock
    isGameActivated
    startDateEastern
    startTimeUTC
    nugget
    period {
      current
      isEndOfPeriod
      isHalftime
      maxRegular
    }
    hTeam {
      triCode
      score
      win
      loss
      city
      fullName
      confName
      divName
      logo
    }
    vTeam {
      triCode
      score
      win
      loss
      city
      fullName
      confName
      divName
      logo
    }
  }
}`;
exports.gameQuery = gameQuery;
//# sourceMappingURL=query.js.map