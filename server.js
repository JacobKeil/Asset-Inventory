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

app.get("/laptops/get/byid/:id", (req, res) => {
  const stmt = db.prepare(`SELECT * FROM Laptops WHERE Id=${req.params.id}`);
  const laptops = stmt.all();
  res.send(laptops);
});

app.post("/laptops/:name/:model/:gen/:asset/:owner/:notes", (req, res) => {
  let insertsql = db.prepare(
    "INSERT INTO Laptops (Name,Model,Generation,AssetTag,Owner,Notes) VALUES(?,?,?,?,?,?)"
  );
  insertsql.run(
    req.params.name,
    req.params.model,
    req.params.gen,
    req.params.asset,
    req.params.owner,
    req.params.notes
  );
  res.send("User added successfully");
});

app.post("/laptops/delete/:id", (req, res) => {
  let deletesql = db.prepare(`DELETE FROM Laptops WHERE Id=${req.params.id}`);
  deletesql.run();
  res.send("User deleted successfully");
});

app.post(
  "/laptops/update/:id/:name/:model/:gen/:asset/:owner/:notes",
  (req, res) => {
    let insertsql = db.prepare(
      `UPDATE Laptops SET Name='${req.params.name}',
                          Model='${req.params.model}',
                          Generation='${req.params.gen}',
                          AssetTag='${req.params.asset}',
                          Owner='${req.params.owner}',
                          Notes='${req.params.notes}'  WHERE Id=${req.params.id}`
    );
    insertsql.run();
    res.send("User updated successfully");
  }
);

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
