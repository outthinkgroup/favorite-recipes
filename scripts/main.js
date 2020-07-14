import {
  replaceWithForm,
  useApi,
  getInputValue,
  getInputValueByForm,
} from "./helpers";

window.addEventListener("DOMContentLoaded", initManagement);

function initManagement() {
  if (!document.querySelector(".recipe-list-management-area")) return;

  const list = document.querySelector(".my-lists");
  addListItemActionHandlers(list);

  const listBottom = document.querySelector(".list-bottom");
  addCreateListHandler(listBottom);
}

//HANDLERS AND API CALLS
function addCreateListHandler(parent) {
  console.log("object");
  const showFormBtn = parent.querySelector(`[data-action="show-create-list"]`);
  showFormBtn.addEventListener("click", handleShowCreateListForm);
}
function handleShowCreateListForm(e) {
  const element = e.currentTarget;
  const callback = handleAddList;
  const formLabel = "List Name";
  const btnText = "create";
  replaceWithForm({
    element,
    callback,
    formLabel,
    btnText,
    replaceParent: false,
  });
}

//ADD LIST
function handleAddList(e) {
  e.preventDefault();
  const { index0: listName } = getInputValueByForm(e.target);
  const userId = getUserId();
  const response = addList(listName, userId).then((res) => console.log(res));
}
function addList(listName, userId) {
  const data = { user_id: parseInt(userId), title: listName };
  return useApi("create-list", data);
}

function addListItemActionHandlers(list) {
  list.addEventListener("click", executeListItemAction);
  function executeListItemAction(e) {
    const item = e.target;
    const { action } = item.dataset;
    if (!action) return;

    switch (action) {
      case "delete-list":
        handleDeleteList(item);
        break;
    }
  }
}

//DELETE LIST
function handleDeleteList(element) {
  const listId = element.closest(".list-item").dataset.listId;
  const userId = getUserId();
  const response = deleteList(listId, userId).then((res) => console.log(res));
}
function deleteList(listId, userId) {
  const data = { list_id: parseInt(listId), user_id: parseInt(userId) };
  return useApi("delete-list", data);
}

//RENAME LIST
function handleRenameListBtnClick(e) {
  replaceWithForm({
    element: e.target,
    callback: () => console.log("yay"),
    btnText: "rename",
    replaceParent: true,
  });
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

function getUserId() {
  return document.querySelector("[data-user-id]").dataset.userId;
}
