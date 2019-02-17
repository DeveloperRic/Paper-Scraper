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
    )}px"><a href="https://www.google.com/search?q=${this.text}">${
      this.text
    }</a></li>`;
  }
}

function run(data) {
  data = [
    { text: "Salt", frequency: 11 },
    { text: "Vinegar", frequency: 11 },
    { text: "Chips", frequency: 1100 }
  ];
  data.forEach(d => {
    words.push(new Word(d.text, d.frequency));
  });
  populateList();
}

function populateList() {
  let targetList = document.getElementById("target-list");
  targetList.innerHTML = "";

  function findHighestFrequency() {
    let max = 0;
    words.forEach(word => {
      if (word.frequency > max) max = word.frequency;
    });
    return max;
  }

  let highestFrequency = findHighestFrequency();
  for (let i = 0; i < words.length; i++) {
    targetList.innerHTML += words[i].getTemplate(highestFrequency);
  }
}

var client = angular.module("client", []);

client.run(function($rootScope) {
  console.log("Get /pdfToText\n");
  $.get("/pdfToText")
    .done(map => {
      console.log(map);
    })
    .fail(function(xhr, textStatus, error) {
      console.log(xhr.responseText);
    });
});

run();
