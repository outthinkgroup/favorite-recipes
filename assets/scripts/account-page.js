import { replaceWithForm, useApi, getInputValueByForm } from "./helpers";

window.addEventListener("DOMContentLoaded", initManagement);

function initManagement() {
  if (!document.querySelector(".recipe-list-management-area")) return;

  const list = document.querySelector(".my-lists");
  addListItemActionHandlers(list);

  const listBottom = document.querySelector(".lists-action");
  addCreateListHandler(listBottom);
}

//HANDLERS AND API CALLS
function addCreateListHandler(parent) {
  const showFormBtn = parent.querySelector(`[data-action='show-create-list']`);
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
    waitTillResolve: true,
  });
}

//ADD LIST
function handleAddList(e) {
  e.preventDefault();
  const { index0: listName } = getInputValueByForm(e.target);
  const userId = getUserId();
  const listParent = document.querySelector(".my-lists");
  const listItemCopy = createNewListItem(listParent, listName);
  listItemCopy.dataset.state = "loading";
  addList(listName, userId).then((res) => {
    if (res.error) {
      listItemCopy.dataset.state = "error";
    } else {
      const { list_id, link, title } = res.data;
      const listItem = updateNewListItemWith({
        listItemCopy,
        list_id,
        link,
        title,
      });
      listItem.dataset.state = "idle";
    }
  });
}
function createNewListItem(listParent, listName) {
  const listItemCopy = listParent.querySelector(".list-item").cloneNode(true);
  listItemCopy.querySelector(".recipe-title a").innerText = listName;
  listParent.prepend(listItemCopy);
  return listItemCopy;
}
function updateNewListItemWith({ listItemCopy, list_id, link, title }) {
  listItemCopy.dataset.listId = list_id;
  const titleEl = listItemCopy.querySelector(".recipe-title a");
  titleEl.setAttribute("href", link);
  titleEl.innerText = title;
  return listItemCopy;
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
      case "rename-list":
        handleRenameListBtnClick(item);
    }
  }
}

//DELETE LIST
function handleDeleteList(element) {
  const list = element.closest(".list-item");
  const listId = list.dataset.listId;
  const parentElement = list.parentElement;
  const userId = getUserId();
  list.dataset.state = "loading";
  deleteList(listId, userId).then((res) => {
    if (res.error) {
      list.dataset.state = "error";
    } else {
      parentElement.removeChild(list);
    }
  });
}
function deleteList(listId, userId) {
  const data = { list_id: parseInt(listId), user_id: parseInt(userId) };
  return useApi("delete-list", data);
}

//RENAME LIST
function handleRenameListBtnClick(element) {
  const titleEl = element
    .closest(".list-item")
    .querySelector(".recipe-title a");
  replaceWithForm({
    element,
    callback: handleRenameRecipe,
    btnText: "rename",
    replaceParent: true,
    changeInnerTextOfEl: ".recipe-title a",
  });
}
function handleRenameRecipe(e, parent) {
  e.preventDefault();
  const { index0: title } = getInputValueByForm(e.target);
  const list = e.target.closest(".list-item");
  const list_id = list.dataset.listId;
  const titleEl = parent.querySelector("a");
  list.dataset.state = "loading";
  useApi("rename-list", { title, list_id }).then((res) => {
    if (res.error) {
      console.log(res.error);
      list.dataset.state = "error";
    } else {
      console.log("ran");
      list.dataset.state = "idle";
    }
  });
}

//HANDLES ADDING ITEMS TO A LIST
//THIS MAY NEED TO BE ADDED TO A NEW LIST

// Jul 14, 2020 - Joseph changed this to accommodate his staging area.

function getUserId() {
  return document.querySelector("[data-user-id]").dataset.userId;
}
