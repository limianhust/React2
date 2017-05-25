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

export function sendPasswordResetEmail(email, success, error) {
    AV.User.requestPasswordReset(email).then(function (success) {
    }, function (error) {
    });
}

//向云端数据库操作
export const TodoModel = {
    create({ status, title, deleted }, successFn, errorFn) {
        let Todo = AV.Object.extend('Todo')
        let todo = new Todo()
        todo.set('title', title)
        todo.set('status', status)
        todo.set('deleted', deleted)
        // 设置权限
        var acl = new AV.ACL();
        acl.setPublicReadAccess(false);
        acl.setWriteAccess(AV.User.current(), true);

        // 将 ACL 实例赋予 Post 对象
        todo.setACL(acl);
        todo.save().then(function (response) {
            successFn.call(null, response.id)
            console.log(response)
        }, function (error) {
            errorFn && errorFn.call(null, error)
        })
    },
    update(id) {
        
    },
    destroy(id,successFn,errorFn) {
        //假如某一个 Todo 完成了，用户想要删除这个 Todo 对象，可以如下操作：
        var todo = AV.Object.createWithoutData('Todo', id);
        todo.destroy().then(function (response) {
            successFn && successFn.call(null,response)
            // 删除成功
        }, function (error) {
            errorFn && errorFn.call(null)
            // 删除失败
        });
    },
    getByUser(user, successFn, errorFn) {
        let query = new AV.Query('Todo')
        query.find().then((response) => {
            let array = response.map((t) => {
                return {
                    id: t.id,
                    ...t.attributes
                }
            })
            successFn.call(null, array)
        }, (error) => {
            errorFn && errorFn.call(null, error)
        })
    }
}