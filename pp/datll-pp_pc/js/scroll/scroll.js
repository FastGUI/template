/*

 * Created by zhaozhao.

 * Date: 2015/5/4

 * version : 2.27 Beta

*/

jQuery.fn.extend({

    autoTopic_scroll: function(option){

        var settings = {

            toc : "*", //������Ԫ�أ�����дѡ�������ݣ��磺".toc"��

            leftBtn : false, //����ư�ť

            rightBtn : false,//�ҿ��ư�ť

            speed: 1000,//�����ٶȣ���ֵԽС����Խ��

            easing:"swing", //������ʽ

            range: false,//���ι����ĵ�λ���������������Ȳ��㵥����ʾ����ʱ��Ĭ��Ϊ1/��Ϊtrueʱ��������Ϊ��2���Ĳ�ֵ

            autoPlay : false,//�Զ����ſ��ƣ�Ĭ�ϲ��Զ����ţ���Ϊtrue�Զ�����

            space : 3000,//�Զ����ż��

            side: 4,//���ŷ���, 1:�ϣ�2:�ң�3:�£�4:��

            gap: true,//����ר�ã��Ƿ��޷컷�β���(������������)

            line: false,//����ר�ã������Ƿ���������

            delay: 0,//������ʼִ��ǰ����ʱʱ��

            control : false,//Ĭ��false��ӦΪ����UL���磺"#control"

            controlToc : '*',//Ĭ��Ϊȫ������дѡ�������ݣ��磺"a",".toc"��

            onLoad : function(){},//������п�ʼʱִ�к���

            onReady : function(){},//�ĵ�׼������ʱִ�к���

            onClick : function(i,o){},//��������ʱִ�к��������������ǰ�ļ���toc�����������toc

            callback : function(i){}//���Ź���������ִ�к��������������������toc

        };

        if(option!=null) jQuery.extend(settings, option);

        settings.onLoad();

        var hor = settings.side == 2 || settings.side == 4 , //�ж��Ƿ��Ǻ���

            $ul = this, pw = hor ? $ul.parent().width() : $ul.parent().height() ,//���������Ŀ�/�߶�

            $li = $ul.children(settings.toc),w = hor ? $li.outerWidth(true) : $li.outerHeight(true),//�Ӽ���λ�Ŀ�/�߶�

            widthHeight = hor ? 'width' : 'height', leftTop = hor ? 'left' : 'top',l = $li.length,

            pw_w = Math.round(pw/w),//������ʾ����

            n = settings.range !== true && settings.range > 0  ? settings.range : l/pw_w < 2 && settings.range == false ? 1 : l/pw_w < 2 && settings.range === true ? l-pw_w : pw_w,//������λ����

            cli = true, num = -(parseInt($ul.css(leftTop)=="auto"?0:$ul.css(leftTop) ) /w), pause = 0, time,

            long = l/pw_w < 2 && n>l-pw_w, //�����Ƿ��㹻ȫ������2��

            ppw = $(window).width() > 990 ? $(window).width() : 990 , //ȫ��ʱ����������

            control = $( settings.control), iToc = control.children(settings.controlToc)

            ;

        //ȫ���жϼ��Ӽ��������

        if( $ul.parent().width() == $(window).width() ){

            w = hor ? ppw : w;

            $li.width(ppw);

        }

        //css��ʽ�趨

        $ul.css( widthHeight ,( long ? l*w : (pw_w==1  && !settings.line) ? 2*w : l*2*w)+"px").css('position' ,'absolute');

        //$ul.parent().css({overflow :'hidden',position:'relative'});

        //ȫ���жϼ��������������ã�������������ڴ�С�ı��¼�

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

        function sc(i,cNum){ //��ʾ���ڼ���/������ʾ�Ҳ���Ҫ��������ʱ��������ʾ����

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

