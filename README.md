## Chrome 浏览记录统计🔧

新的一年已经到临，相信很多人都有写年终总结，我也是——[《2015 年终总结》](http://liujiacai.net/blog/2016/01/08/review-2015/)。

其实这种总结类的文章最好用数字来说话，和程序员打交道最多的肯定是浏览器，所以如果能够统计、分析出前一年的浏览记录，应该是比较有意义的。所以我针对 Chrome 浏览器，写了这个小工具，便于大家分析自己的浏览记录。

## 功能

1. 使用 [ECharts](https://github.com/ecomfe/echarts) + [Express](http://expressjs.com/) 提供基于 canvas 的图表展示
2. 统计高频网址的访问次数，导出到 csv 文件
3. 按天统计历史浏览记录，导出到 csv 文件
4. ...

更多功能，等着你来实现😊


## 使用

### 0. 安装 [Node.js](https://nodejs.org/)

由于本库使用了 ES6 中的 [template strings](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/template_strings) 语法，所以需要安装`v4.0.0`以及之上的版本。

### 1. 下载本库，并安装依赖
```
git clone https://github.com/jiacai2050/chrome-history-stat.git && cd chrome-history-stat
npm install
```
### 2. 修改配置文件`config.json`
`config.json`默认为我在自己的 Mac 上使用的配置，你需要根据自己的情况进行修改：
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
- `chrome_history_file`：Chrome 保存在本地的历史浏览文件
- `count_range`：统计的时间范围

在 Chrome 打开的情况下，如果直接从默认位置读取`History`文件，会报下面的错误：
```
{ [Error: SQLITE_BUSY: database is locked] errno: 5, code: 'SQLITE_BUSY' }
```
所以我这里把`History`文件拷贝到了桌面上。为了避免上面的错误，大家最好也把`History`文件从默认位置拷贝到桌面上再使用。

各大操作系统`History`文件位置大致如下（参考[这里](http://www.forensicswiki.org/wiki/Google_Chrome)）：

- Linux

    `/home/$USER/.config/google-chrome/Default/History`

- MacOS

    `/Users/$USER/Library/Application Support/Google/Chrome/Default/History`

- Windows XP

    `C:\Documents and Settings\%USERNAME%\Local Settings\Application Data\Google\Chrome\User Data\Default\History`
    
- Windows Vista 以及之后的版本

    `C:\Users\%USERNAME%\AppData\Local\Google\Chrome\User Data\Default\History`


### 3. 启动服务

修改完`config.json`后，就可以运行我们的服务了：
```
$ node app

# 看到下面的输出，说明服务已经启动了
add router: /chrome
Listening on port 5210 ...
```
服务成功启动后，就可以打开浏览器访问了：`http://localhost:5210`

![chrome_history_trend](screenshots/trend.png)
![chrome_history_percent](screenshots/percent.png)
![chrome_history_table](screenshots/table.png)

### 3.1 启动服务时出现的一些问题及解决方法

### 3.1.1 以下是将node从0.12版升级到最新版后，启动时遇到的一些问题和解决方法

如1，在确保将node升级到4.0.0版本以上，并安装所需依赖后，启动时若遇到以下提示错误信息：

`Cannot find module '/chrome-history-stat/node_modules/sqlite3/lib/binding/node-v47-darwin-x64/node_sqlite3.node'`

定位到问题：在将`node`从`0.12`通过

`npm install -g n`

`n stable`

升级到node.js最新稳定版时，经检查`npm`和`node-gyp`的版本并没有升级，于是执行

`sudo npm install npm -g`

npm版本从`2.14.2`升级到`3.5.3`

`sudo npm install node-gyp -g`

node-gyp版本从`0.6.14`升级到`3.2.1`

重新启动服务成功

### 4. 数据导出
当然，除了在线浏览，还可以把数据导出为 CSV 文件。直接在命令行执行下面的命令：
```
./lib/export.js help    # 查看使用说明
./lib/export.js day     # 按天统计 Chrome 浏览记录，导出到 csv 文件
./lib/export.js mfv     # 统计不同网址的访问次数，导出到 csv 文件
```

导出到 CSV 文件后，就可以使用各种表格工具（如：Numbers、Excel）进行可视化了。在这个 DT 时代，别告诉我你不会用这些工具。

## TODO

- [ ] 提供`搜索关键字`相关信息的展示，信息来源：`History` 文件中的 `keyword_search_terms` 表
- [ ] 提供更丰富的图表展示📈
- [ ] 提供对 Firefox 的分析

## License
[MIT](http://liujiacai.net/license/MIT.html?year=2016)

Echarts 版权归[百度](https://github.com/ecomfe/echarts/blob/master/LICENSE.txt)所有