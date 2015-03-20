var count = 0
  , incrementPerSecond = 254
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

// Quick and dirty way to format as euros
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

// Quick and dirty way to format as dollars
function formatAsDollars (amount) {
  var res = ''
    , currentPart
    ;

  if (amount === 0) { return '$ 0'; }

  while (amount > 0) {
    currentPart = amount - 1000 * Math.floor(amount / 1000);
    if (amount === currentPart) {   // No padding if it's the last part
      res = currentPart + ',' + res;
    } else {
      res = pad(currentPart) + ',' + res;
    }
    amount = (amount - currentPart) / 1000;
  }

  return '$ ' + res.substring(0, res.length -1);
}

var format = formatAsEuros;

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
  $counter.html(format(Math.floor(toDisplay)));
  if (Date.now() - beginTime < updateTime) {
    setTimeout(function () { getCounterToValue(fromValue, toValue, beginTime); }, microDelay);
  }
}

function nowUpdating () {
  updateCounter();
  setTimeout(nowUpdating, getRandomDelay());
}


// Get query string as an object
function getQuerystringAsObject () {
  var res = {};

  var qs = document.location.search.substring(1).split('&');
  qs.forEach(function (k) {
    res[k.split('=')[0]] = k.split('=')[1];
  });

  return res;
}



// Initialization
var qs = getQuerystringAsObject();

// Initial counter value
try {
  var initialValue = qs.d;
  initialValue = parseInt(initialValue, 10);
  if (!isNaN(initialValue)) {
    count = initialValue;
  }
} catch (e) {
  // Do nothing, initial value already defined
}

// Language (default is French)
// Not a very nice way to do this, but since it's just a prototype for the US team ...
if (qs.l === 'en') {
  format = formatAsDollars;
  $('#not-shared-message').html('NO SHARED FLEET<br>FOR YOUR SERVICE VEHICLES?');
  $('#lost-message').html('Since the beginning of the event, YOU HAVE LOST:');
}

// Increase speed
try {
  var _i = qs.i;
  _i = parseInt(_i, 10);
  if (!isNaN(_i)) {
    incrementPerSecond = _i;
  }
} catch (e) {
  // Do nothing, initial increment already defined
}


nowUpdating();


