// hold the mouse possition
var gPos = {X:0, Y:0};

// Remove all the injected content
function removeContent() {
    d = document.getElementById("wvislovnikcz");
    if (d) {
        d.parentNode.removeChild(d);
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

//build the modal window content from the slovnik.cz response
function buildFromResponse(resp) {
    var doc = document.implementation.createHTMLDocument("slovnik");
    doc.open();
    doc.write(resp);
    doc.close();
    
    var el = document.createElement("div");
    var ps = doc.getElementsByClassName('pair');
    for (var i = 0; i < ps.length; ++i) {
        
        rs = ps[i].getElementsByClassName("r");
        ls = ps[i].getElementsByClassName("l");
        for (var k = 0; k < rs.length; ++k) {
            if (rs[k].hasChildNodes()) {
                var d = document.createElement("div");
                d.setAttribute("style","color:#109010;font-size:10pt;margin-right:2px;");
                d.innerText = ls[k].innerText + " -";
                var a = rs[k].getElementsByTagName("a");
                for (var j = 0; j < a.length; ++j){
                    d.innerText += " " + a[j].innerText;
                }
                for (var j = 0; j < rs[k].childNodes.length; ++j){
                    var is = document.createElement("i");
                    if (rs[k].childNodes[j].nodeType === Node.TEXT_NODE) {
                        is.innerText = rs[k].childNodes[j].nodeValue;
                    }
                    d.appendChild(is);
                }
                el.appendChild(d);
            } else {
                d = document.createElement("div");
                d.setAttribute("style","color:#109010;font-size:10pt;margin-right:2px;");
                d.innerText = rs[k].innerText;
                el.appendChild(d);
            }
        }
    }

    return el;
}

//show the translation result comming from background.js
chrome.extension.onMessage.addListener(function(msg, sender, sendResponse) {
    if (msg.action == 'p'){
        dlgParentDiv = document.createElement("div");
        dlgParentDiv.setAttribute("id", "wvislovnikcz");
        dlgParentDiv.setAttribute("style","position:absolute; width: 300px; border: 1px solid rgb(51, 102, 153); padding: 10px; background-color: #f4f8ff; z-index: 2001; overflow: auto; text-align: center; font-size: 10pt; top: "+ gPos.Y + "px; left: "+ gPos.X + "px;");
        
        dlgSiblingDiv = document.createElement("div");
        dlgTextDiv = document.createElement("div"); 
        dlgTextDiv.setAttribute("style" , "text-align:left");
        dlgTextDiv.setAttribute("id" , "wvislovnikczcontent");
        
        dlgTextSpan = document.createElement("span"); 
        dlgText = document.createElement("strong");
        dlgText.innerText = chrome.i18n.getMessage('waitText');
        dlgTextSpan.appendChild(dlgText);
        
        dlgTextDiv.appendChild(dlgTextSpan);
        dlgSiblingDiv.appendChild(dlgTextDiv);
        dlgParentDiv.appendChild(dlgSiblingDiv);
        document.body.appendChild(dlgParentDiv);
    }
    
    if (msg.action == 't') {
        rsp = buildFromResponse(msg.response, msg.word);
        text = document.getElementById("wvislovnikczcontent");
        text.innerHTML = rsp.innerHTML;
    }
});
