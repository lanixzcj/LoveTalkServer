/**
 * Created by lzw on 14/11/20.
 */
var common = require('cloud/common.js');

APPID = AV.applicationId;
MASTER_KEY = AV.masterKey;

function _convSign(selfId, convid, targetIds, action) {
  if (targetIds == null) {
    targetIds = [];
  }
  targetIds.sort();
  var ts = parseInt(new Date().getTime() / 1000);
  var nonce = common.getNonce(5);
  var content;
  if (convid) {
    content = [APPID, selfId, convid, targetIds.join(':'), ts, nonce].join(':');
  } else {
    content = [APPID, selfId, targetIds.join(':'), ts, nonce].join(':');
  }

  if (action) {
    content += ':' + action;
  }
  //console.log('content=' + content);
  var sig = common.sign(content, MASTER_KEY);
  return {"nonce": nonce, "timestamp": ts, "signature": sig};
}

function convSign(request, response) {
  var selfId = request.params['self_id'];
  var convid = request.params['convid'];
  var targetIds = request.params['targetIds'];
  var action = request.params['action'];
  var result = _convSign(selfId, convid, targetIds, action);
  response.success(result);
}

module.exports = {
  _convSign: _convSign,
  convSign: convSign
};