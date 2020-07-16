import { useApi, toggleOnOff } from "./helpers";
import { addCreateListHandler, handleShowCreateListForm } from "./account-page";
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
        addRecipeToList({
          recipeId: component.dataset.recipeId,
          listId: button.parentElement.dataset.listId,
        });
        plusOneCountFor(button.parentElement.dataset.listId);
        break;
      case "show-create-list":
        handleShowCreateListForm(button);
      default:
        console.log("no action was given");
        break;
    }
  }

  function addRecipeToList({ recipeId, listId }) {
    return useApi("add-item", { item_id: parseInt(recipeId), list_id: listId });
  }

  function plusOneCountFor(listId) {
    const allListWithID = document.querySelectorAll(
      `[data-list-id="${listId}"]`
    );
    allListWithID.forEach((list) => {
      const countEl = list.querySelector(".recipe-title .count");
      const updatedCount = parseInt(countEl.innerText) + 1;
      countEl.innerText = updatedCount;
    });
  }
}
