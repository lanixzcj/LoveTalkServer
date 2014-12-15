// 在 Cloud code 里初始化 Express 框架
var express = require('express');
var app = express();
var muser = require('cloud/muser');
var mutil = require('cloud/mutil');
var _=require('underscore');
var madd=require('cloud/madd');
var mgroup=require('cloud/mgroup.js');
var msign=require('cloud/msign.js');
var mqiniu=require('cloud/mqiniu');

// App 全局配置
app.set('views', 'cloud/views');   // 设置模板目录
app.set('view engine', 'ejs');    // 设置 template 引擎
app.use(express.bodyParser());    // 读取请求 body 的中间件

// 使用 Express 路由 API 服务 /hello 的 HTTP GET 请求
app.get('/hello', function (req, res) {
  res.render('hello');
});

function addFriendTest(req, res) {
  var fromUserId = '53f0d534e4b0c1ae470ca958';
  var toUserId = '540939e4e4b02b98df61ccb6';
  muser.addFriendForBoth(fromUserId, toUserId).then(function () {
    res.send('ok');
  }, mutil.renderErrorFn(res));
}

function removeFriendTest(req, res) {
  var fromUserId = '53f0d534e4b0c1ae470ca958';
  var toUserId = '540939e4e4b02b98df61ccb6';
  muser.removeFriendForBoth(fromUserId, toUserId).then(function () {
    res.send('ok');
  }, mutil.renderErrorFn(res));
}

function findUserTest(req, res) {
  muser.findUserById('53f0d534e4b0c1ae470ca958').then(function (user) {
    res.send(user);
  }, mutil.renderErrorFn(res));
}

function renderFriends(req, res) {
  var name = req.params.name;
  muser.findFriends(name).then(function (friends) {
    res.send(friends);
  }, mutil.renderErrorFn(res))
}

function findAvatars() {
  return mutil.findAll('Avatar');
}

function setUserAvatar(req, res) {
  muser.findAllUsers().then(function (users) {
    findAvatars().then(function (avatars) {
      var ps = [];
      _.each(users, function (user) {
        var len = avatars.length;
        var pos = Math.floor(len * Math.random());
        if (user.get('avatar') == null) {
          user.set('avatar', avatars[pos].get('file'));
          ps.push(user.save());
        }
      });
      AV.Promise.when(ps).then(function () {
        res.send('ok');
      }, mutil.renderErrorFn(res));
    });
  }, mutil.renderErrorFn(res));
}

function handlePromise(p,res){
  p.then(function(){
    res.send('ok');
  },mutil.renderErrorFn(res));
}

function addRequestTest(req,res){
  var fromUserId='544f2a25e4b0e9dff2e9b272';
  var toUserId='53f0d534e4b0c1ae470ca958';
  var p=madd._tryCreateAddRequest(fromUserId,toUserId);
  handlePromise(p,res);
}

function agreeAddRequestTest(req,res){
  var id='5458c607e4b0b14db2a89226';
  var p=madd._agreeAddRequest(id);
  handlePromise(p,res);
}

function agreeFail(req,res){
  var id='232';
  var p=madd._agreeAddRequest(id);
  handlePromise(p,res);
}

function saveGroupTest(req,res){
  var groupId="5457a226e4b0c79a9a34bef6";
  var name="test2";
  var ownerId="5458c554e4b0b14db2a8857a";
  var p=mgroup._saveChatGroup(groupId,ownerId,name);
  handlePromise(p,res);
}

function avatarTest(req,res) {
  muser.findUserById('544f2a25e4b0e9dff2e9b272').then(function(user){
    user.set('sex',true);
    user.save().then(function(){
      res.send('ok');
    },mutil.renderErrorFn(res));
  },mutil.renderErrorFn(res));
}

function agreeAllAdds(req,res){
  var p=madd.agreeAllAddRequests();
  handlePromise(p,res);
}

function signTest(req,res){
  var result=msign._sign("1",["2","3","4"]);
  res.send(result);
}

function groupSignTest(req,res){
  var result=msign._groupSign("1","4ad934r23bjhcas",["2","3","4"],"join");
  res.send(result);
}

function qiniuTest(req,res) {
  var token=mqiniu.uptoken('lzw-picture');
  res.send(token);
}

function getQiniuToken(req,res){
  res.send({"token":mqiniu.uptoken(mqiniu.bucketName)});
}

if(__production==false){
  app.get('/addFriend', addFriendTest);
  app.get('/removeFriend', removeFriendTest);
  app.get('/user', findUserTest);
  app.get('/:name/friends', renderFriends);
  app.get('/setAvatars', setUserAvatar);
  app.get('/addRequestTest',addRequestTest);
  app.get('/agreeTest',agreeAddRequestTest);
  app.get('/agreeTestFail',agreeFail);
  app.get('/saveGroupTest',saveGroupTest);
  app.get('/avatarTest',avatarTest);
  app.get('/agreeAllAdds',agreeAllAdds);
  app.get('/signTest',signTest);
  app.get('/groupSignTest',groupSignTest);
  app.get('/qiniuTest',qiniuTest);
}

app.get('/qiniuToken',getQiniuToken);
app.post('/persistNotify',mqiniu.persistentNotify);

app.listen();