## better_history

[![NPM](https://nodei.co/npm/better-history.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/better-history/)

> 💡 Get a better sense of browsing history via Chrome/Firefox 💡

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

1. Start a local server, then visit http://localhost:4455.
```
better-history
```
2. Export statistics to csv documents, default export directory is your `$HOME`.
```
better-history export
```        
3. In case of customization, run `better-history [server | export] -h` to set specific options regarding different subcommand.

## License

[MIT](http://liujiacai.net/license/MIT.html?year=2016)
