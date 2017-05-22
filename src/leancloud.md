LeanCloud
文档首页SDK 下载DemosAPI 文档公开课帮助

搜索文档…
limianhust
功能概览
Objective-C
Swift
Android
JavaScript
.NET / Unity3D
Python
PHP
Java
REST API
云引擎
更多
数据存储开发指南 · JavaScript
SDK 安装
Web 安全
开启调试日志
对象
文件
查询
示例数据结构
创建查询实例
比较查询
字符串查询
数组查询
空值查询
关系查询
地理位置查询
组合查询
查询结果数量和排序
CQL 查询
查询性能优化
Promise
用户
角色
应用内搜索
应用内社交
Push 通知
WebView 中使用
展开所有 返回顶部
编辑文档 更新于 2017年5月19日
数据存储开发指南 · JavaScript

数据存储（LeanStorage）是 LeanCloud 提供的核心功能之一，它的使用方法与传统的关系型数据库有诸多不同。下面我们将其与传统数据库的使用方法进行对比，让大家有一个初步了解。
1

下面这条 SQL 语句在绝大数的关系型数据库都可以执行，其结果是在 Todo 表里增加一条新数据：
+

INSERT INTO Todo (title, content) VALUES ('工程师周会', '每周工程师会议，周一下午 2 点')
+
使用传统的关系型数据库作为应用的数据源几乎无法避免以下步骤：
+

插入数据之前一定要先创建一个表结构，并且随着之后需求的变化，开发者需要不停地修改数据库的表结构，维护表数据。
每次插入数据的时候，客户端都需要连接数据库来执行数据的增删改查（CRUD）操作。
使用 LeanStorage，实现代码如下：
+

  // 声明一个 Todo 类型
  var Todo = AV.Object.extend('Todo');
  // 新建一个 Todo 对象
  var todo = new Todo();
  todo.set('title', '工程师周会');
  todo.set('content', '每周工程师会议，周一下午2点');
  todo.save().then(function (todo) {
    // 成功保存之后，执行其他逻辑.
    console.log('New object created with objectId: ' + todo.id);
  }, function (error) {
    // 异常处理
    console.error('Failed to create new object, with error message: ' + error.message);
  });
+
使用 LeanStorage 的特点在于：
+

不需要单独维护表结构。例如，为上面的 Todo 表新增一个 location 字段，用来表示日程安排的地点，那么刚才的代码只需做如下变动：
  var Todo = AV.Object.extend('Todo');
  var todo = new Todo();
  todo.set('title', '工程师周会');
  todo.set('content', '每周工程师会议，周一下午2点');
  // 只要添加这一行代码，服务端就会自动添加这个字段
  todo.set('location','会议室');
  todo.save().then(function (todo) {
    // 成功保存之后，执行其他逻辑.
  }, function (error) {
    // 异常处理
  });
+
数据可以随用随加，这是一种无模式化（Schema Free）的存储方式。
所有对数据的操作请求都通过 HTTPS 访问标准的 REST API 来实现。
我们为各个平台或者语言开发的 SDK 在底层都是调用统一的 REST API，并提供完整的接口对数据进行增删改查。
LeanStorage 在结构化数据存储方面，与 DB 的区别在于：
+

Schema Free／Not free 的差异；
数据接口上，LeanStorage 是面向对象的（数据操作接口都是基于 Object 的），开放的（所有移动端都可以直接访问），DB 是面向结构的，封闭的（一般在 Server 内部访问）；
数据之间关联的方式，DB 是主键外键模型，LeanStorage 则有自己的关系模型（Pointer、Relation 等）；
LeanStorage 支持两种存储类型：
+

对象
文件
我们将按照顺序逐一介绍各类的使用方法。
+

SDK 安装

请阅读 JavaScript 安装指南。
+

Web 安全

如果在前端使用 JavaScript SDK，当你打算正式发布的时候，请务必配置 Web 安全域名。配置方式为：进入 控制台 / 设置 / 安全中心 / Web 安全域名。这样就可以防止其他人，通过外网其他地址盗用你的服务器资源。
+

具体安全相关内容可以仔细阅读文档 数据和安全 。
+

开启调试日志

在应用开发阶段，你可以选择开启 SDK 的调试日志（debug log）来方便追踪问题。调试日志开启后，SDK 会把网络请求、错误消息等信息输出到 IDE 的日志窗口，或是浏览器 Console 或是 LeanCloud 控制台的 云引擎日志 中。
+

// Node.js 中设置环境变量 DEBUG=leancloud*
// 通过 npm 启动应用时打开调试
DEBUG=leancloud* npm start

// 若使用云引擎 Node.js 环境，进入 LeanCloud 应用控制台 > 云引擎 > 设置 > 自定义环境变量，
// 第一字段写 DEBUG，第二个字段写 leancloud:*，保存。（注意 leancloud 和 * 之间有个冒号）
// 或使用云引擎 CLI 启动应用时打开调试，日志会输出到 应用控制台 > 云引擎 > 日志：
DEBUG=leancloud:* lean up

// 浏览器的 Console 中设置 localStorage
localStorage.setItem('debug', 'leancloud*');
+
在应用发布之前，请关闭调试日志，以免暴露敏感数据。
+
对象

AV.Object 是 LeanStorage 对复杂对象的封装，每个 AV.Object 包含若干属性值对，也称键值对（key-value）。属性的值是与 JSON 格式兼容的数据。通过 REST API 保存对象需要将对象的数据通过 JSON 来编码。这个数据是无模式化的（Schema Free），这意味着你不需要提前标注每个对象上有哪些 key，你只需要随意设置 key-value 对就可以，云端会保存它。
0+

数据类型

AV.Object 支持以下数据类型：
+

  // 该语句应该只声明一次
  var TestObject = AV.Object.extend('DataTypeTest');

  var number = 2014;
  var string = 'famous film name is ' + number;
  var date = new Date();
  var array = [string, number];
  var object = { number: number, string: string };

  var testObject = new TestObject();
  testObject.set('testNumber', number);
  testObject.set('testString', string);
  testObject.set('testDate', date);
  testObject.set('testArray', array);
  testObject.set('testObject', object);
  testObject.set('testNull', null);
  testObject.save().then(function(testObject) {
    // 成功
  }, function(error) {
    // 失败
  });
+
我们不推荐在 AV.Object 中储存大块的二进制数据，比如图片或整个文件。每个 AV.Object 的大小都不应超过 128 KB。如果需要储存更多的数据，建议使用 AV.File。
+

注意，时间类型在云端将会以 UTC 时间格式存储，但是客户端在读取之后会做转化成本地时间。
+

若想了解更多有关 LeanStorage 如何解析处理数据的信息，请查看专题文档《数据与安全》。
+

构建对象

构建一个 AV.Object 可以使用如下方式：
+

  // AV.Object.extend('className') 所需的参数 className 则表示对应的表名
  // 声明一个类型
  var Todo = AV.Object.extend('Todo');
+
注意：如果你的应用时不时出现 Maximum call stack size exceeded 异常，可能是因为在循环或回调中调用了 AV.Object.extend。有两种方法可以避免这种异常：
+

升级 SDK 到 v1.4.0 或以上版本
在循环或回调外声明 Class，确保不会对一个 Class 执行多次 AV.Object.extend
从 v1.4.0 开始，SDK 支持使用 ES6 中的 extends 语法来声明一个继承自 AV.Object 的类，上述的 Todo 声明也可以写作：
+

class Todo extends AV.Object {}
// 需要向 SDK 注册这个 Class
AV.Object.register(Todo);
2
每个 id 必须有一个 Class 类名称，这样云端才知道它的数据归属于哪张数据表。
+

Class 类名称（ClassName）必须以字母开头，只能包含字母、数字和下划线。
+
保存对象

现在我们保存一个 TodoFolder，它可以包含多个 Todo，类似于给行程按文件夹的方式分组。我们并不需要提前去后台创建这个名为 TodoFolder 的 Class 类，而仅需要执行如下代码，云端就会自动创建这个类：
+

  // 声明类型
  var TodoFolder = AV.Object.extend('TodoFolder');
  // 新建对象
  var todoFolder = new TodoFolder();
  // 设置名称
  todoFolder.set('name','工作');
  // 设置优先级
  todoFolder.set('priority',1);
  todoFolder.save().then(function (todo) {
    console.log('objectId is ' + todo.id);
  }, function (error) {
    console.error(error);
  });
+
创建完成后，打开 控制台 > 存储，点开 TodoFolder 类，就可以看到刚才添加的数据。除了 name、priority（优先级）之外，其他字段都是数据表的内置属性。
+

内置属性	类型	描述
objectId	String	该对象唯一的 Id 标识
ACL	ACL	该对象的权限控制，实际上是一个 JSON 对象，控制台做了展现优化。
createdAt	Date	该对象被创建的 UTC 时间
updatedAt	Date	该对象最后一次被修改的时间
属性名
也叫键或 key，必须是由字母、数字或下划线组成的字符串。
自定义的属性名，不能以双下划线 __ 开头，也不能与以下系统保留字段和内置属性重名（不区分大小写）。
ACL、className、createdAt、objectId、updatedAt
属性值
可以是字符串、数字、布尔值、数组或字典。
为提高代码的可读性和可维护性，建议使用驼峰式命名法（CamelCase）为类和属性来取名。类，采用大驼峰法，如 CustomData。属性，采用小驼峰法，如 imageUrl。
+

使用 CQL 语法保存对象

