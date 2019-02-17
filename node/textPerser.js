exports.freqWord = function(text) {
  var wordCounts = {};
  var words = text.split(/\b/);

  for (var i = 0; i < words.length; i++) {
      
    if (words[i].match(/[a-z]/i)) {
        words[i] = words[i].toLowerCase();
        wordCounts[words[i]] = (wordCounts[words[i]] || 0) + 1;
    }
  }
  return wordCounts;
};