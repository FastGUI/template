! function (t) {
	function e(n) {
		if (i[n]) return i[n].exports;
		var o = i[n] = {
			"i": n,
			"l": !1,
			"exports": {}
		};
		return t[n].call(o.exports, o, o.exports, e), o.l = !0, o.exports
	}
	var i = {};
	e.m = t, e.c = i, e.i = function (t) {
		return t
	}, e.d = function (t, i, n) {
		e.o(t, i) || Object.defineProperty(t, i, {
			"configurable": !1,
			"enumerable": !0,
			"get": n
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
	}, e.p = "", e(e.s = 39)
}([function (module, exports, __webpack_require__) {
	function User() {
		this.readInfo(!0), this.init()
	}
	var cookie = window.Cookies,
		infoKeys = __webpack_require__(8),
		isClient = $.ppUtils.isClient(),
		clientCommon = isClient ? clientCommon : {},
		encode = encodeURIComponent,
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
		"white":
		function (t) {}
	}, module.exports = new User
}, function (t, e) {
	var i = function () {
		this._listener = {}, this.data = {}
	};
	i.prototype.getData = function () {
		return this.data
	}, i.prototype.load = function (t, e, i) {
		var n = this;
		n.bind(t, e),
			function () {
				var t = $.Deferred();
				t.promise();
				return $.ppXHR.JSONP(i).done(function (e) {
					t.resolve(e)
				}).fail(function () {
					t.resolve({
						"errorCode": "500"
					})
				}), t
			}().then(function (e) {
				n.data = e, n.fireEvent(t, {
					"model": e
				})
			})
	}, i.prototype.setConfig = function (t, e, i) {
		this.bind(t, e), i && void 0 != i["data"] && "object" == typeof i["data"] && (this.data = i["data"]), this.fireEvent(t, {
			"model": this.getData()
		})
	}, i.prototype.bind = function (t, e) {
		"string" == typeof t && "function" == typeof e && void 0 === this._listener[t] && (this._listener[t] = e)
	}, i.prototype.fireEvent = function (t, e) {
		try {
			var i = this;
			t && this._listener[t] && (this._listener[t].call(this, e), i.clear(t))
		} catch (e) {
			console.error(e.message)
		}
	}, i.prototype.clear = function (t) {
		this._listener[t] = null, delete this._listener[t]
	}, t.exports = {
		"getModel": i,
		"inheritPrototype": function (t, e) {
			var i = Object(e.prototype);
			i.constructor = t, t.prototype = i
		}
	}
}, function (t, e, i) {
	function n(t) {
		a() && (this.barrages = {
			"length": 0
		}, this.barrageIdCount = 0, this.barrageConfig = $.extend({
			"trackHeight": 50,
			"bulletHeight": 25,
			"displayTime": 8e3,
			"isDebug": !1,
			"fontSize": 14,
			"bottom": 50,
			"delay": 2e3
		}, t))
	}
	var o = i(5).inViewport,
		r = i(20).ppBarrage,
		a = function () {
			try {
				return !$.browser.IE
			} catch (error) {
				return !1
			}
		};
	n.prototype.loadBarrageCache = function (t) {
		if (a()) {
			var e = this;
			$(t).each(function (t, i) {
				if ("" !== $(i).attr("data") && void 0 === $(i).attr("barrageId")) {
					var n = e.barrageIdCount++;
					$(i).attr("barrageId", n), e.barrages[n] = {
						"id": n
					}, e.barrages[n].dom = i, e.barrages[n].barrage = new r(i), e.barrages[n].barrage.init(e.barrageIdCount);
					var o = [];
					$(i).attr("data").replace(/[\r\n]/g, "").split("|").forEach(function (t) {
						o.push({
							"msg": t
						})
					}), e.barrages[n].data = o, e.barrages[n].delayTimer = null, e.barrages[n].fireTimer = null, e.barrages.length++
				}
			})
		}
	}, n.prototype.start = function (t) {
		if (a()) {
			t = parseInt(t);
			var e = this;
			if (a() && void 0 !== this.barrages[t]) {
				var i = this.barrages[t];
				!1 !== o(i.dom) && (i.barrage.clearAll(), i.barrage.start(), clearTimeout(i.delayTimer), clearInterval(i.fireTimer), i.delayTimer = setTimeout(function () {
					function t() {
						void 0 !== i.data[e] && (i.barrage.load([i.data[e++]]), i.fireTimer = setTimeout(t, Math.floor(500 + 1e3 * Math.random())))
					}
					var e = 0;
					t()
				}, e.barrageConfig.delay))
			}
		}
	}, n.prototype.clean = function (t) {
		if (a()) {
			t = parseInt(t);
			if (a() && void 0 !== this.barrages[t]) {
				var e = this.barrages[t];
				clearInterval(e.delayTimer), clearInterval(e.fireTimer), e.barrage.clearAll()
			}
		}
	}, n.prototype.getBarrageCache = function (t) {
		if (a()) return void 0 === t ? this.barrages : $.grep(Array.prototype.slice.call(this.barrages, 0), function (e, i) {
			return o(e.dom) === t
		})
	}, t.exports = new n
}, function (t, e) {
	void 0 === window.jQuery && (window.jQuery = $),
		function (t) {
			t.fn.slide = function (e) {
				return t.fn.slide.defaults = {
					"type": "slide",
					"effect": "fade",
					"autoPlay": !1,
					"delayTime": 500,
					"interTime": 2500,
					"triggerTime": 150,
					"defaultIndex": 0,
					"titCell": ".hd li",
					"mainCell": ".bd",
					"targetCell": null,
					"trigger": "mouseover",
					"scroll": 1,
					"vis": 1,
					"titOnClassName": "on",
					"autoPage": !1,
					"prevCell": ".prev",
					"nextCell": ".next",
					"pageStateCell": ".pageState",
					"opp": !1,
					"pnLoop": !0,
					"easing": "swing",
					"startFun": null,
					"endFun": null,
					"switchLoad": null,
					"playStateCell": ".playState",
					"mouseOverStop": !0,
					"defaultPlay": !0,
					"returnDefault": !1
				}, this.each(function () {
					var i, n = t.extend({}, t.fn.slide.defaults, e),
						o = t(this),
						r = n.effect,
						a = t(n.prevCell, o),
						s = t(n.nextCell, o),
						l = t(n.pageStateCell, o),
						u = t(n.playStateCell, o),
						c = t(n.titCell, o),
						h = c.size(),
						d = t(n.mainCell, o),
						f = d.children().size(),
						p = n.switchLoad,
						g = t(n.targetCell, o),
						m = parseInt(n.defaultIndex),
						v = parseInt(n.delayTime),
						b = parseInt(n.interTime),
						w = (parseInt(n.triggerTime), parseInt(n.scroll)),
						y = parseInt(n.vis),
						_ = "false" != n.autoPlay && 0 != n.autoPlay,
						k = "false" != n.opp && 0 != n.opp,
						C = "false" != n.autoPage && 0 != n.autoPage,
						x = "false" != n.pnLoop && 0 != n.pnLoop,
						T = "false" != n.mouseOverStop && 0 != n.mouseOverStop,
						I = "false" != n.defaultPlay && 0 != n.defaultPlay,
						E = "false" != n.returnDefault && 0 != n.returnDefault,
						S = 0,
						$ = 0,
						M = 0,
						P = 0,
						O = n.easing,
						A = null,
						B = null,
						N = null,
						j = n.titOnClassName,
						L = c.index(o.find("." + j)),
						D = m = -1 == L ? m : L,
						H = m,
						q = m,
						U = f >= y ? f % w != 0 ? f % w : w : 0,
						R = "leftMarquee" == r || "topMarquee" == r,
						F = function () {
							t.isFunction(n.startFun) && n.startFun(m, h, o, t(n.titCell, o), d, g, a, s)
						},
						W = function () {
							t.isFunction(n.endFun) && n.endFun(m, h, o, t(n.titCell, o), d, g, a, s)
						},
						z = function () {
							c.removeClass(j), I && c.eq(H).addClass(j)
						},
						Q = o.attr("data-slide");
					if (!("noslide" === Q || Q <= 0)) {
						if ("menu" == n.type) return I && c.removeClass(j).eq(m).addClass(j), c.hover(function () {
							i = t(this).find(n.targetCell);
							var e = c.index(t(this));
							B = setTimeout(function () {
								switch (m = e, c.removeClass(j).eq(m).addClass(j), F(), r) {
									case "fade":
										i.stop(!0, !0).animate({
											"opacity": "show"
										}, v, O, W);
										break;
									case "slideDown":
										i.stop(!0, !0).animate({
											"height": "show"
										}, v, O, W)
								}
							}, n.triggerTime)
						}, function () {
							switch (clearTimeout(B), r) {
								case "fade":
									i.animate({
										"opacity": "hide"
									}, v, O);
									break;
								case "slideDown":
									i.animate({
										"height": "hide"
									}, v, O)
							}
						}), void(E && o.hover(function () {
							clearTimeout(N)
						}, function () {
							N = setTimeout(z, v)
						}));
						if (0 == h && (h = f), R && (h = 2), C) {
							if (f >= y)
								if ("leftLoop" == r || "topLoop" == r) h = f % w != 0 ? 1 + (f / w ^ 0) : f / w;
								else {
									var G = f - y;
									h = 1 + parseInt(G % w != 0 ? G / w + 1 : G / w), h <= 0 && (h = 1)
								}
							else h = 1;
							c.html("");
							var V = "";
							if (1 == n.autoPage || "true" == n.autoPage)
								for (var Y = 0; Y < h; Y++) V += "<li>" + (Y + 1) + "</li>";
							else
								for (var Y = 0; Y < h; Y++) V += n.autoPage.replace("$", Y + 1);
							c.html(V);
							var c = c.children()
						}
						if (f >= y) {
							d.children().each(function () {
								t(this).width() > M && (M = t(this).width(), $ = t(this).outerWidth(!0)), t(this).height() > P && (P = t(this).height(), S = t(this).outerHeight(!0))
							});
							var J = d.children(),
								X = function () {
									for (var t = 0; t < y; t++) J.eq(t).clone().addClass("clone").appendTo(d);
									for (var t = 0; t < U; t++) J.eq(f - t - 1).clone().addClass("clone").prependTo(d)
								};
							switch (o.find(".tempWrap").length > 0 && o.find("ul").unwrap(), r) {
								case "fold":
									d.css({
										"position": "relative",
										"width": $,
										"height": S
									}).children().css({
										"position": "absolute",
										"width": M,
										"left": 0,
										"top": 0,
										"display": "none"
									});
									break;
								case "top":
									d.wrap('<div class="tempWrap" style="overflow:hidden; position:relative; height:' + y * S + 'px"></div>').css({
										"top": -m * w * S,
										"position": "relative",
										"padding": "0",
										"margin": "0"
									}).children().css({
										"height": P
									});
									break;
								case "left":
									d.wrap('<div class="tempWrap" style="overflow:hidden; position:relative; width:' + y * $ + 'px"></div>').css({
										"width": f * $,
										"left": -m * w * $,
										"position": "relative",
										"overflow": "hidden",
										"padding": "0",
										"margin": "0"
									}).children().css({
										"float": "left",
										"width": M
									});
									break;
								case "leftLoop":
								case "leftMarquee":
									X(), d.wrap('<div class="tempWrap" style="overflow:hidden; position:relative; width:' + y * $ + 'px"></div>').css({
										"width": (f + y + U) * $,
										"position": "relative",
										"overflow": "hidden",
										"padding": "0",
										"margin": "0",
										"left": -(U + m * w) * $
									}).children().css({
										"float": "left",
										"width": M
									});
									break;
								case "topLoop":
								case "topMarquee":
									X(), d.wrap('<div class="tempWrap" style="overflow:hidden; position:relative; height:' + y * S + 'px"></div>').css({
										"height": (f + y + U) * S,
										"position": "relative",
										"padding": "0",
										"margin": "0",
										"top": -(U + m * w) * S
									}).children().css({
										"height": P
									})
							}
						}
						var K = function (t) {
								var e = t * w;
								return t == h ? e = f : -1 == t && f % w != 0 && (e = -f % w), e
							},
							Z = function (e) {
								var i = function (i) {
									for (var n = i; n < y + i; n++) e.eq(n).find("img[" + p + "]").each(function () {
										var e = t(this);
										if (e.attr("src", e.attr(p)).removeAttr(p), d.find(".clone")[0])
											for (var i = d.children(), n = 0; n < i.size(); n++) i.eq(n).find("img[" + p + "]").each(function () {
												t(this).attr(p) == e.attr("src") && t(this).attr("src", t(this).attr(p)).removeAttr(p)
											})
									})
								};
								switch (r) {
									case "fade":
									case "fold":
									case "top":
									case "left":
									case "slideDown":
										i(m * w);
										break;
									case "leftLoop":
									case "topLoop":
										i(U + K(q));
										break;
									case "leftMarquee":
									case "topMarquee":
										var n = "leftMarquee" == r ? d.css("left").replace("px", "") : d.css("top").replace("px", ""),
											o = "leftMarquee" == r ? $ : S,
											a = U;
										if (n % o != 0) {
											var s = Math.abs(n / o ^ 0);
											a = 1 == m ? U + s : U + s - 1
										}
										i(a)
								}
							},
							tt = function (t) {
								if (!I || D != m || t || R) {
									if (R ? m >= 1 ? m = 1 : m <= 0 && (m = 0) : (q = m, m >= h ? m = 0 : m < 0 && (m = h - 1)), F(), null != p && Z(d.children()), g[0] && (i = g.eq(m), null != p && Z(g), "slideDown" == r ? (g.not(i).stop(!0, !0).slideUp(v), i.slideDown(v, O, function () {
											d[0] || W()
										})) : (g.not(i).stop(!0, !0).hide(), i.animate({
											"opacity": "show"
										}, v, function () {
											d[0] || W()
										}))), f >= y) switch (r) {
										case "fade":
											d.children().stop(!0, !0).eq(m).animate({
												"opacity": "show"
											}, v, O, function () {
												W()
											}).siblings().hide();
											break;
										case "fold":
											d.children().stop(!0, !0).eq(m).animate({
												"opacity": "show"
											}, v, O, function () {
												W()
											}).siblings().animate({
												"opacity": "hide"
											}, v, O);
											break;
										case "top":
											d.stop(!0, !1).animate({
												"top": -m * w * S
											}, v, O, function () {
												W()
											});
											break;
										case "left":
											d.stop(!0, !1).animate({
												"left": -m * w * $
											}, v, O, function () {
												W()
											});
											break;
										case "leftLoop":
											var e = q;
											d.stop(!0, !0).animate({
												"left": -(K(q) + U) * $
											}, v, O, function () {
												e <= -1 ? d.css("left", -(U + (h - 1) * w) * $) : e >= h && d.css("left", -U * $), W()
											});
											break;
										case "topLoop":
											var e = q;
											d.stop(!0, !0).animate({
												"top": -(K(q) + U) * S
											}, v, O, function () {
												e <= -1 ? d.css("top", -(U + (h - 1) * w) * S) : e >= h && d.css("top", -U * S), W()
											});
											break;
										case "leftMarquee":
											var n = d.css("left").replace("px", "");
											0 == m ? d.animate({
												"left": ++n
											}, 0, function () {
												d.css("left").replace("px", "") >= 0 && d.css("left", -f * $)
											}) : d.animate({
												"left": --n
											}, 0, function () {
												d.css("left").replace("px", "") <= -(f + U) * $ && d.css("left", -U * $)
											});
											break;
										case "topMarquee":
											var o = d.css("top").replace("px", "");
											0 == m ? d.animate({
												"top": ++o
											}, 0, function () {
												d.css("top").replace("px", "") >= 0 && d.css("top", -f * S)
											}) : d.animate({
												"top": --o
											}, 0, function () {
												d.css("top").replace("px", "") <= -(f + U) * S && d.css("top", -U * S)
											})
									}
									c.removeClass(j).eq(m).addClass(j), D = m, x || (s.removeClass("nextStop"), a.removeClass("prevStop"), 0 == m && a.addClass("prevStop"), m == h - 1 && s.addClass("nextStop")), l.html("<span>" + (m + 1) + "</span>/" + h)
								}
							};
						I && tt(!0), E && o.hover(function () {
							clearTimeout(N)
						}, function () {
							N = setTimeout(function () {
								m = H, I ? tt() : "slideDown" == r ? i.slideUp(v, z) : i.animate({
									"opacity": "hide"
								}, v, z), D = m
							}, 300)
						});
						var et = function (t) {
								A = setInterval(function () {
									k ? m-- : m++, tt()
								}, t || b)
							},
							it = function (t) {
								A = setInterval(tt, t || b)
							},
							nt = function () {
								T || (clearInterval(A), et())
							},
							ot = function () {
								(x || m != h - 1) && (m++, tt(), R || nt())
							},
							rt = function () {
								(x || 0 != m) && (m--, tt(), R || nt())
							},
							at = function () {
								clearInterval(A), R ? it() : et(), u.removeClass("pauseState")
							},
							st = function () {
								clearInterval(A), u.addClass("pauseState")
							};
						if (_ ? R ? (k ? m-- : m++, it(), T && d.hover(st, at)) : (et(), T && o.hover(st, at)) : (R && (k ? m-- : m++), u.addClass("pauseState")), u.click(function () {
								u.hasClass("pauseState") ? at() : st()
							}), "mouseover" == n.trigger ? c.hover(function () {
								var t = c.index(this);
								B = setTimeout(function () {
									m = t, tt(), nt()
								}, n.triggerTime)
							}, function () {
								clearTimeout(B)
							}) : c.click(function () {
								m = c.index(this), tt(), nt()
							}), R) {
							if (s.mousedown(ot), a.mousedown(rt), x) {
								var lt, ut = function () {
										lt = setTimeout(function () {
											clearInterval(A), it(b / 10 ^ 0)
										}, 150)
									},
									ct = function () {
										clearTimeout(lt), clearInterval(A), it()
									};
								s.mousedown(ut), s.mouseup(ct), a.mousedown(ut), a.mouseup(ct)
							}
							"mouseover" == n.trigger && (s.hover(ot, function () {}), a.hover(rt, function () {}))
						} else s.click(ot), a.click(rt)
					}
				})
			}
		}(jQuery), jQuery.easing["jswing"] = jQuery.easing["swing"], jQuery.extend(jQuery.easing, {
			"def": "easeOutQuad",
			"swing": function (t, e, i, n, o) {
				return jQuery.easing.def ? jQuery.easing[jQuery.easing.def](t, e, i, n, o) : n * (e /= o) * e + i
			},
			"easeInQuad": function (t, e, i, n, o) {
				return n * (e /= o) * e + i
			},
			"easeOutQuad": function (t, e, i, n, o) {
				return -n * (e /= o) * (e - 2) + i
			},
			"easeInOutQuad": function (t, e, i, n, o) {
				return (e /= o / 2) < 1 ? n / 2 * e * e + i : -n / 2 * (--e * (e - 2) - 1) + i
			},
			"easeInCubic": function (t, e, i, n, o) {
				return n * (e /= o) * e * e + i
			},
			"easeOutCubic": function (t, e, i, n, o) {
				return n * ((e = e / o - 1) * e * e + 1) + i
			},
			"easeInOutCubic": function (t, e, i, n, o) {
				return (e /= o / 2) < 1 ? n / 2 * e * e * e + i : n / 2 * ((e -= 2) * e * e + 2) + i
			},
			"easeInQuart": function (t, e, i, n, o) {
				return n * (e /= o) * e * e * e + i
			},
			"easeOutQuart": function (t, e, i, n, o) {
				return -n * ((e = e / o - 1) * e * e * e - 1) + i
			},
			"easeInOutQuart": function (t, e, i, n, o) {
				return (e /= o / 2) < 1 ? n / 2 * e * e * e * e + i : -n / 2 * ((e -= 2) * e * e * e - 2) + i
			},
			"easeInQuint": function (t, e, i, n, o) {
				return n * (e /= o) * e * e * e * e + i
			},
			"easeOutQuint": function (t, e, i, n, o) {
				return n * ((e = e / o - 1) * e * e * e * e + 1) + i
			},
			"easeInOutQuint": function (t, e, i, n, o) {
				return (e /= o / 2) < 1 ? n / 2 * e * e * e * e * e + i : n / 2 * ((e -= 2) * e * e * e * e + 2) + i
			},
			"easeInSine": function (t, e, i, n, o) {
				return -n * Math.cos(e / o * (Math.PI / 2)) + n + i
			},
			"easeOutSine": function (t, e, i, n, o) {
				return n * Math.sin(e / o * (Math.PI / 2)) + i
			},
			"easeInOutSine": function (t, e, i, n, o) {
				return -n / 2 * (Math.cos(Math.PI * e / o) - 1) + i
			},
			"easeInExpo": function (t, e, i, n, o) {
				return 0 == e ? i : n * Math.pow(2, 10 * (e / o - 1)) + i
			},
			"easeOutExpo": function (t, e, i, n, o) {
				return e == o ? i + n : n * (1 - Math.pow(2, -10 * e / o)) + i
			},
			"easeInOutExpo": function (t, e, i, n, o) {
				return 0 == e ? i : e == o ? i + n : (e /= o / 2) < 1 ? n / 2 * Math.pow(2, 10 * (e - 1)) + i : n / 2 * (2 - Math.pow(2, -10 * --e)) + i
			},
			"easeInCirc": function (t, e, i, n, o) {
				return -n * (Math.sqrt(1 - (e /= o) * e) - 1) + i
			},
			"easeOutCirc": function (t, e, i, n, o) {
				return n * Math.sqrt(1 - (e = e / o - 1) * e) + i
			},
			"easeInOutCirc": function (t, e, i, n, o) {
				return (e /= o / 2) < 1 ? -n / 2 * (Math.sqrt(1 - e * e) - 1) + i : n / 2 * (Math.sqrt(1 - (e -= 2) * e) + 1) + i
			},
			"easeInElastic": function (t, e, i, n, o) {
				var r = 1.70158,
					a = 0,
					s = n;
				if (0 == e) return i;
				if (1 == (e /= o)) return i + n;
				if (a || (a = .3 * o), s < Math.abs(n)) {
					s = n;
					var r = a / 4
				} else var r = a / (2 * Math.PI) * Math.asin(n / s);
				return -s * Math.pow(2, 10 * (e -= 1)) * Math.sin((e * o - r) * (2 * Math.PI) / a) + i
			},
			"easeOutElastic": function (t, e, i, n, o) {
				var r = 1.70158,
					a = 0,
					s = n;
				if (0 == e) return i;
				if (1 == (e /= o)) return i + n;
				if (a || (a = .3 * o), s < Math.abs(n)) {
					s = n;
					var r = a / 4
				} else var r = a / (2 * Math.PI) * Math.asin(n / s);
				return s * Math.pow(2, -10 * e) * Math.sin((e * o - r) * (2 * Math.PI) / a) + n + i
			},
			"easeInOutElastic": function (t, e, i, n, o) {
				var r = 1.70158,
					a = 0,
					s = n;
				if (0 == e) return i;
				if (2 == (e /= o / 2)) return i + n;
				if (a || (a = o * (.3 * 1.5)), s < Math.abs(n)) {
					s = n;
					var r = a / 4
				} else var r = a / (2 * Math.PI) * Math.asin(n / s);
				return e < 1 ? s * Math.pow(2, 10 * (e -= 1)) * Math.sin((e * o - r) * (2 * Math.PI) / a) * -.5 + i : s * Math.pow(2, -10 * (e -= 1)) * Math.sin((e * o - r) * (2 * Math.PI) / a) * .5 + n + i
			},
			"easeInBack": function (t, e, i, n, o, r) {
				return void 0 == r && (r = 1.70158), n * (e /= o) * e * ((r + 1) * e - r) + i
			},
			"easeOutBack": function (t, e, i, n, o, r) {
				return void 0 == r && (r = 1.70158), n * ((e = e / o - 1) * e * ((r + 1) * e + r) + 1) + i
			},
			"easeInOutBack": function (t, e, i, n, o, r) {
				return void 0 == r && (r = 1.70158), (e /= o / 2) < 1 ? n / 2 * (e * e * ((1 + (r *= 1.525)) * e - r)) + i : n / 2 * ((e -= 2) * e * ((1 + (r *= 1.525)) * e + r) + 2) + i
			},
			"easeInBounce": function (t, e, i, n, o) {
				return n - jQuery.easing.easeOutBounce(t, o - e, 0, n, o) + i
			},
			"easeOutBounce": function (t, e, i, n, o) {
				return (e /= o) < 1 / 2.75 ? n * (7.5625 * e * e) + i : e < 2 / 2.75 ? n * (7.5625 * (e -= 1.5 / 2.75) * e + .75) + i : e < 2.5 / 2.75 ? n * (7.5625 * (e -= 2.25 / 2.75) * e + .9375) + i : n * (7.5625 * (e -= 2.625 / 2.75) * e + .984375) + i
			},
			"easeInOutBounce": function (t, e, i, n, o) {
				return e < o / 2 ? .5 * jQuery.easing.easeInBounce(t, 2 * e, 0, n, o) + i : .5 * jQuery.easing.easeOutBounce(t, 2 * e - o, 0, n, o) + .5 * n + i
			}
		})
}, function (t, e) {
	var i = {
			"PLU_STREAM": "http://api.plu.cn/pptv/streams?tag=%E7%BE%8E%E5%A5%B3%E6%98%9F%E4%B8%BB%E6%92%AD",
			"WEB_RECOMMEND": "http://recommend.pptv.com/recommend?from=web&version=1.0.0"
		},
		n = {
			"LOAD_DEMO": "load_demo"
		},
		o = {},
		r = {
			"movie": {
				"type": 1,
				"size": 180240
			},
			"tv": {
				"type": 2,
				"size": 180240
			}
		};
	t.exports = {
		"HOME_VERSION": "home.js 1.0.1",
		"HTTP_HOST": i,
		"EVENTS_TYPE": n,
		"PAGE_CONFIG": r,
		"STATIC_NAME": o
	}
}, function (t, e) {
	function i(t) {
		var e = t.getBoundingClientRect();
		return {
			"top": e.top + (window.pageYOffset || document.documentElement.scrollTop),
			"left": e.left + (window.pageXOffset || document.documentElement.scrollLeft)
		}
	}

	function n(t) {
		if (void 0 === t) return !0;
		t.offsetParent
	}

	function o(t, e, o) {
		if (void 0 === o && (o = {
				"top": 0,
				"right": 0,
				"bottom": 0,
				"left": 0
			}), n(t)) return !1;
		var r, a, s, l;
		if (void 0 === e || e === window) r = window.pageYOffset || document.documentElement.scrollTop, s = window.pageXOffset || document.documentElement.scrollLeft, a = r + (window.innerHeight || document.documentElement.clientHeight), l = s + (window.innerWidth || document.documentElement.clientWidth);
		else {
			var u = i(e);
			r = u.top, s = u.left, a = r + e.offsetHeight, l = s + e.offsetWidth
		}
		var c = i(t);
		return r <= c.top + t.offsetHeight + o.top && a >= c.top - o.bottom && s <= c.left + t.offsetWidth + o.left && l >= c.left - o.right
	}
	t.exports = {
		"inViewport": o
	}
}, function (t, e) {
	t.exports = window.jQuery
}, function (t, e) {
	function i() {
		throw new Error("setTimeout has not been defined")
	}

	function n() {
		throw new Error("clearTimeout has not been defined")
	}

	function o(t) {
		if (c === setTimeout) return setTimeout(t, 0);
		if ((c === i || !c) && setTimeout) return c = setTimeout, setTimeout(t, 0);
		try {
			return c(t, 0)
		} catch (e) {
			try {
				return c.call(null, t, 0)
			} catch (e) {
				return c.call(this, t, 0)
			}
		}
	}

	function r(t) {
		if (h === clearTimeout) return clearTimeout(t);
		if ((h === n || !h) && clearTimeout) return h = clearTimeout, clearTimeout(t);
		try {
			return h(t)
		} catch (e) {
			try {
				return h.call(null, t)
			} catch (e) {
				return h.call(this, t)
			}
		}
	}

	function a() {
		g && f && (g = !1, f.length ? p = f.concat(p) : m = -1, p.length && s())
	}

	function s() {
		if (!g) {
			var t = o(a);
			g = !0;
			for (var e = p.length; e;) {
				for (f = p, p = []; ++m < e;) f && f[m].run();
				m = -1, e = p.length
			}
			f = null, g = !1, r(t)
		}
	}

	function l(t, e) {
		this.fun = t, this.array = e
	}

	function u() {}
	var c, h, d = t.exports = {};
	! function () {
		try {
			c = "function" == typeof setTimeout ? setTimeout : i
		} catch (e) {
			c = i
		}
		try {
			h = "function" == typeof clearTimeout ? clearTimeout : n
		} catch (e) {
			h = n
		}
	}();
	var f, p = [],
		g = !1,
		m = -1;
	d.nextTick = function (t) {
		var e = new Array(arguments.length - 1);
		if (arguments.length > 1)
			for (var i = 1; i < arguments.length; i++) e[i - 1] = arguments[i];
		p.push(new l(t, e)), 1 !== p.length || g || o(s)
	}, l.prototype.run = function () {
		this.fun.apply(null, this.array)
	}, d.title = "browser", d.browser = !0, d.env = {}, d.argv = [], d.version = "", d.versions = {}, d.on = u, d.addListener = u, d.once = u, d.off = u, d.removeListener = u, d.removeAllListeners = u, d.emit = u, d.prependListener = u, d.prependOnceListener = u, d.listeners = function (t) {
		return []
	}, d.binding = function (t) {
		throw new Error("process.binding is not supported")
	}, d.cwd = function () {
		return "/"
	}, d.chdir = function (t) {
		throw new Error("process.chdir is not supported")
	}, d.umask = function () {
		return 0
	}
}, function (t, e) {
	var i = ["Gender", "PpNum", "ExpNum", "LevelName", "NextLevelName", "NextLevelExpNum", "Area", "Subscribe", "UnreadNotes", "HeadPic", "Email", "OnlineTime", "Birthday", "BlogAddress", "Signed", "Type", "Nickname", "isVip", "VipDate", "IsNoad", "NoadDate", "IsSpdup", "SpdupDate", "IsRtmp", "RtmpDate", "IsUgspeed", "UgspeedDate", "vipGrade", "vipValidate"];
	t.exports = i
}, function (t, e) {
	function i() {
		this.index = 0, this.bannerAmount = 0, this.opt = {}, this.sliderAttrs = [], this.sliderBg = null, this.btnCont = null, this.btnArray = [], this.switchTimer = null
	}

	function n(t) {
		(new Image).src = t
	}
	var o = $.ppUtils.isClient(),
		r = {
			"switchInterval": 7e3,
			"beforeInit": function () {},
			"beforeSwitch": function () {},
			"afterSwitch": function () {},
			"activeBtnClass": "now",
			"sliderBgSelector": "#index-slider-bg .img-wrap",
			"btnContSelector": "#sliderBtns",
			"btnSelector": "a",
			"dataExtraAttr": ""
		},
		a = ["_is_outside", "_play_ctrl", "_check_login", "_play_ly"],
		s = "ipad" == navigator.userAgent.toLowerCase().match(/ipad/i);
	i.prototype.init = function (t) {
		var e = this;
		this.opt = $.extend({}, r, t), this.sliderBg = $(e.opt.sliderBgSelector).eq(0), this.btnCont = $(e.opt.btnContSelector).eq(0), this.bannerAmount = e.btnCont.find(e.opt.btnSelector).length, this.btnArray = Array.prototype.slice.call(e.btnCont.find(e.opt.btnSelector), 0, e.btnCont.find(e.opt.btnSelector).length);
		var i = e.opt.dataExtraAttr,
			n = [].concat(a);
		i && (n = n.concat(i.split(","))), this.btnCont.find(e.opt.btnSelector).each(function (t, i) {
			for (var o = {
					"title": i.title,
					"target": i.getAttribute("target"),
					"href": i.href,
					"_href": i.getAttribute("_href") || "",
					"source": $.webP.getWebp(i.getAttribute("data-source")),
					"background": i.getAttribute("data-background") || "red",
					"_is_new": i.getAttribute("_is_new") || "",
					"data_tj_id": i.getAttribute("data-tj-id") || "",
					"tj_id": i.getAttribute("tj_id") || ""
				}, r = n.length; r--;) o[n[r]] = i.getAttribute(n[r]) || "";
			e.sliderAttrs[e.sliderAttrs.length] = o
		}), this.btnCont.on("mouseleave", function () {
			e.startAutoSwitch()
		}), s || this.btnCont.on("mouseenter", e.opt.btnSelector, _.throttle(function (t) {
			e.stopAutoSwitch(), e.switchTo($.inArray(t.target, e.btnArray))
		}, 50)), s && this.btnCont.on("touchend", e.opt.btnSelector, function (t) {
			e.index !== $.inArray(t.target, e.btnArray) && t.preventDefault(), e.stopAutoSwitch(), e.switchTo($.inArray(t.target, e.btnArray))
		}), e.startAutoSwitch()
	}, i.prototype.switchTo = function (t) {
		if (t !== this.index) {
			this.opt.beforeSwitch(this);
			var e = this;
			e.btnCont.find("li").removeClass(e.opt.activeBtnClass), e.btnCont.find("li").eq(t).addClass(e.opt.activeBtnClass);
			var i = e.sliderAttrs[t],
				r = e.sliderBg.find(".going"),
				a = e.sliderBg.find(".coming");
			i.target ? r.attr("target", i.target) : r.removeAttr("target"), /((https?)|(pptv)):\/\//.test(i.href) || r.removeAttr("href"), r.css({
				"background-color": i.background,
				"background-image": "url(" + i.source + ")"
			});
			var s = {
				"href": i.href,
				"title": i.title,
				"_href": i._href,
				"_is_outside": i._is_outside,
				"_play_ctrl": i._play_ctrl,
				"_check_login": i._check_login,
				"_play_ly": i._play_ly,
				"_is_new": i._is_new,
				"tj_id": i.data_tj_id
			};
			r.attr(s);
			try {
				o && (r.eq(0).attr("clientEventLoaded", "false"), r.eq(0).attr("clientEventIngore", "false"), clientCommon.ex.initLinks.removeevent(r[0]), clientCommon.ex.initLinks(r[0]))
			} catch (e) {}
			a.removeClass("coming").addClass("going"), r.removeClass("going").addClass("coming"), e.index = t, e.opt.afterSwitch(e), n(e.sliderAttrs[(t + 1) % e.bannerAmount].source)
		}
	}, i.prototype.startAutoSwitch = function () {
		var t = this;
		clearInterval(t.switchTimer), t.switchTimer = setInterval(function () {
			t.switchTo((t.index + 1) % t.bannerAmount)
		}, t.opt.switchInterval)
	}, i.prototype.stopAutoSwitch = function () {
		clearInterval(this.switchTimer)
	}, t.exports = {
		"banner": i
	}
}, function (t, e, i) {
	function n() {
		this.bubblelist = []
	}
	var o = i(0),
		r = window.Cookies,
		a = $.ppUtils.isClient(),
		s = a ? clientCommon : {},
		l = a ? "clt" : "web",
		u = (r.get("ppi"), o.info ? o.info.UserName : ""),
		c = null,
		h = "vip_bubbles",
		d = {
			"load": function (t, e, i) {
				$.ajax({
					"dataType": "jsonp",
					"type": "GET",
					"url": t + "?" + decodeURIComponent($.param(e)),
					"jsonp": "cb",
					"data": {
						"format": "jsonp"
					},
					"jsonpCallback": e.callback,
					"cache": !0,
					"success": function (t) {
						i && "function" == typeof i && i.apply(null, arguments)
					}
				})
			}
		};
	n.prototype = {
		"constructor": n,
		"init": function () {
			u = "clt" === l && s.userIsLogin() ? s.getUserInfo().userName : o.info ? o.info.UserName : "", this.getbubbles()
		},
		"parseBubble": function (t, e) {
			var i = this,
				n = {},
				o = +new Date,
				r = 0,
				a = -1,
				s = _.sortBy(t, function (t, e) {
					return Math.max(t["priority"])
				}),
				l = {
					"val": i.parseBubbleCookie()
				};
			if (t && !(t.length < 1) && (l.arr = l.val.split("|") || [], l.num = l.arr.length, l.keys = function () {
					for (var t = {}, e = 0, i = l.arr.length; e < i; e++) t[l.arr[e]] = 1;
					return t
				}(), r = Math.min(e.max_number, e.vip_bubble), !(l.num >= r)))
				for (var c = 0, h = s.length; c < h; c++)
					if (n = s.shift(), n.start_time *= 1e3, n.end_time *= 1e3, log("气泡==> ", n, n.bubble_id, l.val, l.keys[n.bubble_id]), !l.keys[n.bubble_id] && n.start_time <= o && o < n.end_time) {
						n.putin_1 && 1 == n.putin_1.precision_status && "" !== u ? (a = n.putin_1.extid, i.getBipBubble(function (t) {
							var e = t.bubbles,
								o = !1;
							if (0 === t.status && t.bubbles.length > 0) {
								for (var r = 0, s = e.length; r < s; r++)
									if (e[r].bid == a) {
										log("精准气泡:", n, e[r], a), i.create(n), o = !0;
										break
									}
							} else log("BIP接口出错了 ", t, t.message);
							o || (l.keys[n.bubble_id] = 1, i.getNextBubble())
						})) : (log("正常气泡:", n), i.create(n));
						break
					}
		},
		"getbubbles": function () {},
		"getBipBubble": function (t) {},
		"getNextBubble": function () {
			var t = this;
			t.parseBubble(t.bubblelist, t.summary)
		},
		"parseBubbleCookie": function (t) {
			function e(t) {
				for (var e = [], i = {}, n = 0; n < t.length; n++) {
					var o = t[n],
						r = typeof o + o;
					1 !== i[r] && (e.push(o), i[r] = 1)
				}
				return e
			}
			var i = r.get(h) || "",
				n = [],
				o = "";
			return t ? (i ? (n = i.split("|"), n.push(t), o = e(n).join("|")) : o = t, r.set(h, o, 1, "pptv.com", "/"), o) : i
		},
		"parseTagCookie": function (t) {
			if ("object" != typeof this.bubbleTags) {
				var e = r.get("bubble_tags");
				this.bubbleTags = e && JSON.parse(e) || {}
			}
			if (t) {
				$.isArray(t) || (t = [t]);
				for (var i = 0; i < t.length; i++) {
					var n = t[i];
					void 0 !== this.bubbleTags[n] ? this.bubbleTags[n]++ : this.bubbleTags[n] = 1
				}
				r.set("bubble_tags", JSON.stringify(this.bubbleTags), 7, "pptv.com", "/")
			}
			return this.bubbleTags
		},
		"create": function (t) {
			function e() {
				var t = o.documentElement,
					e = t.scrollTop || o.body.scrollTop,
					i = t.clientHeight,
					n = c[0].offsetHeight,
					r = i - n,
					a = r + e;
				c[0].style.top = a + "px"
			}
			var i = document.createElement("iframe"),
				n = null,
				o = document,
				r = this,
				a = t.bubble_id,
				s = t.pageurl,
				u = 1e3 * (t.alive_time || 10),
				h = "clt" === l ? "11px" : 0,
				d = t.tags;
			if (Number(t.alive_time) <= 0) return !1;
			if ("clt" === l && window.clientCommon) {
				if (clientCommon.getPlayState && 2 == clientCommon.getPlayState()) return !1;
				var f = external.GetObject2("@pplive.com/ui/mainwindow;1");
				if (f && f.miniPlayerMode) return !1;
				if (window.external && 1 != external.GetObject("@pplive.com/ui/mainwindow;1").GetSelectedTabName()) return !1;
				if (0 == external.GetObject("@pplive.com/ui/mainwindow;1").visible) return !1
			}
			if (d && d.length > 0)
				for (var p = this.parseTagCookie(), g = 0; g < d.length; g++) {
					var m = p[d[g]];
					if (m && m >= 3) return !1
				}
			return a ? (n = setTimeout(function () {
				n && clearTimeout(n), c && c.hide(), r.parseBubbleCookie(a), r.parseTagCookie(d)
			}, u), c && c.length ? void c.show().css({
				"width": t.width,
				"height": t.height
			}).find("iframe").attr("src", s) : (c = $("<div />", {
				"id": "vip-bubbles",
				"css": {
					"position": "fixed",
					"z-index": 3005,
					"width": t.width,
					"height": t.height,
					"right": h,
					"bottom": 0
				}
			}).append('<a class="btn_close" style="display:block; position:absolute; z-index:1000; top:0px; right:0px; width:32px; height:28px; text-decoration:none;cursor:pointer;  overflow:hidden">\x3c!--<p style="width:100%; height:100%; background:url(http://sr4.pplive.com/cms/29/60/5ab72392ae38b3f69c41a0db8f8a0bbb.png) no-repeat 0px -28px; display:none;"></p>--\x3e</a><style>#vip-bubbles .btn_close{background:url(http://sr4.pplive.com/cms/29/60/5ab72392ae38b3f69c41a0db8f8a0bbb.png) no-repeat 0px -28px;}#vip-bubbles .btn_close:hover{background:url(http://sr4.pplive.com/cms/29/60/5ab72392ae38b3f69c41a0db8f8a0bbb.png) no-repeat 0px 0px;}</style>').appendTo($("body")), i.src = s, i.setAttribute("frameborder", "0"), i.style.cssText = "width:100%; height:100%", window.XMLHttpRequest || (c[0].style.position = "absolute", window.attachEvent("onscroll", e)), void c.append(i).find(".btn_close").on("click", function () {
				var t = $(this).parent();
				r.parseBubbleCookie(a), r.parseTagCookie(d), t.hide()
			}).hover(function () {
				$(this).find("p").fadeIn()
			}, function () {
				$(this).find("p").fadeOut(300)
			}))) : void alert("气泡id填写不正确！")
		}
	}, t.exports = new n
}, function (t, e) {
	var i = document.getElementsByTagName("body")[0],
		n = {
			"throttle": function (t, e, i) {
				return function () {
					t._l || (t._l = 1, setTimeout(function () {
						t._l = 0, t(e)
					}, i))
				}
			},
			"onResize": function (t) {
				var e = document.documentElement.clientWidth;
				if (/grid-\d{3,4}/g.test(i.className)) {
					var n = parseInt(i.className.match(/grid-(\d{3,4})/)[1]);
					t.css({
						"right": "auto",
						"left": (e - n) / 2 + n + 10 + "px"
					})
				} else t.css({
					"right": "10px",
					"left": "auto"
				});
				t.offset().left + t.width() > e && t.css({
					"right": "0",
					"left": "auto"
				})
			},
			"onScroll": function (t) {
				(i.scrollTop || document.documentElement.scrollTop) > document.documentElement.clientHeight ? t.css("visibility", "visible") : t.css("visibility", "hidden")
			}
		},
		o = function () {};
	o.prototype = {
		"create": function (t) {
			var e = this;
			this.target = t.target, this.delayTime = t.time;
			var i = n.throttle(n.onResize, e.target, 150);
			n.onResize(e.target);
			var o = n.throttle(n.onScroll, e.target, 150);
			n.onScroll(e.target), $(window).resize(i), $(window).scroll(o), this.target.on("click", this.goTop)
		},
		"goTop": function (t) {
			t.preventDefault(), $("html,body").animate({
				"scrollTop": "0px"
			}, this.delayTime)
		}
	};
	var r = new o;
	t.exports = {
		"init": function (t) {
			r.create(t)
		}
	}
}, function (t, e, i) {
	function n() {
		this.template = "<ul class='cf'>         </ul>";
		try {
			this.compiled = _.template(this.template)
		} catch (error) {
			console.error("猜你喜欢列表容器", error)
		}
	}
	var o = i(13).likesPanel;
	n.prototype = {
		"create": function (t) {
			this.innerHTML = this.compiled();
			var e = document.createElement("div");
			e.innerHTML = this.innerHTML;
			for (var i = $(e).find(".cf")[0], n = 0; n < t.length; n++) {
				var r = new o;
				r.create(t[n]), $(i).append(r.getDom())
			}
			this.dom = e.children[0];
			try {
				clientCommon.ex.initLinks()
			} catch (e) {}
		},
		"getDom": function () {
			return this.dom
		}
	}, t.exports = {
		"likesContainer": n
	}
}, function (t, e) {
	function i() {
		this.template = "<li>             <a href=<%= data.href %> title=<%= data.title %> _play_ctrl='both' _is_new='true'>                 <p class='coverpic'>                     <img src=<%= data.pic %>>                     <span class='bg'></span>                     <% if ( data.fl !== '' ) { %>                         <span class='status'><%= data.fl %></span>                     <% } %>                     <% if ( data.left_corner !== '' ) { %>                         <em class='unit-vipmask'><%= data.left_corner %></em>                     <% } %>                     <% if ( data.right_corner !== '' ) { %>                         <em class='<%= data.right_corner %>'></em>                     <% } %>                 </p>                 <dl class='coverinfo'>                     <dt><%= data.title %></dt>                     <dd>                         <% if (data.reason && data.reason !== '') { %>                             <i class='up'></i>                             <%= data.reason %>                         <% } else { %>                             <span>                                 <% for (var i = 0; i < data.epgCatas.length; i++) { %>                                     <%= data.epgCatas[i] %>                                     <% if (i < data.epgCatas.length - 1 ) { %>                                         <i>/</i>                                     <% } %>                                 <% } %>                             </span>                         <% } %>                     </dd>                 </dl>             </a>         </li>";
		try {
			this.compiled = _.template(this.template)
		} catch (error) {
			console.error("构造猜你喜欢模板失败", error)
		}
	}
	i.prototype = {
		"create": function (t) {
			return this.innerHTML = this.compiled({
				"data": t
			})
		},
		"getInnerHTML": function () {
			return this.innerHTML
		},
		"getDom": function () {
			var t = document.createElement("div");
			return t.innerHTML = this.innerHTML, t.children[0]
		}
	}, t.exports = {
		"likesPanel": i
	}
}, function (t, e, i) {
	function n(t) {
		$(t).map(function () {
			$(this).find("li").length > 1 && (parseInt($(this).attr("data-autoslide")) <= 0 ? $(this).find(".pre,.next").hide() : $(this).slide(a))
		})
	}

	function o(t) {
		n(t)
	}
	i(3);
	var r = i(2),
		a = {
			"mainCell": "ul",
			"autoPlay": !0,
			"effect": "leftLoop",
			"interTime": "10000",
			"prevCell": ".pre",
			"nextCell": ".next",
			"endFun": function (t, e, i) {
				$(i).find("ul li .barrage").removeClass("now");
				var n = $(i).find("ul li .barrage")[t + 1];
				$(n).addClass("now"), void 0 !== $(n).attr("barrageid") && r.start($(n).attr("barrageid"))
			},
			"startFun": function (t, e, i) {
				$(i).find("ul li .barrage").removeClass("now");
				var n = $(i).find("ul li .barrage")[t + 1];
				$(n).addClass("now"), void 0 !== $(n).attr("barrageid") && r.clean($(n).attr("barrageid"))
			}
		};
	t.exports = {
		"init": o
	}
}, function (t, e) {
	function i(t, e) {
		var i = $.extend({
			"evt": "mouseenter",
			"activeClass": "now",
			"hotclass": "hot",
			"beforeSwitch": function () {},
			"onSwitch": function () {},
			"delay": 150,
			"strict": !1
		}, e || {});
		return $(t).each(function (t, e) {
			var n, o = $(e),
				r = o.children(),
				a = $("#" + o.attr("data-targetid"));
			if (a.length) {
				var s = function (t, e) {
					if (i.strict) {
						var n = e.attr("data-targetid");
						t = a.find('[data-targetid="' + n + '"]').index()
					}
					var o = a.children(".tabcont");
					t < o.length && (i.beforeSwitch(t, o.eq(t)), r.removeClass(i.activeClass), e.addClass(i.activeClass), $(e.find(".hot-icon")).length && e.addClass(i.hotclass, i.activeClass), o.hide().eq(t).show(), i.onSwitch(t, o.eq(t)))
				};
				o.on(i.evt, ">*", function (t) {
					var e = $(this);
					n = setTimeout(function () {
						s(e.index(), e)
					}, "click" == i.evt ? 0 : i.delay)
				}).on("mouseleave", ">*", function (t) {
					clearTimeout(n)
				})
			}
		}), {}
	}
	t.exports = i
}, function (t, e, i) {
	var n = i(1),
		o = n.getModel,
		r = ($.ppUtils.isClient(), function () {
			o.call(this)
		});
	n.inheritPrototype(r, o), t.exports = {
		"createHomeModel": function () {
			return new r
		}
	};
	var n = i(1),
		o = n.getModel,
		r = function () {
			o.call(this)
		};
	n.inheritPrototype(r, o), t.exports = {
		"createHomeModel": function () {
			return new r
		}
	}
}, function (t, e, i) {
	function n() {
		this.likes = null, this.currentIndex = 0
	}
	i(0);
	n.prototype.init = function (t, e) {
		var i = e || {},
			o = null;
		i.resfn && (o = i.resfn, delete i.resfn), $.ajax({
			"url": i.url ? i.url : "",
			"data": $.extend(!0, {
				"cb": "getRec",
				"from": "web",
				"version": $.ppVersion,
				"format": "jsonp",
				"appplt": "ikan",
				"appid": "111",
				"src": "71",
				"appver": "1",
				"num": "18",
				"ppi": "312c32",
				"userLevel": "0",
				"vipUser": "0",
				"uid": Cookies.get("PUID"),
				"extraFields": "all"
			}, i),
			"dataType": "jsonp",
			"jsonp": "callback",
			"jsonpCallback": "getRec"
		}).then(function (e) {
			0 === e.error ? (this.likes = $.map(e.videos, function (t) {
				return {
					"href": "http://v.pptv.com/show/" + t.url + ".html?rcc_src=A4",
					"pic": o && o(t).pic ? o(t).pic : "http://s" + t.sn + ".pplive.cn/v/cap/" + t.pic + "/w160.jpg",
					"fl": void 0 === t.fl ? void 0 === t.mask ? "" : t.mask : t.fl,
					"title": t.title,
					"reason": t.reason,
					"epgCatas": n.convertEpgCatas(t.epgCatas),
					"left_corner": void 0 === t.left_corner ? "" : t.left_corner,
					"right_corner": "" === t.right_corner || void 0 === t.right_corner ? "" : "unit-covermask " + t.right_corner
				}
			}), t(this.likes)) : n.error(e)
		}, function (t) {
			n.error(t)
		})
	}, n.prototype.refresh = function () {
		return ++this.currentIndex % 3
	}, n.convertEpgCatas = function (t) {
		var e = t.sort(function (t, e) {
			return t.level - e.level
		}).slice(0, 3);
		return $.map(e, function (t, e) {
			return t.title
		})
	}, n.error = function (t) {
		console.log("获取猜你喜欢数据错误", t)
	}, t.exports = {
		"likesModel": n
	}
}, function (t, e) {
	function i(t, e) {
		var i = $(t),
			n = i.find(".pp-online");
		n.length > 0 && n.each(function (t, i) {
			var n = $(i),
				o = n.attr("pp-online-time"),
				r = n.attr("pp-offline-time");
			o && (o = 1e3 * Number(o)), r && (r = 1e3 * Number(r)), r && r < e && n.remove(), o && (o < e ? n.show() : n.remove())
		})
	}

	function n(t, e) {
		if (/pptv\.com/i.test(window.location.host)) try {
			$.ppUtils.serverTimePromise(function (n) {
				i(t, n), e.call(window)
			})
		} catch (e) {} else e.call(window)
	}
	t.exports = {
		"init": n
	}
}, function (t, e, i) {
	(function (i) {
		var n, o, r = function () {
			this._tweens = {}, this._tweensAddedDuringUpdate = {}
		};
		r.prototype = {
				"getAll": function () {
					return Object.keys(this._tweens).map(function (t) {
						return this._tweens[t]
					}.bind(this))
				},
				"removeAll": function () {
					this._tweens = {}
				},
				"add": function (t) {
					this._tweens[t.getId()] = t, this._tweensAddedDuringUpdate[t.getId()] = t
				},
				"remove": function (t) {
					delete this._tweens[t.getId()], delete this._tweensAddedDuringUpdate[t.getId()]
				},
				"update": function (t, e) {
					var i = Object.keys(this._tweens);
					if (0 === i.length) return !1;
					for (t = void 0 !== t ? t : TWEEN.now(); i.length > 0;) {
						this._tweensAddedDuringUpdate = {};
						for (var n = 0; n < i.length; n++) !1 === this._tweens[i[n]].update(t) && (this._tweens[i[n]]._isPlaying = !1, e || delete this._tweens[i[n]]);
						i = Object.keys(this._tweensAddedDuringUpdate)
					}
					return !0
				}
			}, TWEEN = new r, TWEEN.Group = r, TWEEN._nextId = 0, TWEEN.nextId = function () {
				return TWEEN._nextId++
			}, "undefined" == typeof window && void 0 !== i ? TWEEN.now = function () {
				var t = i.hrtime();
				return 1e3 * t[0] + t[1] / 1e6
			} : "undefined" != typeof window && void 0 !== window.performance && void 0 !== window.performance.now ? TWEEN.now = window.performance.now.bind(window.performance) : void 0 !== Date.now ? TWEEN.now = Date.now : TWEEN.now = function () {
				return (new Date).getTime()
			}, TWEEN.Tween = function (t, e) {
				this._object = t, this._valuesStart = {}, this._valuesEnd = {}, this._valuesStartRepeat = {}, this._duration = 1e3, this._repeat = 0, this._repeatDelayTime = void 0, this._yoyo = !1, this._isPlaying = !1, this._reversed = !1, this._delayTime = 0, this._startTime = null, this._easingFunction = TWEEN.Easing.Linear.None, this._interpolationFunction = TWEEN.Interpolation.Linear, this._chainedTweens = [], this._onStartCallback = null, this._onStartCallbackFired = !1, this._onUpdateCallback = null, this._onCompleteCallback = null, this._onStopCallback = null, this._group = e || TWEEN, this._id = TWEEN.nextId()
			}, TWEEN.Tween.prototype = {
				"getId": function () {
					return this._id
				},
				"isPlaying": function () {
					return this._isPlaying
				},
				"to": function (t, e) {
					return this._valuesEnd = t, void 0 !== e && (this._duration = e), this
				},
				"start": function (t) {
					this._group.add(this), this._isPlaying = !0, this._onStartCallbackFired = !1, this._startTime = void 0 !== t ? t : TWEEN.now(), this._startTime += this._delayTime;
					for (var e in this._valuesEnd) {
						if (this._valuesEnd[e] instanceof Array) {
							if (0 === this._valuesEnd[e].length) continue;
							this._valuesEnd[e] = [this._object[e]].concat(this._valuesEnd[e])
						}
						void 0 !== this._object[e] && (this._valuesStart[e] = this._object[e], this._valuesStart[e] instanceof Array == !1 && (this._valuesStart[e] *= 1), this._valuesStartRepeat[e] = this._valuesStart[e] || 0)
					}
					return this
				},
				"stop": function () {
					return this._isPlaying ? (this._group.remove(this), this._isPlaying = !1, null !== this._onStopCallback && this._onStopCallback.call(this._object, this._object), this.stopChainedTweens(), this) : this
				},
				"end": function () {
					return this.update(this._startTime + this._duration), this
				},
				"stopChainedTweens": function () {
					for (var t = 0, e = this._chainedTweens.length; t < e; t++) this._chainedTweens[t].stop()
				},
				"delay": function (t) {
					return this._delayTime = t, this
				},
				"repeat": function (t) {
					return this._repeat = t, this
				},
				"repeatDelay": function (t) {
					return this._repeatDelayTime = t, this
				},
				"yoyo": function (t) {
					return this._yoyo = t, this
				},
				"easing": function (t) {
					return this._easingFunction = t, this
				},
				"interpolation": function (t) {
					return this._interpolationFunction = t, this
				},
				"chain": function () {
					return this._chainedTweens = arguments, this
				},
				"onStart": function (t) {
					return this._onStartCallback = t, this
				},
				"onUpdate": function (t) {
					return this._onUpdateCallback = t, this
				},
				"onComplete": function (t) {
					return this._onCompleteCallback = t, this
				},
				"onStop": function (t) {
					return this._onStopCallback = t, this
				},
				"update": function (t) {
					var e, i, n;
					if (t < this._startTime) return !0;
					!1 === this._onStartCallbackFired && (null !== this._onStartCallback && this._onStartCallback.call(this._object, this._object), this._onStartCallbackFired = !0), i = (t - this._startTime) / this._duration, i = i > 1 ? 1 : i, n = this._easingFunction(i);
					for (e in this._valuesEnd)
						if (void 0 !== this._valuesStart[e]) {
							var o = this._valuesStart[e] || 0,
								r = this._valuesEnd[e];
							r instanceof Array ? this._object[e] = this._interpolationFunction(r, n) : ("string" == typeof r && (r = "+" === r.charAt(0) || "-" === r.charAt(0) ? o + parseFloat(r) : parseFloat(r)), "number" == typeof r && (this._object[e] = o + (r - o) * n))
						}
					if (null !== this._onUpdateCallback && this._onUpdateCallback.call(this._object, n), 1 === i) {
						if (this._repeat > 0) {
							isFinite(this._repeat) && this._repeat--;
							for (e in this._valuesStartRepeat) {
								if ("string" == typeof this._valuesEnd[e] && (this._valuesStartRepeat[e] = this._valuesStartRepeat[e] + parseFloat(this._valuesEnd[e])), this._yoyo) {
									var a = this._valuesStartRepeat[e];
									this._valuesStartRepeat[e] = this._valuesEnd[e], this._valuesEnd[e] = a
								}
								this._valuesStart[e] = this._valuesStartRepeat[e]
							}
							return this._yoyo && (this._reversed = !this._reversed), void 0 !== this._repeatDelayTime ? this._startTime = t + this._repeatDelayTime : this._startTime = t + this._delayTime, !0
						}
						null !== this._onCompleteCallback && this._onCompleteCallback.call(this._object, this._object);
						for (var s = 0, l = this._chainedTweens.length; s < l; s++) this._chainedTweens[s].start(this._startTime + this._duration);
						return !1
					}
					return !0
				}
			}, TWEEN.Easing = {
				"Linear": {
					"None": function (t) {
						return t
					}
				},
				"Quadratic": {
					"In": function (t) {
						return t * t
					},
					"Out": function (t) {
						return t * (2 - t)
					},
					"InOut": function (t) {
						return (t *= 2) < 1 ? .5 * t * t : -.5 * (--t * (t - 2) - 1)
					}
				},
				"Cubic": {
					"In": function (t) {
						return t * t * t
					},
					"Out": function (t) {
						return --t * t * t + 1
					},
					"InOut": function (t) {
						return (t *= 2) < 1 ? .5 * t * t * t : .5 * ((t -= 2) * t * t + 2)
					}
				},
				"Quartic": {
					"In": function (t) {
						return t * t * t * t
					},
					"Out": function (t) {
						return 1 - --t * t * t * t
					},
					"InOut": function (t) {
						return (t *= 2) < 1 ? .5 * t * t * t * t : -.5 * ((t -= 2) * t * t * t - 2)
					}
				},
				"Quintic": {
					"In": function (t) {
						return t * t * t * t * t
					},
					"Out": function (t) {
						return --t * t * t * t * t + 1
					},
					"InOut": function (t) {
						return (t *= 2) < 1 ? .5 * t * t * t * t * t : .5 * ((t -= 2) * t * t * t * t + 2)
					}
				},
				"Sinusoidal": {
					"In": function (t) {
						return 1 - Math.cos(t * Math.PI / 2)
					},
					"Out": function (t) {
						return Math.sin(t * Math.PI / 2)
					},
					"InOut": function (t) {
						return .5 * (1 - Math.cos(Math.PI * t))
					}
				},
				"Exponential": {
					"In": function (t) {
						return 0 === t ? 0 : Math.pow(1024, t - 1)
					},
					"Out": function (t) {
						return 1 === t ? 1 : 1 - Math.pow(2, -10 * t)
					},
					"InOut": function (t) {
						return 0 === t ? 0 : 1 === t ? 1 : (t *= 2) < 1 ? .5 * Math.pow(1024, t - 1) : .5 * (2 - Math.pow(2, -10 * (t - 1)))
					}
				},
				"Circular": {
					"In": function (t) {
						return 1 - Math.sqrt(1 - t * t)
					},
					"Out": function (t) {
						return Math.sqrt(1 - --t * t)
					},
					"InOut": function (t) {
						return (t *= 2) < 1 ? -.5 * (Math.sqrt(1 - t * t) - 1) : .5 * (Math.sqrt(1 - (t -= 2) * t) + 1)
					}
				},
				"Elastic": {
					"In": function (t) {
						return 0 === t ? 0 : 1 === t ? 1 : -Math.pow(2, 10 * (t - 1)) * Math.sin(5 * (t - 1.1) * Math.PI)
					},
					"Out": function (t) {
						return 0 === t ? 0 : 1 === t ? 1 : Math.pow(2, -10 * t) * Math.sin(5 * (t - .1) * Math.PI) + 1
					},
					"InOut": function (t) {
						return 0 === t ? 0 : 1 === t ? 1 : (t *= 2, t < 1 ? -.5 * Math.pow(2, 10 * (t - 1)) * Math.sin(5 * (t - 1.1) * Math.PI) : .5 * Math.pow(2, -10 * (t - 1)) * Math.sin(5 * (t - 1.1) * Math.PI) + 1)
					}
				},
				"Back": {
					"In": function (t) {
						var e = 1.70158;
						return t * t * ((e + 1) * t - e)
					},
					"Out": function (t) {
						var e = 1.70158;
						return --t * t * ((e + 1) * t + e) + 1
					},
					"InOut": function (t) {
						var e = 2.5949095;
						return (t *= 2) < 1 ? t * t * ((e + 1) * t - e) * .5 : .5 * ((t -= 2) * t * ((e + 1) * t + e) + 2)
					}
				},
				"Bounce": {
					"In": function (t) {
						return 1 - TWEEN.Easing.Bounce.Out(1 - t)
					},
					"Out": function (t) {
						return t < 1 / 2.75 ? 7.5625 * t * t : t < 2 / 2.75 ? 7.5625 * (t -= 1.5 / 2.75) * t + .75 : t < 2.5 / 2.75 ? 7.5625 * (t -= 2.25 / 2.75) * t + .9375 : 7.5625 * (t -= 2.625 / 2.75) * t + .984375
					},
					"InOut": function (t) {
						return t < .5 ? .5 * TWEEN.Easing.Bounce.In(2 * t) : .5 * TWEEN.Easing.Bounce.Out(2 * t - 1) + .5
					}
				}
			}, TWEEN.Interpolation = {
				"Linear": function (t, e) {
					var i = t.length - 1,
						n = i * e,
						o = Math.floor(n),
						r = TWEEN.Interpolation.Utils.Linear;
					return e < 0 ? r(t[0], t[1], n) : e > 1 ? r(t[i], t[i - 1], i - n) : r(t[o], t[o + 1 > i ? i : o + 1], n - o)
				},
				"Bezier": function (t, e) {
					for (var i = 0, n = t.length - 1, o = Math.pow, r = TWEEN.Interpolation.Utils.Bernstein, a = 0; a <= n; a++) i += o(1 - e, n - a) * o(e, a) * t[a] * r(n, a);
					return i
				},
				"CatmullRom": function (t, e) {
					var i = t.length - 1,
						n = i * e,
						o = Math.floor(n),
						r = TWEEN.Interpolation.Utils.CatmullRom;
					return t[0] === t[i] ? (e < 0 && (o = Math.floor(n = i * (1 + e))), r(t[(o - 1 + i) % i], t[o], t[(o + 1) % i], t[(o + 2) % i], n - o)) : e < 0 ? t[0] - (r(t[0], t[0], t[1], t[1], -n) - t[0]) : e > 1 ? t[i] - (r(t[i], t[i], t[i - 1], t[i - 1], n - i) - t[i]) : r(t[o ? o - 1 : 0], t[o], t[i < o + 1 ? i : o + 1], t[i < o + 2 ? i : o + 2], n - o)
				},
				"Utils": {
					"Linear": function (t, e, i) {
						return (e - t) * i + t
					},
					"Bernstein": function (t, e) {
						var i = TWEEN.Interpolation.Utils.Factorial;
						return i(t) / i(e) / i(t - e)
					},
					"Factorial": function () {
						var t = [1];
						return function (e) {
							var i = 1;
							if (t[e]) return t[e];
							for (var n = e; n > 1; n--) i *= n;
							return t[e] = i, i
						}
					}(),
					"CatmullRom": function (t, e, i, n, o) {
						var r = .5 * (i - t),
							a = .5 * (n - e),
							s = o * o;
						return (2 * e - 2 * i + r + a) * (o * s) + (-3 * e + 3 * i - 2 * r - a) * s + r * o + e
					}
				}
			},
			function (i) {
				n = [], void 0 !== (o = function () {
					return TWEEN
				}.apply(e, n)) && (t.exports = o)
			}()
	}).call(e, i(7))
}, function (t, e, i) {
	function n(t) {
		if ("undefined" == typeof HTMLCanvasElement) throw new Error("broswer not support canvas");
		if (!t instanceof HTMLCanvasElement) throw new Error("The root element should be canvas");
		this.root = t
	}

	function o(t, e) {
		t && console.info(e)
	}

	function r() {
		this.data = []
	}

	function a(t) {
		this.barrage = new n(t)
	}
	i(19), window.requestAnimationFrame = function () {
		return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function (t) {
			window.setTimeout(t, 1e3 / 60)
		}
	}();
	var s = {
		"trackHeight": 80,
		"bulletHeight": 30,
		"displayTime": 1e4,
		"isDebug": !1,
		"fontSize": 14,
		"bottom": 50,
		"bulletMargin": 20
	};
	n.prototype.initTrack = function () {
		this.trackAmount = parseInt((this.root.offsetHeight - this.config.bottom) / this.config.trackHeight);
		for (var t = 0; t < this.trackAmount; t++) this.tracks.push({
			"id": t,
			"top": (t + 1) * this.config.trackHeight
		}), this.lastFired[t] = null;
		this.lastFired.length = this.trackAmount, o(this.config.isDebug, "初始化弹道数量: " + this.trackAmount)
	}, n.prototype.animate = function (t) {
		"running" === this.status && (this.ctx.clearRect(0, 0, this.root.offsetWidth, this.root.offsetHeight), this.fire(), this.tweenGroup.update(t), requestAnimationFrame(this.animate.bind(this)))
	}, n.prototype.init = function (t) {
		this.config = $.extend(s, t || {}), o(this.config.isDebug, "弹幕初始化"), this.bulletId = 0, this.bulletPool = [], this.bulletRunningPool = new l.Map, this.tracks = [], this.lastFired = {}, this.fireTimer = null, this.tweenGroup = new TWEEN.Group, this.status = "init", this.nextBullet = null, this.root.width = this.root.offsetWidth, this.root.height = this.root.offsetHeight, this.ctx = this.root.getContext("2d"), this.ctx.font = this.config.fontSize + "px Microsoft YaHei", this.ctx.textBaseline = "middle", this.canvasWidth = this.root.offsetWidth, this.initTrack(this.config, this.tracks, this.root.offsetHeight)
	}, n.prototype.load = function (t) {
		$.each(t, function (t, e) {
			e.id = this.bulletId, this.bulletId++
		}.bind(this)), this.bulletPool = this.bulletPool.concat(t), o(this.config.isDebug, "装载子弹，子弹数量：" + this.bulletPool.length), this.status && "idle" === this.status && (this.status = "running", requestAnimationFrame(this.animate.bind(this)))
	}, n.prototype.moveBullet = function (t) {
		var e = new TWEEN.Tween(t.steps, this.tweenGroup).to({
			"left": this.canvasWidth + t.width
		}, this.config.displayTime).onUpdate(function () {
			this.print(t)
		}.bind(this)).easing(TWEEN.Easing.Linear.None).onComplete(function () {
			this.bulletRunningPool["delete"](t.id), 0 === this.bulletRunningPool.size() && null === this.nextBullet && (this.status = "idle")
		}.bind(this));
		return e.start(), e
	}, n.prototype.print = function (t) {
		var e = this.root.offsetWidth;
		this.root.offsetHeight;
		this.ctx.fillStyle = "rgba(0,0,0,0.5)", this.ctx.beginPath(), this.ctx.arc(e - t.steps.left + this.config.bulletHeight / 2, this.tracks[t.trackId].top - this.config.bulletHeight / 2, this.config.bulletHeight / 2, -Math.PI / 2, Math.PI / 2, !0), this.ctx.fill(), this.ctx.fillRect(e - t.steps.left + this.config.bulletHeight / 2, this.tracks[t.trackId].top - this.config.bulletHeight, t.width - this.config.bulletHeight, this.config.bulletHeight), this.ctx.beginPath(), this.ctx.arc(e - t.steps.left - this.config.bulletHeight / 2 + t.width, this.tracks[t.trackId].top - this.config.bulletHeight / 2, this.config.bulletHeight / 2, Math.PI / 2, 1.5 * Math.PI, !0), this.ctx.fill(), this.ctx.fillStyle = "rgba(255,255,255,1)", this.ctx.fillText(t.msg, e - t.steps.left + this.config.bulletHeight / 2, this.tracks[t.trackId].top - this.config.bulletHeight / 2)
	}, n.prototype.createBullet = function (t) {
		return {
			"id": t.id,
			"msg": t.msg,
			"width": l.getTextBulletLength(this.ctx, t.msg, this.config.bulletHeight),
			"v": (l.getTextBulletLength(this.ctx, t.msg, this.config.bulletHeight) + this.root.offsetWidth) / this.config.displayTime,
			"trackId": null,
			"steps": {
				"left": 0
			}
		}
	}, n.prototype.getIdleTrack = function () {
		for (var t = 0; t < this.lastFired.length; t++) {
			if (null === this.lastFired[t] || void 0 === this.lastFired[t]) return t;
			if (!(this.lastFired[t].steps.left < this.lastFired[t].width + this.config.bulletMargin)) {
				if (this.lastFired[t].v >= this.nextBullet.v) return t;
				if (this.lastFired[t].steps.left - this.lastFired[t].width >= (this.nextBullet.v - this.lastFired[t].v) * this.config.displayTime + this.config.bulletMargin) return t
			}
		}
		return null
	}, n.prototype.fire = function () {
		if (0 === this.bulletPool.length && null === this.nextBullet) return o(this.config.isDebug, "bulletPool已空，进入空闲状态"), void(0 === this.bulletRunningPool.size() && null === this.nextBullet && this.status);
		if (null === this.nextBullet) {
			var t = this.bulletPool.shift();
			this.nextBullet = this.createBullet(t)
		}
		var e = this.getIdleTrack();
		if (null === e) return void o(this.config.isDebug, "没有找到可用的弹道");
		this.nextBullet.trackId = e, this.lastFired[e] = this.nextBullet, this.bulletRunningPool.set(this.nextBullet.id, this.nextBullet);
		var i = this.moveBullet(this.nextBullet);
		this.bulletRunningPool.get(this.nextBullet.id).step = i, this.nextBullet = null
	}, n.prototype.start = function () {
		this.status && "init" === this.status && (this.status = "running", requestAnimationFrame(this.animate.bind(this)))
	}, n.prototype.clearAll = function () {
		void 0 !== this.status && (this.nextBullet = null, this.bulletPool = [], this.bulletRunningPool.each(function (t) {
			t.step && t.step.stop()
		}), this.bulletRunningPool.clear(), this.initTrack(), this.status = "init", this.ctx.clearRect(0, 0, this.root.offsetWidth, this.root.offsetHeight))
	};
	var l = {
		"getTextBulletLength": function (t, e, i) {
			return t.measureText(e).width + i
		},
		"Map": r
	};
	r.prototype = {
		"size": function () {
			return this.data.length
		},
		"clear": function () {
			this.data.splice(0, this.data.length)
		},
		"indexOf": function (t) {
			for (var e = 0; e < this.data.length; e++)
				if (this.data[e].key === t) return e;
			return -1
		},
		"get": function (t) {
			var e = this.indexOf(t);
			if (-1 !== e) return this.data[e].value
		},
		"set": function (t, e) {
			var i = this.indexOf(t); - 1 === i ? this.data.push({
				"key": t,
				"value": e
			}) : this.data[i].value = e
		},
		"delete": function (t) {
			var e = this.indexOf(t);
			return -1 !== e && (this.data.splice(e, 1), !0)
		},
		"each": function (t) {
			for (var e = 0; e < this.data.length; e++) t(this.data[e].value)
		}
	}, a.prototype = {
		"init": function (t) {
			this.barrage.init(t)
		},
		"load": function (t) {
			this.barrage.load(t)
		},
		"start": function () {
			this.barrage.start()
		},
		"clearAll": function () {
			this.barrage.clearAll()
		},
		"getStatus": function () {
			return this.barrage.status
		}
	}, t.exports = {
		"ppBarrage": a
	}
}, function (t, e, i) {
	function n() {
		h.call(this)
	}
	var o = i(1),
		r = i(0),
		a = $.ppUtils.formatDate,
		s = $.ppUtils.newDate,
		l = window.Cookies,
		u = $.ppUtils.isClient(),
		c = u ? clientCommon : {},
		h = o.getModel;
	o.inheritPrototype(n, h), n.prototype = {
		"constructor": n,
		"allBookStates": void 0,
		"getPPToken": function () {
			return l.get("ppToken")
		},
		"getBook": function (t, e) {
			t = $.extend({
				"tk": this.getPPToken()
			}, t), $.ppXHR.JSONP({
				"url": "http://sync.pptv.com/v7/" + r.info.UserName + "/Subscribe/live",
				"data": t,
				"success": function (t) {
					e(t)
				}
			})
		},
		"getClientId": function (t) {
			return -1 != _.indexOf(["0", "1"], t.category) ? [t.category, t.sectionId].join("-") : [t.category, t.cid, t.startTime].join("-")
		},
		"checkBookState": function (t, e) {
			_.each(e, function (t, i) {
				if (!i.match(/time/i)) {
					/^\d+$/g.test(t) && (e[i] = String(t))
				}
			});
			var i = !1;
			return u ? i = c.findBook(this.getClientId(e)) : (-1 != _.indexOf(["0", "1"], e.category) && $.each(t, function (t, n) {
				e.sectionId === n.sectionId && (i = !0)
			}), -1 != _.indexOf(["2", "3", "4"], e.category) && $.each(t, function (t, n) {
				e.cid === n.cid && e.startTime == n.startTime && (i = !0)
			})), i
		},
		"getAllBookStates": function (t, e) {
			var i = this;
			e || !i.allBookStates && r.isLogined ? i.getBook({
				"method": "get"
			}, function (e) {
				i.allBookStates = e, t(e)
			}) : t(i.allBookStates)
		},
		"modifyBook": function (t, e) {
			var i = this;
			if (!i.getPPToken()) return void window.ppLogin.init({
				"type": "login"
			});
			if (u) {
				var n;
				"modify" in t ? (n = t.modify[0], c.addBook(i.getClientId(n), n.title, n.link, a(s(Number(n.startTime)), "YYYYMMDDhhmm"), a(s(Number(n.endTime)), "YYYYMMDDhhmm"))) : "remove" in t && (n = t.remove[0], c.delBook(i.getClientId(n), n.title)), e()
			} else i.getBook({
				"_method": "post",
				"_json": JSON.stringify(t)
			}, function (t) {
				i.getAllBookStates(function (t) {
					e(t)
				}, !0)
			})
		},
		"removeBook": function (t, e) {
			var i = this;
			if (!i.getPPToken()) return void window.ppLogin.init({
				"type": "login"
			});
			i.getBook({
				"_method": "post",
				"_json": JSON.stringify({
					"remove": t
				})
			}, function (t) {
				e(t)
			})
		}
	}, t.exports = new n
}, function (t, e, i) {
	function n() {}
	var o = (i(0), window.Cookies);
	n.prototype = {
		"constructor": n,
		"followHandle": function (t, e, i) {
			$.ppXHR.JSONP({
				"url": t,
				"type": "GET",
				"data": {
					"username": e.username,
					"token": o.get("ppToken")
				},
				"success": function (t) {
					i && i(t)
				}
			})
		},
		"getFans": function (t, e, i) {
			$.ppXHR.JSONP({
				"url": t,
				"type": "GET",
				"data": {
					"usernames": e.usernames,
					"token": o.get("ppToken")
				},
				"success": function (t) {
					i && i(t)
				}
			})
		}
	}, t.exports = new n
}, , function (t, e, i) {
	var n = (i(4), i(16).createHomeModel(), i(21)),
		o = i(27),
		r = i(15),
		a = i(14),
		s = i(2),
		l = (i(22), i(29)),
		u = i(37).redianModel,
		c = i(17).likesModel,
		h = i(12).likesContainer,
		d = i(36).longzhuModel,
		f = i(31).longzhu,
		p = i(32).redian,
		g = i(30),
		m = i(11),
		v = i(33),
		b = i(9).banner,
		w = i(10),
		y = i(6),
		k = y.ppUtils.isClient(),
		C = i(18),
		x = function () {
			this.options = {}, this.redianM = null, this.redianC = null
		};
	x.asyncInit = function (t, e) {
		return function () {
			setTimeout(function () {
				t.call(e, arguments)
			}, 0)
		}
	}, x.prototype.init = function (t) {
		y.extend({}, this.options, t), this.slideproject(), x.asyncInit(this.barrageInit, this)(), this.sliderInit(), this.redianInit(), this.likesInit(), this.longzhuInit(), this.longwordInit(), this.tabInit(), this.bookInit(), this.followInit(), this.vasGameInit(), this.goToTopInit(), this.bubbelInit(), y(".wp-main img").lazyload({
			"data_attribute": "src2",
			"failure_limit": 20
		})
	}, x.prototype.sliderInit = function () {
		a.init(".module-pic382x320"), a.init(".module-pic382x295")
	}, x.prototype.slideproject = function () {
		var t = this;
		t.b = new b, C.init(y("#index-slider"), function () {
			t.b.init({
				"beforeSwitch": function () {
					y(".slider-1st-top").remove(), y(".slider-1st-bottom").remove(), y("body").hasClass("site-white") ? y("body").removeClass("site-white") : y("body").hasClass("site-black") && y("body").removeClass("site-black")
				},
				"dataExtraAttr": y("div.slider_btns").attr("data-extra-attr")
			})
		})
	}, x.prototype.vasGameInit = function () {
		v.init()
	}, x.prototype.barrageInit = function () {
		var t = this;
		this.barrageLoader = s, this.barrageLoader.loadBarrageCache(".barrage"), y.each(this.barrageLoader.getBarrageCache(!0), function (e, i) {
			t.barrageLoader.start(i.id)
		}), y(window).scroll(function () {
			y.each(t.barrageLoader.getBarrageCache(!0), function (e, i) {
				"init" === i.barrage.getStatus() && t.barrageLoader.start(i.id)
			}), y.each(t.barrageLoader.getBarrageCache(!1), function (e, i) {
				"running" !== i.barrage.getStatus() && "idle" !== i.barrage.getStatus() || t.barrageLoader.clean(i.id)
			})
		})
	}, x.prototype.goToTopInit = function () {
		m.init({
			"target": y("#sidebar-gotop"),
			"time": 0
		})
	}, x.prototype.redianInit = function () {
		var t = this;
		t.redianM = new u, t.redianC = new p, y("#redian .switch").click(_.throttle(function (e) {
			e.preventDefault(), t.redianM.refresh(function (e) {
				t.redianC.refresh(e)
			})
		}, 250))
	}, x.prototype.likesInit = function () {
		var t = this,
			e = y("#likes .unit-pic-layout.module-pic180x100");
		this.likesM = new c, this.likesM.init(function (i) {
			var n = [i.slice(0, 6), i.slice(6, 12), i.slice(12, 18)];
			e.empty(), y.each(n, function (t, i) {
				var n = new h;
				n.create(i);
				var o = n.getDom();
				t > 0 && (o.style.display = "none"), e.append(o)
			}), y("#likes .switch").click(function (i) {
				i.preventDefault();
				var n = t.likesM.refresh();
				e.children().map(function (t, e) {
					n === t ? y(e).fadeIn() : y(e).hide()
				})
			})
		})
	}, x.prototype.longzhuInit = function () {
		this.longzhuM = new d, this.nvshengC = new f, this.nvshengC2 = new f, this.nvshengC.init("#longzhunvsheng", "nvsheng", this.longzhuM), this.nvshengC2.init("#longzhudianjing", "youxi", this.longzhuM)
	}, x.prototype.longwordInit = function () {
		g.init()
	}, x.prototype.bookInit = function () {
		var t = {
			"targetClass": "book",
			"dataAttr": "book-info",
			"titleObj": {
				"book": "<i></i>订阅",
				"booked": "<i></i>已订阅",
				"unbooked": "<i></i>取消订阅"
			}
		};
		y(document).on("HomePageSub", function () {
			n.getAllBookStates(function (e) {
				o.btnBookStateEach(y(".common-book-item"), e, t)
			})
		}), y(document).trigger("HomePageSub")
	}, x.prototype.tabInit = function () {
		var t = this;
		r(".ui-tab-switch", {
			"beforeSwitch": function (t, e) {
				if (e.find("textarea").length > 0) {
					var i = e.find("textarea").val();
					e.html(i)
				}
			},
			"onSwitch": function (e, i) {
				i.find(".common-book-item").length > 0 && y(document).trigger("HomePageSub"), 0 === i.find(".clone").length && (t.barrageLoader.loadBarrageCache(".barrage"), a.init(i.find(".module-pic382x320")), a.init(i.find(".module-pic382x295")));
				var n = i.find(".module-pic382x320");
				1 === n.find("ul li").length ? (t.barrageLoader.clean(n.find("ul li .barrage").eq(0).attr("barrageId")), t.barrageLoader.start(n.find("ul li .barrage").eq(0).attr("barrageId"))) : (t.barrageLoader.clean(n.find("ul li .barrage.now").eq(0).attr("barrageId")), t.barrageLoader.start(n.find("ul li .barrage.now").eq(0).attr("barrageId"))), y(i.find("img")).lazyload({
					"data_attribute": "src2",
					"failure_limit": 20
				})
			}
		})
	}, x.prototype.bubbelInit = function () {
		if (!k) {
			w.init(), setInterval(function () {
				w.init()
			}, 6e5)
		}
	}, x.prototype.followInit = function () {
		0 != y(".j_followWrap li").length && l.init(y(".j_followWrap"))
	};
	var T;
	t.exports = {
		"getInstance": function () {
			return T || (T = new x)
		}
	}
}, , function (t, e) {}, function (t, e, i) {
	function n() {}
	var o = i(21),
		r = i(0);
	n.prototype = {
		"constructor": n,
		"btnBookStateEach": function (t, e, i) {
			i = $.extend({
				"dataAttr": i.dataAttr || "book-info",
				"titleObj": i.titleObj,
				"targetClass": i.targetClass
			}, i);
			var n = i.targetClass + "ed";
			t.each(function (t, a) {
				var s = $(a),
					l = s.attr(i.dataAttr) || encodeURIComponent("{}"),
					u = [JSON.parse(decodeURIComponent(l))];
				if (e && r.isLogined) {
					var c = o.checkBookState(e, u[0]),
						h = s.find("." + i.targetClass);
					c ? h.attr("title", "已订阅").html(i.titleObj["booked"]).addClass(n) : h.attr("title", "订阅").html(i.titleObj["book"]).removeClass(n)
				}
				s.on("click", "." + i.targetClass, function () {
					var t = $(this);
					t.hasClass(n) ? o.modifyBook({
						"remove": u
					}, function () {
						t.attr("title", "订阅").html(i.titleObj["book"]).removeClass(n), t.siblings(".book").length > 0 && t.siblings(".book").attr("title", "订阅").html(i.titleObj["book"]).removeClass(n)
					}) : o.modifyBook({
						"modify": u
					}, function () {
						t.attr("title", "已订阅").html(i.titleObj["booked"]).addClass(n), t.siblings(".book").length > 0 && t.siblings(".book").attr("title", "已订阅").html(i.titleObj["booked"]).addClass(n)
					})
				}).on("mouseenter", "." + i.targetClass + "ed", function (t) {
					$(this).html(i.titleObj["unbooked"])
				}).on("mouseleave", "." + i.targetClass + "ed", function (t) {
					$(this).html(i.titleObj["booked"])
				})
			})
		}
	}, t.exports = new n
}, , function (t, e, n) {
	function o() {}
	var r = n(0),
		a = (window.Cookies, $.ppUtils.isClient()),
		s = n(22),
		l = {
			"setStateTrue": "http://webuser.api.pptv.com/follow/follow",
			"setStateFalse": "http://webuser.api.pptv.com/follow/unfollow",
			"getState": "http://webuser.api.pptv.com/follow/multiFollower"
		};
	o.prototype = {
		"constructor": o,
		"init": function (t) {
			this.wrap = t, this.userArr = [], this.format = "", this.bindEvent()
		},
		"bindEvent": function () {
			var t = this;
			this.wrap.find("li").each(function (e, i) {
				var n = $(i),
					o = n.find(".userName a").attr("href"),
					r = $.ppUtils.getQueryString(o, "username");
				a && (r = r.split("&")[0]), r = decodeURIComponent(r), n.attr("username", r), t.userArr.push(r), t.format = t.userArr.join(",")
			}), s.getFans(l.getState, {
				"usernames": t.format
			}, function (e) {
				var n = e.result;
				for (i in n) {
					var o = t.wrap.find('li[username="' + i + '"]'),
						a = o.find(".dy-num code"),
						s = o.find(".hipster-btn a");
					a.html($.ppUtils.numAddUnit(n[i].count)), r.isLogined && (0 == n[i].isFollow ? (s.removeClass("followed"), s.html("<i></i>关注")) : (s.addClass("followed"), s.html("<i></i>已关注")))
				}
			}), r.isLogined ? this.wrap.on("click", ".follow", function () {
				var t = $(this),
					e = t.parents("li").attr("username"),
					i = t.parents("li").find("code").html(),
					n = Number(i);
				t.hasClass("followed") ? s.followHandle(l.setStateFalse, {
					"username": e
				}, function () {
					t.removeClass("followed"), t.html("<i></i>关注"), n < 9999 && i.indexOf(".") < 0 && (n -= 1, t.parents("li").find("code").html(n))
				}) : s.followHandle(l.setStateTrue, {
					"username": e
				}, function () {
					t.addClass("followed"), t.html("<i></i>已关注"), n < 9999 && i.indexOf(".") < 0 && (n += 1, t.parents("li").find("code").html(n))
				})
			}).on("mouseenter", ".follow", function () {
				var t = $(this);
				t.hasClass("followed") && (t.addClass("unfollow"), t.html("取消关注"))
			}).on("mouseleave", ".follow", function () {
				var t = $(this);
				t.hasClass("followed") && (t.removeClass("unfollow"), t.html("<i></i>已关注"))
			}) : this.wrap.on("click", ".follow", function () {
				login.init()
			})
		}
	}, t.exports = new o
}, function (t, e, i) {
	function n() {
		$(".longword").map(function () {
			$(this).find("li").length > 1 && $(this).slide(r)
		})
	}

	function o() {
		n()
	}
	i(3);
	var r = {
		"mainCell": "ul",
		"autoPlay": !0,
		"effect": "topLoop",
		"interTime": "10000"
	};
	t.exports = {
		"init": o
	}
}, function (t, e, i) {
	function n() {
		this.isInit = !1, this.currentType = null
	}
	var o = i(5).inViewport;
	n.prototype.init = function (t, e, i) {
		var n = this;
		this.root = t, this.currentType = e;
		var r = function () {
				!n.isInit && o($(t)[0]) && (i.getData(e, function (t) {
					n.render(t)
				}), n.isInit = !0, "function" == typeof a && $(window).unbind("scroll", a))
			},
			a = _.debounce(r, 250);
		r(), n.isInit || $(window).scroll(a);
		var s = $(this.root).find(".tab-switch li");
		s.map(function (t, e) {
			$(e).hover(function () {
				n.currentType !== $(e).attr("type") && i.getData($(e).attr("type"), function (t) {
					s.removeClass("now"), $(e).addClass("now"), n.currentType = $(e).attr("type"), n.render(t)
				})
			})
		})
	}, n.prototype.render = function (t) {
		var e = $(this.root).find(".module-pic250x155").eq(0);
		e.find("a").eq(0).attr("href", t[0].href), e.find("img").eq(0).attr("src", t[0].preview), e.find(".mask").eq(0).text(t[0].name), e.find("dd p").eq(0).text(t[0].status), e.find("dd .viewers").eq(0).text(t[0].viewers), e.find("dd span").eq(1).text(t[0].tag), $(this.root).find(".unit-pic-layout.module-pic180x100.ul5 li").map(function (e, i) {
			t[e + 1] && ($(i).find("a").eq(0).attr("href", t[e + 1].href), $(i).find("a").eq(0).attr("title", t[e + 1].status), $(i).find("img").eq(0).attr("src", t[e + 1].preview), $(i).find(".status").eq(0).text(t[e + 1].name), $(i).find("dl dt").eq(0).text(t[e + 1].status), $(i).find("dd .viewers").eq(0).text(t[e + 1].viewers), $(i).find("dd .lztit").eq(0).text(t[e + 1].tag))
		})
	}, t.exports = {
		"longzhu": n
	}
}, function (t, e) {
	function i() {
		this.withSlider = $(".with-slider:first")[0], this.withOutSlider = $(".without-slider:first")[0], this.withOutSliderRows = $(this.withOutSlider).find("ul")
	}
	i.prototype.refresh = function (t) {
		if (t.showSlider) $(this.withOutSlider).hide(), $(this.withSlider).fadeIn();
		else {
			var e = 0;
			$(this.withOutSliderRows).each(function () {
				$(this).find("li").each(function () {})
			}), $(this.withSlider).hide(), $(this.withOutSlider).fadeIn()
		}
	}, t.exports = {
		"redian": i
	}
}, function (t, e, i) {
	function n() {}
	var o = i(0),
		r = $.ppUtils.isClient();
	n.prototype.init = function () {
		if (r) {
			var t = clientCommon.getIsPrivilegeNoAD();
			try {
				clientCommon.ex.initLinks()
			} catch (e) {}
			t && ($(".module .vas_games").parents("div.grid").hide(), $("#module-vasgame, .grid-noad").hide())
		} else {
			var e = o.info.isVip;
			Number(e) >= 1 && ($(".popularize, .grid-noad").hide(), $("#module-vasgame").hide())
		}
	}, t.exports = new n
}, , , function (t, e) {
	function i() {
		i.baseApi = {
			"url": "http://api.plu.cn/pptv/streams",
			"dataType": "jsonp",
			"jsonp": "callback"
		}, i.nvshengApi = $.extend({
			"data": {
				"tag": "美女星主播"
			},
			"jsonpCallback": "longzhunvsheng"
		}, i.baseApi), i.suipaiApi = $.extend({
			"data": {
				"game": "119"
			},
			"jsonpCallback": "longzhusuipai"
		}, i.baseApi), i.youxiApi = $.extend({
			"data": {
				"game": "149"
			},
			"jsonpCallback": "longzhuyouxi"
		}, i.baseApi), i.shouyouApi = $.extend({
			"data": {
				"game": "88"
			},
			"jsonpCallback": "longzhushouyou"
		}, i.baseApi)
	}
	i.prototype.getData = function (t, e) {
		var o = this;
		void 0 === this[t] && (this[t] = {}), void 0 === this[t].isInit ? (this[t].isInit = !0, $.ajax(i[t + "Api"]).then(function (i) {
			o[t].data = n(i), e(o[t].data)
		}, function (t) {
			console.log("获取龙珠数据失败", t)
		})) : void 0 !== this[t].data && e(this[t].data)
	};
	var n = function (t) {
			return $.map(t.data.items, function (t) {
				return {
					"preview": t.preview,
					"name": t.channel.name,
					"status": t.channel.status,
					"tag": t.game[0].name,
					"viewers": o(t.viewers),
					"href": t.channel.url
				}
			})
		},
		o = function (t) {
			if (parseInt(t) < 1e4) return t;
			var e = String(parseInt(t) / 1e4),
				i = /(^\d+\.([0-9]{1}[1-9]{1}|[1-9]{1})|^\d+$)/,
				n = /\d+(?=\.00\d)/,
				o = i.exec(e);
			return null !== o ? o[0] + "万" : (o = n.exec(e), null !== o ? o[0] + "万" : e)
		};
	t.exports = {
		"longzhuModel": i
	}
}, function (t, e) {
	function i() {
		this.showSlider = !0, this.recommeds = null, this.recommendTabIndex = 0, this.recommendTabTotle = 3
	}
	i.prototype.refresh = function (t) {
		var e = this;
		null === e.recommeds ? $.ajax({
			"url": "http://recommend.pptv.com/recommend",
			"data": {
				"from": "web",
				"version": $.ppVersion,
				"format": "jsonp",
				"appplt": "ik",
				"appid": "ik",
				"src": "212",
				"appver": "1",
				"num": "50",
				"extraFields": "all",
				"ppi": "312c32",
				"uid": Cookies.get("PUID")
			},
			"dataType": "jsonp",
			"jsonp": "callback"
		}).then(function (i) {
			e.recommeds = $.map(i.items, function (t) {
				return {
					"title": t.title,
					"videoPic": "http://v.img.pplive.cn/sp160/" + t.extraData.videoPic,
					"url": "http://v.pptv.com/show/" + t.extraData.playLink + ".html?rcc_src=www_index"
				}
			}), t(e.getRecommeds())
		}) : t(e.getRecommeds())
	}, i.prototype.getRecommeds = function () {
		return this.showSlider = !this.showSlider, this.showSlider || this.recommendTabIndex++, {
			"showSlider": this.showSlider,
			"recommeds": this.recommeds.slice(this.recommendTabIndex % 3 * 14, this.recommendTabIndex % 3 * 14 + 14)
		}
	}, t.exports = {
		"redianModel": i
	}
}, , function (t, e, i) {
	var n = i(4).HOME_VERSION;
	console.log(n);
	i(26);
	i(24).getInstance().init()
}]);