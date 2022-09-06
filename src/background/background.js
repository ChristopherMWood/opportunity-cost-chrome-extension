chrome.tabs.onUpdated.addListener(function (_tabId, changeInfo, tab) {
  const url = tab.url;
  const videoId = parseYouTubeVideoId(url);

  if (videoId && changeInfo.status === 'complete' && tab.active) {
    getOpportunityCost(videoId, (data) => {
      const storageData = {
        data: data,
        cacheExpiration: getCacheExpirationTime(5)
      };

      chrome.storage.local.set({[videoId]: storageData}, function() {
        console.log('video Id: ' + videoId + ' stored');
        console.log(storageData);
      });
    });
  }
})

const getCacheExpirationTime = (minutes) => {
  const currentDate = new Date();
  const currentDateSeconds = currentDate.getTime();
  const expirationMinutes = 60 * minutes;
  return new Date(currentDateSeconds + expirationMinutes);
}

const getOpportunityCost = (videoId, callback) => {
  const url = 'https://api.christopherwood.dev/api/opportunitycost/' + videoId;

  fetch(url).then(function (response) {
      response.json().then((json) => {
          callback(json);
      });
  }).catch(function (err) {
      callback(err);
  });
}

const parseYouTubeVideoId = (url) => {
  const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
  const match = url.match(regExp);
  return (match&&match[7].length==11)? match[7] : false;
}