LeanStorage 提供了类似 SQL 语法中的 Insert 方式保存一个对象，例如保存一个 TodoFolder 对象可以使用下面的代码：
+

  // 执行 CQL 语句实现新增一个 TodoFolder 对象
  AV.Query.doCloudQuery('insert into TodoFolder(name, priority) values("工作", 1)').then(function (data) {
    // data 中的 results 是本次查询返回的结果，AV.Object 实例列表
    var results = data.results;
  }, function (error) {
    //查询失败，查看 error
    console.error(error);
  });
+
保存选项

AV.Object 对象在保存时可以设置选项来快捷完成关联操作，可用的选项属性有：
+

选项	类型	说明
fetchWhenSave	Boolean	对象成功保存后，自动返回本地已改动属性在云端的最新值。用途请参考 更新计数器。
query	AV.Query	当 query 中的条件满足后对象才能成功保存，否则放弃保存，并返回错误码 305。

开发者原本可以通过 AV.Query 和 AV.Object 分两步来实现这样的逻辑，但如此一来无法保证操作的原子性从而导致并发问题。该选项可以用来判断多用户更新同一对象数据时可能引发的冲突。
【query 选项举例】用户的账务账户表 Account 有一个余额字段 balance，同时有多个请求要修改该字段值，为避免余额出现负值，只有满足 balance >= 当前请求的数值 这个条件才允许修改，否则提示「余额不足，操作失败！」。
+

  var Account = AV.Object.extend('Account');
  new AV.Query(Account).first().then(function(account) {
    var amount = -100;
    account.increment('balance', amount);
    return account.save(null, {
      query: new AV.Query(Account).greaterThanOrEqualTo('balance', -amount),
      fetchWhenSave: true,
    });
  }).then(function(account) {
    // 保存成功
    console.log('当前余额为：', account.get('balance'));
  }).catch(function(error) {
    if (error.code === 305) {
    console.log('余额不足，操作失败！');
    }
  });
+
获取对象

每个被成功保存在云端的对象会有一个唯一的 Id 标识 id，因此获取对象的最基本的方法就是根据 id 来查询：
+

  var query = new AV.Query('Todo');
  query.get('57328ca079bc44005c2472d0').then(function (todo) {
    // 成功获得实例
    // todo 就是 id 为 57328ca079bc44005c2472d0 的 Todo 对象实例
  }, function (error) {
    // 异常处理
  });
+
除了使用 AV.Query，还可以采用在本地构建一个 AV.Object 的方式，通过接口和 objectId 把数据从云端拉取到本地：
+

  // 第一个参数是 className，第二个参数是 objectId
  var todo = AV.Object.createWithoutData('Todo', '5745557f71cfe40068c6abe0');
  todo.fetch().then(function () {
    var title = todo.get('title');// 读取 title
    var content = todo.get('content');// 读取 content
  }, function (error) {
    // 异常处理
  });
+
获取 objectId

每一次对象存储成功之后，云端都会返回 id，它是一个全局唯一的属性。
+

  var todo = new Todo();
  todo.set('title', '工程师周会');
  todo.set('content', '每周工程师会议，周一下午2点');
  todo.save().then(function (todo) {
    // 成功保存之后，执行其他逻辑
    // 获取 objectId
    var objectId = todo.id;
  }, function (error) {
    // 异常处理
  });
+
访问对象的属性

访问 Todo 的属性的方式为：
+

  var query = new AV.Query('Todo');
  query.get('558e20cbe4b060308e3eb36c').then(function (todo) {
    // 成功获得实例
    // todo 就是 id 为 558e20cbe4b060308e3eb36c 的 Todo 对象实例
    var priority = todo.get('priority');
    var location = todo.get('location');
    var title = todo.get('title');
    var content = todo.get('content');

    // 获取三个特殊属性
    var objectId = todo.id;
    var updatedAt = todo.updatedAt;
    var createdAt = todo.createdAt;

    //Wed May 11 2016 09:36:32 GMT+0800 (CST)
    console.log(createdAt);
  }, function (error) {
    // 异常处理
    console.error(error);
  });
+
请注意以上代码中访问三个特殊属性 id、createdAt、updatedAt 的方式。
+

如果访问了并不存在的属性，SDK 并不会抛出异常，而是会返回空值。
+

默认属性

默认属性是所有对象都会拥有的属性，它包括 id、createdAt、updatedAt。
+

createdAt
对象第一次保存到云端的时间戳。该时间一旦被云端创建，在之后的操作中就不会被修改。
updatedAt
对象最后一次被修改（或最近一次被更新）的时间。
注：应用控制台对 createdAt 和 updatedAt 做了在展示优化，它们会依据用户操作系统时区而显示为本地时间；客户端 SDK 获取到这些时间后也会将其转换为本地时间；而通过 REST API 获取到的则是原始的 UTC 时间，开发者可能需要根据情况做相应的时区转换。
+

同步对象

多终端共享一个数据时，为了确保当前客户端拿到的对象数据是最新的，可以调用刷新接口来确保本地数据与云端的同步：
+

  // 使用已知 objectId 构建一个 AV.Object
  var todo = new Todo();
  todo.id = '5590cdfde4b00f7adb5860c8';
  todo.fetch().then(function (todo) {
    // // todo 是从服务器加载到本地的 Todo 对象
    var priority = todo.get('priority');
  }, function (error) {

  });
+
在更新对象操作后，对象本地的 updatedAt 字段（最后更新时间）会被刷新，直到下一次 save 或 fetch 操作，updatedAt 的最新值才会被同步到云端，这样做是为了减少网络流量传输。
+

同步指定属性

目前 Todo 这个类已有四个自定义属性：priority、content、location 和 title。为了节省流量，现在只想刷新 priority 和 location 可以使用如下方式：
+

  // 使用已知 objectId 构建一个 AV.Object
  var todo = new Todo();
  todo.id = '5590cdfde4b00f7adb5860c8';
  todo.fetch({
    keys: 'priority,location'
  }).then(function (todo) {
    // 获取到本地
  }, function (error) {
    // 异常处理
    console.error(error);
  });
+
刷新操作会强行使用云端的属性值覆盖本地的属性。因此如果本地有属性修改，刷新操作会丢弃这些修改。
+

更新对象

LeanStorage 上的更新对象都是针对单个对象，云端会根据有没有 objectId 来决定是新增还是更新一个对象。
1

假如 id 已知，则可以通过如下接口从本地构建一个 AV.Object 来更新这个对象：
+

  // 第一个参数是 className，第二个参数是 objectId
  var todo = AV.Object.createWithoutData('Todo', '5745557f71cfe40068c6abe0');
  // 修改属性
  todo.set('content', '每周工程师会议，本周改为周三下午3点半。');
  // 保存到云端
  todo.save();
+
更新操作是覆盖式的，云端会根据最后一次提交到服务器的有效请求来更新数据。更新是字段级别的操作，未更新的字段不会产生变动，这一点请不用担心。
+

使用 CQL 语法更新对象

LeanStorage 提供了类似 SQL 语法中的 Update 方式更新一个对象，例如更新一个 TodoFolder 对象可以使用下面的代码：
+

  // 执行 CQL 语句实现更新一个 TodoFolder 对象
  AV.Query.doCloudQuery('update TodoFolder set name="家庭" where objectId="558e20cbe4b060308e3eb36c"')
  .then(function (data) {
    // data 中的 results 是本次查询返回的结果，AV.Object 实例列表
    var results = data.results;
  }, function (error) {
    // 异常处理
    console.error(error);
  });
0+
更新计数器

这是原子操作（Atomic Operation）的一种。 为了存储一个整型的数据，LeanStorage 提供对任何数字字段进行原子增加（或者减少）的功能。比如一条微博，我们需要记录有多少人喜欢或者转发了它，但可能很多次喜欢都是同时发生的。如果在每个客户端都直接把它们读到的计数值增加之后再写回去，那么极容易引发冲突和覆盖，导致最终结果不准。此时就需要使用这类原子操作来实现计数器。
+

假如，现在增加一个记录查看 Todo 次数的功能，一些与他人共享的 Todo 如果不用原子操作的接口，很有可能会造成统计数据不准确，可以使用如下代码实现这个需求：
+

  var todo = AV.Object.createWithoutData('Todo', '57328ca079bc44005c2472d0');
  todo.set('views', 0);
  todo.save().then(function (todo) {
    todo.increment('views', 1);
    todo.fetchWhenSave(true);
    return todo.save();
  }).then(function (todo) {
    // 使用了 fetchWhenSave 选项，save 成功之后即可得到最新的 views 值
  }, function (error) {
    // 异常处理
  });
+
更新数组

更新数组也是原子操作。使用以下方法可以方便地维护数组类型的数据：
+

AV.Object.add('arrayKey', value)
将指定对象附加到数组末尾。
AV.Object.addUnique('arrayKey', value);
如果数组中不包含指定对象，将该对象加入数组，对象的插入位置是随机的。
AV.Object.remove('arrayKey', value);
从数组字段中删除指定对象的所有实例。
例如，Todo 对象有一个提醒时间 reminders 字段，是一个数组，代表这个日程会在哪些时间点提醒用户。比如有个拖延症患者把闹钟设为早上的 7:10、7:20、7:30：
+

  var reminder1 = new Date('2015-11-11 07:10:00');
  var reminder2 = new Date('2015-11-11 07:20:00');
  var reminder3 = new Date('2015-11-11 07:30:00');

  var reminders = [reminder1, reminder2, reminder3];

  var todo = new AV.Object('Todo');
  // 指定 reminders 是做一个 Date 对象数组
  todo.addUnique('reminders', reminders);
  todo.save().then(function (todo) {
    console.log(todo.id);
  }, function (error) {
    // 异常处理
    console.error(error);
  });
1
删除对象

