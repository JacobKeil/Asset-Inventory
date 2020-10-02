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
app.get("/monitors", (req, res) => res.render("monitors"));
app.get("/docks", (req, res) => res.render("docks"));

//#region Laptops

app.get("/laptops", (req, res) => {
  const stmt = db.prepare("SELECT * FROM Laptops");
  const laptops = stmt.all();
  res.send(laptops);
});

app.get("/laptops/any/search/:search", (req, res) => {
  const stmt = db.prepare(`SELECT * FROM Laptops WHERE (Name LIKE '%${req.params.search}%' OR
                                                        Model LIKE '%${req.params.search}%' OR
                                                        Generation LIKE '%${req.params.search}%' OR
                                                        AssetTag LIKE '%${req.params.search}%' OR
                                                        Owner LIKE '%${req.params.search}%' OR
                                                        Notes LIKE '%${req.params.search}%')`);
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

//#endregion

//#region Monitors

app.get("/allmonitors", (req, res) => {
  const stmt = db.prepare("SELECT * FROM Monitors");
  const monitors = stmt.all();
  res.send(monitors);
});

app.get("/allmonitors/any/search/:search", (req, res) => {
  const stmt = db.prepare(`SELECT * FROM Monitors WHERE (SerialNumber LIKE '%${req.params.search}%' OR
                                                         Model LIKE '%${req.params.search}%' OR
                                                         AssetTag LIKE '%${req.params.search}%')`);
  const monitors = stmt.all();
  res.send(monitors);
});

app.get("/allmonitors/:column/:search", (req, res) => {
  const stmt = db.prepare(
    `SELECT * FROM Monitors WHERE ${req.params.column} LIKE '%${req.params.search}%'`
  );
  const monitors = stmt.all();
  res.send(monitors);
});

app.get("/allmonitors/get/byid/:id", (req, res) => {
  const stmt = db.prepare(`SELECT * FROM Monitors WHERE Id=${req.params.id}`);
  const monitors = stmt.all();
  res.send(monitors);
});

app.post("/allmonitors/:model/:asset/:serial", (req, res) => {
  let insertsql = db.prepare(
    "INSERT INTO Monitors (Model, AssetTag, SerialNumber) VALUES(?,?,?)"
  );
  insertsql.run(req.params.model, req.params.asset, req.params.serial);
  res.send("Monitor added successfully");
});

app.post("/allmonitors/delete/:id", (req, res) => {
  let deletesql = db.prepare(`DELETE FROM Monitors WHERE Id=${req.params.id}`);
  deletesql.run();
  res.send("Monitor deleted successfully");
});

app.post("/allmonitors/update/:id/:model/:asset/:serial", (req, res) => {
  let insertsql = db.prepare(
    `UPDATE Monitors SET Model='${req.params.model}',
                          AssetTag='${req.params.asset}',
                          SerialNumber='${req.params.serial}'  WHERE Id=${req.params.id}`
  );
  insertsql.run();
  res.send("Monitor updated successfully");
});

//#endregion

//#region Docks

app.get("/alldocks", (req, res) => {
  const stmt = db.prepare("SELECT * FROM Docks");
  const monitors = stmt.all();
  res.send(monitors);
});

app.get("/alldocks/any/search/:search", (req, res) => {
  const stmt = db.prepare(`SELECT * FROM Docks WHERE (SerialNumber LIKE '%${req.params.search}%' OR
                                                      Model LIKE '%${req.params.search}%' OR
                                                      AssetTag LIKE '%${req.params.search}%')`);
  const monitors = stmt.all();
  res.send(monitors);
});

app.get("/alldocks/:column/:search", (req, res) => {
  const stmt = db.prepare(
    `SELECT * FROM Docks WHERE ${req.params.column} LIKE '%${req.params.search}%'`
  );
  const monitors = stmt.all();
  res.send(monitors);
});

app.get("/alldocks/get/byid/:id", (req, res) => {
  const stmt = db.prepare(`SELECT * FROM Docks WHERE Id=${req.params.id}`);
  const monitors = stmt.all();
  res.send(monitors);
});

app.post("/alldocks/:model/:asset/:serial", (req, res) => {
  let insertsql = db.prepare(
    "INSERT INTO Docks (Model, AssetTag, SerialNumber) VALUES(?,?,?)"
  );
  insertsql.run(req.params.model, req.params.asset, req.params.serial);
  res.send("Dock added successfully");
});

app.post("/alldocks/delete/:id", (req, res) => {
  let deletesql = db.prepare(`DELETE FROM Docks WHERE Id=${req.params.id}`);
  deletesql.run();
  res.send("Dock deleted successfully");
});

app.post("/alldocks/update/:id/:model/:asset/:serial", (req, res) => {
  let insertsql = db.prepare(
    `UPDATE Docks SET Model='${req.params.model}',
                      AssetTag='${req.params.asset}',
                      SerialNumber='${req.params.serial}'  WHERE Id=${req.params.id}`
  );
  insertsql.run();
  res.send("Dock updated successfully");
});

//#endregion

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log("Server running on port 5000");
});
