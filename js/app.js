const BASE_FONT_SIZE = 50;

const words = [];

class Word {
  constructor(text, frequency, onClick) {
    this.text = text;
    this.frequency = frequency;
    this.onClick = onClick;
  }

  getFontSize(highestFrequency) {
    return BASE_FONT_SIZE * (this.frequency / highestFrequency);
  }

  getTemplate(highestFrequency) {
    return `<li style="font-size: ${this.getFontSize(
      highestFrequency
    )}px"><a href="https://en.wikipedia.org/wiki/${
      this.text
    }" target="_blank">${this.text}</a></li>`;
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
    console.log($rootScope.canvasWidth, $rootScope.canvasHeight);
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
  $rootScope.searching = false;
  $rootScope.$apply();
  $interval(() => update(), 0, 1);
}

var client = angular.module("client", []);

var rootScope, interval;

client.run(function($rootScope, $interval) {
  rootScope = $rootScope;
  interval = $interval;
  $rootScope.canvasWidth = window.innerWidth;
  $rootScope.canvasHeight = window.innerHeight;
  $rootScope.searchOpen = true;
  $rootScope.searchQuery = "";
  $rootScope.search = () => {
    $rootScope.doCloudRequest();
  };
  $rootScope.doCloudRequest = () => {
    $rootScope.searching = true;
    $rootScope.searchOpen = false;
    try {
      $rootScope.$apply();
    } catch (error) {
    }
    let q = document.getElementById("searchQuery").value;
    console.log("Get /pdfToText");
    console.log(".. with q = " + q + "\n");
    $.get("/pdfToText", { q: q.trim() })
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
  $rootScope.openWiki = url => {
    window.open(url);
  };
});

function onFileChoose(files) {
  console.log("got event");
  if (files.length > 0) {
    let formData = new FormData();
    let found = false;
    for (var i = 0; i < files.length; i++) {
      var file = files[i];
      if (!file.type.match("application/pdf")) {
        continue;
      }
      found = true;
      formData.append("file", file, file.name);
      break;
    }
    if (!found) return;
    let xhr = new XMLHttpRequest();
    xhr.open("POST", "uploadFile", true);
    xhr.onload = function() {
      if (xhr.status === 200) {
        console.log("Successful upload");
        rootScope.doCloudRequest();
      } else {
        console.log(xhr.responseText);
      }
    };
    console.log("sending...");
    xhr.send(formData);
    console.log(files[0]);
  }
}

// run([
//   { k: "Salt", v: 11 },
//   { k: "Vinegar", v: 11 },
//   { k: "Chips", v: 1100 }
// ]);
