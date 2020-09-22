var assetCard = document.createElement("div");

var modal = document.getElementById("newEntry");
var newButton = document.getElementById("new-button");
var addButton = document.getElementById("add-button");
var cancelButton = document.getElementById("cancel-button");

newButton.addEventListener("click", openEntryModal);
addButton.addEventListener("click", addEntry);
cancelButton.addEventListener("click", closeEntryModal);

function openEntryModal() {
  modal.style.display = "block";
}

function closeEntryModal() {
  modal.style.display = "none";
}

function addEntry() {
  modal.style.display = "none";
  console.log(document.getElementById("pcname").value);
}
