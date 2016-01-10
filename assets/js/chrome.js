function initCharts(ec) {
    initDailyVisits(ec);
    initURLsPercent(ec);
}
function initDailyVisits(ec) {
    //--- 折柱 ---
    var dailyVisitsChart = ec.init(document.getElementById('dailyVisits'));
    dailyVisitsChart.setOption({
        title : {
            text : '2015 年 Chrome 历史浏览量',
            subtext : '^_^'
        },
        tooltip : {
            trigger: 'item',
            formatter : function (params) {
                var date = new Date(params.value[0]);
                data = date.getFullYear() + '-'
                       + (date.getMonth() + 1) + '-'
                       + date.getDate();
                return data + '<br/>'
                       + "访问量：" + params.value[1];
            }
        },
        toolbox: {
            show : true,
            feature : {
                mark : {show: true},
                dataView : {show: true, readOnly: false},
                restore : {show: true},
                saveAsImage : {show: true}
            }
        },
        dataZoom: {
            show: true,
            start : 0
        },
        legend : {
            data : ['访问量']
        },
        grid: {
            y2: 100
        },
        xAxis : [
            {
                type : 'time',
                splitNumber: 10
            }
        ],
        yAxis : [
            {
                type : 'value'
            }
        ],
        series : [
            {
                type: 'line',
                showAllSymbol: true,
                symbolSize: function (value){
                    return Math.round(value[1]/100) + 2;
                },
                data: (function () {
                    return _.map(dailyVisits, function(visit) {
                        return [new Date(visit[0]), visit[1]];
                    });
                })()
            }
        ]
    });
}
function initURLsPercent(ec) {
    var URLsPercentChart = ec.init(document.getElementById('URLsPercent'));
    var limit = urlsFreq.length < 20 ? urlsFreq.length : 10;
    var top20Urls = [];
    var top20Titles = [];
    for (var i = 0; i < limit; i++) {
        var title = urlsFreq[i][0];
        title = title.length > 20 ? title.substring(0, 20) : title
        top20Titles.push(title);
        console.log(title);
        top20Urls.push({value: urlsFreq[i][1], name: title});
    }
    URLsPercentChart.setOption({
        title : {
            text: 'TOP 20 访问网址',
            x:'center'
        },
        tooltip : {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
            orient : 'vertical',
            x : 'left',
            data: top20Titles
        },
        toolbox: {
            show : true,
            feature : {
                mark : {show: true},
                dataView : {show: true, readOnly: false},
                magicType : {
                    show: true, 
                    type: ['pie', 'funnel'],
                    option: {
                        funnel: {
                            x: '25%',
                            width: '50%',
                            funnelAlign: 'left',
                            max: 1548
                        }
                    }
                },
                restore : {show: true},
                saveAsImage : {show: true}
            }
        },
        calculable : true,
        series : [
            {
                name:'访问来源',
                type:'pie',
                radius : '75%',
                center: ['50%', '60%'],
                data: top20Urls
            }
        ]
    });
}