console.log("pop");

// In-page cache of the user's options
const options = {};

// Initialize the form with the user's option settings
// chrome.storage.sync.get("options", (data) => {
//   console.log(`data`);
//   console.log(data);
//   console.log(`data.options`);
//   console.log(data.options);
//   Object.assign(options, data.options);
//   optionsForm.debug.checked = Boolean(options.debug);
// });

// // Immediately persist options changes
// optionsForm.debug.addEventListener("change", (event) => {
//   console.log(`optionsForm.debug.change`);
//   options.debug = event.target.checked;
//   chrome.storage.sync.set({ options });
// });
