import { isEmpty, last } from 'ramda';

const empty = {};
const notEmpty = {
  a: 1,
};

isEmpty(empty);
isEmpty(notEmpty);

last(['a', 'b']);
