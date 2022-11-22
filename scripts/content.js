const newDiv = document.createElement("div");
newDiv.setAttribute("id", "todobud_container");
const bufferDiv = document.createElement("div");
bufferDiv.style.cssText += "height:3px;";
bufferDiv.style.cssText += "background-color:#1b8654;";
newDiv.appendChild(bufferDiv);
const innerDiv = document.createElement("div");
innerDiv.setAttribute("id", "todobud_current_todo");
innerDiv.style.cssText += "background-color:#1b8654;";
innerDiv.style.cssText += "position:fixed;";
innerDiv.style.cssText += "top:0;";
innerDiv.style.cssText += "left:0;";
innerDiv.style.cssText += "width:100%;";
innerDiv.style.cssText += "z-index:9999;";
innerDiv.style.cssText += "font-family:Helvetica Neue,sans-serif;";
innerDiv.style.cssText += "color:black;";
innerDiv.style.cssText += "cursor:n-resize;";
newDiv.appendChild(innerDiv);

TIMESHIDDEN = 0;

// div:#todobud_current_todo
//   span:
//   span:#todobud_current_todo_text
//   span:#todobud_input_container
//     input:#todobud_input
//     button:#save_button
//   button:#close_button

// let value = "What is your intent?";
// chrome.storage.sync.set({ current_todo: value }, function () {
//   if (chrome.runtime.lastError) {
//     console.log("Error setting");
//   }
//   console.log("Value is set to " + value);
// });

window.onload = function () {
  // wip: store data in local storage
  // new a form field in new tab

  const BODY = document.getElementsByTagName("body")[0];
  BODY.insertAdjacentElement("beforebegin", newDiv);
  addMarginToBody();
  getAndSetTodo();

  document
    .getElementById("todobud_container")
    .addEventListener("click", (e) => {
      if (e.target.id === "close_button") {
        getElementById("todobud_current_todo").style.display = "none";
        getElementById("todobud_container").style.display = "none";
        deleteMarginFromBody();
      } else if (e.target.id === "todobud_current_todo_text") {
        const todo_text = document.getElementById("todobud_current_todo_text");
        todo_text.style.display = "none";
        const todobud_input_container = document.getElementById(
          "todobud_input_container"
        );
        todobud_input_container.style.display = "block";
      } else if (
        e.target.id === "todobud_input_container" ||
        e.target.id === "todobud_input"
      ) {
        // do nothing
      } else if (e.target.id === "save_button") {
        saveInput();
      } else {
        todobud_tmp_hide();
      }
    });

  window.addEventListener("keyup", (event) => {
    if (event.target.id === "todobud_input" && event.key === "Enter") {
      saveInput(event);
    }
  });
};

function saveInput() {
  el = document.getElementById("todobud_input");
  chrome.storage.sync.set({ current_todo: el.value }, function () {
    if (chrome.runtime.lastError) {
      console.log("Error setting");
    }
    const todobud_input_container = document.getElementById(
      "todobud_input_container"
    );
    todobud_input_container.style.display = "none";
    const todo_text = document.getElementById("todobud_current_todo_text");
    todo_text.style.display = "block";
    getAndSetTodo();
  });
}

function todobud_tmp_hide() {
  const bar = document.getElementById("todobud_current_todo");
  bar.style.display = "none";
  deleteMarginFromBody();
  setTimeout(() => {
    addMarginToBody();
    bar.style.display = "block";
  }, 3000 + TIMESHIDDEN * 2000);
  TIMESHIDDEN += 1;
}

function getElementById(id) {
  return document.getElementById(id);
}

function addMarginToBody() {
  const BODY = document.getElementsByTagName("body")[0];
  BODY.style.marginTop = "40px";
}
function deleteMarginFromBody() {
  const BODY = document.getElementsByTagName("body")[0];
  BODY.style.marginTop = "0px";
}

function getAndSetTodo() {
  chrome.storage.sync.get(["current_todo"], function (result) {
    if (chrome.runtime.lastError) {
      console.log("Error setting");
    }
    let current_todo = result.current_todo;
    if (current_todo.length === 0) {
      current_todo = "What is your intent?";
    }
    const todobud_content = `
    <div>
      <div id="todobud_current_todo"
        style="display:flex;align-items:center;
          justify-content:space-between;height:40px;font-size:16pt;color:#e8eaed">
        <span style="margin-left:5px">Focus 🎯</span>
        <span id="todobud_current_todo_text" style="cursor:text">${current_todo}</span>
        <span id="todobud_input_container" style="display:none;">
          <input type="text" id="todobud_input" style="color:black;cursor:text" value="${current_todo}">
          <button id="save_button" style="margin-right:5px;font-size:14px;color:black;line-height:normal;
            background-color:#eee;border-style:outset;border-width:2px;height:22px;padding:0px 2px">
            save
          </button>
        </span>
        <button id="close_button" style="margin-right:5px;font-size:14px;color:black;line-height:normal;
          background-color:#eee;border-style:outset;border-width:2px;height:22px;padding:0px 2px">
          close
        </button>
      </div>
    </div>`;
    const template = todobud_content;
    const bar = document.getElementById("todobud_current_todo");
    bar.innerHTML = template;
  });
}
