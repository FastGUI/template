$(function(){		

	//延迟加载

	$("img.lazy").lazyload({

		effect : "fadeIn",

		failurelimit : 1000,

		skip_invisible : false,

		//event : "mouseover"

	});



	$('.gsub').click(function(){

		if($('.gbook textarea').val()==''){

			alert('留言不能为空！');

		} else if($('.gbook textarea').val().length<20){

			alert('长度不能少于20！');

		} else {

			//$('.gbook form').submit();

			$.ajax({ 

				url: "/user/gbook/",

				data:{    

					message : $('.gbook textarea').val(),    

				},   

				type:'post', 

				dataType:'json',

				success:function(data){ 

					if( data.success == 1)

					{  

						alert('留言成功！');

						 location.reload();

					} else {

						alert('留言失败！');

					}   

				}

			});

		}

	})

	var documentHeight = 0;

	var topPadding = 100;

	var offset = $(".rightfixed").offset();

	documentHeight = $(".left").height()+$(".lbox").height();

	$(window).scroll(function() {

			var sideBarHeight = $(".rightfixed").height();

			if ($(window).scrollTop() > offset.top) {

					var newPosition = ($(window).scrollTop() - offset.top) + topPadding;

					var maxPosition = documentHeight - (sideBarHeight + 368);

					if (newPosition > maxPosition) {

							newPosition = maxPosition;

					}

					$(".rightfixed").stop().css({

							marginTop: newPosition

					});

			} else {

					$(".rightfixed").stop().css({

							marginTop: 0

					});

			};

	});



	$('.ibox .left ul li').each(function(){

		$(this).hover(function(){

			$(this).find('.star').fadeIn(700);

		},function(){

			$(this).find('.star').hide();

		})

	})

	

		$('.moreinfo').click(function(){

		$('.pcbar').hide();

		$('.infobar').show();

		$(this).addClass('ou');

		$('.morePic').removeClass('ou')

	});



	$('.morePic').click(function(){

		$('.pcbar').show();

		$('.infobar').hide();

		$(this).addClass('ou');

		$('.moreinfo').removeClass('ou');

	});



	//加入收藏

	function AddFavorite(sURL, sTitle) {

		sURL = encodeURI(sURL);

		try{

			window.external.addFavorite(sURL, sTitle);

		}catch(e) {

			try{

				window.sidebar.addPanel(sTitle, sURL, "");

			}catch (e) {

				alert("加入收藏失败，请使用Ctrl+D进行添加,或手动在浏览器里进行设置.");

			}

		}

	}



	



	$('.iwill').each(function(){

		var $uls = $(this).find('ul');

		$(this).find('.ltit span').each(function(n){

			$(this).click(function(){

				$(this).addClass('on').siblings('span').removeClass('on');

				$uls.eq(n).show().siblings('ul').hide();

			})

		})

	})	

		

	/*吐槽展开收起*/

	var wrightheight = $('.tucao .wright').height();

	if(wrightheight>88){

		$('.tucao span.more').show();

		$('.tucao .wright').addClass('lessheight');

	} else {

		$('.tucao span.more').hide();

		$('.tucao .wright').removeClass('lessheight');

	}

	$('.tucao span.more').click(function(){

		var $morehtml = $(this).html();

		if($morehtml=='︾'){

			$(this).html('︽');

			$('.tucao .wright').removeClass('lessheight');

		} else {

			$(this).html('︾');

			$('.tucao .wright').addClass('lessheight');

		}

	})

	/*nav*/

	$('.nav ul li').each(function(){

		$(this).hover(function(){

			$(this).find('div').slideDown(300).parent().siblings('li').find('div').hide();

			$(this).addClass('active').siblings('li').stop(300).removeClass('active');

		},function(){

			$(this).removeClass('active').stop(300);

			$(this).find('div').hide();

		})

	})

	

	/*tab*/

	tab('.rtab .tabtit .tabt','.rtab ul');

	tab('.media .title .tabt','.media ul');

	function tab($tabtit,$tablist){

		$($tabtit).each(function(i){

			$(this).click(function(){

				$(this).addClass('on').siblings('.tabt').removeClass('on');

				$($tablist).eq(i).show().siblings('ul').hide();

			})

		})

	}



		$('.link .tabtit span').each(function(i){

			$(this).click(function(){

				$(this).addClass('on').siblings('span').removeClass('on');

				$('.link .l_tab').eq(i).show().siblings('.l_tab').hide();

			})

		})

	

	$('div.tucao .right p').css('marginTop',(145-$('div.tucao .right p').height())/2+'px')

	//异步加载数据 

	function tabdata(element,index,tablename,type,where){

		return datastr;

	}

	

	//小猴子点击链接随机

	$('.monkey,.stroll').click(function(){

   //设置点击后的参数代码

});

	

	

	

	//微信 

	$('.wxlink,.weixinbox').hover(function(){

		$('.weixinbox').toggle();

	})

	

	//频道

	$('.channelmenu').hover(function(){

		$(this).find('div').fadeIn('1000');

	},function(){

		$(this).find('div').hide();

	})

	

	//tab切换

	$("div.switchtitle span").each(function(){

	$(this).mouseover(function(){

		$(this).addClass('active').siblings('span').removeClass('active');

		var index = $(this).index();

		$("div.switchlist ul").eq(index).show().siblings('ul').hide();

		})

	})

	

	//影院热映tab切换

	$(".hotvideo strong span a").each(function(){

		$(this).mouseover(function(){

			$(this).addClass('selected').siblings('a').removeClass('selected');

			var index = $(this).index();

			$(this).parents('strong').siblings('ul').eq(index).show().siblings('ul').hide();

		})

	})

	

	//分类类型展开收起

	if($('#type a.selected').index()<18){

		$('#type a:gt(18)').not(".typemore").hide();

		$('#type .typemore').html('展开>>');

	} else {

		$('#type a').show();

		$('#type .typemore').html('收起<<');

	}

	$('#type .typemore').click(function(){

		var $str = $(this).html();

		if($str=='展开>>'){

			$('#type a').show();

			$(this).html('收起<<');

		} else if($str=='收起<<'){

			$('#type a:gt(18)').not(".typemore").hide();

			$(this).html('展开>>');

		}

	})

	

	//内容页详细剧情

	$('.plotbox span.seemore').click(function(){

		var $spanstr = $(this).text();

		if ($spanstr=='展开++') {

			$('div.morecon').slideDown(1000).siblings('div.lesscon').hide();

			$(this).text('收起--');

		} else {

			$('div.lesscon').slideDown(800).siblings('div.morecon').hide();

			$(this).text('展开++');

		}

	})

	

	/*/内容页详情弹出层

	$('.lightbox').click(function(){

		showDiv();

	})

	$('.close,#bg,.closebox').click(function(){

		closeDiv();

	})

	function showDiv(){

		var top = document.documentElement.scrollTop || document.body.scrollTop+10;

	$('#popDiv').fadeIn(100).css({'top':top});

		$('#bg').show();

	}

	function closeDiv(){

		$('#popDiv').fadeOut(100);

		$('#bg').hide();

	}*/

	

	

	$("div.playlist ul").each(function(i){

		$(this).find("span.less li.morecounts").click(function(){

			$(this).parent('span').hide().siblings('span').fadeIn();

		})

		$(this).find("span.more li.lesscounts").click(function(){

			$(this).parent('span').hide().siblings('span').fadeIn();

		})

	})

	

	//电视剧播放地址切换

	$("div.tvsource div.playitem span").each(function(i){

		$(this).click(function(){

			$(this).addClass('selected').siblings('span').removeClass('selected');

			$("div.tvsource div.playlist ul").eq(i).fadeIn(100).siblings("ul").hide();

		})

	})

	

	$("div.startable div.newstitle a").each(function(i){

		$(this).mouseover(function(){

			$(this).addClass('on').siblings('a').removeClass('on').parent().siblings('div.newslist').children('ul').eq(i).fadeIn(100).siblings('ul').hide();

		})

	})

	

	$("div.tvtitle span").each(function(i){

		$(this).click(function(){

			$(this).addClass('onborder').siblings('span').removeClass('onborder').parent().siblings('div.tvlist').eq(i).fadeIn(100).siblings('div.tvlist').hide();

		})

	})

	$("div.update div.title span").each(function(i){

		$(this).click(function(){

			$(this).addClass('hover').siblings('span').removeClass('hover');

			$("div.switchlist ul").eq(i).show().siblings("ul").hide();

		})

	})

	

	$("div.playlist ul").each(function(i){

		$(this).find("li.showtoggle").click(function(){

			var $txt = $(this).find('a').text();

			if($txt=='展开>>'){

				$(this).find('a').text('收起>>').parent().siblings('li').show();

			} else {

				$(this).find('a').text('展开>>').parent().siblings('li:gt(26)').hide();

			}

			

		})

		$(this).find("div.items i").each(function(i){

			$(this).click(function(){

				$(this).addClass('selected').siblings("i").removeClass('selected').parent().siblings('div.dmplaylist').eq(i).show().siblings("div.dmplaylist").hide();

			})

		})

	})

	

	

	//首页主内容切换效果

	/*$(".listbox").each(function(){

		$(this).find("div.left strong span a").each(function(i){

			$(this).mouseover(function(){

				var $element = $(this).parents('strong').siblings('ul');

				var $tablename = $(this).attr('tablename');

				var $type = $(this).attr('type');

				var $where = $(this).attr('where');

				var index = $(this).index();

				if($where!==''){

					$(this).attr('where','');

					$.ajax({ 

						url: "/web/tabdata/",

						data:{    

							 tablename : $tablename,    

							 type : $type,    

							 where : $where,  

						},   

						type:'get', 

						dataType:'json',

						success:function(data){ 

							if( data.msg == 0)

							{  

								$element.eq(index).html(data.data);

							}    

						}

					});

				}

				$(this).addClass('selected').siblings().removeClass('selected').parent().parent().siblings('ul').eq(i).show().siblings('ul').hide();

			})

		})

		$(this).find("div.right strong span a").each(function(i){

			$(this).mouseover(function(){

				$(this).addClass('selected').siblings().removeClass('selected').parent().parent().siblings('ul').eq(i).show().siblings('ul').hide();

			})

		})

		$("div.update div.title span").each(function(i){

			$(this).click(function(){

				$(this).addClass('hover').siblings('span').removeClass('hover');

				$("div.switchlist ul").eq(i).show().siblings("ul").hide();

			})

		})

	})*/

	

	$("div.solist div.right div.rtitle a").each(function(){

		$(this).mouseover(function(){

			$(this).addClass('selected').siblings('a').removeClass('selected');

			var index = $(this).index();

			$("div.solist div.right div.switchlist ul").eq(index).show().siblings('ul').hide();

		})

	})

	 

	//综艺播放地址切换

	$("div.zysource div.plays").each(function(i){

		$(this).find("div.yearlist").each(function(){

			$(this).find('ul').each(function(){

				$(this).find('li:gt(11)').hide().siblings('li.more').click(function(){

					$(this).siblings('li').show().siblings('li.more').hide();

				});

				$(this).find('li.less').click(function(){

					$(this).hide().siblings('li:gt(11)').hide().siblings('li.more').show();

				})

			})

		})

		$(this).find("div.ylist").hover(function(){

			$(this).find('span').css('display','block').siblings("i").removeClass('other');

		},function(){

			var $str = $(this).find('span.on').text();

			$(this).find('i').addClass('other').text($str).siblings('span').hide();

		}

		)

		$(this).find("div.mlist").hover(function(){

			$(this).find('div.ms').each(function(){

				$(this).find('span').css('display','block').siblings("i").removeClass('other');

			})

		},function(){

			$(this).find('div.ms').each(function(){

				var $str1 = $(this).find('span.on').text();

				if($str1 !== '全部'){

					$(this).find('i').addClass('other').text($str1).siblings('span').hide();

				} else {

					$(this).find('span').eq(0).show().siblings('span').hide();

				}

			})

		}

		)

		$(this).find("div.ylist span").each(function(j){

			$(this).click(function(){

				$(this).addClass('on').siblings('span').removeClass('on').parent().siblings('div.mlist').children('div').eq(j).fadeIn(100).siblings('div').hide().parents('div.datelist').siblings('div.yearlist').eq(j).fadeIn(100).siblings('div.yearlist').hide();

			})	

			$(this).parent().siblings('div.mlist').children('div').eq(j).find('span').each(function(k){

				$(this).click(function(){

					$(this).addClass('on').siblings('span').removeClass('on').parents('div.datelist').siblings('div.yearlist').eq(j).find('ul').eq(k).fadeIn(100).siblings('ul').hide();

				})

			})

		})

	})

	

	//综艺播放地址来源网站切换

	$("div.zysource div.playitem span").each(function(i){

		$(this).click(function(){

			$(this).addClass('selected').siblings('span').removeClass("selected");

			$("div.zyplaylist div.plays").eq(i).fadeIn(100).siblings("div.plays").hide();

		})

	})

	

	$("div.see div.left div.title a").each(function(i){

		$(this).mouseover(function(){

			$(this).addClass('selected').siblings('a').removeClass('selected');

			$("div.see div.left div.switchlist ul").eq(i).show().siblings('ul').hide();

		})

	})

	

	/*分类选择展开收起--*/

	$(function(){

		$('div#type span.lesstype a.typemore').click(function(){

			$(this).parent('span').hide().siblings('span').show();

		})

			$('div#type span.moretype a.typemore').click(function(){

			$(this).parent('span').hide().siblings('span').show();

		})

	})

	$("ul.video").each(function(j){

		$(this).find('span.time').each(function(i){

			$(this).click(function(){

				$(this).addClass('on').siblings('span.time').removeClass('on').parent().siblings('span.selectlist').eq(i).fadeIn(100).siblings('span.selectlist').hide();

			})

		})

	})

	

	$("div.starsvideo").each(function(){

		$(this).find("div.title div").each(function(i){

			$(this).mouseover(function(){

				$(this).addClass('selected').siblings("div").removeClass('selected');

				$("div.starslist .picstar").eq(i).show().siblings("div.picstar").hide();

			})

		})

	})

	

	$("div.starsvideo .picstar").each(function(){

		$(this).find("div.worktitle span").eq(0).addClass('selected');

		$(this).find("div.worktitle span:last").css('border','none');

		$(this).find("ul:first").show();

		$(this).find("div.worktitle span").each(function(i){

			$(this).mouseover(function(){

				$(this).addClass('selected').siblings("span").removeClass('selected').parent().siblings('ul').eq(i).show().siblings('ul').hide();

			})

		})

	})

	

	

	$('div.playsource dl dd span.less a.others').hover(function(){

		$("div.more").show().hover(

		function(){

			$(this).show();

		},function(){

			$(this).hide();

		});

	},function(){

		$("div.more").hide();

	})

	

	$('div#startable span.lessstar li.more').click(function(){

		$(this).parent('span').hide().siblings('span').show();

	})

	$('div#startable span.morestar li.more').click(function(){

		$(this).parent('span').hide().siblings('span').show();

	})

	

	$("div.movielist div.title b").each(function(i){

		$(this).click(function(){

			$(this).addClass('selected').siblings('b').removeClass('selected');

			$("div.movielist div.list ul").eq(i).show().siblings("ul").hide();

		})

	})

	

	$(".tab div.title a").each(function(i){

		$(this).click(function(){

			$(this).addClass('selected').siblings('a').removeClass('selected').parent().siblings("div.list").children('ul').eq(i).fadeIn(100).siblings('ul').hide();

		})

	})

	

	$("div.hotso div.tit span").each(function(i){

		$(this).click(function(){

			$(this).addClass('hover').siblings('span').removeClass('hover');

			$("div.switchbox div").eq(i).show().siblings("div").hide();

		})

	})

	

	/* 首页幻灯效果---------*/

	jQuery(".itxMovie").slide({ titCell:".ifocus_nav li", mainCell:".ifocus_pic", autoPlay:true,delayTime:3000,interTime:3000,startFun:function(i){

			//控制小图自动翻页

			if(i==0){ jQuery(".itxMovie .navPrev").click() } else if( i%5==0 ){ jQuery(".itxMovie .navNext").click()}

		}

	});

	

	

	

				


	//小图滚动

	jQuery(".itxMovie").slide({ mainCell:".ifocus_nav ul",prevCell:".navPrev",nextCell:".navNext",effect:"left",vis:5,scroll:5,delayTime:0,autoPage:true,pnLoop:false});

	

	//电影频道、电视剧频道幻灯

	jQuery(window).resize(function(){moveBtn();});

	jQuery(".w3cFocus").slide({ mainCell:".bd ul", effect:"fold", delayTime:3000, autoPlay:true });

	function moveBtn(){

		var prev=jQuery(".w3cFocus .prev");

		var next=jQuery(".w3cFocus .next");

		var body_w = document.body.clientWidth;

		var side_w = (body_w - 960) / 2 -50;

		if(body_w < 1080)

		{

			prev.animate({"left":30, "opacity":0.5});

			next.animate({"right":30, "opacity":0.5});

		}

		else

		{

			prev.animate({"left":side_w, "opacity":0.5});

			next.animate({"right":side_w, "opacity":0.5});

		}

	}

	moveBtn();

	

	//娱乐幻灯

	jQuery(".focusBox").slide({ mainCell:".pic",effect:"left", autoPlay:true, delayTime:300});

	

	//综艺幻灯

	jQuery(".txMovie").slide({ titCell:".focus_nav li", mainCell:".focus_pic", autoPlay:true,delayTime:100

	});

	jQuery(".txMovie").slide({ mainCell:".focus_nav ul",prevCell:".navPrev",nextCell:".navNext",effect:"left",vis:7,scroll:7,delayTime:0,autoPage:true,pnLoop:false});

	

	//资讯幻灯

	jQuery(".douban").slide({ mainCell:".bd ul", effect:"left", delayTime:800,vis:5,scroll:5,pnLoop:false,trigger:"click",easing:"easeOutCubic" });

	jQuery(".newsfoucebox").slide({ mainCell:".bd ul", effect:"fold", autoPlay:true, delayTime:300, triggerTime:50, startFun:function(i){

			jQuery(".newsfoucebox .hoverBg").animate({"margin-left":79*i},100);

		}

	});

	

	//内容页滚动效果

	jQuery(".picScroll").slide({ mainCell:".picList", effect:"left",vis:5, pnLoop:false, scroll:5, autoPage:true});

	

	//明星幻灯

	jQuery(".slider .bd li").first().before( jQuery(".slider .bd li").last() );

	jQuery(".slider").hover(function(){ jQuery(this).find(".arrow").stop(true,true).fadeIn(300) },function(){ jQuery(this).find(".arrow").fadeOut(300) });

	jQuery(".slider").slide({ titCell:".hd ul", mainCell:".bd ul", effect:"leftLoop",  autoPlay:true, vis:3, autoPage:true, trigger:"click"});

	

	//专题幻灯

	jQuery(".w3cFocus").slide({ mainCell:".bd ul", effect:"fold", delayTime:300, autoPlay:true });

	

	//内容图片切换滚动效果

	jQuery(".picScroll").slide({ mainCell:".picList", effect:"left",vis:5, pnLoop:false, scroll:5, autoPage:true});

	

	//当前导航状态

	currentnav('#leftnav');

	currentnav('#squarenav');

	currentnav('#singlenav');

	function currentnav(idbox){

		var nav = $(idbox);

		var links = nav.find('li');

		var lilen = nav.find("a");

		var currenturl = document.location.href;

		var last = '';

		for (var k=0;k<links.length;k++)

		{

			var linkurl =  lilen.eq(k).attr("href");

			if(currenturl==linkurl)

			{

				last = k;

			}

		}

		links.eq(last).addClass('cur');

	}

	var $current_url = document.location.href;

	var $hosturl = 'http://'+window.location.host+'/';

	if ($current_url==$hosturl) {

		$('#nav li').eq(0).addClass('cur');

	} else {

		$('#nav .navlink:gt(0)').each(function(){

			var $_url = $(this).attr('href');

			if($current_url.indexOf($_url)!==-1){

				$(this).parent().addClass('cur');

			}

		})

	}

	

	//回到顶部

	var offset = 300

		offset_opacity = 1200,

		scroll_top_duration = 700,

		$back_to_top = $('.gotop');

	$(window).scroll(function(){

		( $(this).scrollTop() > offset ) ? $back_to_top.addClass('cd-is-visible') : $back_to_top.removeClass('cd-is-visible cd-fade-out');

		if( $(this).scrollTop() > offset_opacity ) { 

			$back_to_top.addClass('cd-fade-out');

		}

	});

	$back_to_top.on('click', function(event){

		event.preventDefault();

		$('body,html').animate({

			scrollTop: 0 ,

		 	}, scroll_top_duration

		);

	});

	

	//剧照灯箱效果

	 window.Lightbox = new jQuery()

	 

	 //tab

$('.content .right .listbox .title span').each(function(k){

	$(this).mouseover(function(){

		$(this).addClass('on').siblings('span').removeClass('on');

		$('.content .right .listbox ul').eq(k).fadeIn(200).siblings('ul').hide();

	})

})






	 //播放页展开详情

	var $a = document.getElementById('player_xq_a');

                var $d = document.getElementById('player_xq');

                var i = 0;

                $a.onclick = function() {

                    i++;

                    switch (i % 2) {

                        //case 1:d.style.width='200px';brack;

                    case 1:

                        player_xq.style.height = '350px';

                        brack;

                    case 0:

                        player_xq.style.height = '70px';

                        brack;

                    }

                    return false;

                }

})











