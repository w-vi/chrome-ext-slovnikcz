// Log creation status
function onCreated() {
  if (chrome.runtime.lastError) {
    console.log(`Error: ${chrome.runtime.lastError}`);
  } else {
    console.log("Menu item slovnikcz-selection created.");
  }
}

// Log all errors
function onError(error) {
  console.log(`Error: ${error}`);
}

// Create the context menu item.
chrome.contextMenus.create({
  id: "slovnikcz-selection",
  title: chrome.i18n.getMessage("title"),
  contexts: ["selection"]
}, onCreated);


// Add click event
chrome.contextMenus.onClicked.addListener((info, tab) => {
    sText = info.selectionText;
    slovnikURL = "http://www.slovnik.cz/bin/mld.fpl?vcb=" + encodeURIComponent(sText) + "&dictdir=encz.en&lines=10&js=0";
    xhr = new XMLHttpRequest();
    xhr.open("GET", slovnikURL, true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
            chrome.tabs.sendMessage(tab.id,
                                    {action: "t",
                                     response: xhr.responseText},
                                    function(response) {});
        }
    };
    chrome.tabs.sendMessage(tab.id, {action: "p"}, function(response) {});
    xhr.send();
});
