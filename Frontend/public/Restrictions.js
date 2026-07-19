document.onkeydown = function (e) {
    if (event.keyCode == 123) {
        return false;
    }
    if (e.ctrlKey && e.shiftKey && e.keyCode == 'I'.charCodeAt(0)) {
        return false;
    }
    if (e.ctrlKey && e.shiftKey && e.keyCode == 'J'.charCodeAt(0)) {
        return false;
    }
    if (e.ctrlKey && e.shiftKey && e.keyCode == 'C'.charCodeAt(0)) {
        return false;
    }
    if (e.ctrlKey && e.keyCode == 'U'.charCodeAt(0)) {
        return false;
    }
}
var countTabChange = 0;
document.addEventListener("visibilitychange", (event) => {
    if (document.visibilityState == "visible") {
      document.title = "DEPSTAR Quiz Portal ("+countTabChange+")"
    } else {
        // alert("Don't Open Any Tab")
        countTabChange++;
        document.title = "DEPSTAR Quiz Portal ("+countTabChange+")"
    }
  });
function killCopy(e) {
    return false
}
function reEnable() {
    return true
}
document.onselectstart = new Function("return false")
if (window.sidebar) {
    document.onmousedown = killCopy
    document.onclick = reEnable
}
