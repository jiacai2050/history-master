## better-history   [![Version](https://img.shields.io/npm/v/better-history.svg)](https://www.npmjs.com/package/better-history) [![Download](https://img.shields.io/npm/dm/better-history.svg)](https://www.npmjs.com/package/better-history) [![Forks](https://img.shields.io/github/forks/jiacai2050/better-history.svg)](https://github.com/jiacai2050/better-history) [![Stars](https://img.shields.io/github/stars/jiacai2050/better-history.svg)](https://github.com/jiacai2050/better-history) [![License](https://img.shields.io/npm/l/better-history.svg)](https://www.npmjs.com/package/better-history) 

[![NPM](https://nodei.co/npm/better-history.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/better-history/)

> 💡 Get a better sense of browsing history via Chrome/Firefox 💡

Nowadays everyone surfs the Internet a lot, but I don't think everyone have a clear sense of their browsing habits.

`better-history` comes to the rescue. Chrome and Firefox are supported. Hope you enjoy. 💗

## Feature

- Daily Page View Trending

![](https://raw.githubusercontent.com/jiacai2050/better-history/master/screenshots/line_chart.png)

- Percentage of TOP 10 frequently visited site

![](https://raw.githubusercontent.com/jiacai2050/better-history/master/screenshots/pie_chart.png)

- Frequently visited site in tunnel chart

![](https://raw.githubusercontent.com/jiacai2050/better-history/master/screenshots/tunnel_chart.png)

- customize browsing range

![](https://raw.githubusercontent.com/jiacai2050/better-history/master/screenshots/daterange.png)


## Usage

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

## License

[MIT](http://liujiacai.net/license/MIT.html?year=2016)
