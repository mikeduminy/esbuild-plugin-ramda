import checkIsEmpty from "ramda/src/isEmpty";
import add from "ramda/src/add";
const empty = {};
const notEmpty = {
  a: 1
};
checkIsEmpty(empty);
checkIsEmpty(notEmpty);
add(1, 2);
