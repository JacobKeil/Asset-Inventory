var modal = document.getElementById("newEntry");
var newButton = document.getElementById("new-button");
var addButton = document.getElementById("add-button");
var closeButton = document.getElementById("closeModalBtn");
var assetGrid = document.getElementById("asset-grid");
var searchInput = document.getElementById("search-input");
var searchSelect = document.getElementById("search-select");
var noResults = document.getElementById("no-results");
var form = document.getElementById("main-inputs");

var Name = document.getElementById("Name");
var Model = document.getElementById("Model");
var Generation = document.getElementById("Generation");
var AssetTag = document.getElementById("AssetTag");
var Owner = document.getElementById("Owner");
var Notes = document.getElementById("Notes");

newButton.addEventListener("click", openEntryModal);
addButton.addEventListener("click", addEntry);
closeButton.addEventListener("click", closeEntryModal);

document.getElementById("search-input").onkeyup = function () {
  getSearch();
};

document.getElementById("search-select").onchange = function () {
  getSearch();
};

function noResult(laptops) {
  if (laptops == 0) {
    noResults.classList.remove("hidden");
  } else {
    noResults.classList.add("hidden");
  }
}

function openEntryModal() {
  modal.style.display = "block";
  clearInputFields("main-inputs");
}

function closeEntryModal() {
  modal.style.display = "none";
  clearInputFields("main-inputs");
}

function addEntry() {
  modal.style.display = "none";
  postLaptop();
  //clearInputFields("main-inputs");
}

function clearInputFields(divElement) {
  var ele = document.getElementById(divElement);

  for (i = 0; i < ele.childNodes.length; i++) {
    var child = ele.childNodes[i];

    if (child) {
      switch (child.type) {
        case "text":
        case "date":
        case "number":
          child.value = "";
      }
    }
  }
}

async function getAllLaptops() {
  var xhr = new XMLHttpRequest();
  xhr.open("GET", `http://127.0.0.1:5000/laptops`, true);

  xhr.onload = function () {
    if (this.status == 200) {
      var laptops = JSON.parse(this.responseText);
      //console.log(laptops);
      assetGrid.innerHTML = "";
      laptops.forEach((laptop) => {
        const markup =
          `<div class="asset-card" id="${laptop.Id}">` +
          `<h1>${laptop.Name} - ${laptop.AssetTag}</h1>` +
          `<h2>${laptop.Model} ${laptop.Generation}</h2>` +
          `<h2>${laptop.Owner}</h2>` +
          `<h3>${laptop.Notes}</h3>` +
          `</div>`;
        assetGrid.innerHTML += markup;
      });
    }
  };

  xhr.send();
}

async function getAllLaptopsSearch() {
  if (searchInput.value == "") {
    return;
  }
  var xhr = new XMLHttpRequest();
  xhr.open(
    "GET",
    `http://127.0.0.1:5000/laptops/${searchSelect.value}/${searchInput.value}`,
    true
  );

  xhr.onload = function () {
    if (this.status == 200) {
      var laptops = JSON.parse(this.responseText);
      //console.log(laptops.length);
      assetGrid.innerHTML = "";
      laptops.forEach((laptop) => {
        const markup =
          `<div class="asset-card" id="${laptop.Id}">` +
          `<h1>${laptop.Name} - ${laptop.AssetTag}</h1>` +
          `<h2>${laptop.Model} ${laptop.Generation}</h2>` +
          `<h2>${laptop.Owner}</h2>` +
          `<h3>${laptop.Notes}</h3>` +
          `</div>`;
        assetGrid.innerHTML += markup;
      });
      noResult(laptops);
    } else
      (err) => {
        console.log(err);
      };
  };

  xhr.send();
}

async function postLaptop() {
  var xhr = new XMLHttpRequest();
  xhr.open(
    "POST",
    `http://127.0.0.1:5000/laptops/${Name.value}/${Model.value}/${Generation.value}/${AssetTag.value}/${Owner.value}/${Notes.value}`,
    true
  );

  xhr.send();
  getAllLaptops();
}

async function getSearch() {
  if (searchInput.value == "") {
    getAllLaptops();
  } else {
    getAllLaptopsSearch();
  }
}

(async () => {
  getAllLaptops();
})();
