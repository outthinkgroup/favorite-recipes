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
  const changingEl =
    changeInnerTextOfEl && parent.querySelector(changeInnerTextOfEl);

  form.addEventListener("submit", handleSubmit);

  form.innerHTML = `
    <input type="text" class="small-inline-input" value="${(changeInnerTextOfEl
      ? changingEl.innerHTML
      : "&nbsp;"
    ).trim()}"/> 
    <button type="submit">${btnText}</button>
    `;
  if (replaceParent === false || !replaceParent) {
    element.replaceWith(form);
  } else {
    parent.replaceWith(form);
  }
  form.elements[0].focus();
  clickOutside(form.parentElement, formReset);

  function handleSubmit(e) {
    callback(e, parent);
    formReset();
    if (changeInnerTextOfEl) {
      const newVal = form.querySelector(".small-inline-input").value;
      changingEl.innerText = newVal;
    }
  }

  function formReset() {
    if (!replaceParent) {
      form.replaceWith(element);
    } else {
      form.replaceWith(parent);
    }
    form.removeEventListener("submit", handleSubmit);
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

export function toggleOnOff(
  actionElement,
  parentElementSelector,
  action = "click"
) {
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
    if (
      document.contains(e.target) &&
      !actionElement.closest(parentElementSelector).contains(e.target)
    ) {
      delete actionElement.closest(parentElementSelector).dataset.state;
    }
  }
}

export function getUserId() {
  return WP.userId;
}

function clickOutside(element, callback) {
  document.body.addEventListener("click", runCallBack);
  function runCallBack(e) {
    if (!element) return;

    if (
      document.contains(e.target) &&
      !element.contains(e.target) &&
      element !== e.target
    ) {
      callback();
    }
  }
}

export function updateAllLists(newListItem, parenList) {
  [...document.querySelectorAll(".add-recipe-to-list")].forEach((parentEl) => {
    const clone = newListItem.cloneNode(true);
    const list = parentEl.querySelector("ul");
    if (parenList === list) return;
    list.prepend(clone);
  });
}
