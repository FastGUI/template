(function(t, e, n) {
    "use strict";
    function r(t) {
        return t && t.__esModule ? t: {
        default:
            t
        }
    }
    Object.defineProperty(e, "__esModule", {
        value: !0
    });
    var i = n(473),
    a = r(i),
    o = n(128),
    s = r(o),
    l = n(640),
    u = r(l);
    e.
default = {
        name: "wiper",
        props: ["module", "date", "options"],
        computed: {
            moduleData: function() {
                var t = (new Date).getTime();
                this.date && (t = this.date.getTime());
                var e = [],
                n = !0,
                r = !1,
                i = void 0;
                try {
                    for (var o, s = (0, a.
                default)(this.module.data.dlist); ! (n = (o = s.next()).done); n = !0) {
                        var l = o.value;
                        void 0 != l.preonline && "" != l.preonline && 1e3 * l.preonline > t || void 0 != l.offline && "" != l.offline && 1e3 * l.offline <= t ? console.log("ä¸Šçº¿æ—¶é—´: " + 1e3 * l.preonline + " --- å½“å‰æ—¶é—´: " + t + " --- ä¸‹çº¿æ—¶é—´ï¼š" + 1e3 * l.offline + " å½“å‰titleï¼š " + l.title) : e.push(l)
                    }
                } catch(t) {
                    r = !0,
                    i = t
                } finally {
                    try { ! n && s.
                        return && s.
                        return ()
                    } finally {
                        if (r) throw i
                    }
                }
                return e
            }
        },
        methods: {
            tjIdTitle: function(t) {
                return (void 0 != t.modelTitle ? t.modelTitle: "1") + "-" + (void 0 != t.location ? t.location: "1") + "-" + (void 0 != t.modelIndex ? t.modelIndex: "1") + "-1-" + (void 0 != t.itemIndex ? t.itemIndex: "1")
            }
        },
        mounted: function() {
            var t = this; (0, s.
        default)("#photoslide img").forEach(function(e) {
                if (void 0 != t.module.scale) {
                    var n = (0, s.
                default)(e).width(); (0, s.
                default)(e).css({
                        height:
                        n * t.module.scale / parseFloat(t.options.fontSize) + "rem"
                    })
                }
            }),
            (0, s.
        default)("#photoslide img").length > 1 && (0, u.
        default)({
                container:
                ".swiper-container",
                wrapperSelector: ".swiper-wrapper",
                slideSelector: "li",
                pagination: ".swiper-pagination",
                bulletClass: "pagebullet",
                bulletActiveClass: "pagebulletnow"
            })
        }
    }
});


(function($) {
  'use strict';

  $(function() {
    var $fullText = $('.admin-fullText');
    $('#admin-fullscreen').on('click', function() {
      $.AMUI.fullscreen.toggle();
    });

    $(document).on($.AMUI.fullscreen.raw.fullscreenchange, function() {
      $fullText.text($.AMUI.fullscreen.isFullscreen ? '退出全屏' : '开启全屏');
    });
  });
})(jQuery);
