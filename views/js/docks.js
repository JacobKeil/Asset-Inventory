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

var Model = document.getElementById("Model");
var AssetTag = document.getElementById("AssetTag");
var SerialNumber = document.getElementById("SerialNumber");

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
  var id = updateDock(assetId);
  modal.style.display = "none";
  return id;
}

function noResult(docks) {
  if (docks == 0) {
    noResults.classList.remove("hidden");
  } else {
    noResults.classList.add("hidden");
  }
}

function editEntryModal() {
  modal.style.display = "block";
  saveButton.classList.remove("hidden");
  addButton.classList.add("hidden");
  document.getElementById("modal-title").innerHTML = "Edit Dock";
}

function openEntryModal() {
  modal.style.display = "block";
  saveButton.classList.add("hidden");
  addButton.classList.remove("hidden");
  document.getElementById("modal-title").innerHTML = "New Dock";
  clearInputFields("main-inputs");
}

function closeEntryModal() {
  modal.style.display = "none";
  clearInputFields("main-inputs");
}

async function addEntry() {
  postDock();
  if (SerialNumber.value !== "" || AssetTag.value !== "") {
    modal.style.display = "none";
    return;
  }
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

async function getAllDocks() {
  var xhr = new XMLHttpRequest();
  xhr.open("GET", `${baseUrl}/alldocks`, true);

  xhr.onload = function () {
    if (this.status == 200) {
      var docks = JSON.parse(this.responseText);
      //console.log(laptops.length);
      assetGrid.innerHTML = "";
      docks.forEach((dock) => {
        const markup =
          `<div class="asset-card" id="${dock.Id}">` +
          `<div class="inline hidden">` +
          `<h1>${dock.SerialNumber}</h1>` +
          `<div class="hidden" id="control-${dock.Id}">` +
          `<p class="edit-icons" id="edit-${dock.Id}"><i class="far fa-edit"></i></p>` +
          `<p class="delete-icons" id="delete-${dock.Id}"><i class="fas fa-trash-alt"></i></p>` +
          `</div>` +
          `</div>` +
          `<h2>${dock.AssetTag}</h2>` +
          `<h2>${dock.Model}</h2>` +
          `</div>`;
        assetGrid.insertAdjacentHTML("beforeend", markup);
        const controls = document.getElementById(`control-${dock.Id}`);
        document
          .getElementById(`${dock.Id}`)
          .addEventListener("mouseenter", () => {
            controls.classList.toggle("hidden");
            controls.classList.toggle("inline");
          });
        document
          .getElementById(`${dock.Id}`)
          .addEventListener("mouseleave", () => {
            controls.classList.toggle("hidden");
            controls.classList.toggle("inline");
          });
        document
          .getElementById(`delete-${dock.Id}`)
          .addEventListener("click", () => {
            var xhr = new XMLHttpRequest();
            xhr.open("POST", `${baseUrl}/alldocks/delete/${dock.Id}`, true);
            xhr.send();
            getSearch();
          });
        document
          .getElementById(`edit-${dock.Id}`)
          .addEventListener("click", () => {
            assetId = dock.Id;
            editEntryModal();
            var xhr = new XMLHttpRequest();
            xhr.open("GET", `${baseUrl}/alldocks/get/byid/${assetId}`, true);
            xhr.onload = function () {
              if (this.status == 200) {
                var dock = JSON.parse(this.responseText);
                SerialNumber.value = dock[0].SerialNumber;
                Model.value = dock[0].Model;
                AssetTag.value = dock[0].AssetTag;
              }
            };

            xhr.send();
          });
      });
      noResult(docks);
    }
  };

  xhr.send();
}

async function getAllDocksSearch() {
  if (searchInput.value == "") {
    return;
  }
  var xhr = new XMLHttpRequest();
  xhr.open(
    "GET",
    `${baseUrl}/alldocks/${searchSelect.value}/${searchInput.value}`,
    true
  );

  xhr.onload = function () {
    if (this.status == 200) {
      var docks = JSON.parse(this.responseText);
      //console.log(laptops.length);
      assetGrid.innerHTML = "";
      docks.forEach((dock) => {
        const markup =
          `<div class="asset-card" id="${dock.Id}">` +
          `<div class="inline hidden">` +
          `<h1>${dock.SerialNumber}</h1>` +
          `<div class="hidden" id="control-${dock.Id}">` +
          `<p class="edit-icons" id="edit-${dock.Id}"><i class="far fa-edit"></i></p>` +
          `<p class="delete-icons" id="delete-${dock.Id}"><i class="fas fa-trash-alt"></i></p>` +
          `</div>` +
          `</div>` +
          `<h2>${dock.AssetTag}</h2>` +
          `<h2>${dock.Model}</h2>` +
          `</div>`;
        assetGrid.insertAdjacentHTML("beforeend", markup);
        const controls = document.getElementById(`control-${dock.Id}`);
        document
          .getElementById(`${dock.Id}`)
          .addEventListener("mouseenter", () => {
            controls.classList.toggle("hidden");
            controls.classList.toggle("inline");
          });
        document
          .getElementById(`${dock.Id}`)
          .addEventListener("mouseleave", () => {
            controls.classList.toggle("hidden");
            controls.classList.toggle("inline");
          });
        document
          .getElementById(`delete-${dock.Id}`)
          .addEventListener("click", () => {
            var xhr = new XMLHttpRequest();
            xhr.open("POST", `${baseUrl}/alldocks/delete/${dock.Id}`, true);
            xhr.send();
            getSearch();
          });
        document
          .getElementById(`edit-${dock.Id}`)
          .addEventListener("click", () => {
            assetId = dock.Id;
            editEntryModal();
            var xhr = new XMLHttpRequest();
            xhr.open("GET", `${baseUrl}/alldocks/get/byid/${assetId}`, true);
            xhr.onload = function () {
              if (this.status == 200) {
                var dock = JSON.parse(this.responseText);
                SerialNumber.value = dock[0].SerialNumber;
                Model.value = dock[0].Model;
                AssetTag.value = dock[0].AssetTag;
              }
            };

            xhr.send();
          });
      });
      noResult(docks);
    } else
      (err) => {
        console.log(err);
      };
  };

  xhr.send();
}

async function getAllDocksByAnySearch() {
  if (searchInput.value == "") {
    return;
  }
  var xhr = new XMLHttpRequest();
  xhr.open("GET", `${baseUrl}/alldocks/any/search/${searchInput.value}`, true);

  xhr.onload = function () {
    if (this.status == 200) {
      var docks = JSON.parse(this.responseText);
      //console.log(laptops.length);
      assetGrid.innerHTML = "";
      docks.forEach((dock) => {
        const markup =
          `<div class="asset-card" id="${dock.Id}">` +
          `<div class="inline hidden">` +
          `<h1>${dock.SerialNumber}</h1>` +
          `<div class="hidden" id="control-${dock.Id}">` +
          `<p class="edit-icons" id="edit-${dock.Id}"><i class="far fa-edit"></i></p>` +
          `<p class="delete-icons" id="delete-${dock.Id}"><i class="fas fa-trash-alt"></i></p>` +
          `</div>` +
          `</div>` +
          `<h2>${dock.AssetTag}</h2>` +
          `<h2>${dock.Model}</h2>` +
          `</div>`;
        assetGrid.insertAdjacentHTML("beforeend", markup);
        const controls = document.getElementById(`control-${dock.Id}`);
        document
          .getElementById(`${dock.Id}`)
          .addEventListener("mouseenter", () => {
            controls.classList.toggle("hidden");
            controls.classList.toggle("inline");
          });
        document
          .getElementById(`${dock.Id}`)
          .addEventListener("mouseleave", () => {
            controls.classList.toggle("hidden");
            controls.classList.toggle("inline");
          });
        document
          .getElementById(`delete-${dock.Id}`)
          .addEventListener("click", () => {
            var xhr = new XMLHttpRequest();
            xhr.open("POST", `${baseUrl}/alldocks/delete/${dock.Id}`, true);
            xhr.send();
            getSearch();
          });
        document
          .getElementById(`edit-${dock.Id}`)
          .addEventListener("click", () => {
            assetId = dock.Id;
            editEntryModal();
            var xhr = new XMLHttpRequest();
            xhr.open("GET", `${baseUrl}/alldocks/get/byid/${assetId}`, true);
            xhr.onload = function () {
              if (this.status == 200) {
                var dock = JSON.parse(this.responseText);
                SerialNumber.value = dock[0].SerialNumber;
                Model.value = dock[0].Model;
                AssetTag.value = dock[0].AssetTag;
              }
            };

            xhr.send();
          });
      });
      noResult(docks);
    } else
      (err) => {
        console.log(err);
      };
  };

  xhr.send();
}

async function postDock() {
  if (SerialNumber.value === "" || AssetTag.value === "") {
    alert("Please provide the serial number and asset tag!");
    return;
  }
  var xhr = new XMLHttpRequest();
  let model = Model.value || "";
  let assetTag = AssetTag.value || "(No asset tag)";
  let serialNumber = SerialNumber.value || "(No serial number)";
  xhr.open(
    "POST",
    `${baseUrl}/alldocks/${model}/${assetTag}/${serialNumber}`,
    true
  );

  xhr.send();
  getAllDocks();
}

async function updateDock(id) {
  var xhr = new XMLHttpRequest();
  let model = Model.value || "";
  let assetTag = AssetTag.value || "(No asset tag)";
  let serialNumber = SerialNumber.value || "(No computer name)";
  xhr.open(
    "POST",
    `${baseUrl}/alldocks/update/${id}/${model}/${assetTag}/${serialNumber}`,
    true
  );

  xhr.send();
  getAllDocks();
}

async function getSearch() {
  if (searchInput.value === "") {
    getAllDocks();
  } else if (searchSelect.value == "All") {
    getAllDocksByAnySearch();
  } else {
    getAllDocksSearch();
  }
}

(async () => {
  getAllDocks();
})();
