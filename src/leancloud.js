import AV from 'leancloud-storage'

const appId = 'a14EgGTC7TdIGaN2MNHqxgx5-gzGzoHsz';
const appKey = '2Y5RFjobxAwVGSJUzDp9gtos';
AV.init({ appId, appKey });

//测试
var TestObject = AV.Object.extend('todo');
var testObject = new TestObject();
// testObject.save({
//   words: 'Hello limian!'
// }).then(function(object) {
//   alert('LeanCloud Rocks!');
// })

export default AV