chrome.browserAction.onClicked.addListener((tab) => {
      chrome.tabs.create({
          url: "option/index.html"
      });
});
