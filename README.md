## Chrome/Firefox 浏览记录统计🔧

新的一年已经到临，相信很多人都有写年终总结，我也是——[《2015 年终总结》](http://liujiacai.net/blog/2016/01/08/review-2015/)。

其实这种总结类的文章最好用数字来说话，和程序员打交道最多的肯定是浏览器，所以如果能够统计、分析出前一年的浏览记录，应该是比较有意义的。所以我针对 Chrome/Firefox 浏览器，写了这个小工具，便于大家分析自己的浏览记录。

## 功能

1. 使用 [ECharts](https://github.com/ecomfe/echarts) + [Express](http://expressjs.com/) 提供基于 canvas 的图表展示
![chrome_history_trend](screenshots/trend.png)
![chrome_history_percent](screenshots/percent.png)
2. 导出统计数据到 csv 文件
3. ...

更多功能，等着你来实现 😊


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
    "firefox_history_file": "/Users/liujiacai/Desktop/places.sqlite",
    "export_dir" : "/Users/liujiacai/Desktop/",
    "count_range": {
        "start": "2015/01/01",
        "end": "2016/01/01"
    }
}
```

- `chrome_history_file`：Chrome 保存在本地的历史浏览文件
- `firefox_history_file`：Firefox 保存在本地的历史浏览文件
- `count_range`：统计的时间范围

#### Chrome 历史浏览文件 

Chrome 历史浏览文件保存在`History`文件中，该文件在各大操作系统位置大致如下（参考[这里](http://www.forensicswiki.org/wiki/Google_Chrome)）：

- Linux

    `/home/$USER/.config/google-chrome/Default/History`

- Mac

    `/Users/$USER/Library/Application Support/Google/Chrome/Default/History`

- Windows XP

    `C:\Documents and Settings\%USERNAME%\Local Settings\Application Data\Google\Chrome\User Data\Default\History`
    
- Windows Vista 以及之后的版本

    `C:\Users\%USERNAME%\AppData\Local\Google\Chrome\User Data\Default\History`

在 Chrome 打开的情况下，如果直接从默认位置读取`History`文件，会报下面的错误：
```
{ [Error: SQLITE_BUSY: database is locked] errno: 5, code: 'SQLITE_BUSY' }
```
所以我这里把`History`文件拷贝到了桌面上。为了避免上面的错误，大家最好也把`History`文件从默认位置拷贝到桌面上再使用。


#### Firefox 历史浏览文件

Firefox 历史浏览文件保存在`places.sqlite`文件中，该文件在各大操作系统位置大致如下（参考[这里](http://kb.mozillazine.org/Profile_folder_-_Firefox)）：

- Linux

    `/home/$USER/.mozilla/firefox/<profile folder>/places.sqlite`

- Mac

    `/Users/$USER/Library/Application Support/Firefox/Profiles/<profile folder>/places.sqlite`

- Windows XP

    `C:\Documents and Settings\%USERNAME%\Application Data\Mozilla\Firefox\Profiles\<profile folder>\places.sqlite`

- Windows Vista 以及之后的版本

    `C:\Users\%USERNAME%\AppData\Roaming\Mozilla\Firefox\Profiles\<profile folder>\places.sqlite`

为了避免与 Chrome 类似的错误，我这里也把`places.sqlite`文件拷贝到了桌面上。

### 3. 启动服务

修改完`config.json`后，就可以运行我们的服务了：
```
$ node app

# 看到下面的输出，说明服务已经启动了
add router: /chrome
add router: /firefox
Listening on port 5210 ...
```
服务成功启动后，就可以打开浏览器访问了：

- `http://localhost:5210/chrome`
- `http://localhost:5210/firefox`

### 4. 数据导出
当然，除了在线浏览，还可以把数据导出为 CSV 文件。直接在命令行执行下面的命令：
```
./lib/export.js help    # 查看使用说明
./lib/export.js chrome  # 导出 Chrome 浏览记录到 csv 文件
./lib/export.js firefox # 导出 Firefox 浏览记录到 csv 文件
```

导出到 CSV 文件后，就可以使用各种表格工具（如：Numbers、Excel）进行可视化了。在这个 DT 时代，别告诉我你不会用这些工具。

## TODO

- [x] 提供对 Firefox 的分析。（2016-01-16 完成）
- [x] 提供`搜索关键字`相关信息的展示。个人觉得没什么价值，所以不做了。
- [ ] 提供更丰富的图表展示📈


## License
[MIT](http://liujiacai.net/license/MIT.html?year=2016)

Echarts 版权归[百度](https://github.com/ecomfe/echarts/blob/master/LICENSE.txt)所有