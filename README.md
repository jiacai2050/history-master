## Chrome 浏览记录统计🔧

新的一年已经到临，相信很多人都有写年终总结，我也是——[《2015 年终总结》](http://liujiacai.net/blog/2016/01/08/review-2015/)。

其实这种总结类的文章最好用数字来说话，和程序员打交道最多的肯定是浏览器，所以如果能够统计、分析出前一年的浏览记录，应该是比较有意义的。所以我针对 Chrome 浏览器，写了这个小工具，便于大家分析自己的浏览记录。

## 功能

1. 使用[ECharts](https://github.com/ecomfe/echarts) +[Express](http://expressjs.com/) 提供基于 canvas 的图表展示
2. 统计经常访问网址的访问次数，导出到 csv 文件
3. 按天统计 Chrome 浏览记录，导出到 csv 文件
4. ...

更多功能，等着你来实现😊


## 使用

```
git clone https://github.com/jiacai2050/chrome-history-stat.git
npm install
```
然后需要修改`config.json`里面的配置（下面参数是我 Mac 上的配置，你需要根据自己的情况修改）：
```
{
    "port": 5210,
    "chrome_history_file": "/Users/liujiacai/Desktop/History",
    "export_file" : {
        "countDailyVisits": "/Users/liujiacai/Desktop/countDailyVisits.csv",
        "countURLsFrequence": "/Users/liujiacai/Desktop/countURLsFrequence.csv"
    },
    "count_range": {
        "start": "2015/01/01",
        "end": "2016/01/01"
    }
}
```
其中的`chrome_history_file` 指明 Chrome 保存在本地的历史浏览文件，不同操作系统位置不一样，上面示例为我 Mac 上的位置，在 Chrome 打开的情况下如果直接从默认位置`/Users/liujiacai/Library/Application Support/Google/Chrome/Default/History`读取，会报下面的错误：
```
{ [Error: SQLITE_BUSY: database is locked] errno: 5, code: 'SQLITE_BUSY' }
```
所以我这里把`History`文件拷贝到了桌面上。

其他操作系统`History`文件的位置可以自行 Google 。也欢迎大家告诉我，我会及时更新这里的说明。

最后，就可以运行我们的服务了：
```
$ node app

# 看到下面的输出，说明服务已经启动了
add router: /chrome
Listening on port 5210 ...
```
然后，你就可以打开浏览器访问了`http://localhost:5210`
![chrome_history_trend](screenshots/trend.png)
![chrome_history_percent](screenshots/percent.png)
![chrome_history_table](screenshots/table.png)

当然，除了在线浏览，你还可以把数据导出为 CSV 文件。直接在命令行执行下面的命令：
```
./lib/export.js help    # 查看使用说明
./lib/export.js day     # 按天统计 Chrome 浏览记录，导出到 csv 文件
./lib/export.js mfv     # 统计不同网址的访问次数，导出到 csv 文件
```

导出到 CSV 文件后，就可以使用各种表格工具（如：Numbers、Excel）进行可视化了。在这个 DT 时代，别告诉我你不会用这些工具。

## TODO
- [ ] 提供更丰富的图表📈
- [ ] 提供对 Firefox 的分析

## License
[MIT](http://liujiacai.net/license/MIT.html?year=2016)

Echarts 版权归[百度](https://github.com/ecomfe/echarts/blob/master/LICENSE.txt)所有。