function initCharts(dailyVisits, urlsFreq) {
    return function(ec) {
        initDailyVisits(ec, dailyVisits);
        initURLsPercent(ec, urlsFreq);
        initURLsRank(urlsFreq);
    }
}

function initDailyVisits(ec, dailyVisits) {
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
        var currentDay = moment(param.data[0].getTime()).format(SHOW_FORMAT);
        chrome.tabs.create({
            url: `/assets/details.html?currentDay=${currentDay}`
        });
    });
}

function initURLsPercent(ec, urlsFreq) {
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

function initURLsRank(urlsFreq) {
    var rank = $("#urls_rank");

    for(var i=0; i<urlsFreq.length; i++) {
        var row = [
            `<tr>`,
                `<td>${i+1}</td>`,
                `<td>${urlsFreq[i][1]}</td>`,
                `<td>${urlsFreq[i][0]}</td>`,
            `</tr>`,
        ].join();
        rank.append(row)
    }
}

function configChart(dailyVisits, urlsFreq) {
    require.config({
        paths: {
            echarts: 'js'
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
        initCharts(dailyVisits, urlsFreq)
    );
}

function chooseRangeCB(start, end, chosen_label) {
    start = start.format(SHOW_FORMAT);
    end = end.format(SHOW_FORMAT);
    if (chosen_label == "first_init") {
        $('#browse_range span').html(`${start} - ${end}`);
    } else {
        window.location = `${window.location.pathname}?start=${start}&end=${end}`;
    }
}

function showHistory(histories) {
    histories = _.map(histories, (history) => {
        return {
            "visitDay": moment(history.lastVisitTime).startOf('day').valueOf(),
            "title": history.title || history.url,
            "url": history.url
        }
    });
    var dailyVisits = _.groupBy(histories, 'visitDay');
    var dailyVisitsArr = [];
    for (visitDay in dailyVisits) {
        dailyVisitsArr.push([parseInt(visitDay), dailyVisits[visitDay].length])
    }
    var urlsFreq = _.groupBy(histories, 'title');
    var urlsFreqArr = [];
    for (title in urlsFreq) {
        urlsFreqArr.push([title, urlsFreq[title].length])
    }
    urlsFreqArr = _.sortBy(urlsFreqArr, function(o) { return - o[1]; })
    configChart(dailyVisitsArr, urlsFreqArr);
}

$(function() {

    var queryDict = parseQueryString();

    if ('start' in queryDict && 'end' in queryDict) {
        var start = moment(queryDict.start, SHOW_FORMAT);
        var end = moment(queryDict.end, SHOW_FORMAT);
    } else {
        var end = moment();
        var start = moment().subtract('7', 'days');
    }

    $('#browse_range').daterangepicker({
        startDate: start,
        endDate: end,
        format: SHOW_FORMAT,
        ranges: {
           'Yesterday': [moment().subtract(1, 'days'), moment()],
           'Last 7 Days': [moment().subtract(6, 'days'), moment()],
           'Last 30 Days': [moment().subtract(29, 'days'), moment()],
           'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
        }
    }, chooseRangeCB);

    chooseRangeCB(start, end, "first_init");

    chrome.history.search({
        text: "",
        startTime: start.valueOf(),
        endTime: end.valueOf(),
        maxResults: MAX_RESULTS
    }, (histories) => {
        showHistory(histories);
    });
});
