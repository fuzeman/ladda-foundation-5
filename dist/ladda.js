!function(root, factory) {
    "object" == typeof exports ? module.exports = factory() : "function" == typeof define && define.amd ? define([ "spin" ], factory) : root.Ladda = factory(root.Spinner);
}(this, function(Spinner) {
    "use strict";
    function create(button) {
        if ("undefined" == typeof button) return void console.warn("Ladda button target must be defined.");
        button.querySelector(".ladda-label") || (button.innerHTML = '<span class="ladda-label">' + button.innerHTML + "</span>");
        var spinner = createSpinner(button), spinnerWrapper = document.createElement("span");
        spinnerWrapper.className = "ladda-spinner", button.appendChild(spinnerWrapper);
        var timer, instance = {
            start: function() {
                return button.setAttribute("disabled", ""), button.setAttribute("data-loading", ""), 
                clearTimeout(timer), spinner.spin(spinnerWrapper), this.setProgress(0), this;
            },
            startAfter: function(delay) {
                return clearTimeout(timer), timer = setTimeout(function() {
                    instance.start();
                }, delay), this;
            },
            stop: function() {
                return button.removeAttribute("disabled"), button.removeAttribute("data-loading"), 
                clearTimeout(timer), timer = setTimeout(function() {
                    spinner.stop();
                }, 1e3), this;
            },
            toggle: function() {
                return this.isLoading() ? this.stop() : this.start(), this;
            },
            setProgress: function(progress) {
                progress = Math.max(Math.min(progress, 1), 0);
                var progressElement = button.querySelector(".ladda-progress");
                0 === progress && progressElement && progressElement.parentNode ? progressElement.parentNode.removeChild(progressElement) : (progressElement || (progressElement = document.createElement("div"), 
                progressElement.className = "ladda-progress", button.appendChild(progressElement)), 
                progressElement.style.width = (progress || 0) * button.offsetWidth + "px");
            },
            enable: function() {
                return this.stop(), this;
            },
            disable: function() {
                return this.stop(), button.setAttribute("disabled", ""), this;
            },
            isLoading: function() {
                return button.hasAttribute("data-loading");
            }
        };
        return ALL_INSTANCES.push(instance), instance;
    }
    function bind(target, options) {
        options = options || {};
        var targets = [];
        "string" == typeof target ? targets = toArray(document.querySelectorAll(target)) : "object" == typeof target && "string" == typeof target.nodeName && (targets = [ target ]);
        for (var i = 0, len = targets.length; len > i; i++) !function() {
            var element = targets[i];
            if ("function" == typeof element.addEventListener) {
                var instance = create(element), timeout = -1;
                element.addEventListener("click", function() {
                    instance.startAfter(1), "number" == typeof options.timeout && (clearTimeout(timeout), 
                    timeout = setTimeout(instance.stop, options.timeout)), "function" == typeof options.callback && options.callback.apply(null, [ instance ]);
                }, !1);
            }
        }();
    }
    function stopAll() {
        for (var i = 0, len = ALL_INSTANCES.length; len > i; i++) ALL_INSTANCES[i].stop();
    }
    function createSpinner(button) {
        var spinnerColor, height = button.offsetHeight, spinnerTop = "auto", spinnerLeft = "auto";
        height > 32 && (height *= .8), button.hasAttribute("data-spinner-size") && (height = parseInt(button.getAttribute("data-spinner-size"), 10)), 
        button.hasAttribute("data-spinner-color") && (spinnerColor = button.getAttribute("data-spinner-color")), 
        button.hasAttribute("data-spinner-top") && (spinnerTop = button.getAttribute("data-spinner-top")), 
        button.hasAttribute("data-spinner-left") && (spinnerLeft = button.getAttribute("data-spinner-left"));
        var lines = 12, radius = .2 * height, length = .6 * radius, width = 7 > radius ? 2 : 3;
        return new Spinner({
            color: spinnerColor || "#fff",
            lines: lines,
            radius: radius,
            length: length,
            width: width,
            zIndex: "auto",
            top: spinnerTop,
            left: spinnerLeft,
            className: ""
        });
    }
    function toArray(nodes) {
        for (var a = [], i = 0; i < nodes.length; i++) a.push(nodes[i]);
        return a;
    }
    var ALL_INSTANCES = [];
    return {
        bind: bind,
        create: create,
        stopAll: stopAll
    };
});