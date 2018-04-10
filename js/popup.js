function updateStatus() {
    var storage = chrome.storage.local;
    var checkbox = document.querySelector('.toggle');
    storage.get('isActive', function (val) {
        if (val.isActive) {
            checkbox.checked = false;
            // chrome.browserAction.setIcon({
            //     path: {
            //         "16": "img/16-icon-off.png",
            //         "32": "img/32-icon-off.png",
            //         "48": "img/48-icon-off.png",
            //         "128": "img/128-icon-off.png"
            //     } 
            // });
            chrome.browserAction.setIcon({
                path: "img/nick-off.png"
            });
            storage.set({ 'isActive': false });
        } else {
            // chrome.browserAction.setIcon({
            //     path: {
            //         "16": "img/16-icon.png",
            //         "32": "img/32-icon.png",
            //         "48": "img/48-icon.png",
            //         "128": "img/128-icon.png"
            //     }
            // });
            chrome.browserAction.setIcon({
                path: "img/nick-on.png"
            });
            checkbox.checked = true;
            storage.set({ 'isActive': true });
        }
    });
}

function onLoad() {
    var checkbox = document.querySelector('.toggle');
    var bodyEl = document.querySelector('body');
    chrome.storage.local.get('isActive', function (val) {
        if (val.isActive) {
            checkbox.checked = true;
        } else {
            checkbox.checked = false;
        }
    });
    setTimeout(() => {
        bodyEl.classList.remove('preload');
    }, 50);
}

onLoad();
document.querySelector('.toggle').addEventListener('change', updateStatus)