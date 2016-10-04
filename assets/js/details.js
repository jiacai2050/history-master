function showHistory(histories) {
    var details = $("#details");
    histories = _.sortBy(histories, "lastVisitTime");
    for(var i=0; i<histories.length; i++) {
        var title = histories[i].title || histories[i].url;
        var row = [
            `<tr>`,
                `<td>${i+1}</td>`,
                `<td>${moment(histories[i].lastVisitTime).format(SHOW_FORMAT_SEC)}</td>`,
                `<td><a href="${histories[i].url}">${title}</a></td>`,
            `</tr>`,
        ].join();
        details.append(row)
    }
}
$(function () {
    var queryDict = parseQueryString();
    var currentDay = queryDict["currentDay"];
    $("#currentDay").html(currentDay);
    var start = moment(currentDay, SHOW_FORMAT);
    var end = moment(currentDay, SHOW_FORMAT).add('1', 'day');
    console.log(start.format(SHOW_FORMAT_SEC), end.format(SHOW_FORMAT_SEC))
    chrome.history.search({
        text: "",
        startTime: start.valueOf(),
        endTime: end.valueOf(),
        maxResults: MAX_RESULTS
    }, (histories) => {
        showHistory(histories);
    });
})
