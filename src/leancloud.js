import AV from 'leancloud-storage'

const appId = 'a14EgGTC7TdIGaN2MNHqxgx5-gzGzoHsz';
const appKey = '2Y5RFjobxAwVGSJUzDp9gtos';
AV.init({ appId, appKey });

//测试
// var TestObject = AV.Object.extend('todo');
// var testObject = new TestObject();
// testObject.save({
//   words: 'Hello limian!'
// }).then(function(object) {
//   alert('LeanCloud Rocks!');
// })

export default AV

export function signUp(username,password,successFn,errorFn) {
    // 用户名和密码注册，新建 AVUser 对象实例
  var user = new AV.User();
  // 设置用户名
  user.setUsername(username);
  // 设置密码
  user.setPassword(password);
  // 设置邮箱
  //user.setEmail('tom@leancloud.cn');
  user.signUp().then(function (loginedUser) {
       let user = getUserFormAVUser(loginedUser)
      successFn.call(null,user)
  }, function (error) {
      errorFn.call(null,error)
  });
  return undefined
}

function getUserFormAVUser(AVUser) {
    return {
        id: AVUser.id,
        ...AVUser.attributes
    }
}