// VERSION: 2.2 LAST UPDATE: 13.03.2012

/* 

 * Licensed under the MIT license: http://www.opensource.org/licenses/mit-license.php

 * 

 * Made by Wilq32, wilq32@gmail.com, Wroclaw, Poland, 01.2009

 * Website: http://code.google.com/p/jqueryrotate/ 

 */



// Documentation removed from script file (was kinda useless and outdated)



{

var supportedCSS,styles=document.getElementsByTagName("head")[0].style,toCheck="transformProperty WebkitTransform OTransform msTransform MozTransform".split(" ");

for (var a=0;a<toCheck.length;a++) if (styles[toCheck[a]] !== undefined) supportedCSS = toCheck[a];

// Bad eval to preven google closure to remove it from code o_O

// After compresion replace it back to var IE = 'v' == '\v'

var IE = eval('"v"=="\v"');



jQuery.fn.extend({

    rotate:function(parameters)

    {

        if (this.length===0||typeof parameters=="undefined") return;

            if (typeof parameters=="number") parameters={angle:parameters};

        var returned=[];

        for (var i=0,i0=this.length;i<i0;i++)

            {

                var element=this.get(i);	

                if (!element.Wilq32 || !element.Wilq32.PhotoEffect) {



                    var paramClone = $.extend(true, {}, parameters); 

                    var newRotObject = new Wilq32.PhotoEffect(element,paramClone)._rootObj;



                    returned.push($(newRotObject));

                }

                else {

                    element.Wilq32.PhotoEffect._handleRotation(parameters);

                }

            }

            return returned;

    },

    getRotateAngle: function(){

        var ret = [];

        for (var i=0,i0=this.length;i<i0;i++)

            {

                var element=this.get(i);	

                if (element.Wilq32 && element.Wilq32.PhotoEffect) {

                    ret[i] = element.Wilq32.PhotoEffect._angle;

                }

            }

            return ret;

    },

    stopRotate: function(){

        for (var i=0,i0=this.length;i<i0;i++)

            {

                var element=this.get(i);	

                if (element.Wilq32 && element.Wilq32.PhotoEffect) {

                    clearTimeout(element.Wilq32.PhotoEffect._timer);

                }

            }

    }

});



// Library agnostic interface



Wilq32=window.Wilq32||{};

Wilq32.PhotoEffect=(function(){



	if (supportedCSS) {

		return function(img,parameters){

			img.Wilq32 = {

				PhotoEffect: this

			};

            

            this._img = this._rootObj = this._eventObj = img;

            this._handleRotation(parameters);

		}

	} else {

		return function(img,parameters) {

			// Make sure that class and id are also copied - just in case you would like to refeer to an newly created object

            this._img = img;



			this._rootObj=document.createElement('span');

			this._rootObj.style.display="inline-block";

			this._rootObj.Wilq32 = 

				{

					PhotoEffect: this

				};

			img.parentNode.insertBefore(this._rootObj,img);

			

			if (img.complete) {

				this._Loader(parameters);

			} else {

				var self=this;

				// TODO: Remove jQuery dependency

				jQuery(this._img).bind("load", function()

				{

					self._Loader(parameters);

				});

			}

		}

	}

})();



Wilq32.PhotoEffect.prototype={

    _setupParameters : function (parameters){

		this._parameters = this._parameters || {};

        if (typeof this._angle !== "number") this._angle = 0 ;

        if (typeof parameters.angle==="number") this._angle = parameters.angle;

        this._parameters.animateTo = (typeof parameters.animateTo==="number") ? (parameters.animateTo) : (this._angle); 



        this._parameters.step = parameters.step || this._parameters.step || null;

		this._parameters.easing = parameters.easing || this._parameters.easing || function (x, t, b, c, d) { return -c * ((t=t/d-1)*t*t*t - 1) + b; }

		this._parameters.duration = parameters.duration || this._parameters.duration || 1000;

        this._parameters.callback = parameters.callback || this._parameters.callback || function(){};

        if (parameters.bind && parameters.bind != this._parameters.bind) this._BindEvents(parameters.bind); 

	},

	_handleRotation : function(parameters){

          this._setupParameters(parameters);

          if (this._angle==this._parameters.animateTo) {

              this._rotate(this._angle);

          }

          else { 

              this._animateStart();          

          }

	},



	_BindEvents:function(events){

		if (events && this._eventObj) 

		{

            // Unbinding previous Events

            if (this._parameters.bind){

                var oldEvents = this._parameters.bind;

                for (var a in oldEvents) if (oldEvents.hasOwnProperty(a)) 

                        // TODO: Remove jQuery dependency

                        jQuery(this._eventObj).unbind(a,oldEvents[a]);

            }



            this._parameters.bind = events;

			for (var a in events) if (events.hasOwnProperty(a)) 

				// TODO: Remove jQuery dependency

					jQuery(this._eventObj).bind(a,events[a]);

		}

	},



	_Loader:(function()

	{

		if (IE)

		return function(parameters)

		{

			var width=this._img.width;

			var height=this._img.height;

			this._img.parentNode.removeChild(this._img);

							

			this._vimage = this.createVMLNode('image');

			this._vimage.src=this._img.src;

			this._vimage.style.height=height+"px";

			this._vimage.style.width=width+"px";

			this._vimage.style.position="absolute"; // FIXES IE PROBLEM - its only rendered if its on absolute position!

			this._vimage.style.top = "0px";

			this._vimage.style.left = "0px";



			/* Group minifying a small 1px precision problem when rotating object */

			this._container =  this.createVMLNode('group');

			this._container.style.width=width;

			this._container.style.height=height;

			this._container.style.position="absolute";

			this._container.setAttribute('coordsize',width-1+','+(height-1)); // This -1, -1 trying to fix ugly problem with small displacement on IE

			this._container.appendChild(this._vimage);

			

			this._rootObj.appendChild(this._container);

			this._rootObj.style.position="relative"; // FIXES IE PROBLEM

			this._rootObj.style.width=width+"px";

			this._rootObj.style.height=height+"px";

			this._rootObj.setAttribute('id',this._img.getAttribute('id'));

			this._rootObj.className=this._img.className;			

		    this._eventObj = this._rootObj;	

		    this._handleRotation(parameters);	

		}

		else

		return function (parameters)

		{

			this._rootObj.setAttribute('id',this._img.getAttribute('id'));

			this._rootObj.className=this._img.className;

			

			this._width=this._img.width;

			this._height=this._img.height;

			this._widthHalf=this._width/2; // used for optimisation

			this._heightHalf=this._height/2;// used for optimisation

			

			var _widthMax=Math.sqrt((this._height)*(this._height) + (this._width) * (this._width));



			this._widthAdd = _widthMax - this._width;

			this._heightAdd = _widthMax - this._height;	// widthMax because maxWidth=maxHeight

			this._widthAddHalf=this._widthAdd/2; // used for optimisation

			this._heightAddHalf=this._heightAdd/2;// used for optimisation

			

			this._img.parentNode.removeChild(this._img);	

			

			this._aspectW = ((parseInt(this._img.style.width,10)) || this._width)/this._img.width;

			this._aspectH = ((parseInt(this._img.style.height,10)) || this._height)/this._img.height;

			

			this._canvas=document.createElement('canvas');

			this._canvas.setAttribute('width',this._width);

			this._canvas.style.position="relative";

			this._canvas.style.left = -this._widthAddHalf + "px";

			this._canvas.style.top = -this._heightAddHalf + "px";

			this._canvas.Wilq32 = this._rootObj.Wilq32;

			

			this._rootObj.appendChild(this._canvas);

			this._rootObj.style.width=this._width+"px";

			this._rootObj.style.height=this._height+"px";

            this._eventObj = this._canvas;

			

			this._cnv=this._canvas.getContext('2d');

            this._handleRotation(parameters);

		}

	})(),



	_animateStart:function()

	{	

		if (this._timer) {

			clearTimeout(this._timer);

		}

		this._animateStartTime = +new Date;

		this._animateStartAngle = this._angle;

		this._animate();

	},

    _animate:function()

    {

         var actualTime = +new Date;

         var checkEnd = actualTime - this._animateStartTime > this._parameters.duration;



         // TODO: Bug for animatedGif for static rotation ? (to test)

         if (checkEnd && !this._parameters.animatedGif) 

         {

             clearTimeout(this._timer);

         }

         else 

         {

             if (this._canvas||this._vimage||this._img) {

                 var angle = this._parameters.easing(0, actualTime - this._animateStartTime, this._animateStartAngle, this._parameters.animateTo - this._animateStartAngle, this._parameters.duration);

                 this._rotate((~~(angle*10))/10);

             }

             if (this._parameters.step) {

                this._parameters.step(this._angle);

             }

             var self = this;

             this._timer = setTimeout(function()

                     {

                     self._animate.call(self);

                     }, 10);

         }



         // To fix Bug that prevents using recursive function in callback I moved this function to back

         if (this._parameters.callback && checkEnd){

             this._angle = this._parameters.animateTo;

             this._rotate(this._angle);

             this._parameters.callback.call(this._rootObj);

         }

     },



	_rotate : (function()

	{

		var rad = Math.PI/180;

		if (IE)

		return function(angle)

		{

            this._angle = angle;

			this._container.style.rotation=(angle%360)+"deg";

		}

		else if (supportedCSS)

		return function(angle){

            this._angle = angle;

			this._img.style[supportedCSS]="rotate("+(angle%360)+"deg)";

		}

		else 

		return function(angle)

		{

            this._angle = angle;

			angle=(angle%360)* rad;

			// clear canvas	

			this._canvas.width = this._width+this._widthAdd;

			this._canvas.height = this._height+this._heightAdd;

						

			// REMEMBER: all drawings are read from backwards.. so first function is translate, then rotate, then translate, translate..

			this._cnv.translate(this._widthAddHalf,this._heightAddHalf);	// at least center image on screen

			this._cnv.translate(this._widthHalf,this._heightHalf);			// we move image back to its orginal 

			this._cnv.rotate(angle);										// rotate image

			this._cnv.translate(-this._widthHalf,-this._heightHalf);		// move image to its center, so we can rotate around its center

			this._cnv.scale(this._aspectW,this._aspectH); // SCALE - if needed ;)

			this._cnv.drawImage(this._img, 0, 0);							// First - we draw image

		}



	})()

}



if (IE)

{

Wilq32.PhotoEffect.prototype.createVMLNode=(function(){

document.createStyleSheet().addRule(".rvml", "behavior:url(#default#VML)");

		try {

			!document.namespaces.rvml && document.namespaces.add("rvml", "urn:schemas-microsoft-com:vml");

			return function (tagName) {

				return document.createElement('<rvml:' + tagName + ' class="rvml">');

			};

		} catch (e) {

			return function (tagName) {

				return document.createElement('<' + tagName + ' xmlns="urn:schemas-microsoft.com:vml" class="rvml">');

			};

		}		

})();

}



}



				

$(function(){

		   

})



		   