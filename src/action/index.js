const parseYouTubeVideoId = (url) => {
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = url.match(regExp);
    return (match&&match[7].length==11)? match[7] : false;
}

document.addEventListener("DOMContentLoaded", function(event) {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        const activeTab = tabs[0];
        const videoId = parseYouTubeVideoId(activeTab.url);
        if (videoId) {
            document.getElementById("content").style.display = "block";

            chrome.storage.local.get([videoId], function(result) {
                const loadedData = result[videoId];

                if (loadedData) {
                    setValuesInUI(loadedData);
                    document.getElementById("site_link").href = "https://opportunitycost.life?v=" + videoId;
                }
            });
        } else {
            document.getElementById("no-content").style.display = "block";
        }
     });
});

function roundUp(num, precision) {
    precision = Math.pow(10, precision);
    return Math.ceil(num * precision) / precision;
}

function getLivesLost(opportunitycost) {
    const averageLifeSpanInYears = 73.2;
    const yearsWatched = opportunitycost/31557600
    const averageLivesLost =  yearsWatched/averageLifeSpanInYears;
    const precision = averageLivesLost > 1 ? 2 : 4;
    return roundUp(averageLivesLost, precision);
}

function getYearsLostString(opportunitycost) {
    const yearsWatched = opportunitycost/31557600

    if (yearsWatched > 1000) {
        return getShortFormatString(yearsWatched);
    }

    const precision = yearsWatched > 1 ? 2 : 4;
    return String(roundUp(yearsWatched, precision));
}

function getShortFormatString(value) {
    if (value > 1000000) {
        const millions = value/1000000;
        const milResults = millions + (value - (millions * 1000000));
        return String(roundUp(milResults, 2) + 'mil');
    } else if (value > 1000) {
        const thousands = value/1000;
        const kResults = thousands + (value - (thousands * 1000));
        return String(roundUp(kResults, 1) + 'k');
    }

    return String(value);
}

function setValuesInUI(data) {
    const opportunitycost = data.data.videoMeta.opportunityCost;
    document.getElementById("lives-spent-digit").innerHTML = getLivesLost(opportunitycost);
    document.getElementById("years-spent-digit").innerHTML = getYearsLostString(opportunitycost);
}