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
  var id = updateMonitor(assetId);
  modal.style.display = "none";
  return id;
}

function noResult(monitors) {
  if (monitors == 0) {
    noResults.classList.remove("hidden");
  } else {
    noResults.classList.add("hidden");
  }
}

function editEntryModal() {
  modal.style.display = "block";
  saveButton.classList.remove("hidden");
  addButton.classList.add("hidden");
  document.getElementById("modal-title").innerHTML = "Edit Monitor";
}

function openEntryModal() {
  modal.style.display = "block";
  saveButton.classList.add("hidden");
  addButton.classList.remove("hidden");
  document.getElementById("modal-title").innerHTML = "New Monitor";
  clearInputFields("main-inputs");
}

function closeEntryModal() {
  modal.style.display = "none";
  clearInputFields("main-inputs");
}

async function addEntry() {
  postMonitor();
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

async function getAllMonitors() {
  var xhr = new XMLHttpRequest();
  xhr.open("GET", `${baseUrl}/allmonitors`, true);

  xhr.onload = function () {
    if (this.status == 200) {
      var monitors = JSON.parse(this.responseText);
      //console.log(laptops.length);
      assetGrid.innerHTML = "";
      monitors.forEach((monitor) => {
        const markup =
          `<div class="asset-card" id="${monitor.Id}">` +
          `<div class="inline hidden">` +
          `<h1>${monitor.SerialNumber}</h1>` +
          `<div class="hidden" id="control-${monitor.Id}">` +
          `<p class="edit-icons" id="edit-${monitor.Id}"><i class="far fa-edit"></i></p>` +
          `<p class="delete-icons" id="delete-${monitor.Id}"><i class="fas fa-trash-alt"></i></p>` +
          `</div>` +
          `</div>` +
          `<h2>${monitor.AssetTag}</h2>` +
          `<h2>${monitor.Model}</h2>` +
          `</div>`;
        assetGrid.insertAdjacentHTML("beforeend", markup);
        const controls = document.getElementById(`control-${monitor.Id}`);
        document
          .getElementById(`${monitor.Id}`)
          .addEventListener("mouseenter", () => {
            controls.classList.toggle("hidden");
            controls.classList.toggle("inline");
          });
        document
          .getElementById(`${monitor.Id}`)
          .addEventListener("mouseleave", () => {
            controls.classList.toggle("hidden");
            controls.classList.toggle("inline");
          });
        document
          .getElementById(`delete-${monitor.Id}`)
          .addEventListener("click", () => {
            var xhr = new XMLHttpRequest();
            xhr.open(
              "POST",
              `${baseUrl}/allmonitors/delete/${monitor.Id}`,
              true
            );
            xhr.send();
            getSearch();
          });
        document
          .getElementById(`edit-${monitor.Id}`)
          .addEventListener("click", () => {
            assetId = monitor.Id;
            editEntryModal();
            var xhr = new XMLHttpRequest();
            xhr.open("GET", `${baseUrl}/allmonitors/get/byid/${assetId}`, true);
            xhr.onload = function () {
              if (this.status == 200) {
                var monitor = JSON.parse(this.responseText);
                SerialNumber.value = monitor[0].SerialNumber;
                Model.value = monitor[0].Model;
                AssetTag.value = monitor[0].AssetTag;
              }
            };

            xhr.send();
          });
      });
      noResult(monitors);
    }
  };

  xhr.send();
}

async function getAllMonitorsSearch() {
  if (searchInput.value == "") {
    return;
  }
  var xhr = new XMLHttpRequest();
  xhr.open(
    "GET",
    `${baseUrl}/allmonitors/${searchSelect.value}/${searchInput.value}`,
    true
  );

  xhr.onload = function () {
    if (this.status == 200) {
      var monitors = JSON.parse(this.responseText);
      //console.log(laptops.length);
      assetGrid.innerHTML = "";
      monitors.forEach((monitor) => {
        const markup =
          `<div class="asset-card" id="${monitor.Id}">` +
          `<div class="inline hidden">` +
          `<h1>${monitor.SerialNumber}</h1>` +
          `<div class="hidden" id="control-${monitor.Id}">` +
          `<p class="edit-icons" id="edit-${monitor.Id}"><i class="far fa-edit"></i></p>` +
          `<p class="delete-icons" id="delete-${monitor.Id}"><i class="fas fa-trash-alt"></i></p>` +
          `</div>` +
          `</div>` +
          `<h2>${monitor.AssetTag}</h2>` +
          `<h2>${monitor.Model}</h2>` +
          `</div>`;
        assetGrid.insertAdjacentHTML("beforeend", markup);
        const controls = document.getElementById(`control-${monitor.Id}`);
        document
          .getElementById(`${monitor.Id}`)
          .addEventListener("mouseenter", () => {
            controls.classList.toggle("hidden");
            controls.classList.toggle("inline");
          });
        document
          .getElementById(`${monitor.Id}`)
          .addEventListener("mouseleave", () => {
            controls.classList.toggle("hidden");
            controls.classList.toggle("inline");
          });
        document
          .getElementById(`delete-${monitor.Id}`)
          .addEventListener("click", () => {
            var xhr = new XMLHttpRequest();
            xhr.open(
              "POST",
              `${baseUrl}/allmonitors/delete/${monitor.Id}`,
              true
            );
            xhr.send();
            getSearch();
          });
        document
          .getElementById(`edit-${monitor.Id}`)
          .addEventListener("click", () => {
            assetId = monitor.Id;
            editEntryModal();
            var xhr = new XMLHttpRequest();
            xhr.open("GET", `${baseUrl}/allmonitors/get/byid/${assetId}`, true);
            xhr.onload = function () {
              if (this.status == 200) {
                var monitor = JSON.parse(this.responseText);
                SerialNumber.value = monitor[0].SerialNumber;
                Model.value = monitor[0].Model;
                AssetTag.value = monitor[0].AssetTag;
              }
            };

            xhr.send();
          });
      });
      noResult(monitors);
    } else
      (err) => {
        console.log(err);
      };
  };

  xhr.send();
}

async function getAllMonitorsByAnySearch() {
  if (searchInput.value == "") {
    return;
  }
  var xhr = new XMLHttpRequest();
  xhr.open(
    "GET",
    `${baseUrl}/allmonitors/any/search/${searchInput.value}`,
    true
  );

  xhr.onload = function () {
    if (this.status == 200) {
      var monitors = JSON.parse(this.responseText);
      //console.log(laptops.length);
      assetGrid.innerHTML = "";
      monitors.forEach((monitor) => {
        const markup =
          `<div class="asset-card" id="${monitor.Id}">` +
          `<div class="inline hidden">` +
          `<h1>${monitor.SerialNumber}</h1>` +
          `<div class="hidden" id="control-${monitor.Id}">` +
          `<p class="edit-icons" id="edit-${monitor.Id}"><i class="far fa-edit"></i></p>` +
          `<p class="delete-icons" id="delete-${monitor.Id}"><i class="fas fa-trash-alt"></i></p>` +
          `</div>` +
          `</div>` +
          `<h2>${monitor.AssetTag}</h2>` +
          `<h2>${monitor.Model}</h2>` +
          `</div>`;
        assetGrid.insertAdjacentHTML("beforeend", markup);
        const controls = document.getElementById(`control-${monitor.Id}`);
        document
          .getElementById(`${monitor.Id}`)
          .addEventListener("mouseenter", () => {
            controls.classList.toggle("hidden");
            controls.classList.toggle("inline");
          });
        document
          .getElementById(`${monitor.Id}`)
          .addEventListener("mouseleave", () => {
            controls.classList.toggle("hidden");
            controls.classList.toggle("inline");
          });
        document
          .getElementById(`delete-${monitor.Id}`)
          .addEventListener("click", () => {
            var xhr = new XMLHttpRequest();
            xhr.open(
              "POST",
              `${baseUrl}/allmonitors/delete/${monitor.Id}`,
              true
            );
            xhr.send();
            getSearch();
          });
        document
          .getElementById(`edit-${monitor.Id}`)
          .addEventListener("click", () => {
            assetId = monitor.Id;
            editEntryModal();
            var xhr = new XMLHttpRequest();
            xhr.open("GET", `${baseUrl}/allmonitors/get/byid/${assetId}`, true);
            xhr.onload = function () {
              if (this.status == 200) {
                var monitor = JSON.parse(this.responseText);
                SerialNumber.value = monitor[0].SerialNumber;
                Model.value = monitor[0].Model;
                AssetTag.value = monitor[0].AssetTag;
              }
            };

            xhr.send();
          });
      });
      noResult(monitors);
    } else
      (err) => {
        console.log(err);
      };
  };

  xhr.send();
}

async function postMonitor() {
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
    `${baseUrl}/allmonitors/${model}/${assetTag}/${serialNumber}`,
    true
  );

  xhr.send();
  getAllMonitors();
}

async function updateMonitor(id) {
  var xhr = new XMLHttpRequest();
  let model = Model.value || "";
  let assetTag = AssetTag.value || "(No asset tag)";
  let serialNumber = SerialNumber.value || "(No computer name)";
  xhr.open(
    "POST",
    `${baseUrl}/allmonitors/update/${id}/${model}/${assetTag}/${serialNumber}`,
    true
  );

  xhr.send();
  getAllMonitors();
}

async function getSearch() {
  if (searchInput.value === "") {
    getAllMonitors();
  } else if (searchSelect.value == "All") {
    getAllMonitorsByAnySearch();
  } else {
    getAllMonitorsSearch();
  }
}

(async () => {
  getAllMonitors();
})();
