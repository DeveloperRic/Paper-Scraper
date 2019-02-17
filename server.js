const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const pdf = require("pdf-parse");
const formidable = require("formidable");

const textParse = require("./node/textPerser");
const process = require("./node/process");

var app = express();

app.use("/html", express.static("./html"));
app.use("/css", express.static("./css"));
app.use("/fonts", express.static("./fonts"));
app.use("/images", express.static("./images"));
app.use("/js", express.static("./js"));
app.use("/sass", express.static("./sass"));

app.route("/clientJs").get((req, res) => {
  res.sendFile("client.js", { root: "./" });
});

app.route("/uploadFile").post((req, res) => {
  let form = new formidable.IncomingForm();
  form.parse(req, function(err, fields, files) {
    if (err) return res.status(500).send(err);
    var oldpath = files.file.path;
    var newpath = "uploads/pdfFile.pdf";
    fs.rename(oldpath, newpath, function(err) {
      if (err) return res.status(500).send(err);
      console.log("Success");
      res.sendStatus(200);
    });
  });
});

app.route("/pdfToText").get((req, res) => {
  fs.exists("./uploads/pdfFile.pdf", exists => {
    let file = exists ? "./uploads/pdfFile.pdf" : "./node/pdf-file.pdf";
    loadPdf(
      file,
      err => res.status(500).send(err),
      lines => {
        res.send(process.mapKeywords(lines, req.query.q));
      }
    );
  });
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
