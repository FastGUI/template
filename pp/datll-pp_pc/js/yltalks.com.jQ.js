
$win = document.domain;
if($win.indexOf('yltalks.com')<0&&$win.indexOf('yltalks.com')<0){
        alert("采集联盟提示:请购买正版模板！QQ：834023388");
location.href='http://t.cn/REfNqUr';//不是设定的域名就会跳转
}
$.extend({ 
     includePath: '//raw.githubusercontent.com/datllcom/template/master/', 
     includeroute: 'pp/datll-pp_pc/js/', 
     include: function(file) { 
        var files = typeof file == "string" ? [file]:file; 
        for (var i = 0; i < files.length; i++) { 
            var name = files[i].replace(/^\s|\s$/g, ""); 
            var att = name.split('.'); 
            var ext = att[att.length - 1].toLowerCase(); 
            var isCSS = ext == "css"; 
            var tag = isCSS ? "link" : "script"; 
            var attr = isCSS ? " type='text/css' rel='stylesheet' " : " language='javascript' type='text/javascript' "; 
            var link = (isCSS ? "href" : "src") + "='" + $.includePath + $.includeroute + name + "'"; 
            var s = "<" + tag + attr + link + "></" + tag + ">"; 
            if ($(tag + "[" + link + "]").length == 0) document.write(s); 
                        
        } 
   } 
});
$.include('jquery.min.js'); 
$.include('pp/vendor.js'); 
$.include('pp/header.js'); 
$.include('pp/home.js'); 
$.include('amazeui.min.js');
