//main.js
window.addEventListener("DOMContentLoaded", initManagement);

function initManagement() {
  if (!document.querySelector(".recipe-list-management-area")) return;

  const addListForm = document.querySelector("#add-list");
  addListForm.addEventListener("submit", addList);
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
  const response = fetch(
    "https://nicolehunn.local/wp-json/recipe-list/v1/create-list",
    {
      method: "POST",
      body,
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
      },
    }
  )
    .then((res) => res.json())
    .then((res) => console.log(res));
}
