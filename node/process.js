exports.mapKeywords = function(lines, q) {
  // do ur work here
  let regex = /[A-Z][a-z']+(?: [A-Z][a-z]+)*/;
  let map = {};
  lines.forEach(line => {
    line = line.trim();
    if (usableString(line, q)) {
      let keywords = line.match(regex);
      if (!!keywords) {
        keywords.forEach(keyword => {
          keyword = keyword.trim();
          if (usableKeyword(keyword)) {
            if (!!map[keyword]) map[keyword]++;
            else map[keyword] = 1;
          }
        });
      }
    }
  });
  return sort(map);
};

function usableString(str, q) {
  if (str.length < 3) return false;
  if (!!q && !str.includes(q)) return false;
  return true;
}

function usableKeyword(keyword) {
  if (keyword.length < 3) return false;
  if (keyword.includes(" ") && keyword.split(" ").length > 4) return false;
  return true;
}

function sort(map) {
  let sorted = [];
  for (let key in map) {
    sorted.push({ k: key, v: map[key] });
  }
  return sorted.sort((a, b) => {
    return b.v - a.v;
  });
}
