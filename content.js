// hold the mouse possition
var gPos = {X:0, Y:0};

// Remove all the injected content
function removeContent() {
    d = document.getElementById("wvislovnikcz");
    if (d) {
        d.parentNode.removeChild(d);
        f = document.getElementById('wvislovnikczdiv');
        f.parentNode.removeChild(f);
    }
}

//read the mouse position
document.addEventListener("mouseup", function (mousePos) {
    gPos = {X: mousePos.pageX, Y: mousePos.pageY};
});


//remove content if clicked inside our wrapper div
document.addEventListener("click", function (mousePos) {
   removeContent();
});

//remove content if ESC key is pressed
document.addEventListener("keyup",  function(e) {
    if (e.keyCode==27) removeContent();
}, false);

function buildFromResponse(resp) {
    var doc = document.implementation.createHTMLDocument("slovnik");
    doc.open();
    doc.write(resp);
    doc.close();
    
    var el = document.createElement("div");
    var rs = doc.getElementsByClassName('r');
    for (var i = 0; i < rs.length; ++i) {
        if (rs[i].hasChildNodes()) {
            var d = document.createElement("div");
            d.setAttribute("style","color:#109010;font-size:10pt;margin-right:2px;");
            var a = rs[i].getElementsByTagName("a");
            for (var j = 0; j < a.length; ++j){
                d.innerText += " " + a[j].innerText;
            }
            for (var j = 0; j < rs[i].childNodes.length; ++j){
                var is = document.createElement("i");
                if (rs[i].childNodes[j].nodeType === Node.TEXT_NODE) {
                    is.innerText = rs[i].childNodes[j].nodeValue;
                }
                d.appendChild(is);
            }
            el.appendChild(d);
        } else {
            d = document.createElement("div");
            d.setAttribute("style","color:#109010;font-size:10pt;margin-right:2px;");
            d.innerText = rs[i].innerText;
            el.appendChild(d);
        }
    }
    return el;
}

//show the translation result comming from background.js
chrome.extension.onMessage.addListener(function(msg, sender, sendResponse) {
    if (msg.action == 't') {
        rsp = buildFromResponse(msg.response);
        document.body.style.height = "100%";
        wrapperDiv = document.createElement("div");
        wrapperDiv.setAttribute("id", "wvislovnikczdiv");
        wrapperDiv.setAttribute("style","position: absolute; left: 0px; top: 0px; opacity: 1; z-index: 2000; height: 100%; width: 100%;");
        iframeElement = document.createElement("iframe");
        iframeElement.setAttribute("style","width: 100%; height: 100%;");
        wrapperDiv.appendChild(iframeElement);

        modalDialogParentDiv = document.createElement("div");
        modalDialogParentDiv.setAttribute("id", "wvislovnikcz");
        modalDialogParentDiv.setAttribute("style","position: absolute; width: 300px; border: 1px solid rgb(51, 102, 153); padding: 10px; background-color: #f4f8ff; z-index: 2001; overflow: auto; text-align: center; top: "+ gPos.Y + "px; left: "+ gPos.X + "px;");

        modalDialogSiblingDiv = document.createElement("div");

        modalDialogTextDiv = document.createElement("div"); 
        modalDialogTextDiv.setAttribute("style" , "text-align:left");
        modalDialogTextSpan = document.createElement("span"); 
        modalDialogText = document.createElement("strong");
        modalDialogText.innerHTML = rsp.innerHTML;
        modalDialogTextSpan.appendChild(modalDialogText);
        modalDialogTextDiv.appendChild(modalDialogTextSpan);

        modalDialogSiblingDiv.appendChild(modalDialogTextDiv);
        modalDialogParentDiv.appendChild(modalDialogSiblingDiv);

        document.body.appendChild(wrapperDiv);
        document.body.appendChild(modalDialogParentDiv);
    }
});
