const BASE_URL = "/wp-json/recipe-list/v1";
const OPTIONS = {
  method: "POST",
  credentials: "same-origin",
  headers: {
    "Content-Type": "application/json",
  },
};

export function replaceWithForm(
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

export function useApi(endpoint, data) {
  const body = JSON.stringify(data);
  return fetch(`${BASE_URL}/${endpoint}`, {
    ...OPTIONS,
    body,
  }).then((res) => res.json());
}
export function getInputValue(selector) {
  const el = document.querySelector(selector);
  const value = el.value;
  return value;
}
