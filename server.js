const bodyParser = require("body-parser");
const express = require("express");
const path = require("path");
const ejs = require("ejs");

const db = require("better-sqlite3")(
  path.join(__dirname, "views", "db", "AssetInventory.db")
);

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(__dirname + "/views"));

app.set("view engine", "html");
app.engine("html", ejs.renderFile);
app.get("/", (req, res) => res.render("index"));

app.get("/laptops", (req, res) => {
  const stmt = db.prepare("SELECT * FROM Laptops");
  const laptops = stmt.all();
  res.send(laptops);
});

app.get("/laptops/:column/:search", (req, res) => {
  const stmt = db.prepare(
    `SELECT * FROM Laptops WHERE ${req.params.column} LIKE '%${req.params.search}%'`
  );
  const laptops = stmt.all();
  res.send(laptops);
});

app.post("/laptops/:name/:model/:gen/:asset/:owner/:notes", (req, res) => {
  let insertsql = db.prepare(
    "INSERT INTO Laptops (Name,Model,Generation,AssetTag,Owner,Notes) VALUES(?,?,?,?,?,?)"
  );
  insertsql.run(
    req.params.name || "Computer name not given",
    req.params.model || "Model not given",
    req.params.gen || "Generation not given",
    req.params.asset || "Asset tag not given",
    req.params.owner || "Owner not given",
    req.params.notes || "Notes not given"
  );
  res.send("User added successfully");
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