假如某一个 Todo 完成了，用户想要删除这个 Todo 对象，可以如下操作：
+

  var todo = AV.Object.createWithoutData('Todo', '57328ca079bc44005c2472d0');
  todo.destroy().then(function (success) {
    // 删除成功
  }, function (error) {
    // 删除失败
  });
+
删除对象是一个较为敏感的操作。在控制台创建对象的时候，默认开启了权限保护，关于这部分的内容请阅读《ACL 权限管理指南》。
使用 CQL 语法删除对象

LeanStorage 提供了类似 SQL 语法中的 Delete 方式删除一个对象，例如删除一个 Todo 对象可以使用下面的代码：
+

  // 执行 CQL 语句实现删除一个 Todo 对象
  AV.Query.doCloudQuery('delete from Todo where objectId="558e20cbe4b060308e3eb36c"').then(function () {
    // 删除成功
  }, function (error) {
    // 异常处理
  });
+
批量操作

为了减少网络交互的次数太多带来的时间浪费，你可以在一个请求中对多个对象进行创建、更新、删除、获取。接口都在 AV.Object 这个类下面：
+

  var objects = []; // 构建一个本地的 AV.Object 对象数组

   // 批量创建（更新）
  AV.Object.saveAll(objects).then(function (objects) {
    // 成功
  }, function (error) {
    // 异常处理
  });
  // 批量删除
  AV.Object.destroyAll(objects).then(function () {
    // 成功
  }, function (error) {
    // 异常处理
  });
  // 批量获取
  AV.Object.fetchAll(objects).then(function (objects) {
    // 成功
  }, function (error) {
    // 异常处理
  });
+
批量设置 Todo 已经完成：
+

  var query = new AV.Query('Todo');
  query.find().then(function (todos) {
    todos.forEach(function(todo) {
      todo.set('status', 1);
    });
    return AV.Object.saveAll(todos);
  }).then(function(todos) {
    // 更新成功
  }, function (error) {
    // 异常处理
  });
+
不同类型的批量操作所引发不同数量的 API 调用，具体请参考 API 调用次数的计算。
+

关联数据

AV.Relation

对关联数据进行查询、排序等复杂操作，建议使用 中间表 来构建对象之间的关系。
+
对象可以与其他对象相联系。如前面所述，我们可以把一个 AV.Object 的实例 A，当成另一个 AV.Object 实例 B 的属性值保存起来。这可以解决数据之间一对一或者一对多的关系映射，就像关系型数据库中的主外键关系一样。
+

例如，一个 TodoFolder 包含多个 Todo ，可以用如下代码实现：
1

  var todoFolder = new AV.Object('TodoFolder');
  todoFolder.set('name', '工作');
  todoFolder.set('priority', 1);

  var todo1 = new AV.Object('Todo');
  todo1.set('title', '工程师周会');
  todo1.set('content', '每周工程师会议，周一下午2点');
  todo1.set('location', '会议室');

  var todo2 = new AV.Object('Todo');
  todo2.set('title', '维护文档');
  todo2.set('content', '每天 16：00 到 18：00 定期维护文档');
  todo2.set('location', '当前工位');

  var todo3 = new AV.Object('Todo');
  todo3.set('title', '发布 SDK');
  todo3.set('content', '每周一下午 15：00');
  todo3.set('location', 'SA 工位');

  var todos = [todo1, todo2, todo3];
  AV.Object.saveAll(todos).then(function () {
    var relation = todoFolder.relation('containedTodos'); // 创建 AV.Relation
    todos.map(relation.add.bind(relation));
    return todoFolder.save();// 保存到云端
  }).then(function(todoFolder) {
    // 保存成功
  }, function (error) {
    // 异常处理
  });
+
Pointer

Pointer 只是个描述并没有具象的类与之对应，它与 AV.Relation 不一样的地方在于：AV.Relation 是在一对多的「一」这一方（上述代码中的一指 TodoFolder）保存一个 AV.Relation 属性，这个属性实际上保存的是对被关联数据多的这一方（上述代码中这个多指 Todo）的一个 Pointer 的集合。而反过来，LeanStorage 也支持在「多」的这一方保存一个指向「一」的这一方的 Pointer，这样也可以实现一对多的关系。
+

简单的说， Pointer 就是一个外键的指针，只是在 LeanCloud 控制台做了显示优化。
+

现在有一个新的需求：用户可以分享自己的 TodoFolder 到广场上，而其他用户看见可以给与评论，比如某玩家分享了自己想买的游戏列表（TodoFolder 包含多个游戏名字），而我们用 Comment 对象来保存其他用户的评论以及是否点赞等相关信息，代码如下：
+

  var comment = new AV.Object('Comment');// 构建 Comment 对象
  comment.set('likes', 1);// 如果点了赞就是 1，而点了不喜欢则为 -1，没有做任何操作就是默认的 0
  comment.set('content', '这个太赞了！楼主，我也要这些游戏，咱们团购么？');
  // 假设已知被分享的该 TodoFolder 的 objectId 是 5735aae7c4c9710060fbe8b0
  var targetTodoFolder = AV.Object.createWithoutData('TodoFolder', '5735aae7c4c9710060fbe8b0');
  comment.set('targetTodoFolder', targetTodoFolder);
  comment.save();//保存到云端
+
相关内容可参考 关联数据查询。
+

地理位置

地理位置是一个特殊的数据类型，LeanStorage 封装了 AV.GeoPoint 来实现存储以及相关的查询。
+

首先要创建一个 AV.GeoPoint 对象。例如，创建一个北纬 39.9 度、东经 116.4 度的 AV.GeoPoint 对象（LeanCloud 北京办公室所在地）：
+

  // 第一个参数是： latitude ，纬度
  // 第二个参数是： longitude，经度
  var point = new AV.GeoPoint(39.9, 116.4);

  // 以下是创建 AV.GeoPoint 对象不同的方法
  var point2 = new AV.GeoPoint([12.7, 72.2]);
  var point3 = new AV.GeoPoint({ latitude: 30, longitude: 30 });
+
假如，添加一条 Todo 的时候为该 Todo 添加一个地理位置信息，以表示创建时所在的位置：
+

todo.set('whereCreated', point);
+
同时请参考 地理位置查询。
+

数据协议

很多开发者在使用 LeanStorage 初期都会产生疑惑：客户端的数据类型是如何被云端识别的？ 因此，我们有必要重点介绍一下 LeanStorage 的数据协议。
+

先从一个简单的日期类型入手，比如在 JavaScript 中，默认的日期类型是 Date，下面会详细讲解一个 Date 是如何被云端正确的按照日期格式存储的。
+

为一个普通的 AV.Object 的设置一个 Date 的属性，然后调用保存的接口：
+

  var testDate = new Date('2016-06-04');
  var testAVObject = new AV.Object('TestClass');
  testAVObject.set('testDate', testDate);
  testAVObject.save();
+
JavaScript SDK 在真正调用保存接口之前，会自动的调用一次序列化的方法，将 Date 类型的数据，转化为如下格式的数据：
+

{
  "__type": "Date",
  "iso": "2015-11-21T18:02:52.249Z"
}
+
然后发送给云端，云端会自动进行反序列化，这样自然就知道这个数据类型是日期，然后按照传过来的有效值进行存储。因此，开发者在进阶开发的阶段，最好是能掌握 LeanStorage 的数据协议。如下表介绍的就是一些默认的数据类型被序列化之后的格式：
+

