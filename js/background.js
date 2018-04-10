chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  if (changeInfo.status === 'complete') {
    console.log('complete')
    // check to see if the extension is turned on before running the rest of it
    chrome.storage.local.get('isActive', function (val) {
      console.log('results', val)
      if (val.isActive) {
        chrome.tabs.executeScript(null, { file: "js/jquery.min.js" }, function () {
          chrome.tabs.executeScript(null, { file: "js/nick-replace.js" });
        });
      }
    });
  }
});