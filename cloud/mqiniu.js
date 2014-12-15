/**
 * Created by lzw on 14/12/2.
 */
var qiniu = require('qiniu');
var mlog = require('cloud/mlog.js');

qiniu.conf.ACCESS_KEY = 'YxDhpo85h5bhHTSl81oEmfmvDs2TI4XRjdJkuOw-';
qiniu.conf.SECRET_KEY = 'EB_JPvLX0EDNYk9OlCEBOavFLfVPURCWxb27xbcc';
var bucketName = 'lzw-love';

function uptoken(bucketname) {
  var putPolicy = new qiniu.rs.PutPolicy(bucketname);
  //putPolicy.callbackUrl = callbackUrl;
  //putPolicy.callbackBody = callbackBody;
  //putPolicy.returnUrl = returnUrl;
  //putPolicy.returnBody = returnBody;
  putPolicy.persistentOps = "avthumb/amr";
  putPolicy.persistentNotifyUrl = "https://leanchat.avosapps.com/persistNotify";
  //putPolicy.expires = expires;

  var tokenPart = putPolicy.token();
  return tokenPart;
}

function persistentNotify(req, res) {
  console.log(req.body);
  res.send(req.body);
}

function qiniuUptoken(req, res) {
  res.success({"token":uptoken(bucketName)});
}

exports.uptoken = uptoken;
exports.qiniuUptoken = qiniuUptoken;
exports.persistentNotify = persistentNotify;
exports.bucketName = bucketName;
