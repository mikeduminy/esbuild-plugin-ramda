import { isEmpty as checkIsEmpty, add } from 'ramda';

const empty = {};
const notEmpty = {
  a: 1,
};

checkIsEmpty(empty);
checkIsEmpty(notEmpty);

add(1, 2);
