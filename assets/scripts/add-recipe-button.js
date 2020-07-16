import {
  useApi,
  toggleOnOff,
  updateAllListsWithNewCount,
  handleError,
} from "./helpers";
import { handleShowCreateListForm } from "./account-page";
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
  const newCount = parseInt(countEl.innerText) + 1;
  countEl.innerText = newCount;
  const data = {
    recipeId: component.dataset.recipeId,
    listId: listItem.dataset.listId,
  };
  addRecipeToList(data).then((res) => {
    if (res.error) {
      handleError(res.error, listItem);
    } else {
      listItem.dataset.state = "idle";
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
