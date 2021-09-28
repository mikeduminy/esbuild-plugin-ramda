import isEmpty from "ramda/src/isEmpty";
import add from "ramda/src/add";
const empty = {};
const notEmpty = {
  a: 1
};
isEmpty(empty);
isEmpty(notEmpty);
add(1, 2);
