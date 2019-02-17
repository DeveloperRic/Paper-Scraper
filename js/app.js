const BASE_FONT_SIZE = 25;

const words = [];

class Word {
  constructor(text, frequency, onClick) {
    this.text = text;
    this.frequency = frequency;
    this.onClick = onClick;
  }

  getFontSize(highestFrequency) {
    return BASE_FONT_SIZE * (1 + this.frequency / highestFrequency);
  }

  getTemplate(highestFrequency) {
    return `<li style="font-size: ${this.getFontSize(
      highestFrequency
    )}px"><a href="/chips">${this.text}</a></li>`;
  }
}

function init(data) {
  data = [
    { text: "Salt", frequency: 11 },
    { text: "Vinegar", frequency: 11 },
    { text: "Chips", frequency: 11 }
  ];
  data.forEach(d => {
    words.push(new Word(d.text, d.frequency));
  });
}

function populateList() {
  let targetList = document.getElementById("target-list");
  targetList.innerHTML = "";

  let highestFrequency = findHighestFrequency();
  for (let i = 0; i < words.length; i++) {
    targetList.innerHTML += words[i].getTemplate(highestFrequency);
  }
}

function findHighestFrequency() {
  let max = 0;
  words.forEach(word => {
    if (word.frequency > max) max = word.frequency;
  });
  return max;
}
