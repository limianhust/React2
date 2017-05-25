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

export function signUp(email, username, password, successFn, errorFn) {
    // 用户名和密码注册，新建 AVUser 对象实例
    var user = new AV.User();
    // 设置用户名
    user.setUsername(username);
    // 设置密码
    user.setPassword(password);
    // 设置邮箱
    user.setEmail(email);

    user.signUp().then(function (loginedUser) {
        let user = getUserFormAVUser(loginedUser)
        successFn.call(null, user)
    }, function (error) {
        errorFn.call(null, error)
    });
    return undefined
}

export function getCurrentUser() {
    let user = AV.User.current()
    if (user) {
        return user;
    } else {
        return null
    }
}

function getUserFormAVUser(AVUser) {
    return {
        id: AVUser.id,
        ...AVUser.attributes
    }
}

export function signIn(username, password, successFn, errorFn) {

    AV.User.logIn(username, password).then(function (loginedUser) {
        let user = getUserFormAVUser(loginedUser)
        successFn.call(null, user)
    }, function (error) {
        errorFn.call(null, error)
    });
}

export function signOut() {
    AV.User.logOut();
    // 现在的 currentUser 是 null 了
    var currentUser = AV.User.current();
}

//测试
// var TestObject = AV.Object.extend('todo');
// var testObject = new TestObject();
// testObject.save({
//   words: 'Hello limian!'
// }).then(function(object) {
//   alert('LeanCloud Rocks!');
// })
//数据库初始化
var TodoObject = AV.Object.extend('todoList');
var todoObject;

export function init(user) {
    var TodoObject = AV.Object.extend('todoList');
    var todoObject = new TodoObject();
}

export function save(item) {

}
export function sendPasswordResetEmail(email,success,error) {
    AV.User.requestPasswordReset(email).then(function (success) {
    }, function (error) {
    });
}