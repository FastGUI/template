/*

 * Created by zhaozhao.

 * Date: 2015/5/4

 * version : 2.27 Beta

*/

jQuery.fn.extend({

    autoTopic_scroll: function(option){

        var settings = {

            toc : "*", //滚动子元素，可填写选择器内容，如：".toc"等

            leftBtn : false, //左控制按钮

            rightBtn : false,//右控制按钮

            speed: 1000,//滚动速度，数值越小滚动越快

            easing:"swing", //加速形式

            range: false,//单次滚动的单位个数，当滚动幅度不足单屏显示个数时，默认为1/设为true时滚动幅度为第2屏的差值

            autoPlay : false,//自动播放控制，默认不自动播放，设为true自动播放

            space : 3000,//自动播放间隔

            side: 4,//播放方向, 1:上，2:右，3:下，4:左

            gap: true,//单屏专用，是否无缝环形播放(左右往返播放)

            line: false,//单屏专用，画面是否连续滚动

            delay: 0,//滚动开始执行前的延时时间

            control : false,//默认false，应为控制UL，如："#control"

            controlToc : '*',//默认为全部，填写选择器内容，如："a",".toc"等

            onLoad : function(){},//插件运行开始时执行函数

            onReady : function(){},//文档准备就绪时执行函数

            onClick : function(i,o){},//发生滚动时执行函数。参数：点击前的激活toc，发生点击的toc

            callback : function(i){}//播放滚动动画后执行函数。参数：发生点击的toc

        };

        if(option!=null) jQuery.extend(settings, option);

        settings.onLoad();

        var hor = settings.side == 2 || settings.side == 4 , //判断是否是横向

            $ul = this, pw = hor ? $ul.parent().width() : $ul.parent().height() ,//父级容器的宽/高度

            $li = $ul.children(settings.toc),w = hor ? $li.outerWidth(true) : $li.outerHeight(true),//子级单位的宽/高度

            widthHeight = hor ? 'width' : 'height', leftTop = hor ? 'left' : 'top',l = $li.length,

            pw_w = Math.round(pw/w),//单屏显示个数

            n = settings.range !== true && settings.range > 0  ? settings.range : l/pw_w < 2 && settings.range == false ? 1 : l/pw_w < 2 && settings.range === true ? l-pw_w : pw_w,//滚动单位个数

            cli = true, num = -(parseInt($ul.css(leftTop)=="auto"?0:$ul.css(leftTop) ) /w), pause = 0, time,

            long = l/pw_w < 2 && n>l-pw_w, //长度是否足够全屏滚动2次

            ppw = $(window).width() > 990 ? $(window).width() : 990 , //全屏时滚动组件宽度

            control = $( settings.control), iToc = control.children(settings.controlToc)

            ;

        //全屏判断及子级宽度设置

        if( $ul.parent().width() == $(window).width() ){

            w = hor ? ppw : w;

            $li.width(ppw);

        }

        //css样式设定

        $ul.css( widthHeight ,( long ? l*w : (pw_w==1  && !settings.line) ? 2*w : l*2*w)+"px").css('position' ,'absolute');

        //$ul.parent().css({overflow :'hidden',position:'relative'});

        //全屏判断及滚动主体宽度设置，并绑定浏览器窗口大小改变事件

        if( $ul.parent().width()  == $(window).width() ) {

            $ul.parent().width(ppw);

            $(window).resize(function(){

                ppw = $(window).width() > 990 ? $(window).width() : 990;

                w = hor ? ppw : w;

                $ul.parent().width(ppw);

                $ul.width(2*ppw);

                $li.width(ppw);

            });

        }

        if( (settings.line && pw_w==1) || (pw_w>1 && !long) ) {

            $li.clone().appendTo($ul);

            $li = $ul.children(settings.toc);

        }

        if(pw_w==1){

            if(!settings.line) $li.css({position:"absolute",display:"none"}).first().show();

            iToc.each(function(i){

                $(this).click(function(){

                    if(!settings.line){

                        if(i>num){

                            sc(1,i);

                        }else{

                            sc(0,i);

                        }

                    }else{

                        sc(num<l?i:l+i)

                    }

                });

            });

            embed(num);

        }

        settings.onReady();

        function embed(i){

            $ul.find("embed, object").each(function(){

                if($(this).siblings().length == 0){

                    var pa = $(this).parent(), ph = pa.html();

                    pa.attr("scrollEmbed",ph).html('');

                }

            });

            $li.eq(i).find("[scrollEmbed]").each(function(){

                $(this).html($(this).attr("scrollEmbed"))

            });

        }

        function sc(i,cNum){ //显示到第几屏/单屏显示且不需要连续滚动时的特殊显示屏数

            if( (pw_w==1 && !settings.line && cNum == num)|| cli==false || l < pw_w || (pw_w==1 && !settings.line ? settings.onClick(num,cNum) == false :settings.onClick(num,i) == false)) return false;

            cli = false;

            if(pw_w==1 && !settings.line){

                $li.hide();

                cNum = (num == l-1 && i == 1) ? 0 : (num < 0 && i ==0) ? l-2 :  cNum;

                i = !settings.gap && cNum == 0 ? 0 :  !settings.gap && cNum == -1 ? 1 : i;

                if(i==0) $ul.css(leftTop,-w);

                $li.eq(i==0 ? num : cNum).css(leftTop, w ).show();

                $li.eq(i==0 ? cNum : num).css(leftTop, 0 ).show();

                settings.onClick(num,cNum);

            }else{

                settings.onClick(num,i);

            }

            iToc.removeClass("cur").eq(cNum!=null ? cNum : i>l-1 ? (i%l) : i<0 ? l+i%l : i).addClass("cur");

            if(i<0){$ul.css(leftTop,(-num-l)*w)+"px"; i += l;}

            else if(i>l+n){$ul.css(leftTop,(l-num)*w)+"px"; i -= l;}

            $ul.stop().delay(settings.delay).animate(hor ? {left:-i*w + "px"} : {top:-i*w + "px"},settings.speed,settings.easing,function(){

                num = i;

                if(pw_w==1 && !settings.line){

                    $ul.css(leftTop,0);

                    $li.hide().eq(cNum).show().css(leftTop, 0 );

                    num = cNum;

                }

                if(long) num == 0 ? $(settings.leftBtn).hide() && $(settings.rightBtn).show() : $(settings.leftBtn).show()&& $(settings.rightBtn).hide();

                embed(num);

                settings.callback(num);

                cli = true;

            });

        }

        function left(){

            if (pw_w==1 && !settings.line) {

                sc(0,num-1);

            } else {

                long ? sc(0) : sc(num - n);

            }

        }

        function right(){

            if (pw_w==1 && !settings.line) {

                sc(1,num+1);

            } else {

                long ? sc(l-pw_w) : sc(num + n);

            }

        }

        if(long) $(settings.leftBtn).hide();

        $(settings.leftBtn).click(function () { left();});

        $(settings.rightBtn).click(function () {right()});

        if( settings.autoPlay == true){

            var t = new Date(), prev;

            function run(){(settings.side == 4 || settings.side == 1) ? right() : left();

                prev = t; t = new Date();

                console.log(t-prev);

                time = setTimeout( function(){ if(!pause) run()}, settings.space);}

            setTimeout( function(){ if(!pause) run()}, settings.space);

            var $ulSel = $ul.selector;

            $($ulSel +"," + settings.leftBtn +"," +settings.rightBtn + (settings.control ? (","+ settings.control) : ''))

                .mouseenter(function(){ pause = 1; clearTimeout(time)})

                .mouseleave(function(){ pause = 0; time = setTimeout( function(){ if(!pause) run()}, settings.space)});

        }

        if(navigator.userAgent.match(/mobile/i)){

            var n_x = 0;

                var e_x = 0 ;

                var min_width = pw/10;

                $ul.parent()[0].addEventListener('touchmove', function(e) {

                    e.preventDefault();

                    if (e.targetTouches) {

                        e_x = hor ? (e.targetTouches[0].pageX - n_x) : (e.targetTouches[0].pageY - n_x);

                    } else {

                        e_x = hor ? (e.clientX - n_x) : (e.clientY - n_x);

                    }

                });

            $ul.parent()[0].addEventListener('touchstart', function (e) {

                    e.preventDefault();

                    if (e.targetTouches) {

                        n_x = hor ? e.targetTouches[0].pageX : e.targetTouches[0].pageY;

                    } else {

                        n_x = hor ? e.clientX : e.clientY;

                    }

                });

            $ul.parent()[0].addEventListener('touchend', function (e) {

                    e.preventDefault();

                    if (Math.abs(e_x) < min_width) return false;

                    if(e_x<0){

                        right()

                    }else{

                        left()

                    }

                });

        }



    }

});

