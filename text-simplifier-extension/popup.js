chrome.storage.local.get("simplifiedText", (data) => {
  const output = document.getElementById("output");
  output.textContent = data.simplifiedText || "No text simplified.";
});
