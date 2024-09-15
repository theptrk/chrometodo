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

// div:#todobud_current_todo
//   span:
//   span:#todobud_current_todo_text
//   span:#todobud_input_container
//     input:#todobud_input
//     button:#save_button
//   button:#close_button

// TODO: refactor: this is copied
function getSnoozeTimeElapsed(snoozeFrom) {
  let nowTime = new Date().getTime();
  let snoozeFromTime = new Date(snoozeFrom);
  let timeSinceSnoozeMs = nowTime - snoozeFromTime;
  let snoozeTimeMs = 8 * 1000 * 60 * 60;

  let snoozeTimeElapsed = timeSinceSnoozeMs >= snoozeTimeMs;
  if (snoozeTimeElapsed) {
    return true, undefined;
  }

  let timeLeftMs = snoozeTimeMs - timeSinceSnoozeMs;
  let hoursLeft = Math.floor(timeLeftMs / (1000 * 60 * 60));
  let remaining = timeLeftMs - hoursLeft * 1000 * 60 * 60;
  let minutesLeft = Math.floor(remaining / (1000 * 60));

  let timeLeftTxt = `Snoozed for ${hoursLeft}h and ${minutesLeft}m.`;

  return false, timeLeftTxt;
}

window.onload = function () {
  chrome.storage.sync.get("options", (data) => {
    if (chrome.runtime.lastError) {
      console.log("Error setting");
    }
    const snoozeFrom = data.options?.snoozeFrom;
    let shouldSnooze = snoozeFrom !== undefined;

    if (snoozeFrom === undefined) {
      init();
      return;
    }

    let snoozeTimeElapsed,
      _ = getSnoozeTimeElapsed(snoozeFrom);

    if (!snoozeTimeElapsed) {
      shouldSnooze = false;
      return;
    }
    init();
  });
};

function init() {
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
        todobud_input_container.style.display = "flex";
        // todobud_input_container.style.display = "block";
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
}

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
  }, 8000);
}

function getElementById(id) {
  return document.getElementById(id);
}

function addMarginToBody() {
  const BODY = document.getElementsByTagName("body")[0];
  BODY.style.marginTop = "39px";
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
    let current_todo = result.current_todo ?? "";
    if (current_todo.length === 0) {
      current_todo = "What is your intent?";
    }
    const todobud_content = /*html*/ ` <div>
      <style>
        #todobud_input_container {
          display: none;
        }
        #todobud_current_todo_text {
          cursor: text;
        }
        #todobud_input_container input {
          background-color: white;
          color: black;
          cursor: text;
          margin-bottom: 0px;
        }
        #todobud_current_todo_container {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 40px;
          font-size: 16pt;
          color: #e8eaed;
        }
        #todobud_input_container #save_button {
          margin-right: 5px;
          font-size: 14px;
          color: black;
          line-height: normal;
          background-color: #eee;
          border-style: outset;
          border-width: 2px;
          height: 22px;
          padding: 0px 2px;
        }
        #todobud_current_todo_container #close_button {
          appearance: none;
          background-color: #e7e7e7;
          border: 1px solid rgba(27, 31, 35, 0.15);
          border-radius: 6px;
          box-shadow: rgba(27, 31, 35, 0.04) 0 1px 0,
            rgba(255, 255, 255, 0.25) 0 1px 0 inset;
          box-sizing: border-box;
          color: #24292e;
          cursor: pointer;
          display: inline-block;
          font-family: -apple-system, system-ui, "Segoe UI", Helvetica, Arial,
            sans-serif, "Apple Color Emoji", "Segoe UI Emoji";
          font-size: 10px;
          line-height: 8px;
          list-style: none;
          padding: 4px 3px;
          position: relative;
          transition: background-color 0.2s cubic-bezier(0.3, 0, 0.5, 1);
          user-select: none;
          -webkit-user-select: none;
          touch-action: manipulation;
          vertical-align: middle;
          white-space: nowrap;
          word-wrap: break-word;
          margin-right: 5px !important;
        }
      </style>
      <div id="todobud_current_todo_container">
        <span style="margin-left:5px">Focus 🎯</span>
        <span id="todobud_current_todo_text">${current_todo}</span>
        <span id="todobud_input_container">
          <input type="text" id="todobud_input" value="${current_todo}" />
          <button id="save_button">save</button>
        </span>
        <button id="close_button">close</button>
      </div>
    </div>`;
    const template = todobud_content;
    const bar = document.getElementById("todobud_current_todo");
    bar.innerHTML = template;
  });
}
