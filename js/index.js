var count = 0
  , incrementPerSecond = 30023
  , minDelay = 1900
  , maxDelay = 3700
  , latest = Date.now()
  , $counter = $('#counter')
  , updateTime = 500
  , microDelay = 1
  ;

// Quick and dirty padding function up to 3 digits
function pad (n) {
  if (n < 10) { return '00' + n; }
  if (n < 100) { return '0' + n; }
  return n.toString();
}

// Quick and dirty way to frmat as euros
function formatAsEuros (amount) {
  var res = '€'
    , currentPart
    ;

  if (amount === 0) { return '0 ' + res; }

  while (amount > 0) {
    currentPart = amount - 1000 * Math.floor(amount / 1000);
    if (amount === currentPart) {   // No padding if it's the last part
      res = currentPart + ' ' + res;
    } else {
      res = pad(currentPart) + ' ' + res;
    }
    amount = (amount - currentPart) / 1000;
  }

  return res;
}

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
  $counter.html(formatAsEuros(Math.floor(toDisplay)));
  if (Date.now() - beginTime < updateTime) {
    setTimeout(function () { getCounterToValue(fromValue, toValue, beginTime); }, microDelay);
  }
}

function nowUpdating () {
  updateCounter();
  setTimeout(nowUpdating, getRandomDelay());
}
nowUpdating();


