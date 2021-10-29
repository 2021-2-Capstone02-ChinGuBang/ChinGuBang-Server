function stringToBoolean(str: String) {
  if (str === "true") return true;
  else if (str === "false") return false;
  else return null;
}

function stringToNumber(str: String) {
  if (str === "null" || !str) return null;
  else return Number(str);
}

const cast = {
  stringToBoolean,
  stringToNumber,
};

export default cast;
