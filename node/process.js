exports.mapKeywords = function(lines) {
  // do ur work here
  let regex = /[A-Z][a-z']+(?: [A-Z][a-z]+)*/;
  let map = {};
  lines.forEach(line => {
    if (useableString(line)) {
      let keywords = line.match(regex);
      if (!!keywords) {
        keywords.forEach(keyword => {
          if (!!map[keyword]) map[keyword]++;
          else map[keyword] = 1;
        });
      }
    }
  });
  return map;
};

function useableString(str) {
  if (str.length < 3) return false;
  return true;
}
