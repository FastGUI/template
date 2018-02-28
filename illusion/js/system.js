var feifei = {
	'browser': {
		'url': document.URL,
		'domain': document.domain,
		'title': document.title,
		'language': (navigator.browserLanguage || navigator.language).toLowerCase(),
		'canvas': function () {
			return !!document.createElement('canvas').getContext;
		}(),
		'useragent': function () {
			var ua = navigator.userAgent;
			return {
				'mobile': !!ua.match(/AppleWebKit.*Mobile.*/),
				'ios': !!ua.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/),
				'android': ua.indexOf('Android') > -1 || ua.indexOf('Linux') > -1,
				'iPhone': ua.indexOf('iPhone') > -1 || ua.indexOf('Mac') > -1,
				'iPad': ua.indexOf('iPad') > -1,
				'trident': ua.indexOf('Trident') > -1,
				'presto': ua.indexOf('Presto') > -1,
				'webKit': ua.indexOf('AppleWebKit') > -1,
				'gecko': ua.indexOf('Gecko') > -1 && ua.indexOf('KHTML') == -1,
				'weixin': ua.indexOf('MicroMessenger') > -1
			};
		}()
	},
	'mobile': {
		'jump': function () {
			if (cms.domain_m) {
				self.location.href = feifei.browser.url.replace(feifei.browser.domain, cms.domain_m);
			}
		},
		'nav': function () {
			$("#ff-nav-btn").bind('click', function () {
				$('#ff-nav-btn-item').toggleClass("hidden");
			});
		},
		'goback': function () {
			if (history.length > 0 && document.referrer) {
				$("#ff-goback").show();
				$('#ff-goback').attr('href', 'javascript:history.go(-1);');
			} else {
				$("#ff-goback").hide();
			}
		},
		'flickity': function ($id, $index) {
			if ($(".ff-gallery").length) {
				$.ajaxSetup({
					cache: true
				});
				$("<link>").attr({
					rel: "stylesheet",
					type: "text/css",
					href: "https://cdn.bootcss.com/flickity/2.0.9/flickity.min.css"
				}).appendTo("head");
				$.getScript("https://cdn.bootcss.com/flickity/2.0.9/flickity.pkgd.min.js", function (response, status) {
					$($id).flickity({
						cellAlign: 'left',
						freeScroll: true,
						prevNextButtons: false,
						resize: true,
						initialIndex: $index,
						pageDots: false
					});
				});
			}
		}
	},
	'alert': {
		'success': function ($id, $tips) {
			$($id).html('<div class="alert alert-success fade in"><a href="#" class="close" data-dismiss="alert">&times;</a><strong>成功！</strong>' + $tips + '</label>');
		},
		'warning': function ($id, $tips) {
			$($id).html('<div class="alert alert-warning fade in"><a href="#" class="close" data-dismiss="alert">&times;</a><strong>警告！</strong>' + $tips + '</label>');
		}
	},
	'language': {
		's2t': function () {
			if (feifei.browser.language == 'zh-hk' || feifei.browser.language == 'zh-tw') {
				$.getScript("http://cdn.feifeicms.co/jquery/s2t/0.1.0/s2t.min.js", function (data, status, jqxhr) {
					$(document.body).s2t();
				});
			}
		},
		't2s': function () {
			if (feifei.browser.language == 'zh-cn') {
				$.getScript("http://cdn.feifeicms.co/jquery/s2t/0.1.0/s2t.min.js", function (data, status, jqxhr) {
					$(document.body).t2s();
				});
			}
		}
	},
	'page': {
		'more': function () {
			$('body').on('click', '.ff-page-more', function () {
				$this = $(this);
				$page = $(this).attr('data-page') * 1 + 1;
				$id = $this.attr('data-id');
				$.get($(this).attr('data-url') + $page, function (data) {
					if (data) {
						$("#" + $id).append(data);
						$this.attr('data-page', $page);
					} else {
						$("#ff-page-more").hide();
						$(this).unbind("click");
					}
				}, 'html');
			});
		},
		'keydown': function () {
			prev = $('#ff-prev').attr("href");
			next = $('#ff-next').attr("href");
			$("body").keydown(function (event) {
				if (event.keyCode == 37 && prev != undefined) location = prev;
				if (event.keyCode == 39 && next != undefined) location = next;
			});
		}
	},
	'search': {
		'submit': function () {
			$("#ff-search button").on("click", function () {
				$action = $(this).attr('data-action');
				if ($action) {
					$("#ff-search").attr('action', $action);
				}
			});
			$("#ff-search").on("submit", function () {
				$action = $(this).attr('action');
				if (!$action) {
					$action = cms.root + 'seacher.php';
				}
				$wd = $('#ff-search #ff-wd').val();
				if ($wd) {
					location.href = $action.replace('FFWD', encodeURIComponent($wd));
				} else {
					$("#ff-wd").focus();
					$("#ff-wd").attr('data-toggle', 'tooltip').attr('data-placement', 'bottom').attr('title', '请输入关键字').tooltip('show');
				}
				return false;
			});
		},
		'keydown': function () {
			$("#ff-search input").keyup(function (event) {
				if (event.keyCode == 13) {
					location.href = cms.root + 'index.php?s=vod-search-wd-' + encodeURIComponent($('#ff-search #ff-wd').val()) + '-p-1.html';
				}
			});
		},
		'autocomplete': function () {
			$.ajaxSetup({
				cache: true
			});
			$.getScript("http://cdn.bootcss.com/jquery.devbridge-autocomplete/1.2.26/jquery.autocomplete.min.js", function (response, status) {
				$('#ff-wd').autocomplete({
					serviceUrl: cms.root + 'index.php?s=search-vod',
					params: {
						'limit': 10
					},
					paramName: 'wd',
					maxHeight: 400,
					transformResult: function (response) {
						var obj = $.parseJSON(response);
						return {
							suggestions: $.map(obj.data, function (dataItem) {
								return {
									value: dataItem.vod_name,
									data: dataItem.vod_link
								};
							})
						};
					},
					onSelect: function (suggestion) {
						location.href = suggestion.data;
					}
				});
			});
		},
		'hot': function () {
			$("#ff-site-hot").load(cms.root + "index.php?s=ajax-site_hot");
		}
	},
	'image': {
		'lazyload': function () {
			$.ajaxSetup({
				cache: true
			});
			$.getScript("http://cdn.bootcss.com/jquery_lazyload/1.9.7/jquery.lazyload.min.js", function (response, status) {
				$("img.ff-img").lazyload({
					placeholder: cms.root + "Public/images/no.jpg",
					effect: "fadeIn",
					failurelimit: 15
				});
			});
		},
		'qrcode': function () {
			$(".glyphicon-phone").popover({
				html: true
			});
			$(".glyphicon-phone").on('show.bs.popover', function () {
				$(".glyphicon-phone").attr('data-content', '<img src="http://cdn.feifeicms.co/qrcode/1.0/?w=150&h=150&url=' + encodeURIComponent(feifei.browser.url) + '"/>');
			})
		},
		'vcode': function () {
			return '<label><img class="ff-vcode-img" src="' + cms.root + 'index.php?s=Vcode-Index"></label>';
		},
		'slide': function () {
			$('#ff-slide').carousel({
				interval: $('#ff-slide').attr('data-interval')
			});
		}
	},
	'vcode': {
		'load': function () {
			feifei.vcode.focus();
			feifei.vcode.click();
		},
		'focus': function () {
			$('body').on("focus", ".ff-vcode", function () {
				$(this).removeClass('ff-vcode').parent().after(feifei.image.vcode());
				$(this).unbind();
			});
		},
		'click': function () {
			$('body').on('click', 'img.ff-vcode-img', function () {
				$(this).attr('src', cms.root + 'index.php?s=Vcode-Index');
			});
		}
	},
	'updown': {
		'click': function () {
			$('body').on('click', 'a.ff-updown', function (e) {
				var $this = $(this);
				if ($(this).attr("data-id")) {
					$.ajax({
						url: cms.root + 'index.php?s=updown-' + $(this).attr("data-module") + '-id-' + $(this).attr("data-id") + '-type-' + $(this).attr("data-type"),
						cache: false,
						dataType: 'json',
						success: function (json) {
							$this.addClass('disabled');
							if (json.status == 1) {
								if ($this.attr("data-type") == 'up') {
									$this.find('.ff-updown-tips').html(json.data.up);
								} else {
									$this.find('.ff-updown-tips').html(json.data.down);
								}
							} else {
								$this.attr('title', json.info);
								$this.tooltip('show');
							}
						}
					});
				}
			});
		}
	},
	'record': {
		'load': function () {
			feifei.record.get();
			feifei.record.set();
			feifei.record.btn();
		},
		'get': function () {
			if ($(".ff-record-vod").attr('data-content') != undefined) {
				$.get(cms.root + 'index.php?g=home&m=record&a=vod&sid=1', function (data) {
					if (data == '') {
						data = '暂无观看记录';
					}
					$(".ff-record-vod").attr('data-content', data);
				});
				$(".ff-record-vod").popover();
			}
		},
		'set': function () {
			if ($(".ff-record-set").attr('data-sid')) {
				$.get(cms.root + 'index.php?g=home&m=record&a=post&type=1&sid=' + $(".ff-record-set").attr("data-sid") + '&did=' + $(".ff-record-set").attr("data-id") + '&did_sid=' + $(".ff-record-set").attr("data-id-sid") + '&did_pid=' + $(".ff-record-set").attr("data-id-pid"));
			}
		},
		'btn': function () {
			$('body').on('click', 'a.ff-record', function (e) {
				if (cms.userforum == 1 && cms.userid < 1) {
					feifei.user.login();
					return false;
				}
				var $this = $(this);
				if ($(this).attr("data-id")) {
					$.ajax({
						url: cms.root + 'index.php?g=home&m=record&a=post&sid=' + $(this).attr("data-sid") + '&did=' + $(this).attr("data-id") + '&type=' + $(this).attr("data-type"),
						cache: false,
						dataType: 'json',
						success: function (json) {
							if (json.status == 200) {
								$this.addClass('disabled');
							} else {
								$this.attr('title', json.info);
								$this.tooltip('show');
							}
						}
					});
				}
			});
		}
	},
	'star': {
		'raty': function () {
			$.ajaxSetup({
				cache: true
			});
			if ($("#ff-raty").length) {
				$("<link>").attr({
					rel: "stylesheet",
					type: "text/css",
					href: "http://cdn.bootcss.com/raty/2.7.1/jquery.raty.min.css"
				}).appendTo("head");
				$.getScript("http://cdn.bootcss.com/raty/2.7.1/jquery.raty.min.js", function (response, status) {
					$('#ff-raty').raty({
						starType: 'i',
						number: 5,
						numberMax: 5,
						half: true,
						score: function () {
							return $(this).attr('data-score');
						},
						click: function (score, evt) {
							$.ajax({
								type: 'get',
								url: cms.root + 'index.php?s=gold-' + $('#ff-raty').attr('data-module') + '-id-' + $('#ff-raty').attr('data-id') + '-score-' + (score * 2),
								timeout: 5000,
								dataType: 'json',
								error: function () {
									$('#ff-raty').attr('title', '网络异常！').tooltip('show');
								},
								success: function (json) {
									if (json.status == 1) {
										$('#ff-raty-tips').html(json.data.gold);
									} else {
										$('#ff-raty').attr('title', json.info).tooltip('show');
									}
								}
							});
						}
					});
				});
			}
		}
	},
	'hits': {
		'load': function () {
			$(".ff-hits").each(function (i) {
				$this = $(".ff-hits").eq(i);
				$.ajax({
					url: cms.root + 'index.php?s=hits-show-id-' + $this.attr("data-id") + '-sid-' + $this.attr("data-sid") + '-type-' + $this.attr("data-type"),
					cache: true,
					dataType: 'json',
					success: function (json) {
						$type = $(".ff-hits").eq(i).attr('data-type');
						if ($type != 'insert') {
							$('#ff-hits-' + $type).html(eval('(json.' + $type + ')'));
						}
					}
				});
			});
		}
	},
	'share': {
		'baidu': function () {
			if ($("#ff-share").length) {
				$size = $("#ff-share").attr('data-size');
				if (!$size) {
					$size = 16;
				}
				$("#ff-share").html('<div class="bdsharebuttonbox"><a href="#" class="bds_qzone" data-cmd="qzone" title="分享到QQ空间"></a><a href="#" class="bds_weixin" data-cmd="weixin" title="分享到微信"></a><a href="#" class="bds_sqq" data-cmd="sqq" title="分享到QQ好友"></a><a href="#" class="bds_tsina" data-cmd="tsina" title="分享到新浪微博"></a><a href="#" class="bds_tqq" data-cmd="tqq" title="分享到腾讯微博"></a><a href="#" class="bds_bdysc" data-cmd="bdysc" title="分享到百度云收藏"></a><a href="#" class="bds_copy" data-cmd="copy" title="分享到复制网址"></a></div>');
				window._bd_share_config = {
					"common": {
						"bdSnsKey": {},
						"bdText": "",
						"bdMini": "2",
						"bdMiniList": false,
						"bdPic": "",
						"bdStyle": "0",
						"bdSize": "" + $size + ""
					},
					"share": {}
				};
				with(document) 0[(getElementsByTagName('head')[0] || body).appendChild(createElement('script')).src = 'http://bdimg.share.baidu.com/static/api/js/share.js?v=89860593.js?cdnversion=' + ~(-new Date() / 36e5)];
			}
		}
	},
	'scenario': {
		'load': function ($max) {
			$max = $("#vod-scenario-item").attr('data-max') * 1;
			$count = $("#vod-scenario>dd").length;
			if ($count > 0 && $max > 0) {
				var $list = '<li class="col-md-2 col-xs-4"><a href="javascript:;" data-startid="1" data-endid="' + $max + '" class="ff-text">第1-' + $max + '集</a></li>';
				for ($i = 1; $i < $count; $i++) {
					if (($i + $max) > $count) {
						$max_ji = $count;
					} else {
						$max_ji = $i + $max;
					}
					if ($i % $max == 0) {
						$list += '<li class="col-md-2 col-xs-4"><a href="javascript:;" data-startid="' + ($i + 1) + '" data-endid="' + $max_ji + '">第' + ($i + 1) + '-' + $max_ji + '集</a></li>';
					}
				}
				$('#vod-scenario-item').html($list);
				feifei.scenario.tabs(1, $max);
				feifei.scenario.click();
			}
		},
		'tabs': function ($startid, $endid) {
			$(".vod-scenario-title").hide();
			$(".vod-scenario-info").hide();
			for ($i = $startid; $i <= $endid; $i++) {
				$("#vod-scenario-title-" + $i).show();
				$("#vod-scenario-info-" + $i).show();
			}
		},
		click: function () {
			$('#vod-scenario-item').on('click', 'a', function (e) {
				$startid = $(this).attr('data-startid') * 1;
				$endid = $(this).attr('data-endid') * 1;
				feifei.scenario.tabs($startid, $endid);
				$('#vod-scenario-item a').removeClass('ff-text');
				$(this).addClass('ff-text');
			});
		}
	},
	'forum': {
		'load': function () {
			if ($('.ff-forum-reload').html()) {
				feifei.forum.reload();
			} else {
				feifei.forum.comment();
			}
			$(".ff-forum").on("focus", 'textarea[name=forum_content]', function () {
				if (cms.userforum == 1 && cms.userid < 1) {
					feifei.user.login();
				}
			});
		},
		'reload': function () {
			feifei.forum.form();
			feifei.forum.report();
			$("body").on("submit", '.form-forum', function () {
				feifei.forum.submit($(this), 'guestbook', false);
				return false;
			});
		},
		'comment': function () {
			$cid = $("#ff-forum").attr('data-id');
			$sid = $("#ff-forum").attr('data-sid');
			if ($cid && $sid) {
				$.ajax({
					type: 'get',
					url: cms.root + 'index.php?s=forum-config-sid-' + $sid + '-cid-' + $cid,
					timeout: 3000,
					dataType: 'json',
					error: function () {
						$("#ff-forum").html('评论加载失败');
					},
					success: function (json) {
						if (json.data.forum_type == 'uyan') {
							feifei.forum.uyan(json.data.uyan_uid);
						} else if (json.data.forum_type == 'changyan') {
							feifei.forum.changyan($sid + '-' + $cid, json.data.changyan_appid, json.data.changyan_appconf);
						} else {
							feifei.forum.show($cid, $sid, 'ajax_' + json.data.forum_module, 1);
							feifei.forum.form();
							feifei.forum.report();
							$("body").on("submit", '.form-forum', function () {
								feifei.forum.submit($(this), 'ajax_' + json.data.forum_module, 3000);
								return false;
							});
						}
					}
				});
			}
		},
		'show': function ($cid, $sid, $module, $page) {
			$.ajax({
				type: 'get',
				url: cms.root + 'index.php?s=forum-' + $module + '-sid-' + $sid + '-cid-' + $cid + '-p-' + $page,
				timeout: 3000,
				error: function () {
					$("#ff-forum").html('评论加载失败，请刷新...');
				},
				success: function ($html) {
					$("#ff-forum").html($html);
				}
			});
		},
		'report': function () {
			$('body').on('mouseenter', '#ff-forum-item .forum-title', function () {
				$(this).find('.ff-report').fadeIn();
			});
			$('body').on('mouseleave', '#ff-forum-item .forum-title', function () {
				$(this).find('.ff-report').fadeOut();
			});
			$('body').on('click', 'a.ff-report', function () {
				var $id = $(this).attr("data-id");
				if ($id) {
					$.ajax({
						type: 'get',
						url: cms.root + 'index.php?s=forum-report-id-' + $id,
						timeout: 3000,
						dataType: 'json',
						success: function (json) {
							feifei.alert.success($('.form-forum').eq(0).find('.ff-alert'), json.info);
						}
					});
				}
			});
		},
		'reply': function ($id) {
			$.ajax({
				type: 'get',
				url: cms.root + 'index.php?s=forum-reply-id-' + $id,
				timeout: 3000,
				dataType: 'json',
				success: function (json) {
					if (json.status == 200) {
						$('#ff-reply-' + $id).find('.ff-reply-tips').html(json.data);
						$('#ff-reply-' + $id).parent().find('.ff-reply-read').fadeIn();
					}
				}
			});
		},
		'form': function () {
			$('body').on('click', 'a.ff-reply', function () {
				var $id = $(this).attr("data-id");
				if ($id) {
					var $form = $($(".form-forum").eq(0).parent().html());
					$form.find("input[name='forum_pid']").val($id);
					$('#forum-reply-' + $id).html($form);
				}
			});
		},
		'submit': function ($this, $module, $timeout) {
			$.post($this.attr('action'), $this.serialize(), function (json) {
				if (json.status >= 200) {
					feifei.alert.success($this.find('.ff-alert'), json.info);
					if (json.data.forum_pid) {
						feifei.forum.reply(json.data.forum_pid);
						setTimeout(function () {
							$('#forum-reply-' + json.data.forum_pid).fadeOut('slow')
						}, 2000);
					} else {
						if (json.status == 200) {
							if ($timeout) {
								setTimeout(function () {
									feifei.forum.show(json.data.forum_cid, json.data.forum_sid, $module, 1)
								}, $timeout);
							} else {
								location.reload();
							}
						}
					}
				} else {
					feifei.alert.warning($this.find('.ff-alert'), json.info);
				}
			}, 'json');
		},
		//'uyan': function ($uid) {
			//$("#ff-forum").html('<div id="uyan_frame"></div>');

			//$.getScript("http://v2.uyan.cc/code/uyan.js?uid=" + $uid);
		//},
		'changyan': function ($sourceid, $appid, $conf) {
			var width = window.innerWidth || document.documentElement.clientWidth;
			if (width < 768) {
				$("#ff-forum").html('<div id="SOHUCS" sid="' + $sourceid + '"></div><script charset="utf-8" id="changyan_mobile_js" src="https://changyan.sohu.com/upload/mobile/wap-js/changyan_mobile.js?client_id=' + $appid + '&conf=prod_' + $conf + '"><\/script>');
			} else {
				$("#ff-forum").html('<div id="SOHUCS" sid="' + $sourceid + '"></div>');
				$.getScript("https://changyan.sohu.com/upload/changyan.js", function () {
					window.changyan.api.config({
						appid: $appid,
						conf: 'prod_' + $conf
					});
				});
			}
		}
	},
	'playurl': {
		'download': function () {
			if ($(".ff-down-list").length) {
				$.getScript("http://cdn.feifeicms.co/download/xunlei.js");
			}

			$(".vod-item-down input[type=text]").focus(function () {
				$(this).val($(this).parent().find('input[type=checkbox]').val());
			});
		},
		'tongji': function () {
			if ($("#cms_player").length) {
				$.getScript("http://cdn.feifeicms.co/tongji/3.3/");
			}
		},
		'dropdown': function () {
			if ($('.ff-dropdown .name').html()) {
				$('.ff-dropdown-content').hide();
				$($('.ff-dropdown .name').attr('data-tabid')).fadeIn("slow");
			} else {
				$('.ff-dropdown .name').html($('.ff-dropdown-menu a').eq(0).html());
				$('.ff-dropdown-content').hide();
				$('.ff-dropdown-content').eq(0).fadeIn("slow");
			}
			$('.ff-dropdown-menu').on('click', 'a', function (e) {
				$('.ff-dropdown .name').html($(this).html());
				$('.ff-dropdown-content').hide();
				$($(this).attr('data-tabid')).fadeIn("slow");
			});
		},
		'tab': function () {
			if ($('.ff-tab a').length) {
				$active_tab = $('.ff-tab-content').attr('data-tabid');
				if ($($active_tab).html()) {
					$('.ff-tab a[href="' + $active_tab + '"]').tab('show');
				} else {
					$('.ff-tab a').eq(0).tab('show');
				}
			} else {
				if ($('.ff-tab').length) {
					$('.ff-tab').remove();
				}
			}
		},
		'active': function () {
			$('.ff-tab-content a[data-id="' + $('.ff-tab-content').attr('data-active') + '"]').removeClass("btn-default").addClass("btn-success");
			$('.ff-dropdown-content a[data-id="' + $('.ff-dropdown .name').attr('data-active') + '"]').removeClass("btn-default").addClass("btn-success");
			$('.ff-item-playurl a[data-id="' + $('.ff-item-playurl').attr('data-active') + '"]').removeClass("btn-default").addClass("btn-success");
			$('.ff-item-yugao a[data-id="' + $('.ff-item-yugao').attr('data-active') + '"]').removeClass("btn-default").addClass("btn-success");
		},
		'more': function () {
			$('.vod-item-play').each(function (i) {
				$this = $(this);
				$config = $this.attr('data-more') * 1;
				$max = $this.find('li a').size();
				if (($config + 2) < $max && $config > 0) {
					$max_css = $this.find('li').attr('class');
					$max_html = '<li class="' + $max_css + '"><a class="btn btn-default btn-sm" href="#all">全部...</a></li>';
					$this.find('li').each(function (n) {
						if (n + 1 > $config) {
							$(this).hide();
						}
					});
					$this.find('li').eq($config).after($max_html);
					$this.find('li:last').show();
				}
			});
			$('.vod-item-play').on('click', 'a', function (e) {
				if ($(this).attr('href') == '#all') {
					$(this).parent().parent().find('li').show();
					$(this).parent().remove();
				}
			});
		},
		'vip_callback': function ($vod_id, $vod_sid, $vod_pid, $status, $trysee, $tips) {
			if ($status != 200) {
				if ($trysee > 0) {
					window.setTimeout(function () {
						$.get(cms.root + 'index.php?s=vod-vip-action-trysee-id-' + $vod_id + '-sid-' + $vod_sid + '-pid-' + $vod_pid, function (html) {
							$('#cms_player').html(html).removeClass("embed-responsive-4by3").css({
								"height": "auto"
							});
						}, 'html');
					}, 1000 * 60 * $trysee);
				} else {
					$('#cms-player-vip .cms-player-box').html($tips);
					$('#cms-player-vip .cms-player-iframe').hide();
					$('#cms_player').removeClass("embed-responsive-4by3").css({
						"height": "auto"
					});
					$('#cms_player').on("click", ".vod-price", function () {
						$(this).html('Loading...');
						$.get(cms.root + 'index.php?s=vod-vip-action-ispay-id-' + $vod_id + '-sid-' + $vod_sid + '-pid-' + $vod_pid, function (json) {
							if (json.status == 200) {
								location.reload();
							} else if (json.status == 500 || json.status == 501) {
								feifei.user.login();
							} else {
								$('#cms-player-vip .cms-player-box').html(json.info);
							}
						}, 'json');
					});
				}
			} else {}
		}
	},
	'user': {
		'load': function () {
			feifei.user.islogin();
			$("body").on("click", ".user-login", function () {
				feifei.user.login();
			});
		},
		'islogin': function () {
			if (cms.urlhtml == 1) {
				$.ajax({
					type: 'get',
					url: cms.root + 'index.php?s=user-info',
					timeout: 3000,
					dataType: 'json',
					success: function (json) {
						if (json.status == 200) {
							cms.userid = json.data.user_id;
							cms.username = json.data.user_name;
							$('#ff-user').html('<a class="ff-text" href="' + $('#ff-user').attr('data-href') + '">' + cms.username + '</a>');
						}
					}
				});
			}
		},
		'login': function () {
			$.ajax({
				type: 'get',
				url: cms.root + 'index.php?s=user-ajax_login',
				timeout: 3000,
				success: function ($html) {
					$("#ff-modal").html($html);
					$('.ff-modal').modal('show');
					$(".user-login-forum").on('submit', function (e) {
						$.ajax({
							url: $(this).attr('action'),
							type: 'POST',
							dataType: 'json',
							timeout: 3000,
							data: $(this).serialize(),
							beforeSend: function (xhr) {
								$('.user-login-alert').html('正在登录...');
							},
							error: function () {
								$('.user-login-alert').html('请求失败，请刷新网页。');
							},
							success: function (json) {
								if (json.status == 200) {
									location.reload();
								} else {
									$('#user-submit').html('登录');
									feifei.alert.warning('.user-login-alert', json.info);
								}
							},
							complete: function (xhr) {}
						});
						return false;
					});
				}
			});
		},
		'center': function () {
			$("body").on("click", ".user-upvip", function () {
				feifei.user.upvip();
			});
			$("body").on("click", ".user-pay", function () {
				feifei.user.pay();
			});
			$("body").on("click", ".user-change-email", function () {
				feifei.user.email();
			});
			$("body").on("click", ".user-change-pwd", function () {
				feifei.user.repwd();
			});
		},
		'upvip': function () {
			$.ajax({
				type: 'get',
				url: cms.root + 'index.php?s=user-ajax_upvip',
				timeout: 3000,
				success: function ($html) {
					$("#ff-modal").html($html);
					$('.ff-modal').modal('show');
					$(".user-upvip-form").on('submit', function (e) {
						$.ajax({
							url: $(this).attr('action'),
							type: 'POST',
							dataType: 'json',
							timeout: 3000,
							data: $(this).serialize(),
							beforeSend: function (xhr) {
								$('.user-upvip-alert').html('Loading...');
							},
							error: function () {
								$('.user-upvip-alert').html('请求失败，请刷新网页。');
							},
							success: function (json) {
								if (json.status == 200) {
									feifei.alert.success('.user-upvip-alert', '升级完成，谢谢支持。');
									setTimeout(function () {
										location.reload();
									}, 2000);
								} else if (json.status == 404) {
									feifei.alert.success('.user-upvip-alert', '请先登录。');
									setTimeout(function () {
										$(".ff-modal").modal('hide');
										$('.modal-backdrop').hide();
										feifei.user.login();
									}, 2000);
								} else if (json.status == 501) {
									feifei.alert.warning('.user-upvip-alert', '影币不足，共需要' + json.info + '个影币，请先冲值！');
									setTimeout(function () {
										$(".ff-modal").modal('hide');
										$('.modal-backdrop').hide();
										feifei.user.pay();
									}, 2000);
								} else {
									feifei.alert.warning('.user-upvip-alert', json.info);
								}
							},
							complete: function (xhr) {}
						});
						return false;
					});
				}
			});
		},
		'pay': function () {
			$.ajax({
				type: 'get',
				url: cms.root + 'index.php?s=user-ajax_pay',
				timeout: 3000,
				success: function ($html) {
					$("#ff-modal").html($html);
					$('.ff-modal').modal('show');
					$(".user-pay-form").on('submit', function (e) {
						if ($(".user-pay-form input[name=score_ext]").val() < $(".user-pay-form").attr('data-small')) {
							feifei.alert.warning('.user-pay-alert', '每次至少充值<strong>' + $(".user-pay-form").attr('data-small') + '</strong>元');
							return false;
						}
						setTimeout(function () {
							$(".ff-modal").modal('hide');
							$('.modal-backdrop').hide();
						}, 5000);
					});
				}
			});
		},
		'email': function () {
			$.ajax({
				type: 'get',
				url: cms.root + 'index.php?s=user-ajax_email',
				timeout: 3000,
				success: function ($html) {
					$("#ff-modal").html($html);
					$('.ff-modal').modal('show');
					$(".user-email-form").on('submit', function (e) {
						$.ajax({
							url: $(this).attr('action'),
							type: 'POST',
							dataType: 'json',
							timeout: 3000,
							data: $(this).serialize(),
							beforeSend: function (xhr) {
								$('.user-email-alert').html('Loading...');
							},
							error: function () {
								$('.user-email-alert').html('请求失败，请刷新网页。');
							},
							success: function (json) {
								if (json.status == 200) {
									feifei.alert.success('.user-email-alert', '邮箱修改完成。');
									setTimeout(function () {
										location.reload();
									}, 2000);
								} else if (json.status == 404) {
									feifei.alert.success('.user-email-alert', '请先登录。');
									setTimeout(function () {
										$(".ff-modal").modal('hide');
										$('.modal-backdrop').hide();
										feifei.user.login();
									}, 2000);
								} else {
									feifei.alert.warning('.user-email-alert', json.info);
								}
							},
							complete: function (xhr) {}
						});
						return false;
					});
				}
			});
		},
		'repwd': function () {
			$.ajax({
				type: 'get',
				url: cms.root + 'index.php?s=user-ajax_repwd',
				timeout: 3000,
				success: function ($html) {
					$("#ff-modal").html($html);
					$('.ff-modal').modal('show');
					$(".user-repwd-form").on('submit', function (e) {
						$.ajax({
							url: $(this).attr('action'),
							type: 'POST',
							dataType: 'json',
							timeout: 3000,
							data: $(this).serialize(),
							beforeSend: function (xhr) {
								$('.user-repwd-alert').html('Loading...');
							},
							error: function () {
								$('.user-repwd-alert').html('请求失败，请刷新网页。');
							},
							success: function (json) {
								if (json.status == 200) {
									feifei.alert.success('.user-repwd-alert', '密码修改完成。');
									setTimeout(function () {
										location.reload();
									}, 2000);
								} else if (json.status == 404) {
									feifei.alert.success('.user-repwd-alert', '请先登录。');
									setTimeout(function () {
										$(".ff-modal").modal('hide');
										$('.modal-backdrop').hide();
										feifei.user.login();
									}, 2000);
								} else {
									feifei.alert.warning('.user-repwd-alert', json.info);
								}
							},
							complete: function (xhr) {}
						});
						return false;
					});
				}
			});
		}
	},
	'cms': {
		'content': function () {
			$('body').on('click', '#ff-content-more', function () {
				if ($($(this).attr('data-target')).css('display') == 'none') {
					$(this).html('收起');
					$($(this).attr('data-target')).show();
					$($(this).attr('data-target') + '-remrk').hide();
				} else {
					$(this).html('详情');
					$($(this).attr('data-target')).hide();
					$($(this).attr('data-target') + '-remrk').show();
				}
			});
		},
		'nav': function ($id) {
			$id = $('[data-dir]').attr('data-dir');
			$($id).addClass("active");
		}
	},
	'scroll': {
		'fixed': function ($id, $top, $width) {
			var offset = $('#' + $id).offset();
			if (offset) {
				if (!$top) {
					$top = 5;
				}
				if (!$width) {
					$width = $('#' + $id).width();
				}
				$(window).bind('scroll', function () {
					if ($(this).scrollTop() > offset.top) {
						$('#' + $id).css({
							"position": "fixed",
							"top": $top + "px",
							"width": $width + "px"
						});
					} else {
						$(('#' + $id)).css({
							"position": "relative"
						});
					}
				});
			}
		}
	}
};
$(document).ready(function () {
	if (feifei.browser.useragent.mobile) {
		feifei.mobile.jump();
		feifei.mobile.nav();
		feifei.mobile.goback();
		feifei.mobile.flickity(".ff-gallery", 0);
	}
	feifei.user.load();
	feifei.cms.nav();
	feifei.cms.content();
	feifei.search.submit();
	feifei.search.keydown();
	feifei.search.autocomplete();
	feifei.search.hot();
	feifei.image.lazyload();
	feifei.image.slide();
	feifei.image.qrcode();
	feifei.playurl.tongji();
	feifei.playurl.tab();
	feifei.playurl.dropdown();
	feifei.playurl.active();
	feifei.playurl.more();
	feifei.playurl.download();
	feifei.page.more();
	feifei.page.keydown();
	feifei.updown.click();
	feifei.star.raty();
	feifei.scenario.load();
	feifei.forum.load();
	feifei.vcode.load();
	feifei.user.center();
	feifei.record.load();
	feifei.hits.load();
	feifei.share.baidu();
});
