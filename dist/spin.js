!function(root, factory) {
    "object" == typeof exports ? module.exports = factory() : "function" == typeof define && define.amd ? define(factory) : root.Spinner = factory();
}(this, function() {
    "use strict";
    function createEl(tag, prop) {
        var n, el = document.createElement(tag || "div");
        for (n in prop) el[n] = prop[n];
        return el;
    }
    function ins(parent) {
        for (var i = 1, n = arguments.length; n > i; i++) parent.appendChild(arguments[i]);
        return parent;
    }
    function addAnimation(alpha, trail, i, lines) {
        var name = [ "opacity", trail, ~~(100 * alpha), i, lines ].join("-"), start = .01 + i / lines * 100, z = Math.max(1 - (1 - alpha) / trail * (100 - start), alpha), prefix = useCssAnimations.substring(0, useCssAnimations.indexOf("Animation")).toLowerCase(), pre = prefix && "-" + prefix + "-" || "";
        return animations[name] || (sheet.insertRule("@" + pre + "keyframes " + name + "{0%{opacity:" + z + "}" + start + "%{opacity:" + alpha + "}" + (start + .01) + "%{opacity:1}" + (start + trail) % 100 + "%{opacity:" + alpha + "}100%{opacity:" + z + "}}", sheet.cssRules.length), 
        animations[name] = 1), name;
    }
    function vendor(el, prop) {
        var pp, i, s = el.style;
        if (void 0 !== s[prop]) return prop;
        for (prop = prop.charAt(0).toUpperCase() + prop.slice(1), i = 0; i < prefixes.length; i++) if (pp = prefixes[i] + prop, 
        void 0 !== s[pp]) return pp;
    }
    function css(el, prop) {
        for (var n in prop) el.style[vendor(el, n) || n] = prop[n];
        return el;
    }
    function merge(obj) {
        for (var i = 1; i < arguments.length; i++) {
            var def = arguments[i];
            for (var n in def) void 0 === obj[n] && (obj[n] = def[n]);
        }
        return obj;
    }
    function pos(el) {
        for (var o = {
            x: el.offsetLeft,
            y: el.offsetTop
        }; el = el.offsetParent; ) o.x += el.offsetLeft, o.y += el.offsetTop;
        return o;
    }
    function Spinner(o) {
        return "undefined" == typeof this ? new Spinner(o) : void (this.opts = merge(o || {}, Spinner.defaults, defaults));
    }
    function initVML() {
        function vml(tag, attr) {
            return createEl("<" + tag + ' xmlns="urn:schemas-microsoft.com:vml" class="spin-vml">', attr);
        }
        sheet.addRule(".spin-vml", "behavior:url(#default#VML)"), Spinner.prototype.lines = function(el, o) {
            function grp() {
                return css(vml("group", {
                    coordsize: s + " " + s,
                    coordorigin: -r + " " + -r
                }), {
                    width: s,
                    height: s
                });
            }
            function seg(i, dx, filter) {
                ins(g, ins(css(grp(), {
                    rotation: 360 / o.lines * i + "deg",
                    left: ~~dx
                }), ins(css(vml("roundrect", {
                    arcsize: o.corners
                }), {
                    width: r,
                    height: o.width,
                    left: o.radius,
                    top: -o.width >> 1,
                    filter: filter
                }), vml("fill", {
                    color: o.color,
                    opacity: o.opacity
                }), vml("stroke", {
                    opacity: 0
                }))));
            }
            var i, r = o.length + o.width, s = 2 * r, margin = 2 * -(o.width + o.length) + "px", g = css(grp(), {
                position: "absolute",
                top: margin,
                left: margin
            });
            if (o.shadow) for (i = 1; i <= o.lines; i++) seg(i, -2, "progid:DXImageTransform.Microsoft.Blur(pixelradius=2,makeshadow=1,shadowopacity=.3)");
            for (i = 1; i <= o.lines; i++) seg(i);
            return ins(el, g);
        }, Spinner.prototype.opacity = function(el, i, val, o) {
            var c = el.firstChild;
            o = o.shadow && o.lines || 0, c && i + o < c.childNodes.length && (c = c.childNodes[i + o], 
            c = c && c.firstChild, c = c && c.firstChild, c && (c.opacity = val));
        };
    }
    var useCssAnimations, prefixes = [ "webkit", "Moz", "ms", "O" ], animations = {}, sheet = function() {
        var el = createEl("style", {
            type: "text/css"
        });
        return ins(document.getElementsByTagName("head")[0], el), el.sheet || el.styleSheet;
    }(), defaults = {
        lines: 12,
        length: 7,
        width: 5,
        radius: 10,
        rotate: 0,
        corners: 1,
        color: "#000",
        direction: 1,
        speed: 1,
        trail: 100,
        opacity: .25,
        fps: 20,
        zIndex: 2e9,
        className: "spinner",
        top: "auto",
        left: "auto",
        position: "relative"
    };
    Spinner.defaults = {}, merge(Spinner.prototype, {
        spin: function(target) {
            this.stop();
            var ep, tp, self = this, o = self.opts, el = self.el = css(createEl(0, {
                className: o.className
            }), {
                position: o.position,
                width: 0,
                zIndex: o.zIndex
            }), mid = o.radius + o.length + o.width;
            if (target && (target.insertBefore(el, target.firstChild || null), tp = pos(target), 
            ep = pos(el), css(el, {
                left: ("auto" == o.left ? tp.x - ep.x + (target.offsetWidth >> 1) : parseInt(o.left, 10) + mid) + "px",
                top: ("auto" == o.top ? tp.y - ep.y + (target.offsetHeight >> 1) : parseInt(o.top, 10) + mid) + "px"
            })), el.setAttribute("role", "progressbar"), self.lines(el, self.opts), !useCssAnimations) {
                var alpha, i = 0, start = (o.lines - 1) * (1 - o.direction) / 2, fps = o.fps, f = fps / o.speed, ostep = (1 - o.opacity) / (f * o.trail / 100), astep = f / o.lines;
                !function anim() {
                    i++;
                    for (var j = 0; j < o.lines; j++) alpha = Math.max(1 - (i + (o.lines - j) * astep) % f * ostep, o.opacity), 
                    self.opacity(el, j * o.direction + start, alpha, o);
                    self.timeout = self.el && setTimeout(anim, ~~(1e3 / fps));
                }();
            }
            return self;
        },
        stop: function() {
            var el = this.el;
            return el && (clearTimeout(this.timeout), el.parentNode && el.parentNode.removeChild(el), 
            this.el = void 0), this;
        },
        lines: function(el, o) {
            function fill(color, shadow) {
                return css(createEl(), {
                    position: "absolute",
                    width: o.length + o.width + "px",
                    height: o.width + "px",
                    background: color,
                    boxShadow: shadow,
                    transformOrigin: "left",
                    transform: "rotate(" + ~~(360 / o.lines * i + o.rotate) + "deg) translate(" + o.radius + "px,0)",
                    borderRadius: (o.corners * o.width >> 1) + "px"
                });
            }
            for (var seg, i = 0, start = (o.lines - 1) * (1 - o.direction) / 2; i < o.lines; i++) seg = css(createEl(), {
                position: "absolute",
                top: 1 + ~(o.width / 2) + "px",
                transform: o.hwaccel ? "translate3d(0,0,0)" : "",
                opacity: o.opacity,
                animation: useCssAnimations && addAnimation(o.opacity, o.trail, start + i * o.direction, o.lines) + " " + 1 / o.speed + "s linear infinite"
            }), o.shadow && ins(seg, css(fill("#000", "0 0 4px #000"), {
                top: "2px"
            })), ins(el, ins(seg, fill(o.color, "0 0 1px rgba(0,0,0,.1)")));
            return el;
        },
        opacity: function(el, i, val) {
            i < el.childNodes.length && (el.childNodes[i].style.opacity = val);
        }
    });
    var probe = css(createEl("group"), {
        behavior: "url(#default#VML)"
    });
    return !vendor(probe, "transform") && probe.adj ? initVML() : useCssAnimations = vendor(probe, "animation"), 
    Spinner;
});