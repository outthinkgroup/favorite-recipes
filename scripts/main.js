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
  addListForm.addEventListener("submit", handleAddList);

  const allDeleteListBtns = [...document.querySelectorAll(".delete-button")];
  allDeleteListBtns.forEach((btn) =>
    btn.addEventListener("click", handleDeleteList)
  );

  const allRenameListBtns = [...document.querySelectorAll(".rename-button")];
  allRenameListBtns.forEach((btn) =>
    btn.addEventListener("click", handleRenameListBtnClick)
  );

  const allAddItemBtns = [...document.querySelectorAll(".add_item")];
  allAddItemBtns.forEach((btn) =>
    btn.addEventListener("click", handleAddRecipe)
  );
}

//HANDLERS AND API CALLS
//ADD LIST
function handleAddList(e) {
  e.preventDefault();
  const listName = getInputValue("#new-list");
  const userId = getUserId();
  const response = addList(listName, userId).then((res) => console.log(res));
}
function addList(listName, userId) {
  const data = { user_id: parseInt(userId), title: listName };
  return useApi("create-list", data);
}

//DELETE LIST
function handleDeleteList(e) {
  const listId = e.target.closest(".list-item").dataset.listId;
  const userId = getUserId();
  const response = removeList(listId, userId).then((res) => console.log(res));
}
function deleteList(listId, userId) {
  const data = { list_id: parseInt(listId), user_id: parseInt(userId) };
  return useApi("delete-list", data);
}

//RENAME LIST
function handleRenameListBtnClick(e) {
  replaceWithForm(e.target, () => console.log("yay"), "rename", true);
}

function handleAddRecipe(e) {
  const button = e.target;
  const recipeId = button.dataset.recipeId;
  //TODO get list id
  const response = addRecipeToList(recipeId).then((res) => console.log(res));
}
function addRecipeToList(recipeId, listId = 8052) {
  return useApi("add-item", { item_id: parseInt(recipeId), list_id: listId });
}

function useApi(endpoint, data) {
  const body = JSON.stringify(data);
  return fetch(`${BASE_URL}/${endpoint}`, {
    ...OPTIONS,
    body,
  }).then((res) => res.json());
}
function getInputValue(selector) {
  const el = document.querySelector(selector);
  const value = el.value;
  return value;
}
function getUserId() {
  return document.querySelector("[data-user-id]").dataset.userId;
}

function replaceWithForm(
  el,
  callback,
  btnText = "submit",
  replaceParent = false
) {
  const form = document.createElement("form");
  const parent = el.parentElement;
  form.addEventListener("submit", (e) => {
    callback(e);
    if (!replaceParent) {
      form.replaceWith(el);
    } else {
      form.replaceWith(parent);
    }
  });
  form.innerHTML = `
    <input type="text" class="small-inline-input" /> 
    <button type="submit">${btnText}</button>
    `;
  if (!replaceParent) {
    el.replaceWith(form);
  } else {
    parent.replaceWith(form);
  }
}
