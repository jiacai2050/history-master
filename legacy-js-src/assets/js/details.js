function showHistory(histories, start, end) {
    var details = $("#details");
    histories = _.sortBy(histories, "lastVisitTime");
    for(var i=0; i<histories.length; i++) {
        if(histories[i].lastVisitTime < start || histories[i].lastVisitTime > end) {
            continue;
        }
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
    // Even if set endTime, there are still some items beyond endTime. bug ??
    // so filter again in showHistory
    chrome.history.search({
        text: "",
        startTime: start.valueOf(),
        endTime: end.valueOf(),
        maxResults: MAX_RESULTS
    }, (histories) => {
        showHistory(histories, start.valueOf(), end.valueOf());
    });
})
