
var pageRem;
var scale,width,height;
(function () {
    width = document.documentElement.clientWidth;
    height = document.documentElement.clientHeight;
    proportion = 1738 / 1080;
    if (width * proportion > height) {
        width = height / proportion;
    }
    document.documentElement.style.fontSize = (pageRem = width / 16) + 'px';
    document.documentElement.style.width = "100%";
    scale=1;
})();

var _LoadingHtml = '<div align="center" height="'+height+'"><img align=absmiddle id="loading" align="center" src="images/loading.gif"></div>';
var bgmusic = '<audio autoplay="autoplay" loop="loop"><source src="i/bg.mp3" type="audio/mp3" /></audio>'
//呈现loading效果
document.write(_LoadingHtml);
document.write(bgmusic);
window.onload = function () {
   var loadingMask = document.getElementById('loading');
   loadingMask.parentNode.removeChild(loadingMask);
   document.getElementById("content").style.display='block';
};

//监听加载状态改变
//document.onreadystatechange = completeLoading;

//加载状态为complete时移除loading效果
function completeLoading() {
    if (document.readyState == "complete") {
        var loadingMask = document.getElementById('loading');
        loadingMask.parentNode.removeChild(loadingMask);
        document.getElementById("content").style.display='block';
    }
}
