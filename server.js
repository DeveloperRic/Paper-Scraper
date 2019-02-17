const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const pdf = require("pdf-parse");

const textParse = require("./node/textPerser");
const process = require("./node/process");

var app = express();

app.use("/css", express.static("./css"));
app.use("/fonts", express.static("./fonts"));
app.use("/images", express.static("./images"));
app.use("/js", express.static("./js"));
app.use("/sass", express.static("./sass"));

app.route("/clientJs").get((req, res) => {
  res.sendFile("client.js", { root: "./" });
});

app.route("/pdfToText").get((req, res) => {
  loadPdf(
    "./node/pdf-file.pdf",
    err => res.status(500).send(err),
    lines => {
      res.send(process.mapKeywords(lines));
    }
  );
});

function loadPdf(name, error, success) {
  fs.readFile(name, (err, buffer) => {
    if (err) return error(err);
    pdf(buffer)
      .then(data => {
        let text = data.text;
        let lines = [];
        text.split("\n").forEach(line => {
          lines.push(line);
        });
        success(lines);
      })
      .catch(err => {
        console.log(err);
        error(err);
      });
  });
}

app.route("/").get((req, res) => {
  res.sendFile("index.html", { root: "./html" });
});

app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

app.listen(8080, () => {
  console.log("Smash Books server launched on port 8080");
  console.log("Test on http://localhost:8080/");
});
