//main.js
const BASE_URL = "/wp-json/recipe-list/v1";
const OPTIONS = {
  method: "POST",
  credentials: "same-origin",
  headers: {
    "Content-Type": "application/json",
  },
};
window.addEventListener("DOMContentLoaded", initManagement);

function initManagement() {
  if (!document.querySelector(".recipe-list-management-area")) return;

  const addListForm = document.querySelector("#add-list");
  addListForm.addEventListener("submit", addList);

  const allAddItemBtns = [...document.querySelectorAll(".add_item")];
  allAddItemBtns.forEach((btn) =>
    btn.addEventListener("click", handleAddRecipe)
  );
}
function addList(e) {
  e.preventDefault();
  const listNameInput = document.querySelector("#new-list");
  const listName = listNameInput.value;
  const userId = document.querySelector("[data-user-id]").dataset.userId;
  const body = JSON.stringify({
    user_id: userId,
    title: listName,
  });
  const response = fetch(`${BASE_URL}/create-list`, {
    body,
  })
    .then((res) => res.json())
    .then((res) => console.log(res));
}

function handleAddRecipe(e) {
  const button = e.target;
  const recipeId = button.dataset.recipeId;
  //TODO get list id
  const response = addRecipeToList(recipeId);
}

function addRecipeToList(recipeId, listId = 8052) {
  const body = JSON.stringify({ item_id: parseInt(recipeId), list_id: listId });
  return fetch(`${BASE_URL}/add-item`, {
    ...OPTIONS,
    body,
  });
}
