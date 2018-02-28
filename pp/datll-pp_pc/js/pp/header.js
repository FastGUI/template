! function (t) {
	function e(o) {
		if (i[o]) return i[o].exports;
		var n = i[o] = {
			"i": o,
			"l": !1,
			"exports": {}
		};
		return t[o].call(n.exports, n, n.exports, e), n.l = !0, n.exports
	}
	var i = {};
	e.m = t, e.c = i, e.i = function (t) {
		return t
	}, e.d = function (t, i, o) {
		e.o(t, i) || Object.defineProperty(t, i, {
			"configurable": !1,
			"enumerable": !0,
			"get": o
		})
	}, e.n = function (t) {
		var i = t && t.__esModule ? function () {
			return t["default"]
		} : function () {
			return t
		};
		return e.d(i, "a", i), i
	}, e.o = function (t, e) {
		return Object.prototype.hasOwnProperty.call(t, e)
	}, e.p = "", e(e.s = 24)
}([function (t, e) {
	t.exports = window.jQuery
}, function (t, e) {
	var i = {};
	t.exports = {
		"HEADER_URL": i,
		"COMMON_VERSION": "web common 1.0.1"
	}
}, function (module, exports, __webpack_require__) {
	function User() {
		this.readInfo(!0), this.init()
	}
	var cookie = window.Cookies,
		$ = __webpack_require__(0),
		infoKeys = __webpack_require__(3),
		isClient = $.ppUtils.isClient(),
		clientCommon = isClient ? clientCommon : {},
		encode = encodeURIComponent,
		baseCookieObj = {
			"domain": "pptv.com",
			"path": "/"
		},
		domain = "pptv.com",
		path = "/",
		loginDefer = $.Deferred(),
		logoutDefer = $.Deferred(),
		loginPromise = $.when(loginDefer),
		logoutPromise = $.when(logoutDefer);
	User.prototype = {
		"constructor": User,
		"info": {},
		"isLogined": !1,
		"init": function () {
			var t = this;
			if (!isClient) {
				t.white();
				var e = window.player || window.PLAYER;
				t.loginEvents.add(function () {
					if (t.white(!0), e || (e = window.player || window.PLAYER), e && e.onNotification) {
						var i = {
							"ppToken": encode(cookie.get("ppToken")),
							"PPKey": encode(cookie.get("PPKey")),
							"PPName": encode(cookie.get("PPName")),
							"UDI": encode(cookie.get("UDI"))
						};
						e.onNotification({
							"header": {
								"type": "userinfo"
							},
							"body": {
								"data": i
							}
						})
					}
				}), t.logoutEvents.add(function () {
					cookie.remove("ppi", "pptv.com", "/"), e || (e = window.player || window.PLAYER), e && e.onNotification && e.onNotification({
						"header": {
							"type": "userinfo"
						},
						"body": {
							"data": {}
						}
					})
				})
			}
		},
		"readInfo": function (notify) {
			var self = this,
				udi = cookie.get("UDI"),
				ppName = cookie.get("PPName");
			if (null == udi || null == ppName) {
				if (!(isClient && clientCommon && clientCommon.userIsLogin())) return notify && (this.logoutEvents.fire(), logoutDefer.resolve()), this.info;
				var passport = external.GetObject("@pplive.com/passport;1");
				this.info["UserName"] = passport.userName, this.info["Nickname"] = passport.nickName, this.info["HeadPic"] = passport.facePictureURL, this.info["isVip"] = passport.isVipUser
			} else {
				'"' === udi[0] && (udi = udi.slice(1, -1));
				for (var infoList = udi.replace(/\+/g, "%20").replace(/\%/g, "%25").split("$"), i = 0; i < infoList.length; i++) this.info[infoKeys[i]] = infoList[i];
				try {
					this.info["vipValidate"] = eval("a =" + (this.info["vipValidate"] || "{}"))
				} catch (e) {
					this.info["vipValidate"] = eval("a =" + (this.info["vipGrade"] || "{}"))
				}
				this.info["Nickname"] = decodeURIComponent(this.info["Nickname"]);
				var nameList = ppName.split("$");
				this.info["UserName"] = decodeURIComponent(nameList[0])
			}
			isClient && clientCommon && clientCommon.userIsLogin() ? this.info["token"] = decodeURIComponent(external.GetObject("@pplive.com/passport;1").token) : this.info["token"] = cookie.get("ppToken"), this.isLogined = !0, notify && ("resolved" != loginDefer.state() && "pending" != loginDefer.state() || this.loginEvents.fire(this.info), loginDefer.resolve(this.info));
			var headpic = this.info.HeadPic,
				faceDomain = "http://face.passport.pplive.com/";
			return /^https?/.test(headpic) || (this.info.HeadPic = faceDomain + headpic), this.info
		},
		"logout": function () {
			if (isClient && clientCommon) try {
				external.GetObject("@pplive.com/passport;1").Logout()
			} catch (e) {}
			return cookie.remove("PPKey", domain, path), cookie.remove("UDI", domain, path), cookie.remove("PPName", domain, path), cookie.remove("ppToken", domain, path), this.isLogined = !1, logoutDefer.resolve(), this.logoutEvents.fire(), this
		},
		"_writeInfo": function (t) {
			for (var e in t) cookie.set(e, t[e], 7, domain, path)
		},
		"loginEvents": $.Callbacks(),
		"logoutEvents": $.Callbacks(),
		"onLogin": function (t) {
			return loginPromise.then(t), this.loginEvents.add(t), this
		},
		"onLogout": function (t) {
			return logoutPromise.then(t), this.logoutEvents.add(t), this
		},
		"white": function (t) {
			function e() {
				var t;
				try {
					if (navigator.userAgent.indexOf("IE") > -1) t = new ActiveXObject("PPLive.Lite"), s = t.getDiskID();
					else if (window.navigator.mimeTypes["application/x-pptv-plugin"]) {
						var e = "PPTVPlayer_plugin_detect_" + +new Date,
							i = document.createElement("div");
						i.style.cssText = "width:1px;height:1px;line-height:0px;font-size:0px;overflow:hidden;", i.innerHTML = '<object width="1px" height="1px" id="' + e + '" type="application/x-pptv-plugin"><param value="false" name="enableupdate"><param value="false" name="enabledownload"><param name="type" value="2"/></object>', document.body.appendChild(i), t = document.getElementById(e), s = t.getDiskID()
					}
					a.resolve()
				} catch (e) {
					$.ppXHR.JSONP({
						"url": "http://127.0.0.1:9000/synacast.json",
						"cache": !0,
						"async": !0,
						"timeout": 1e3,
						"jsonp": "cb",
						"jsonpCallback": "synacast_json",
						"success": function (t) {
							s = t.k, a.resolve()
						},
						"error": function () {
							a.resolve()
						}
					})
				}
			}
			var i = this,
				o = cookie.get("ppi"),
				n = " ";
			if (t || !o) {
				var s, a = $.Deferred();
				e(), a.then(function () {
					var t = null;
					void 0 !== s ? (n += "?b=" + encode(s), (t = i.info["UserName"] ? i.info["UserName"] : null) && (n += "&a=" + encode(t))) : (t = i.info["UserName"] ? i.info["UserName"] : null) && (n += "?a=" + encode(t)), window.wn = window.wn || function () {}, $.ppXHR.JSONP({
						"url": n,
						"cache": !0,
						"async": !0,
						"jsonpCallback": "pptv_get_ppi",
						"success": function (t) {
							t.ppi && cookie.set("ppi", t.ppi, 1, "pptv.com", "/")
						}
					})
				})
			}
		}
	};
	var instance;
	module.exports = function () {
		return instance || (window.ppUser = instance = new User, instance)
	}()
}, function (t, e) {
	var i = ["Gender", "PpNum", "ExpNum", "LevelName", "NextLevelName", "NextLevelExpNum", "Area", "Subscribe", "UnreadNotes", "HeadPic", "Email", "OnlineTime", "Birthday", "BlogAddress", "Signed", "Type", "Nickname", "isVip", "VipDate", "IsNoad", "NoadDate", "IsSpdup", "SpdupDate", "IsRtmp", "RtmpDate", "IsUgspeed", "UgspeedDate", "vipGrade", "vipValidate"];
	t.exports = i
}, function (t, e, i) {
	function o() {
		this._cssopts = {
			"width": "100%",
			"height": "100%",
			"visibility": "hidden",
			"position": "fixed",
			"background": "url(http://sr3.pplive.com/cms/35/12/15d6d4b8631293b665ace91c49c04aad.png) repeat",
			"top": "0",
			"left": "0",
			"margin-top": "0",
			"margin-left": "0",
			"z-index": 1e4
		}, this.param = {
			"type": "login"
		}, this.urls = {
			"standard": "http://pub.aplus.pptv.com/wwwpub/weblogin",
			"mobile": "http://pub.aplus.pptv.com/phonepub/mobilogin",
			"mobile_web": "http://pub.aplus.pptv.com/wwwpub/weblogin/mobilelogin",
			"mobile_web_nosns": "http://pub.aplus.pptv.com/wwwpub/weblogin/mobilelogin",
			"mini": "http://pub.aplus.pptv.com/wwwpub/minilogin",
			"h5Log": "http://i.pptv.com/h5user/login",
			"h5Reg": "http://i.pptv.com/h5user/register",
			"tiny": "http://app.aplus.pptv.com/zt/2013/cwpd/plogin",
			"empty": "about:blank"
		}, this.st = a(l).scrollTop(), this.sl = a(l).scrollLeft();
		var t = l.createElement("div"),
			e = d ? a(window).width() : "400",
			i = d ? a(window).height() : "500";
		t.setAttribute("class", "layer loginlayer"), t.id = "layer_" + +new Date;
		var o = ["left: 0", "top: 0", "opacity: 0", "z-index: -1", "width: 100%", "border: 0px", "height: 100%", "display: block", "position:absolute", "filter:progid:DXImageTransform.Microsoft.Alpha(opacity=0)"].join(";"),
			n = ["overflow: visible", "z-index: 2", "top: 50%", "left: 50%", "position: absolute", "margin-top: " + -i / 2 + "px", "margin-left: " + -e / 2 + "px", "width: " + e + "px", "height: " + i + "px"].join(";");
		t.innerHTML = ["<iframe src='about:blank' frameborder='0' style='" + o + "'></iframe>", "<iframe id='iframe' src='" + this.urls.empty + "' style='" + n + "' scrolling='no' frameborder='0'></iframe>"].join(""), this.wp_div = t
	}
	var n, s = window.Cookies,
		a = i(0),
		r = a.browser,
		l = document,
		p = a.ppUtils.isClient(),
		c = p ? c : {},
		d = r["MOBILE"] && !r["IPAD"],
		h = !0,
		u = window.location.href;
	ipadPlayer = function (t) {
		var e = a("video");
		0 !== e.length && ("hidden" == t ? e.each(function () {
			a(this).attr("_controls", a(this).attr("controls")), a(this).removeAttr("controls")
		}) : e.each(function () {
			a(this).attr("controls", a(this).attr("_controls"))
		}))
	};
	try {
		l.domain = "pptv.com"
	} catch (err) {}
	p && c && (c.onLogin(function () {
		var t = setInterval(function () {
			ppUser.readInfo(!0), clearInterval(t)
		}, 1e3)
	}), c.onLogout(function () {
		ppUser.logout()
	}));
	var f = {
		"success": function (t) {
			if (t) {
				for (var e in t) document.cookie = e + "=" + t[e] + "; expires=; domain=pptv.com; path=/";
				n && n()
			}
		},
		"login": function () {
			ppsdk.login({
				"autologin": !1,
				"success": function (t) {
					f.success(t)
				},
				"error": function (t, e) {
					alert("登录失败")
				},
				"cancel": function () {}
			})
		},
		"regist": function () {
			ppsdk.register({
				"success": function (t) {
					f.success(t)
				},
				"error": function (t, e) {
					alert("注册失败")
				},
				"cancel": function () {}
			})
		}
	};
	o.prototype = {
		"constructor": o,
		"isLogined": function () {
			return p && c ? c.userIsLogin() : !(!s.get("PPName") || !s.get("UDI"))
		},
		"init": function (t, e, i) {
			var o = this.wp_div;
			n = e, u.match(/\?plt=app/gi) && (h = !1, a.ppUtils.loadScript(" ", function () {
				ppsdk.config({
					"api": [],
					"signature": "",
					"debug": !0
				}), ppsdk.error(function (t, e) {}), ppsdk.ready(function () {
					"login" == t.type ? f.login() : f.regist()
				})
			}));
			var s = this,
				m = a.extend({
					"target": d ? "new" : "iframe",
					"back": window.location.href
				}, this.param, t, {
					"mobile": Number(d)
				});
			m.tab = m.type;
			var v;
			if (v = r.MOBILE ? r.IPHONE ? 208000200020 : r.ANDROID ? 208000200040 : r.IPAD ? 208000200030 : 2080002e5 : "windows" === r.OS ? 208000103001 : 208000100010, m.snchannel = v, p && c) return void("login" == m.type ? c.showLoginBox() : "reg" == m.type && c.showRegBox());
			l.body.appendChild(o), a(o).css(this._cssopts);
			var g;
			r["IPAD"] && (a("body").css({
				"overflow": "hidden",
				"height": window.innerHeight
			}), a(window).scrollTop("0"), g = function () {
				a(window).scrollTop("0")
			}, a(window).bind("touchmove", g)), o.style.cssText = "width:0; height:0;overflow:hidden";
			var y = a("#iframe");
			if (y.on("load", function () {
					if (navigator.userAgent.indexOf("MSIE") > -1) a(this).height(500);
					else {
						var t = this.contentDocument;
						a(this).height(a(t).find("body").height())
					}
				}), window["iframehide"] = function () {
					o.style.visibility = "hidden", a(o).css({
						"width": "0",
						"height": "0"
					}), ipadPlayer("visible")
				}, this.isLogined()) return void ppUser.readInfo(!0);
			if (st = a(l).scrollTop(), sl = a(l).scrollLeft(), h && y.length > 0) {
				var _;
				_ = d ? "login" == t["type"] ? "h5Log" : "h5Reg" : "standard", m.hasOwnProperty("size") && (_ = m["size"]), y[0].src = this.urls[_] + "?" + a.param(m) + ("mobile_web_nosns" == _ ? "&sns=0" : ""), d && "new" == m.target && (window.location.href = y[0].src), this._cssopts = i ? a.extend(this._cssopts, i) : this._cssopts, "mobile_web" != _ && "mobile_web_nosns" != _ || (this._cssopts = {
					"margin-top": "0px",
					"top": (document.body.scrollTop || document.documentElement.scrollTop) + "px",
					"left": "0px",
					"width": "100%",
					"height": "100%",
					"overflow": "auto"
				}, a(o).find(".layer_close").hide()), a(o).css(this._cssopts), y.parent().css("visibility", "visible"), ipadPlayer("hidden")
			}
			window["_close_iframe"] = function () {
				a(o).css({
					"visibility": "hidden",
					"width": "0",
					"height": "0"
				}), r["IPAD"] && (a(window).unbind("touchmove", g), g = null, a("body").css({
					"overflow": "",
					"height": ""
				})), window.CustomListDialog && CustomListDialog.close(), ipadPlayer("visible"), s.LoginWhenClose && !0 === s.LoginWhenClose.loginNeed && (s.onSuccess("success", s.LoginWhenClose.from), delete s.onCloseLogin)
			}, window.XMLHttpRequest || (a(o).css({
				"position": "absolute",
				"width": a(window).width() + "px",
				"height": a(window).height() + "px",
				"background": "none"
			}), a(btn_close).css({
				"position": "absolute"
			}))
		},
		"check": function (t, e, i) {
			var o = this.isLogined();
			e && (e.from && (this.success[e.from] = t), e.size in urls && (size = e.size)), o ? t && "function" == typeof t && t() : this.init(e, i)
		},
		"hide": function () {
			l.body.removeChild(this.wp_div)
		},
		"logout": function (t) {
			t && "function" == typeof t ? ppUser.onLogout(t) : ppUser.logout()
		},
		"onSuccess": function (t, e) {
			n && n(), ppUser.readInfo(!0), window.iframehide && window.iframehide(), "success" === t && this.success[e] && this.check(this.success[e])
		}
	};
	var m;
	t.exports = function () {
		return m || (window.ppLogin = m = new o, m)
	}()
}, function (t, e, i) {
	var o = i(1),
		n = i(0),
		s = function () {
			this.options = {
				"hdOperate": n("#hd-operate"),
				"tabCont": n("#hd-operate").find("ul.hd-operate-ul"),
				"hdtop": n(".g-1408-hdtop"),
				"operateDrop": "#operate-drop",
				"playHistoryTab": "#playhistory-tab",
				"favoriteTab": "#favorite-tab",
				"playHistoryWrap": "#playhistory-wrap",
				"showFavorite": null,
				"showPlayHistroy": null,
				"delPlayHistroy": null,
				"delFavorite": null,
				"icon": n("#operate-drop").find("> i"),
				"showAllBtn": ".show-all-btn",
				"loginFromHistory": ".login-from-history"
			}, this.binded = !1
		};
	s.prototype.setOptions = function (t) {
		n.extend(this.options, t)
	}, s.prototype.getHeaderStr = function () {
		return '<div style="height: 320px;" class="scrollerHandler"><dl style="position: relative; top: 0px;">'
	}, s.prototype.getBodyStr = function () {
		return '<% for(var i=0; i<data.days.length; i++){ %><% if(data.days[i].items.length > 0){ %><dt class="<%= data.days[i].dayclass %>"><%= data.days[i].day %></dt><dd><ul><% for(var j=0; j<data.days[i].items.length; j++){ %><% var item = data.days[i].items[j] %><li id="<%= item.pid %>"><% if(item._isCurrent){ %><a href="javascript:;" title="<%= item._name %>" "target="_blank"><%= item._name %></a><span class="progress"><a href="javascript:;" title="">正在播放</a><% } else { %><a href="<%= item._link %>" title="<%= item._name %>" target="_blank"><%= item._name %></a><span class="progress"><a href="javascript:;" title="0"><%= item._progress %></a><a href="<%= item._link %>" title="1" class="display"><%= item._watchEnd %></a><% } %><a href="javascript:;" title="2" class="display close" data-id="<%= item._id %>" data-pid="<%= item.pid %>" data-type="<%= item._moduleName %>"></a></span></li><% } %><i class="ui-line"></i></ul></dd><% } %><% } %>'
	}, s.prototype.getFooterStr = function (t) {
		var e = "</dl></div>";
		return e += "favorite" == t ? '<div class="pp-scroller"><div style=""></div></div>' : "<div></div>", e += '<div style="top: 0px;"></div>'
	}, s.prototype.noFavoriteComp = function () {
		return '<div data-module="favorite" class="history favorite-list hidden"><div style=""><p class="nohistory"><i class="ui-favorites"></i><span class="">暂无收藏内容</span></p></div></div>'
	}, s.prototype.noPlayHistoryComp = function () {
		return '<div data-module="playhistory" class="history"><div style=""><p class="nohistory"><i class="ui-history"></i><span class="">暂无观看记录</span></p></div></div>'
	}, s.prototype.noShortComp = function () {
		return '<div data-module="playhistory" class="history"><div style=""><div style="text-align: center; line-height: 300px;">你还没有观看过长视频哦~</div></div></div>'
	}, s.prototype.showAllText = function (t) {
		var e = '<iframe class="show-all-btn"></iframe>';
		return e += t ? '<div class="show-all-btn" id="show-all-btn">查看全部</div>' : '<div class="show-all-btn login-from-history" id="show-all-login-btn">登录查看全部</div>'
	}, s.prototype.mouseEvents = function (t) {
		var e, i = this;
		i.binded || (this.options.tabCont.on("mouseenter", "li", function (t) {
			i.lock = !0, clearTimeout(e);
			var o = n(this),
				s = o.find("a").attr("data-module");
			n(i.options.operateDrop).find("div.history").each(function (t, e) {
				n(e).hide()
			}), n(i.options.operateDrop).show(), n(i.options.operateDrop).find("div.history[data-module='" + s + "']").show(), "playhistory" == s ? (n(i.options.showAllBtn).show(), i.options.showPlayHistroy(), n(i.options.playHistoryTab).parent().addClass("now"), n(i.options.favoriteTab).parent().removeClass("now")) : "favorite" == s && (n(i.options.showAllBtn).hide(), i.options.showFavorite(), n(i.options.favoriteTab).parent().addClass("now"), n(i.options.playHistoryTab).parent().removeClass("now")), i.iconPosition(o)
		}).on("mouseleave", "li", function (t) {
			i.lock && (clearTimeout(e), e = setTimeout(function () {
				n(i.options.operateDrop).find("div.history").each(function (t, e) {
					n(e).hide()
				}), n(i.options.operateDrop).hide(), n(i.options.playHistoryTab).parent().removeClass("now"), n(i.options.favoriteTab).parent().removeClass("now")
			}, 600), i.lock = !1)
		}).on("touchstart", function (t) {
			t.stopPropagation()
		}), n(i.options.operateDrop).on("mouseenter", function (t) {
			clearTimeout(e)
		}).on("mouseleave", function (t) {
			clearTimeout(e), e = setTimeout(function () {
				n(i.options.operateDrop).find("div.history").each(function (t, e) {
					n(e).hide()
				}), n(i.options.operateDrop).hide(), n(i.options.playHistoryTab).parent().removeClass("now"), n(i.options.favoriteTab).parent().removeClass("now")
			}, 600)
		}).on("touchstart", function (t) {
			t.stopPropagation()
		}), n(this.options.showAllBtn) && n(document).on("click", this.options.showAllBtn, function () {
			setTimeout(function () {
				location.href = o.HEADER_URL.PASSPORT_USERCENTER_PLAYHISTORY
			}, 500)
		}), n(this.options.loginFromHistory) && window.ppLogin && n(document).on("click", this.options.loginFromHistory, function () {
			window.ppLogin.init({
				"type": "login",
				"from": "web_topnav",
				"app": ""
			})
		})), i.binded = !0;
		var s;
		n(i.options.operateDrop).find(t).on("mouseenter", "li", function (t) {
			s && s.removeClass("hover"), s = n(this).addClass("hover")
		}).on("mouseleave", "li", function (t) {
			s.removeClass("hover")
		}).on("click", "a.close", function (t) {
			var e = n(this).attr("data-id"),
				o = n(this).attr("data-type");
			"playhistory" == o ? i.options.delPlayHistroy({
				"id": e
			}) : "favorite" == o && i.options.delFavorite({
				"id": e
			})
		}).on("touchstart", function (t) {
			t.stopPropagation()
		})
	}, s.prototype.iconPosition = function (t) {
		var e = t.offset().left,
			i = this.options.hdtop.outerWidth(),
			o = this.options.hdtop.offset().left;
		this.options.icon.css({
			"right": i - e + o - 30
		})
	};
	var a;
	t.exports = function () {
		return a || (a = new s)
	}()
}, function (t, e, i) {
	function o() {
		this.options = {
			"moduleName": "favorite",
			"len": 12
		}
	}
	var n = i(7),
		s = i(0),
		a = i(2);
	o.prototype.dataParse = function (t, e) {
		s.extend(this.options, e);
		var i = this,
			o = [{
				"dayclass": "type1",
				"day": "今天",
				"items": []
			}, {
				"dayclass": "type1",
				"day": "昨天",
				"items": []
			}, {
				"dayclass": "type2",
				"day": "一周内",
				"items": []
			}, {
				"dayclass": "type1",
				"day": "更早",
				"items": []
			}],
			r = new Date;
		s.each(t, function (t, e) {
			if (t < i.options.len) {
				i.videoDataFilter(e);
				var s = new Date(parseInt(e._mt.slice(0, 13))),
					a = n.dateDiff("d", s, r);
				0 == a ? o[0].items.push(e) : 1 == a ? o[1].items.push(e) : a < 7 ? o[2].items.push(e) : o[3].items.push(e)
			}
		});
		var l = !(!a || !a.isLogined),
			p = {
				"days": [],
				"filter_short": "0",
				"isLogined": l
			};
		return s.each(o, function (t, e) {
			e.items.length > 0 && p.days.push(e)
		}), p
	}, o.prototype.videoDataFilter = function (t) {
		var e = 0 == t.Duration ? 0 : (parseInt(t.Pos) / parseInt(t.Duration) * 100).toFixed(0),
			i = parseInt(e) > 95;
		t._watchEnd = i ? "重播" : "续播", t.pid = "pid_" + t.Id + "_" + parseInt(100 * Math.random());
		var o = new Date(parseInt(t._mt));
		"favorite" == this.options.moduleName ? t._progress = o.getFullYear() + "/" + (o.getMonth() + 1) + "/" + o.getDate() : "playhistory" == this.options.moduleName && (t._progress = i ? "看完" : "看到" + e + "%"), t._link = this.watchLink(t).link + "&rcc_src=" + this.options.rcc_src, t._isCurrent = this.watchLink(t).current, t._name = t.Name || t.SubName, t._moduleName = this.options.moduleName, t._id = t.index || t.Id || t.SubId
	}, o.prototype.watchLink = function (t) {
		var e = window.webcfg || {},
			i = Number(t.Pos) >= Number(t.Duration);
		return {
			"link": "http://v.pptv.com/show/" + (t.link || t.Link) + ".html" + (i ? "?" : "?rcc_starttime=" + t.Pos),
			"current": e.id == (t.Id || t.SubId) && e.pid == t.Id
		}
	};
	var r;
	t.exports = function () {
		return r || (r = new o)
	}()
}, function (t, e) {
	var i = function () {};
	i.prototype.dateDiff = function (t, e, i) {
		var o = e,
			n = {},
			s = o.getTime(),
			a = i.getTime();
		return n["y"] = i.getFullYear() - o.getFullYear(), n["q"] = 4 * n["y"] + Math.floor(i.getMonth() / 4) - Math.floor(o.getMonth() / 4), n["m"] = 12 * n["y"] + i.getMonth() - o.getMonth(), n["ms"] = i.getTime() - o.getTime(), n["w"] = Math.floor((a + 3456e5) / 6048e5) - Math.floor((s + 3456e5) / 6048e5), n["d"] = Math.floor(a / 864e5) - Math.floor(s / 864e5), n["h"] = Math.floor(a / 36e5) - Math.floor(s / 36e5), n["n"] = Math.floor(a / 6e4) - Math.floor(s / 6e4), n["s"] = Math.floor(a / 1e3) - Math.floor(s / 1e3), n[t]
	}, i.prototype.jsAddScript = function (t, e, i) {
		e = e || window.document;
		var o = e.createElement("script");
		o.type = "text/javascript", o.src = t, e.body.appendChild(o);
		var n = "Microsoft Internet Explorer" == navigator.appName,
			s = navigator.appVersion.match(/MSIE\s*(\d*\.\d*)/i);
		n && s && Number(s[1]) < 9 ? o.onreadystatechange = function () {
			var t = o.readyState;
			"loaded" !== t && "complete" !== t || (o.onreadystatechange = null, "function" == typeof i && i())
		} : o.onload = function () {
			"function" == typeof i && i()
		}
	};
	var o;
	t.exports = function () {
		return o || (o = new i)
	}()
}, function (t, e, i) {
	var o = (i(2), i(0)),
		n = i(19),
		s = i(20),
		a = i(11),
		r = i(15),
		l = i(16),
		p = (i(4), i(12)),
		c = i(13),
		d = i(14),
		h = function (t) {
			this.options = {}
		};
	h.prototype.init = function (t) {
		o.extend({}, this.options, t), this.loginInit(), this.favoriteInit(), this.playHistoryInit(), this.navInit(), this.searchInit()
	}, h.prototype.loginInit = function () {
		$loginArea = o("#login-area");
		new p({
			"container": $loginArea
		})
	}, h.prototype.searchInit = function () {
		new l("#search_box").init()
	}, h.prototype.favoriteInit = function () {
		var t = function () {
				n.get(function (t) {
					a.render(t)
				})
			},
			e = function (t) {
				n.delItem(t["id"], function (t) {
					a.render(t)
				})
			};
		a.init({
			"loadCallback": t,
			"delFavorite": e
		})
	}, h.prototype.playHistoryInit = function () {
		var t = function () {
				s.get(function (t) {
					r.render(t)
				})
			},
			e = function (t) {
				r.reRender(s.filterShort(t))
			},
			i = function (t) {
				s.delItem(t["id"], function (t) {
					r.render(t)
				})
			};
		r.init({
			"loadCallback": t,
			"filterShort": e,
			"delPlayHistroy": i
		})
	}, h.prototype.navInit = function () {
		c.init(), d.init()
	};
	var u;
	t.exports = {
		"getInstance": function () {
			return u || (u = new h)
		}
	}
}, , function (t, e) {}, function (t, e, i) {
	var o = i(5),
		n = i(0),
		s = function () {
			this.options = {
				"operateDrop": "#operate-drop",
				"favoriteWrap": "#favorite-wrap",
				"delFavorite": null,
				"loadCallback": null
			}, this.loaded = !1, this.compiled, this.lock = !1, this.templateStr = o.getHeaderStr() + o.getBodyStr() + o.getFooterStr("favorite"), this.noLoginedTemplateStr = o.noFavoriteComp()
		};
	s.prototype.init = function (t) {
		var e = this;
		n.extend(this.options, t);
		try {
			this.compiled = _.template(this.templateStr), this.uncompiled = _.template(this.noLoginedTemplateStr)
		} catch (error) {}
		var i = function () {
				e.options.loadCallback && !e.loaded && (e.loaded = !0, e.options.loadCallback())
			},
			s = function (t) {
				e.options.delFavorite && e.options.delFavorite(t)
			};
		o.setOptions({
			"showFavorite": i,
			"delFavorite": s
		}), o.mouseEvents(e.options.favoriteWrap)
	}, s.prototype.mouseScroller = function (t) {
		if (!this.lock) {
			var e = this,
				i = n(e.options.favoriteWrap).find("div.scrollerHandler").not(".filter-container");
			i.ppScroller({
				"maxHeight": parseInt(i.attr("data-scroller-height")) || 320
			}).scroll(), this.lock = !0
		}
	}, s.prototype.render = function (t) {
		t && (0 == t.length || t["days"] && 0 == t["days"].length ? this.iHTML = this.uncompiled() : (this.iHTML = this.compiled({
			"data": t
		}), this.mouseScroller("favorite")), n(this.options.favoriteWrap).find("div").html(this.iHTML))
	};
	var a;
	t.exports = function () {
		return a || (a = new s)
	}()
}, function (t, e, i) {
	function o(t) {
		this.userInfo = ppUser.info, this.$loginContainer = s(t.container), this.$loginDrop = this.$loginContainer.find(".logined-drop"), this.$checkbox = this.$loginDrop.find(".checkbox"), this.$diamonds = this.$loginDrop.find(".diamonds"), this.$checkArea = this.$loginDrop.find(".checkarea"), this.checkInCount = 0, this.checked = !0, this.leaveCount = 0, this.serverTime = "", this.signInClickable = 1, this.USERAREA_TPL = '<dl class="cf"><dt class="headpic fl"><a href="http://i.pptv.com/" target="_blank"><img src="<%= userInfo.HeadPic %>" title="<%= userInfo.Nickname %>"></a></dt><dd class="user-icons cf"><% if(userInfo.isVip > 0){ %><a href="http://vip.pptv.com/rating/" target="_blank" title="会员享更多等级成长特权~" class="ui-vip <%= gradeClass %>"><% } %></a><a href="http://vip.pptv.com/sports" target="_blank" title="会员享更多等级成长特权~" class="ui-vip sportvip"></a></dd><dd class="mask"></dd><a class="ui-msg" href="http://passport.aplus.pptv.com/2015usercenter/msg" target="_blank"></a></dl>', this.USERBASEINFO_TPL = '<dt><a href="http://i.pptv.com" target="_blank" class="headpic"><img src="<%= userInfo.HeadPic %>" alt="" title="<%= userInfo.Nickname %>"></a></dt><dd><a href="http://i.pptv.com" target="_blank" class="username"><%= userInfo.Nickname %></a><a href="http://vip.pptv.com/rating/" target="_blank" title="会员享更多等级成长特权~" class="lv vipgrade <%= gradeClass %>"><i></i></a></dd>', this.USERCENTER_TPL = '<% _.each(result,function(v,k){ %><a href="<%= v.url %>" target="_blank"><i class="ic" style="background: url(<%= v.thumb_image %>);"></i><span><%= v.title %></span></a><% }); %>', this.DROPBOTTOM_TPL = '<% if(isVip == 0){ %><a href="http://pay.vip.pptv.com/?plt=web&amp;aid=wdh_vip/" target="_blank" class="kt">开通会员免广告看大片</a><% }else{ %><a href="http://pay.vip.pptv.com/?plt=web&amp;aid=wdh_vip/" target="_blank" class="xf">立即续费获取更多内容</a><% } %><a href="javascript:;" class="edit" id="btn-user-logout">退出登录</a><a href="http://i.pptv.com/2015usercenter/account" target="_blank" class="account">账号设置</a><% if(!!remainsStr){ %><p class="remains"><%= remainsStr %></p><% } %>';
		var e = this;
		p.onLogin(function () {
			e.init()
		}).onLogout(function () {
			e.init(), e.$loginDrop.trigger("close")
		})
	}
	var n = window.Cookies,
		s = i(0),
		a = i(1),
		r = i(18),
		l = i(17),
		p = i(22),
		c = i(7);
	o.prototype = {
		"constructor": o,
		"init": function () {
			var t = this;
			try {
				s.ppUtils.serverTimePromise(function (e) {
					t.serverTime = e || +new Date
				})
			} catch (e) {
				t.serverTime = +new Date
			}
			ppUser.isLogined ? (this.$loginContainer.find(".logined").show(), this.$loginContainer.find(".nologin").hide(), this.renderUser(), this.renderExpTotal(), this.renderUserCenter(), this.renderDropBottom(), this.renderDiamond(), this.renderCheckIn()) : (this.$loginContainer.find(".logined").hide(), this.$loginContainer.find(".nologin").show()), this.bindEvent()
		},
		"renderUser": function () {
			var t = this;
			r.getUserGrade(function (e) {
				var i = ("0" !== ppUser.info.isVip ? "vgrade" : "grade") + e.vipGrade;
				t.$loginContainer.find(".logined").html(_.template(t.USERAREA_TPL)({
					"gradeClass": i,
					"userInfo": ppUser.info
				})), t.$loginContainer.find(".baseinfo").html(_.template(t.USERBASEINFO_TPL)({
					"gradeClass": i,
					"userInfo": ppUser.info
				})), t.$webMsg = t.$loginContainer.find(".ui-msg"), t.controlWebsiteMsg(), t.controlSportIcon(), t.loginDropEvent()
			})
		},
		"renderExpTotal": function () {
			var t = this;
			r.getUserBilling(function (e) {
				var i = (e.gradeEnd - e.userCredit + .01).toFixed(2);
				t.$checkbox.find(".viplv").html(e.userGrade + "<i></i>"), t.$checkbox.find(".integral").html(e.userAvailablePoint + "<i></i>"), t.$checkbox.find(".tip1").text("您还有" + i + "天升级~"), 0 == ppUser.info.isVip && t.$checkbox.find(".viplv").removeClass("viplv")
			})
		},
		"renderUserCenter": function () {
			var t = this;
			r.getUserCenter(function (e) {
				t.$loginDrop.find(".viplink").html(_.template(t.USERCENTER_TPL)({
					"result": e
				}))
			})
		},
		"renderDropBottom": function () {
			var t = "",
				e = "",
				i = "",
				o = new Date(decodeURIComponent(decodeURIComponent(this.userInfo.VipDate)));
			t = this.userInfo.vipGrade && this.userInfo.vipValidate[this.userInfo.vipGrade] ? this.userInfo.vipValidate[this.userInfo.vipGrade] : o.setHours(o.getHours() - 14), e = new Date(parseInt(t)), "10" == this.userInfo.vipGrade ? i = "您的SVIP将于" + e.getFullYear() + "年" + (e.getMonth() + 1) + "月" + e.getDate() + "日过期" : "1" == this.userInfo.vipGrade && (i = "您的VIP将于" + e.getFullYear() + "年" + (e.getMonth() + 1) + "月" + e.getDate() + "日过期"), this.$loginDrop.find(".subcon").html(_.template(this.DROPBOTTOM_TPL)({
				"isVip": this.userInfo.isVip,
				"remainsStr": i
			})), "0" != this.userInfo.isVip && this.$loginDrop.find(".xf").hover(function () {
				s(this).siblings(".remains").show()
			}, function () {
				s(this).siblings(".remains").hide()
			})
		},
		"controlSportIcon": function () {
			var t = this;
			r.getSportInfo(function (e) {
				s.each(e, function (e, i) {
					+new Date(new Date(i.validDate.replace(/-/g, "/"))) > t.serverTime && t.$loginContainer.find(".sportvip").show()
				})
			})
		},
		"controlWebsiteMsg": function () {
			if (this.$webMsg.length > 0 && ppUser.isLogined) {
				var t = n.get("website_msg"),
					e = +new Date;
				if (t) {
					var i = s.parseJSON(decodeURIComponent(t)),
						o = e - i.date;
					o > i.interval ? this.getWebMsg() : this.judgeTimes(this.$webMsg, i.times, i.interval - o)
				} else this.getWebMsg()
			}
		},
		"getWebMsg": function () {
			var t = this;
			r.getWebMsg(function (e) {
				var i = e.result.unreadCount,
					o = {
						"times": i,
						"date": +new Date,
						"interval": 36e5
					};
				clearTimeout(t.msgTimeout), t.judgeTimes(t.$webMsg, i, o.interval), n.set("website_msg", encodeURIComponent(JSON.stringify(o)), 1, "pptv.com", "/")
			})
		},
		"judgeTimes": function (t, e, i) {
			e > 0 ? this.$webMsg.show() : this.$webMsg.hide(), this.msgTimeout = setTimeout(function () {
				r.getWebMsg()
			}, i)
		},
		"renderDiamond": function () {
			n.get("isUpgrade") && 1 == n.get("isUpgrade") ? (this.beforeGetDiamondNum(), this.goToDiamondShop()) : this.$loginDrop.find(".diamonds").html("0<i></i>")
		},
		"beforeGetDiamondNum": function () {
			var t = this;
			r.beforeGetDiamondNum(function (e) {
				if (e && e.result && e.result.userBound && e.result.userBound.snsId) {
					var i = e.result.userBound.snsId;
					t.getDiamondNum(i)
				} else t.$diamonds.html("0<i></i>")
			}, function () {
				t.$diamonds.html("0<i></i>")
			})
		},
		"getDiamondNum": function (t) {
			var e = this;
			r.getDiamondNum(t, function (t) {
				t && t.errorCode && (t.points = parseInt(t.points), 0 === parseInt(t.errorCode) ? e.$diamonds.html(t.points + "<i></i>") : e.$diamonds.html("0<i></i>"), 1 === parseInt(t.errorCode) && e.showUpgradeBox())
			}, function () {
				e.$diamonds.html("0<i></i>")
			})
		},
		"goToDiamondShop": function () {
			var t = this;
			r.gotoShop(function (e) {
				t.$diamonds.attr({
					"href": decodeURIComponent(e.result.redirectUrl + "&targetUrl=" + a.HEADER_URL.DIAMOND_MALL_LINK)
				})
			})
		},
		"showUpgradeBox": function (t) {
			r.showUpgradeBox(t, function (t) {
				try {
					var e = parent.document;
					c.jsAddScript("https://reg.suning.com/project/srsregister/js/pptv/popup.js", e, function () {
						var e = {
							"username": ppUser.info.UserName,
							"token": decodeURIComponent(ppUser.info["token"]),
							"extBusRef": t.ppId,
							"ip": t.ip,
							"deviceId": t.deviceId,
							"sceneFlag": 1,
							"channel": "208000103001"
						};
						for (var i in e) void 0 == e[i] && (e[i] = "");
						parent.pptvUpgradePopup(e)
					})
				} catch (e) {}
			})
		},
		"renderCheckIn": function () {
			var t = this;
			l.checkDay(function (e, i, o) {
				t.checkInCount = i, t.leaveCount = o, e ? (t.checked = !0, t.$checkArea.addClass("checked").find(".check").html("已连续签到" + i + "天"), t.$checkArea.css("lineHeight", "32px")) : (t.checked = !1, t.$checkArea.find(".check").html("签到领云钻"))
			})
		},
		"bindEvent": function () {
			var t = this;
			this.$loginContainer.on("click", ".btn-login", function (t) {
				var e = s(this).attr("data-type") || "login";
				ppLogin.init({
					"type": e,
					"from": "web_topnav"
				})
			}).on("click", "#btn-user-logout", function (t) {
				ppUser.logout(), n.remove("website_msg", "pptv.com", "/");
				try {
					var e = {};
					webcfg.comment.tags.length > 0 && (e.tags = webcfg.comment.tags.toString()), webcfg.comment.ids.length > 0 && (e.ids = webcfg.comment.ids.toString()), player.setUserInfo(e)
				} catch (e) {}
			}), s(document).on("REMOVE_WEBSITE_MSG", function (e) {
				n.remove("website_msg", "pptv.com", "/"), t.controlWebsiteMsg()
			}), this.$diamonds.off("click").on("click", function (e) {
				n.get("isUpgrade") && 1 == n.get("isUpgrade") || t.showUpgradeBox()
			}), this.$checkArea.off("click").on("click", ".check", function (e) {
				0 != t.signInClickable && (t.signInClickable = 0, t.checked || (n.get("isUpgrade") && 1 == n.get("isUpgrade") ? l.checkIn(function () {
					t.$checkArea.addClass("checked").find(".check").html("已签到" + ++t.checkInCount + "天"), t.$checkArea.css("lineHeight", "32px"), t.checked = !0, t.beforeGetDiamondNum()
				}, t.showUpgradeBox, function () {
					t.signInClickable = 1
				}) : t.showUpgradeBox(0)))
			})
		},
		"loginDropEvent": function () {
			this._lock = !1;
			var t = this,
				e = null,
				i = function () {
					t.$loginDrop.show()
				},
				o = function () {
					t._lock || t.$loginDrop.hide()
				};
			t.$loginDrop.on("open", function () {
				ppUser.isLogined && (t.$loginContainer.addClass("loginarea-hover"), i())
			}).on("close", function () {
				t.$loginContainer.removeClass("loginarea-hover"), o()
			}), this.$loginContainer.find(".headpic").on("mouseenter", function (i) {
				clearTimeout(e), t.$loginDrop.trigger("open")
			}).on("mouseleave", function (i) {
				clearTimeout(e), e = setTimeout(function () {
					t.$loginDrop.trigger("close")
				}, 1e3)
			}).on("touchstart", function (t) {
				t.stopPropagation()
			}), t.$loginDrop.on("mouseenter", function (i) {
				clearTimeout(e), t.$loginDrop.trigger("open")
			}).on("mouseleave", function (i) {
				clearTimeout(e), e = setTimeout(function () {
					t.$loginDrop.trigger("close")
				}, 1e3)
			}).on("dblclick", function (e) {
				t._lock = !_lock
			}).on("touchstart", function (t) {
				t.stopPropagation()
			})
		}
	}, t.exports = o
}, function (t, e, i) {
	function o() {}
	var n = (/Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent), i(0));
	o.prototype = {
		"constructor": o,
		"init": function () {
			this.renderSubTitle("#subchannel"), this.controlSubNav()
		},
		"renderSubTitle": function (t) {
			var e = n(t);
			window.setChannel_page_name && (e.html('<a href="javascript:;">' + window.setChannel_page_name + "</a>"), e.show())
		},
		"controlSubNav": function () {
			var t = n(".hd-s-nav .ui-icon-ch"),
				e = n(".hd-s-nav .ch-drop");
			e.attr("tag", 1);
			var i = function () {
					t.addClass("ui-icon-ch-hover"), e.show()
				},
				o = function () {
					t.removeClass("ui-icon-ch-hover"), e.hide()
				};
			n.browser["MOBILE"] ? t.on("click", function () {
				1 == e.attr("tag") ? (i(), e.attr("tag", 2), t.css({
					"color": "#f9a519",
					"border-top": "1px solid #ddd",
					"border-left": "1px solid #ddd",
					"border-right": "1px solid #ddd"
				}), n(".ui-channel").css({
					"background-position": "-58px -97px"
				})) : (o(), e.attr("tag", 1), t.css({
					"color": "#626365",
					"border-top": "1px solid #fff",
					"border-left": "1px solid #fff",
					"border-right": "1px solid #fff"
				}), n(".ui-channel").css({
					"background-position": "-58px -79px"
				}))
			}) : (t.on("mouseenter", function () {
				i()
			}).on("mouseleave", function () {
				o()
			}), e.on("mouseenter", function () {
				i()
			}).on("mouseleave", function () {
				o()
			}))
		}
	}, t.exports = new o
}, function (t, e, i) {
	var o = i(0),
		n = function () {
			this.options = {
				"dropHead": o("body").hasClass("hd-nav-drop"),
				"previousScroll": 0,
				"hdwrap": ".g-1408-hd",
				"hdwrapId": "#g-1408-hd",
				"slidect": "#index-slider"
			}, this.slidbottom
		};
	n.prototype.init = function (t) {
		var e = this;
		t && o.extend(this.options, t), this.options.dropHead && (this.slideSelect(), o(window).scroll(function () {
			var t = o(window).scrollTop();
			o(e.options.slidect).length && (e.slidbottom = o(e.options.slidect).offset().top + o(e.options.slidect).height(), e.options.previousScroll < t ? e.scrollDown(t) : e.scrollUp(t), e.options.previousScroll = t)
		}))
	}, n.prototype.slideSelect = function () {
		window.location.href.indexOf("news.pptv.com") > 0 || window.location.href.indexOf("joke.pptv.com") > 0 ? this.options.slidect = ".video-big-wrapper" : window.location.href.indexOf("finance.pptv.com") > 0 && 0 == this.options.slidect.length && (this.options.slidect = ".module-slider-list")
	}, n.prototype.scrollDown = function (t) {
		t < this.slidbottom && o(".module-index-bg").css("top", "560px"), t >= this.slidbottom && (o(this.options.hdwrap).addClass("hdtop-scroll"), o("body").hasClass("site-white") && o("body").removeClass("site-white"), o("body").hasClass("site-black") && o("body").removeClass("site-black"), o(".g-1408-hd.hdtop-scroll").fadeIn(600), o(".module-index-bg").css("top", "500px"))
	}, n.prototype.scrollUp = function (t) {
		t <= this.slidbottom && (o(".g-1408-hd.hdtop-scroll").removeClass("hdtop-scroll"), o(this.options.hdwrap).fadeIn(600), o(".module-index-bg").css("top", "560px"))
	};
	var s;
	t.exports = function () {
		return s || (s = new n)
	}()
}, function (t, e, i) {
	var o = i(5),
		n = i(0),
		s = i(2),
		a = function () {
			this.options = {
				"operateDrop": "#operate-drop",
				"playHistoryWrap": "#playhistory-wrap",
				"filterInput": "#filter-input",
				"loadCallback": null,
				"delPlayHistroy": null,
				"filterShort": null
			}, this.loaded = !1, this.lock = !1, this.compiled, this.showAllCompiled, this.templateStr = o.getHeaderStr() + '<% if(data.isLogined == true){ %><% if(data.filter_short == "1"){ %><div class="filter-container"><input checked="checked" id="filter-input" class="filter-checkbox" type="checkbox" name="filter">过滤短视频</div><% } else { %><div class="filter-container"><input id="filter-input" class="filter-checkbox" type="checkbox" name="filter">过滤短视频</div><% } %><% } else { %><dt class="type3"><a class="login-from-history">登录</a>后体验更多功能</dt><% } %><% if(data.filter_short_len <= 0){ %>' + o.noShortComp() + "<% } else { %>" + o.getBodyStr() + "<% } %>" + o.getFooterStr(), this.showAllTemplateStr = o.showAllText(s.isLogined), this.noLoginedTemplateStr = o.noPlayHistoryComp()
		};
	a.prototype.init = function (t) {
		var e = this;
		n.extend(this.options, t);
		try {
			this.compiled = _.template(this.templateStr), this.showAllCompiled = _.template(this.showAllTemplateStr), this.uncompiled = _.template(this.noLoginedTemplateStr)
		} catch (error) {}
		var i = function () {
				e.options.loadCallback && !e.loaded && (e.loaded = !0, e.options.loadCallback())
			},
			s = function (t) {
				e.options.delPlayHistroy && e.options.delPlayHistroy(t)
			};
		o.setOptions({
			"showPlayHistroy": i,
			"delPlayHistroy": s
		}), o.mouseEvents(e.options.playHistoryWrap)
	}, a.prototype.render = function (t) {
		var e = this;
		t && (0 == t["days"].length ? this.iHTML = this.uncompiled() : (this.iHTML = this.compiled({
			"data": t
		}), this.allHTML = this.showAllCompiled(), n(this.options.operateDrop).append(this.allHTML)), n(this.options.playHistoryWrap).find("div").html(this.iHTML), n(this.options.filterInput).click(function (t) {
			var i = this.checked || !1;
			e.options.filterShort(i)
		}))
	}, a.prototype.reRender = function (t) {
		var e = this;
		t && (this.iHTML = this.compiled({
			"data": t
		}), n(this.options.playHistoryWrap).find("div").html(this.iHTML), n(this.options.filterInput).click(function (t) {
			var i = this.checked || !1;
			e.options.filterShort(i)
		}))
	};
	var r;
	t.exports = function () {
		return r || (r = new a)
	}()
}, 
	//原来搜索下拉函数
	function (t, e, i) {},
		
		
		function (t, e, i) {
	function o() {}
	var n = window.Cookies,
		s = i(0),
		a = i(1);
	o.prototype = {
		"checkDay": function (t, e) {
			if (ppUser.isLogined) {
				var e = e || new Date,
					i = e.getYear().toString(),
					o = e.getMonth() + 1;
				i = i.substring(i.length - 2), parseInt(o) < 10 && (o = "0" + o), s.ppXHR.JSONP({
					"url": a.HEADER_URL.BASE_CHECKIN_LINK + "pcardInfo/getMonthPcard",
					"jsonpCallback": "getMonthPcard" + (new Date).getTime(),
					"data": {
						"username": ppUser.info.UserName,
						"token": ppUser.info["token"],
						"month": i + o,
						"from": "web",
						"version": "unknown",
						"format": "jsonp"
					},
					"success": function (i) {
						if (0 === i.flag) {
							var o = e.getDate(),
								n = i.result.monthPcardLog,
								s = "1" == n.charAt(o - 1);
							t && t(s, i.result.conDays, i.result.leaveDays)
						}
					}
				})
			}
		},
		"checkIn": function (t, e, i) {
			for (var o = "", r = 0; r < 6; r++) {
				var l = Math.floor(10 * Math.random());
				0 == l && (l = 1), o += l
			}
			var p = MD5(encodeURIComponent(ppUser.info.UserName + "$DAILY_PCARD$" + o));
			s.ppXHR.JSONP({
				"url": a.HEADER_URL.BASE_CHECKIN_LINK + "doDailyPcardNew",
				"jsonpCallback": "checkIn" + (new Date).getTime(),
				"data": {
					"username": ppUser.info.UserName,
					"token": decodeURIComponent(ppUser.info["token"]),
					"suningToken": n.get("_device_session_id"),
					"channel": "208000103005",
					"addstr": p,
					"index": o,
					"from": "web",
					"version": "unknown",
					"format": "jsonp"
				},
				"success": function (o) {
					0 === o.flag || 16 == o.flag ? t && t() : 13 == o.flag ? e(0) : (alert(decodeURIComponent(o.message)), i && i())
				}
			})
		}
	}, t.exports = new o
}, function (t, e, i) {
	function o() {}
	var n = i(1),
		s = i(0);
	o.prototype = {
		"constructor": o,
		"getUserCenter": function (t) {
			s.ppXHR.JSONP({
				"url": n.HEADER_URL.USER_CENTER_LINK,
				"jsonpCallback": "usercenter_interface",
				"success": function (e) {
					e && t && t(e)
				}
			})
		},
		"getUserBilling": function (t) {
			ppUser.isLogined && s.ppXHR.JSONP({
				"url": n.HEADER_URL.USER_BILLING_LINK,
				"jsonpCallback": "get_user_billing",
				"data": {
					"username": ppUser.info.UserName,
					"from": "web",
					"format": "jsonp",
					"token": ppUser.info["token"] || ""
				},
				"success": function (e) {
					e.flag || (self.data = e.result, t && t(e.result))
				}
			})
		},
		"getUserGrade": function (t) {
			var e = {
				"vipGrade": "1",
				"totalCredit": "0"
			};
			s.ppXHR.JSONP({
				"url": n.HEADER_URL.USER_GRADE_LINK,
				"jsonpCallback": "get_user_grade",
				"timeout": 3e3,
				"data": {
					"username": ppUser.info.UserName,
					"token": ppUser.info["token"] || "",
					"format": "jsonp"
				},
				"success": function (i) {
					var o = {};
					"0" === i.code ? o = i.info : "203" === i.code && (o = e), t && t(o)
				},
				"error": function () {
					t && t(e)
				}
			})
		},
		"getSportInfo": function (t) {
			s.ppXHR.JSONP({
				"url": n.HEADER_URL.USER_SPORT_INFO_LINK,
				"data": {
					"username": ppUser.info.UserName,
					"token": ppUser.info["token"] || "",
					"format": "jsonp",
					"cataid": 2
				},
				"success": function (e) {
					"0" === e.errorcode && t && t(e.contents)
				}
			})
		},
		"getWebMsg": function (t) {
			s.ppXHR.JSONP({
				"url": n.HEADER_URL.WEB_MSG_LINK,
				"jsonpCallback": "webmsg",
				"data": {
					"username": ppUser.info.UserName,
					"token": ppUser.info["token"] || "",
					"type": "all",
					"format": "jsonp"
				},
				"success": function (e) {
					0 === parseInt(e.errorCode) && t && t(e)
				}
			})
		},
		"beforeGetDiamondNum": function (t, e) {
			s.ppXHR.JSONP({
				"url": n.HEADER_URL.GET_CUSTNUM_LINK,
				"timeout": 6e3,
				"jsonpCallback": "brefore_get_diamond",
				"data": {
					"username": ppUser.info.UserName,
					"token": decodeURIComponent(ppUser.info["token"]),
					"sns": "suning",
					"format": "jsonp"
				},
				"success": function (e) {
					t && t(e)
				},
				"error": function () {
					e && e(e)
				}
			})
		},
		"getDiamondNum": function (t, e, i) {
			s.ppXHR.JSONP({
				"url": n.HEADER_URL.GET_DIAMOND_NUM_LINK,
				"timeout": 6e3,
				"jsonpCallback": "get_diamond",
				"data": {
					"custNum": t,
					"format": "jsonp"
				},
				"success": function (t) {
					e && e(t)
				},
				"error": function () {
					i && i(i)
				}
			})
		},
		"gotoShop": function (t) {
			s.ppXHR.JSONP({
				"url": n.HEADER_URL.GOTO_DIAMOND_SHOP,
				"timeout": 6e3,
				"jsonpCallback": "goto_Shop",
				"data": {
					"username": ppUser.info.UserName,
					"token": decodeURIComponent(ppUser.info["token"]),
					"type": "suning",
					"format": "jsonp"
				},
				"success": function (e) {
					t && t(e)
				}
			})
		},
		"showUpgradeBox": function (t, e) {
			s.ajax({
				"type": "get",
				"dataType": "jsonp",
				"url": n.HEADER_URL.UPGRADE_LINK,
				"timeout": 6e3,
				"jsonp": "cb",
				"data": {
					"username": ppUser.info.UserName,
					"token": decodeURIComponent(ppUser.info["token"]),
					"channel": "208000103001",
					"scene": 1 == t ? "REG_PPTV_YZ" : "REG_PPTV_QD",
					"format": "jsonp"
				},
				"success": function (t) {
					e && e(t)
				}
			})
		}
	}, t.exports = new o
}, function (t, e, i) {
	function o() {
		this.moduleName = "favorite", this.loginedApi = " ", this.loginedOptions = {
			"from": l,
			"tk": n.info["token"]
		}, this._cache_favorite = []
	}
	var n = i(2),
		s = i(0),
		a = s.ppUtils.isClient(),
		r = i(6),
		l = a ? "clt" : "web";
	o.prototype.get = function (t, e) {
		var i = this;
		return this._cache_favorite.length > 0 ? void t(this._cache_favorite) : n && n.isLogined ? void s.ppXHR.JSONP({
			"url": i.loginedApi + n.info.UserName + "/Favorites/",
			"data": i.loginedOptions,
			"jsonpCallback": "cb_syncUserData",
			"success": function (o) {
				i._cache_favorite = r.dataParse("function" == typeof e ? _.sortBy(_.toArray(o), e) : _.toArray(o), {
					"rcc_src": "A8",
					"moduleName": "favorite",
					"len": 20
				}), t && t(i._cache_favorite)
			}
		}) : void(t && t([]))
	}, o.prototype.addItem = function (t, e, i) {
		var o = {
				"Id": t,
				"Pos": 0
			},
			a = s.extend({}, self.loginedOptions, {
				"_method": "post",
				"_json": decodeURIComponent(JSON.stringify(o))
			});
		s.ppXHR.JSONP({
			"url": self.loginedApi + n.info.UserName + "/Favorites/" + t + "/",
			"data": a,
			"jsonpCallback": "cb_syncUserData",
			"success": function (i) {
				self._cache_favorite.push({
					"Id": t
				}), e && e(i)
			},
			"error": function () {
				i && i()
			}
		})
	}, o.prototype.delItem = function (t, e, i) {
		var o, a = this;
		if (a._cache_favorite && (s.each(this._cache_favorite.days, function (e, i) {
				s.each(i.items, function (e, i) {
					if (i && (i.Id == t || i.index == t || i.SubId == t)) return o = i, !1
				})
			}), o && n.isLogined)) {
			var r = s.extend({}, a.loginedOptions, {
				"_method": "delete"
			});
			s.ppXHR.JSONP({
				"url": a.loginedApi + n.info.UserName + "/Favorites/" + t + "/",
				"data": r,
				"jsonpCallback": "cb_syncUserData",
				"success": function (t) {
					!t || 200 != t.errCode && 304 != t.errCode || (a.delCacheItem(o), e && e(a._cache_favorite))
				}
			})
		}
	}, o.prototype.delCacheItem = function (t) {
		s.each(this._cache_favorite.days, function (e, i) {
			var o = [];
			s.each(i.items, function (e, i) {
				i != t && o.push(i)
			}), i.items = o
		})
	}, o.prototype.delCache = function () {
		this._cache_favorite = []
	};
	var p;
	t.exports = function () {
		return p || (p = new o)
	}()
}, function (t, e, i) {
	function o() {
		this.moduleName = "playhistory", this.loginedApi = " ", this.unloginedApi = " ", this.unloginedOptions = {
			"key": "play_history",
			"expire": 31536e3,
			"max_len": 8,
			"format": "jsonp"
		}, this.loginedOptions = {
			"from": l,
			"tk": n.info["token"]
		}, this._cache_playhistory = []
	}
	var n = i(2),
		s = i(0),
		a = s.ppUtils.isClient(),
		r = i(6),
		l = a ? "clt" : "web";
	o.prototype.get = function (t, e) {
		var i = this;
		if (this._cache_playhistory.length > 0) return void t(this._cache_playhistory);
		n.isLogined ? s.ppXHR.JSONP({
			"url": i.loginedApi + n.info.UserName + "/Recent/",
			"data": i.loginedOptions,
			"jsonpCallback": "cb_syncUserData",
			"success": function (o) {
				i._cache_playhistory = r.dataParse("function" == typeof e ? _.sortBy(_.toArray(o), e) : _.toArray(o), {
					"rcc_src": "A7",
					"moduleName": "playhistory",
					"len": 10
				}), t && t(i._cache_playhistory)
			}
		}) : s.ppXHR.JSONP({
			"url": i.unloginedApi + "get",
			"data": {
				"key": "play_history",
				"expire": i.expire,
				"max_len": i.max_len,
				"format": "jsonp"
			},
			"success": function (o) {
				if (o.error) t && t([]);
				else {
					var n;
					o.value && o.value.length && (n = _.map(o.value, function (t) {
						var e = s.parseJSON(t.value);
						return e.index = t.index, e
					})), i._cache_playhistory = r.dataParse("function" == typeof e ? _.sortBy(n, e) : n, {
						"rcc_src": "A7",
						"moduleName": "playhistory"
					}), t && t(i._cache_playhistory)
				}
			},
			"error": function () {
				fail && fail()
			}
		})
	}, o.prototype.delCache = function () {
		this._cache_playhistory = []
	}, o.prototype.filterShort = function (t) {
		var e;
		if (this._cache_playhistory) try {
			if (t && n.isLogined) {
				var i = 0;
				e = s.extend(!0, {}, this._cache_playhistory), s.each(e["days"], function (t, e) {
					var o = [];
					s.each(e.items, function (t, e) {
						var n = !1;
						"4" === e.Propery && (n = !0), Number(e.Bt) < 4 && ("0" == e.contentType ? n = !0 : "1" === e.Propery && (n = !0)), n && (o.push(e), i++)
					}), e.items = o
				})
			} else e = this._cache_playhistory;
			!n || n.isLogined;
			return e["filter_short_len"] = i, e["filter_short"] = t ? "1" : "0", e
		} catch (e) {
			return e
		}
	}, o.prototype.delItem = function (t, e, i) {
		var o, a = this;
		if (this._cache_playhistory && (s.each(this._cache_playhistory.days, function (e, i) {
				s.each(i.items, function (e, i) {
					if (i && (i.Id == t || i.index == t || i.SubId == t)) return o = i, !1
				})
			}), o))
			if (n.isLogined) {
				var r = s.extend({}, a.loginedOptions, {
					"_method": "delete"
				});
				s.ppXHR.JSONP({
					"url": a.loginedApi + n.info.UserName + "/Recent/" + t + "/",
					"data": r,
					"jsonpCallback": "cb_syncUserData",
					"success": function (t) {
						!t || 200 != t.errCode && 304 != t.errCode || (a.delCacheItem(o), e && e(a._cache_playhistory))
					}
				})
			} else {
				var r = s.extend({}, a.unloginedOptions, {
					"index": t
				});
				s.ppXHR.JSONP({
					"url": a.unloginedApi + "remove",
					"data": r,
					"success": function (t) {
						t && 0 === t.error && (a.delCacheItem(o), e && e(a._cache_playhistory))
					}
				})
			}
	}, o.prototype.delCacheItem = function (t) {
		s.each(this._cache_playhistory.days, function (e, i) {
			var o = [];
			s.each(i.items, function (e, i) {
				i != t && o.push(i)
			}), i.items = o
		})
	};
	var p;
	t.exports = function () {
		return p || (p = new o)
	}()
}, function (t, e, i) {
	function o(t) {
		var e = c + "?" + n(t);
		p.src = e
	}

	function n(t) {
		var e = [];
		for (var i in t) e.push([i, "=", t[i]].join(""));
		return e.join("&")
	}

	function s(t, e) {
		var i = e || {};
		r(t).find("a").on("click", function () {
			var t = r(this),
				e = t.attr("href"),
				n = i.keyword || t.attr("keyword"),
				s = i.channelid || t.attr("channelid"),
				a = i.stitle || t.attr("stitle"),
				l = i.rank || t.attr("rank");
			o({
				"puid": encodeURIComponent(u.getPUID()),
				"vip": u.getVIP(),
				"uid": encodeURIComponent(u.getUID()),
				"ut": u.getUT(),
				"adr": encodeURIComponent(e),
				"radr": encodeURIComponent(d),
				"act": "aclk",
				"plt": h,
				"kw": encodeURIComponent(n),
				"jump": /search.pptv.com/.test(e) ? 0 : 1,
				"chn": s,
				"title": encodeURIComponent(a),
				"rk": l
			})
		})
	}
	var a = i(2),
		r = i(0),
		l = window.Cookies,
		p = new Image,
		c = "http://plt.data.pplive.com/search/1.html",
		d = document.referrer.replace(/&/g, "%26").replace(/#/g, "%23"),
		h = "ikan",
		u = {
			"_cache": {},
			"parsePPI": function (t) {
				var e = t || l.get("ppi") ? l.get("ppi") : "",
					i = [],
					o = [];
				if (!e || null === e || "" === e) return ["0", "2"];
				for (var n = 0, s = e.length; n < s - 1; n += 2) i.push(parseInt(e.substr(n, 2), 16));
				return o = String.fromCharCode.apply(String, i), o = o.split(",")
			},
			"getPUID": function () {
				return this._cache.puid ? this._cache.puid : (this._cache.puid = l.get("PUID"), this._cache.puid)
			},
			"getVIP": function () {
				return this._cache.vip ? this._cache.vip : (this._cache.vip = a.isLogined ? "0" != a.info.isVip ? 2 : 1 : 0, this._cache.vip)
			},
			"getUID": function () {
				return this._cache.uid ? this._cache.uid : (this._cache.uid = a.isLogined ? a.info.UserName : "", this._cache.uid)
			},
			"getUT": function () {
				if (this._cache.ut) return this._cache.ut;
				var t = this.parsePPI()[0];
				return this._cache.ut = "0" == t ? 1 : 2, this._cache.ut
			}
		};
	t.exports = s
}, function (t, e) {
	function i(t, e) {
		ppUser.onLogin(function (i) {
			!e.loginflag && n.get("ppToken") && (e.loginflag = !0, e.logoutflag = !1, t && t(i))
		})
	}

	function o(t, e) {
		ppUser.onLogout(function (i) {
			e.logoutflag || (e.loginflag = !1, e.logoutflag = !0, t && t(i))
		})
	}
	var n = window.Cookies,
		s = {
			"loginflag": !1,
			"logoutflag": !1
		};
	t.exports = {
		"onLogin": function (t) {
			return i(t, s), this
		},
		"onLogout": function (t) {
			return o(t, s), this
		}
	}
}, , function (t, e, i) {
	"use strict";
	var o = i(1).COMMON_VERSION;
	console.log(o);
	i(10);
	i(8).getInstance().init()
}]);