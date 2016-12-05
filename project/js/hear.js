var thulink = 'wesalon.cc:9101';
var imagetrans = 'images/share.jpg';
var clientCount,successCount;
var conf;
var words = new Array(
'MY THUmb|我是射击馆:稳准是风格，果决是态度！',
'MY THUmb|我是气膜馆:看似弱不禁风，却有强大的韧性',
'MY THUmb|我是紫荆操场:居家旅行，携手闯天涯必备！',
'MY THUmb|我是综合馆:类超神的全能王',
'MY THUmb|我是棒球场:低调奢华有内涵，说的就是你！',
'MY THUmb|我是陈明游泳馆:额，谁让你游得快呢！',
'MY THUmb|我是西体:走过百年依然健康快乐的“老鲜肉”',
'MY THUmb|我是西湖游泳池:运动与气质完美结合，宅男宅女的梦想',
'MY THUmb|我是东操:“为祖国健康工作五十年”，看好你哦！');
$.ajax({
    url: '/getsignature', // 此处url请求地址需要替换成你自己实际项目中服务器数字签名服务地址
    type: 'post',
    data: {
        url: location.href.split('#')[0] // 将当前URL地址上传至服务器用于产生数字签名
    }
    }).done(function(r) {
            wx.config({
                debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                appId: r.appId, // 必填，公众号的唯一标识
                timestamp: r.timestamp, // 必填，生成签名的时间戳
                nonceStr: r.nonceStr, // 必填，生成签名的随机串
                signature: r.signature,// 必填，签名，见附录1
                jsApiList: [
                    
        'checkJsApi',
        'onMenuShareTimeline',
        'onMenuShareAppMessage',
        'onMenuShareQQ',
        'onMenuShareWeibo',
        'hideMenuItems',
        'showMenuItems',
        'hideAllNonBaseMenuItem',
        'showAllNonBaseMenuItem',
        'translateVoice',
        'startRecord',
        'stopRecord',
        'onRecordEnd',
        'playVoice',
        'pauseVoice',
        'stopVoice',
        'uploadVoice',
        'downloadVoice',
        'chooseImage',
        'previewImage',
        'uploadImage',
        'downloadImage',
        'getNetworkType',
        'openLocation',
        'getLocation',
        'hideOptionMenu',
        'showOptionMenu',
        'closeWindow',
        'scanQRCode',
        'chooseWXPay',
        'openProductSpecificView',
        'addCard',
        'chooseCard',
        'openCard'
                ] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
            });
        }
    );

$.ajax({
    url: '/connection', // 此处url请求地址需要替换成你自己实际项目中服务器数字签名服务地址
    type: 'post',
    }).done(function(r) {
    clientCount = r.clientCount;
    document.title = '您是MY THUmb第'+clientCount+'位访问的人！';
        }
    );

function success(){

    $.ajax({
        url: '/success', // 此处url请求地址需要替换成你自己实际项目中服务器数字签名服务地址
        type: 'post',
        }).done(function(r) {
        successCount = r.successCount;
        showEnd();
            }
        );
}

function shareTimeline(){
	wx.onMenuShareTimeline({
	    title: 'MY THUmb 等你来挑战', // 分享标题
	    link: thulink, // 分享链接
	    desc: document.title, // 分享描述
	    
	      success: function (res) {
	        alert('已分享');
	      },
	      cancel: function (res) {
	        alert('已取消');
	      },
	      fail: function (res) {
	        alert(JSON.stringify(res));
	      }
	});
}
function sharefriend(){
	wx.onMenuShareAppMessage({
	    title: 'MY THUmb 等你来挑战', 
	    desc: document.title, 
	    link: thulink, // 分享链接
	    imgUrl: imagetrans, // 分享图标
	    type: 'link', // 分享类型,music、video或link，不填默认为link
	    dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
	    
	      success: function (res) {
	        alert('已分享');
	      },
	      cancel: function (res) {
	        alert('已取消');
	      },
	      fail: function (res) {
	        alert(JSON.stringify(res));
	      }
	});

}
wx.ready(function () { 
	shareTimeline();
	sharefriend();
});