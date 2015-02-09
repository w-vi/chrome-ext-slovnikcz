// Set up context menu at install time.
chrome.runtime.onInstalled.addListener(function() {
    context = "selection";
    title = chrome.i18n.getMessage("title");
    id = chrome.contextMenus.create({"title": title, "contexts":[context],
                                         "id": "context" + context});
});

// add click event
chrome.contextMenus.onClicked.addListener(onClickHandler);

// The onClicked callback function.
function onClickHandler(info, tab) {
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
};
