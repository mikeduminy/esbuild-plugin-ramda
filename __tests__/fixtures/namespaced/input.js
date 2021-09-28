import * as R from 'ramda';

const empty = {};
const notEmpty = {
  a: 1,
};

R.isEmpty(empty);
R.isEmpty(notEmpty);

R.add(1, 2);
