chrome.browserAction.onClicked.addListener((tab) => {
      chrome.tabs.create({
          url: "assets/index.html"
      });
});
