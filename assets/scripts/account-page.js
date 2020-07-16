import {
  replaceWithForm,
  useApi,
  getInputValueByForm,
  getUserId,
} from "./helpers";
import { addCreateListHandler } from "./add-list";

window.addEventListener("DOMContentLoaded", initManagement);

function initManagement() {
  if (!document.querySelector(".recipe-list-management-area")) return;

  const list = document.querySelector(".my-lists");
  addListItemActionHandlers(list);

  const listBottom = document.querySelector(".lists-action");
  addCreateListHandler(listBottom);
}

//HANDLERS AND API CALLS

function addListItemActionHandlers(lists) {
  lists.addEventListener("click", (e) => {
    console.log("ran");
    executeListItemAction(e);
  });
  function executeListItemAction(e) {
    const item = e.target;
    const { action } = item.dataset;
    if (!action) return;
    console.log(action, item);
    switch (action) {
      case "delete-list":
        handleDeleteList(item);
        return;
      case "rename-list":
        handleRenameListBtnClick(item);
        return;
    }
  }
}

//DELETE LIST
function handleDeleteList(element) {
  const list = element.closest(".list-item");
  const listId = list.dataset.listId;
  const userId = getUserId();
  const parentElement = list.parentElement;
  list.dataset.state = "hidden";
  deleteList(listId, userId).then((res) => {
    if (res.error) {
      handleError(res.error, list);
    } else {
      if (parentElement.contains(list)) {
        parentElement.removeChild(list);
      }
    }
  });
}
function deleteList(listId, userId) {
  const data = { list_id: parseInt(listId), user_id: parseInt(userId) };
  return useApi("delete-list", data);
}

//RENAME LIST
function handleRenameListBtnClick(element) {
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
  list.dataset.state = "loading";
  useApi("rename-list", { title, list_id }).then((res) => {
    if (res.error) {
      handleError(res.error, list);
    } else {
      list.dataset.state = "idle";
    }
  });
}

//HANDLES ADDING ITEMS TO A LIST
//THIS MAY NEED TO BE ADDED TO A NEW LIST

// Jul 14, 2020 - Joseph changed this to accommodate his staging area.
