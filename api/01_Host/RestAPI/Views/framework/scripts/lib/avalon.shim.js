/*==================================================
 Copyright (c) 2013-2015 鍙稿緬姝ｇ編 and other contributors
 http://www.cnblogs.com/rubylouvre/
 https://github.com/RubyLouvre
 http://weibo.com/jslouvre/
 
 Released under the MIT license
 avalon.shim.js 1.5.5 built in 2015.11.9
 support IE6+ and other browsers
 ==================================================*/
(function (global, factory) {

    if (typeof module === "object" && typeof module.exports === "object") {
        // For CommonJS and CommonJS-like environments where a proper `window`
        // is present, execute the factory and get avalon.
        // For environments that do not have a `window` with a `document`
        // (such as Node.js), expose a factory as module.exports.
        // This accentuates the need for the creation of a real `window`.
        // e.g. var avalon = require("avalon")(window);
        module.exports = global.document ? factory(global, true) : function (w) {
            if (!w.document) {
                throw new Error("Avalon requires a window with a document")
            }
            return factory(w)
        }
    } else {
        factory(global)
    }

    // Pass this if window is not defined yet
}(typeof window !== "undefined" ? window : this, function (window, noGlobal) {

    /*********************************************************************
     *                    鍏ㄥ眬鍙橀噺鍙婃柟娉�                                  *
     **********************************************************************/
    var expose = new Date() - 0
    //http://stackoverflow.com/questions/7290086/javascript-use-strict-and-nicks-find-global-function
    var DOC = window.document
    var head = DOC.getElementsByTagName("head")[0] //HEAD鍏冪礌
    var ifGroup = head.insertBefore(document.createElement("avalon"), head.firstChild) //閬垮厤IE6 base鏍囩BUG
    ifGroup.innerHTML = "X<style id='avalonStyle'>.avalonHide{ display: none!important }</style>"
    ifGroup.setAttribute("ms-skip", "1")
    ifGroup.className = "avalonHide"
    var rnative = /\[native code\]/ //鍒ゅ畾鏄惁鍘熺敓鍑芥暟
    function log() {
        if (window.console && avalon.config.debug) {
            // http://stackoverflow.com/questions/8785624/how-to-safely-wrap-console-log
            Function.apply.call(console.log, console, arguments)
        }
    }


    var subscribers = "$" + expose

    var stopRepeatAssign = false
    var nullObject = {} //浣滅敤绫讳技浜巒oop锛屽彧鐢ㄤ簬浠ｇ爜闃插尽锛屽崈涓囦笉瑕佸湪瀹冧笂闈㈡坊鍔犲睘鎬�
    var rword = /[^, ]+/g //鍒囧壊瀛楃涓蹭负涓€涓釜灏忓潡锛屼互绌烘牸鎴栬眴鍙峰垎寮€瀹冧滑锛岀粨鍚坮eplace瀹炵幇瀛楃涓茬殑forEach
    var rw20g = /\w+/g
    var rcomplexType = /^(?:object|array)$/
    var rsvg = /^\[object SVG\w*Element\]$/
    var rwindow = /^\[object (?:Window|DOMWindow|global)\]$/
    var oproto = Object.prototype
    var ohasOwn = oproto.hasOwnProperty
    var serialize = oproto.toString
    var ap = Array.prototype
    var aslice = ap.slice
    var W3C = window.dispatchEvent
    var root = DOC.documentElement
    var avalonFragment = DOC.createDocumentFragment()
    var cinerator = DOC.createElement("div")
    var class2type = {}
    "Boolean Number String Function Array Date RegExp Object Error".replace(rword, function (name) {
        class2type["[object " + name + "]"] = name.toLowerCase()
    })
    function scpCompile(array) {
        return Function.apply(noop, array)
    }
    function noop() { }

    function oneObject(array, val) {
        if (typeof array === "string") {
            array = array.match(rword) || []
        }
        var result = {},
                value = val !== void 0 ? val : 1
        for (var i = 0, n = array.length; i < n; i++) {
            result[array[i]] = value
        }
        return result
    }

    //鐢熸垚UUID http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript
    var generateID = function (prefix) {
        prefix = prefix || "avalon"
        return String(Math.random() + Math.random()).replace(/\d\.\d{4}/, prefix)
    }
    function IE() {
        if (window.VBArray) {
            var mode = document.documentMode
            return mode ? mode : window.XMLHttpRequest ? 7 : 6
        } else {
            return NaN
        }
    }
    var IEVersion = IE()

    avalon = function (el) { //鍒涘缓jQuery寮忕殑鏃爊ew 瀹炰緥鍖栫粨鏋�
        return new avalon.init(el)
    }


    /*瑙嗘祻瑙堝櫒鎯呭喌閲囩敤鏈€蹇殑寮傛鍥炶皟*/
    avalon.nextTick = new function () {// jshint ignore:line
        var tickImmediate = window.setImmediate
        var tickObserver = window.MutationObserver
        if (tickImmediate) {
            return tickImmediate.bind(window)
        }

        var queue = []
        function callback() {
            var n = queue.length
            for (var i = 0; i < n; i++) {
                queue[i]()
            }
            queue = queue.slice(n)
        }

        if (tickObserver) {
            var node = document.createTextNode("avalon")
            new tickObserver(callback).observe(node, { characterData: true })// jshint ignore:line
            var bool = false
            return function (fn) {
                queue.push(fn)
                bool = !bool
                node.data = bool
            }
        }


        return function (fn) {
            setTimeout(fn, 4)
        }
    }// jshint ignore:line
    /*********************************************************************
     *                 avalon鐨勯潤鎬佹柟娉曞畾涔夊尯                              *
     **********************************************************************/
    avalon.init = function (el) {
        this[0] = this.element = el
    }
    avalon.fn = avalon.prototype = avalon.init.prototype

    avalon.type = function (obj) { //鍙栧緱鐩爣鐨勭被鍨�
        if (obj == null) {
            return String(obj)
        }
        // 鏃╂湡鐨剋ebkit鍐呮牳娴忚鍣ㄥ疄鐜颁簡宸插簾寮冪殑ecma262v4鏍囧噯锛屽彲浠ュ皢姝ｅ垯瀛楅潰閲忓綋浣滃嚱鏁颁娇鐢紝鍥犳typeof鍦ㄥ垽瀹氭鍒欐椂浼氳繑鍥瀎unction
        return typeof obj === "object" || typeof obj === "function" ?
                class2type[serialize.call(obj)] || "object" :
                typeof obj
    }

    var isFunction = typeof alert === "object" ? function (fn) {
        try {
            return /^\s*\bfunction\b/.test(fn + "")
        } catch (e) {
            return false
        }
    } : function (fn) {
        return serialize.call(fn) === "[object Function]"
    }
    avalon.isFunction = isFunction

    avalon.isWindow = function (obj) {
        if (!obj)
            return false
        // 鍒╃敤IE678 window == document涓簍rue,document == window绔熺劧涓篺alse鐨勭濂囩壒鎬�
        // 鏍囧噯娴忚鍣ㄥ強IE9锛孖E10绛変娇鐢� 姝ｅ垯妫€娴�
        return obj == obj.document && obj.document != obj //jshint ignore:line
    }

    function isWindow(obj) {
        return rwindow.test(serialize.call(obj))
    }
    if (isWindow(window)) {
        avalon.isWindow = isWindow
    }
    var enu
    for (enu in avalon({})) {
        break
    }
    var enumerateBUG = enu !== "0" //IE6涓嬩负true, 鍏朵粬涓篺alse
    /*鍒ゅ畾鏄惁鏄竴涓湸绱犵殑javascript瀵硅薄锛圤bject锛夛紝涓嶆槸DOM瀵硅薄锛屼笉鏄疊OM瀵硅薄锛屼笉鏄嚜瀹氫箟绫荤殑瀹炰緥*/
    avalon.isPlainObject = function (obj, key) {
        if (!obj || avalon.type(obj) !== "object" || obj.nodeType || avalon.isWindow(obj)) {
            return false;
        }
        try { //IE鍐呯疆瀵硅薄娌℃湁constructor
            if (obj.constructor && !ohasOwn.call(obj, "constructor") && !ohasOwn.call(obj.constructor.prototype, "isPrototypeOf")) {
                return false;
            }
        } catch (e) { //IE8 9浼氬湪杩欓噷鎶涢敊
            return false;
        }
        if (enumerateBUG) {
            for (key in obj) {
                return ohasOwn.call(obj, key)
            }
        }
        for (key in obj) {
        }
        return key === void 0 || ohasOwn.call(obj, key)
    }
    if (rnative.test(Object.getPrototypeOf)) {
        avalon.isPlainObject = function (obj) {
            // 绠€鍗曠殑 typeof obj === "object"妫€娴嬶紝浼氳嚧浣跨敤isPlainObject(window)鍦╫pera涓嬮€氫笉杩�
            return serialize.call(obj) === "[object Object]" && Object.getPrototypeOf(obj) === oproto
        }
    }
    //涓巎Query.extend鏂规硶锛屽彲鐢ㄤ簬娴呮嫹璐濓紝娣辨嫹璐�
    avalon.mix = avalon.fn.mix = function () {
        var options, name, src, copy, copyIsArray, clone,
                target = arguments[0] || {},
                i = 1,
                length = arguments.length,
                deep = false

        // 濡傛灉绗竴涓弬鏁颁负甯冨皵,鍒ゅ畾鏄惁娣辨嫹璐�
        if (typeof target === "boolean") {
            deep = target
            target = arguments[1] || {}
            i++
        }

        //纭繚鎺ュ彈鏂逛负涓€涓鏉傜殑鏁版嵁绫诲瀷
        if (typeof target !== "object" && !isFunction(target)) {
            target = {}
        }

        //濡傛灉鍙湁涓€涓弬鏁帮紝閭ｄ箞鏂版垚鍛樻坊鍔犱簬mix鎵€鍦ㄧ殑瀵硅薄涓�
        if (i === length) {
            target = this
            i--
        }

        for (; i < length; i++) {
            //鍙鐞嗛潪绌哄弬鏁�
            if ((options = arguments[i]) != null) {
                for (name in options) {
                    src = target[name]
                    try {
                        copy = options[name] //褰搊ptions涓篤BS瀵硅薄鏃舵姤閿�
                    } catch (e) {
                        continue
                    }

                    // 闃叉鐜紩鐢�
                    if (target === copy) {
                        continue
                    }
                    if (deep && copy && (avalon.isPlainObject(copy) || (copyIsArray = Array.isArray(copy)))) {

                        if (copyIsArray) {
                            copyIsArray = false
                            clone = src && Array.isArray(src) ? src : []

                        } else {
                            clone = src && avalon.isPlainObject(src) ? src : {}
                        }

                        target[name] = avalon.mix(deep, clone, copy)
                    } else if (copy !== void 0) {
                        target[name] = copy
                    }
                }
            }
        }
        return target
    }

    function _number(a, len) { //鐢ㄤ簬妯℃嫙slice, splice鐨勬晥鏋�
        a = Math.floor(a) || 0
        return a < 0 ? Math.max(len + a, 0) : Math.min(a, len);
    }
    avalon.mix({
        rword: rword,
        subscribers: subscribers,
        version: 1.55,
        ui: {},
        log: log,
        slice: W3C ? function (nodes, start, end) {
            return aslice.call(nodes, start, end)
        } : function (nodes, start, end) {
            var ret = []
            var len = nodes.length
            if (end === void 0)
                end = len
            if (typeof end === "number" && isFinite(end)) {
                start = _number(start, len)
                end = _number(end, len)
                for (var i = start; i < end; ++i) {
                    ret[i - start] = nodes[i]
                }
            }
            return ret
        },
        noop: noop,
        /*濡傛灉涓嶇敤Error瀵硅薄灏佽涓€涓嬶紝str鍦ㄦ帶鍒跺彴涓嬪彲鑳戒細涔辩爜*/
        error: function (str, e) {
            throw (e || Error)(str)
        },
        /*灏嗕竴涓互绌烘牸鎴栭€楀彿闅斿紑鐨勫瓧绗︿覆鎴栨暟缁�,杞崲鎴愪竴涓敭鍊奸兘涓�1鐨勫璞�*/
        oneObject: oneObject,
        /* avalon.range(10)
         => [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
         avalon.range(1, 11)
         => [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
         avalon.range(0, 30, 5)
         => [0, 5, 10, 15, 20, 25]
         avalon.range(0, -10, -1)
         => [0, -1, -2, -3, -4, -5, -6, -7, -8, -9]
         avalon.range(0)
         => []*/
        range: function (start, end, step) { // 鐢ㄤ簬鐢熸垚鏁存暟鏁扮粍
            step || (step = 1)
            if (end == null) {
                end = start || 0
                start = 0
            }
            var index = -1,
                    length = Math.max(0, Math.ceil((end - start) / step)),
                    result = new Array(length)
            while (++index < length) {
                result[index] = start
                start += step
            }
            return result
        },
        eventHooks: {},
        /*缁戝畾浜嬩欢*/
        bind: function (el, type, fn, phase) {
            var hooks = avalon.eventHooks
            var hook = hooks[type]
            if (typeof hook === "object") {
                type = hook.type || type
                phase = hook.phase || !!phase
                fn = hook.fn ? hook.fn(el, fn) : fn
            }
            var callback = W3C ? fn : function (e) {
                fn.call(el, fixEvent(e));
            }
            if (W3C) {
                el.addEventListener(type, callback, phase)
            } else {
                el.attachEvent("on" + type, callback)
            }
            return callback
        },
        /*鍗歌浇浜嬩欢*/
        unbind: function (el, type, fn, phase) {
            var hooks = avalon.eventHooks
            var hook = hooks[type]
            var callback = fn || noop
            if (typeof hook === "object") {
                type = hook.type || type
                phase = hook.phase || !!phase
            }
            if (W3C) {
                el.removeEventListener(type, callback, phase)
            } else {
                el.detachEvent("on" + type, callback)
            }
        },
        /*璇诲啓鍒犻櫎鍏冪礌鑺傜偣鐨勬牱寮�*/
        css: function (node, name, value) {
            if (node instanceof avalon) {
                node = node[0]
            }
            var prop = /[_-]/.test(name) ? camelize(name) : name,
                    fn
            name = avalon.cssName(prop) || prop
            if (value === void 0 || typeof value === "boolean") { //鑾峰彇鏍峰紡
                fn = cssHooks[prop + ":get"] || cssHooks["@:get"]
                if (name === "background") {
                    name = "backgroundColor"
                }
                var val = fn(node, name)
                return value === true ? parseFloat(val) || 0 : val
            } else if (value === "") { //璇烽櫎鏍峰紡
                node.style[name] = ""
            } else { //璁剧疆鏍峰紡
                if (value == null || value !== value) {
                    return
                }
                if (isFinite(value) && !avalon.cssNumber[prop]) {
                    value += "px"
                }
                fn = cssHooks[prop + ":set"] || cssHooks["@:set"]
                fn(node, name, value)
            }
        },
        /*閬嶅巻鏁扮粍涓庡璞�,鍥炶皟鐨勭涓€涓弬鏁颁负绱㈠紩鎴栭敭鍚�,绗簩涓垨鍏冪礌鎴栭敭鍊�*/
        each: function (obj, fn) {
            if (obj) { //鎺掗櫎null, undefined
                var i = 0
                if (isArrayLike(obj)) {
                    for (var n = obj.length; i < n; i++) {
                        if (fn(i, obj[i]) === false)
                            break
                    }
                } else {
                    for (i in obj) {
                        if (obj.hasOwnProperty(i) && fn(i, obj[i]) === false) {
                            break
                        }
                    }
                }
            }
        },
        //鏀堕泦鍏冪礌鐨刣ata-{{prefix}}-*灞炴€э紝骞惰浆鎹负瀵硅薄
        getWidgetData: function (elem, prefix) {
            var raw = avalon(elem).data()
            var result = {}
            for (var i in raw) {
                if (i.indexOf(prefix) === 0) {
                    result[i.replace(prefix, "").replace(/\w/, function (a) {
                        return a.toLowerCase()
                    })] = raw[i]
                }
            }
            return result
        },
        Array: {
            /*鍙湁褰撳墠鏁扮粍涓嶅瓨鍦ㄦ鍏冪礌鏃跺彧娣诲姞瀹�*/
            ensure: function (target, item) {
                if (target.indexOf(item) === -1) {
                    return target.push(item)
                }
            },
            /*绉婚櫎鏁扮粍涓寚瀹氫綅缃殑鍏冪礌锛岃繑鍥炲竷灏旇〃绀烘垚鍔熶笌鍚�*/
            removeAt: function (target, index) {
                return !!target.splice(index, 1).length
            },
            /*绉婚櫎鏁扮粍涓涓€涓尮閰嶄紶鍙傜殑閭ｄ釜鍏冪礌锛岃繑鍥炲竷灏旇〃绀烘垚鍔熶笌鍚�*/
            remove: function (target, item) {
                var index = target.indexOf(item)
                if (~index)
                    return avalon.Array.removeAt(target, index)
                return false
            }
        }
    })

    var bindingHandlers = avalon.bindingHandlers = {}
    var bindingExecutors = avalon.bindingExecutors = {}

    var directives = avalon.directives = {}
    avalon.directive = function (name, obj) {
        bindingHandlers[name] = obj.init = (obj.init || noop)
        bindingExecutors[name] = obj.update = (obj.update || noop)

        return directives[name] = obj
    }
    /*鍒ゅ畾鏄惁绫绘暟缁勶紝濡傝妭鐐归泦鍚堬紝绾暟缁勶紝arguments涓庢嫢鏈夐潪璐熸暣鏁扮殑length灞炴€х殑绾疛S瀵硅薄*/
    function isArrayLike(obj) {
        if (!obj)
            return false
        var n = obj.length
        if (n === (n >>> 0)) { //妫€娴媗ength灞炴€ф槸鍚︿负闈炶礋鏁存暟
            var type = serialize.call(obj).slice(8, -1)
            if (/(?:regexp|string|function|window|global)$/i.test(type))
                return false
            if (type === "Array")
                return true
            try {
                if ({}.propertyIsEnumerable.call(obj, "length") === false) { //濡傛灉鏄師鐢熷璞�
                    return /^\s?function/.test(obj.item || obj.callee)
                }
                return true
            } catch (e) { //IE鐨凬odeList鐩存帴鎶涢敊
                return !obj.window //IE6-8 window
            }
        }
        return false
    }


    // https://github.com/rsms/js-lru
    var Cache = new function () {// jshint ignore:line
        function LRU(maxLength) {
            this.size = 0
            this.limit = maxLength
            this.head = this.tail = void 0
            this._keymap = {}
        }

        var p = LRU.prototype

        p.put = function (key, value) {
            var entry = {
                key: key,
                value: value
            }
            this._keymap[key] = entry
            if (this.tail) {
                this.tail.newer = entry
                entry.older = this.tail
            } else {
                this.head = entry
            }
            this.tail = entry
            if (this.size === this.limit) {
                this.shift()
            } else {
                this.size++
            }
            return value
        }

        p.shift = function () {
            var entry = this.head
            if (entry) {
                this.head = this.head.newer
                this.head.older =
                        entry.newer =
                        entry.older =
                        this._keymap[entry.key] = void 0
                delete this._keymap[entry.key] //#1029
            }
        }
        p.get = function (key) {
            var entry = this._keymap[key]
            if (entry === void 0)
                return
            if (entry === this.tail) {
                return entry.value
            }
            // HEAD--------------TAIL
            //   <.older   .newer>
            //  <--- add direction --
            //   A  B  C  <D>  E
            if (entry.newer) {
                if (entry === this.head) {
                    this.head = entry.newer
                }
                entry.newer.older = entry.older // C <-- E.
            }
            if (entry.older) {
                entry.older.newer = entry.newer // C. --> E
            }
            entry.newer = void 0 // D --x
            entry.older = this.tail // D. --> E
            if (this.tail) {
                this.tail.newer = entry // E. <-- D
            }
            this.tail = entry
            return entry.value
        }
        return LRU
    }// jshint ignore:line

    /*********************************************************************
     *                         javascript 搴曞眰琛ヤ竵                       *
     **********************************************************************/
    if (!"鍙稿緬姝ｇ編".trim) {
        var rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g
        String.prototype.trim = function () {
            return this.replace(rtrim, "")
        }
    }
    var hasDontEnumBug = !({
        'toString': null
    }).propertyIsEnumerable('toString'),
            hasProtoEnumBug = (function () {
            }).propertyIsEnumerable('prototype'),
            dontEnums = [
                "toString",
                "toLocaleString",
                "valueOf",
                "hasOwnProperty",
                "isPrototypeOf",
                "propertyIsEnumerable",
                "constructor"
            ],
            dontEnumsLength = dontEnums.length;
    if (!Object.keys) {
        Object.keys = function (object) { //ecma262v5 15.2.3.14
            var theKeys = []
            var skipProto = hasProtoEnumBug && typeof object === "function"
            if (typeof object === "string" || (object && object.callee)) {
                for (var i = 0; i < object.length; ++i) {
                    theKeys.push(String(i))
                }
            } else {
                for (var name in object) {
                    if (!(skipProto && name === "prototype") && ohasOwn.call(object, name)) {
                        theKeys.push(String(name))
                    }
                }
            }

            if (hasDontEnumBug) {
                var ctor = object.constructor,
                        skipConstructor = ctor && ctor.prototype === object
                for (var j = 0; j < dontEnumsLength; j++) {
                    var dontEnum = dontEnums[j]
                    if (!(skipConstructor && dontEnum === "constructor") && ohasOwn.call(object, dontEnum)) {
                        theKeys.push(dontEnum)
                    }
                }
            }
            return theKeys
        }
    }
    if (!Array.isArray) {
        Array.isArray = function (a) {
            return serialize.call(a) === "[object Array]"
        }
    }

    if (!noop.bind) {
        Function.prototype.bind = function (scope) {
            if (arguments.length < 2 && scope === void 0)
                return this
            var fn = this,
                    argv = arguments
            return function () {
                var args = [],
                        i
                for (i = 1; i < argv.length; i++)
                    args.push(argv[i])
                for (i = 0; i < arguments.length; i++)
                    args.push(arguments[i])
                return fn.apply(scope, args)
            }
        }
    }

    function iterator(vars, body, ret) {
        var fun = 'for(var ' + vars + 'i=0,n = this.length; i < n; i++){' + body.replace('_', '((i in this) && fn.call(scope,this[i],i,this))') + '}' + ret
        /* jshint ignore:start */
        return Function("fn,scope", fun)
        /* jshint ignore:end */
    }
    if (!rnative.test([].map)) {
        avalon.mix(ap, {
            //瀹氫綅鎿嶄綔锛岃繑鍥炴暟缁勪腑绗竴涓瓑浜庣粰瀹氬弬鏁扮殑鍏冪礌鐨勭储寮曞€笺€�
            indexOf: function (item, index) {
                var n = this.length,
                        i = ~~index
                if (i < 0)
                    i += n
                for (; i < n; i++)
                    if (this[i] === item)
                        return i
                return -1
            },
            //瀹氫綅鎿嶄綔锛屽悓涓婏紝涓嶈繃鏄粠鍚庨亶鍘嗐€�
            lastIndexOf: function (item, index) {
                var n = this.length,
                        i = index == null ? n - 1 : index
                if (i < 0)
                    i = Math.max(0, n + i)
                for (; i >= 0; i--)
                    if (this[i] === item)
                        return i
                return -1
            },
            //杩唬鎿嶄綔锛屽皢鏁扮粍鐨勫厓绱犳尐涓効浼犲叆涓€涓嚱鏁颁腑鎵ц銆侾rototype.js鐨勫搴斿悕瀛椾负each銆�
            forEach: iterator("", '_', ""),
            //杩唬绫� 鍦ㄦ暟缁勪腑鐨勬瘡涓」涓婅繍琛屼竴涓嚱鏁帮紝濡傛灉姝ゅ嚱鏁扮殑鍊间负鐪燂紝鍒欐鍏冪礌浣滀负鏂版暟缁勭殑鍏冪礌鏀堕泦璧锋潵锛屽苟杩斿洖鏂版暟缁�
            filter: iterator('r=[],j=0,', 'if(_)r[j++]=this[i]', 'return r'),
            //鏀堕泦鎿嶄綔锛屽皢鏁扮粍鐨勫厓绱犳尐涓効浼犲叆涓€涓嚱鏁颁腑鎵ц锛岀劧鍚庢妸瀹冧滑鐨勮繑鍥炲€肩粍鎴愪竴涓柊鏁扮粍杩斿洖銆侾rototype.js鐨勫搴斿悕瀛椾负collect銆�
            map: iterator('r=[],', 'r[i]=_', 'return r'),
            //鍙鏁扮粍涓湁涓€涓厓绱犳弧瓒虫潯浠讹紙鏀捐繘缁欏畾鍑芥暟杩斿洖true锛夛紝閭ｄ箞瀹冨氨杩斿洖true銆侾rototype.js鐨勫搴斿悕瀛椾负any銆�
            some: iterator("", 'if(_)return true', 'return false'),
            //鍙湁鏁扮粍涓殑鍏冪礌閮芥弧瓒虫潯浠讹紙鏀捐繘缁欏畾鍑芥暟杩斿洖true锛夛紝瀹冩墠杩斿洖true銆侾rototype.js鐨勫搴斿悕瀛椾负all銆�
            every: iterator("", 'if(!_)return false', 'return true')
        })
    }
    /*********************************************************************
     *                           DOM 搴曞眰琛ヤ竵                             *
     **********************************************************************/

    function fixContains(root, el) {
        try { //IE6-8,娓哥浜嶥OM鏍戝鐨勬枃鏈妭鐐癸紝璁块棶parentNode鏈夋椂浼氭姏閿�
            while ((el = el.parentNode))
                if (el === root)
                    return true
            return false
        } catch (e) {
            return false
        }
    }
    avalon.contains = fixContains
    //IE6-11鐨勬枃妗ｅ璞℃病鏈塩ontains
    if (!DOC.contains) {
        DOC.contains = function (b) {
            return fixContains(DOC, b)
        }
    }

    function outerHTML() {
        return new XMLSerializer().serializeToString(this)
    }

    if (window.SVGElement) {
        //safari5+鏄妸contains鏂规硶鏀惧湪Element.prototype涓婅€屼笉鏄疦ode.prototype
        if (!DOC.createTextNode("x").contains) {
            Node.prototype.contains = function (arg) {//IE6-8娌℃湁Node瀵硅薄
                return !!(this.compareDocumentPosition(arg) & 16)
            }
        }
        var svgns = "http://www.w3.org/2000/svg"
        var svg = DOC.createElementNS(svgns, "svg")
        svg.innerHTML = '<circle cx="50" cy="50" r="40" fill="red" />'
        if (!rsvg.test(svg.firstChild)) { // #409
            function enumerateNode(node, targetNode) {// jshint ignore:line
                if (node && node.childNodes) {
                    var nodes = node.childNodes
                    for (var i = 0, el; el = nodes[i++];) {
                        if (el.tagName) {
                            var svg = DOC.createElementNS(svgns,
                                    el.tagName.toLowerCase())
                            ap.forEach.call(el.attributes, function (attr) {
                                svg.setAttribute(attr.name, attr.value) //澶嶅埗灞炴€�
                            })// jshint ignore:line
                            // 閫掑綊澶勭悊瀛愯妭鐐�
                            enumerateNode(el, svg)
                            targetNode.appendChild(svg)
                        }
                    }
                }
            }
            Object.defineProperties(SVGElement.prototype, {
                "outerHTML": {//IE9-11,firefox涓嶆敮鎸丼VG鍏冪礌鐨刬nnerHTML,outerHTML灞炴€�
                    enumerable: true,
                    configurable: true,
                    get: outerHTML,
                    set: function (html) {
                        var tagName = this.tagName.toLowerCase(),
                                par = this.parentNode,
                                frag = avalon.parseHTML(html)
                        // 鎿嶄綔鐨剆vg锛岀洿鎺ユ彃鍏�
                        if (tagName === "svg") {
                            par.insertBefore(frag, this)
                            // svg鑺傜偣鐨勫瓙鑺傜偣绫讳技
                        } else {
                            var newFrag = DOC.createDocumentFragment()
                            enumerateNode(frag, newFrag)
                            par.insertBefore(newFrag, this)
                        }
                        par.removeChild(this)
                    }
                },
                "innerHTML": {
                    enumerable: true,
                    configurable: true,
                    get: function () {
                        var s = this.outerHTML
                        var ropen = new RegExp("<" + this.nodeName + '\\b(?:(["\'])[^"]*?(\\1)|[^>])*>', "i")
                        var rclose = new RegExp("<\/" + this.nodeName + ">$", "i")
                        return s.replace(ropen, "").replace(rclose, "")
                    },
                    set: function (html) {
                        if (avalon.clearHTML) {
                            avalon.clearHTML(this)
                            var frag = avalon.parseHTML(html)
                            enumerateNode(frag, this)
                        }
                    }
                }
            })
        }
    }
    if (!root.outerHTML && window.HTMLElement) { //firefox 鍒�11鏃舵墠鏈塷uterHTML
        HTMLElement.prototype.__defineGetter__("outerHTML", outerHTML);
    }


    //============================= event binding =======================
    var rmouseEvent = /^(?:mouse|contextmenu|drag)|click/
    function fixEvent(event) {
        var ret = {}
        for (var i in event) {
            ret[i] = event[i]
        }
        var target = ret.target = event.srcElement
        if (event.type.indexOf("key") === 0) {
            ret.which = event.charCode != null ? event.charCode : event.keyCode
        } else if (rmouseEvent.test(event.type)) {
            var doc = target.ownerDocument || DOC
            var box = doc.compatMode === "BackCompat" ? doc.body : doc.documentElement
            ret.pageX = event.clientX + (box.scrollLeft >> 0) - (box.clientLeft >> 0)
            ret.pageY = event.clientY + (box.scrollTop >> 0) - (box.clientTop >> 0)
            ret.wheelDeltaY = ret.wheelDelta
            ret.wheelDeltaX = 0
        }
        ret.timeStamp = new Date() - 0
        ret.originalEvent = event
        ret.preventDefault = function () { //闃绘榛樿琛屼负
            event.returnValue = false
        }
        ret.stopPropagation = function () { //闃绘浜嬩欢鍦―OM鏍戜腑鐨勪紶鎾�
            event.cancelBubble = true
        }
        return ret
    }

    var eventHooks = avalon.eventHooks
    //閽堝firefox, chrome淇mouseenter, mouseleave
    if (!("onmouseenter" in root)) {
        avalon.each({
            mouseenter: "mouseover",
            mouseleave: "mouseout"
        }, function (origType, fixType) {
            eventHooks[origType] = {
                type: fixType,
                fn: function (elem, fn) {
                    return function (e) {
                        var t = e.relatedTarget
                        if (!t || (t !== elem && !(elem.compareDocumentPosition(t) & 16))) {
                            delete e.type
                            e.type = origType
                            return fn.call(elem, e)
                        }
                    }
                }
            }
        })
    }
    //閽堝IE9+, w3c淇animationend
    avalon.each({
        AnimationEvent: "animationend",
        WebKitAnimationEvent: "webkitAnimationEnd"
    }, function (construct, fixType) {
        if (window[construct] && !eventHooks.animationend) {
            eventHooks.animationend = {
                type: fixType
            }
        }
    })
    //閽堝IE6-8淇input
    if (!("oninput" in DOC.createElement("input"))) {
        eventHooks.input = {
            type: "propertychange",
            deel: function (elem, fn) {
                return function (e) {
                    if (e.propertyName === "value") {
                        e.type = "input"
                        return fn.call(elem, e)
                    }
                }
            }
        }
    }
    if (DOC.onmousewheel === void 0) {
        /* IE6-11 chrome mousewheel wheelDetla 涓� -120 涓� 120
         firefox DOMMouseScroll detail 涓�3 涓�-3
         firefox wheel detlaY 涓�3 涓�-3
         IE9-11 wheel deltaY 涓�40 涓�-40
         chrome wheel deltaY 涓�100 涓�-100 */
        var fixWheelType = DOC.onwheel !== void 0 ? "wheel" : "DOMMouseScroll"
        var fixWheelDelta = fixWheelType === "wheel" ? "deltaY" : "detail"
        eventHooks.mousewheel = {
            type: fixWheelType,
            fn: function (elem, fn) {
                return function (e) {
                    e.wheelDeltaY = e.wheelDelta = e[fixWheelDelta] > 0 ? -120 : 120
                    e.wheelDeltaX = 0
                    if (Object.defineProperty) {
                        Object.defineProperty(e, "type", {
                            value: "mousewheel"
                        })
                    }
                    fn.call(elem, e)
                }
            }
        }
    }



    /*********************************************************************
     *                           閰嶇疆绯荤粺                                 *
     **********************************************************************/

    function kernel(settings) {
        for (var p in settings) {
            if (!ohasOwn.call(settings, p))
                continue
            var val = settings[p]
            if (typeof kernel.plugins[p] === "function") {
                kernel.plugins[p](val)
            } else if (typeof kernel[p] === "object") {
                avalon.mix(kernel[p], val)
            } else {
                kernel[p] = val
            }
        }
        return this
    }
    var openTag, closeTag, rexpr, rexprg, rbind, rregexp = /[-.*+?^${}()|[\]\/\\]/g

    function escapeRegExp(target) {
        //http://stevenlevithan.com/regex/xregexp/
        //灏嗗瓧绗︿覆瀹夊叏鏍煎紡鍖栦负姝ｅ垯琛ㄨ揪寮忕殑婧愮爜
        return (target + "").replace(rregexp, "\\$&")
    }

    var plugins = {
        interpolate: function (array) {
            openTag = array[0]
            closeTag = array[1]
            if (openTag === closeTag) {
                throw new SyntaxError("openTag!==closeTag")
                var test = openTag + "test" + closeTag
                cinerator.innerHTML = test
                if (cinerator.innerHTML !== test && cinerator.innerHTML.indexOf("&lt;") > -1) {
                    throw new SyntaxError("姝ゅ畾鐣岀涓嶅悎娉�")
                }
                cinerator.innerHTML = ""
            }
            kernel.openTag = openTag
            kernel.closeTag = closeTag
            var o = escapeRegExp(openTag),
                    c = escapeRegExp(closeTag)
            rexpr = new RegExp(o + "(.*?)" + c)
            rexprg = new RegExp(o + "(.*?)" + c, "g")
            rbind = new RegExp(o + ".*?" + c + "|\\sms-")
        }
    }
    kernel.async = true
    kernel.debug = true
    kernel.plugins = plugins
    kernel.plugins['interpolate'](["{{", "}}"])
    kernel.paths = {}
    kernel.shim = {}
    kernel.maxRepeatSize = 100
    avalon.config = kernel
    function $watch(expr, binding) {
        var $events = this.$events || (this.$events = {})

        var queue = $events[expr] || ($events[expr] = [])
        if (typeof binding === "function") {
            var backup = binding
            backup.uniqueNumber = Math.random()
            binding = {
                element: root,
                type: "user-watcher",
                handler: noop,
                vmodels: [this],
                expr: expr,
                uniqueNumber: backup.uniqueNumber
            }
            binding.wildcard = /\*/.test(expr)
        }

        if (!binding.update) {
            if (/\w\.*\B/.test(expr)) {
                binding.getter = noop
                var host = this
                binding.update = function () {
                    var args = this.fireArgs || []
                    if (args[2])
                        binding.handler.apply(host, args)
                    delete this.fireArgs
                }
                queue.sync = true
                avalon.Array.ensure(queue, binding)
            } else {
                avalon.injectBinding(binding)
            }
            if (backup) {
                binding.handler = backup
            }
        } else if (!binding.oneTime) {
            avalon.Array.ensure(queue, binding)
        }
        return function () {
            binding.update = binding.getter = binding.handler = noop
            binding.element = DOC.createElement("a")
        }
    }
    function $emit(key, args) {
        var event = this.$events
        if (event && event[key]) {
            if (args) {
                args[2] = key
            }
            var arr = event[key]
            notifySubscribers(arr, args)
            var parent = this.$up
            if (parent) {
                if (this.$pathname) {
                    $emit.call(parent, this.$pathname + "." + key, args)//浠ョ‘鍒囩殑鍊煎線涓婂啋娉�
                }

                $emit.call(parent, "*." + key, args)//浠ユā绯婄殑鍊煎線涓婂啋娉�
            }
        } else {
            parent = this.$up

            if (this.$ups) {
                for (var i in this.$ups) {
                    $emit.call(this.$ups[i], i + "." + key, args)//浠ョ‘鍒囩殑鍊煎線涓婂啋娉�
                }
                return
            }
            if (parent) {
                var p = this.$pathname
                if (p === "")
                    p = "*"
                var path = p + "." + key
                arr = path.split(".")
                if (arr.indexOf("*") === -1) {
                    $emit.call(parent, path, args)//浠ョ‘鍒囩殑鍊煎線涓婂啋娉�
                    arr[1] = "*"
                    $emit.call(parent, arr.join("."), args)//浠ユā绯婄殑鍊煎線涓婂啋娉�
                } else {
                    $emit.call(parent, path, args)//浠ョ‘鍒囩殑鍊煎線涓婂啋娉�
                }
            }
        }
    }


    function collectDependency(el, key) {
        do {
            if (el.$watch) {
                var e = el.$events || (el.$events = {})
                var array = e[key] || (e[key] = [])
                dependencyDetection.collectDependency(array)
                return
            }
            el = el.$up
            if (el) {
                key = el.$pathname + "." + key
            } else {
                break
            }

        } while (true)
    }


    function notifySubscribers(subs, args) {
        if (!subs)
            return
        if (new Date() - beginTime > 444 && typeof subs[0] === "object") {
            rejectDisposeQueue()
        }
        var users = [], renders = []
        for (var i = 0, sub; sub = subs[i++];) {
            if (sub.type === "user-watcher") {
                users.push(sub)
            } else {
                renders.push(sub)
            }

        }
        if (kernel.async) {
            buffer.render()//1
            for (i = 0; sub = renders[i++];) {
                if (sub.update) {
                    var uuid = getUid(sub)
                    if (!buffer.queue[uuid]) {
                        buffer.queue[uuid] = 1
                        buffer.queue.push(sub)
                    }
                }
            }
        } else {
            for (i = 0; sub = renders[i++];) {
                if (sub.update) {
                    sub.update()//鏈€灏忓寲鍒锋柊DOM鏍�
                }
            }
        }
        for (i = 0; sub = users[i++];) {
            if (args && args[2] === sub.expr || sub.wildcard) {
                sub.fireArgs = args
            }
            sub.update()
        }
    }
    //avalon鏈€鏍稿績鐨勬柟娉曠殑涓や釜鏂规硶涔嬩竴锛堝彟涓€涓槸avalon.scan锛夛紝杩斿洖涓€涓猇iewModel(VM)
    var VMODELS = avalon.vmodels = {} //鎵€鏈塿model閮藉偍瀛樺湪杩欓噷
    avalon.define = function (source) {
        var $id = source.$id
        if (!$id) {
            log("warning: vm蹇呴』鎸囧畾$id")
        }
        var vmodel = modelFactory(source)
        vmodel.$id = $id
        return VMODELS[$id] = vmodel
    }

    //涓€浜涗笉闇€瑕佽鐩戝惉鐨勫睘鎬�
    var $$skipArray = oneObject("$id,$watch,$fire,$events,$model,$skipArray,$active,$pathname,$up,$track,$accessors,$ups")
    var defineProperty = Object.defineProperty
    var canHideOwn = true
    //濡傛灉娴忚鍣ㄤ笉鏀寔ecma262v5鐨凮bject.defineProperties鎴栬€呭瓨鍦˙UG锛屾瘮濡侷E8
    //鏍囧噯娴忚鍣ㄤ娇鐢╛_defineGetter__, __defineSetter__瀹炵幇
    try {
        defineProperty({}, "_", {
            value: "x"
        })
        var defineProperties = Object.defineProperties
    } catch (e) {
        canHideOwn = false
    }

    function modelFactory(source, options) {
        options = options || {}
        options.watch = true
        return observeObject(source, options)
    }

    //鐩戝惉瀵硅薄灞炴€у€肩殑鍙樺寲(娉ㄦ剰,鏁扮粍鍏冪礌涓嶆槸鏁扮粍鐨勫睘鎬�),閫氳繃瀵瑰姭鎸佸綋鍓嶅璞＄殑璁块棶鍣ㄥ疄鐜�
    //鐩戝惉瀵硅薄鎴栨暟缁勭殑缁撴瀯鍙樺寲, 瀵瑰璞＄殑閿€煎杩涜澧炲垹閲嶆帓, 鎴栧鏁扮粍鐨勮繘琛屽鍒犻噸鎺�,閮藉睘浜庤繖鑼冪暣
    //   閫氳繃姣旇緝鍓嶅悗浠ｇ悊VM椤哄簭瀹炵幇
    function Component() {
    }

    function observeObject(source, options) {
        if (!source || (source.$id && source.$accessors) || (source.nodeName && source.nodeType > 0)) {
            return source
        }
        //source涓哄師瀵硅薄,涓嶈兘鏄厓绱犺妭鐐规垨null
        //options,鍙€�,閰嶇疆瀵硅薄,閲岄潰鏈塷ld, force, watch杩欎笁涓睘鎬�
        options = options || nullObject
        var force = options.force || nullObject
        var old = options.old
        var oldAccessors = old && old.$accessors || nullObject
        var $vmodel = new Component() //瑕佽繑鍥炵殑瀵硅薄, 瀹冨湪IE6-8涓嬪彲鑳借鍋烽緳杞嚖
        var accessors = {} //鐩戞帶灞炴€�
        var hasOwn = {}
        var skip = []
        var simple = []
        var $skipArray = {}
        if (source.$skipArray) {
            $skipArray = oneObject(source.$skipArray)
            delete source.$skipArray
        }
        //澶勭悊璁＄畻灞炴€�
        var computed = source.$computed
        if (computed) {
            delete source.$computed
            for (var name in computed) {
                hasOwn[name] = true;
                (function (key, value) {
                    var old
                    accessors[key] = {
                        get: function () {
                            return old = value.get.call(this)
                        },
                        set: function (x) {
                            if (typeof value.set === "function") {
                                var older = old
                                value.set.call(this, x)
                                var newer = this[key]
                                if (this.$fire && (newer !== older)) {
                                    this.$fire(key, newer, older)
                                }
                            }
                        },
                        enumerable: true,
                        configurable: true
                    }
                })(name, computed[name])// jshint ignore:line
            }
        }


        for (name in source) {
            var value = source[name]
            if (!$$skipArray[name])
                hasOwn[name] = true
            if (typeof value === "function" || (value && value.nodeName && value.nodeType > 0) ||
                    (!force[name] && (name.charAt(0) === "$" || $$skipArray[name] || $skipArray[name]))) {
                skip.push(name)
            } else if (isComputed(value)) {
                log("warning:璁＄畻灞炴€у缓璁斁鍦�$computed瀵硅薄涓粺涓€瀹氫箟");
                (function (key, value) {
                    var old
                    accessors[key] = {
                        get: function () {
                            return old = value.get.call(this)
                        },
                        set: function (x) {
                            if (typeof value.set === "function") {
                                var older = old
                                value.set.call(this, x)
                                var newer = this[key]
                                if (this.$fire && (newer !== older)) {
                                    this.$fire(key, newer, older)
                                }
                            }
                        },
                        enumerable: true,
                        configurable: true
                    }
                })(name, value)// jshint ignore:line
            } else {
                simple.push(name)
                if (oldAccessors[name]) {
                    accessors[name] = oldAccessors[name]
                } else {
                    accessors[name] = makeGetSet(name, value)
                }
            }
        }


        accessors["$model"] = $modelDescriptor
        $vmodel = defineProperties($vmodel, accessors, source)
        function trackBy(name) {
            return hasOwn[name] === true
        }
        skip.forEach(function (name) {
            $vmodel[name] = source[name]
        })

        /* jshint ignore:start */
        hideProperty($vmodel, "$ups", null)
        hideProperty($vmodel, "$id", "anonymous")
        hideProperty($vmodel, "$up", old ? old.$up : null)
        hideProperty($vmodel, "$track", Object.keys(hasOwn))
        hideProperty($vmodel, "$active", false)
        hideProperty($vmodel, "$pathname", old ? old.$pathname : "")
        hideProperty($vmodel, "$accessors", accessors)
        hideProperty($vmodel, "hasOwnProperty", trackBy)
        if (options.watch) {
            hideProperty($vmodel, "$watch", function () {
                return $watch.apply($vmodel, arguments)
            })
            hideProperty($vmodel, "$fire", function (path, a) {
                if (path.indexOf("all!") === 0) {
                    var ee = path.slice(4)
                    for (var i in avalon.vmodels) {
                        var v = avalon.vmodels[i]
                        v.$fire && v.$fire.apply(v, [ee, a])
                    }
                } else {
                    $emit.call($vmodel, path, [a])
                }
            })
        }
        /* jshint ignore:end */
        //蹇呴』璁剧疆浜�$active,$events
        simple.forEach(function (name) {
            var oldVal = old && old[name]
            var val = $vmodel[name] = source[name]
            if (val && typeof val === "object") {
                val.$up = $vmodel
                val.$pathname = name
            }
            $emit.call($vmodel, name, [val, oldVal])
        })
        for (name in computed) {
            value = $vmodel[name]
        }
        $vmodel.$active = true
        return $vmodel
    }
    /*
     鏂扮殑VM鎷ユ湁濡備笅绉佹湁灞炴€�
     $id: vm.id
     $events: 鏀剧疆$watch鍥炶皟涓庣粦瀹氬璞�
     $watch: 澧炲己鐗�$watch
     $fire: 瑙﹀彂$watch鍥炶皟
     $track:涓€涓暟缁�,閲岄潰鍖呭惈鐢ㄦ埛瀹氫箟鐨勬墍鏈夐敭鍚�
     $active:boolean,false鏃堕槻姝緷璧栨敹闆�
     $model:杩斿洖涓€涓函鍑€鐨凧S瀵硅薄
     $accessors:鏀剧疆鎵€鏈夎鍐欏櫒鐨勬暟鎹弿杩板璞�
     $up:杩斿洖鍏朵笂绾у璞�
     $pathname:杩斿洖姝ゅ璞″湪涓婄骇瀵硅薄鐨勫悕瀛�,娉ㄦ剰,鏁扮粍鍏冪礌鐨�$pathname涓虹┖瀛楃涓�
     =============================
     $skipArray:鐢ㄤ簬鎸囧畾涓嶅彲鐩戝惉鐨勫睘鎬�,浣哣M鐢熸垚鏄病鏈夋灞炴€х殑
     */
    function isComputed(val) {//speed up!
        if (val && typeof val === "object") {
            for (var i in val) {
                if (i !== "get" && i !== "set") {
                    return false
                }
            }
            return typeof val.get === "function"
        }
    }
    function makeGetSet(key, value) {
        var childVm
        value = NaN
        return {
            get: function () {
                if (this.$active) {
                    collectDependency(this, key)
                }
                return value
            },
            set: function (newVal) {
                if (value === newVal)
                    return
                var oldValue = value
                childVm = observe(newVal, value)
                if (childVm) {
                    value = childVm
                } else {
                    childVm = void 0
                    value = newVal
                }

                if (Object(childVm) === childVm) {
                    childVm.$pathname = key
                    childVm.$up = this
                }
                if (this.$active) {
                    $emit.call(this, key, [value, oldValue])
                }
            },
            enumerable: true,
            configurable: true
        }
    }

    function observe(obj, old, hasReturn, watch) {
        if (Array.isArray(obj)) {
            return observeArray(obj, old, watch)
        } else if (avalon.isPlainObject(obj)) {
            if (old && typeof old === 'object') {
                var keys = getKeys(obj)
                var keys2 = getKeys(old)
                if (keys.join(";") === keys2.join(";")) {
                    for (var i in obj) {
                        if (obj.hasOwnProperty(i)) {
                            old[i] = obj[i]
                        }
                    }
                    return old
                }
                old.$active = false
            }
            return observeObject(obj, {
                old: old,
                watch: watch
            })
        }
        if (hasReturn) {
            return obj
        }
    }
    var getKeys = rnative.test(Object.key) ? Object.key : function (a) {
        var ret = []
        for (var i in a) {
            if (a.hasOwnProperty(i) && !$$skipArray[i]) {
                ret.push(i)
            }
        }
        return ret
    }
    function observeArray(array, old, watch) {
        if (old) {
            var args = [0, old.length].concat(array)
            old.splice.apply(old, args)
            return old
        } else {
            for (var i in newProto) {
                array[i] = newProto[i]
            }
            hideProperty(array, "$up", null)
            hideProperty(array, "$pathname", "")
            hideProperty(array, "$track", createTrack(array.length))

            array._ = observeObject({
                length: NaN
            }, {
                watch: true
            })
            array._.length = array.length
            array._.$watch("length", function (a, b) {
                $emit.call(array.$up, array.$pathname + ".length", [a, b])
            })
            if (watch) {
                hideProperty(array, "$watch", function () {
                    return $watch.apply(array, arguments)
                })
            }

            if (W3C) {
                Object.defineProperty(array, "$model", $modelDescriptor)
            } else {
                array.$model = toJson(array)
            }
            for (var j = 0, n = array.length; j < n; j++) {
                var el = array[j] = observe(array[j], 0, 1, 1)
                if (Object(el) === el) {//#1077
                    el.$up = array
                }
            }

            return array
        }
    }

    function hideProperty(host, name, value) {
        if (canHideOwn) {
            Object.defineProperty(host, name, {
                value: value,
                writable: true,
                enumerable: false,
                configurable: true
            })
        } else {
            host[name] = value
        }
    }

    function toJson(val) {
        var xtype = avalon.type(val)
        if (xtype === "array") {
            var array = []
            for (var i = 0; i < val.length; i++) {
                array[i] = toJson(val[i])
            }
            return array
        } else if (xtype === "object") {
            var obj = {}
            for (i in val) {
                if (i === "__proxy__" || i === "__data__" || i === "__const__")
                    continue
                if (val.hasOwnProperty(i)) {
                    var value = val[i]
                    obj[i] = value && value.nodeType ? value : toJson(value)
                }
            }
            return obj
        }
        return val
    }

    var $modelDescriptor = {
        get: function () {
            return toJson(this)
        },
        set: noop,
        enumerable: false,
        configurable: true
    }


    //===================淇娴忚鍣ㄥObject.defineProperties鐨勬敮鎸�=================
    if (!canHideOwn) {
        if ("__defineGetter__" in avalon) {
            defineProperty = function (obj, prop, desc) {
                if ('value' in desc) {
                    obj[prop] = desc.value
                }
                if ("get" in desc) {
                    obj.__defineGetter__(prop, desc.get)
                }
                if ('set' in desc) {
                    obj.__defineSetter__(prop, desc.set)
                }
                return obj
            }
            defineProperties = function (obj, descs) {
                for (var prop in descs) {
                    if (descs.hasOwnProperty(prop)) {
                        defineProperty(obj, prop, descs[prop])
                    }
                }
                return obj
            }
        }
        if (IEVersion) {
            var VBClassPool = {}
            window.execScript([// jshint ignore:line
                "Function parseVB(code)",
                "\tExecuteGlobal(code)",
                "End Function" //杞崲涓€娈垫枃鏈负VB浠ｇ爜
            ].join("\n"), "VBScript")
            function VBMediator(instance, accessors, name, value) {// jshint ignore:line
                var accessor = accessors[name]
                if (arguments.length === 4) {
                    accessor.set.call(instance, value)
                } else {
                    return accessor.get.call(instance)
                }
            }
            defineProperties = function (name, accessors, properties) {
                // jshint ignore:line
                var buffer = []
                buffer.push(
                        "\r\n\tPrivate [__data__], [__proxy__]",
                        "\tPublic Default Function [__const__](d" + expose + ", p" + expose + ")",
                        "\t\tSet [__data__] = d" + expose + ": set [__proxy__] = p" + expose,
                        "\t\tSet [__const__] = Me", //閾惧紡璋冪敤
                        "\tEnd Function")
                //娣诲姞鏅€氬睘鎬�,鍥犱负VBScript瀵硅薄涓嶈兘鍍廕S閭ｆ牱闅忔剰澧炲垹灞炴€э紝蹇呴』鍦ㄨ繖閲岄鍏堝畾涔夊ソ
                var uniq = {}

                //娣诲姞璁块棶鍣ㄥ睘鎬� 
                for (name in accessors) {
                    uniq[name] = true
                    buffer.push(
                            //鐢变簬涓嶇煡瀵规柟浼氫紶鍏ヤ粈涔�,鍥犳set, let閮界敤涓�
                            "\tPublic Property Let [" + name + "](val" + expose + ")", //setter
                            "\t\tCall [__proxy__](Me,[__data__], \"" + name + "\", val" + expose + ")",
                            "\tEnd Property",
                            "\tPublic Property Set [" + name + "](val" + expose + ")", //setter
                            "\t\tCall [__proxy__](Me,[__data__], \"" + name + "\", val" + expose + ")",
                            "\tEnd Property",
                            "\tPublic Property Get [" + name + "]", //getter
                            "\tOn Error Resume Next", //蹇呴』浼樺厛浣跨敤set璇彞,鍚﹀垯瀹冧細璇皢鏁扮粍褰撳瓧绗︿覆杩斿洖
                            "\t\tSet[" + name + "] = [__proxy__](Me,[__data__],\"" + name + "\")",
                            "\tIf Err.Number <> 0 Then",
                            "\t\t[" + name + "] = [__proxy__](Me,[__data__],\"" + name + "\")",
                            "\tEnd If",
                            "\tOn Error Goto 0",
                            "\tEnd Property")

                }
                for (name in properties) {
                    if (uniq[name] !== true) {
                        uniq[name] = true
                        buffer.push("\tPublic [" + name + "]")
                    }
                }
                for (name in $$skipArray) {
                    if (uniq[name] !== true) {
                        uniq[name] = true
                        buffer.push("\tPublic [" + name + "]")
                    }
                }
                buffer.push("\tPublic [" + 'hasOwnProperty' + "]")
                buffer.push("End Class")
                var body = buffer.join("\r\n")
                var className = VBClassPool[body]
                if (!className) {
                    className = generateID("VBClass")
                    window.parseVB("Class " + className + body)
                    window.parseVB([
                        "Function " + className + "Factory(a, b)", //鍒涘缓瀹炰緥骞朵紶鍏ヤ袱涓叧閿殑鍙傛暟
                        "\tDim o",
                        "\tSet o = (New " + className + ")(a, b)",
                        "\tSet " + className + "Factory = o",
                        "End Function"
                    ].join("\r\n"))
                    VBClassPool[body] = className
                }
                var ret = window[className + "Factory"](accessors, VBMediator) //寰楀埌鍏朵骇鍝�
                return ret //寰楀埌鍏朵骇鍝�
            }
        }
    }

    /*********************************************************************
     *          鐩戞帶鏁扮粍锛堜笌ms-each, ms-repeat閰嶅悎浣跨敤锛�                     *
     **********************************************************************/

    var arrayMethods = ['push', 'pop', 'shift', 'unshift', 'splice']
    var arrayProto = Array.prototype
    var newProto = {
        notify: function () {
            $emit.call(this.$up, this.$pathname)
        },
        set: function (index, val) {
            if (((index >>> 0) === index) && this[index] !== val) {
                if (index > this.length) {
                    throw Error(index + "set鏂规硶鐨勭涓€涓弬鏁颁笉鑳藉ぇ浜庡師鏁扮粍闀垮害")
                }
                $emit.call(this.$up, this.$pathname + ".*", [val, this[index]])
                this.splice(index, 1, val)
            }
        },
        contains: function (el) { //鍒ゅ畾鏄惁鍖呭惈
            return this.indexOf(el) !== -1
        },
        ensure: function (el) {
            if (!this.contains(el)) { //鍙湁涓嶅瓨鍦ㄦ墠push
                this.push(el)
            }
            return this
        },
        pushArray: function (arr) {
            return this.push.apply(this, arr)
        },
        remove: function (el) { //绉婚櫎绗竴涓瓑浜庣粰瀹氬€肩殑鍏冪礌
            return this.removeAt(this.indexOf(el))
        },
        removeAt: function (index) { //绉婚櫎鎸囧畾绱㈠紩涓婄殑鍏冪礌
            if ((index >>> 0) === index) {
                return this.splice(index, 1)
            }
            return []
        },
        size: function () { //鍙栧緱鏁扮粍闀垮害锛岃繖涓嚱鏁板彲浠ュ悓姝ヨ鍥撅紝length涓嶈兘
            return this._.length
        },
        removeAll: function (all) { //绉婚櫎N涓厓绱�
            if (Array.isArray(all)) {
                for (var i = this.length - 1; i >= 0; i--) {
                    if (all.indexOf(this[i]) !== -1) {
                        _splice.call(this.$track, i, 1)
                        _splice.call(this, i, 1)

                    }
                }
            } else if (typeof all === "function") {
                for (i = this.length - 1; i >= 0; i--) {
                    var el = this[i]
                    if (all(el, i)) {
                        _splice.call(this.$track, i, 1)
                        _splice.call(this, i, 1)

                    }
                }
            } else {
                _splice.call(this.$track, 0, this.length)
                _splice.call(this, 0, this.length)

            }
            if (!W3C) {
                this.$model = toJson(this)
            }
            this.notify()
            this._.length = this.length
        },
        clear: function () {
            return this.removeAll()
        }
    }
    var _splice = arrayProto.splice
    arrayMethods.forEach(function (method) {
        var original = arrayProto[method]
        newProto[method] = function () {
            // 缁х画灏濊瘯鍔寔鏁扮粍鍏冪礌鐨勫睘鎬�
            var args = []
            for (var i = 0, n = arguments.length; i < n; i++) {
                args[i] = observe(arguments[i], 0, 1, 1)
            }
            var result = original.apply(this, args)
            addTrack(this.$track, method, args)
            if (!W3C) {
                this.$model = toJson(this)
            }
            this.notify()
            this._.length = this.length
            return result
        }
    })

    "sort,reverse".replace(rword, function (method) {
        newProto[method] = function () {
            var oldArray = this.concat() //淇濇寔鍘熸潵鐘舵€佺殑鏃ф暟缁�
            var newArray = this
            var mask = Math.random()
            var indexes = []
            var hasSort = false
            arrayProto[method].apply(newArray, arguments) //鎺掑簭
            for (var i = 0, n = oldArray.length; i < n; i++) {
                var neo = newArray[i]
                var old = oldArray[i]
                if (neo === old) {
                    indexes.push(i)
                } else {
                    var index = oldArray.indexOf(neo)
                    indexes.push(index)//寰楀埌鏂版暟缁勭殑姣忎釜鍏冪礌鍦ㄦ棫鏁扮粍瀵瑰簲鐨勪綅缃�
                    oldArray[index] = mask    //灞忚斀宸茬粡鎵捐繃鐨勫厓绱�
                    hasSort = true
                }
            }
            if (hasSort) {
                sortByIndex(this.$track, indexes)
                if (!W3C) {
                    this.$model = toJson(this)
                }
                this.notify()
            }
            return this
        }
    })

    function sortByIndex(array, indexes) {
        var map = {};
        for (var i = 0, n = indexes.length; i < n; i++) {
            map[i] = array[i]
            var j = indexes[i]
            if (j in map) {
                array[i] = map[j]
                delete map[j]
            } else {
                array[i] = array[j]
            }
        }
    }

    function createTrack(n) {
        var ret = []
        for (var i = 0; i < n; i++) {
            ret[i] = generateID("$proxy$each")
        }
        return ret
    }

    function addTrack(track, method, args) {
        switch (method) {
            case 'push':
            case 'unshift':
                args = createTrack(args.length)
                break
            case 'splice':
                if (args.length > 2) {
                    // 0, 5, a, b, c --> 0, 2, 0
                    // 0, 5, a, b, c, d, e, f, g--> 0, 0, 3
                    var del = args[1]
                    var add = args.length - 2
                    // args = [args[0], Math.max(del - add, 0)].concat(createTrack(Math.max(add - del, 0)))
                    args = [args[0], args[1]].concat(createTrack(args.length - 2))
                }
                break
        }
        Array.prototype[method].apply(track, args)
    }
    /*********************************************************************
     *                           渚濊禆璋冨害绯荤粺                             *
     **********************************************************************/
    //妫€娴嬩袱涓璞￠棿鐨勪緷璧栧叧绯�
    var dependencyDetection = (function () {
        var outerFrames = []
        var currentFrame
        return {
            begin: function (binding) {
                //accessorObject涓轰竴涓嫢鏈塩allback鐨勫璞�
                outerFrames.push(currentFrame)
                currentFrame = binding
            },
            end: function () {
                currentFrame = outerFrames.pop()
            },
            collectDependency: function (array) {
                if (currentFrame) {
                    //琚玠ependencyDetection.begin璋冪敤
                    currentFrame.callback(array)
                }
            }
        };
    })()
    //灏嗙粦瀹氬璞℃敞鍏ュ埌鍏朵緷璧栭」鐨勮闃呮暟缁勪腑
    var roneval = /^on$/

    function returnRandom() {
        return new Date() - 0
    }

    avalon.injectBinding = function (binding) {

        binding.handler = binding.handler || directives[binding.type].update || noop
        binding.update = function () {
            var begin = false
            if (!binding.getter) {
                begin = true
                dependencyDetection.begin({
                    callback: function (array) {
                        injectDependency(array, binding)
                    }
                })
                binding.getter = parseExpr(binding.expr, binding.vmodels, binding)
                binding.observers.forEach(function (a) {
                    a.v.$watch(a.p, binding)
                })
                delete binding.observers
            }
            try {
                var args = binding.fireArgs, a, b
                delete binding.fireArgs
                if (!args) {
                    if (binding.type === "on") {
                        a = binding.getter + ""
                    } else {
                        a = binding.getter.apply(0, binding.args)
                    }
                } else {
                    a = args[0]
                    b = args[1]

                }
                b = typeof b === "undefined" ? binding.oldValue : b
                if (binding._filters) {
                    a = filters.$filter.apply(0, [a].concat(binding._filters))
                }
                if (binding.signature) {
                    var xtype = avalon.type(a)
                    if (xtype !== "array" && xtype !== "object") {
                        throw Error("warning:" + binding.expr + "鍙兘鏄璞℃垨鏁扮粍")
                    }
                    binding.xtype = xtype
                    var vtrack = getProxyIds(binding.proxies || [], xtype)
                    var mtrack = a.$track || (xtype === "array" ? createTrack(a.length) :
                            Object.keys(a))
                    binding.track = mtrack
                    if (vtrack !== mtrack.join(";")) {
                        binding.handler(a, b)
                        binding.oldValue = 1
                    }
                } else if (Array.isArray(a) ? a.length !== (b && b.length) : false) {
                    binding.handler(a, b)
                    binding.oldValue = a.concat()
                } else if (!("oldValue" in binding) || a !== b) {
                    binding.handler(a, b)
                    binding.oldValue = a
                }
            } catch (e) {
                delete binding.getter
                log("warning:exception throwed in [avalon.injectBinding] ", e)
                var node = binding.element
                if (node && node.nodeType === 3) {
                    node.nodeValue = openTag + (binding.oneTime ? "::" : "") + binding.expr + closeTag
                }
            } finally {
                begin && dependencyDetection.end()

            }
        }
        binding.update()
    }


    //灏嗕緷璧栭」(姣斿畠楂樺眰鐨勮闂櫒鎴栨瀯寤鸿鍥惧埛鏂板嚱鏁扮殑缁戝畾瀵硅薄)娉ㄥ叆鍒拌闃呰€呮暟缁�
    function injectDependency(list, binding) {
        if (binding.oneTime)
            return
        if (list && avalon.Array.ensure(list, binding) && binding.element) {
            injectDisposeQueue(binding, list)
            if (new Date() - beginTime > 444) {
                rejectDisposeQueue()
            }
        }
    }


    function getProxyIds(a, isArray) {
        var ret = []
        for (var i = 0, el; el = a[i++];) {
            ret.push(isArray ? el.$id : el.$key)
        }
        return ret.join(";")
    }

    /*********************************************************************
     *                          瀹氭椂GC鍥炴敹鏈哄埗                             *
     **********************************************************************/
    var disposeCount = 0
    var disposeQueue = avalon.$$subscribers = []
    var beginTime = new Date()
    var oldInfo = {}

    function getUid(data) { //IE9+,鏍囧噯娴忚鍣�
        if (!data.uniqueNumber) {
            var elem = data.element
            if (elem) {
                if (elem.nodeType !== 1) {
                    //濡傛灉鏄敞閲婅妭鐐�,鍒檇ata.pos涓嶅瓨鍦�,褰撲竴涓厓绱犱笅鏈変袱涓敞閲婅妭鐐瑰氨浼氬嚭闂
                    data.uniqueNumber = data.type + "-" + getUid(elem.parentNode) + "-" + (++disposeCount)
                } else {
                    data.uniqueNumber = data.name + "-" + getUid(elem)
                }
            } else {
                data.uniqueNumber = ++disposeCount
            }
        }
        return data.uniqueNumber
    }

    //娣诲姞鍒板洖鏀跺垪闃熶腑
    function injectDisposeQueue(data, list) {
        var lists = data.lists || (data.lists = [])
        var uuid = getUid(data)
        avalon.Array.ensure(lists, list)
        list.$uuid = list.$uuid || generateID()
        if (!disposeQueue[uuid]) {
            disposeQueue[uuid] = 1
            disposeQueue.push(data)
        }
    }

    function rejectDisposeQueue(data) {

        var i = disposeQueue.length
        var n = i
        var allTypes = []
        var iffishTypes = {}
        var newInfo = {}
        //瀵归〉闈笂鎵€鏈夌粦瀹氬璞¤繘琛屽垎闂ㄥ埆绫�, 鍙娴嬩釜鏁板彂鐢熷彉鍖栫殑绫诲瀷
        while (data = disposeQueue[--i]) {
            var type = data.type
            if (newInfo[type]) {
                newInfo[type]++
            } else {
                newInfo[type] = 1
                allTypes.push(type)
            }
        }
        var diff = false
        allTypes.forEach(function (type) {
            if (oldInfo[type] !== newInfo[type]) {
                iffishTypes[type] = 1
                diff = true
            }
        })
        i = n
        if (diff) {
            while (data = disposeQueue[--i]) {
                if (data.element === null) {
                    disposeQueue.splice(i, 1)
                    continue
                }
                if (iffishTypes[data.type] && shouldDispose(data.element)) { //濡傛灉瀹冩病鏈夊湪DOM鏍�
                    disposeQueue.splice(i, 1)
                    delete disposeQueue[data.uniqueNumber]
                    var lists = data.lists
                    for (var k = 0, list; list = lists[k++];) {
                        avalon.Array.remove(lists, list)
                        avalon.Array.remove(list, data)
                    }
                    disposeData(data)
                }
            }
        }
        oldInfo = newInfo
        beginTime = new Date()
    }

    function disposeData(data) {
        delete disposeQueue[data.uniqueNumber] // 鍏堟竻闄わ紝涓嶇劧鏃犳硶鍥炴敹浜�
        data.element = null
        data.rollback && data.rollback()
        for (var key in data) {
            data[key] = null
        }
    }

    function shouldDispose(el) {
        try {//IE涓嬶紝濡傛灉鏂囨湰鑺傜偣鑴辩DOM鏍戯紝璁块棶parentNode浼氭姤閿�
            var fireError = el.parentNode.nodeType
        } catch (e) {
            return true
        }
        if (el.ifRemove) {
            // 濡傛灉鑺傜偣琚斁鍒癷fGroup锛屾墠绉婚櫎
            if (!root.contains(el.ifRemove) && (ifGroup === el.parentNode)) {
                el.parentNode && el.parentNode.removeChild(el)
                return true
            }
        }
        return el.msRetain ? 0 : (el.nodeType === 1 ? !root.contains(el) : !avalon.contains(root, el))
    }



    /************************************************************************
     *            HTML澶勭悊(parseHTML, innerHTML, clearHTML)                  *
     ************************************************************************/
    // We have to close these tags to support XHTML
    var tagHooks = {
        area: [1, "<map>", "</map>"],
        param: [1, "<object>", "</object>"],
        col: [2, "<table><colgroup>", "</colgroup></table>"],
        legend: [1, "<fieldset>", "</fieldset>"],
        option: [1, "<select multiple='multiple'>", "</select>"],
        thead: [1, "<table>", "</table>"],
        tr: [2, "<table>", "</table>"],
        td: [3, "<table><tr>", "</tr></table>"],
        g: [1, '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1">', '</svg>'],
        //IE6-8鍦ㄧ敤innerHTML鐢熸垚鑺傜偣鏃讹紝涓嶈兘鐩存帴鍒涘缓no-scope鍏冪礌涓嶩TML5鐨勬柊鏍囩
        _default: W3C ? [0, "", ""] : [1, "X<div>", "</div>"] //div鍙互涓嶇敤闂悎
    }
    tagHooks.th = tagHooks.td
    tagHooks.optgroup = tagHooks.option
    tagHooks.tbody = tagHooks.tfoot = tagHooks.colgroup = tagHooks.caption = tagHooks.thead
    String("circle,defs,ellipse,image,line,path,polygon,polyline,rect,symbol,text,use").replace(rword, function (tag) {
        tagHooks[tag] = tagHooks.g //澶勭悊SVG
    })
    var rtagName = /<([\w:]+)/ //鍙栧緱鍏秚agName
    var rxhtml = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/ig
    var rcreate = W3C ? /[^\d\D]/ : /(<(?:script|link|style|meta|noscript))/ig
    var scriptTypes = oneObject(["", "text/javascript", "text/ecmascript", "application/ecmascript", "application/javascript"])
    var rnest = /<(?:tb|td|tf|th|tr|col|opt|leg|cap|area)/ //闇€瑕佸鐞嗗宓屽叧绯荤殑鏍囩
    var script = DOC.createElement("script")
    var rhtml = /<|&#?\w+;/
    avalon.parseHTML = function (html) {
        var fragment = avalonFragment.cloneNode(false)
        if (typeof html !== "string") {
            return fragment
        }
        if (!rhtml.test(html)) {
            fragment.appendChild(DOC.createTextNode(html))
            return fragment
        }
        html = html.replace(rxhtml, "<$1></$2>").trim()
        var tag = (rtagName.exec(html) || ["", ""])[1].toLowerCase(),
            //鍙栧緱鍏舵爣绛惧悕
            wrap = tagHooks[tag] || tagHooks._default,
            wrapper = cinerator,
            firstChild, neo
        if (!W3C) { //fix IE
            html = html.replace(rcreate, "<br class=msNoScope>$1") //鍦╨ink style script绛夋爣绛句箣鍓嶆坊鍔犱竴涓ˉ涓�
        }
        wrapper.innerHTML = wrap[1] + html + wrap[2]
        var els = wrapper.getElementsByTagName("script")
        if (els.length) { //浣跨敤innerHTML鐢熸垚鐨剆cript鑺傜偣涓嶄細鍙戝嚭璇锋眰涓庢墽琛宼ext灞炴€�
            for (var i = 0, el; el = els[i++];) {
                if (scriptTypes[el.type]) {
                    //浠ュ伔榫欒浆鍑ゆ柟寮忔仮澶嶆墽琛岃剼鏈姛鑳�
                    neo = script.cloneNode(false) //FF涓嶈兘鐪佺暐鍙傛暟
                    ap.forEach.call(el.attributes, function (attr) {
                        if (attr && attr.specified) {
                            neo[attr.name] = attr.value //澶嶅埗鍏跺睘鎬�
                            neo.setAttribute(attr.name, attr.value)
                        }
                    }) // jshint ignore:line
                    neo.text = el.text
                    el.parentNode.replaceChild(neo, el) //鏇挎崲鑺傜偣
                }
            }
        }
        if (!W3C) { //fix IE
            var target = wrap[1] === "X<div>" ? wrapper.lastChild.firstChild : wrapper.lastChild
            if (target && target.tagName === "TABLE" && tag !== "tbody") {
                //IE6-7澶勭悊 <thead> --> <thead>,<tbody>
                //<tfoot> --> <tfoot>,<tbody>
                //<table> --> <table><tbody></table>
                for (els = target.childNodes, i = 0; el = els[i++];) {
                    if (el.tagName === "TBODY" && !el.innerHTML) {
                        target.removeChild(el)
                        break
                    }
                }
            }
            els = wrapper.getElementsByTagName("br")
            var n = els.length
            while (el = els[--n]) {
                if (el.className === "msNoScope") {
                    el.parentNode.removeChild(el)
                }
            }
            for (els = wrapper.all, i = 0; el = els[i++];) { //fix VML
                if (isVML(el)) {
                    fixVML(el)
                }
            }
        }
        //绉婚櫎鎴戜滑涓轰簡绗﹀悎濂楀祵鍏崇郴鑰屾坊鍔犵殑鏍囩
        for (i = wrap[0]; i--; wrapper = wrapper.lastChild) { }
        while (firstChild = wrapper.firstChild) { // 灏唚rapper涓婄殑鑺傜偣杞Щ鍒版枃妗ｇ鐗囦笂锛�
            fragment.appendChild(firstChild)
        }
        return fragment
    }

    function isVML(src) {
        var nodeName = src.nodeName
        return nodeName.toLowerCase() === nodeName && src.scopeName && src.outerText === ""
    }

    function fixVML(node) {
        if (node.currentStyle.behavior !== "url(#default#VML)") {
            node.style.behavior = "url(#default#VML)"
            node.style.display = "inline-block"
            node.style.zoom = 1 //hasLayout
        }
    }
    avalon.innerHTML = function (node, html) {
        if (!W3C && (!rcreate.test(html) && !rnest.test(html))) {
            try {
                node.innerHTML = html
                return
            } catch (e) { }
        }
        var a = this.parseHTML(html)
        this.clearHTML(node).appendChild(a)
    }
    avalon.clearHTML = function (node) {
        node.textContent = ""
        while (node.firstChild) {
            node.removeChild(node.firstChild)
        }
        return node
    }

    /*********************************************************************
     *                  avalon鐨勫師鍨嬫柟娉曞畾涔夊尯                            *
     **********************************************************************/

    function hyphen(target) {
        //杞崲涓鸿繛瀛楃绾块鏍�
        return target.replace(/([a-z\d])([A-Z]+)/g, "$1-$2").toLowerCase()
    }

    function camelize(target) {
        //鎻愬墠鍒ゆ柇锛屾彁楂榞etStyle绛夌殑鏁堢巼
        if (!target || target.indexOf("-") < 0 && target.indexOf("_") < 0) {
            return target
        }
        //杞崲涓洪┘宄伴鏍�
        return target.replace(/[-_][^-_]/g, function (match) {
            return match.charAt(1).toUpperCase()
        })
    }

    var fakeClassListMethods = {
        _toString: function () {
            var node = this.node
            var cls = node.className
            var str = typeof cls === "string" ? cls : cls.baseVal
            return str.split(/\s+/).join(" ")
        },
        _contains: function (cls) {
            return (" " + this + " ").indexOf(" " + cls + " ") > -1
        },
        _add: function (cls) {
            if (!this.contains(cls)) {
                this._set(this + " " + cls)
            }
        },
        _remove: function (cls) {
            this._set((" " + this + " ").replace(" " + cls + " ", " "))
        },
        __set: function (cls) {
            cls = cls.trim()
            var node = this.node
            if (rsvg.test(node)) {
                //SVG鍏冪礌鐨刢lassName鏄竴涓璞� SVGAnimatedString { baseVal="", animVal=""}锛屽彧鑳介€氳繃set/getAttribute鎿嶄綔
                node.setAttribute("class", cls)
            } else {
                node.className = cls
            }
        } //toggle瀛樺湪鐗堟湰宸紓锛屽洜姝や笉浣跨敤瀹�
    }

    function fakeClassList(node) {
        if (!("classList" in node)) {
            node.classList = {
                node: node
            }
            for (var k in fakeClassListMethods) {
                node.classList[k.slice(1)] = fakeClassListMethods[k]
            }
        }
        return node.classList
    }


    "add,remove".replace(rword, function (method) {
        avalon.fn[method + "Class"] = function (cls) {
            var el = this[0]
            //https://developer.mozilla.org/zh-CN/docs/Mozilla/Firefox/Releases/26
            if (cls && typeof cls === "string" && el && el.nodeType === 1) {
                cls.replace(/\S+/g, function (c) {
                    fakeClassList(el)[method](c)
                })
            }
            return this
        }
    })
    avalon.fn.mix({
        hasClass: function (cls) {
            var el = this[0] || {}
            return el.nodeType === 1 && fakeClassList(el).contains(cls)
        },
        toggleClass: function (value, stateVal) {
            var className, i = 0
            var classNames = String(value).split(/\s+/)
            var isBool = typeof stateVal === "boolean"
            while ((className = classNames[i++])) {
                var state = isBool ? stateVal : !this.hasClass(className)
                this[state ? "addClass" : "removeClass"](className)
            }
            return this
        },
        attr: function (name, value) {
            if (arguments.length === 2) {
                this[0].setAttribute(name, value)
                return this
            } else {
                return this[0].getAttribute(name)
            }
        },
        data: function (name, value) {
            name = "data-" + hyphen(name || "")
            switch (arguments.length) {
                case 2:
                    this.attr(name, value)
                    return this
                case 1:
                    var val = this.attr(name)
                    return parseData(val)
                case 0:
                    var ret = {}
                    ap.forEach.call(this[0].attributes, function (attr) {
                        if (attr) {
                            name = attr.name
                            if (!name.indexOf("data-")) {
                                name = camelize(name.slice(5))
                                ret[name] = parseData(attr.value)
                            }
                        }
                    })
                    return ret
            }
        },
        removeData: function (name) {
            name = "data-" + hyphen(name)
            this[0].removeAttribute(name)
            return this
        },
        css: function (name, value) {
            if (avalon.isPlainObject(name)) {
                for (var i in name) {
                    avalon.css(this, i, name[i])
                }
            } else {
                var ret = avalon.css(this, name, value)
            }
            return ret !== void 0 ? ret : this
        },
        position: function () {
            var offsetParent, offset,
                elem = this[0],
                parentOffset = {
                    top: 0,
                    left: 0
                }
            if (!elem) {
                return
            }
            if (this.css("position") === "fixed") {
                offset = elem.getBoundingClientRect()
            } else {
                offsetParent = this.offsetParent() //寰楀埌鐪熸鐨刼ffsetParent
                offset = this.offset() // 寰楀埌姝ｇ‘鐨刼ffsetParent
                if (offsetParent[0].tagName !== "HTML") {
                    parentOffset = offsetParent.offset()
                }
                parentOffset.top += avalon.css(offsetParent[0], "borderTopWidth", true)
                parentOffset.left += avalon.css(offsetParent[0], "borderLeftWidth", true)

                // Subtract offsetParent scroll positions
                parentOffset.top -= offsetParent.scrollTop()
                parentOffset.left -= offsetParent.scrollLeft()
            }
            return {
                top: offset.top - parentOffset.top - avalon.css(elem, "marginTop", true),
                left: offset.left - parentOffset.left - avalon.css(elem, "marginLeft", true)
            }
        },
        offsetParent: function () {
            var offsetParent = this[0].offsetParent
            while (offsetParent && avalon.css(offsetParent, "position") === "static") {
                offsetParent = offsetParent.offsetParent;
            }
            return avalon(offsetParent || root)
        },
        bind: function (type, fn, phase) {
            if (this[0]) { //姝ゆ柟娉曚笉浼氶摼
                return avalon.bind(this[0], type, fn, phase)
            }
        },
        unbind: function (type, fn, phase) {
            if (this[0]) {
                avalon.unbind(this[0], type, fn, phase)
            }
            return this
        },
        val: function (value) {
            var node = this[0]
            if (node && node.nodeType === 1) {
                var get = arguments.length === 0
                var access = get ? ":get" : ":set"
                var fn = valHooks[getValType(node) + access]
                if (fn) {
                    var val = fn(node, value)
                } else if (get) {
                    return (node.value || "").replace(/\r/g, "")
                } else {
                    node.value = value
                }
            }
            return get ? val : this
        }
    })

    function parseData(data) {
        try {
            if (typeof data === "object")
                return data
            data = data === "true" ? true :
                data === "false" ? false :
                data === "null" ? null : +data + "" === data ? +data : rbrace.test(data) ? avalon.parseJSON(data) : data
        } catch (e) { }
        return data
    }
    var rbrace = /(?:\{[\s\S]*\}|\[[\s\S]*\])$/,
        rvalidchars = /^[\],:{}\s]*$/,
        rvalidbraces = /(?:^|:|,)(?:\s*\[)+/g,
        rvalidescape = /\\(?:["\\\/bfnrt]|u[\da-fA-F]{4})/g,
        rvalidtokens = /"[^"\\\r\n]*"|true|false|null|-?(?:\d+\.|)\d+(?:[eE][+-]?\d+|)/g
    avalon.parseJSON = window.JSON ? JSON.parse : function (data) {
        if (typeof data === "string") {
            data = data.trim();
            if (data) {
                if (rvalidchars.test(data.replace(rvalidescape, "@")
                        .replace(rvalidtokens, "]")
                        .replace(rvalidbraces, ""))) {
                    return (new Function("return " + data))() // jshint ignore:line
                }
            }
            avalon.error("Invalid JSON: " + data)
        }
        return data
    }

    //鐢熸垚avalon.fn.scrollLeft, avalon.fn.scrollTop鏂规硶
    avalon.each({
        scrollLeft: "pageXOffset",
        scrollTop: "pageYOffset"
    }, function (method, prop) {
        avalon.fn[method] = function (val) {
            var node = this[0] || {},
                win = getWindow(node),
                top = method === "scrollTop"
            if (!arguments.length) {
                return win ? (prop in win) ? win[prop] : root[method] : node[method]
            } else {
                if (win) {
                    win.scrollTo(!top ? val : avalon(win).scrollLeft(), top ? val : avalon(win).scrollTop())
                } else {
                    node[method] = val
                }
            }
        }
    })

    function getWindow(node) {
        return node.window && node.document ? node : node.nodeType === 9 ? node.defaultView || node.parentWindow : false;
    }
    //=============================css鐩稿叧=======================
    var cssHooks = avalon.cssHooks = {}
    var prefixes = ["", "-webkit-", "-o-", "-moz-", "-ms-"]
    var cssMap = {
        "float": W3C ? "cssFloat" : "styleFloat"
    }
    avalon.cssNumber = oneObject("animationIterationCount,columnCount,order,flex,flexGrow,flexShrink,fillOpacity,fontWeight,lineHeight,opacity,orphans,widows,zIndex,zoom")

    avalon.cssName = function (name, host, camelCase) {
        if (cssMap[name]) {
            return cssMap[name]
        }
        host = host || root.style
        for (var i = 0, n = prefixes.length; i < n; i++) {
            camelCase = camelize(prefixes[i] + name)
            if (camelCase in host) {
                return (cssMap[name] = camelCase)
            }
        }
        return null
    }
    cssHooks["@:set"] = function (node, name, value) {
        try { //node.style.width = NaN;node.style.width = "xxxxxxx";node.style.width = undefine 鍦ㄦ棫寮廔E涓嬩細鎶涘紓甯�
            node.style[name] = value
        } catch (e) { }
    }
    if (window.getComputedStyle) {
        cssHooks["@:get"] = function (node, name) {
            if (!node || !node.style) {
                throw new Error("getComputedStyle瑕佹眰浼犲叆涓€涓妭鐐� " + node)
            }
            var ret, styles = getComputedStyle(node, null)
            if (styles) {
                ret = name === "filter" ? styles.getPropertyValue(name) : styles[name]
                if (ret === "") {
                    ret = node.style[name] //鍏朵粬娴忚鍣ㄩ渶瑕佹垜浠墜鍔ㄥ彇鍐呰仈鏍峰紡
                }
            }
            return ret
        }
        cssHooks["opacity:get"] = function (node) {
            var ret = cssHooks["@:get"](node, "opacity")
            return ret === "" ? "1" : ret
        }
    } else {
        var rnumnonpx = /^-?(?:\d*\.)?\d+(?!px)[^\d\s]+$/i
        var rposition = /^(top|right|bottom|left)$/
        var ralpha = /alpha\([^)]*\)/i
        var ie8 = !!window.XDomainRequest
        var salpha = "DXImageTransform.Microsoft.Alpha"
        var border = {
            thin: ie8 ? '1px' : '2px',
            medium: ie8 ? '3px' : '4px',
            thick: ie8 ? '5px' : '6px'
        }
        cssHooks["@:get"] = function (node, name) {
            //鍙栧緱绮剧‘鍊硷紝涓嶈繃瀹冩湁鍙兘鏄甫em,pc,mm,pt,%绛夊崟浣�
            var currentStyle = node.currentStyle
            var ret = currentStyle[name]
            if ((rnumnonpx.test(ret) && !rposition.test(ret))) {
                //鈶狅紝淇濆瓨鍘熸湁鐨剆tyle.left, runtimeStyle.left,
                var style = node.style,
                    left = style.left,
                    rsLeft = node.runtimeStyle.left
                //鈶＄敱浜庘憿澶勭殑style.left = xxx浼氬奖鍝嶅埌currentStyle.left锛�
                //鍥犳鎶婂畠currentStyle.left鏀惧埌runtimeStyle.left锛�
                //runtimeStyle.left鎷ユ湁鏈€楂樹紭鍏堢骇锛屼笉浼歴tyle.left褰卞搷
                node.runtimeStyle.left = currentStyle.left
                //鈶㈠皢绮剧‘鍊艰祴缁欏埌style.left锛岀劧鍚庨€氳繃IE鐨勫彟涓€涓鏈夊睘鎬� style.pixelLeft
                //寰楀埌鍗曚綅涓簆x鐨勭粨鏋滐紱fontSize鐨勫垎鏀http://bugs.jquery.com/ticket/760
                style.left = name === 'fontSize' ? '1em' : (ret || 0)
                ret = style.pixelLeft + "px"
                //鈶ｈ繕鍘� style.left锛宺untimeStyle.left
                style.left = left
                node.runtimeStyle.left = rsLeft
            }
            if (ret === "medium") {
                name = name.replace("Width", "Style")
                //border width 榛樿鍊间负medium锛屽嵆浣垮叾涓�0"
                if (currentStyle[name] === "none") {
                    ret = "0px"
                }
            }
            return ret === "" ? "auto" : border[ret] || ret
        }
        cssHooks["opacity:set"] = function (node, name, value) {
            var style = node.style
            var opacity = isFinite(value) && value <= 1 ? "alpha(opacity=" + value * 100 + ")" : ""
            var filter = style.filter || "";
            style.zoom = 1
            //涓嶈兘浣跨敤浠ヤ笅鏂瑰紡璁剧疆閫忔槑搴�
            //node.filters.alpha.opacity = value * 100
            style.filter = (ralpha.test(filter) ?
                filter.replace(ralpha, opacity) :
                filter + " " + opacity).trim()
            if (!style.filter) {
                style.removeAttribute("filter")
            }
        }
        cssHooks["opacity:get"] = function (node) {
            //杩欐槸鏈€蹇殑鑾峰彇IE閫忔槑鍊肩殑鏂瑰紡锛屼笉闇€瑕佸姩鐢ㄦ鍒欎簡锛�
            var alpha = node.filters.alpha || node.filters[salpha],
                op = alpha && alpha.enabled ? alpha.opacity : 100
            return (op / 100) + "" //纭繚杩斿洖鐨勬槸瀛楃涓�
        }
    }

    "top,left".replace(rword, function (name) {
        cssHooks[name + ":get"] = function (node) {
            var computed = cssHooks["@:get"](node, name)
            return /px$/.test(computed) ? computed :
                avalon(node).position()[name] + "px"
        }
    })

    var cssShow = {
        position: "absolute",
        visibility: "hidden",
        display: "block"
    }

    var rdisplayswap = /^(none|table(?!-c[ea]).+)/

    function showHidden(node, array) {
        //http://www.cnblogs.com/rubylouvre/archive/2012/10/27/2742529.html
        if (node.offsetWidth <= 0) { //opera.offsetWidth鍙兘灏忎簬0
            if (rdisplayswap.test(cssHooks["@:get"](node, "display"))) {
                var obj = {
                    node: node
                }
                for (var name in cssShow) {
                    obj[name] = node.style[name]
                    node.style[name] = cssShow[name]
                }
                array.push(obj)
            }
            var parent = node.parentNode
            if (parent && parent.nodeType === 1) {
                showHidden(parent, array)
            }
        }
    }
    "Width,Height".replace(rword, function (name) { //fix 481
        var method = name.toLowerCase(),
            clientProp = "client" + name,
            scrollProp = "scroll" + name,
            offsetProp = "offset" + name
        cssHooks[method + ":get"] = function (node, which, override) {
            var boxSizing = -4
            if (typeof override === "number") {
                boxSizing = override
            }
            which = name === "Width" ? ["Left", "Right"] : ["Top", "Bottom"]
            var ret = node[offsetProp] // border-box 0
            if (boxSizing === 2) { // margin-box 2
                return ret + avalon.css(node, "margin" + which[0], true) + avalon.css(node, "margin" + which[1], true)
            }
            if (boxSizing < 0) { // padding-box  -2
                ret = ret - avalon.css(node, "border" + which[0] + "Width", true) - avalon.css(node, "border" + which[1] + "Width", true)
            }
            if (boxSizing === -4) { // content-box -4
                ret = ret - avalon.css(node, "padding" + which[0], true) - avalon.css(node, "padding" + which[1], true)
            }
            return ret
        }
        cssHooks[method + "&get"] = function (node) {
            var hidden = [];
            showHidden(node, hidden);
            var val = cssHooks[method + ":get"](node)
            for (var i = 0, obj; obj = hidden[i++];) {
                node = obj.node
                for (var n in obj) {
                    if (typeof obj[n] === "string") {
                        node.style[n] = obj[n]
                    }
                }
            }
            return val;
        }
        avalon.fn[method] = function (value) { //浼氬拷瑙嗗叾display
            var node = this[0]
            if (arguments.length === 0) {
                if (node.setTimeout) { //鍙栧緱绐楀彛灏哄
                    return node["inner" + name] ||
                           node.document.documentElement[clientProp] ||
                           node.document.body[clientProp] //IE6涓嬪墠涓や釜鍒嗗埆涓簎ndefined,0
                }
                if (node.nodeType === 9) { //鍙栧緱椤甸潰灏哄
                    var doc = node.documentElement
                    //FF chrome    html.scrollHeight< body.scrollHeight
                    //IE 鏍囧噯妯″紡 : html.scrollHeight> body.scrollHeight
                    //IE 鎬紓妯″紡 : html.scrollHeight 鏈€澶х瓑浜庡彲瑙嗙獥鍙ｅ涓€鐐癸紵
                    return Math.max(node.body[scrollProp], doc[scrollProp], node.body[offsetProp], doc[offsetProp], doc[clientProp])
                }
                return cssHooks[method + "&get"](node)
            } else {
                return this.css(method, value)
            }
        }
        avalon.fn["inner" + name] = function () {
            return cssHooks[method + ":get"](this[0], void 0, -2)
        }
        avalon.fn["outer" + name] = function (includeMargin) {
            return cssHooks[method + ":get"](this[0], void 0, includeMargin === true ? 2 : 0)
        }
    })
    avalon.fn.offset = function () { //鍙栧緱璺濈椤甸潰宸﹀彸瑙掔殑鍧愭爣
        var node = this[0],
            box = {
                left: 0,
                top: 0
            }
        if (!node || !node.tagName || !node.ownerDocument) {
            return box
        }
        var doc = node.ownerDocument,
            body = doc.body,
            root = doc.documentElement,
            win = doc.defaultView || doc.parentWindow
        if (!avalon.contains(root, node)) {
            return box
        }
        //http://hkom.blog1.fc2.com/?mode=m&no=750 body鐨勫亸绉婚噺鏄笉鍖呭惈margin鐨�
        //鎴戜滑鍙互閫氳繃getBoundingClientRect鏉ヨ幏寰楀厓绱犵浉瀵逛簬client鐨剅ect.
        //http://msdn.microsoft.com/en-us/library/ms536433.aspx
        if (node.getBoundingClientRect) {
            box = node.getBoundingClientRect() // BlackBerry 5, iOS 3 (original iPhone)
        }
        //chrome/IE6: body.scrollTop, firefox/other: root.scrollTop
        var clientTop = root.clientTop || body.clientTop,
            clientLeft = root.clientLeft || body.clientLeft,
            scrollTop = Math.max(win.pageYOffset || 0, root.scrollTop, body.scrollTop),
            scrollLeft = Math.max(win.pageXOffset || 0, root.scrollLeft, body.scrollLeft)
        // 鎶婃粴鍔ㄨ窛绂诲姞鍒發eft,top涓幓銆�
        // IE涓€浜涚増鏈腑浼氳嚜鍔ㄤ负HTML鍏冪礌鍔犱笂2px鐨刡order锛屾垜浠渶瑕佸幓鎺夊畠
        // http://msdn.microsoft.com/en-us/library/ms533564(VS.85).aspx
        return {
            top: box.top + scrollTop - clientTop,
            left: box.left + scrollLeft - clientLeft
        }
    }

    //==================================val鐩稿叧============================

    function getValType(elem) {
        var ret = elem.tagName.toLowerCase()
        return ret === "input" && /checkbox|radio/.test(elem.type) ? "checked" : ret
    }
    var roption = /^<option(?:\s+\w+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+))?)*\s+value[\s=]/i
    var valHooks = {
        "option:get": IEVersion ? function (node) {
            //鍦↖E11鍙奧3C锛屽鏋滄病鏈夋寚瀹歷alue锛岄偅涔坣ode.value榛樿涓簄ode.text锛堝瓨鍦╰rim浣滐級锛屼絾IE9-10鍒欐槸鍙杋nnerHTML(娌rim鎿嶄綔)
            //specified骞朵笉鍙潬锛屽洜姝ら€氳繃鍒嗘瀽outerHTML鍒ゅ畾鐢ㄦ埛鏈夋病鏈夋樉绀哄畾涔塿alue
            return roption.test(node.outerHTML) ? node.value : node.text.trim()
        } : function (node) {
            return node.value
        },
        "select:get": function (node, value) {
            var option, options = node.options,
                index = node.selectedIndex,
                getter = valHooks["option:get"],
                one = node.type === "select-one" || index < 0,
                values = one ? null : [],
                max = one ? index + 1 : options.length,
                i = index < 0 ? max : one ? index : 0
            for (; i < max; i++) {
                option = options[i]
                //鏃у紡IE鍦╮eset鍚庝笉浼氭敼鍙榮elected锛岄渶瑕佹敼鐢╥ === index鍒ゅ畾
                //鎴戜滑杩囨护鎵€鏈塪isabled鐨刼ption鍏冪礌锛屼絾鍦╯afari5涓嬶紝濡傛灉璁剧疆select涓篸isable锛岄偅涔堝叾鎵€鏈夊瀛愰兘disable
                //鍥犳褰撲竴涓厓绱犱负disable锛岄渶瑕佹娴嬪叾鏄惁鏄惧紡璁剧疆浜哾isable鍙婂叾鐖惰妭鐐圭殑disable鎯呭喌
                if ((option.selected || i === index) && !option.disabled) {
                    value = getter(option)
                    if (one) {
                        return value
                    }
                    //鏀堕泦鎵€鏈塻elected鍊肩粍鎴愭暟缁勮繑鍥�
                    values.push(value)
                }
            }
            return values
        },
        "select:set": function (node, values, optionSet) {
            values = [].concat(values) //寮哄埗杞崲涓烘暟缁�
            var getter = valHooks["option:get"]
            for (var i = 0, el; el = node.options[i++];) {
                if ((el.selected = values.indexOf(getter(el)) > -1)) {
                    optionSet = true
                }
            }
            if (!optionSet) {
                node.selectedIndex = -1
            }
        }
    }

    var keyMap = {}
    var keys = ["break,case,catch,continue,debugger,default,delete,do,else,false",
        "finally,for,function,if,in,instanceof,new,null,return,switch,this",
        "throw,true,try,typeof,var,void,while,with", /* 鍏抽敭瀛�*/
        "abstract,boolean,byte,char,class,const,double,enum,export,extends",
        "final,float,goto,implements,import,int,interface,long,native",
        "package,private,protected,public,short,static,super,synchronized",
        "throws,transient,volatile", /*淇濈暀瀛�*/
        "arguments,let,yield,undefined"].join(",")
    keys.replace(/\w+/g, function (a) {
        keyMap[a] = true
    })
    var ridentStart = /[a-z_$]/i
    var rwhiteSpace = /[\s\uFEFF\xA0]/
    function getIdent(input, lastIndex) {
        var result = []
        var subroutine = !!lastIndex
        lastIndex = lastIndex || 0

        //灏嗚〃杈惧紡涓殑鏍囪瘑绗︽娊鍙栧嚭鏉�
        var state = "unknown"
        var variable = ""
        for (var i = 0; i < input.length; i++) {
            var c = input.charAt(i)
            if (c === "'" || c === '"') {//瀛楃涓插紑濮�
                if (state === "unknown") {
                    state = c
                } else if (state === c) {//瀛楃涓茬粨鏉�
                    state = "unknown"
                }
            } else if (c === "\\") {
                if (state === "'" || state === '"') {
                    i++
                }
            } else if (ridentStart.test(c)) {//纰板埌鏍囪瘑绗�
                if (state === "unknown") {
                    state = "variable"
                    variable = c
                } else if (state === "maybePath") {
                    variable = result.pop()
                    variable += "." + c
                    state = "variable"
                } else if (state === "variable") {
                    variable += c
                }
            } else if (/\w/.test(c)) {
                if (state === "variable") {
                    variable += c
                }
            } else if (c === ".") {
                if (state === "variable") {
                    if (variable) {
                        result.push(variable)
                        variable = ""
                        state = "maybePath"
                    }
                }
            } else if (c === "[") {
                if (state === "variable" || state === "maybePath") {
                    if (variable) {//濡傛灉鍓嶉潰瀛樺湪鍙橀噺,鏀堕泦瀹�
                        result.push(variable)
                        variable = ""
                    }
                    var lastLength = result.length
                    var last = result[lastLength - 1]
                    var innerResult = getIdent(input.slice(i), i)
                    if (innerResult.length) {//濡傛灉鎷彿涓瓨鍦ㄥ彉閲�,閭ｄ箞杩欓噷娣诲姞閫氶厤绗�
                        result[lastLength - 1] = last + ".*"
                        result = innerResult.concat(result)
                    } else { //濡傛灉鎷彿涓殑涓滆タ鏄‘瀹氱殑,鐩存帴杞崲涓哄叾瀛愬睘鎬�
                        var content = input.slice(i + 1, innerResult.i)
                        try {
                            var text = (scpCompile(["return " + content]))()
                            result[lastLength - 1] = last + "." + text
                        } catch (e) {
                        }
                    }
                    state = "maybePath"//]鍚庨潰鍙兘杩樻帴涓滆タ
                    i = innerResult.i
                }
            } else if (c === "]") {
                if (subroutine) {
                    result.i = i + lastIndex
                    addVar(result, variable)
                    return result
                }
            } else if (rwhiteSpace.test(c) && c !== "\r" && c !== "\n") {
                if (state === "variable") {
                    if (addVar(result, variable)) {
                        state = "maybePath" // aaa . bbb 杩欐牱鐨勬儏鍐�
                    }
                    variable = ""
                }
            } else {
                addVar(result, variable)
                state = "unknown"
                variable = ""
            }
        }
        addVar(result, variable)
        return result
    }
    function addVar(array, element) {
        if (element && !keyMap[element]) {
            array.push(element)
            return true
        }
    }
    function addAssign(vars, vmodel, name, binding) {
        var ret = [],
                prefix = " = " + name + "."
        for (var i = vars.length, prop; prop = vars[--i];) {
            var arr = prop.split("."), a
            var first = arr[0]
            while (a = arr.shift()) {
                if (vmodel.hasOwnProperty(a)) {
                    ret.push(first + prefix + first)

                    binding.observers.push({
                        v: vmodel,
                        p: prop
                    })

                    vars.splice(i, 1)
                }
            }
        }
        return ret
    }
    var rproxy = /(\$proxy\$[a-z]+)\d+$/
    var variablePool = new Cache(218)
    //缂撳瓨姹傚€煎嚱鏁帮紝浠ヤ究澶氭鍒╃敤
    var evaluatorPool = new Cache(128)

    function getVars(expr) {
        expr = expr.trim()
        var ret = variablePool.get(expr)
        if (ret) {
            return ret.concat()
        }
        var array = getIdent(expr)
        var uniq = {}
        var result = []
        for (var i = 0, el; el = array[i++];) {
            if (!uniq[el]) {
                uniq[el] = 1
                result.push(el)
            }
        }
        return variablePool.put(expr, result).concat()
    }

    function parseExpr(expr, vmodels, binding) {
        var filters = binding.filters
        if (typeof filters === "string" && filters.trim() && !binding._filters) {
            binding._filters = parseFilter(filters.trim())
        }

        var vars = getVars(expr)

        var expose = new Date() - 0
        var assigns = []
        var names = []
        var args = []
        binding.observers = []
        for (var i = 0, sn = vmodels.length; i < sn; i++) {
            if (vars.length) {
                var name = "vm" + expose + "_" + i
                names.push(name)
                args.push(vmodels[i])
                assigns.push.apply(assigns, addAssign(vars, vmodels[i], name, binding))
            }
        }
        binding.args = args
        var dataType = binding.type
        var exprId = vmodels.map(function (el) {
            return String(el.$id).replace(rproxy, "$1")
        }) + expr + dataType
        var getter = evaluatorPool.get(exprId) //鐩存帴浠庣紦瀛橈紝鍏嶅緱閲嶅鐢熸垚
        if (getter) {
            if (dataType === "duplex") {
                var setter = evaluatorPool.get(exprId + "setter")
                binding.setter = setter.apply(setter, binding.args)
            }
            return binding.getter = getter
        }

        if (!assigns.length) {
            assigns.push("fix" + expose)
        }

        if (dataType === "duplex") {
            var nameOne = {}
            assigns.forEach(function (a) {
                var arr = a.split("=")
                nameOne[arr[0].trim()] = arr[1].trim()
            })
            expr = expr.replace(/[\$\w]+/, function (a) {
                return nameOne[a] ? nameOne[a] : a
            })
            /* jshint ignore:start */
            var fn2 = scpCompile(names.concat("'use strict';" +
                    "return function(vvv){" + expr + " = vvv\n}\n"))
            /* jshint ignore:end */
            evaluatorPool.put(exprId + "setter", fn2)
            binding.setter = fn2.apply(fn2, binding.args)
        }

        if (dataType === "on") { //浜嬩欢缁戝畾
            if (expr.indexOf("(") === -1) {
                expr += ".call(this, $event)"
            } else {
                expr = expr.replace("(", ".call(this,")
            }
            names.push("$event")
            expr = "\nreturn " + expr + ";" //IE鍏ㄥ Function("return ")鍑洪敊锛岄渶瑕丗unction("return ;")
            var lastIndex = expr.lastIndexOf("\nreturn")
            var header = expr.slice(0, lastIndex)
            var footer = expr.slice(lastIndex)
            expr = header + "\n" + footer
        } else {
            expr = "\nreturn " + expr + ";" //IE鍏ㄥ Function("return ")鍑洪敊锛岄渶瑕丗unction("return ;")
        }
        /* jshint ignore:start */
        getter = scpCompile(names.concat("'use strict';\nvar " +
                assigns.join(",\n") + expr))
        /* jshint ignore:end */

        return evaluatorPool.put(exprId, getter)

    }
    //========

    function normalizeExpr(code) {
        var hasExpr = rexpr.test(code) //姣斿ms-class="width{{w}}"鐨勬儏鍐�
        if (hasExpr) {
            var array = scanExpr(code)
            if (array.length === 1) {
                return array[0].expr
            }
            return array.map(function (el) {
                return el.type ? "(" + el.expr + ")" : quote(el.expr)
            }).join(" + ")
        } else {
            return code
        }
    }

    avalon.normalizeExpr = normalizeExpr
    avalon.parseExprProxy = parseExpr

    var rthimRightParentheses = /\)\s*$/
    var rthimOtherParentheses = /\)\s*\|/g
    var rquoteFilterName = /\|\s*([$\w]+)/g
    var rpatchBracket = /"\s*\["/g
    var rthimLeftParentheses = /"\s*\(/g
    function parseFilter(filters) {
        filters = filters
                .replace(rthimRightParentheses, "")//澶勭悊鏈€鍚庣殑灏忔嫭鍙�
                .replace(rthimOtherParentheses, function () {//澶勭悊鍏朵粬灏忔嫭鍙�
                    return "],|"
                })
                .replace(rquoteFilterName, function (a, b) { //澶勭悊|鍙婂畠鍚庨潰鐨勮繃婊ゅ櫒鐨勫悕瀛�
                    return "[" + quote(b)
                })
                .replace(rpatchBracket, function () {
                    return '"],["'
                })
                .replace(rthimLeftParentheses, function () {
                    return '",'
                }) + "]"
        /* jshint ignore:start */
        return scpCompile(["return [" + filters + "]"])()
        /* jshint ignore:end */

    }
    /*********************************************************************
     *                          缂栬瘧绯荤粺                                  *
     **********************************************************************/
    var meta = {
        '\b': '\\b',
        '\t': '\\t',
        '\n': '\\n',
        '\f': '\\f',
        '\r': '\\r',
        '"': '\\"',
        '\\': '\\\\'
    }
    var quote = window.JSON && JSON.stringify || function (str) {
        return '"' + str.replace(/[\\\"\x00-\x1f]/g, function (a) {
            var c = meta[a];
            return typeof c === 'string' ? c :
                    '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
        }) + '"'
    }
    /*********************************************************************
     *                           鎵弿绯荤粺                                 *
     **********************************************************************/

    avalon.scan = function (elem, vmodel) {
        elem = elem || root
        var vmodels = vmodel ? [].concat(vmodel) : []
        scanTag(elem, vmodels)
    }

    //http://www.w3.org/TR/html5/syntax.html#void-elements
    var stopScan = oneObject("area,base,basefont,br,col,command,embed,hr,img,input,link,meta,param,source,track,wbr,noscript,script,style,textarea".toUpperCase())

    function checkScan(elem, callback, innerHTML) {
        var id = setTimeout(function () {
            var currHTML = elem.innerHTML
            clearTimeout(id)
            if (currHTML === innerHTML) {
                callback()
            } else {
                checkScan(elem, callback, currHTML)
            }
        })
    }


    function createSignalTower(elem, vmodel) {
        var id = elem.getAttribute("avalonctrl") || vmodel.$id
        elem.setAttribute("avalonctrl", id)
        if (vmodel.$events) {
            vmodel.$events.expr = elem.tagName + '[avalonctrl="' + id + '"]'
        }
    }

    var getBindingCallback = function (elem, name, vmodels) {
        var callback = elem.getAttribute(name)
        if (callback) {
            for (var i = 0, vm; vm = vmodels[i++];) {
                if (vm.hasOwnProperty(callback) && typeof vm[callback] === "function") {
                    return vm[callback]
                }
            }
        }
    }

    function executeBindings(bindings, vmodels) {
        for (var i = 0, binding; binding = bindings[i++];) {
            binding.vmodels = vmodels
            directives[binding.type].init(binding)

            avalon.injectBinding(binding)
            if (binding.getter && binding.element.nodeType === 1) { //绉婚櫎鏁版嵁缁戝畾锛岄槻姝㈣浜屾瑙ｆ瀽
                //chrome浣跨敤removeAttributeNode绉婚櫎涓嶅瓨鍦ㄧ殑鐗规€ц妭鐐规椂浼氭姤閿� https://github.com/RubyLouvre/avalon/issues/99
                binding.element.removeAttribute(binding.name)
            }
        }
        bindings.length = 0
    }

    //https://github.com/RubyLouvre/avalon/issues/636
    var mergeTextNodes = IEVersion && window.MutationObserver ? function (elem) {
        var node = elem.firstChild, text
        while (node) {
            var aaa = node.nextSibling
            if (node.nodeType === 3) {
                if (text) {
                    text.nodeValue += node.nodeValue
                    elem.removeChild(node)
                } else {
                    text = node
                }
            } else {
                text = null
            }
            node = aaa
        }
    } : 0
    var roneTime = /^\s*::/
    var rmsAttr = /ms-(\w+)-?(.*)/

    var events = oneObject("animationend,blur,change,input,click,dblclick,focus,keydown,keypress,keyup,mousedown,mouseenter,mouseleave,mousemove,mouseout,mouseover,mouseup,scan,scroll,submit")
    var obsoleteAttrs = oneObject("value,title,alt,checked,selected,disabled,readonly,enabled,href,src")
    function bindingSorter(a, b) {
        return a.priority - b.priority
    }


    var rnoCollect = /^(ms-\S+|data-\S+|on[a-z]+|id|style|class)$/
    var ronattr = /^on\-[\w-]+$/
    function getOptionsFromTag(elem, vmodels) {
        var attributes = elem.attributes
        var ret = {}
        for (var i = 0, attr; attr = attributes[i++];) {
            var name = attr.name
            if (attr.specified && !rnoCollect.test(name)) {
                var camelizeName = camelize(attr.name)
                if (/^on\-[\w-]+$/.test(name)) {
                    ret[camelizeName] = getBindingCallback(elem, name, vmodels)
                } else {
                    ret[camelizeName] = parseData(attr.value)
                }
            }

        }
        return ret
    }
    function scanAttr(elem, vmodels, match) {
        var scanNode = true
        if (vmodels.length) {
            var attributes = getAttributes ? getAttributes(elem) : elem.attributes
            var bindings = []
            var uniq = {}
            for (var i = 0, attr; attr = attributes[i++];) {
                var name = attr.name
                if (uniq[name]) {//IE8涓媘s-repeat,ms-with BUG
                    continue
                }
                uniq[name] = 1
                if (attr.specified) {
                    if (match = name.match(rmsAttr)) {
                        //濡傛灉鏄互鎸囧畾鍓嶇紑鍛藉悕鐨�
                        var type = match[1]
                        var param = match[2] || ""
                        var value = attr.value
                        if (events[type]) {
                            param = type
                            type = "on"
                        } else if (obsoleteAttrs[type]) {
                            param = type
                            type = "attr"
                            name = "ms-" + type + "-" + param
                            log("warning!璇锋敼鐢�" + name + "浠ｆ浛" + attr.name + "!")
                        }
                        if (directives[type]) {
                            var newValue = value.replace(roneTime, "")
                            var oneTime = value !== newValue
                            var binding = {
                                type: type,
                                param: param,
                                element: elem,
                                name: name,
                                expr: newValue,
                                oneTime: oneTime,
                                uniqueNumber: attr.name + "-" + getUid(elem),
                                //chrome涓巉irefox涓婲umber(param)寰楀埌鐨勫€间笉涓€鏍� #855
                                priority: (directives[type].priority || type.charCodeAt(0) * 10) + (Number(param.replace(/\D/g, "")) || 0)
                            }
                            if (type === "html" || type === "text") {

                                var filters = getToken(value).filters
                                binding.expr = binding.expr.replace(filters, "")

                                binding.filters = filters.replace(rhasHtml, function () {
                                    binding.type = "html"
                                    binding.group = 1
                                    return ""
                                }).trim() // jshint ignore:line
                            } else if (type === "duplex") {
                                var hasDuplex = name
                            } else if (name === "ms-if-loop") {
                                binding.priority += 100
                            } else if (name === "ms-attr-value") {
                                var hasAttrValue = name
                            }
                            bindings.push(binding)
                        }
                    }
                }
            }
            if (bindings.length) {
                bindings.sort(bindingSorter)
                //http://bugs.jquery.com/ticket/7071
                //鍦↖E涓嬪VML璇诲彇type灞炴€�,浼氳姝ゅ厓绱犳墍鏈夊睘鎬ч兘鍙樻垚<Failed>
                if (hasDuplex && hasAttrValue && elem.nodeName === "INPUT" && elem.type === "text") {
                    log("warning!涓€涓帶浠朵笉鑳藉悓鏃跺畾涔塵s-attr-value涓�" + hasDuplex)
                }
                for (i = 0; binding = bindings[i]; i++) {
                    type = binding.type
                    if (rnoscanAttrBinding.test(type)) {
                        return executeBindings(bindings.slice(0, i + 1), vmodels)
                    } else if (scanNode) {
                        scanNode = !rnoscanNodeBinding.test(type)
                    }
                }

                executeBindings(bindings, vmodels)
            }
        }
        if (scanNode && !stopScan[elem.tagName] && (isWidget(elem) ? elem.msResolved : 1)) {
            mergeTextNodes && mergeTextNodes(elem)
            scanNodeList(elem, vmodels) //鎵弿瀛愬瓩鍏冪礌

        }
    }
    var rnoscanAttrBinding = /^if|widget|repeat$/
    var rnoscanNodeBinding = /^each|with|html|include$/
    //IE67涓嬶紝鍦ㄥ惊鐜粦瀹氫腑锛屼竴涓妭鐐瑰鏋滄槸閫氳繃cloneNode寰楀埌锛岃嚜瀹氫箟灞炴€х殑specified涓篺alse锛屾棤娉曡繘鍏ラ噷闈㈢殑鍒嗘敮锛�
    //浣嗗鏋滄垜浠幓鎺塻canAttr涓殑attr.specified妫€娴嬶紝涓€涓厓绱犱細鏈�80+涓壒鎬ц妭鐐癸紙鍥犱负瀹冧笉鍖哄垎鍥烘湁灞炴€т笌鑷畾涔夊睘鎬э級锛屽緢瀹规槗鍗℃椤甸潰
    if (!W3C) {
        var attrPool = new Cache(512)
        var rattrs = /\s+([^=\s]+)(?:=("[^"]*"|'[^']*'|[^\s>]+))?/g,
                rquote = /^['"]/,
                rtag = /<\w+\b(?:(["'])[^"]*?(\1)|[^>])*>/i,
                ramp = /&amp;/g
        //IE6-8瑙ｆ瀽HTML5鏂版爣绛撅紝浼氬皢瀹冨垎瑙ｄ袱涓厓绱犺妭鐐逛笌涓€涓枃鏈妭鐐�
        //<body><section>ddd</section></body>
        //        window.onload = function() {
        //            var body = document.body
        //            for (var i = 0, el; el = body.children[i++]; ) {
        //                avalon.log(el.outerHTML)
        //            }
        //        }
        //渚濇杈撳嚭<SECTION>, </SECTION>
        var getAttributes = function (elem) {
            var html = elem.outerHTML
            //澶勭悊IE6-8瑙ｆ瀽HTML5鏂版爣绛剧殑鎯呭喌锛屽強<br>绛夊崐闂悎鏍囩outerHTML涓虹┖鐨勬儏鍐�
            if (html.slice(0, 2) === "</" || !html.trim()) {
                return []
            }
            var str = html.match(rtag)[0]
            var attributes = [],
                    k, v
            var ret = attrPool.get(str)
            if (ret) {
                return ret
            }
            while (k = rattrs.exec(str)) {
                v = k[2]
                if (v) {
                    v = (rquote.test(v) ? v.slice(1, -1) : v).replace(ramp, "&")
                }
                var name = k[1].toLowerCase()
                match = name.match(rmsAttr)
                var binding = {
                    name: name,
                    specified: true,
                    value: v || ""
                }
                attributes.push(binding)
            }
            return attrPool.put(str, attributes)
        }
    }


    function scanNodeList(parent, vmodels) {
        var nodes = avalon.slice(parent.childNodes)
        scanNodeArray(nodes, vmodels)
    }


    function scanNodeArray(nodes, vmodels) {
        for (var i = 0, node; node = nodes[i++];) {
            switch (node.nodeType) {
                case 1:
                    var elem = node
                    if (!elem.msResolved && elem.parentNode && elem.parentNode.nodeType === 1) {
                        var library = isWidget(elem)
                        if (library) {
                            var widget = elem.localName ? elem.localName.replace(library + ":", "") : elem.nodeName
                            var fullName = library + ":" + camelize(widget)
                            componentQueue.push({
                                library: library,
                                element: elem,
                                fullName: fullName,
                                widget: widget,
                                vmodels: vmodels,
                                name: "widget"
                            })
                            if (avalon.components[fullName]) {
                                (function (name) {//纭繚鎵€鏈塵s-attr-name鎵弿瀹屽啀澶勭悊
                                    setTimeout(function () {
                                        avalon.component(name)
                                    })
                                })(fullName)
                            }
                        }
                    }

                    scanTag(node, vmodels) //鎵弿鍏冪礌鑺傜偣

                    if (node.msHasEvent) {
                        avalon.fireDom(node, "datasetchanged", {
                            bubble: node.msHasEvent
                        })
                    }

                    break
                case 3:
                    if (rexpr.test(node.nodeValue)) {
                        scanText(node, vmodels, i) //鎵弿鏂囨湰鑺傜偣
                    }
                    break
            }

        }
    }


    function scanTag(elem, vmodels, node) {
        //鎵弿椤哄簭  ms-skip(0) --> ms-important(1) --> ms-controller(2) --> ms-if(10) --> ms-repeat(100)
        //--> ms-if-loop(110) --> ms-attr(970) ...--> ms-each(1400)-->ms-with(1500)--銆塵s-duplex(2000)鍨悗
        var a = elem.getAttribute("ms-skip")
        //#360 鍦ㄦ棫寮廔E涓� Object鏍囩鍦ㄥ紩鍏lash绛夎祫婧愭椂,鍙兘鍑虹幇娌℃湁getAttributeNode,innerHTML鐨勬儏褰�
        if (!elem.getAttributeNode) {
            return log("warning " + elem.tagName + " no getAttributeNode method")
        }
        var b = elem.getAttributeNode("ms-important")
        var c = elem.getAttributeNode("ms-controller")
        if (typeof a === "string") {
            return
        } else if (node = b || c) {
            var newVmodel = avalon.vmodels[node.value]
            if (!newVmodel) {
                return
            }
            //ms-important涓嶅寘鍚埗VM锛宮s-controller鐩稿弽
            vmodels = node === b ? [newVmodel] : [newVmodel].concat(vmodels)
            var name = node.name
            elem.removeAttribute(name) //removeAttributeNode涓嶄細鍒锋柊[ms-controller]鏍峰紡瑙勫垯
            avalon(elem).removeClass(name)
            createSignalTower(elem, newVmodel)
        }

        scanAttr(elem, vmodels) //鎵弿鐗规€ц妭鐐�
    }



    var rhasHtml = /\|\s*html(?:\b|$)/,
        r11a = /\|\|/g,
        rlt = /&lt;/g,
        rgt = /&gt;/g,
        rstringLiteral = /(['"])(\\\1|.)+?\1/g

    function getToken(value) {
        if (value.indexOf("|") > 0) {
            var scapegoat = value.replace(rstringLiteral, function (_) {
                return Array(_.length + 1).join("1") // jshint ignore:line
            })
            var index = scapegoat.replace(r11a, "\u1122\u3344").indexOf("|") //骞叉帀鎵€鏈夌煭璺垨
            if (index > -1) {
                return {
                    type: "text",
                    filters: value.slice(index).trim(),
                    expr: value.slice(0, index)
                }
            }
        }
        return {
            type: "text",
            expr: value,
            filters: ""
        }
    }

    function scanExpr(str) {
        var tokens = [],
            value, start = 0,
            stop
        do {
            stop = str.indexOf(openTag, start)
            if (stop === -1) {
                break
            }
            value = str.slice(start, stop)
            if (value) { // {{ 宸﹁竟鐨勬枃鏈�
                tokens.push({
                    expr: value
                })
            }
            start = stop + openTag.length
            stop = str.indexOf(closeTag, start)
            if (stop === -1) {
                break
            }
            value = str.slice(start, stop)
            if (value) { //澶勭悊{{ }}鎻掑€艰〃杈惧紡
                tokens.push(getToken(value, start))
            }
            start = stop + closeTag.length
        } while (1)
        value = str.slice(start)
        if (value) { //}} 鍙宠竟鐨勬枃鏈�
            tokens.push({
                expr: value
            })
        }
        return tokens
    }

    function scanText(textNode, vmodels, index) {
        var bindings = [],
        tokens = scanExpr(textNode.data)
        if (tokens.length) {
            for (var i = 0, token; token = tokens[i++];) {
                var node = DOC.createTextNode(token.expr) //灏嗘枃鏈浆鎹负鏂囨湰鑺傜偣锛屽苟鏇挎崲鍘熸潵鐨勬枃鏈妭鐐�
                if (token.type) {
                    token.expr = token.expr.replace(roneTime, function () {
                        token.oneTime = true
                        return ""
                    }) // jshint ignore:line
                    token.element = node
                    token.filters = token.filters.replace(rhasHtml, function () {
                        token.type = "html"
                        return ""
                    }) // jshint ignore:line
                    token.pos = index * 1000 + i
                    bindings.push(token) //鏀堕泦甯︽湁鎻掑€艰〃杈惧紡鐨勬枃鏈�
                }
                avalonFragment.appendChild(node)
            }
            textNode.parentNode.replaceChild(avalonFragment, textNode)
            if (bindings.length)
                executeBindings(bindings, vmodels)
        }
    }



    //浣跨敤鏉ヨ嚜娓告垙鐣岀殑鍙岀紦鍐叉妧鏈�,鍑忓皯瀵硅鍥剧殑鍐椾綑鍒锋柊
    var Buffer = function () {
        this.queue = []
    }
    Buffer.prototype = {
        render: function (isAnimate) {
            if (!this.locked) {
                this.locked = isAnimate ? root.offsetHeight + 10 : 1
                var me = this
                avalon.nextTick(function () {
                    me.flush()
                })
            }
        },
        flush: function () {
            for (var i = 0, sub; sub = this.queue[i++];) {
                sub.update && sub.update()
            }
            this.locked = 0
            this.queue = []
        }
    }

    var buffer = new Buffer()
    var componentQueue = []
    var widgetList = []
    var componentHooks = {
        $construct: function () {
            return avalon.mix.apply(null, arguments)
        },
        $ready: noop,
        $init: noop,
        $dispose: noop,
        $container: null,
        $childReady: noop,
        $replace: false,
        $extend: null,
        $$template: function (str) {
            return str
        }
    }


    avalon.components = {}
    avalon.component = function (name, opts) {
        if (opts) {
            avalon.components[name] = avalon.mix({}, componentHooks, opts)
        }
        for (var i = 0, obj; obj = componentQueue[i]; i++) {
            if (name === obj.fullName) {
                componentQueue.splice(i, 1)
                i--;

                (function (host, hooks, elem, widget) {

                    var dependencies = 1
                    var library = host.library
                    var global = avalon.libraries[library] || componentHooks

                    //===========鏀堕泦鍚勭閰嶇疆=======

                    var elemOpts = getOptionsFromTag(elem, host.vmodels)
                    var vmOpts = getOptionsFromVM(host.vmodels, elemOpts.config || host.widget)
                    var $id = elemOpts.$id || elemOpts.identifier || generateID(widget)
                    delete elemOpts.config
                    delete elemOpts.$id
                    delete elemOpts.identifier
                    var componentDefinition = {}

                    var parentHooks = avalon.components[hooks.$extend]
                    if (parentHooks) {
                        avalon.mix(true, componentDefinition, parentHooks)
                        componentDefinition = parentHooks.$construct.call(elem, componentDefinition, {}, {})
                    } else {
                        avalon.mix(true, componentDefinition, hooks)
                    }
                    componentDefinition = avalon.components[name].$construct.call(elem, componentDefinition, vmOpts, elemOpts)

                    componentDefinition.$refs = {}
                    componentDefinition.$id = $id

                    //==========鏋勫缓VM=========
                    var keepSlot = componentDefinition.$slot
                    var keepReplace = componentDefinition.$replace
                    var keepContainer = componentDefinition.$container
                    var keepTemplate = componentDefinition.$template
                    delete componentDefinition.$slot
                    delete componentDefinition.$replace
                    delete componentDefinition.$container
                    delete componentDefinition.$construct

                    var vmodel = avalon.define(componentDefinition) || {}
                    elem.msResolved = 1
                    vmodel.$init(vmodel, elem)
                    global.$init(vmodel, elem)
                    var nodes = elem.childNodes
                    //鏀堕泦鎻掑叆鐐�
                    var slots = {}, snode
                    for (var s = 0, el; el = nodes[s++];) {
                        var type = el.nodeType === 1 && el.getAttribute("slot") || keepSlot
                        if (type) {
                            if (slots[type]) {
                                slots[type].push(el)
                            } else {
                                slots[type] = [el]
                            }
                        }
                    }


                    if (vmodel.$$template) {
                        avalon.clearHTML(elem)
                        elem.innerHTML = vmodel.$$template(keepTemplate)
                    }
                    for (s in slots) {
                        if (vmodel.hasOwnProperty(s)) {
                            var ss = slots[s]
                            if (ss.length) {
                                var fragment = avalonFragment.cloneNode(true)
                                for (var ns = 0; snode = ss[ns++];) {
                                    fragment.appendChild(snode)
                                }
                                vmodel[s] = fragment
                            }
                            slots[s] = null
                        }
                    }
                    slots = null
                    var child = elem.children[0] || elem.firstChild
                    if (keepReplace) {
                        elem.parentNode.replaceChild(child, elem)
                        child.msResolved = 1
                        var cssText = elem.style.cssText
                        var className = elem.className
                        elem = host.element = child
                        elem.style.cssText = cssText
                        if (className) {
                            avalon(elem).addClass(className)
                        }
                    }
                    if (keepContainer) {
                        keepContainer.appendChild(elem)
                    }
                    avalon.fireDom(elem, "datasetchanged",
                            { library: library, vm: vmodel, childReady: 1 })
                    var children = 0
                    var removeFn = avalon.bind(elem, "datasetchanged", function (e) {
                        if (e.childReady && e.library === library) {
                            dependencies += e.childReady
                            if (vmodel !== e.vm) {
                                vmodel.$refs[e.vm.$id] = e.vm
                                if (e.childReady === -1) {
                                    children++
                                    vmodel.$childReady(vmodel, elem, e)
                                }
                                e.stopPropagation()
                            }
                        }
                        if (dependencies === 0) {
                            var id1 = setTimeout(function () {
                                clearTimeout(id1)

                                vmodel.$ready(vmodel, elem, host.vmodels)
                                global.$ready(vmodel, elem, host.vmodels)
                            }, children ? Math.max(children * 17, 100) : 17)
                            avalon.unbind(elem, "datasetchanged", removeFn)
                            //==================
                            host.rollback = function () {
                                try {
                                    vmodel.$dispose(vmodel, elem)
                                    global.$dispose(vmodel, elem)
                                } catch (e) {
                                }
                                delete avalon.vmodels[vmodel.$id]
                            }
                            injectDisposeQueue(host, widgetList)
                            if (window.chrome) {
                                elem.addEventListener("DOMNodeRemovedFromDocument", function () {
                                    setTimeout(rejectDisposeQueue)
                                })
                            }

                        }
                    })
                    scanTag(elem, [vmodel].concat(host.vmodels))

                    avalon.vmodels[vmodel.$id] = vmodel
                    if (!elem.childNodes.length) {
                        avalon.fireDom(elem, "datasetchanged", { library: library, vm: vmodel, childReady: -1 })
                    } else {
                        var id2 = setTimeout(function () {
                            clearTimeout(id2)
                            avalon.fireDom(elem, "datasetchanged", { library: library, vm: vmodel, childReady: -1 })
                        }, 17)
                    }


                })(obj, avalon.components[name], obj.element, obj.widget)// jshint ignore:line


            }
        }
    }

    avalon.fireDom = function (elem, type, opts) {
        if (DOC.createEvent) {
            var hackEvent = DOC.createEvent("Events");
            hackEvent.initEvent(type, true, true, opts)
            avalon.mix(hackEvent, opts)

            elem.dispatchEvent(hackEvent)
        } else if (root.contains(elem)) {//IE6-8瑙﹀彂浜嬩欢蹇呴』淇濊瘉鍦―OM鏍戜腑,鍚﹀垯鎶�"SCRIPT16389: 鏈寚鏄庣殑閿欒"
            hackEvent = DOC.createEventObject()
            avalon.mix(hackEvent, opts)
            elem.fireEvent("on" + type, hackEvent)
        }
    }


    function getOptionsFromVM(vmodels, pre) {
        if (pre) {
            for (var i = 0, v; v = vmodels[i++];) {
                if (v.hasOwnProperty(pre) && typeof v[pre] === "object") {
                    var vmOptions = v[pre]
                    return vmOptions.$model || vmOptions
                    break
                }
            }
        }
        return {}
    }



    avalon.libraries = []
    avalon.library = function (name, opts) {
        if (DOC.namespaces) {
            DOC.namespaces.add(name, 'http://www.w3.org/1999/xhtml');
        }
        avalon.libraries[name] = avalon.mix({
            $init: noop,
            $ready: noop,
            $dispose: noop
        }, opts || {})
    }

    avalon.library("ms")
    /*
    broswer  nodeName  scopeName  localName
    IE9     ONI:BUTTON oni        button
    IE10    ONI:BUTTON undefined  oni:button
    IE8     button     oni        undefined
    chrome  ONI:BUTTON undefined  oni:button
    
    */
    function isWidget(el) { //濡傛灉涓鸿嚜瀹氫箟鏍囩,杩斿洖UI搴撶殑鍚嶅瓧
        if (el.scopeName && el.scopeName !== "HTML") {
            return el.scopeName
        }
        var fullName = el.nodeName.toLowerCase()
        var index = fullName.indexOf(":")
        if (index > 0) {
            return fullName.slice(0, index)
        }
    }
    //鍚勭MVVM妗嗘灦鍦ㄥぇ鍨嬭〃鏍间笅鐨勬€ц兘娴嬭瘯
    // https://github.com/RubyLouvre/avalon/issues/859


    var bools = ["autofocus,autoplay,async,allowTransparency,checked,controls",
        "declare,disabled,defer,defaultChecked,defaultSelected",
        "contentEditable,isMap,loop,multiple,noHref,noResize,noShade",
        "open,readOnly,selected"
    ].join(",")
    var boolMap = {}
    bools.replace(rword, function (name) {
        boolMap[name.toLowerCase()] = name
    })

    var propMap = {//灞炴€у悕鏄犲皠
        "accept-charset": "acceptCharset",
        "char": "ch",
        "charoff": "chOff",
        "class": "className",
        "for": "htmlFor",
        "http-equiv": "httpEquiv"
    }

    var anomaly = ["accessKey,bgColor,cellPadding,cellSpacing,codeBase,codeType,colSpan",
        "dateTime,defaultValue,frameBorder,longDesc,maxLength,marginWidth,marginHeight",
        "rowSpan,tabIndex,useMap,vSpace,valueType,vAlign"
    ].join(",")
    anomaly.replace(rword, function (name) {
        propMap[name.toLowerCase()] = name
    })


    var attrDir = avalon.directive("attr", {
        init: function (binding) {
            //{{aaa}} --> aaa
            //{{aaa}}/bbb.html --> (aaa) + "/bbb.html"
            binding.expr = normalizeExpr(binding.expr.trim())
            if (binding.type === "include") {
                var elem = binding.element
                effectBinding(elem, binding)
                binding.includeRendered = getBindingCallback(elem, "data-include-rendered", binding.vmodels)
                binding.includeLoaded = getBindingCallback(elem, "data-include-loaded", binding.vmodels)
                var outer = binding.includeReplace = !!avalon(elem).data("includeReplace")
                if (avalon(elem).data("includeCache")) {
                    binding.templateCache = {}
                }
                binding.start = DOC.createComment("ms-include")
                binding.end = DOC.createComment("ms-include-end")
                if (outer) {
                    binding.element = binding.end
                    binding._element = elem
                    elem.parentNode.insertBefore(binding.start, elem)
                    elem.parentNode.insertBefore(binding.end, elem.nextSibling)
                } else {
                    elem.insertBefore(binding.start, elem.firstChild)
                    elem.appendChild(binding.end)
                }
            }
        },
        update: function (val) {
            var elem = this.element
            var attrName = this.param
            if (attrName === "href" || attrName === "src") {
                if (typeof val === "string" && !root.hasAttribute) {
                    val = val.replace(/&amp;/g, "&") //澶勭悊IE67鑷姩杞箟鐨勯棶棰�
                }
                elem[attrName] = val
                if (window.chrome && elem.tagName === "EMBED") {
                    var parent = elem.parentNode //#525  chrome1-37涓媏mbed鏍囩鍔ㄦ€佽缃畇rc涓嶈兘鍙戠敓璇锋眰
                    var comment = document.createComment("ms-src")
                    parent.replaceChild(comment, elem)
                    parent.replaceChild(elem, comment)
                }
            } else {

                // ms-attr-class="xxx" vm.xxx="aaa bbb ccc"灏嗗厓绱犵殑className璁剧疆涓篴aa bbb ccc
                // ms-attr-class="xxx" vm.xxx=false  娓呯┖鍏冪礌鐨勬墍鏈夌被鍚�
                // ms-attr-name="yyy"  vm.yyy="ooo" 涓哄厓绱犺缃畁ame灞炴€�
                var toRemove = (val === false) || (val === null) || (val === void 0)
                if (!W3C && propMap[attrName]) { //鏃у紡IE涓嬮渶瑕佽繘琛屽悕瀛楁槧灏�
                    attrName = propMap[attrName]
                }
                var bool = boolMap[attrName]
                if (typeof elem[bool] === "boolean") {
                    elem[bool] = !!val //甯冨皵灞炴€у繀椤讳娇鐢╡l.xxx = true|false鏂瑰紡璁惧€�
                    if (!val) { //濡傛灉涓篺alse, IE鍏ㄧ郴鍒椾笅鐩稿綋浜巗etAttribute(xxx,''),浼氬奖鍝嶅埌鏍峰紡,闇€瑕佽繘涓€姝ュ鐞�
                        toRemove = true
                    }
                }
                if (toRemove) {
                    return elem.removeAttribute(attrName)
                }
                //SVG鍙兘浣跨敤setAttribute(xxx, yyy), VML鍙兘浣跨敤elem.xxx = yyy ,HTML鐨勫浐鏈夊睘鎬у繀椤籩lem.xxx = yyy
                var isInnate = rsvg.test(elem) ? false : (DOC.namespaces && isVML(elem)) ? true : attrName in elem.cloneNode(false)
                if (isInnate) {
                    elem[attrName] = val + ""
                } else {
                    elem.setAttribute(attrName, val)
                }
            }
        }
    })



    //杩欏嚑涓寚浠ら兘鍙互浣跨敤鎻掑€艰〃杈惧紡锛屽ms-src="aaa/{{b}}/{{c}}.html"
    "title,alt,src,value,css,include,href".replace(rword, function (name) {
        directives[name] = attrDir
    })

    //鏍规嵁VM鐨勫睘鎬у€兼垨琛ㄨ揪寮忕殑鍊煎垏鎹㈢被鍚嶏紝ms-class="xxx yyy zzz:flag"
    //http://www.cnblogs.com/rubylouvre/archive/2012/12/17/2818540.html
    avalon.directive("class", {
        init: function (binding) {
            var oldStyle = binding.param
            var method = binding.type
            if (!oldStyle || isFinite(oldStyle)) {
                binding.param = "" //鍘绘帀鏁板瓧
                directives.effect.init(binding)
            } else {
                log('ms-' + method + '-xxx="yyy"杩欑鐢ㄦ硶宸茬粡杩囨椂,璇蜂娇鐢╩s-' + method + '="xxx:yyy"')
                binding.expr = '[' + quote(oldStyle) + "," + binding.expr + "]"
                binding.oldStyle = oldStyle
            }
            if (method === "hover" || method === "active") { //纭繚鍙粦瀹氫竴娆�
                if (!binding.hasBindEvent) {
                    var elem = binding.element
                    var $elem = avalon(elem)
                    var activate = "mouseenter" //鍦ㄧЩ鍑虹Щ鍏ユ椂鍒囨崲绫诲悕
                    var abandon = "mouseleave"
                    if (method === "active") { //鍦ㄨ仛鐒﹀け鐒︿腑鍒囨崲绫诲悕
                        elem.tabIndex = elem.tabIndex || -1
                        activate = "mousedown"
                        abandon = "mouseup"
                        var fn0 = $elem.bind("mouseleave", function () {
                            binding.toggleClass && $elem.removeClass(binding.newClass)
                        })
                    }
                }

                var fn1 = $elem.bind(activate, function () {
                    binding.toggleClass && $elem.addClass(binding.newClass)
                })
                var fn2 = $elem.bind(abandon, function () {
                    binding.toggleClass && $elem.removeClass(binding.newClass)
                })
                binding.rollback = function () {
                    $elem.unbind("mouseleave", fn0)
                    $elem.unbind(activate, fn1)
                    $elem.unbind(abandon, fn2)
                }
                binding.hasBindEvent = true
            }

        },
        update: function (arr) {
            var binding = this
            var $elem = avalon(this.element)
            binding.newClass = arr[0]
            binding.toggleClass = !!arr[1]
            if (binding.oldClass && binding.newClass !== binding.oldClass) {
                $elem.removeClass(binding.oldClass)
            }
            binding.oldClass = binding.newClass
            if (binding.type === "class") {
                if (binding.oldStyle) {
                    $elem.toggleClass(binding.oldStyle, !!arr[1])
                } else {
                    $elem.toggleClass(binding.newClass, binding.toggleClass)
                }
            }
        }
    })

    "hover,active".replace(rword, function (name) {
        directives[name] = directives["class"]
    })


    //ms-controller缁戝畾宸茬粡鍦╯canTag 鏂规硶涓疄鐜�
    avalon.directive("css", {
        init: directives.attr.init,
        update: function (val) {
            avalon(this.element).css(this.param, val)
        }
    })

    avalon.directive("data", {
        priority: 100,
        update: function (val) {
            var elem = this.element
            var key = "data-" + this.param
            if (val && typeof val === "object") {
                elem[key] = val
            } else {
                elem.setAttribute(key, String(val))
            }
        }
    })

    //鍙屽伐缁戝畾
    var rduplexType = /^(?:checkbox|radio)$/
    var rduplexParam = /^(?:radio|checked)$/
    var rnoduplexInput = /^(file|button|reset|submit|checkbox|radio|range)$/
    var duplexBinding = avalon.directive("duplex", {
        priority: 2000,
        init: function (binding, hasCast) {
            var elem = binding.element
            var vmodels = binding.vmodels
            binding.changed = getBindingCallback(elem, "data-duplex-changed", vmodels) || noop
            var params = []
            var casting = oneObject("string,number,boolean,checked")
            if (elem.type === "radio" && binding.param === "") {
                binding.param = "checked"
            }


            binding.param.replace(rw20g, function (name) {
                if (rduplexType.test(elem.type) && rduplexParam.test(name)) {
                    if (name === "radio")
                        log("ms-duplex-radio宸茬粡鏇村悕涓簃s-duplex-checked")
                    name = "checked"
                    binding.isChecked = true
                    binding.xtype = "radio"
                }
                if (name === "bool") {
                    name = "boolean"
                    log("ms-duplex-bool宸茬粡鏇村悕涓簃s-duplex-boolean")
                } else if (name === "text") {
                    name = "string"
                    log("ms-duplex-text宸茬粡鏇村悕涓簃s-duplex-string")
                }
                if (casting[name]) {
                    hasCast = true
                }
                avalon.Array.ensure(params, name)
            })
            if (!hasCast) {
                params.push("string")
            }
            binding.param = params.join("-")
            if (!binding.xtype) {
                binding.xtype = elem.tagName === "SELECT" ? "select" :
                        elem.type === "checkbox" ? "checkbox" :
                        elem.type === "radio" ? "radio" :
                        /^change/.test(elem.getAttribute("data-duplex-event")) ? "change" :
                        "input"
            }
            //===================缁戝畾浜嬩欢======================
            binding.bound = function (type, callback) {
                if (elem.addEventListener) {
                    elem.addEventListener(type, callback, false)
                } else {
                    elem.attachEvent("on" + type, callback)
                }
                var old = binding.rollback
                binding.rollback = function () {
                    elem.avalonSetter = null
                    avalon.unbind(elem, type, callback)
                    old && old()
                }
            }
            var composing = false
            function callback(value) {
                binding.changed.call(this, value, binding)
            }
            function compositionStart() {
                composing = true
            }
            function compositionEnd() {
                composing = false
            }
            var updateVModel = function (e) {
                var val = elem.value //闃叉閫掑綊璋冪敤褰㈡垚姝诲惊鐜�
                if (composing || val === binding.oldValue || binding.pipe === null) //澶勭悊涓枃杈撳叆娉曞湪minlengh涓嬪紩鍙戠殑BUG
                    return
                var lastValue = binding.pipe(val, binding, "get")
                try {
                    binding.setter(lastValue)
                    callback.call(elem, lastValue)
                } catch (ex) {
                    log(ex)
                }
            }
            switch (binding.xtype) {
                case "radio":
                    binding.bound("click", function () {
                        var lastValue = binding.pipe(elem.value, binding, "get")
                        try {
                            binding.setter(lastValue)
                            callback.call(elem, lastValue)
                        } catch (ex) {
                            log(ex)
                        }
                    })
                    break
                case "checkbox":
                    binding.bound(W3C ? "change" : "click", function () {
                        var method = elem.checked ? "ensure" : "remove"
                        var array = binding.getter.apply(0, binding.vmodels)
                        if (!Array.isArray(array)) {
                            log("ms-duplex搴旂敤浜巆heckbox涓婅瀵瑰簲涓€涓暟缁�")
                            array = [array]
                        }
                        var val = binding.pipe(elem.value, binding, "get")
                        avalon.Array[method](array, val)
                        callback.call(elem, array)
                    })
                    break
                case "change":
                    binding.bound("change", updateVModel)
                    break
                case "input":
                    if (!IEVersion) { // W3C
                        binding.bound("input", updateVModel)
                        //闈濱E娴忚鍣ㄦ墠鐢ㄨ繖涓�
                        binding.bound("compositionstart", compositionStart)
                        binding.bound("compositionend", compositionEnd)
                        binding.bound("DOMAutoComplete", updateVModel)
                    } else { //onpropertychange浜嬩欢鏃犳硶鍖哄垎鏄▼搴忚Е鍙戣繕鏄敤鎴疯Е鍙�
                        // IE涓嬮€氳繃selectionchange浜嬩欢鐩戝惉IE9+鐐瑰嚮input鍙宠竟鐨刋鐨勬竻绌鸿涓猴紝鍙婄矘璐达紝鍓垏锛屽垹闄よ涓�
                        if (IEVersion > 8) {
                            binding.bound("input", updateVModel) //IE9浣跨敤propertychange鏃犳硶鐩戝惉涓枃杈撳叆鏀瑰姩
                        } else {
                            binding.bound("propertychange", function (e) { //IE6-8涓嬬涓€娆′慨鏀规椂涓嶄細瑙﹀彂,闇€瑕佷娇鐢╧eydown鎴杝electionchange淇
                                if (e.propertyName === "value") {
                                    updateVModel()
                                }
                            })
                        }
                        binding.bound("dragend", function () {
                            setTimeout(function () {
                                updateVModel()
                            }, 17)
                        })
                        //http://www.cnblogs.com/rubylouvre/archive/2013/02/17/2914604.html
                        //http://www.matts411.com/post/internet-explorer-9-oninput/
                    }
                    break
                case "select":
                    binding.bound("change", function () {
                        var val = avalon(elem).val() //瀛楃涓叉垨瀛楃涓叉暟缁�
                        if (Array.isArray(val)) {
                            val = val.map(function (v) {
                                return binding.pipe(v, binding, "get")
                            })
                        } else {
                            val = binding.pipe(val, binding, "get")
                        }
                        if (val + "" !== binding.oldValue) {
                            try {
                                binding.setter(val)
                            } catch (ex) {
                                log(ex)
                            }
                        }
                    })
                    binding.bound("datasetchanged", function (e) {
                        if (e.bubble === "selectDuplex") {
                            var value = binding._value
                            var curValue = Array.isArray(value) ? value.map(String) : value + ""
                            avalon(elem).val(curValue)
                            elem.oldValue = curValue + ""
                            callback.call(elem, curValue)
                        }
                    })
                    break
            }
            if (binding.xtype === "input" && !rnoduplexInput.test(elem.type)) {
                if (elem.type !== "hidden") {
                    binding.bound("focus", function () {
                        elem.msFocus = true
                    })
                    binding.bound("blur", function () {
                        elem.msFocus = false
                    })
                }
                elem.avalonSetter = updateVModel //#765
                watchValueInTimer(function () {
                    if (elem.contains(elem)) {
                        if (!this.msFocus && binding.oldValue !== elem.value) {
                            updateVModel()
                        }
                    } else if (!elem.msRetain) {
                        return false
                    }
                })
            }

        },
        update: function (value) {
            var elem = this.element, binding = this, curValue
            if (!this.init) {
                for (var i in avalon.vmodels) {
                    var v = avalon.vmodels[i]
                    v.$fire("avalon-ms-duplex-init", binding)
                }
                var cpipe = binding.pipe || (binding.pipe = pipe)
                cpipe(null, binding, "init")
                this.init = 1
            }
            switch (this.xtype) {
                case "input":
                case "change":
                    curValue = this.pipe(value, this, "set")  //fix #673
                    if (curValue !== this.oldValue) {
                        var fixCaret = false
                        if (elem.msFocus) {
                            try {
                                var pos = getCaret(elem)
                                if (pos.start === pos.end) {
                                    pos = pos.start
                                    fixCaret = true
                                }
                            } catch (e) {
                            }
                        }
                        elem.value = this.oldValue = curValue
                        if (fixCaret) {
                            setCaret(elem, pos, pos)
                        }
                    }
                    break
                case "radio":
                    curValue = binding.isChecked ? !!value : value + "" === elem.value
                    if (IEVersion === 6) {
                        setTimeout(function () {
                            //IE8 checkbox, radio鏄娇鐢╠efaultChecked鎺у埗閫変腑鐘舵€侊紝
                            //骞朵笖瑕佸厛璁剧疆defaultChecked鍚庤缃甤hecked
                            //骞朵笖蹇呴』璁剧疆寤惰繜
                            elem.defaultChecked = curValue
                            elem.checked = curValue
                        }, 31)
                    } else {
                        elem.checked = curValue
                    }
                    break
                case "checkbox":
                    var array = [].concat(value) //寮哄埗杞崲涓烘暟缁�
                    curValue = this.pipe(elem.value, this, "get")
                    elem.checked = array.indexOf(curValue) > -1
                    break
                case "select":
                    //蹇呴』鍙樻垚瀛楃涓插悗鎵嶈兘姣旇緝
                    binding._value = value
                    if (!elem.msHasEvent) {
                        elem.msHasEvent = "selectDuplex"
                        //蹇呴』绛夊埌鍏跺瀛愬噯澶囧ソ鎵嶈Е鍙�
                    } else {
                        avalon.fireDom(elem, "datasetchanged", {
                            bubble: elem.msHasEvent
                        })
                    }
                    break
            }
        }
    })

    if (IEVersion) {
        avalon.bind(DOC, "selectionchange", function (e) {
            var el = DOC.activeElement
            if (el && typeof el.avalonSetter === "function") {
                el.avalonSetter()
            }
        })
    }

    function fixNull(val) {
        return val == null ? "" : val
    }
    avalon.duplexHooks = {
        checked: {
            get: function (val, binding) {
                return !binding.oldValue
            }
        },
        string: {
            get: function (val) { //鍚屾鍒癡M
                return val
            },
            set: fixNull
        },
        "boolean": {
            get: function (val) {
                return val === "true"
            },
            set: fixNull
        },
        number: {
            get: function (val, binding) {
                var number = parseFloat(val + "")
                if (-val === -number) {
                    return number
                }

                var arr = /strong|medium|weak/.exec(binding.element.getAttribute("data-duplex-number")) || ["medium"]
                switch (arr[0]) {
                    case "strong":
                        return 0
                    case "medium":
                        return val === "" ? "" : 0
                    case "weak":
                        return val
                }
            },
            set: fixNull
        }
    }

    function pipe(val, binding, action) {
        binding.param.replace(rw20g, function (name) {
            var hook = avalon.duplexHooks[name]
            if (hook && typeof hook[action] === "function") {
                val = hook[action](val, binding)
            }
        })
        return val
    }

    var TimerID, ribbon = []

    avalon.tick = function (fn) {
        if (ribbon.push(fn) === 1) {
            TimerID = setInterval(ticker, 60)
        }
    }

    function ticker() {
        for (var n = ribbon.length - 1; n >= 0; n--) {
            var el = ribbon[n]
            if (el() === false) {
                ribbon.splice(n, 1)
            }
        }
        if (!ribbon.length) {
            clearInterval(TimerID)
        }
    }

    var watchValueInTimer = noop
    new function () { // jshint ignore:line
        try { //#272 IE9-IE11, firefox
            var setters = {}
            var aproto = HTMLInputElement.prototype
            var bproto = HTMLTextAreaElement.prototype
            function newSetter(value) { // jshint ignore:line
                setters[this.tagName].call(this, value)
                if (!this.msFocus && this.avalonSetter && this.oldValue !== value) {
                    this.avalonSetter()
                }
            }
            var inputProto = HTMLInputElement.prototype
            Object.getOwnPropertyNames(inputProto) //鏁呮剰寮曞彂IE6-8绛夋祻瑙堝櫒鎶ラ敊
            setters["INPUT"] = Object.getOwnPropertyDescriptor(aproto, "value").set

            Object.defineProperty(aproto, "value", {
                set: newSetter
            })
            setters["TEXTAREA"] = Object.getOwnPropertyDescriptor(bproto, "value").set
            Object.defineProperty(bproto, "value", {
                set: newSetter
            })
        } catch (e) {
            //鍦╟hrome 43涓� ms-duplex缁堜簬涓嶉渶瑕佷娇鐢ㄥ畾鏃跺櫒瀹炵幇鍙屽悜缁戝畾浜�
            // http://updates.html5rocks.com/2015/04/DOM-attributes-now-on-the-prototype
            // https://docs.google.com/document/d/1jwA8mtClwxI-QJuHT7872Z0pxpZz8PBkf2bGAbsUtqs/edit?pli=1
            watchValueInTimer = avalon.tick
        }
    } // jshint ignore:line
    function getCaret(ctrl, start, end) {
        if (ctrl.setSelectionRange) {
            start = ctrl.selectionStart
            end = ctrl.selectionEnd
        } else if (document.selection && document.selection.createRange) {
            var range = document.selection.createRange()
            start = 0 - range.duplicate().moveStart('character', -100000)
            end = start + range.text.length
        }
        return {
            start: start,
            end: end
        }
    }
    function setCaret(ctrl, begin, end) {
        if (!ctrl.value || ctrl.readOnly)
            return
        if (ctrl.createTextRange) {//IE6-9
            setTimeout(function () {
                var range = ctrl.createTextRange()
                range.collapse(true);
                range.moveStart("character", begin)
                // range.moveEnd("character", end) #1125
                range.select()
            }, 17)
        } else {
            ctrl.selectionStart = begin
            ctrl.selectionEnd = end
        }
    }
    avalon.directive("effect", {
        priority: 5,
        init: function (binding) {
            var text = binding.expr,
                    className,
                    rightExpr
            var colonIndex = text.replace(rexprg, function (a) {
                return a.replace(/./g, "0")
            }).indexOf(":") //鍙栧緱绗竴涓啋鍙风殑浣嶇疆
            if (colonIndex === -1) { // 姣斿 ms-class/effect="aaa bbb ccc" 鐨勬儏鍐�
                className = text
                rightExpr = true
            } else { // 姣斿 ms-class/effect-1="ui-state-active:checked" 鐨勬儏鍐�
                className = text.slice(0, colonIndex)
                rightExpr = text.slice(colonIndex + 1)
            }
            if (!rexpr.test(text)) {
                className = quote(className)
            } else {
                className = normalizeExpr(className)
            }
            binding.expr = "[" + className + "," + rightExpr + "]"
        },
        update: function (arr) {
            var name = arr[0]
            var elem = this.element
            if (elem.getAttribute("data-effect-name") === name) {
                return
            } else {
                elem.removeAttribute("data-effect-driver")
            }
            var inlineStyles = elem.style
            var computedStyles = window.getComputedStyle ? window.getComputedStyle(elem) : null
            var useAni = false
            if (computedStyles && (supportTransition || supportAnimation)) {

                //濡傛灉鏀寔CSS鍔ㄧ敾
                var duration = inlineStyles[transitionDuration] || computedStyles[transitionDuration]
                if (duration && duration !== '0s') {
                    elem.setAttribute("data-effect-driver", "t")
                    useAni = true
                }

                if (!useAni) {

                    duration = inlineStyles[animationDuration] || computedStyles[animationDuration]
                    if (duration && duration !== '0s') {
                        elem.setAttribute("data-effect-driver", "a")
                        useAni = true
                    }

                }
            }

            if (!useAni) {
                if (avalon.effects[name]) {
                    elem.setAttribute("data-effect-driver", "j")
                    useAni = true
                }
            }
            if (useAni) {
                elem.setAttribute("data-effect-name", name)
            }
        }
    })

    avalon.effects = {}
    avalon.effect = function (name, callbacks) {
        avalon.effects[name] = callbacks
    }



    var supportTransition = false
    var supportAnimation = false

    var transitionEndEvent
    var animationEndEvent
    var transitionDuration = avalon.cssName("transition-duration")
    var animationDuration = avalon.cssName("animation-duration")
    new function () {// jshint ignore:line
        var checker = {
            'TransitionEvent': 'transitionend',
            'WebKitTransitionEvent': 'webkitTransitionEnd',
            'OTransitionEvent': 'oTransitionEnd',
            'otransitionEvent': 'otransitionEnd'
        }
        var tran
        //鏈夌殑娴忚鍣ㄥ悓鏃舵敮鎸佺鏈夊疄鐜颁笌鏍囧噯鍐欐硶锛屾瘮濡倃ebkit鏀寔鍓嶄袱绉嶏紝Opera鏀寔1銆�3銆�4
        for (var name in checker) {
            if (window[name]) {
                tran = checker[name]
                break;
            }
            try {
                var a = document.createEvent(name);
                tran = checker[name]
                break;
            } catch (e) {
            }
        }
        if (typeof tran === "string") {
            supportTransition = true
            transitionEndEvent = tran
        }

        //澶ц嚧涓婃湁涓ょ閫夋嫨
        //IE10+, Firefox 16+ & Opera 12.1+: animationend
        //Chrome/Safari: webkitAnimationEnd
        //http://blogs.msdn.com/b/davrous/archive/2011/12/06/introduction-to-css3-animat ions.aspx
        //IE10涔熷彲浠ヤ娇鐢∕SAnimationEnd鐩戝惉锛屼絾鏄洖璋冮噷鐨勪簨浠� type渚濈劧涓篴nimationend
        //  el.addEventListener("MSAnimationEnd", function(e) {
        //     alert(e.type)// animationend锛侊紒锛�
        // })
        checker = {
            'AnimationEvent': 'animationend',
            'WebKitAnimationEvent': 'webkitAnimationEnd'
        }
        var ani;
        for (name in checker) {
            if (window[name]) {
                ani = checker[name];
                break;
            }
        }
        if (typeof ani === "string") {
            supportTransition = true
            animationEndEvent = ani
        }

    }()

    var effectPool = []//閲嶅鍒╃敤鍔ㄧ敾瀹炰緥
    function effectFactory(el, opts) {
        if (!el || el.nodeType !== 1) {
            return null
        }
        if (opts) {
            var name = opts.effectName
            var driver = opts.effectDriver
        } else {
            name = el.getAttribute("data-effect-name")
            driver = el.getAttribute("data-effect-driver")
        }
        if (!name || !driver) {
            return null
        }

        var instance = effectPool.pop() || new Effect()
        instance.el = el
        instance.driver = driver
        instance.useCss = driver !== "j"
        if (instance.useCss) {
            opts && avalon(el).addClass(opts.effectClass)
            instance.cssEvent = driver === "t" ? transitionEndEvent : animationEndEvent
        }
        instance.name = name
        instance.callbacks = avalon.effects[name] || {}

        return instance


    }

    function effectBinding(elem, binding) {
        var name = elem.getAttribute("data-effect-name")
        if (name) {
            binding.effectName = name
            binding.effectDriver = elem.getAttribute("data-effect-driver")
            var stagger = +elem.getAttribute("data-effect-stagger")
            binding.effectLeaveStagger = +elem.getAttribute("data-effect-leave-stagger") || stagger
            binding.effectEnterStagger = +elem.getAttribute("data-effect-enter-stagger") || stagger
            binding.effectClass = elem.className || NaN
        }
    }
    function upperFirstChar(str) {
        return str.replace(/^[\S]/g, function (m) {
            return m.toUpperCase()
        })
    }
    var effectBuffer = new Buffer()
    function Effect() {
    }//聽鍔ㄧ敾瀹炰緥,鍋氭垚绫荤殑褰㈠紡,鏄负浜嗗叡鐢ㄦ墍鏈夊師鍨嬫柟娉�

    Effect.prototype = {
        contrustor: Effect,
        enterClass: function () {
            return getEffectClass(this, "enter")
        },
        leaveClass: function () {
            return getEffectClass(this, "leave")
        },
        // 鍏变韩涓€涓嚱鏁�
        actionFun: function (name, before, after) {
            if (document.hidden) {
                return
            }
            var me = this
            var el = me.el
            var isLeave = name === "leave"
            name = isLeave ? "leave" : "enter"
            var oppositeName = isLeave ? "enter" : "leave"
            callEffectHook(me, "abort" + upperFirstChar(oppositeName))
            callEffectHook(me, "before" + upperFirstChar(name))
            if (!isLeave)
                before(el) //聽聽杩欓噷鍙兘鍋氭彃鍏OM鏍戠殑鎿嶄綔,鍥犳蹇呴』鍦ㄤ慨鏀圭被鍚嶅墠鎵ц
            var cssCallback = function (cancel) {
                el.removeEventListener(me.cssEvent, me.cssCallback)
                if (isLeave) {
                    before(el) //杩欓噷鍙兘鍋氱Щ鍑篋OM鏍戞搷浣�,鍥犳蹇呴』浣嶄簬鍔ㄧ敾涔嬪悗
                    avalon(el).removeClass(me.cssClass)
                } else {
                    if (me.driver === "a") {
                        avalon(el).removeClass(me.cssClass)
                    }
                }
                if (cancel !== true) {
                    callEffectHook(me, "after" + upperFirstChar(name))
                    after && after(el)
                }
                me.dispose()
            }
            if (me.useCss) {
                if (me.cssCallback) { //濡傛灉leave鍔ㄧ敾杩樻病鏈夊畬鎴�,绔嬪嵆瀹屾垚
                    me.cssCallback(true)
                }

                me.cssClass = getEffectClass(me, name)
                me.cssCallback = cssCallback

                me.update = function () {
                    el.addEventListener(me.cssEvent, me.cssCallback)
                    if (!isLeave && me.driver === "t") {//transtion寤惰繜瑙﹀彂
                        avalon(el).removeClass(me.cssClass)
                    }
                }
                avalon(el).addClass(me.cssClass)//animation浼氱珛鍗宠Е鍙�

                effectBuffer.render(true)
                effectBuffer.queue.push(me)

            } else {
                callEffectHook(me, name, cssCallback)

            }
        },
        enter: function (before, after) {
            this.actionFun.apply(this, ["enter"].concat(avalon.slice(arguments)))

        },
        leave: function (before, after) {
            this.actionFun.apply(this, ["leave"].concat(avalon.slice(arguments)))

        },
        dispose: function () {//閿€姣佷笌鍥炴敹鍒版睜瀛愪腑
            this.update = this.cssCallback = null
            if (effectPool.unshift(this) > 100) {
                effectPool.pop()
            }
        }


    }


    function getEffectClass(instance, type) {
        var a = instance.callbacks[type + "Class"]
        if (typeof a === "string")
            return a
        if (typeof a === "function")
            return a()
        return instance.name + "-" + type
    }


    function callEffectHook(effect, name, cb) {
        var hook = effect.callbacks[name]
        if (hook) {
            hook.call(effect, effect.el, cb)
        }
    }

    var applyEffect = function (el, dir/*[before, [after, [opts]]]*/) {
        var args = aslice.call(arguments, 0)
        if (typeof args[2] !== "function") {
            args.splice(2, 0, noop)
        }
        if (typeof args[3] !== "function") {
            args.splice(3, 0, noop)
        }
        var before = args[2]
        var after = args[3]
        var opts = args[4]
        var effect = effectFactory(el, opts)
        if (!effect) {
            before()
            after()
            return false
        } else {
            var method = dir ? 'enter' : 'leave'
            effect[method](before, after)
        }
    }

    avalon.mix(avalon.effect, {
        apply: applyEffect,
        append: function (el, parent, after, opts) {
            return applyEffect(el, 1, function () {
                parent.appendChild(el)
            }, after, opts)
        },
        before: function (el, target, after, opts) {
            return applyEffect(el, 1, function () {
                target.parentNode.insertBefore(el, target)
            }, after, opts)
        },
        remove: function (el, parent, after, opts) {
            return applyEffect(el, 0, function () {
                if (el.parentNode === parent)
                    parent.removeChild(el)
            }, after, opts)
        }
    })


    avalon.directive("html", {
        update: function (val) {
            var binding = this
            var elem = this.element
            var isHtmlFilter = elem.nodeType !== 1
            var parent = isHtmlFilter ? elem.parentNode : elem
            if (!parent)
                return
            val = val == null ? "" : val

            if (elem.nodeType === 3) {
                var signature = generateID("html")
                parent.insertBefore(DOC.createComment(signature), elem)
                binding.element = DOC.createComment(signature + ":end")
                parent.replaceChild(binding.element, elem)
                elem = binding.element
            }
            if (typeof val !== "object") {//string, number, boolean
                var fragment = avalon.parseHTML(String(val))
            } else if (val.nodeType === 11) { //灏唙al杞崲涓烘枃妗ｇ鐗�
                fragment = val
            } else if (val.nodeType === 1 || val.item) {
                var nodes = val.nodeType === 1 ? val.childNodes : val.item
                fragment = avalonFragment.cloneNode(true)
                while (nodes[0]) {
                    fragment.appendChild(nodes[0])
                }
            }

            nodes = avalon.slice(fragment.childNodes)
            //鎻掑叆鍗犱綅绗�, 濡傛灉鏄繃婊ゅ櫒,闇€瑕佹湁鑺傚埗鍦扮Щ闄ゆ寚瀹氱殑鏁伴噺,濡傛灉鏄痟tml鎸囦护,鐩存帴娓呯┖
            if (isHtmlFilter) {
                var endValue = elem.nodeValue.slice(0, -4)
                while (true) {
                    var node = elem.previousSibling
                    if (!node || node.nodeType === 8 && node.nodeValue === endValue) {
                        break
                    } else {
                        parent.removeChild(node)
                    }
                }
                parent.insertBefore(fragment, elem)
            } else {
                avalon.clearHTML(elem).appendChild(fragment)
            }
            scanNodeArray(nodes, binding.vmodels)
        }
    })

    avalon.directive("if", {
        priority: 10,
        update: function (val) {
            var binding = this
            var elem = this.element
            var stamp = binding.stamp = +new Date()
            var par
            var after = function () {
                if (stamp !== binding.stamp)
                    return
                binding.recoverNode = null
            }
            if (binding.recoverNode)
                binding.recoverNode() // 杩樺師鐜板満锛屾湁绉诲姩鑺傜偣鐨勯兘闇€瑕佽繕鍘熺幇鍦�
            try {
                if (!elem.parentNode)
                    return
                par = elem.parentNode
            } catch (e) {
                return
            }
            if (val) { //鎻掑洖DOM鏍�
                function alway() {// jshint ignore:line
                    if (elem.getAttribute(binding.name)) {
                        elem.removeAttribute(binding.name)
                        scanAttr(elem, binding.vmodels)
                    }
                    binding.rollback = null
                }
                if (elem.nodeType === 8) {
                    var keep = binding.keep
                    var hasEffect = avalon.effect.apply(keep, 1, function () {
                        if (stamp !== binding.stamp)
                            return
                        elem.parentNode.replaceChild(keep, elem)
                        elem = binding.element = keep //杩欐椂鍙兘涓簄ull
                        if (keep.getAttribute("_required")) {//#1044
                            elem.required = true
                            elem.removeAttribute("_required")
                        }
                        if (elem.querySelectorAll) {
                            avalon.each(elem.querySelectorAll("[_required=true]"), function (el) {
                                el.required = true
                                el.removeAttribute("_required")
                            })
                        }
                        alway()
                    }, after)
                    hasEffect = hasEffect === false
                }
                if (!hasEffect)
                    alway()
            } else { //绉诲嚭DOM鏍戯紝骞剁敤娉ㄩ噴鑺傜偣鍗犳嵁鍘熶綅缃�
                if (elem.nodeType === 1) {
                    if (elem.required === true) {
                        elem.required = false
                        elem.setAttribute("_required", "true")
                    }
                    try {//聽濡傛灉涓嶆敮鎸乹uerySelectorAll鎴�:required,鍙互鐩存帴鏃犺
                        avalon.each(elem.querySelectorAll(":required"), function (el) {
                            elem.required = false
                            el.setAttribute("_required", "true")
                        })
                    } catch (e) {
                    }

                    var node = binding.element = DOC.createComment("ms-if"),
                            pos = elem.nextSibling
                    binding.recoverNode = function () {
                        binding.recoverNode = null
                        if (node.parentNode !== par) {
                            par.insertBefore(node, pos)
                            binding.keep = elem
                        }
                    }

                    avalon.effect.apply(elem, 0, function () {
                        binding.recoverNode = null
                        if (stamp !== binding.stamp)
                            return
                        elem.parentNode.replaceChild(node, elem)
                        binding.keep = elem //鍏冪礌鑺傜偣
                        ifGroup.appendChild(elem)
                        binding.rollback = function () {
                            if (elem.parentNode === ifGroup) {
                                ifGroup.removeChild(elem)
                            }
                        }
                    }, after)
                }
            }
        }
    })



    //ms-important缁戝畾宸茬粡鍦╯canTag 鏂规硶涓疄鐜�
    var rnoscripts = /<noscript.*?>(?:[\s\S]+?)<\/noscript>/img
    var rnoscriptText = /<noscript.*?>([\s\S]+?)<\/noscript>/im

    var getXHR = function () {
        return new (window.XMLHttpRequest || ActiveXObject)("Microsoft.XMLHTTP") // jshint ignore:line
    }
    //灏嗘墍鏈夎繙绋嬪姞杞界殑妯℃澘,浠ュ瓧绗︿覆褰㈠紡瀛樻斁鍒拌繖閲�
    var templatePool = avalon.templateCache = {}

    function getTemplateContainer(binding, id, text) {
        var div = binding.templateCache && binding.templateCache[id]
        if (div) {
            var dom = DOC.createDocumentFragment(),
                    firstChild
            while (firstChild = div.firstChild) {
                dom.appendChild(firstChild)
            }
            return dom
        }
        return avalon.parseHTML(text)

    }
    function nodesToFrag(nodes) {
        var frag = DOC.createDocumentFragment()
        for (var i = 0, len = nodes.length; i < len; i++) {
            frag.appendChild(nodes[i])
        }
        return frag
    }
    avalon.directive("include", {
        init: directives.attr.init,
        update: function (val) {
            var binding = this
            var elem = this.element
            var vmodels = binding.vmodels
            var rendered = binding.includeRendered
            var effectClass = binding.effectName && binding.effectClass // 鏄惁寮€鍚姩鐢�
            var templateCache = binding.templateCache // 鏄惁data-include-cache
            var outer = binding.includeReplace // 鏄惁data-include-replace
            var loaded = binding.includeLoaded
            var target = outer ? elem.parentNode : elem
            var _ele = binding._element // data-include-replace binding.element === binding.end

            binding.recoverNodes = binding.recoverNodes || avalon.noop
            var scanTemplate = function (text) {
                var _stamp = binding._stamp = +(new Date()) // 杩囨护鎺夐绻佹搷浣�
                if (loaded) {
                    var newText = loaded.apply(target, [text].concat(vmodels))
                    if (typeof newText === "string")
                        text = newText
                }
                if (rendered) {
                    checkScan(target, function () {
                        rendered.call(target)
                    }, NaN)
                }
                var lastID = binding.includeLastID || "_default" // 榛樿

                binding.includeLastID = val
                var leaveEl = templateCache && templateCache[lastID] || DOC.createElement(elem.tagName || binding._element.tagName) // 鍒涘缓涓€涓鍦哄厓绱�
                if (effectClass) {
                    leaveEl.className = effectClass
                    target.insertBefore(leaveEl, binding.start) // 鎻掑叆鍒皊tart涔嬪墠锛岄槻姝㈣閿欒鐨勭Щ鍔�
                }

                // cache or animate锛岀Щ鍔ㄨ妭鐐�
                (templateCache || {})[lastID] = leaveEl
                var fragOnDom = binding.recoverNodes() // 鎭㈠鍔ㄧ敾涓殑鑺傜偣
                if (fragOnDom) {
                    target.insertBefore(fragOnDom, binding.end)
                }
                while (true) {
                    var node = binding.start.nextSibling
                    if (node && node !== leaveEl && node !== binding.end) {
                        leaveEl.appendChild(node)
                    } else {
                        break
                    }
                }
                // 鍏冪礌閫€鍦�
                avalon.effect.remove(leaveEl, target, function () {
                    if (templateCache) { // write cache
                        if (_stamp === binding._stamp)
                            ifGroup.appendChild(leaveEl)
                    }
                }, binding)


                var enterEl = target,
                        before = avalon.noop,
                        after = avalon.noop

                var fragment = getTemplateContainer(binding, val, text)
                var nodes = avalon.slice(fragment.childNodes)

                if (outer && effectClass) {
                    enterEl = _ele
                    enterEl.innerHTML = "" // 娓呯┖
                    enterEl.setAttribute("ms-skip", "true")
                    target.insertBefore(enterEl, binding.end.nextSibling) // 鎻掑叆鍒癰ingding.end涔嬪悗閬垮厤琚敊璇殑绉诲姩
                    before = function () {
                        enterEl.insertBefore(fragment, null) // 鎻掑叆鑺傜偣
                    }
                    after = function () {
                        binding.recoverNodes = avalon.noop
                        if (_stamp === binding._stamp) {
                            fragment = nodesToFrag(nodes)
                            target.insertBefore(fragment, binding.end) // 鎻掑叆鐪熷疄element
                            scanNodeArray(nodes, vmodels)
                        }
                        if (enterEl.parentNode === target)
                            target.removeChild(enterEl) // 绉婚櫎鍏ュ満鍔ㄧ敾鍏冪礌
                    }
                    binding.recoverNodes = function () {
                        binding.recoverNodes = avalon.noop
                        return nodesToFrag(nodes)
                    }
                } else {
                    before = function () {//聽鏂版坊鍔犲厓绱犵殑鍔ㄧ敾聽
                        target.insertBefore(fragment, binding.end)
                        scanNodeArray(nodes, vmodels)
                    }
                }

                avalon.effect.apply(enterEl, "enter", before, after)
            }

            if (binding.param === "src") {
                if (typeof templatePool[val] === "string") {
                    avalon.nextTick(function () {
                        scanTemplate(templatePool[val])
                    })
                } else if (Array.isArray(templatePool[val])) { //#805 闃叉鍦ㄥ惊鐜粦瀹氫腑鍙戝嚭璁稿鐩稿悓鐨勮姹�
                    templatePool[val].push(scanTemplate)
                } else {
                    var xhr = getXHR()
                    xhr.onreadystatechange = function () {
                        if (xhr.readyState === 4) {
                            var s = xhr.status
                            if (s >= 200 && s < 300 || s === 304 || s === 1223) {
                                var text = xhr.responseText
                                for (var f = 0, fn; fn = templatePool[val][f++];) {
                                    fn(text)
                                }
                                templatePool[val] = text
                            } else {
                                log("ms-include load [" + val + "] error")
                            }
                        }
                    }
                    templatePool[val] = [scanTemplate]
                    xhr.open("GET", val, true)
                    if ("withCredentials" in xhr) {
                        xhr.withCredentials = true
                    }
                    xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest")
                    xhr.send(null)
                }
            } else {
                //IE绯诲垪涓庡鏂扮殑鏍囧噯娴忚鍣ㄦ敮鎸侀€氳繃ID鍙栧緱鍏冪礌锛坒irefox14+锛�
                //http://tjvantoll.com/2012/07/19/dom-element-references-as-global-variables/
                var el = val && val.nodeType === 1 ? val : DOC.getElementById(val)
                if (el) {
                    if (el.tagName === "NOSCRIPT" && !(el.innerHTML || el.fixIE78)) { //IE7-8 innerText,innerHTML閮芥棤娉曞彇寰楀叾鍐呭锛孖E6鑳藉彇寰楀叾innerHTML
                        xhr = getXHR() //IE9-11涓巆hrome鐨刬nnerHTML浼氬緱鍒拌浆涔夌殑鍐呭锛屽畠浠殑innerText鍙互
                        xhr.open("GET", location, false)
                        xhr.send(null)
                        //http://bbs.csdn.net/topics/390349046?page=1#post-393492653
                        var noscripts = DOC.getElementsByTagName("noscript")
                        var array = (xhr.responseText || "").match(rnoscripts) || []
                        var n = array.length
                        for (var i = 0; i < n; i++) {
                            var tag = noscripts[i]
                            if (tag) { //IE6-8涓璶oscript鏍囩鐨刬nnerHTML,innerText鏄彧璇荤殑
                                tag.style.display = "none" //http://haslayout.net/css/noscript-Ghost-Bug
                                tag.fixIE78 = (array[i].match(rnoscriptText) || ["", "&nbsp;"])[1]
                            }
                        }
                    }
                    avalon.nextTick(function () {
                        scanTemplate(el.fixIE78 || el.value || el.innerText || el.innerHTML)
                    })
                }
            }
        }
    })

    var rdash = /\(([^)]*)\)/
    var onDir = avalon.directive("on", {
        priority: 3000,
        init: function (binding) {
            var value = binding.expr
            binding.type = "on"
            var eventType = binding.param.replace(/-\d+$/, "") // ms-on-mousemove-10
            if (typeof onDir[eventType + "Hook"] === "function") {
                onDir[eventType + "Hook"](binding)
            }
            if (value.indexOf("(") > 0 && value.indexOf(")") > -1) {
                var matched = (value.match(rdash) || ["", ""])[1].trim()
                if (matched === "" || matched === "$event") { // aaa() aaa($event)褰撴垚aaa澶勭悊
                    value = value.replace(rdash, "")
                }
            }
            binding.expr = value
        },
        update: function (callback) {
            var binding = this
            var elem = this.element
            callback = function (e) {
                var fn = binding.getter || noop
                return fn.apply(this, binding.args.concat(e))
            }

            var eventType = binding.param.replace(/-\d+$/, "") // ms-on-mousemove-10
            if (eventType === "scan") {
                callback.call(elem, {
                    type: eventType
                })
            } else if (typeof binding.specialBind === "function") {
                binding.specialBind(elem, callback)
            } else {
                var removeFn = avalon.bind(elem, eventType, callback)
            }
            binding.rollback = function () {
                if (typeof binding.specialUnbind === "function") {
                    binding.specialUnbind()
                } else {
                    avalon.unbind(elem, eventType, removeFn)
                }
            }
        }
    })
    avalon.directive("repeat", {
        priority: 90,
        init: function (binding) {
            var type = binding.type
            binding.cache = {} //鐢ㄤ簬瀛樻斁浠ｇ悊VM
            binding.enterCount = 0

            var elem = binding.element
            if (elem.nodeType === 1) {
                elem.removeAttribute(binding.name)
                effectBinding(elem, binding)
                binding.param = binding.param || "el"
                binding.sortedCallback = getBindingCallback(elem, "data-with-sorted", binding.vmodels)
                var rendered = getBindingCallback(elem, "data-" + type + "-rendered", binding.vmodels)

                var signature = generateID(type)
                var start = DOC.createComment(signature + ":start")
                var end = binding.element = DOC.createComment(signature + ":end")
                binding.signature = signature
                binding.start = start
                binding.template = avalonFragment.cloneNode(false)
                if (type === "repeat") {
                    var parent = elem.parentNode
                    parent.replaceChild(end, elem)
                    parent.insertBefore(start, end)
                    binding.template.appendChild(elem)
                } else {
                    while (elem.firstChild) {
                        binding.template.appendChild(elem.firstChild)
                    }
                    elem.appendChild(start)
                    elem.appendChild(end)
                    parent = elem
                }
                binding.element = end

                if (rendered) {
                    var removeFn = avalon.bind(parent, "datasetchanged", function () {
                        rendered.apply(parent, parent.args)
                        avalon.unbind(parent, "datasetchanged", removeFn)
                        parent.msRendered = rendered
                    })
                }
            }
        },
        update: function (value, oldValue) {
            var binding = this
            var xtype = this.xtype

            this.enterCount += 1
            var init = !oldValue
            if (init) {
                binding.$outer = {}
                var check0 = "$key"
                var check1 = "$val"
                if (xtype === "array") {
                    check0 = "$first"
                    check1 = "$last"
                }
                for (var i = 0, v; v = binding.vmodels[i++];) {
                    if (v.hasOwnProperty(check0) && v.hasOwnProperty(check1)) {
                        binding.$outer = v
                        break
                    }
                }
            }
            var track = this.track
            if (binding.sortedCallback) { //濡傛灉鏈夊洖璋冿紝鍒欒瀹冧滑鎺掑簭
                var keys2 = binding.sortedCallback.call(parent, track)
                if (keys2 && Array.isArray(keys2)) {
                    track = keys2
                }
            }

            var action = "move"
            binding.$repeat = value
            var fragments = []
            var transation = init && avalonFragment.cloneNode(false)
            var proxies = []
            var param = this.param
            var retain = avalon.mix({}, this.cache)
            var elem = this.element
            var length = track.length

            var parent = elem.parentNode
            for (i = 0; i < length; i++) {

                var keyOrId = track[i] //array涓洪殢鏈烘暟, object 涓簁eyName
                var proxy = retain[keyOrId]
                if (!proxy) {

                    proxy = getProxyVM(this)
                    proxy.$up = null
                    if (xtype === "array") {
                        action = "add"
                        proxy.$id = keyOrId
                        var valueItem = value[i]
                        proxy[param] = valueItem //index
                        if (Object(valueItem) === valueItem) {
                            valueItem.$ups = valueItem.$ups || {}
                            valueItem.$ups[param] = proxy
                        }

                    } else {
                        action = "append"
                        proxy.$key = keyOrId
                        proxy.$val = value[keyOrId] //key
                    }
                    this.cache[keyOrId] = proxy
                    var node = proxy.$anchor || (proxy.$anchor = elem.cloneNode(false))
                    node.nodeValue = this.signature
                    shimController(binding, transation, proxy, fragments, init && !binding.effectDriver)
                    decorateProxy(proxy, binding, xtype)
                } else {
                    //                if (xtype === "array") {
                    //                    proxy[param] = value[i]
                    //                }
                    fragments.push({})
                    retain[keyOrId] = true
                }

                //閲嶅啓proxy
                if (this.enterCount === 1) {//聽闃叉澶氭杩涘叆,瀵艰嚧浣嶇疆涓嶅
                    proxy.$active = false
                    proxy.$oldIndex = proxy.$index
                    proxy.$active = true
                    proxy.$index = i

                }

                if (xtype === "array") {
                    proxy.$first = i === 0
                    proxy.$last = i === length - 1
                    // proxy[param] = value[i]
                } else {
                    proxy.$val = toJson(value[keyOrId]) //聽杩欓噷鏄鐞唙m.object = newObject鐨勬儏鍐� 
                }
                proxies.push(proxy)
            }
            this.proxies = proxies
            if (init && !binding.effectDriver) {
                parent.insertBefore(transation, elem)
                fragments.forEach(function (fragment) {
                    scanNodeArray(fragment.nodes || [], fragment.vmodels)
                    //if(fragment.vmodels.length > 2)
                    fragment.nodes = fragment.vmodels = null
                })// jshint ignore:line
            } else {

                var staggerIndex = binding.staggerIndex = 0
                for (keyOrId in retain) {
                    if (retain[keyOrId] !== true) {

                        action = "del"
                        removeItem(retain[keyOrId].$anchor, binding)
                        // avalon.log("鍒犻櫎", keyOrId)
                        // 鐩稿綋浜巇elete binding.cache[key]
                        proxyRecycler(this.cache, keyOrId, param)
                        retain[keyOrId] = null
                    }
                }

                //  console.log(effectEnterStagger)
                for (i = 0; i < length; i++) {
                    proxy = proxies[i]
                    keyOrId = xtype === "array" ? proxy.$id : proxy.$key
                    var pre = proxies[i - 1]
                    var preEl = pre ? pre.$anchor : binding.start
                    if (!retain[keyOrId]) {//濡傛灉杩樻病鏈夋彃鍏ュ埌DOM鏍�
                        (function (fragment, preElement) {
                            var nodes = fragment.nodes
                            var vmodels = fragment.vmodels
                            if (nodes) {
                                staggerIndex = mayStaggerAnimate(binding.effectEnterStagger, function () {
                                    parent.insertBefore(fragment.content, preElement.nextSibling)
                                    scanNodeArray(nodes, vmodels)
                                    animateRepeat(nodes, 1, binding)
                                }, staggerIndex)
                            }
                            fragment.nodes = fragment.vmodels = null
                        })(fragments[i], preEl)// jshint ignore:line
                        // avalon.log("鎻掑叆")

                    } else if (proxy.$index !== proxy.$oldIndex) {
                        (function (proxy2, preElement) {
                            staggerIndex = mayStaggerAnimate(binding.effectEnterStagger, function () {
                                var curNode = removeItem(proxy2.$anchor)//聽濡傛灉浣嶇疆琚尓鍔ㄤ簡
                                var inserted = avalon.slice(curNode.childNodes)
                                parent.insertBefore(curNode, preElement.nextSibling)
                                animateRepeat(inserted, 1, binding)
                            }, staggerIndex)
                        })(proxy, preEl)// jshint ignore:line

                        // avalon.log("绉诲姩", proxy.$oldIndex, "-->", proxy.$index)
                    }
                }

            }
            if (!value.$track) {//濡傛灉鏄潪鐩戞帶瀵硅薄,閭ｄ箞灏卞皢鍏�$events娓呯┖,闃绘鍏舵寔缁洃鍚�
                for (keyOrId in this.cache) {
                    proxyRecycler(this.cache, keyOrId, param)
                }

            }

            //repeat --> duplex
            (function (args) {
                parent.args = args
                if (parent.msRendered) {//绗竴娆′簨浠惰Е鍙�,浠ュ悗鐩存帴璋冪敤
                    parent.msRendered.apply(parent, args)
                }
            })(kernel.newWatch ? arguments : [action]);
            var id = setTimeout(function () {
                clearTimeout(id)
                //瑙﹀彂涓婂眰鐨剆elect鍥炶皟鍙婅嚜宸辩殑rendered鍥炶皟
                avalon.fireDom(parent, "datasetchanged", {
                    bubble: parent.msHasEvent
                })
            })
            this.enterCount -= 1

        }

    })

    "with,each".replace(rword, function (name) {
        directives[name] = avalon.mix({}, directives.repeat, {
            priority: 1400
        })
    })


    function animateRepeat(nodes, isEnter, binding) {
        for (var i = 0, node; node = nodes[i++];) {
            if (node.className === binding.effectClass) {
                avalon.effect.apply(node, isEnter, noop, noop, binding)
            }
        }
    }

    function mayStaggerAnimate(staggerTime, callback, index) {
        if (staggerTime) {
            setTimeout(callback, (++index) * staggerTime)
        } else {
            callback()
        }
        return index
    }


    function removeItem(node, binding) {
        var fragment = avalonFragment.cloneNode(false)
        var last = node
        var breakText = last.nodeValue
        var staggerIndex = binding && Math.max(+binding.staggerIndex, 0)
        var nodes = avalon.slice(last.parentNode.childNodes)
        var index = nodes.indexOf(last)
        while (true) {
            var pre = nodes[--index] //node.previousSibling
            if (!pre || String(pre.nodeValue).indexOf(breakText) === 0) {
                break
            }

            if (binding && (pre.className === binding.effectClass)) {
                node = pre;
                (function (cur) {
                    binding.staggerIndex = mayStaggerAnimate(binding.effectLeaveStagger, function () {
                        avalon.effect.apply(cur, 0, noop, function () {
                            fragment.appendChild(cur)
                        }, binding)
                    }, staggerIndex)
                })(pre);// jshint ignore:line
            } else {
                fragment.insertBefore(pre, fragment.firstChild)
            }
        }
        fragment.appendChild(last)
        return fragment
    }


    function shimController(data, transation, proxy, fragments, init) {
        var content = data.template.cloneNode(true)
        var nodes = avalon.slice(content.childNodes)
        content.appendChild(proxy.$anchor)
        init && transation.appendChild(content)
        var nv = [proxy].concat(data.vmodels)
        var fragment = {
            nodes: nodes,
            vmodels: nv,
            content: content
        }
        fragments.push(fragment)
    }
    // {}  -->  {xx: 0, yy: 1, zz: 2} add
    // {xx: 0, yy: 1, zz: 2}  -->  {xx: 0, yy: 1, zz: 2, uu: 3}
    // [xx: 0, yy: 1, zz: 2}  -->  {xx: 0, zz: 1, yy: 2}

    function getProxyVM(binding) {
        var agent = binding.xtype === "object" ? withProxyAgent : eachProxyAgent
        var proxy = agent(binding)
        var node = proxy.$anchor || (proxy.$anchor = binding.element.cloneNode(false))
        node.nodeValue = binding.signature
        proxy.$outer = binding.$outer
        return proxy
    }

    var eachProxyPool = []

    function eachProxyAgent(data, proxy) {
        var itemName = data.param || "el"
        for (var i = 0, n = eachProxyPool.length; i < n; i++) {
            var candidate = eachProxyPool[i]
            if (candidate && candidate.hasOwnProperty(itemName)) {
                eachProxyPool.splice(i, 1)
                proxy = candidate
                break
            }
        }
        if (!proxy) {
            proxy = eachProxyFactory(itemName)
        }
        return proxy
    }

    function eachProxyFactory(itemName) {
        var source = {
            $outer: {},
            $index: 0,
            $oldIndex: 0,
            $anchor: null,
            //-----
            $first: false,
            $last: false,
            $remove: avalon.noop
        }
        source[itemName] = NaN

        var force = {
            $last: 1,
            $first: 1,
            $index: 1
        }
        force[itemName] = 1
        var proxy = modelFactory(source, {
            force: force
        })
        proxy.$id = generateID("$proxy$each")
        return proxy
    }

    function decorateProxy(proxy, binding, type) {
        if (type === "array") {
            proxy.$remove = function () {

                binding.$repeat.removeAt(proxy.$index)
            }
            var param = binding.param


            proxy.$watch(param, function (a) {
                var index = proxy.$index
                binding.$repeat[index] = a
            })
        } else {
            proxy.$watch("$val", function fn(a) {
                binding.$repeat[proxy.$key] = a
            })
        }
    }

    var withProxyPool = []

    function withProxyAgent() {
        return withProxyPool.pop() || withProxyFactory()
    }

    function withProxyFactory() {
        var proxy = modelFactory({
            $key: "",
            $val: NaN,
            $index: 0,
            $oldIndex: 0,
            $outer: {},
            $anchor: null
        }, {
            force: {
                $key: 1,
                $val: 1,
                $index: 1
            }
        })
        proxy.$id = generateID("$proxy$with")
        return proxy
    }


    function proxyRecycler(cache, key, param) {
        var proxy = cache[key]
        if (proxy) {
            var proxyPool = proxy.$id.indexOf("$proxy$each") === 0 ? eachProxyPool : withProxyPool
            proxy.$outer = {}

            for (var i in proxy.$events) {
                var a = proxy.$events[i]
                if (Array.isArray(a)) {
                    a.length = 0
                    if (i === param) {
                        proxy[param] = NaN

                    } else if (i === "$val") {
                        proxy.$val = NaN
                    }
                }
            }

            if (proxyPool.unshift(proxy) > kernel.maxRepeatSize) {
                proxyPool.pop()
            }
            delete cache[key]
        }
    }
    /*********************************************************************
     *                         鍚勭鎸囦护                                  *
     **********************************************************************/
    //ms-skip缁戝畾宸茬粡鍦╯canTag 鏂规硶涓疄鐜�
    avalon.directive("text", {
        update: function (value) {
            var elem = this.element
            value = value == null ? "" : value //涓嶅湪椤甸潰涓婃樉绀簎ndefined null
            if (elem.nodeType === 3) { //缁戝畾鍦ㄦ枃鏈妭鐐逛笂
                try { //IE瀵规父绂讳簬DOM鏍戝鐨勮妭鐐硅祴鍊间細鎶ラ敊
                    elem.data = value
                } catch (e) {
                }
            } else { //缁戝畾鍦ㄧ壒鎬ц妭鐐逛笂
                if ("textContent" in elem) {
                    elem.textContent = value
                } else {
                    elem.innerText = value
                }
            }
        }
    })
    function parseDisplay(nodeName, val) {
        //鐢ㄤ簬鍙栧緱姝ょ被鏍囩鐨勯粯璁isplay鍊�
        var key = "_" + nodeName
        if (!parseDisplay[key]) {
            var node = DOC.createElement(nodeName)
            root.appendChild(node)
            if (W3C) {
                val = getComputedStyle(node, null).display
            } else {
                val = node.currentStyle.display
            }
            root.removeChild(node)
            parseDisplay[key] = val
        }
        return parseDisplay[key]
    }

    avalon.parseDisplay = parseDisplay

    avalon.directive("visible", {
        init: function (binding) {
            effectBinding(binding.element, binding)
        },
        update: function (val) {
            var binding = this, elem = this.element, stamp
            var noEffect = !this.effectName
            if (!this.stamp) {
                stamp = this.stamp = +new Date
                if (val) {
                    elem.style.display = binding.display || ""
                    if (avalon(elem).css("display") === "none") {
                        elem.style.display = binding.display = parseDisplay(elem.nodeName)
                    }
                } else {
                    elem.style.display = "none"
                }
                return
            }
            stamp = this.stamp = +new Date
            if (val) {
                avalon.effect.apply(elem, 1, function () {
                    if (stamp !== binding.stamp)
                        return
                    var driver = elem.getAttribute("data-effect-driver") || "a"

                    if (noEffect) {//涓嶇敤鍔ㄧ敾鏃惰蛋杩欓噷
                        elem.style.display = binding.display || ""
                    }
                    // "a", "t"
                    if (driver === "a" || driver === "t") {
                        if (avalon(elem).css("display") === "none") {
                            elem.style.display = binding.display || parseDisplay(elem.nodeName)
                        }
                    }
                })
            } else {
                avalon.effect.apply(elem, 0, function () {
                    if (stamp !== binding.stamp)
                        return
                    elem.style.display = "none"
                })
            }
        }
    })

    /*********************************************************************
     *                             鑷甫杩囨护鍣�                            *
     **********************************************************************/
    var rscripts = /<script[^>]*>([\S\s]*?)<\/script\s*>/gim
    var ron = /\s+(on[^=\s]+)(?:=("[^"]*"|'[^']*'|[^\s>]+))?/g
    var ropen = /<\w+\b(?:(["'])[^"]*?(\1)|[^>])*>/ig
    var rsanitize = {
        a: /\b(href)\=("javascript[^"]*"|'javascript[^']*')/ig,
        img: /\b(src)\=("javascript[^"]*"|'javascript[^']*')/ig,
        form: /\b(action)\=("javascript[^"]*"|'javascript[^']*')/ig
    }
    var rsurrogate = /[\uD800-\uDBFF][\uDC00-\uDFFF]/g
    var rnoalphanumeric = /([^\#-~| |!])/g;

    function numberFormat(number, decimals, point, thousands) {
        //form http://phpjs.org/functions/number_format/
        //number	蹇呴渶锛岃鏍煎紡鍖栫殑鏁板瓧
        //decimals	鍙€夛紝瑙勫畾澶氬皯涓皬鏁颁綅銆�
        //point	鍙€夛紝瑙勫畾鐢ㄤ綔灏忔暟鐐圭殑瀛楃涓诧紙榛樿涓� . 锛夈€�
        //thousands	鍙€夛紝瑙勫畾鐢ㄤ綔鍗冧綅鍒嗛殧绗︾殑瀛楃涓诧紙榛樿涓� , 锛夛紝濡傛灉璁剧疆浜嗚鍙傛暟锛岄偅涔堟墍鏈夊叾浠栧弬鏁伴兘鏄繀闇€鐨勩€�
        number = (number + '')
                .replace(/[^0-9+\-Ee.]/g, '')
        var n = !isFinite(+number) ? 0 : +number,
                prec = !isFinite(+decimals) ? 3 : Math.abs(decimals),
                sep = thousands || ",",
                dec = point || ".",
                s = '',
                toFixedFix = function (n, prec) {
                    var k = Math.pow(10, prec)
                    return '' + (Math.round(n * k) / k)
                            .toFixed(prec)
                }
        // Fix for IE parseFloat(0.55).toFixed(0) = 0;
        s = (prec ? toFixedFix(n, prec) : '' + Math.round(n))
                .split('.')
        if (s[0].length > 3) {
            s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep)
        }
        if ((s[1] || '')
                .length < prec) {
            s[1] = s[1] || ''
            s[1] += new Array(prec - s[1].length + 1)
                    .join('0')
        }
        return s.join(dec)
    }


    var filters = avalon.filters = {
        uppercase: function (str) {
            return str.toUpperCase()
        },
        lowercase: function (str) {
            return str.toLowerCase()
        },
        truncate: function (str, length, truncation) {
            //length锛屾柊瀛楃涓查暱搴︼紝truncation锛屾柊瀛楃涓茬殑缁撳熬鐨勫瓧娈�,杩斿洖鏂板瓧绗︿覆
            length = length || 30
            truncation = typeof truncation === "string" ? truncation : "..."
            return str.length > length ? str.slice(0, length - truncation.length) + truncation : String(str)
        },
        $filter: function (val) {
            for (var i = 1, n = arguments.length; i < n; i++) {
                var array = arguments[i]
                var fn = avalon.filters[array[0]]
                if (typeof fn === "function") {
                    var arr = [val].concat(array.slice(1))
                    val = fn.apply(null, arr)
                }
            }
            return val
        },
        camelize: camelize,
        //https://www.owasp.org/index.php/XSS_Filter_Evasion_Cheat_Sheet
        //    <a href="javasc&NewLine;ript&colon;alert('XSS')">chrome</a> 
        //    <a href="data:text/html;base64, PGltZyBzcmM9eCBvbmVycm9yPWFsZXJ0KDEpPg==">chrome</a>
        //    <a href="jav	ascript:alert('XSS');">IE67chrome</a>
        //    <a href="jav&#x09;ascript:alert('XSS');">IE67chrome</a>
        //    <a href="jav&#x0A;ascript:alert('XSS');">IE67chrome</a>
        sanitize: function (str) {
            return str.replace(rscripts, "").replace(ropen, function (a, b) {
                var match = a.toLowerCase().match(/<(\w+)\s/)
                if (match) { //澶勭悊a鏍囩鐨刪ref灞炴€э紝img鏍囩鐨剆rc灞炴€э紝form鏍囩鐨刟ction灞炴€�
                    var reg = rsanitize[match[1]]
                    if (reg) {
                        a = a.replace(reg, function (s, name, value) {
                            var quote = value.charAt(0)
                            return name + "=" + quote + "javascript:void(0)" + quote// jshint ignore:line
                        })
                    }
                }
                return a.replace(ron, " ").replace(/\s+/g, " ") //绉婚櫎onXXX浜嬩欢
            })
        },
        escape: function (str) {
            //灏嗗瓧绗︿覆缁忚繃 str 杞箟寰楀埌閫傚悎鍦ㄩ〉闈腑鏄剧ず鐨勫唴瀹�, 渚嬪鏇挎崲 < 涓� &lt 
            return String(str).
                    replace(/&/g, '&amp;').
                    replace(rsurrogate, function (value) {
                        var hi = value.charCodeAt(0)
                        var low = value.charCodeAt(1)
                        return '&#' + (((hi - 0xD800) * 0x400) + (low - 0xDC00) + 0x10000) + ';'
                    }).
                    replace(rnoalphanumeric, function (value) {
                        return '&#' + value.charCodeAt(0) + ';'
                    }).
                    replace(/</g, '&lt;').
                    replace(/>/g, '&gt;')
        },
        currency: function (amount, symbol, fractionSize) {
            return (symbol || "\uFFE5") + numberFormat(amount, isFinite(fractionSize) ? fractionSize : 2)
        },
        number: numberFormat
    }
    /*
     'yyyy': 4 digit representation of year (e.g. AD 1 => 0001, AD 2010 => 2010)
     'yy': 2 digit representation of year, padded (00-99). (e.g. AD 2001 => 01, AD 2010 => 10)
     'y': 1 digit representation of year, e.g. (AD 1 => 1, AD 199 => 199)
     'MMMM': Month in year (January-December)
     'MMM': Month in year (Jan-Dec)
     'MM': Month in year, padded (01-12)
     'M': Month in year (1-12)
     'dd': Day in month, padded (01-31)
     'd': Day in month (1-31)
     'EEEE': Day in Week,(Sunday-Saturday)
     'EEE': Day in Week, (Sun-Sat)
     'HH': Hour in day, padded (00-23)
     'H': Hour in day (0-23)
     'hh': Hour in am/pm, padded (01-12)
     'h': Hour in am/pm, (1-12)
     'mm': Minute in hour, padded (00-59)
     'm': Minute in hour (0-59)
     'ss': Second in minute, padded (00-59)
     's': Second in minute (0-59)
     'a': am/pm marker
     'Z': 4 digit (+sign) representation of the timezone offset (-1200-+1200)
     format string can also be one of the following predefined localizable formats:
     
     'medium': equivalent to 'MMM d, y h:mm:ss a' for en_US locale (e.g. Sep 3, 2010 12:05:08 pm)
     'short': equivalent to 'M/d/yy h:mm a' for en_US locale (e.g. 9/3/10 12:05 pm)
     'fullDate': equivalent to 'EEEE, MMMM d,y' for en_US locale (e.g. Friday, September 3, 2010)
     'longDate': equivalent to 'MMMM d, y' for en_US locale (e.g. September 3, 2010
     'mediumDate': equivalent to 'MMM d, y' for en_US locale (e.g. Sep 3, 2010)
     'shortDate': equivalent to 'M/d/yy' for en_US locale (e.g. 9/3/10)
     'mediumTime': equivalent to 'h:mm:ss a' for en_US locale (e.g. 12:05:08 pm)
     'shortTime': equivalent to 'h:mm a' for en_US locale (e.g. 12:05 pm)
     */
    new function () {// jshint ignore:line
        function toInt(str) {
            return parseInt(str, 10) || 0
        }

        function padNumber(num, digits, trim) {
            var neg = ""
            if (num < 0) {
                neg = '-'
                num = -num
            }
            num = "" + num
            while (num.length < digits)
                num = "0" + num
            if (trim)
                num = num.substr(num.length - digits)
            return neg + num
        }

        function dateGetter(name, size, offset, trim) {
            return function (date) {
                var value = date["get" + name]()
                if (offset > 0 || value > -offset)
                    value += offset
                if (value === 0 && offset === -12) {
                    value = 12
                }
                return padNumber(value, size, trim)
            }
        }

        function dateStrGetter(name, shortForm) {
            return function (date, formats) {
                var value = date["get" + name]()
                var get = (shortForm ? ("SHORT" + name) : name).toUpperCase()
                return formats[get][value]
            }
        }

        function timeZoneGetter(date) {
            var zone = -1 * date.getTimezoneOffset()
            var paddedZone = (zone >= 0) ? "+" : ""
            paddedZone += padNumber(Math[zone > 0 ? "floor" : "ceil"](zone / 60), 2) + padNumber(Math.abs(zone % 60), 2)
            return paddedZone
        }
        //鍙栧緱涓婂崍涓嬪崍

        function ampmGetter(date, formats) {
            return date.getHours() < 12 ? formats.AMPMS[0] : formats.AMPMS[1]
        }
        var DATE_FORMATS = {
            yyyy: dateGetter("FullYear", 4),
            yy: dateGetter("FullYear", 2, 0, true),
            y: dateGetter("FullYear", 1),
            MMMM: dateStrGetter("Month"),
            MMM: dateStrGetter("Month", true),
            MM: dateGetter("Month", 2, 1),
            M: dateGetter("Month", 1, 1),
            dd: dateGetter("Date", 2),
            d: dateGetter("Date", 1),
            HH: dateGetter("Hours", 2),
            H: dateGetter("Hours", 1),
            hh: dateGetter("Hours", 2, -12),
            h: dateGetter("Hours", 1, -12),
            mm: dateGetter("Minutes", 2),
            m: dateGetter("Minutes", 1),
            ss: dateGetter("Seconds", 2),
            s: dateGetter("Seconds", 1),
            sss: dateGetter("Milliseconds", 3),
            EEEE: dateStrGetter("Day"),
            EEE: dateStrGetter("Day", true),
            a: ampmGetter,
            Z: timeZoneGetter
        }
        var rdateFormat = /((?:[^yMdHhmsaZE']+)|(?:'(?:[^']|'')*')|(?:E+|y+|M+|d+|H+|h+|m+|s+|a|Z))(.*)/
        var raspnetjson = /^\/Date\((\d+)\)\/$/
        filters.date = function (date, format) {
            var locate = filters.date.locate,
                    text = "",
                    parts = [],
                    fn, match
            format = format || "mediumDate"
            format = locate[format] || format
            if (typeof date === "string") {
                if (/^\d+$/.test(date)) {
                    date = toInt(date)
                } else if (raspnetjson.test(date)) {
                    date = +RegExp.$1
                } else {
                    var trimDate = date.trim()
                    var dateArray = [0, 0, 0, 0, 0, 0, 0]
                    var oDate = new Date(0)
                    //鍙栧緱骞存湀鏃�
                    trimDate = trimDate.replace(/^(\d+)\D(\d+)\D(\d+)/, function (_, a, b, c) {
                        var array = c.length === 4 ? [c, a, b] : [a, b, c]
                        dateArray[0] = toInt(array[0])     //骞�
                        dateArray[1] = toInt(array[1]) - 1 //鏈�
                        dateArray[2] = toInt(array[2])     //鏃�
                        return ""
                    })
                    var dateSetter = oDate.setFullYear
                    var timeSetter = oDate.setHours
                    trimDate = trimDate.replace(/[T\s](\d+):(\d+):?(\d+)?\.?(\d)?/, function (_, a, b, c, d) {
                        dateArray[3] = toInt(a) //灏忔椂
                        dateArray[4] = toInt(b) //鍒嗛挓
                        dateArray[5] = toInt(c) //绉�
                        if (d) {                //姣
                            dateArray[6] = Math.round(parseFloat("0." + d) * 1000)
                        }
                        return ""
                    })
                    var tzHour = 0
                    var tzMin = 0
                    trimDate = trimDate.replace(/Z|([+-])(\d\d):?(\d\d)/, function (z, symbol, c, d) {
                        dateSetter = oDate.setUTCFullYear
                        timeSetter = oDate.setUTCHours
                        if (symbol) {
                            tzHour = toInt(symbol + c)
                            tzMin = toInt(symbol + d)
                        }
                        return ""
                    })

                    dateArray[3] -= tzHour
                    dateArray[4] -= tzMin
                    dateSetter.apply(oDate, dateArray.slice(0, 3))
                    timeSetter.apply(oDate, dateArray.slice(3))
                    date = oDate
                }
            }
            if (typeof date === "number") {
                date = new Date(date)
            }
            if (avalon.type(date) !== "date") {
                return
            }
            while (format) {
                match = rdateFormat.exec(format)
                if (match) {
                    parts = parts.concat(match.slice(1))
                    format = parts.pop()
                } else {
                    parts.push(format)
                    format = null
                }
            }
            parts.forEach(function (value) {
                fn = DATE_FORMATS[value]
                text += fn ? fn(date, locate) : value.replace(/(^'|'$)/g, "").replace(/''/g, "'")
            })
            return text
        }
        var locate = {
            AMPMS: {
                0: "涓婂崍",
                1: "涓嬪崍"
            },
            DAY: {
                0: "鏄熸湡鏃�",
                1: "鏄熸湡涓€",
                2: "鏄熸湡浜�",
                3: "鏄熸湡涓�",
                4: "鏄熸湡鍥�",
                5: "鏄熸湡浜�",
                6: "鏄熸湡鍏�"
            },
            MONTH: {
                0: "1鏈�",
                1: "2鏈�",
                2: "3鏈�",
                3: "4鏈�",
                4: "5鏈�",
                5: "6鏈�",
                6: "7鏈�",
                7: "8鏈�",
                8: "9鏈�",
                9: "10鏈�",
                10: "11鏈�",
                11: "12鏈�"
            },
            SHORTDAY: {
                "0": "鍛ㄦ棩",
                "1": "鍛ㄤ竴",
                "2": "鍛ㄤ簩",
                "3": "鍛ㄤ笁",
                "4": "鍛ㄥ洓",
                "5": "鍛ㄤ簲",
                "6": "鍛ㄥ叚"
            },
            fullDate: "y骞碝鏈坉鏃EEE",
            longDate: "y骞碝鏈坉鏃�",
            medium: "yyyy-M-d H:mm:ss",
            mediumDate: "yyyy-M-d",
            mediumTime: "H:mm:ss",
            "short": "yy-M-d ah:mm",
            shortDate: "yy-M-d",
            shortTime: "ah:mm"
        }
        locate.SHORTMONTH = locate.MONTH
        filters.date.locate = locate
    }// jshint ignore:line
    /*********************************************************************
     *                           DOMReady                               *
     **********************************************************************/

    var readyList = [],
        isReady
    var fireReady = function (fn) {
        isReady = true
        var require = avalon.require
        if (require && require.checkDeps) {
            modules["domReady!"].state = 4
            require.checkDeps()
        }
        while (fn = readyList.shift()) {
            fn(avalon)
        }
    }

    function doScrollCheck() {
        try { //IE涓嬮€氳繃doScrollCheck妫€娴婦OM鏍戞槸鍚﹀缓瀹�
            root.doScroll("left")
            fireReady()
        } catch (e) {
            setTimeout(doScrollCheck)
        }
    }

    if (DOC.readyState === "complete") {
        setTimeout(fireReady) //濡傛灉鍦╠omReady涔嬪鍔犺浇
    } else if (W3C) {
        DOC.addEventListener("DOMContentLoaded", fireReady)
    } else {
        DOC.attachEvent("onreadystatechange", function () {
            if (DOC.readyState === "complete") {
                fireReady()
            }
        })
        try {
            var isTop = window.frameElement === null
        } catch (e) { }
        if (root.doScroll && isTop && window.external) { //fix IE iframe BUG
            doScrollCheck()
        }
    }
    avalon.bind(window, "load", fireReady)

    avalon.ready = function (fn) {
        if (!isReady) {
            readyList.push(fn)
        } else {
            fn(avalon)
        }
    }

    avalon.config({
        loader: true
    })

    avalon.ready(function () {
        avalon.scan(DOC.body)
    })


    // Register as a named AMD module, since avalon can be concatenated with other
    // files that may use define, but not via a proper concatenation script that
    // understands anonymous AMD modules. A named AMD is safest and most robust
    // way to register. Lowercase avalon is used because AMD module names are
    // derived from file names, and Avalon is normally delivered in a lowercase
    // file name. Do this after creating the global so that if an AMD module wants
    // to call noConflict to hide this version of avalon, it will work.

    // Note that for maximum portability, libraries that are not avalon should
    // declare themselves as anonymous modules, and avoid setting a global if an
    // AMD loader is present. avalon is a special case. For more information, see
    // https://github.com/jrburke/requirejs/wiki/Updating-existing-libraries#wiki-anon
    if (typeof define === "function" && define.amd) {
        define("avalon", [], function () {
            return avalon
        })
    }
    // Map over avalon in case of overwrite
    var _avalon = window.avalon
    avalon.noConflict = function (deep) {
        if (deep && window.avalon === avalon) {
            window.avalon = _avalon
        }
        return avalon
    }
    // Expose avalon identifiers, even in AMD
    // and CommonJS for browser emulators
    if (noGlobal === void 0) {
        window.avalon = avalon
    }
    return avalon

}));