## 我的第二个React App
在第一个[React APP](https://github.com/limianhust/React1) 基础上增加用户注册登录和网络数据库存储功能，使用leancloud服务。<br>
演示链接：[todoList APP](https://limianhust.github.io/React2/build/index)

**5月20日进展** <br>
完成登陆框结构，样式和除了和后台交互外的功能。<br>

**5月22日进展** <br>
1. 完成注册功能，注册成功后移除注册登陆框，title显示登录成功后名字。

2. 完成用户名注册验证功能，注册已有的用户名会提示用户该用户名已经注册。

3. 完成用户登陆功能。完成密码验证功能，密码不正确会提示用户输入正确的密码。用户名不存在会提示用户找不到用户名。密码为空提示用户密码为空，请输入密码。

4.  登陆成功后，用户的缓存将保存在客户端和记录的todoList数据上传到云端存储功能未完待续...

**5月24日进展** <br>
1. 增加邮箱找回密码功能
2. 代码重构：将邮箱重置密码抽离出无状态组件，通过props传入参数控制组件的view，这样将所有业务逻辑集中到父组件处理，子组件专注于视图展现。已重构登陆框，注册框，登陆注册框，邮箱找回密码组件。登陆成功后，用户的缓存将保存在客户端和记录的todoList数据上传到云端存储功能仍然未完待续...