类型	序列化之后的格式
Date	{"__type": "Date","iso": "2015-11-21T18:02:52.249Z"}
Buffer	{"__type": "Bytes","base64":"utf-8-encoded-string}"
Pointer	{"__type":"Pointer","className":"Todo","objectId":"55a39634e4b0ed48f0c1845c"}
AV.Relation	{"__type": "Relation","className": "Todo"}
文件

文件存储也是数据存储的一种方式，图像、音频、视频、通用文件等等都是数据的载体。很多开发者也习惯把复杂对象序列化之后保存成文件，比如 JSON 或 XML 文件。文件存储在 LeanStorage 中被单独封装成一个 AV.File 来实现文件的上传、下载等操作。
+

文件上传

文件上传是指开发者调用接口将文件存储在云端，并且返回文件最终的 URL 的操作。文件上传成功后会在系统表 _File 中生成一条记录，此后该记录无法被再次修改，包括 metaData 字段 中的数据。如果 _File 表打开了 删除权限，该记录才可以被删除。
+

从数据流构建文件

AV.File 支持图片、视频、音乐等常见的文件类型，以及其他任何二进制数据，在构建的时候，传入对应的数据流即可：
+

  var data = { base64: '6K+077yM5L2g5Li65LuA5LmI6KaB56C06Kej5oiR77yf' };
  var file = new AV.File('resume.txt', data);
  file.save();

  var bytes = [0xBE, 0xEF, 0xCA, 0xFE];
  var byteArrayFile = new AV.File('myfile.txt', bytes);
  byteArrayFile.save();
+
上例将文件命名为 resume.txt，这里需要注意两点：
+

不必担心文件名冲突。每一个上传的文件都有惟一的 ID，所以即使上传多个文件名为 resume.txt 的文件也不会有问题。
给文件添加扩展名非常重要。云端通过扩展名来判断文件类型，以便正确处理文件。所以要将一张 PNG 图片存到 AV.File 中，要确保使用 .png 扩展名。
从本地路径构建文件

大多数的客户端应用程序都会跟本地文件系统产生交互，常用的操作就是读取本地文件，如下代码可以实现使用本地文件路径构建一个 AV.File：
+

假设在页面上有如下文件选择框：
+

<input type="file" id="photoFileUpload"/>
+
上传文件对应的代码如下：
+

    var fileUploadControl = $('#photoFileUpload')[0];
    if (fileUploadControl.files.length > 0) {
      var localFile = fileUploadControl.files[0];
      var name = 'avatar.jpg';

      var file = new AV.File(name, localFile);
      file.save().then(function(file) {
        // 文件保存成功
        console.log(file.url());
      }, function(error) {
        // 异常处理
        console.error(error);
      });
    }
+
从网络路径构建文件

从一个已知的 URL 构建文件也是很多应用的需求。例如，从网页上拷贝了一个图像的链接，代码如下：
+

  var file = AV.File.withURL('Satomi_Ishihara.gif', 'http://ww3.sinaimg.cn/bmiddle/596b0666gw1ed70eavm5tg20bq06m7wi.gif');
  file.save().then(function(file) {
    // 文件保存成功
    console.log(file.url());
  }, function(error) {
    // 异常处理
    console.error(error);
  });
+
我们需要做出说明的是，从本地路径构建文件 会产生实际上传的流量，并且文件最后是存在云端，而 从网络路径构建文件 的文件实体并不存储在云端，只是会把文件的物理地址作为一个字符串保存在云端。
+

如果希望在云引擎环境里上传文件，请参考我们的网站托管开发指南。
+

上传进度监听

一般来说，上传文件都会有一个上传进度条显示用以提高用户体验：
+

file.save({
  onprogress:function (e)  {
    console.log(e)
    // { loaded: 1234, total: 2468, percent: 50 }
  },
}).then(/* ... */);

// 2.0 之前版本的 SDK 中，save 的第二个参数 callbacks 不能省略：
file.save({
  onprogress: function(e) { console.log(e); }
}, {}).then(/* ... */);
+
图像缩略图

保存图像时，如果想在下载原图之前先得到缩略图，方法如下：
+

  //获得宽度为100像素，高度200像素的缩略图
  var url = file.thumbnailURL(100, 200);
+
图片最大不超过 20 MB 才可以获取缩略图。
文件元数据

AV.File 的 metaData 属性，可以用来保存和获取该文件对象的元数据信息。metaData 一旦保存到云端就无法再次修改。
+

    // 获取文件大小
    var size = file.size();
    // 上传者(AV.User) 的 objectId，如果未登录，默认为空
    var ownerId = file.ownerId();

    // 获取文件的全部元信息
    var metadata = file.metaData();
    // 设置文件的作者
    file.metaData('author', 'LeanCloud');
    // 获取文件的格式
    var format = file.metaData('format');
+
文件查询

文件的查询依赖于文件在系统中的关系模型，例如，用户的头像，有一些用户习惯直接在 _User 表中直接使用一个 avatar 列，然后里面存放着一个 url 指向一个文件的地址，但是，我们更推荐用户使用 Pointer 来关联一个 AV.User 和 AV.File，代码如下：
+

    var data = { base64: '文件的 base64 编码' };
    var avatar = new AV.File('avatar.png', data);

    var user = new AV.User();
    var randomUsername = 'Tom';
    user.setUsername(randomUsername)
    user.setPassword('leancloud');
    user.set('avatar',avatar);
    user.signUp().then(function (u){
    });
+
删除

当文件较多时，要把一些不需要的文件从云端删除：
+

默认情况下，文件的删除权限是关闭的，需要进入 控制台 > 存储 > _File，选择菜单 其他 > 权限设置 > delete 来开启。
  var file = AV.File.createWithoutData('552e0a27e4b0643b709e891e');
  file.destroy().then(function (success) {
  }, function (error) {
  });
+
查询

AV.Query 是构建针对 AV.Object 查询的基础类。每次查询默认最多返回 100 条符合条件的结果，要更改这一数值，请参考 限定结果返回数量。
+

示例数据结构

熟悉本文所使用的相关数据表结构将有助于更好地理解后面的内容。
+



Todo（待办事项）

字段	类型	说明
content	String	事项的详细内容
images	AVFile	与事项相关的图片
location	String	处理该事项的地点
priority	Number	0 优先级最高，最迫切需要完成。
reminders	Array	设置提醒日期和时间
status	Number	0 未完成，1 已完成
title	String	事项的标题（简短描述）
views	Number	该事项被浏览过的次数
whereCreated	AVGeoPoint	该事项被创建时的地理定位
TodoFolder（待办事项的分组）

字段	类型	说明
containedTodos	Relation	所包含的 Todo，与表 Todo 相关联。
name	String	分组的名称，如家庭、会议。
owner	Pointer	分组的所有者或创建人，指向表 _User
priority	Number	该分组的优先级别，0 优先级最高。
tags	Relation	标签，与表 Tag 相关联。
Comment（待办事项分组的评论）

字段	类型	说明
content	String	评论的内容
likes	Number	点了赞就是 1，点了不喜欢为 -1，没有做任何操作就为 0（默认）。
targetTodoFolder	Pointer	相关联的待办事项分组，指向表 TodoFolder 的 objectId
Tag（待办事项分组的标签）

字段	类型	说明
name	String	标签的名称，如今日必做、老婆吩咐、十分重要等。
targetTodoFolder	Pointer	相关联的待办事项分组，指向表 TodoFolder 的 objectId
创建查询实例

  var query = new AV.Query('Todo');
+
最基础的用法是根据 objectId 来查询对象：
+

  var query = new AV.Query('Todo');
  query.get('57328ca079bc44005c2472d0').then(function (todo) {
    // 成功获得实例
    // todo 就是 id 为 57328ca079bc44005c2472d0 的 Todo 对象实例
  }, function (error) {
    // 异常处理
  });
+
比较查询

逻辑操作	AVQuery 方法
等于	equalTo
不等于	notEqualTo
大于	greaterThan
大于等于	greaterThanOrEqualTo
小于	lessThan
小于等于	lessThanOrEqualTo
利用上述表格介绍的逻辑操作的接口，我们可以很快地构建条件查询。
+

例如，查询优先级小于 2 的所有 Todo ：
+

  var query = new AV.Query('Todo');
  query.lessThan('priority', 2);
+
每次查询默认最多返回 100 条符合条件的结果，要更改这一数值，请参考 限定结果返回数量。
以上逻辑用 SQL 语句表达为 select * from Todo where priority < 2。LeanStorage 也支持使用这种传统的 SQL 语句查询。具体使用方法请移步至 CQL 查询。
+

查询优先级大于等于 2 的 Todo：
+

  query.greaterThanOrEqualTo('priority',2);
+
比较查询只适用于可比较大小的数据类型，如整型、浮点等。
+

多个查询条件

当多个查询条件并存时，它们之间默认为 AND 关系，即查询只返回满足了全部条件的结果。建立 OR 关系则需要使用 组合查询。
+

在简单查询中，如果对一个对象的同一属性设置多个条件，那么先前的条件会被覆盖，查询只返回满足最后一个条件的结果。例如要找出优先级为 0 和 1 的所有 Todo，错误写法是：
+

  var query = new AV.Query('Todo');
  query.equalTo('priority', 0);
  query.equalTo('priority', 1);
  query.find().then(function (results) {
  // 如果这样写，第二个条件将覆盖第一个条件，查询只会返回 priority = 1 的结果
  }, function (error) {
  });
+
正确作法是使用 组合查询 · OR 关系 来构建这种条件。
+

字符串查询

前缀查询类似于 SQL 的 LIKE 'keyword%' 条件。因为支持索引，所以该操作对于大数据集也很高效。
+

  // 找出开头是「早餐」的 Todo
  var query = new AV.Query('Todo');
  query.startsWith('content', '早餐');

  // 找出包含 「bug」 的 Todo
  var query = new AV.Query('Todo');
  query.contains('content', 'bug');
+
包含查询类似于 SQL 的 LIKE '%keyword%' 条件，比如查询标题包含「李总」的 Todo：
+

  query.contains('title','李总');
+
不包含查询可以使用正则匹配查询的方式来实现。例如，查询标题不包含「机票」的 Todo：
+

  var query = new AV.Query('Todo');
  var regExp = new RegExp('^((?!机票).)*$', 'i');
  query.matches('title', regExp);
+
正则匹配查询只适用于字符串类型的数据。
但是基于正则的模糊查询有两个缺点：
+

当数据量逐步增大后，查询效率将越来越低。
没有文本相关性排序
因此我们推荐使用 应用内搜索 功能。它基于搜索引擎技术构建，提供更强大的搜索功能。
+

数组查询

当一个对象有一个属性是数组的时候，针对数组的元数据查询可以有多种方式。例如，在 数组 一节中我们为 Todo 设置了 reminders 属性，它就是一个日期数组，现在我们需要查询所有在 8:30 会响起闹钟的 Todo 对象：
+

  var query = new AV.Query('Todo');
  var reminderFilter = [new Date('2015-11-11 08:30:00')];
  query.containsAll('reminders', reminderFilter);

  // 也可以使用 equals 接口实现这一需求
  var targetDateTime = new Date('2015-11-11 08:30:00');
  query.equalTo('reminders', targetDateTime);
+
查询包含 8:30 和 9:30 这两个时间点响起闹钟的 Todo：
+

  var query = new AV.Query('Todo');
  var reminderFilter = [new Date('2015-11-11 08:30:00'), new Date('2015-11-11 09:30:00')];
  query.containsAll('reminders', reminderFilter);
+
注意这里是包含关系，假如有一个 Todo 会在 8:30、9:30 和 10:30 响起闹钟，它仍然是会被查询出来的。
+

查询「全不包含」的情况：
+

  query.notContainedIn('reminders', reminderFilter);
+
空值查询

假设用户可以有选择地为 Todo 上传图片来做标注，要想找出那些已有图片的 Todo：
+

  var aTodoAttachmentImage = AV.File.withURL('attachment.jpg', 'http://www.zgjm.org/uploads/allimg/150812/1_150812103912_1.jpg');
  var todo = new AV.Object('Todo');
  todo.set('images', aTodoAttachmentImage);
  todo.set('content', '记得买过年回家的火车票！！！');
  todo.save();

  var query = new AV.Query('Todo');
  query.exists('images');
  query.find().then(function (results) {
    // results 返回的就是有图片的 Todo 集合
  }, function (error) {
  });

  // 使用空值查询获取没有图片的 Todo
  query.doesNotExist('images');
+
关系查询

关联数据查询也可以通俗地理解为关系查询，关系查询在传统型数据库的使用中是很常见的需求，因此我们也提供了相关的接口来满足开发者针对关联数据的查询。
+

首先，我们需要明确关系的存储方式，再来确定对应的查询方式。
+

Pointer 查询

基于在 Pointer 小节介绍的存储方式：每一个 Comment 都会有一个 TodoFolder 与之对应，用以表示 Comment 属于哪个 TodoFolder。现在我已知一个 TodoFolder，想查询所有的 Comnent 对象，可以使用如下代码：
2

  var query = new AV.Query('Comment');
  var todoFolder = AV.Object.createWithoutData('TodoFolder', '5735aae7c4c9710060fbe8b0');
  query.equalTo('targetTodoFolder', todoFolder);

  // 想在查询的同时获取关联对象的属性则一定要使用 `include` 接口用来指定返回的 `key`
  query.include('targetTodoFolder');
+
AV.Relation 查询

假如用户可以给 TodoFolder 增加一个 Tag 选项，用以表示它的标签，而为了以后拓展 Tag 的属性，就新建了一个 Tag 对象，如下代码是创建 Tag 对象：
+

  var tag = new AV.Object('Tag');
  tag.set('name', '今日必做');
  tag.save();
+
而 Tag 的意义在于一个 TodoFolder 可以拥有多个 Tag，比如「家庭」（TodoFolder） 拥有的 Tag 可以是：今日必做、老婆吩咐、十分重要。实现创建「家庭」这个 TodoFolder 的代码如下：
+

  var tag1 = new AV.Object('Tag');
  tag1.set('name', '今日必做');

  var tag2 = new AV.Object('Tag');
  tag2.set('name', '老婆吩咐');

  var tag3 = new AV.Object('Tag');
  tag3.set('name', '十分重要');

  var tags = [tag1, tag2, tag3];
  AV.Object.saveAll(tags).then(function (savedTags) {

      var todoFolder = new AV.Object('TodoFolder');
      todoFolder.set('name', '家庭');
      todoFolder.set('priority', 1);

      var relation = todoFolder.relation('tags');
      relation.add(tag1);
      relation.add(tag2);
      relation.add(tag3);

      todoFolder.save();
  }, function (error) {
  });
+
查询一个 TodoFolder 的所有 Tag 的方式如下：
+

  var todoFolder = AV.Object.createWithoutData('TodoFolder', '5735aae7c4c9710060fbe8b0');
  var relation = todoFolder.relation('tags');
  var query = relation.query();
  query.find().then(function (results) {
    // results 是一个 AV.Object 的数组，它包含所有当前 todoFolder 的 tags
  }, function (error) {
  });
1
反过来，现在已知一个 Tag，要查询有多少个 TodoFolder 是拥有这个 Tag 的，可以使用如下代码查询：
+

  var targetTag = AV.Object.createWithoutData('Tag', '5655729900b0bf3785ca8192');
  var query = new AV.Query('TodoFolder');
  query.equalTo('tags', targetTag);
  query.find().then(function (results) {
  // results 是一个 AV.Object 的数组
  // results 指的就是所有包含当前 tag 的 TodoFolder
  }, function (error) {
  });
+
关于关联数据的建模是一个复杂的过程，很多开发者因为在存储方式上的选择失误导致最后构建查询的时候难以下手，不但客户端代码冗余复杂，而且查询效率低，为了解决这个问题，我们专门针对关联数据的建模推出了一个详细的文档予以介绍，详情请阅读《数据模型设计指南》。
+

关联属性查询

正如在 Pointer 中保存 Comment 的 targetTodoFolder 属性一样，假如查询到了一些 Comment 对象，想要一并查询出每一条 Comment 对应的 TodoFolder 对象的时候，可以加上 include 关键字查询条件。同理，假如 TodoFolder 表里还有 pointer 型字段 targetAVUser 时，再加上一个递进的查询条件，形如 include(b.c)，即可一并查询出每一条 TodoFolder 对应的 AVUser 对象。代码如下：
+

  var commentQuery = new AV.Query('Comment');
  commentQuery.descending('createdAt');
  commentQuery.limit(10);
  commentQuery.include('targetTodoFolder');// 关键代码，用 include 告知服务端需要返回的关联属性对应的对象的详细信息，而不仅仅是 objectId
  commentQuery.include('targetTodoFolder.targetAVUser');// 关键代码，同上，会返回 targetAVUser 对应的对象的详细信息，而不仅仅是 objectId
  commentQuery.find().then(function (comments) {
      // comments 是最近的十条评论, 其 targetTodoFolder 字段也有相应数据
      for (var i = 0; i < comments.length; i++) {
          var comment = comments[i];
          // 并不需要网络访问
          var todoFolder = comment.get('targetTodoFolder');
          var avUser = todoFolder.get('targetAVUser');
      }
  }, function (error) {
  });
+
内嵌查询

查询点赞超过 20 次的 TodoFolder 的 Comment 评论（注意查询针对的是 Comment），使用内嵌查询接口就可以通过一次查询来达到目的。
+

  // 构建内嵌查询
  var innerQuery = new AV.Query('TodoFolder');
  innerQuery.greaterThan('likes', 20);

  // 将内嵌查询赋予目标查询
  var query = new AV.Query('Comment');

  // 执行内嵌操作
  query.matchesQuery('targetTodoFolder', innerQuery);
  query.find().then(function (results) {
     // results 就是符合超过 20 个赞的 TodoFolder 这一条件的 Comment 对象集合
  }, function (error) {
  });

  query.doesNotMatchQuery('targetTodoFolder', innerQuery);
  // 如此做将查询出 likes 小于或者等于 20 的 TodoFolder 的 Comment 对象
+
与普通查询一样，内嵌查询默认也最多返回 100 条记录，想修改这一默认请参考 限定结果返回数量。
+

如果所有返回的记录没有匹配到外层的查询条件，那么整个查询也查不到结果。例如：
+

-- 找出积分高于 80、region 为 cn 的玩家记录
SELECT * 
FROM   player 
WHERE  NAME IN (SELECT NAME 
                FROM   gamescore 
                WHERE  score > 80) 
       AND region = 'cn'
+
LeanCloud 云端使用的并非关系型数据库，无法做到真正的联表查询，所以实际的处理方式是：先执行内嵌/子查询（和普通查询一样，limit 默认为 100，最大 1000），然后将子查询的结果填入主查询的对应位置，再执行主查询。
+

如果子查询匹配到了 100 条以上的记录（性别等区分度低的字段重复值往往较多），且主查询有其他查询条件（region = 'cn'），那么可能会出现没有结果或结果不全的情况，其本质上是子查询查出的 100 条记录没有满足主查询的其他条件。
+

我们建议采用以下方案进行改进：
+

确保子查询的结果在 100 条以下，如果在 100 - 1000 条的话请在子查询末尾添加 limit 1000。
将需要查询的字段冗余到主查询所在的表上；例如将 score 冗余到 Player 表上，或者将 region 添加到 GameScore 上然后只查 GameScore 表。
进行多次查询，每次在子查询上添加 skip 来遍历所有记录（注意 skip 的值较大时可能会引发性能问题，因此不是很推荐）。
地理位置查询

地理位置查询是较为特殊的查询，一般来说，常用的业务场景是查询距离 xx 米之内的某个位置或者是某个建筑物，甚至是以手机为圆心，查找方圆多少范围内餐厅等等。LeanStorage 提供了一系列的方法来实现针对地理位置的查询。
+

查询位置附近的对象

Todo 的 whereCreated（创建 Todo 时的位置）是一个 AV.GeoPoint 对象，现在已知了一个地理位置，现在要查询 whereCreated 靠近这个位置的 Todo 对象可以使用如下代码：
+

  var query = new AV.Query('Todo');
  var point = new AV.GeoPoint(39.9, 116.4);
  query.withinKilometers('whereCreated', point, 2.0);
  query.find().then(function (results) {
      var nearbyTodos = results;
  }, function (error) {
  });
+
在上面的代码中，nearbyTodos 返回的是与 point 这一点按距离排序（由近到远）的对象数组。注意：如果在此之后又使用了 ascending 或 descending 方法，则按距离排序会被新排序覆盖。
+

查询指定范围内的对象

要查找指定距离范围内的数据，可使用 whereWithinKilometers 、 whereWithinMiles 或 whereWithinRadians 方法。 例如，我要查询距离指定位置，2 千米范围内的 Todo：
+

  var query = new AV.Query('Todo');
  var point = new AV.GeoPoint(39.9, 116.4);
  query.withinKilometers('whereCreated', point, 2.0);
+
注意事项

使用地理位置需要注意以下方面：
+

每个 AV.Object 数据对象中只能有一个 AV.GeoPoint 对象的属性。
地理位置的点不能超过规定的范围。纬度的范围应该是在 -90.0 到 90.0 之间，经度的范围应该是在 -180.0 到 180.0 之间。如果添加的经纬度超出了以上范围，将导致程序错误。
组合查询

组合查询就是把诸多查询条件合并成一个查询，再交给 SDK 去云端查询。方式有两种：OR 和 AND。
+

OR 查询

OR 操作表示多个查询条件符合其中任意一个即可。 例如，查询优先级是大于等于 3 或者已经完成了的 Todo：
+

  var priorityQuery = new AV.Query('Todo');
  priorityQuery.greaterThanOrEqualTo('priority', 3);

  var statusQuery = new AV.Query('Todo');
  statusQuery.equalTo('status', 1);

  var query = AV.Query.or(priorityQuery, statusQuery);
  // 返回 priority 大于等于 3 或 status 等于 1 的 Todo
+
注意：OR 查询中，子查询中不能包含地理位置相关的查询。
+

AND 查询

AND 操作将满足了所有查询条件的对象返回给客户端。例如，找到创建于 2016-11-13 至 2016-12-02 之间的 Todo：
+

  var startDateQuery = new AV.Query('Todo');
  startDateQuery.greaterThanOrEqualTo('createdAt', new Date('2016-11-13 00:00:00'));

  var endDateQuery = new AV.Query('Todo');
  endDateQuery.lessThan('createdAt', new Date('2016-12-03 00:00:00'));

  var query = AV.Query.and(startDateQuery, endDateQuery);
+
可以对新创建的 AV.Query 添加额外的约束，多个约束将以 AND 运算符来联接。
+

查询结果数量和排序

获取第一条结果

例如很多应用场景下，只要获取满足条件的一个结果即可，例如获取满足条件的第一条 Todo：
+

  var query = new AV.Query('Comment');
  query.equalTo('priority', 0);
  query.first().then(function (data) {
    // data 就是符合条件的第一个 AV.Object
  }, function (error) {
  });
+
限定返回数量

为了防止查询出来的结果过大，云端默认针对查询结果有一个数量限制，即 limit，它的默认值是 100。比如一个查询会得到 10000 个对象，那么一次查询只会返回符合条件的 100 个结果。limit 允许取值范围是 1 ~ 1000。例如设置返回 10 条结果：
+

  var query = new AV.Query('Todo');
  var now = new Date();
  query.lessThanOrEqualTo('createdAt', now);//查询今天之前创建的 Todo
  query.limit(10);// 最多返回 10 条结果
+
跳过数量

设置 skip 这个参数可以告知云端本次查询要跳过多少个结果。将 skip 与 limit 搭配使用可以实现翻页效果，这在客户端做列表展现时，特别是在数据量庞大的情况下适合使用。例如，在翻页中每页显示数量为 10，要获取第 3 页的对象：
+

  var query = new AV.Query('Todo');
  var now = new Date();
  query.lessThanOrEqualTo('createdAt', now);//查询今天之前创建的 Todo
  query.limit(10);// 最多返回 10 条结果
  query.skip(20);// 跳过 20 条结果
+
上述方法的执行效率比较低，因此不建议广泛使用。建议选用 createdAt 或者 updatedAt 这类的时间戳进行分段查询（示例）。
+

返回指定属性/字段

通常列表展现的时候并不是需要展现某一个对象的所有属性，例如，Todo 这个对象列表一般展现的是 title 以及 content，在设置查询时可以告知云端需要返回的属性或字段有哪些，这样既满足需求又节省流量，还可以提高一部分的性能：
+

  var query = new AV.Query('Todo');
  query.select(['title', 'content']);
  query.first().then(function (todo) {
    console.log(todo.get('title')); // √
    console.log(todo.get('content')); // √
    console.log(todo.get('location')); // undefined
  }, function (error) {
    // 异常处理
  });
+
所指定的属性或字段也支持 Pointer 类型。例如，获取 Todo 这个对象的所有者信息（owner 属性，Pointer 类型），仅展示这个所有者的 username：
+

    query.select('owner.username');
+
统计总数量

通常用户在执行完搜索后，结果页面总会显示出诸如「搜索到符合条件的结果有 1020 条」这样的信息。例如，查询一下今天一共完成了多少条 Todo：
+

  var query = new AV.Query('Todo');
  query.equalTo('status', 1);
  query.count().then(function (count) {
      console.log(count);
  }, function (error) {
  });
+
排序

对于数字、字符串、日期类型的数据，可对其进行升序或降序排列。
+

  // 按时间，升序排列
  query.ascending('createdAt');

  // 按时间，降序排列
  query.descending('createdAt');
+
一个查询可以附加多个排序条件，如按 priority 升序、createdAt 降序排列：
+

  var query = new AV.Query('Todo');
  query.addAscending('priority');
  query.addDescending('createdAt');
+
CQL 查询

CQL 是 LeanStorage 独创的使用类似 SQL 语法来实现云端查询功能的语言，具有 SQL 开发经验的开发者可以方便地使用此接口实现查询。
+

分别找出 status = 1 的全部 Todo 结果，以及 priority = 0 的 Todo 的总数：
+

  var cql = 'select * from Todo where status = 1';
  AV.Query.doCloudQuery(cql).then(function (data) {
      // results 即为查询结果，它是一个 AV.Object 数组
      var results = data.results;
  }, function (error) {
  });
  cql = 'select count(*) from %@ where status = 0';
  AV.Query.doCloudQuery(cql).then(function (data) {
      // 获取符合查询的数量
      var count = data.count;
  }, function (error) {
  });
+
通常查询语句会使用变量参数，为此我们提供了与 Java JDBC 所使用的 PreparedStatement 占位符查询相类似的语法结构。
+

查询 status = 0、priority = 1 的 Todo：
+

  // 带有占位符的 cql 语句
  var cql = 'select * from Todo where status = ? and priority = ?';
  var pvalues = [0, 1];
  AV.Query.doCloudQuery(cql, pvalues).then(function (data) {
      // results 即为查询结果，它是一个 AV.Object 数组
      var results = data.results;
  }, function (error) {
  });
+
目前 CQL 已经支持数据的更新 update、插入 insert、删除 delete 等 SQL 语法，更多内容请参考 CQL 详细指南。
+

查询性能优化

影响查询性能的因素很多。特别是当查询结果的数量超过 10 万，查询性能可能会显著下降或出现瓶颈。以下列举一些容易降低性能的查询方式，开发者可以据此进行有针对性的调整和优化，或尽量避免使用。
+

不等于和不包含查询（无法使用索引）
通配符在前面的字符串查询（无法使用索引）
有条件的 count（需要扫描所有数据）
skip 跳过较多的行数（相当于需要先查出被跳过的那些行）
无索引的排序（另外除非复合索引同时覆盖了查询和排序，否则只有其中一个能使用索引）
无索引的查询（另外除非复合索引同时覆盖了所有条件，否则未覆盖到的条件无法使用索引，如果未覆盖的条件区分度较低将会扫描较多的数据）
Promise

每一个在 LeanCloud JavaScript SDK 中的异步方法都会返回一个 Promise，可以通过这个 promise 来处理该异步方法的完成与异常。
+

// 这是一个比较完整的例子，具体方法可以看下面的文档
// 查询某个 AV.Object 实例，之后进行修改
var query = new AV.Query('TestObject');
query.equalTo('name', 'hjiang');
// find 方法是一个异步方法，会返回一个 Promise，之后可以使用 then 方法
query.find().then(function(results) {
  // 返回一个符合条件的 list
  var obj = results[0];
  obj.set('phone', '182xxxx5548');
  // save 方法也是一个异步方法，会返回一个 Promise，所以在此处，你可以直接 return 出去，后续操作就可以支持链式 Promise 调用
  return obj.save();
}).then(function() {
  // 这里是 save 方法返回的 Promise
  console.log('设置手机号码成功');
}).catch(function(error) {
  // catch 方法写在 Promise 链式的最后，可以捕捉到全部 error
  console.error(error);
});
+
then 方法

每一个 Promise 都有一个叫 then 的方法，这个方法接受一对 callback。第一个 callback 在 promise 被解决（resolved，也就是正常运行）的时候调用，第二个会在 promise 被拒绝（rejected，也就是遇到错误）的时候调用。
+

obj.save().then(function(obj) {
  //对象保存成功
}, function(error) {
  //对象保存失败，处理 error
});
+
其中第二个参数是可选的。
+

你还可以使用 catch 三个方法，将逻辑写成：
+

obj.save().then(function(obj) {
  //对象保存成功
}).catch(function(error) {
  //对象保存失败，处理 error
});
+
将 Promise 组织在一起

Promise 比较神奇，可以代替多层嵌套方式来解决发送异步请求代码的调用顺序问题。如果一个 Promise 的回调会返回一个 Promise，那么第二个 then 里的 callback 在第一个 then 的 callback 没有解决前是不会解决的，也就是所谓 Promise Chain。
+

// 将内容按章节顺序添加到页面上
var chapterIds = [
  '584e1c408e450a006c676162', // 第一章
  '584e1c43128fe10058b01cf5', // 第二章
  '581aff915bbb500059ca8d0b'  // 第三章
];

new AV.Query('Chapter').get(chapterIds[0]).then(function(chapter0) {
  // 向页面添加内容
  addHtmlToPage(chapter0.get('content'));
  // 返回新的 Promise
  return new AV.Query('Chapter').get(chapterIds[1]);
}).then(function(chapter1) {
  addHtmlToPage(chapter1.get('content'));
  return new AV.Query('Chapter').get(chapterIds[2]);
}).then(function(chapter2) {
  addHtmlToPage(chapter2.get('content'));
  // 完成
});
+
错误处理

如果任意一个在链中的 Promise 抛出一个异常的话，所有的成功的 callback 在接下 来都会被跳过直到遇到一个处理错误的 callback。
+

通常来说，在正常情况的回调函数链的末尾，加一个错误处理的回调函数，是一种很 常见的做法。
+

利用 try,catch 方法可以将上述代码改写为：
+

new AV.Query('Chapter').get(chapterIds[0]).then(function(chapter0) {
  addHtmlToPage(chapter0.get('content'));

  // 强制失败
  throw new Error('出错啦');

  return new AV.Query('Chapter').get(chapterIds[1]);
}).then(function(chapter1) {
  // 这里的代码将被忽略
  addHtmlToPage(chapter1.get('content'));
  return new AV.Query('Chapter').get(chapterIds[2]);
}).then(function(chapter2) {
  // 这里的代码将被忽略
  addHtmlToPage(chapter2.get('content'));
}).catch(function(error) {
  // 这个错误处理函数将被调用，错误信息是 '出错啦'.
  console.error(error.message);
});
+
JavaScript Promise 迷你书

如果你想更深入地了解和学习 Promise，包括如何对并行的异步操作进行控制，我们推荐阅读 《JavaScript Promise迷你书（中文版）》 这本书。
+

用户

用户系统几乎是每款应用都要加入的功能。除了基本的注册、登录和密码重置，移动端开发还会使用手机号一键登录、短信验证码登录等功能。LeanStorage 提供了一系列接口来帮助开发者快速实现各种场景下的需求。
+

AV.User 是用来描述一个用户的特殊对象，与之相关的数据都保存在 _User 数据表中。
+

用户的属性

默认属性

用户名、密码、邮箱是默认提供的三个属性，访问方式如下：
+

  AV.User.logIn('Tom', 'cat!@#123').then(function (loginedUser) {
    console.log(loginedUser);
    var username = loginedUser.getUsername();
    var email = loginedUser.getEmail();
    // 请注意，密码不会明文存储在云端，因此密码只能重置，不能查看
  }, function (error) {
  });
+
请注意代码中，密码是仅仅是在注册的时候可以设置的属性（这部分代码可参照 用户名和密码注册），它在注册完成之后并不会保存在本地（SDK 不会以明文保存密码这种敏感数据），所以在登录之后，再访问密码这个字段是为空的。
+

自定义属性

用户对象和普通对象一样也支持添加自定义属性。例如，为当前用户添加年龄属性 age：
+

  AV.User.logIn('Tom', 'cat!@#123').then(function (loginedUser) {
    loginedUser.set('age', 25);
    loginedUser.save();
  }, function (error) {
    // 异常处理
    console.error(error);
  });
+
修改属性

很多开发者会有这样的疑问：「为什么我不能修改任意一个用户的属性？」
+

因为很多时候，就算是开发者也不要轻易修改用户的基本信息，例如用户的手机号、社交账号等个人信息都比较敏感，应该由用户在 App 中自行修改。所以为了保证用户的数据仅在用户自己已登录的状态下才能修改，云端对所有针对 AV.User 对象的数据操作都要做验证。
+
例如，先为当前用户增加一个 age 属性，保存后再更改它的值：
+

  AV.User.logIn('Tom', 'cat!@#123').then(function (loginedUser) {
    // 25
    console.log(loginedUser.get('age'));
    loginedUser.set('age', 18);
    return loginedUser.save();
  }).then(function(loginedUser) {
    // 18
    console.log(loginedUser.get('age'));
  }).catch(function(error) {
    // 异常处理
    console.error(error);
  });
+
AV.User 的自定义属性在使用上与 AV.Object 没有本质区别。
+

注册

手机号码登录

一些应用为了提高首次使用的友好度，一般会允许用户浏览一些内容，直到用户发起了一些操作才会要求用户输入一个手机号，而云端会自动发送一条验证码的短信给用户的手机号，最后验证一下，完成一个用户注册并且登录的操作，例如很多团购类应用都有这种用户场景。
2

首先调用发送验证码的接口：
+

  AV.Cloud.requestSmsCode('13577778888').then(function (success) {
  }, function (error) {
  });
+
然后在 UI 上给与用户输入验证码的输入框，用户点击登录的时候调用如下接口：
+

  AV.User.signUpOrlogInWithMobilePhone('13577778888', '123456').then(function (success) {
    // 成功
  }, function (error) {
    // 失败
  });
+
用户名和密码注册

采用「用户名 + 密码」注册时需要注意：密码是以明文方式通过 HTTPS 加密传输给云端，云端会以密文存储密码，并且我们的加密算法是无法通过所谓「彩虹表撞库」获取的，这一点请开发者放心。换言之，用户的密码只可能用户本人知道，开发者不论是通过控制台还是 API 都是无法获取。另外我们需要强调在客户端，应用切勿再次对密码加密，这会导致重置密码等功能失效。
+

例如，注册一个用户的示例代码如下（用户名 Tom 密码 cat!@#123）：
+

  // 新建 AVUser 对象实例
  var user = new AV.User();
  // 设置用户名
  user.setUsername('Tom');
  // 设置密码
  user.setPassword('cat!@#123');
  // 设置邮箱
  user.setEmail('tom@leancloud.cn');
  user.signUp().then(function (loginedUser) {
      console.log(loginedUser);
  }, function (error) {
  });
+
我们建议在可能的情况下尽量使用异步版本的方法，这样就不会影响到应用程序主 UI 线程的响应。
+

如果注册不成功，请检查一下返回的错误对象。最有可能的情况是用户名已经被另一个用户注册，错误代码 202，即 _User 表中的 username 字段已存在相同的值，此时需要提示用户尝试不同的用户名来注册。同样，邮件 email 和手机号码 mobilePhoneNumber 字段也要求在各自的列中不能有重复值出现，否则会出现 203、214 错误。
3

开发者也可以要求用户使用 Email 做为用户名注册，即在用户提交信息后将 _User 表中的 username 和 email 字段都设为相同的值，这样做的好处是用户在忘记密码的情况下可以直接使用「邮箱重置密码」功能，无需再额外绑定电子邮件。
+

关于自定义邮件模板和验证链接，请参考《自定义应用内用户重设密码和邮箱验证页面》。
+

第三方账号登录

为了简化用户注册的繁琐流程，许多应用都在登录界面提供了第三方社交账号登录的按钮选项，例如微信、QQ、微博、Github、豆瓣、Twitter、FaceBook 等，以此来提高用户体验。LeanCloud 封装的 AV.User 对象也支持通过第三方账号的 accessToken 信息来创建一个用户。例如，使用微信授权信息创建 AV.User 的代码如下：
+

  AV.User.signUpOrlogInWithAuthData({
      // 微博（weibo）用 uid
      // 微信（weixin）和 QQ（qq）用 openid
      "openid": "oPrJ7uM5Y5oeypd0fyqQcKCaRv3o",
      "access_token": "OezXcEiiBSKSxW0eoylIeNFI3H7HsmxM7dUj1dGRl2dXJOeIIwD4RTW7Iy2IfJePh6jj7OIs1GwzG1zPn7XY_xYdFYvISeusn4zfU06NiA1_yhzhjc408edspwRpuFSqtYk0rrfJAcZgGBWGRp7wmA",
      "expires_at": "2016-01-06T11:43:11.904Z"
  }, 'weixin').then(function (s) {
  }, function (e) {

  });
+
目前我们仅支持验证以下平台的 access_token 的合法性：
+

微信
QQ
微博
要接入其他平台，开发者需要完成以下步骤：
+

进入 控制台 > 应用设置 > 应用选项 中取消 第三方登录时，验证用户 AccessToken 合法性 的勾选。这样开发者要自行验证 access_token 的合法性。
确保 authData 包含 uid（即将上例代码中的 openid 换为 uid），否则 SDK 会返回「无效的第三方注册数据（authData）」的错误。
以使用 Github 登录为例：
+

  AV.User.signUpOrlogInWithAuthData({
    'uid':          githubClientId,
    'access_token': accessToken
  }, 'github');
+
更多用法请参考 REST API · 连接用户账户和第三方平台。
+

设置手机号码

微信、陌陌等流行应用都会建议用户将账号和一个手机号绑定，这样方便进行身份认证以及日后的密码找回等安全模块的使用。我们也提供了一整套发送短信验证码以及验证手机号的流程，这部分流程以及代码演示请参考 JavaScript 短信服务使用指南。
+

验证邮箱

许多应用会通过验证邮箱来确认用户注册的真实性。如果在 控制台 > 应用设置 > 应用选项 中勾选了 用户注册时，发送验证邮件，那么当一个 AVUser 在注册时设置了邮箱，云端就会向该邮箱自动发送一封包含了激活链接的验证邮件，用户打开该邮件并点击激活链接后便视为通过了验证。有些用户可能在注册之后并没有点击激活链接，而在未来某一个时间又有验证邮箱的需求，这时需要调用如下接口让云端重新发送验证邮件：
+

  AV.User.requestEmailVerify('abc@xyz.com').then(function (result) {
      console.log(JSON.stringify(result));
  }, function (error) {
      console.log(JSON.stringify(error));
  });
+
登录

我们提供了多种登录方式，以满足不同场景的应用。
+

用户名和密码登录

  AV.User.logIn('Tom', 'cat!@#123').then(function (loginedUser) {
    console.log(loginedUser);
  }, function (error) {
  });
1
手机号和密码登录

JavaScript 短信服务使用指南 可以帮助你更好地理解手机号匹配密码登录的流程以及适用范围，所以推荐详细阅读。
+

  AV.User.logInWithMobilePhone('13577778888', 'cat!@#123').then(function (loginedUser) {
      console.log(loginedUser);
  }, (function (error) {
  }));
+
以上的手机号码即使没有经过验证，只要密码正确也可以成功登录。如果希望阻止未验证的手机号码用于登录，则需要在 控制台 > 应用设置 > 应用选项 中勾选 未验证手机号码的用户，禁止登录。这种方式也提高了用户账号的合法性与安全性。
+

手机号和验证码登录

首先，调用发送登录验证码的接口：
+

AV.User.requestLoginSmsCode('13577778888').then(function (success) {
  }, function (error) {
  });
+
然后在界面上引导用户输入收到的 6 位短信验证码：
+

  AV.User.logInWithMobilePhoneSmsCode('13577778888', '238825').then(function (success) {
  }, function (error) {
  });
+
测试用的手机号和固定验证码

对于使用「手机号 + 验证码」登录的应用来说，在上架前提交至 Apple Store 进行审核的过程中，可能会面临 Apple 人员因没有有效的手机号码而无法登录来进行评估审核，或者开发者也无法提供固定手机号和验证码的尴尬情况。
+

另外，开发者在开发测试过程中也会面临在短时间内需要多次登录或注销的操作，由于验证码有时间间隔与总次数限制，这样就会带来种种不便。
+

为解决这些问题，我们允许为每个应用设置一个用于测试目的的手机号码，LeanCloud 平台会为它生成一个固定的验证码，每次使用这一对号码组合进行验证都会得到成功的结果。
+

进入 应用控制台 > 消息 > 短信 > 设置 > 其他 来设置 测试手机号。
+

当前用户

打开微博或者微信，它不会每次都要求用户都登录，这是因为它将用户数据缓存在了客户端。 同样，只要是调用了登录相关的接口，LeanCloud SDK 都会自动缓存登录用户的数据。 例如，判断当前用户是否为空，为空就跳转到登录页面让用户登录，如果不为空就跳转到首页：
+

  var currentUser = AV.User.current();
  if (currentUser) {
     // 跳转到首页
  }
  else {
     //currentUser 为空时，可打开用户注册界面…
  }
+
如果不调用 登出 方法，当前用户的缓存将永久保存在客户端。
+

SessionToken

所有登录接口调用成功之后，云端会返回一个 SessionToken 给客户端，客户端在发送 HTTP 请求的时候，JavaScript SDK 会在 HTTP 请求的 Header 里面自动添加上当前用户的 SessionToken 作为这次请求发起者 AV.User 的身份认证信息。
+

如果在 控制台 > 应用设置 > 应用选项 中勾选了 密码修改后，强制客户端重新登录，那么当用户密码再次被修改后，已登录的用户对象就会失效，开发者需要使用更改后的密码重新调用登录接口，使 SessionToken 得到更新，否则后续操作会遇到 403 (Forbidden) 的错误。
+

验证 SessionToken 是否在有效期内

    var currentUser = AV.User.current();
    currentUser.isAuthenticated().then(function(authenticated){
       // console.log(authenticated); 根据需求进行后续的操作
    });
+
账户锁定

输入错误的密码或验证码会导致用户登录失败。如果在 15 分钟内，同一个用户登录失败的次数大于 6 次，该用户账户即被云端暂时锁定，此时云端会返回错误码 {"code":1,"error":"登录失败次数超过限制，请稍候再试，或者通过忘记密码重设密码。"}，开发者可在客户端进行必要提示。
+

锁定将在最后一次错误登录的 15 分钟之后由云端自动解除，开发者无法通过 SDK 或 REST API 进行干预。在锁定期间，即使用户输入了正确的验证信息也不允许登录。这个限制在 SDK 和云引擎中都有效。
+

重置密码

邮箱重置密码

我们都知道，应用一旦加入账户密码系统，那么肯定会有用户忘记密码的情况发生。对于这种情况，我们为用户提供了一种安全重置密码的方法。
+

重置密码的过程很简单，用户只需要输入注册的电子邮件地址即可：
+

  AV.User.requestPasswordReset('myemail@example.com').then(function (success) {
  }, function (error) {
  });
+
密码重置流程如下：
+

用户输入注册的电子邮件，请求重置密码；
LeanStorage 向该邮箱发送一封包含重置密码的特殊链接的电子邮件；
用户点击重置密码链接后，一个特殊的页面会打开，让他们输入新密码；
用户的密码已被重置为新输入的密码。
关于自定义邮件模板和验证链接，请参考《自定义应用内用户重设密码和邮箱验证页面》。
+

手机号码重置密码

与使用 邮箱重置密码 类似，「手机号码重置密码」使用下面的方法来获取短信验证码：
+

  AV.User.requestPasswordResetBySmsCode('18612340000').then(function (success) {
  }, function (error) {
  });
+
注意！用户需要先绑定手机号码，然后使用短信验证码来重置密码：
+

  AV.User.resetPasswordBySmsCode('123456', 'thenewpassword').then(function (success) {
  }, function (error) {
  });
+
登出

用户登出系统时，SDK 会自动清理缓存信息。
+

  AV.User.logOut();
  // 现在的 currentUser 是 null 了
  var currentUser = AV.User.current();
+
用户的查询

为了安全起见，新创建的应用的 _User 表默认关闭了 find 权限，这样每位用户登录后只能查询到自己在 _User 表中的数据，无法查询其他用户的数据。如果需要让其查询其他用户的数据，建议单独创建一张表来保存这类数据，并开放这张表的 find 查询权限。
+

设置数据表权限的方法，请参考 数据与安全 · Class 级别的权限。我们推荐开发者在 云引擎 中封装用户查询，只查询特定条件的用户，避免开放 _User 表的全部查询权限。
+

查询用户代码如下：
+

  var query = new AV.Query('_User');
+
浏览器中查看用户表

用户表是一个特殊的表，专门存储用户对象。在浏览器端，你会看到一个 _User 表。
+

角色

关于用户与角色的关系，我们有一个更为详尽的文档介绍这部分的内容，并且针对权限管理有深入的讲解，详情请阅读《ACL 权限管理指南》。
+

应用内搜索

应用内搜索是一个针对应用数据进行全局搜索的接口，它基于搜索引擎构建，提供更强大的搜索功能。要深入了解其用法和阅读示例代码，请阅读 JavaScript 应用内搜索指南。
+

应用内社交

应用内社交，又称「事件流」，在应用开发中出现的场景非常多，包括用户间关注（好友）、朋友圈（时间线）、状态、互动（点赞）、私信等常用功能，请参考 JavaScript 应用内社交模块。
+

Push 通知

通过 JavaScript SDK 也可以向移动设备推送消息。
+

一个简单例子推送给所有订阅了 public 频道的设备：
+

AV.Push.send({
  channels: [ 'public' ],
  data: {
    alert: 'public message'
  }
});
+
这就向订阅了 public 频道的设备发送了一条内容为 public message 的消息。
+

如果希望按照某个 _Installation 表的查询条件来推送，例如推送给某个 installationId 的 Android 设备，可以传入一个 AV.Query 对象作为 where 条件：
+

var query = new AV.Query('_Installation');
query.equalTo('installationId', installationId);
AV.Push.send({
  where: query,
  data: {
    alert: 'Public message'
  }
});
+
此外，如果你觉得 AV.Query 太繁琐，也可以写一句 CQL 来搞定：
+

AV.Push.send({
  cql: 'select * from _Installation where installationId="设备id"',
  data: {
    alert: 'Public message'
  }
});
+
AV.Push 的更多使用信息参考 API 文档 AV.Push。更多推送的查询条件和格式，请查阅 消息推送指南。
+

iOS 设备可以通过 prod 属性指定使用测试环境还是生产环境证书：
+

AV.Push.send({
  prod: 'dev',
  data: {
    alert: 'public message'
  }
});
+
dev 表示开发证书，prod 表示生产证书，默认生产证书。
+

WebView 中使用

JS SDK 支持在各种 WebView 中使用（包括 PhoneGap/Cordova、微信 WebView 等）。
+

Android WebView 中使用

如果是 Android WebView，在 Native 代码创建 WebView 的时候你需要打开几个选项， 这些选项生成 WebView 的时候默认并不会被打开，需要配置：
+

因为我们 JS SDK 目前使用了 window.localStorage，所以你需要开启 WebView 的 localStorage：
+

yourWebView.getSettings().setDomStorageEnabled(true);
+
如果你希望直接调试手机中的 WebView，也同样需要在生成 WebView 的时候设置远程调试，具体使用方式请参考 Google 官方文档。
+

if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.KITKAT) {
   yourWebView.setWebContentsDebuggingEnabled(true);
}
+
注意：这种调试方式仅支持 Android 4.4 已上版本（含 4.4）
+

如果你是通过 WebView 来开发界面，Native 调用本地特性的 Hybrid 方式开发你的 App。比较推荐的开发方式是：通过 Chrome 的开发者工具开发界面部分，当界面部分完成，与 Native 再来做数据连调，这种时候才需要用 Remote debugger 方式在手机上直接调试 WebView。这样做会大大节省你开发调试的时间，不然如果界面都通过 Remote debugger 方式开发，可能效率较低。
为了防止通过 JavaScript 反射调用 Java 代码访问 Android 文件系统的安全漏洞，在 Android 4.2 以后的系统中间，WebView 中间只能访问通过 @JavascriptInterface 标记过的方法。如果你的目标用户覆盖 4.2 以上的机型，请注意加上这个标记，以避免出现 Uncaught TypeError。
· 价格 · 下载 · 常见问题 · 技术支持 · 健康状态 · 社区 · Blog · 文档源码 