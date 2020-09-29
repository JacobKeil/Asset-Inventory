var modal = document.getElementById("newEntry");
var newButton = document.getElementById("new-button");
var addButton = document.getElementById("add-button");
var closeButton = document.getElementById("closeModalBtn");
var saveButton = document.getElementById("save-button");
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

var getUrl = window.location;
var baseUrl = getUrl.protocol + "//" + getUrl.host;

let assetId = 0;

newButton.addEventListener("click", openEntryModal);
addButton.addEventListener("click", addEntry);
closeButton.addEventListener("click", closeEntryModal);
saveButton.addEventListener("click", getID);

document.getElementById("search-input").onkeyup = function () {
  getSearch();
};

document.getElementById("search-select").onchange = function () {
  getSearch();
};

function getID() {
  var id = updateLaptop(assetId);
  modal.style.display = "none";
  return id;
}

function noResult(laptops) {
  if (laptops == 0) {
    noResults.classList.remove("hidden");
  } else {
    noResults.classList.add("hidden");
  }
}

function editEntryModal() {
  modal.style.display = "block";
  saveButton.classList.remove("hidden");
  addButton.classList.add("hidden");
  document.getElementById("modal-title").innerHTML = "Edit Laptop";
}

function openEntryModal() {
  modal.style.display = "block";
  saveButton.classList.add("hidden");
  addButton.classList.remove("hidden");
  document.getElementById("modal-title").innerHTML = "New Laptop";
  clearInputFields("main-inputs");
}

function closeEntryModal() {
  modal.style.display = "none";
  clearInputFields("main-inputs");
}

async function addEntry() {
  modal.style.display = "none";
  postLaptop();
  //location.reload();
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
  xhr.open("GET", `${baseUrl}/laptops`, true);

  xhr.onload = function () {
    if (this.status == 200) {
      var laptops = JSON.parse(this.responseText);
      //console.log(laptops);
      assetGrid.innerHTML = "";
      laptops.forEach((laptop) => {
        const markup =
          `<div class="asset-card" id="${laptop.Id}">` +
          `<div class="inline hidden">` +
          `<h1>${laptop.Name} - ${laptop.AssetTag}</h1>` +
          `<div class="hidden" id="control-${laptop.Id}">` +
          `<p class="edit-icons" id="edit-${laptop.Id}"><i class="far fa-edit"></i></p>` +
          `<p class="delete-icons" id="delete-${laptop.Id}"><i class="fas fa-trash-alt"></i></p>` +
          `</div>` +
          `</div>` +
          `<h2>${laptop.Owner}</h2>` +
          `<h2>${laptop.Model} ${laptop.Generation}</h2>` +
          `<h3>${laptop.Notes}</h3>` +
          `</div>`;
        assetGrid.insertAdjacentHTML("beforeend", markup);
        const controls = document.getElementById(`control-${laptop.Id}`);
        document
          .getElementById(`${laptop.Id}`)
          .addEventListener("mouseenter", () => {
            controls.classList.toggle("hidden");
            controls.classList.toggle("inline");
          });
        document
          .getElementById(`${laptop.Id}`)
          .addEventListener("mouseleave", () => {
            controls.classList.toggle("hidden");
            controls.classList.toggle("inline");
          });
        document
          .getElementById(`delete-${laptop.Id}`)
          .addEventListener("click", () => {
            var xhr = new XMLHttpRequest();
            xhr.open("POST", `${baseUrl}/laptops/delete/${laptop.Id}`, true);
            xhr.send();
            getSearch();
          });
        document
          .getElementById(`edit-${laptop.Id}`)
          .addEventListener("click", () => {
            assetId = laptop.Id;
            editEntryModal();
            var xhr = new XMLHttpRequest();
            xhr.open("GET", `${baseUrl}/laptops/get/byid/${assetId}`, true);
            xhr.onload = function () {
              if (this.status == 200) {
                var laptop = JSON.parse(this.responseText);
                Name.value = laptop[0].Name;
                Model.value = laptop[0].Model;
                Generation.value = laptop[0].Generation;
                AssetTag.value = laptop[0].AssetTag;
                Owner.value = laptop[0].Owner;
                Notes.value = laptop[0].Notes;
              }
            };

            xhr.send();
          });
      });
      noResult(laptops);
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
    `${baseUrl}/laptops/${searchSelect.value}/${searchInput.value}`,
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
          `<div class="inline hidden">` +
          `<h1>${laptop.Name} - ${laptop.AssetTag}</h1>` +
          `<div class="hidden" id="control-${laptop.Id}">` +
          `<p class="edit-icons" id="edit-${laptop.Id}"><i class="far fa-edit"></i></p>` +
          `<p class="delete-icons" id="delete-${laptop.Id}"><i class="fas fa-trash-alt"></i></p>` +
          `</div>` +
          `</div>` +
          `<h2>${laptop.Owner}</h2>` +
          `<h2>${laptop.Model} ${laptop.Generation}</h2>` +
          `<h3>${laptop.Notes}</h3>` +
          `</div>`;
        assetGrid.insertAdjacentHTML("beforeend", markup);
        const controls = document.getElementById(`control-${laptop.Id}`);
        document
          .getElementById(`${laptop.Id}`)
          .addEventListener("mouseenter", () => {
            controls.classList.toggle("hidden");
            controls.classList.toggle("inline");
          });
        document
          .getElementById(`${laptop.Id}`)
          .addEventListener("mouseleave", () => {
            controls.classList.toggle("hidden");
            controls.classList.toggle("inline");
          });
        document
          .getElementById(`delete-${laptop.Id}`)
          .addEventListener("click", () => {
            var xhr = new XMLHttpRequest();
            xhr.open("POST", `${baseUrl}/laptops/delete/${laptop.Id}`, true);
            xhr.send();
            getSearch();
          });
        document
          .getElementById(`edit-${laptop.Id}`)
          .addEventListener("click", () => {
            assetId = laptop.Id;
            editEntryModal();
            var xhr = new XMLHttpRequest();
            xhr.open("GET", `${baseUrl}/laptops/get/byid/${assetId}`, true);
            xhr.onload = function () {
              if (this.status == 200) {
                var laptop = JSON.parse(this.responseText);
                Name.value = laptop[0].Name;
                Model.value = laptop[0].Model;
                Generation.value = laptop[0].Generation;
                AssetTag.value = laptop[0].AssetTag;
                Owner.value = laptop[0].Owner;
                Notes.value = laptop[0].Notes;
              }
            };

            xhr.send();
          });
      });
      noResult(laptops);
    } else
      (err) => {
        console.log(err);
      };
  };

  xhr.send();
}

