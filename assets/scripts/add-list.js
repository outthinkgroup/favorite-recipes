import {
  replaceWithForm,
  getInputValueByForm,
  handleError,
  updateAllListsWithNewList,
  getUserId,
  useApi,
} from "./helpers";

export function addCreateListHandler(parent) {
  console.log("addCreateListHandler Ran", parent);
  const showFormBtn = parent.querySelector(`[data-action='show-create-list']`);
  showFormBtn.addEventListener("click", () =>
    handleShowCreateListForm(showFormBtn)
  );
}
export function handleShowCreateListForm(element) {
  const callback = handleAddList;
  const btnText = "create";
  replaceWithForm({
    element,
    callback,
    btnText,
    replaceParent: false,
    waitTillResolve: true,
  });
}

//ADD LIST
export function handleAddList(e) {
  e.preventDefault();
  const { index0: listName } = getInputValueByForm(e.target);
  const userId = getUserId();
  const listParent = e.target
    .closest(".lists, .add-recipe-to-list")
    .querySelector("ul");
  const listItemCopy = createNewListItem(listParent, listName);
  listItemCopy.dataset.state = "loading";
  addList(listName, userId).then((res) => {
    if (res.error) {
      handleError(res.error, listItemCopy);
    } else {
      const { list_id, link } = res.data;
      const listItem = updateNewListItemWith({
        listItemCopy,
        list_id,
        link: window.__FAVE_RECIPE.newListItemLink
          ? window.__FAVE_RECIPE.newListItemLink
          : link, //add ability for other scripts to give default link for new collections
      });
      listItem.dataset.state = "idle";
      // this is for the recipe button
      if (listParent.classList.contains("lists")) {
        updateAllListsWithNewList(listItem, listParent);
      }
    }
  });
}

function createNewListItem(listParent, listName) {
  const listItemCopy = listParent
    .querySelector("li:last-child")
    .cloneNode(true);
  listItemCopy.querySelector(".recipe-title .title-el").innerText = listName;
  listParent.prepend(listItemCopy);
  return listItemCopy;
}
function updateNewListItemWith({ listItemCopy, list_id, link }) {
  listItemCopy.dataset.listId = list_id;
  const allLinks = [...listItemCopy.querySelectorAll("a")];
  console.log(allLinks);
  allLinks.forEach((anchorEl) => {
    anchorEl.setAttribute("href", link);
    console.log(link.href);
  });

  return listItemCopy;
}

function addList(listName, userId) {
  const data = { user_id: parseInt(userId), title: listName };
  return useApi("create-list", data);
}
