const bodyParser = require("body-parser");
const express = require("express");
const sqlite = require("sqlite3").verbose();
const path = require("path");

const app = express();
const urlEncodedParser = bodyParser.urlencoded({ extended: false });

let db = new sqlite.Database(
  path.join(__dirname, "views", "db", "AssetInventory.db")
);

let sql = `SELECT * FROM Laptops`;

// db.each(sql, [], (err, row) => {
//   if (err) {
//     console.log(err);
//   }
//   console.log(`${row.owuser}`);
//   getInfo(row.owuser);
// });
// db.close();

app.use(express.static(__dirname + "/views"));

app.set("view engine", "ejs");
app.get("/", function (req, res) {
  res.render("index");
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
