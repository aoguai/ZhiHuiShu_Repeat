// ==UserScript==
// @name         aoguai-智慧树（知到）习惯分平时分问答垃圾话生成器
// @namespace    http://tampermonkey.net/
// @version      1.1.0
// @description  智慧树（知到）习惯分平时分问答复读
// @author       aoguai
// @require      https://unpkg.com/axios/dist/axios.min.js
// @match        https://qah5.zhihuishu.com/qa.html
// @license      MIT
// ==/UserScript==

//下方数值根据提示进行修改
var publish_p = 1, //进入问答后是否，自动点击发表。可改为1或0。1为自动点击发表，0为手动点击发表。默认为0
    nonsence_p=0, //进入问答后自动输入时，是否需要中立回答。可改为1或0。1为是，0为否。默认为0
    close_p=1,//进入问答发表后是否自动关闭问答。（需要配合publish_p实现，仅publish_p开启时有效）可改为1或0。1为是，0为否。默认为0
    refresh_p=1;//每当点击一个问答后是否自动刷新。可改为1或0。1为是，0为否。默认为0

(function() {
  const e = document.createEvent("MouseEvents");
  e.initEvent("click", true, true);
  const input = document.createEvent("HTMLEvents");
  input.initEvent("input", true, false);
  const state = (document.URL.includes('home'))?'home':'detail'
  const MY_ANSWER_API = "https://creditqa.zhihuishu.com/creditqa/web/qa/myAnswerList"
  const HOT_QUESTION = "https://creditqa.zhihuishu.com/creditqa/web/qa/getHotQuestionList"
  const NEW_QUESTION = "https://creditqa.zhihuishu.com/creditqa/web/qa/getRecommendList"
  const config = {
    offset: 0,
    currURL: HOT_QUESTION
  }
  const CASLOGC = document.cookie.split(';')
    .filter(item => item.includes('CASLOGC'))
    .toString().trim()
    .replace(/\"/g, "'").split('=')[1]
  const uuid = JSON.parse(decodeURIComponent(CASLOGC)).uuid
  let reqCount = 0
  let params = {
    uuid: uuid, dateFormate: new Date() * 1,
    pageIndex: 0, pageSize: 50
  }
  params.recruitId = document.URL.split('?')[1].split('&')
    .filter( item => item.includes('recruitId'))[0].split('=')[1]
  params.courseId = document.URL.split('/')[6].split('?')[0]

  function Grama(mode) { //垃圾话生成函数
    const question = document.querySelector('.answer-content').children[0].innerText
    const ans = question.replace(/\?|。|！|!|？|\.|{是|对}{吗|嘛|么}|什么|/g, "").replace(/嘛|吗|么/g, '')
      .replace(/是{否|不是}/g, '是').replace(/你们|你/g, '我').replace(/有没有/, '有').replace(/能不能/,'能')
      .replace(/[\(|（][\u4E00-\u9FA5A-Za-z0-9_]+[\)|）]/g, '') //获取首条回答
    const answer = {
      positive: [
        `你好，我认为是：${ans}`,
        `${ans}`,
      ],
      negative: [
        `${ans}`
      ],
      nonsence: [
        `我们需要辩证看待，有些是好的，有些是不好的`,
        `这不是绝对的，我们要理性看待`,
        `没有绝对是好的，还是坏的`
      ]
    }
    let arr = Object.values(answer).flat()
    if(nonsence_p==0){
        const num = randomNum(0,1);
        console.log(num)
        if(num==0){
            if (Object.keys(answer).includes("positive")) arr = answer["positive"]
            return arr[ parseInt(Math.random() * 100) % arr.length]
        }else{
            if (Object.keys(answer).includes("negative")) arr = answer["negative"]
            return arr[ parseInt(Math.random() * 100) % arr.length]
        }
    }else{
        if (Object.keys(answer).includes(mode)) arr = answer[mode]
        return arr[ parseInt(Math.random() * 100) % arr.length]
    }
  }


  function Render() {
    return `<div class=wheel-pannel><button class="wheel-button wheel-positive">是的</button><button class="wheel-button wheel-negative">不是</button><button class="wheel-button wheel-nonsence">中立</button></div><style>.wheel-pannel{position:fixed;right:300px;top:120px;width:80px;height:30px;z-index:3000}.wheel-button{margin:5px 0;padding:0 5px;height:30px;width:80px;border:0;outline:0;border-radius:8px;color:#f0f8ff;font-size:16px;letter-spacing:1px}.wheel-positive{background:#7fd826}.wheel-negative{background:#d82626}.wheel-positive:hover{background:#99e051}.wheel-negative:hover{background:#e05151}.wheel-nonsence{background:black}.wheel-nonsence:hover{background:#333333}</style>`
  }

  function binding() {
    const panel = document.querySelector('.wheel-pannel')
    if (!panel) console.log('not panel')
    document.querySelector('.wheel-pannel').addEventListener('click', (e) => {
      const text = document.querySelector('textarea')
      const mode = e.target.classList[1].split('wheel-')[1]
      text.innerText = Grama(mode)
      text.dispatchEvent(input)
      publish()
    })
    document.querySelector('.up-btn').addEventListener('click', () => {
      const questionId = location.hash.split('/')[4].split('?')[0]
      let answered = getMyAnswer()
      answered.push(questionId)
      localStorage.setItem('answered', JSON.stringify(answered))
    })
  }

  function bindingHome() {
    let list = document.querySelector('.el-scrollbar__view').children[0]
    document.querySelector('.tab-container').addEventListener('click', (e) => {
      let text = e.target.innerText
      if (text == "热门") config.currURL = HOT_QUESTION
      if (text == "最新") config.currURL = NEW_QUESTION
      if (text == "热门" || text == "最新") diffImprove(config.currURL)
    })
    let observer = new MutationObserver( mutations => {
      mutations.forEach( mutation => {
        if (mutation.type === 'childList') {
          reqCount++;
          if (reqCount == 50 && list.children.length !== 51) {
            diffImprove(config.currURL)
          }
        }
      })
    })
    observer.observe(list, {
      attributes:false,
      childList: true,
      subtree:false,
    })
  }

  function publish() { //自动点击发表函数
      if(publish_p == 0) return
      const btn = document.querySelector('div.up-btn.set-btn')
      if (btn == null) return
      btn.click()
      //是否自动关闭当前页面
      if(close_p == 1){
          sleep(1000); // 延时函数，单位ms
          if (navigator.userAgent.indexOf('MSIE') > 0) { // close IE
              if (navigator.userAgent.indexOf('MSIE 6.0') > 0) {
                  window.opener = null;
                  window.close();
              } else {
                  window.open('', '_top');
                  window.top.close();
              }
          } else { // close chrome;It is effective when it is only one.
              window.opener = null;
              window.open('', '_self');
              window.close();
          }
      }
  }

    var sleep = function(time) {
        var startTime = new Date().getTime() + parseInt(time, 10);
        while(new Date().getTime() < startTime) {}
    };

    //生成从minNum到maxNum的随机数
    function randomNum(minNum,maxNum){
        switch(arguments.length){
            case 1:
                return parseInt(Math.random()*minNum+1,10);
                break;
            case 2:
                return parseInt(Math.random()*(maxNum-minNum+1)+minNum,10);
                break;
            default:
                return 0;
                break;
        }
    }

    async function getMyAnswer() {
    const courseId = document.URL.split('/')[6].split('?')[0]
    let answered = JSON.parse(localStorage.getItem('answered')) || {}
    let currentCourse = answered[courseId] || null
    let lastModified = JSON.parse(localStorage.getItem('lastModified')) || new Date() * 1
    let current = new Date() * 1
    if (currentCourse == null || current - lastModified > 600*1000) {
      const data = Object.assign(params)
      data.pageSize = 200
      await axios.get(MY_ANSWER_API, {params:data}).then( res => {
        currentCourse = res.data.rt.myAnswers.map(item => item.qid)
        console.log(currentCourse)
        answered[courseId] = currentCourse
        console.log(currentCourse);
        localStorage.setItem('answered', JSON.stringify(answered))
        localStorage.setItem('lastModified', JSON.stringify(new Date()*1))
      })
    }
    return answered[courseId]
  }

  async function diffImprove(url=HOT_QUESTION, offset=0) {
    if (url.includes('home')) return
    let myAnswer, pageAnswer, arr, ans
    //params and offset
    const data = Object.assign(params)
    data.pageIndex = config.offset
    config.offset = data.pageIndex + offset
    // get data
    myAnswer = await getMyAnswer()
    await axios.get(url, {params: data}).then( res => {
      pageAnswer = res.data.rt.questionInfoList
      arr = pageAnswer.map(item => item.questionId)
        .filter(item => myAnswer.includes(item))//获取问答编号
      ans = pageAnswer.filter( item => arr.includes(item.questionId))
        .map(item => `${item.userDto.username}${item.content}`)
      patchImprove(ans)
    })
  }
  async function patchImprove(res) {
    // iterate dom list and add marks
    const list = Array.from(document.querySelectorAll('.question-item'))
    list.forEach( item => {
      const flag = item.querySelector('.user-name').title + item.querySelector('.question-content').title
      if (res.includes(flag)) {
        const child = item.querySelector(".question-content")
        child.innerText += "(已作答)"
        child.style.color = 'red'
        reqCount = 0
        document.querySelector('.el-scrollbar__wrap').scrollTop +=150 //一个问答高度150
      }
    })
  }

    document.body.onclick=function(){//是否刷新函数
        if(refresh_p == 1){
            const list = Array.from(document.querySelectorAll('.question-item'))
            if(list != null){
                list.forEach( item => {
                    if (item.style.color != 'red') {
                        location.reload(true);
                    }
                })
            }
        }
    }

  window.onload = () => {
    if (state == 'home') setTimeout(home, 1000)
    else setTimeout(detail, 1000)

    async function detail() {
      const btn = document.querySelector('.my-answer-btn')
      if (btn == null) return
      btn.dispatchEvent(e)
      setTimeout(() => {
        const text = document.querySelector('textarea')
        const dialog = document.querySelector('.header-title')
        if (!text) return
        text.innerText = Grama("default")
        text.dispatchEvent(input)
        dialog.innerHTML += Render()
        binding()
      }, 200)
      setTimeout(function () {
            publish()
      }, 1000);
    }
    async function home() {
      bindingHome()
      diffImprove()
    }
  }
})();
