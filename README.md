## Chrome 浏览记录统计🔧

新的一年已经到临，相信很多人都有写年终总结，我也是——[《2015 年终总结》](http://liujiacai.net/blog/2016/01/08/review-2015/)。

其实这种总结类的文章最好用数字来说话，和程序员打交道最多的肯定是浏览器，所以如果能够统计、分析出前一年的浏览记录，应该是比较有意义的。所以我真对 Chrome 浏览器，写了这个小工具，便于大家分析自己的浏览记录。

## 功能

1. 按天统计 Chrome 浏览记录，导出到 csv 文件
2. 统计经常访问网址的访问次数，导出到 csv 文件
3. ...

更多功能，等着你来实现😊


## 使用

```
git clone https://github.com/jiacai2050/chrome-history-stat.git
npm install
```
然后需要修改`config.json`里面的配置（下面参数是我 Mac 上的配置，你需要根据自己的情况修改）：
```
{
    "chrome_history_file": "/Users/liujiacai/Library/Application Support/Google/Chrome/Default/History",
    "export_file" : {
        "countDailyUsage": "/Users/liujiacai/Desktop/countDailyUsage.csv",
        "countURLsFrequence": "/Users/liujiacai/Desktop/countURLsFrequence.csv"
    },
    "count_range": {
        "start": "2015/01/01",
        "end": "2016/01/01"
    }
}
```
其中的`chrome_history_file` 指明 Chrome 保存在本地的浏览文件，不同操作系统位置不一样，上面示例为我 Mac 上的位置，其他操作系统自行 Google 下即可。也欢迎大家告诉我，我会及时更新这里的说明。😊

最后，就可以运行`main.js`了：
```
./main.js day  # 按天统计 Chrome 浏览记录，导出到 csv 文件
./main.js mfv  # 统计不同网址的访问次数，导出到 csv 文件
./main help    # 查看使用说明
```

导出到 csv 文件后，就可以使用各种表格工具（如：Numbers、Excel）进行可视化了。在这个 DT 时代，别告诉我你不会用这些工具。

当然，也欢迎前端小伙伴给我支持下，做个界面，那我真是感激不尽了。🍻

## License

[MIT](http://liujiacai.net/license/MIT.html?year=2016)