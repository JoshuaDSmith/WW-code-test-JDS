const R = require("ramda");
const moment = require("moment");
const RD = require("../utils/ramda-decimal");

const allBands = require("../config/ni");

const isDateOnOrAfter = R.curry((date, dateString) =>
  moment.utc(dateString, "YYYY-MM-DD").isSameOrBefore(date)
);

const noBandsError = (date) =>
  new Error(`National Insurance bands unavailable for date ${date}`);

const bandsOnDate = (date) => {
  const month = moment.utc(date, "YYYY-MM-DD");

  return R.compose(
    R.when(R.isNil, () => {
      throw noBandsError(date);
    }),
    R.prop("bands"),
    R.last,
    R.filter(R.propSatisfies(isDateOnOrAfter(month), "startDate"))
  )(allBands);
};

// TODO this should do more than return the number it's given
const slice = R.curry((floor, ceiling, num) => {
  if (num <= floor) return RD.decimal(0);
  else if (num > ceiling) return RD.decimal(ceiling - floor);
  else if (num > floor && num <= ceiling) return RD.decimal(num - floor);
  else if (num === ceiling) return RD.decimal(num + floor);
});

const calcForBand = R.curry((income, { floor, ceiling, rate }) =>
  RD.multiply(slice(floor, ceiling, income), rate)
);

module.exports = (runDate) => {
  const bands = bandsOnDate(runDate || moment.utc());
  return R.compose(
    RD.sum,
    R.flip(R.map)(bands),
    calcForBand
  );
};

// for unit tests
module.exports.bandsOnDate = bandsOnDate;
module.exports.slice = slice;
