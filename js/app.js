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

function run($rootScope, $interval, data) {
  while (words.length > 0) words.splice(0, 1);
  data.forEach(d => {
    console.log("Running parse on " + JSON.stringify(d));
    words.push(new Word(d.k, d.v));
  });
  populateList($rootScope, $interval);
}

function populateList($rootScope, $interval) {
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

  function update() {
    try {
      TagCanvas.Start("myCanvas", "tags", {
        textFont: 'Charcoal,"Helvetica Inserat",sans-serif',
        textColour: "white",
        outlineColour: "#ff00ff",
        reverse: true,
        depth: 0.8,
        textHeight: 25,
        maxSpeed: 0.05,
        weight: true,
        dragControl: true
      });
    } catch (e) {
      // something went wrong, hide the canvas container
      document.getElementById("myCanvasContainer").style.display = "none";
    }
  }

  $rootScope.doneLoadingCanvas = true;
  $rootScope.searchOpen = false;
  $rootScope.$apply();
  $interval(() => update(), 0, 1);
}

var client = angular.module("client", []);

client.run(function($rootScope, $interval) {
  $rootScope.canvasLength = window.innerWidth;
  $rootScope.searchOpen = true;
  $rootScope.searchQuery = "";
  $rootScope.search = () => {
    console.log("Get /pdfToText\n");
    $.get("/pdfToText", { q: $rootScope.searchQuery })
      .done(map => {
        run($rootScope, $interval, map);
      })
      .fail(function(xhr, textStatus, error) {
        console.log(xhr.responseText);
      });
  };
  $rootScope.openSearch = () => {
    $rootScope.searchOpen = true;
  };
});

// run([
//   { k: "Salt", v: 11 },
//   { k: "Vinegar", v: 11 },
//   { k: "Chips", v: 1100 }
// ]);
