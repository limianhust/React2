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


export function init(user) {
    var TodoObject = AV.Object.extend(user);
    var todoObject = new TodoObject();
    return todoObject
}

export function save(item) {
    var TodoObject = AV.Object.extend('todoList');
    var todoObject = new TodoObject();
    todoObject.save(item).then(function(object) {
        console.log('保存成功后返回的对象')
        console.log(object)
        console.log(object.id)
    })
}
export function sendPasswordResetEmail(email,success,error) {
    AV.User.requestPasswordReset(email).then(function (success) {
    }, function (error) {
    });
}


export const TodoModel = {
    create({status,title,deleted},successFn,errorFn){
        let Todo = AV.Object.extend('Todo')
        let todo = new Todo()
        todo.set('title',title)
        todo.set('status',status)
        todo.set('deleted',deleted)
        todo.save().then(function(response){
            successFn.call(null,response.id)
            console.log(response)
        },function (error) {
            errorFn && errorFn.call(null,error)
        })
    },
    update(id){

    },
    destroy(){

    },
    getByUser(user,successFn,errorFn){
        let query = new AV.Query('Todo')
        query.find().then((response)=>{
            let array = response.map((t)=>{
                return {
                    id: t.id,
                    ...t.attributes
                }
            })
            successFn.call(null,array)
        },(error)=>{
            errorFn && errorFn.call(null,error)
        })
    }
}