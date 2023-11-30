// ==UserScript==
// @name         Microsoft(Bing) Rewards Script
// @namespace    roy
// @version      0.2.0
// @description  自动获得微软(Microsoft Rewards)/必应奖励(Bing Rewards)。通过设置搜索次数，🤖自动搜索获取积分。支持获得✔电脑搜索🏆、✔移动端搜索🏅、✔Microsoft Edge 奖励✌三种奖励
// @author       roy
// @match        https://www.bing.com/*
// @match        https://cn.bing.com/*
// @icon         https://az15297.vo.msecnd.net/images/rewards/membercenter/missions/Animated-Icons/bing_icon.svg
// @grant        none
// @license      MIT
// ==/UserScript==

// 此脚本的原始作者是 https://greasyfork.org/zh-CN/scripts/466396-microsoft-bing-rewards-script/code by 3hex
// 由于在某一时刻突然无法使用，作者似乎没有继续维护，便补充了一些代码使之更容易使用

// 生成32位包含大写字母与数字的字符串当作CVID
function generateRandomString(length) {
    const lettersAndDigits = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += lettersAndDigits.charAt(Math.floor(Math.random() * lettersAndDigits.length));
    }
    return result;
}

(function () {
    'use strict';

    var currentURL = window.location.href;
    var domain = new URL(currentURL).hostname;

    function getMobileViewport(width, height) {
        return {
            width: width,
            height: height,
            deviceScaleFactor: 1,
            mobile: true
        };
    }

    var num = 0;
    var mode = 0 // 0:PC 1:mobile

    // 以下为设置 Bing 图标
    const div = document.createElement('div');
    const img = document.createElement('img');
    const span = document.createElement('span')

    div.appendChild(img);
    div.appendChild(span);

    img.src = 'https://az15297.vo.msecnd.net/images/rewards/membercenter/missions/Animated-Icons/bing_icon.svg'; // 设置 img 的 src 属性

    img.id = "mrs_img_auto";
    div.style.position = 'fixed'; // 设置定位方式为固定定位
    div.style.top = '15%'; // 设置 img 的上边缘距离屏幕顶部的距离为 0
    div.style.left = '3%'; // 设置 img 的左边缘距离屏幕左侧的距离为 0

    span.textContent = "0";
    span.style.color = "red";
    span.style.fontWeight = 'bold';
    span.style.display = 'flex';
    span.style.alignItems = 'center';
    span.style.justifyContent = 'center';

    num = parseInt(localStorage.getItem('mrs_count_num'), 10);
    mode = parseInt(localStorage.getItem('mrs_count_mode'), 10);

    // 生成一些有意义的搜索关键词，避免被风控
    const searchTerms = [
        "游戏", "编程", "动漫", "射击游戏", "网游", "社交软件", "搜索引擎",
        "论坛", "美食", "宠物", "工作", "编程", "视频网站", "短视频", "英雄",
        "搜索引擎", "文学", "角色", "食物", "学习", "购物", "新闻", "音乐",
        "电影", "股票", "旅游", "体育", "健身", "时尚", "汽车", "科技",
        "健康", "房地产", "家具", "饮食", "美容", "婚恋", "育儿", "电子产品",
        "手机", "数码", "电脑", "办公", "家电", "摄影", "导航", "邮箱", "地图",
        "翻译", "天气", "购物", "图书", "校园", "问答", "职业", "视觉", "设计",
        "棋牌", "经营", "安全", "网络", "效率", "日常", "社会", "法律", "投资",
        "理财", "医疗", "心理", "辅导", "装修", "手工", "烘焙", "园艺", "运动",
        "旅行", "摄影", "美食", "宠物", "电影", "绘画", "手账", "收集", "诗歌", "写作",
        "吉他", "钢琴", "唱歌", "舞蹈", "机器人",
        "物理", "化学", "生物", "数学", "考古", "历史", "哲学", "心理学", "社会学", "经济学",
        "机械", "土木", "建筑", "电子", "通信", "计算机", "环境", "能源", "交通",
        "创业", "投资", "财务", "银行", "证券", "保险", "市场", "销售", "人力", "运营",
        "品牌", "传媒", "设计", "艺术", "策划", "整形", "影视", "广告", "公关", "法律",
        "医学", "护理", "药学", "中医", "瑜伽", "跑步", "骑行", "游泳", "攀岩",
        "电竞", "棋牌", "桌游", "卡牌", "探险", " Safari", "旅游", "摄影", "美食",
        "动漫", "游戏", "电影", "电视剧", "小说", "音乐", "舞蹈", "手工", "美妆",
        "服装", "宠物", "汽车", "科技", "体育", "健身", "家居", "育儿", "教育",
        "职业", "金融", "环保", "公益", "政治", "军事", "历史", "哲学", "宗教",
        "心理"
    ];

    const combinedTerms = [];

    const term1 = searchTerms[Math.floor(Math.random() * searchTerms.length)];
    const term2 = searchTerms[Math.floor(Math.random() * searchTerms.length)];

    if (term1 !== term2) {
        combinedTerms.push(term1 + term2);
    }

    // 拼接在搜索关键词后的URL参数
    const uniString = "&qs=FT&pq=2&sk=FT2&sc=10-1&cvid="+generateRandomString(32)+"&FORM=QBRE&sp=3&ghc=1&lq=0";

    if (!isNaN(num) && num != 0) {
        span.textContent = "" + num;
        console.log("[info] count:" + num);
        num = num - 1;
        localStorage.setItem('mrs_count_num', num);

        const url = "https://" + domain + "/search?q=" + combinedTerms[0] + uniString; // 目标网页的地址
        // 暂停x秒后继续执行
        setTimeout(() => {
            window.open(url, "_self"); // 在当前页面中打开目标网页
        }, 10000);
    }

    div.addEventListener('click', function () { // 添加点击事件监听器
        const n = window.prompt('Please enter a number（Number of searches）:');
        num = parseInt(n, 10);
        if (!isNaN(num) && num != 0) {
            span.textContent = "" + num;
            console.log("[info] first count:" + num);
            num = num - 1;

            localStorage.setItem('mrs_count_num', num);

            const url = "https://" + domain + "/search?q=" + combinedTerms[0] + uniString; // 目标网页的地址
            // 暂停x秒后继续执行
            setTimeout(() => {
                window.open(url, "_self"); // 在当前页面中打开目标网页
            }, 10000);
        } else {
            console.log("[info] cancel");
        }
    });
    document.getElementById('b_content').appendChild(div);

    // 监听键盘按键事件,可以暂停搜索，没测试过可用性
    document.addEventListener('keydown', function (event) {
        if (event.ctrlKey && event.altKey && event.key === 'l') {
            if (confirm("Whether you want to stop automatic search? ")) {
                console.log("[info] stop");
                num = 0;
                localStorage.setItem('mrs_count_num', 0);;
            } else {
                console.log("[info] continue :) ");
            }
        }
    });

})();
