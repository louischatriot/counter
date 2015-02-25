var count = 0
  , incrementPerSecond = 300
  , minDelay = 1900
  , maxDelay = 3700
  , latest = Date.now()
  , $counter = $('#counter')
  , updateTime = 500
  , microDelay = 1
  ;


function getRandomDelay () {
  return Math.floor(minDelay + (maxDelay - minDelay) * Math.random());
}

function incrementCount () {
  var former = latest;
  latest = Date.now();
  count += incrementPerSecond * (latest - former) / 1000;
}

function updateCounter () {
  var formerCount = count;
  incrementCount(); 
  getCounterToValue(formerCount, count, Date.now());
}

function getCounterToValue (fromValue, toValue, beginTime) {
  var toDisplay = fromValue + (toValue - fromValue) * (Date.now() - beginTime) / updateTime;
  toDisplay = Math.min(toDisplay, toValue);
  $counter.html(Math.floor(toDisplay));
  if (Date.now() - beginTime < updateTime) {
    setTimeout(function () { getCounterToValue(fromValue, toValue, beginTime); }, microDelay);
  }
}

function nowUpdating () {
  updateCounter();
  setTimeout(nowUpdating, getRandomDelay());
}
nowUpdating();