async function getAllLaptopsByAnySearch() {
  if (searchInput.value == "") {
    return;
  }
  var xhr = new XMLHttpRequest();
  xhr.open("GET", `${baseUrl}/laptops/any/search/${searchInput.value}`, true);

  xhr.onload = function () {
    if (this.status == 200) {
      var laptops = JSON.parse(this.responseText);
      //console.log(laptops.length);
      assetGrid.innerHTML = "";
      laptops.forEach((laptop) => {
        const markup =
          `<div class="asset-card" id="${laptop.Id}">` +
          `<div class="inline hidden">` +
          `<h1>${laptop.Name} - ${laptop.AssetTag}</h1>` +
          `<div class="hidden" id="control-${laptop.Id}">` +
          `<p class="edit-icons" id="edit-${laptop.Id}"><i class="far fa-edit"></i></p>` +
          `<p class="delete-icons" id="delete-${laptop.Id}"><i class="fas fa-trash-alt"></i></p>` +
          `</div>` +
          `</div>` +
          `<h2>${laptop.Owner}</h2>` +
          `<h2>${laptop.Model} ${laptop.Generation}</h2>` +
          `<h3>${laptop.Notes}</h3>` +
          `</div>`;
        assetGrid.insertAdjacentHTML("beforeend", markup);
        const controls = document.getElementById(`control-${laptop.Id}`);
        document
          .getElementById(`${laptop.Id}`)
          .addEventListener("mouseenter", () => {
            controls.classList.toggle("hidden");
            controls.classList.toggle("inline");
          });
        document
          .getElementById(`${laptop.Id}`)
          .addEventListener("mouseleave", () => {
            controls.classList.toggle("hidden");
            controls.classList.toggle("inline");
          });
        document
          .getElementById(`delete-${laptop.Id}`)
          .addEventListener("click", () => {
            var xhr = new XMLHttpRequest();
            xhr.open("POST", `${baseUrl}/laptops/delete/${laptop.Id}`, true);
            xhr.send();
            getSearch();
          });
        document
          .getElementById(`edit-${laptop.Id}`)
          .addEventListener("click", () => {
            assetId = laptop.Id;
            editEntryModal();
            var xhr = new XMLHttpRequest();
            xhr.open("GET", `${baseUrl}/laptops/get/byid/${assetId}`, true);
            xhr.onload = function () {
              if (this.status == 200) {
                var laptop = JSON.parse(this.responseText);
                Name.value = laptop[0].Name;
                Model.value = laptop[0].Model;
                Generation.value = laptop[0].Generation;
                AssetTag.value = laptop[0].AssetTag;
                Owner.value = laptop[0].Owner;
                Notes.value = laptop[0].Notes;
              }
            };

            xhr.send();
          });
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
  let name = Name.value || "(No computer name)";
  let model = Model.value || "";
  let generation = Generation.value || "";
  let assetTag = AssetTag.value || "(No asset tag)";
  let owner = Owner.value || "(No owner)";
  let notes = Notes.value || "(No notes)";
  xhr.open(
    "POST",
    `${baseUrl}/laptops/${name}/${model}/${generation}/${assetTag}/${owner}/${notes}`,
    true
  );

  xhr.send();
  getAllLaptops();
}

async function updateLaptop(id) {
  var xhr = new XMLHttpRequest();
  let name = Name.value || "(No computer name)";
  let model = Model.value || "";
  let generation = Generation.value || "";
  let assetTag = AssetTag.value || "(No asset tag)";
  let owner = Owner.value || "(No owner)";
  let notes = Notes.value || "(No notes)";
  xhr.open(
    "POST",
    `${baseUrl}/laptops/update/${id}/${name}/${model}/${generation}/${assetTag}/${owner}/${notes}`,
    true
  );

  xhr.send();
  getAllLaptops();
}

async function getSearch() {
  if (searchInput.value === "") {
    getAllLaptops();
  } else if (searchSelect.value == "All") {
    getAllLaptopsByAnySearch();
  } else {
    getAllLaptopsSearch();
  }
}

(async () => {
  getAllLaptops();
})();
