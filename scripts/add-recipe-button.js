import { useApi } from "./helpers";
window.addEventListener("DOMContentLoaded", addRecipeToListButtonInit);
function addRecipeToListButtonInit() {
  const mainComponents = [...document.querySelectorAll(".add-recipe-to-list")];
  mainComponents.forEach((component) => perMainComponentDo(component));
}

function toggleOnOff(actionElement, parentElementSelector, action = "click") {
  actionElement.addEventListener(action, toggleState);
  if (action === "click") {
    document.body.addEventListener(action, toggleOff);
  }
  function toggleState(e) {
    const parentEl = e.target.closest(parentElementSelector);
    const on = parentEl.dataset.state;
    if (on) {
      delete parentEl.dataset.state;
    } else {
      parentEl.dataset.state = "on";
    }
  }
  function toggleOff(e) {
    if (!e.target.closest(parentElementSelector)) {
      delete actionElement.closest(parentElementSelector).dataset.state;
    }
  }
}

function addRecipeToList({ recipeId, listId }) {
  return useApi("add-item", { item_id: parseInt(recipeId), list_id: listId });
}

function perMainComponentDo(component) {
  const toggleButton = component.querySelector('[data-action="toggle-list"]');
  toggleOnOff(toggleButton, ".add-recipe-to-list");

  const list = component.querySelector(".button-lists");
  list.addEventListener("click", handleRecipeListItemActionFromButton);

  function handleRecipeListItemActionFromButton(e) {
    const clickedItem = e.target;
    const button = clickedItem.closest("[data-action]");
    const action = button.dataset.action;

    switch (action) {
      case "add-recipe":
        addRecipeToList({
          recipeId: component.dataset.recipeId,
          listId: button.dataset.listId,
        });
        plusOneCountFor(button.dataset.listId);
        break;
      default:
        console.log("no action was given");
        break;
    }
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
