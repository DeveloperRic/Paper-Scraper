const stopWord = require("./stopword");

const provisionedFiles = [];

exports.provisionFile = function() {
  provisionedFiles.push("uploads/upload" + provisionedFiles.length + ".pdf");
  return provisionedFiles[provisionedFiles.length - 1];
};

exports.freeFile = function(path) {
  for (let i = 0; i < provisionedFiles.length; i++) {
    if (provisionedFiles[i] == path) {
      return provisionedFiles.splice(i, 1);
    }
  }
};

exports.mapKeywords = function(lines, q) {
  // do ur work here
  let regex = /[A-Z][a-z']+(?: [A-Z][a-z]+)*/;
  let map = {};
  lines.forEach(line => {
    line = line.trim();
    if (usableString(line, q)) {
      let keywords = line.match(regex);
      if (!!keywords) {
        keywords = parseKeywords(keywords);
        keywords = stopWord.run(keywords);
        keywords.forEach(keyword => {
          keyword = keyword.trim();
          if (usableKeyword(keyword, q)) {
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
  if (q != "" && !str.includes(q)) return false;
  return true;
}

function parseKeywords(keywords) {
  let arr = [];
  keywords.forEach(k => {
    arr.push("" + k);
  });
  return arr;
}

function usableKeyword(keyword, q) {
  if (keyword.length < 3) return false;
  if (q != "" && keyword.includes(q)) return false;
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
