import isEmpty from "ramda/src/isEmpty";
import last from "ramda/src/last";
const empty = {};
const notEmpty = {
  a: 1
};
isEmpty(empty);
isEmpty(notEmpty);
last(["a", "b"]);
