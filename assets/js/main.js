var SHOW_FORMAT = "YYYY/MM/DD";

function initCharts(browser, dailyVisits, urlsFreq) {
    return function(ec) {
        initDailyVisits(ec, browser, dailyVisits);
        initURLsPercent(ec, browser, urlsFreq);
    }
}

function initDailyVisits(ec, browser, dailyVisits) {
    var ecConfig = require('echarts/config');
    //--- Trend Chart ---
    var dailyVisitsChart = ec.init(document.getElementById('dailyVisits'));
    dailyVisitsChart.setOption({
        color: ['#23B7E5'],
        title : {
            text : 'Daily PV',
            subtext : 'Click any node to view visit details'
        },
        tooltip : {
            trigger: 'item',
            formatter : function (params) {
                var date = new Date(params.value[0]);
                data = date.getFullYear() + '/'
                       + (date.getMonth() + 1) + '/'
                       + date.getDate();
                return data + '<br/>'
                       + "PV: " + params.value[1];
            }
        },
        toolbox: {
            show : true,
            feature : {
                mark : {show: true},
                dataView : {show: true, readOnly: false},
                magicType : {show: true, type: ['line', 'bar']},
                restore : {show: true},
                saveAsImage : {show: true}
            }
        },
        dataZoom: {
            show: true,
            start : 0
        },
        legend : {
            data : ['Page View']
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
                name: 'PV',
                type : 'value'
            }
        ],
        series : [
            {
                name: 'Page View',
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
    dailyVisitsChart.on(ecConfig.EVENT.CLICK, function(param) {
        window.location.pathname = "/" + browser.toLowerCase() + "/details/" + param.data[0].getTime()
    });

}

function initURLsPercent(ec, browser, urlsFreq) {
    var URLsPercentChart = ec.init(document.getElementById('URLsPercent'));
    var topLimit = urlsFreq.length < 10 ? urlsFreq.length : 10;
    var top10Urls = [];
    var top10Titles = [];
    for (var i = 0; i < topLimit; i++) {
        var title = urlsFreq[i][0];
        title = title.length > 50 ? title.substring(0, 50) : title
        top10Titles.push(title);
        top10Urls.push({value: urlsFreq[i][1], name: title});
    }
    URLsPercentChart.setOption({
        title : {
            text: 'Percentage of TOP 10 frequently visited sites',
            x:'center'
        },
        tooltip : {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
            orient : 'vertical',
            x : 'left',
            data: top10Titles
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
                name:'Title: ',
                type:'pie',
                radius : '75%',
                center: ['50%', '60%'],
                data: top10Urls
            }
        ]
    });
}

function configChart(browser, dailyVisits, urlsFreq) {
    require.config({
        paths: {
            echarts: '/js'
        }
    });
    require(
        [
            'echarts',
            'echarts/chart/line',
            'echarts/chart/pie',
            'echarts/chart/bar',
            'echarts/chart/funnel'
        ],
        initCharts(browser, dailyVisits, urlsFreq)
    );
}

function chooseDaterangeCB(start, end, chosenLabel) {

    start = start.format(SHOW_FORMAT);
    end = end.format(SHOW_FORMAT);
    if (chosenLabel == "firstInit") {
        $('#browse_range span').html(`${start} - ${end}`);
    } else {
        window.location = `${window.location.pathname}?start=${start}&end=${end}`;
    }
}
