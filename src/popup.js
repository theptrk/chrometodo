// main
populateSnoozeValue();

document
  .getElementById("todobud_options_form")
  .addEventListener("change", (event) => {
    shouldSnooze = Boolean(event.target.checked);
    handleSnoozeCheckChange(shouldSnooze);
  });

// In-page cache of the user's options
const options = {
  // snoozeFrom = Date
};

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

function populateSnoozeValue() {
  // Initialize the form with the user's option settings
  chrome.storage.sync.get("options", (data) => {
    const snoozeFrom = data.options.snoozeFrom;
    let shouldSnooze = data.options.snoozeFrom !== undefined;

    if (snoozeFrom === undefined) {
      document.getElementById("todobud_snooze_hint").innerHTML = "";
      return;
    }

    let snoozeTimeElapsed,
      timeLeftTxt = getSnoozeTimeElapsed(snoozeFrom);

    if (snoozeTimeElapsed) {
      shouldSnooze = false;
    } else {
      document.getElementById("todobud_snooze_hint").innerHTML = timeLeftTxt;
    }

    document.getElementById("todobud_snooze_input").checked = shouldSnooze;
  });
}

function handleSnoozeCheckChange(checked) {
  if (checked) {
    let now = new Date().getTime();
    options.snoozeFrom = now;
  } else {
    options.snoozeFrom = undefined;
  }
  chrome.storage.sync.set({ options });
  populateSnoozeValue();
}
