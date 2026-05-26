"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPeriod = void 0;
const date_fns_1 = require("date-fns");
const date_fns_tz_1 = require("date-fns-tz");
function getPeriod(game, timeZone) {
    const period = game.period;
    let periodDate = new Date(game.startTimeUTC);
    if (timeZone) {
        periodDate = (0, date_fns_tz_1.utcToZonedTime)(new Date(game.startTimeUTC), timeZone);
    }
    let periodStr = (0, date_fns_1.format)(periodDate, "hh:mm a");
    if (game.isGameActivated || period.current > 0) {
        if (period.isHalftime) {
            periodStr = "Halftime";
        }
        else if (period.current === period.maxRegular && !game.clock) {
            periodStr = "Final";
        }
        else if (period.isEndOfPeriod) {
            periodStr = `End of ${period.current}Q`;
        }
        else if (period.current <= 4) {
            periodStr = `${period.current}Q ${game.clock} `;
        }
        else {
            periodStr = `OT ${game.clock}`;
        }
    }
    return periodStr;
}
exports.getPeriod = getPeriod;
//# sourceMappingURL=getPeriod.js.map