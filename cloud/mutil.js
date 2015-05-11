var util = require('util');
var mlog = require('cloud/mlog.js');
var moment = require('moment');
var crypto = require('crypto');

function doErr(err) {
  console.log(err);
}

function renderError(res, error) {
  var _error;
  if (error == null) {
    _error = "Unknown error";
  }
  if (typeof error != 'string'){
    _error = util.inspect(error);
    if(error.stack && !__production){
      _error+=' stack='+error.stack;
    }
  }
  res.render('500', {error: _error});
}

function renderErrorFn(res) {
  return function (err) {
    renderError(res, err);
  };
}

function rejectFn(promise) {
  return function (error) {
    promise.reject(error);
  }
}

function logErrorFn() {
  return function (err) {
    mlog.logError(err);
  }
}

function renderForbidden(res) {
  mlog.log('render forbidden');
  renderError(res, "Forbidden area.");
}

function findOne(clzName, modifyQueryFn) {
  var Clz = new AV.Object.extend(clzName);
  var q = new AV.Query(Clz);
  if (modifyQueryFn) {
    modifyQueryFn(q);
  }
  return q.first();
}

function findAll(clzName, modifyQueryFn) {
  var q = new AV.Query(clzName);
  var res = [];
  var p = new AV.Promise();
  if (modifyQueryFn) {
    modifyQueryFn(q);
  }
  q.count({
      success: function (cnt) {
        var t = (cnt + 999) / 1000;  //I'm so clever!
        t = Math.floor(t);  //But...
        var promises = [];
        for (var i = 0; i < t; i++) {
          var skip = i * 1000;
          var q = new AV.Query(clzName);
          q.ascending('createdAt');
          q.limit(1000);
          if (modifyQueryFn) {
            modifyQueryFn(q);
          }
          q.skip(skip);
          promises.push(q.find({
            success: function (lines) {
              res = res.concat(lines);
              return AV.Promise.as(res);
            }
          }));
        }
        AV.Promise.when(promises).then(function () {
          p.resolve(res);
        }, rejectFn(p));
      },
      error: rejectFn(p)
    }
  );
  return p;
}

function testFn(fn, res) {
  fn.call(this).then(function () {
    res.send('ok');
  }, mutil.renderErrorFn(res));
}

function calDateBeforeDays(days) {
  var now = moment().subtract(days, 'day');
  now.hour(0);
  now.minute(0);
  now.second(0);
  return now.toDate();
}

function calDateFromDateByDays(date, days) {
  var date = new moment(date);
  date.subtract(days, 'day');
  return date.toDate();
}

function durationQueryFn(field, startDate, endDate) {
  return function (q) {
    q.greaterThan(field, startDate);
    q.lessThan(field, endDate);
  };
}

function updatedAtDurationQueryFn(startDate, endDate) {
  return durationQueryFn('updatedAt', startDate, endDate);
}

function createdAtDurationQueryFn(startDate, endDate) {
  return durationQueryFn('createdAt', startDate, endDate);
}

function encrypt(s) {
  var md5 = crypto.createHash('md5');
  md5.update(s);
  return md5.digest('hex');
}

function cloudErrorFn(response) {
  return function (error) {
    console.log('cloudError '+error.message);
    response.error(error.message);
  };
}

exports.doErr = doErr;
exports.renderErrorFn = renderErrorFn;
exports.renderError = renderError;
exports.rejectFn = rejectFn;
exports.renderForbidden = renderForbidden;
exports.logErrorFn = logErrorFn;
exports.findAll = findAll;
exports.findOne = findOne;
exports.testFn = testFn;
exports.calDateBeforeDays = calDateBeforeDays;
exports.updatedAtDurationQueryFn = updatedAtDurationQueryFn;
exports.calDateFromDateByDays = calDateFromDateByDays;
exports.createdAtDurationQueryFn = createdAtDurationQueryFn;
exports.encrypt = encrypt;
exports.cloudErrorFn = cloudErrorFn;