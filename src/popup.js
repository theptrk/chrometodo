function isSnoozeTimeElapsed(snoozeTo) {
  let nowTime = new Date().getTime();
  let snoozeToTime = new Date(snoozeTo).getTime();
  return nowTime >= snoozeToTime;
}

function getReadableTimeLeft(snoozeTo) {
  let nowTime = new Date().getTime();
  let snoozeToTime = new Date(snoozeTo).getTime();
  let timeLeftMs = snoozeToTime - nowTime;

  if (timeLeftMs <= 0) {
    return undefined;
  }

  let hoursLeft = Math.floor(timeLeftMs / (1000 * 60 * 60));
  let remaining = timeLeftMs - hoursLeft * 1000 * 60 * 60;
  let minutesLeft = Math.floor(remaining / (1000 * 60));

  return `Remaining snooze: ${hoursLeft}h ${minutesLeft}m.`;
}

// Helper functions using native promises
function getOptions() {
  return chrome.storage.sync.get("options").then((data) => data.options || {});
}

function setOptions(options) {
  return chrome.storage.sync.set({ options });
}

async function populateSnoozeValue() {
  try {
    const options = await getOptions();
    const snoozeTo = options.snoozeTo;
    let isSnoozeActive = snoozeTo !== undefined;

    if (snoozeTo === undefined) {
      document.getElementById("todobud_snooze_hint").innerHTML = "";
      document.getElementById("todobud_snooze_input").checked = false;
      return;
    }

    if (isSnoozeTimeElapsed(snoozeTo)) {
      isSnoozeActive = false;
      document.getElementById("todobud_snooze_hint").innerHTML = "";
    } else {
      const timeLeftTxt = getReadableTimeLeft(snoozeTo);
      document.getElementById("todobud_snooze_hint").innerHTML = timeLeftTxt;
    }

    document.getElementById("todobud_snooze_input").checked = isSnoozeActive;
  } catch (error) {
    console.error("Error populating snooze value:", error);
  }
}

function getSnoozeToTime8Hours() {
  let now = new Date();
  let snoozeTo = new Date(now.getTime() + 8 * 60 * 60 * 1000);
  return snoozeTo.getTime();
}

async function handleSnoozeCheckChange(checked) {
  try {
    const options = await getOptions();
    if (checked) {
      options.snoozeTo = getSnoozeToTime8Hours();
    } else {
      options.snoozeTo = undefined;
    }
    await setOptions(options);
    await populateSnoozeValue();
  } catch (error) {
    console.error("Error handling snooze check change:", error);
  }
}

// Main function
async function main() {
  await populateSnoozeValue();

  document
    .getElementById("todobud_options_form")
    .addEventListener("change", async (event) => {
      const shouldSnooze = Boolean(event.target.checked);
      await handleSnoozeCheckChange(shouldSnooze);
    });
}

main().catch((error) => console.error("Error in main:", error));
