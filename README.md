# ZhiHuiShu-Repeat
半自动回答习惯分平时分问题(改)

<h2>感谢</h2>
<div>本插件参考了以下作者的插件，特此标明来源<br>
<blockquote>https://greasyfork.org/zh-CN/scripts/426715-whee1-%E6%99%BA%E6%85%A7%E6%A0%91-%E7%9F%A5%E5%88%B0-%E4%B9%A0%E6%83%AF%E5%88%86%E9%97%AE%E7%AD%94%E5%9E%83%E5%9C%BE%E8%AF%9D%E7%94%9F%E6%88%90%E5%99%A8</blockquote>
<h2>简介</h2>
<blockquote>原作者退坑，我来补上 —2022/1/3</blockquote>
<h3>greasyfork链接</h3>
<blockquote>https://greasyfork.org/zh-CN/scripts/437990-aoguai-%E6%99%BA%E6%85%A7%E6%A0%91-%E7%9F%A5%E5%88%B0-%E4%B9%A0%E6%83%AF%E5%88%86%E5%B9%B3%E6%97%B6%E5%88%86%E9%97%AE%E7%AD%94%E5%9E%83%E5%9C%BE%E8%AF%9D%E7%94%9F%E6%88%90%E5%99%A8</blockquote>
用来刷智慧树(知到)习惯分平时分里问答互动分，不能全自动答题，需要人工点击部分按钮。<br>
会自动复读问答里面第一条回复的内容。<br>
主要避免回答问题多打字，而且避免简单回答 是 或 否 造成无效回答。<br>
建议和其他脚本配合使用，这个脚本初衷是为了弥补其他脚本不能刷习惯分。<br>
注意：有些网课是不需要刷习惯分的，使用前可以看一下是否存在习惯分。<br>
为了各位的账号安全，防止自动回答出现不可预测的问题，不提供全自动回答问题功能<br>
<h2>用法</h2>
首先进入代码编辑设置一下相关选项：
<pre>//下方数值根据提示进行修改
var publish_p = 0, //是否自动点击发表，可改为1或0。1为自动点击发表，0为手动点击发表。默认为0
    nonsence_p=0; //进入自动输入是否需要中立回答，可改为1或0。1为是，0为否。默认为0</pre>

然后进入某课程问答首页
<ul>
  <li>手动进入问答详情</li>
  <li>根据问题情况选择可选答案</li>
  <li>点击发送</li>
  <li>重复上述操作</li>
</ul>
<h2>特性</h2>
<ul>
  <li>自动打开答案窗口并填充答案，可以根据题目选择不同种类回答</li>
  <li>回答过的问题会在问答首页标记出来</li>
</ul>
<h2>注意</h2>
该脚本会使用您在智慧树的cookie，仅用于请求智慧树的API，不会上传您的信息到任何服务器

<h2>已知BUG</h2>
问答详情里的关闭按钮没法点击（不影响使用，暂无修复打算）

<h2>BUG反馈</h2>
没有联系方式，佛系修BUG，可以在该脚本的反馈下面留言<br>
如需引用代码，无需授权，但希望能在您的项目中标明来源<br><br>
<img src="https://github.com/aoguai/ZhiHuiShu-Repeat/blob/main/images/demonstration.png"  alt="demonstration_image" />
