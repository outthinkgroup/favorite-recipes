import {
  useApi,
  toggleOnOff,
  updateAllListsWithNewCount,
  handleError,
} from "./helpers";

import { handleShowCreateListForm } from "./add-list";

window.addEventListener("DOMContentLoaded", addRecipeToListButtonInit);

function addRecipeToListButtonInit() {
  const mainComponents = [...document.querySelectorAll(".add-recipe-to-list")];
  mainComponents.forEach((component) => perMainComponentDo(component));
}

function perMainComponentDo(component) {
  const toggleButton = component.querySelector('[data-action="toggle-list"]');
  toggleOnOff(toggleButton, ".add-recipe-to-list");

  const list = component.querySelector(".button-lists");
  list.addEventListener("click", handleRecipeListItemActionFromButton);

  function handleRecipeListItemActionFromButton(e) {
    const clickedItem = e.target;
    const button = clickedItem.closest("[data-action]");
    const action = button && button.dataset.action;
    if (!action) return;

    switch (action) {
      case "add-recipe":
        handleAddRecipeToList(button.parentElement, component);
        break;
      case "show-create-list":
        handleShowCreateListForm(button);
      default:
        console.log("no action was given");
        break;
    }
  }
}
function handleAddRecipeToList(listItem, component) {
  listItem.dataset.state = "loading";
  const countEl = listItem.querySelector(".count");
  const buttonEl = listItem.querySelector("button");
  const newCount = parseInt(countEl.innerText) + 1;
  countEl.innerText = newCount;
  const data = {
    recipeId: component.dataset.recipeId,
    listId: listItem.dataset.listId,
  };
  buttonEl.disabled = true;
  addRecipeToList(data).then((res) => {
    if (res.error) {
      buttonEl.disabled = false;
      handleError(res.error, listItem);
    } else {
      listItem.dataset.state = "idle";
      buttonEl.disabled = true; //stops users from adding it again
      listItem.dataset.inList = true;
      updateAllListsWithNewCount({
        itemId: data.listId,
        newCount,
        parentElement: listItem.parentElement,
      });
    }
  });
}

function addRecipeToList({ recipeId, listId }) {
  return useApi("add-item", { item_id: parseInt(recipeId), list_id: listId });
}

function changeListPrivacyMode({ list_id, status, user_id }) {
  return useApi("change-list-status", { list_id, status, user_id });
}

function renameList({ title, list_id }) {
  return useApi("rename-list", { title, list_id });
}

function forkList({ list_id, user_id, list_title }) {
  return useApi("fork-list", { list_id, user_id, list_title });
}
//adding to global window for theme authors to use
window.__FAVE_RECIPE = {
  ...window.__FAVE_RECIPE,
  addRecipeToList,
  changeListPrivacyMode,
  forkList,
  renameList,
};
