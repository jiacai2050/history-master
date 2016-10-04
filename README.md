## better-history   [![NPM](https://img.shields.io/npm/v/better-history.svg)](https://www.npmjs.com/package/better-history) [![Chrome Web Store](https://img.shields.io/chrome-web-store/v/mkfgjjeggnmkbobjmelbjhdchcoadnin.svg)](https://chrome.google.com/webstore/detail/advanced-history/mkfgjjeggnmkbobjmelbjhdchcoadnin) [![Stars](https://img.shields.io/github/stars/jiacai2050/better-history.svg)](https://github.com/jiacai2050/better-history/stargazers)

> 💡 Get a better sense of browsing history via Chrome/Firefox 💡

Nowadays everyone surfs the Internet a lot, but I don't think everyone have a clear sense of their browsing habits.

`better-history` comes to the rescue. Chrome and Firefox are supported. Hope you enjoy. 💗

- [Chrome Web Store](https://chrome.google.com/webstore/detail/advanced-history/mkfgjjeggnmkbobjmelbjhdchcoadnin)
- [Mozilla Add-ons](https://addons.mozilla.org/firefox/addon/advanced-history/)

> NOTE: There is already a [better history](https://chrome.google.com/webstore/detail/better-history/obciceimmggglbmelaidpjlmodcebijb) in Chrome webstore, so I have named mine as `Advaned history` in both Mozilla add-ons and Chrome webstore.

## Feature

- Daily Page View Trending

![](https://raw.githubusercontent.com/jiacai2050/better-history/master/screenshots/line_chart.png)

- Percentage of TOP 10 frequently visited site

![](https://raw.githubusercontent.com/jiacai2050/better-history/master/screenshots/pie_chart.png)

- Frequently visited site in tunnel chart

![](https://raw.githubusercontent.com/jiacai2050/better-history/master/screenshots/tunnel_chart.png)

- customize browsing range

![](https://raw.githubusercontent.com/jiacai2050/better-history/master/screenshots/daterange.png)


## Usage for NPM users

First of all,

```        
npm install better-history -g
```

Then, you have two choices, either start a local server (preferred) to view or export statistics to csv documents.

- Start a local server, then visit http://localhost:4455.
```
better-history
```

- Export statistics to csv documents, default export directory is your `$HOME`.
```
better-history export
```

- In case of customization, run `better-history [server | export] -h` to set specific options regarding different subcommand.


## Development

- [master](https://github.com/jiacai2050/better-history/tree/master) branch used for Node.js
- [extensions](https://github.com/jiacai2050/better-history/tree/extensions) branch used for Firefox/Chrome extensions, thanks to [WebExtensions](https://developer.mozilla.org/Add-ons/WebExtensions) -- Write once, Run All browsers.

## License

[MIT](http://liujiacai.net/license/MIT.html?year=2016)
