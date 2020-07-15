const BASE_URL = "/wp-json/recipe-list/v1";
const OPTIONS = {
  method: "POST",
  credentials: "same-origin",
  headers: {
    "Content-Type": "application/json",
  },
};

export function replaceWithForm({
  element,
  callback,
  formLabel = null,
  btnText = "submit",
  replaceParent = false,
  changeInnerTextOfEl = null,
}) {
  const form = document.createElement("form");
  form.classList.add("generated-inline");
  const parent = element.parentElement;
  const changingEl = parent.querySelector(changeInnerTextOfEl);

  form.addEventListener("submit", (e) => {
    callback(e, parent);

    if (!replaceParent) {
      form.replaceWith(element);
    } else {
      form.replaceWith(parent);
    }
    if (changeInnerTextOfEl) {
      const newVal = form.querySelector(".small-inline-input").value;
      changingEl.innerText = newVal;
    }
  });
  form.innerHTML = `
    <input type="text" placeholder="${(changeInnerTextOfEl
      ? changingEl.innerHTML
      : "&nbsp;"
    ).trim()}" class="small-inline-input" /> 
    <button type="submit">${btnText}</button>
    `;
  if (replaceParent === false || !replaceParent) {
    element.replaceWith(form);
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
export function getInputValueByForm(form) {
  const inputs = [...form.querySelectorAll("input")];
  const values = inputs.reduce((valueObj, input, index) => {
    const { value, name } = input;
    if (name) {
      valueObj[name] = value;
    } else {
      valueObj[`index${index}`] = value;
    }
    return valueObj;
  }, {});

  return values;
}
