// QQ Music sign generator - extracted from vendor.chunk.js
// Black-box reuse of JSVMP getSecuritySign

(function () {
  var n = {
    Object: Object,
    Array: Array,
    String: String,
    Number: Number,
    Boolean: Boolean,
    RegExp: RegExp,
    Math: Math,
    Date: Date,
    JSON: JSON,
    parseInt: parseInt,
    parseFloat: parseFloat,
    isNaN: isNaN,
    isFinite: isFinite,
    encodeURIComponent: encodeURIComponent,
    decodeURIComponent: decodeURIComponent,
    unescape: unescape,
    escape: escape,
    undefined: undefined,
    NaN: NaN,
    Infinity: Infinity,
    Function: Function,
    Error: Error,
    TypeError: TypeError,
    window: { Object: Object },
    navigator: {
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36"
    },
    location: {
      host: "y.qq.com",
      hostname: "y.qq.com",
      href: "https://y.qq.com/",
      protocol: "https:",
      pathname: "/n/ryqq_v2/songDetail/0004BoFH1kpYFC"
    },
    document: { cookie: "" },
    self: null
  };
  n.self = n;
  n.window = n;

  var r = (function () {
    function e(t, n, r, i, o, a, s, u) {
      var c = !i;
      t = +t;
      n = n || [0];
      i = i || [[this], [{}]];
      o = o || {};
      var l,
        f = [],
        h = null;
      Function.prototype.bind ||
        ((l = [].slice),
        (Function.prototype.bind = function (e) {
          if ("function" != typeof this) throw new TypeError("bind101");
          var t = l.call(arguments, 1),
            n = t.length,
            r = this,
            i = function () {},
            o = function () {
              return (
                (t.length = n),
                t.push.apply(t, arguments),
                r.apply(i.prototype.isPrototypeOf(this) ? this : e, t)
              );
            };
          return (
            this.prototype && (i.prototype = this.prototype),
            (o.prototype = new i()),
            o
          );
        }));
      for (
        var d = [
            function () {
              i[i.length - 2] = i[i.length - 2] + i.pop();
            },
            function () {
              for (
                var a = n[t++], s = [], u = n[t++], c = n[t++], l = [], f = 0;
                f < u;
                f++
              )
                s[n[t++]] = i[n[t++]];
              for (f = 0; f < c; f++) l[f] = n[t++];
              i.push(
                (function t() {
                  var i = s.slice(0);
                  (i[0] = [this]), (i[1] = [arguments]), (i[2] = [t]);
                  for (
                    var u = 0;
                    u < l.length && u < arguments.length;
                    u++
                  )
                    0 < l[u] && (i[l[u]] = [arguments[u]]);
                  return e(a, n, r, i, o);
                })
              );
            },
            function () {
              i[i.length - 2] = i[i.length - 2] | i.pop();
            },
            function () {
              i.push(i[n[t++]][0]);
            },
            function () {
              var e = n[t++],
                r = i[i.length - 2 - e];
              (i[i.length - 2 - e] = i.pop()), i.push(r);
            },
            ,
            function () {
              var e = n[t++],
                r = e ? i.slice(-e) : [];
              (i.length -= e), (e = i.pop()), i.push(e[0][e[1]].apply(e[0], r));
            },
            ,
            ,
            function () {
              var e = n[t++];
              i[i.length - 1] && (t = e);
            },
            function () {
              var e = n[t++],
                r = e ? i.slice(-e) : [];
              (i.length -= e),
                r.unshift(null),
                i.push(
                  (function () {
                    return (function (e, t, n) {
                      return new (Function.bind.apply(e, t))();
                    })(i.pop(), r);
                  })()
                );
            },
            function () {
              i[i.length - 2] = i[i.length - 2] - i.pop();
            },
            function () {
              var e = i[i.length - 2];
              e[0][e[1]] = i[i.length - 1];
            },
            ,
            function () {
              var e = n[t++];
              i[e] = void 0 === i[e] ? [] : i[e];
            },
            ,
            function () {
              i.push(!i.pop());
            },
            ,
            ,
            ,
            function () {
              i.push([n[t++]]);
            },
            function () {
              i[i.length - 1] = r[i[i.length - 1]];
            },
            ,
            function () {
              i.push("");
            },
            ,
            function () {
              i[i.length - 2] = i[i.length - 2] << i.pop();
            },
            ,
            function () {
              var e = i.pop();
              i.push([i[i.pop()][0], e]);
            },
            function () {
              i.push(i[i.pop()[0]][0]);
            },
            ,
            function () {
              i[i.length - 1] = n[t++];
            },
            function () {
              i[i.length - 2] = i[i.length - 2] >> i.pop();
            },
            ,
            function () {
              i.push(false);
            },
            function () {
              i[i.length - 2] = i[i.length - 2] > i.pop();
            },
            ,
            function () {
              i[i.length - 2] = i[i.length - 2] ^ i.pop();
            },
            function () {
              i.push([i.pop(), i.pop()].reverse());
            },
            function () {
              i.pop();
            },
            function () {
              i[i[i.length - 2][0]][0] = i[i.length - 1];
            },
            ,
            ,
            ,
            function () {
              i.push(i[i.length - 1]);
            },
            ,
            function () {
              return true;
            },
            function () {
              i.push([r, i.pop()]);
            },
            function () {
              var e = n[t++],
                o = e ? i.slice(-e) : [];
              (i.length -= e), i.push(i.pop().apply(r, o));
            },
            function () {
              i[i.length - 2] = i[i.length - 2] >= i.pop();
            },
            ,
            ,
            function () {
              i.length = n[t++];
            },
            ,
            function () {
              var e = i.pop(),
                t = i.pop();
              i.push([t[0][t[1]], e]);
            },
            ,
            function () {
              i[i.length - 2] = i[i.length - 2] & i.pop();
            },
            function () {
              t = n[t++];
            },
            ,
            function () {
              i[i.length - 1] += String.fromCharCode(n[t++]);
            },
            ,
            ,
            function () {
              i[i.length - 2] = i[i.length - 2] === i.pop();
            },
            function () {
              i.push(void 0);
            },
            function () {
              var e = i.pop();
              i.push(e[0][e[1]]);
            },
            ,
            function () {
              i.push(true);
            },
            ,
            function () {
              i[i.length - 2] = i[i.length - 2] * i.pop();
            },
            function () {
              i.push(n[t++]);
            },
            function () {
              i.push(typeof i.pop());
            },
          ];
          ;

        )
          try {
            for (var p = false; !p; ) p = d[n[t++]]();
            if (h) throw h;
            return c ? (i.pop(), i.slice(3 + e.v)) : i.pop();
          } catch (m) {
            var g = f.pop();
            if (void 0 === g) throw m;
            (h = m), (t = g[0]), (i.length = g[1]), g[2] && (i[g[2]][0] = h);
          }
    }
    return (
      (e.v = 5),
      e(
        0,
        (function (e) {
          var t = e[1],
            n = [],
            r = (function (e) {
              for (
                var t,
                  n,
                  r =
                    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/="
                      .split(""),
                  i = String(e).replace(/[=]+$/, ""),
                  o = 0,
                  a = 0,
                  s = "";
                (n = i.charAt(a++));
                ~n &&
                  ((t = o % 4 ? 64 * t + n : n), o++ % 4) &&
                  (s += String.fromCharCode(255 & (t >> ((-2 * o) & 6))))
              )
                n = (function (e, t, n) {
                  if ("function" == typeof Array.prototype.indexOf)
                    return Array.prototype.indexOf.call(e, t, n);
                  var r;
                  if (null == e)
                    throw new TypeError('"array" is null or not defined');
                  var i = Object(e),
                    o = i.length >>> 0;
                  if (0 == o) return -1;
                  if (o <= (n |= 0)) return -1;
                  for (
                    r = Math.max(0 <= n ? n : o - Math.abs(n), 0);
                    r < o;
                    r++
                  )
                    if (r in i && i[r] === t) return r;
                  return -1;
                })(r, n);
              return s;
            })(e[0]),
            i = t.shift(),
            o = t.shift(),
            a = 0;
          function s() {
            for (; a === i; )
              n.push(o), a++, (i = t.shift()), (o = t.shift());
          }
          for (var u = 0; u < r.length; u++) {
            var c = r.charAt(u).charCodeAt(0);
            s(), n.push(c), a++;
          }
          return s(), n;
        })([
          "MwgOAg4DDgQOBQ4GDgc4fzozCQ4CDgMOBA4FDgYOBw4IFzpkOmU6ZjppOm46ZRVFFzpmOnU6bjpjOnQ6aTpvOm49CUc4XzomFzpkOmU6ZjppOm46ZS4XOmE6bTpkNT8JaSYDAy8AOHwJJhc6ZDplOmY6aTpuOmUuAwMGASY+LQERAAEDOAMzCg4CDgMOBA4FDgYOBw4IDgkUCDg8MwgOAg4DDgQOBQ4GDgcXOmc6bDpvOmI6YTpsFUUXOnU6bjpkOmU6ZjppOm46ZTpkPRAJ1iY45gQmFzpnOmw6bzpiOmE6bBUtFzp3Omk6bjpkOm86dxVFFzp1Om46ZDplOmY6aTpuOmU6ZD0QCSY4BiYXOnc6aTpuOmQ6bzp3FS0XOnM6ZTpsOmYVRRc6dTpuOmQ6ZTpmOmk6bjplOmQ9EAkmOAEmFzpzOmU6bDpmFS0+LQGeAAAvACcmJhQJOA0zIg4CDgMOBA4FDgYOBw4IDgkOCg4LDgwODQ4ODg8OEA4RDhIOEw4UDhUOFg4XDhgOGQ4aDhsOHA4dDh4OHw4gFAkXOk86YjpqOmU6Yzp0FQoAKxc6MCVEAAwmJisXOjElRAEMJiYrFzoyJUQCDCYmKxc6MyVEAwwmJisXOjQlRAQMJiYrFzo1JUQFDCYmKxc6NiVEBgwmJisXOjclRAcMJiYrFzo4JUQIDCYmKxc6OSVECQwmJisXOkElRAoMJiYrFzpCJUQLDCYmKxc6QyVEDAwmJisXOkQlRA0MJiYrFzpFJUQODCYmKxc6RiVEI0QUCwwmJicmJhQKFzpBOkI6QzpEOkU6RjpHOkg6STpKOks6TDpNOk46TzpQOlE6UjpTOlQ6VTpWOlc6WDpZOlo6YTpiOmM6ZDplOmY6ZzpoOmk6ajprOmw6bTpuOm86cDpxOnI6czp0OnU6djp3Ong6eTp6OjA6MToyOjM6NDo1OjY6Nzo4Ojk6KzovOj0nJiYUCxQhFzpfOl86czppOmc6bjpfOmg6YTpzOmg6XzoyOjA6MjowOjA6MzowOjUbPwk4MyYhFCEXOl86XzpzOmk6ZzpuOl86aDphOnM6aDpfOjI6MDoyOjA6MDozOjA6NRsDAwYBBAAmFzp0Om86VTpwOnA6ZTpyOkM6YTpzOmUlBgAnJiYUDBc6dzppOm46ZDpvOncVRRc6bzpiOmo6ZTpjOnQ9CTgBJhc6bjphOnY6aTpnOmE6dDpvOnIVRRc6bzpiOmo6ZTpjOnQ9CTgDJhc6bDpvOmM6YTp0Omk6bzpuFUUXOm86YjpqOmU6Yzp0PScmJhQNAwwJOAomFzpSOmU6ZzpFOng6cBUXOkg6ZTphOmQ6bDplOnM6cxc6aS8CFzp0OmU6czp0JRc6bjphOnY6aTpnOmE6dDpvOnIuFzp1OnM6ZTpyOkE6ZzplOm46dDU/BgEnJiYUDhQhFzpfOl86cTptOmY6ZTpfOnM6aTpnOm46XzpjOmg6ZTpjOmsbP0QBPQkmAwwJOAkmAw0QCTg4Jhc6bDpvOmM6YTp0Omk6bzpuLhc6aDpvOnM6dDUXOmk6bjpkOmU6eDpPOmY1FzpxOnE6LjpjOm86bQYBRABEAQsiJyYmFA9BFzpBOnI6cjphOnkVCgArRAAlRC5EGQsMJiYrRAElRAQMJiYrRAIlRAkMJiYrRAMlRDVEGwsMJiYrRAQlRANEDQAMJiYrRAUlRABEFAAMJiYrRAYlRC9EFAsMJiYrRAclRC9EEQsMJiYXOm06YTpwJTgBMwsOAg4DDgQOBQ4GDgcOCBQJAwoJJgMDRAEAOAomAwMbPy0BAgEJCwoOAwYBFzpqOm86aTpuJQQAJhcGAScmJhQQFzpBOnI6cjphOnkVCgArRAAlRAZEDAAMJiYrRAElRAsMJiYrRAIlRAMMJiYrRAMlRAIMJiYrRAQlRAEMJiYrRAUlRAcMJiYrRAYlRAYMJiYrRAclRDlEIAsMJiYXOm06YTpwJTgxMwsOAg4DDgQOBQ4GDgcOCBQJAwoJJgMDRAEAOAEmAwMbPy0BAgEJCwoOAwYBFzpqOm86aTpuJRcGAScmJhQRFzpBOnI6cjphOnkVCgArRAAlRAhEEUQMQwAMJiYrRAElRAtEIgAMJiYrRAIlRDREHAAMJiYrRAMlRDxECAAMJiYrRAQlRA1EDkQNQwAMJiYrRAUlRAdEDEQNQwAMJiYrRAYlRAdEDUQMQwAMJiYrRAclRAtEEEQMQwAMJiYrRAglRAVECEQTQwAMJiYrRAklRApEDkQPQwAMJiYrRAolRBBEEUQOQwAMJiYrRAslRB1EPgAMJiYrRAwlRAxEEUMMJiYrRA0lRApERQAMJiYrRA4lRAdEYQAMJiYrRDxELQslRAYMJiYnJiYDDhAJJjgeJhQRFzpBOnI6cjphOnkVCgArRAAlRBVEBAAMJiYrRAElRBtEJwAMJiYrRAIlRAEMJiYrRAMlRDhEAgAMJiYrRAQlRANEVwAMJiYrRAUlRDVEGQAMJiYrRAYlRDlEQgAMJiYrRAclRBpELQAMJiYrRAglRCVEBAsMJiYrRAklRAwMJiYrRAolRAhECkQRQwAMJiYrRAslRDJEKwAMJiYrRAwlRCFEBwAMJiYrRA0lRApEDEQNQwAMJiYrRA4lRC5EEAAMJiYrRBFEAgslRAhED0QPQwAMJiYnJiYUEhc6QTpyOnI6YTp5FQoAJyYmFBNEACcmJhQTHEQTRAMLMBAJJjgUJhQUFAkUCwMTRAJDGz8bP0Q2RCYLQxQJFAsDE0QCQ0QBABs/Gz8AJyYmFBUUEQMTGz8nJiYUEhc6cDp1OnM6aBsDFAMVJAYBJhQTKxwrBAEEAEQBACcmHgAEAAImOEQUERQLFAkhJwQAJicEACYnJiYUHRcnJiYUHkQAJyYmFB4cRAUwEAkmOBQmFBYUEgMeRANDGz8nJiYUFxQSAx5EA0NEAQAbPycmJhQYFBIDHkQDQ0QCABs/JyYmFBkDFkQCHycmJhQaAxZEAzdEBBkDF0QEHwInJiYUGwMXRAVECgA3RAIZAxhEBh8CJyYmFBwDGEQ1RAoANycmJhQdAx0UCgMZGz8AFAoDGhs/ABQKAxsbPwAUCgMcGz8AJyYmFB4rHCsEAQQARAEAJyYeAAQAAiY4LxQdAx0UChQSRAhEBwAbP0QCHxs/ABQKFBJEC0QEABs/RAM3RAQZGz8AJyYmFBIhJyYmFB8UHRc6cjplOnA6bDphOmM6ZRsXOlI6ZTpnOkU6eDpwFRc6WzpcOi86KzpdFzpnLwIXBgInJiYUIBc6ejp6OmIDDwADHwADEAAnJiYUDxQQFB8UHRQKIScEACYnBAAmJwQAJicEACYnJiYUIBc6dDpvOkw6bzp3OmU6cjpDOmE6czplGwYALQEBASEIAycmJhQIFzpfOmc6ZTp0OlM6ZTpjOnU6cjppOnQ6eTpTOmk6ZzpuGwMJDCYmPi0BhwAALwEmPi0=",
          [
            133, 2628, 156, 340, 267, 272, 270, 288, 321, 326, 324, 338, 352,
            2575, 786, 790, 788, 869, 904, 908, 906, 944, 945, 949, 947, 983,
            991, 995, 993, 1085, 1133, 1217, 1138, 1142, 1140, 1146, 1147,
            1151, 1149, 1217, 1336, 1375, 1359, 1369, 1367, 1372, 1376, 1338,
            1508, 1547, 1531, 1541, 1539, 1544, 1548, 1510, 1813, 1818, 1816,
            2036, 2073, 2078, 2076, 2174, 2172, 2062, 2213, 2218, 2216, 2389,
            2387, 2205, 2576, 354,
          ],
        ]),
        n
      )
    );
  })();

  r.g = function () {
    return r.shift()[0];
  };

  n.__sign_hash_20200305 = function (e) {
    function t(e, t) {
      var n = (65535 & e) + (65535 & t);
      return (((e >> 16) + (t >> 16) + (n >> 16)) << 16) | (65535 & n);
    }
    function n(e, n, r, i, o, a) {
      return t(
        ((s = t(t(n, e), t(i, a))) << (u = o)) | (s >>> (32 - u)),
        r
      );
      var s, u;
    }
    function r(e, t, r, i, o, a, s) {
      return n((t & r) | (~t & i), e, t, o, a, s);
    }
    function i(e, t, r, i, o, a, s) {
      return n((t & i) | (r & ~i), e, t, o, a, s);
    }
    function o(e, t, r, i, o, a, s) {
      return n(t ^ r ^ i, e, t, o, a, s);
    }
    function a(e, t, r, i, o, a, s) {
      return n(r ^ (t | ~i), e, t, o, a, s);
    }
    function s(e) {
      return (function (e) {
        var t,
          n = "";
        for (t = 0; t < 32 * e.length; t += 8)
          n += String.fromCharCode((e[t >> 5] >>> (t % 32)) & 255);
        return n;
      })(
        (function (e, n) {
          (e[n >> 5] |= 128 << (n % 32)),
            (e[14 + (((n + 64) >>> 9) << 4)] = n);
          var s,
            u,
            c,
            l,
            f,
            h = 1732584193,
            d = -271733879,
            p = -1732584194,
            g = 271733878;
          for (s = 0; s < e.length; s += 16)
            (u = h),
              (c = d),
              (l = p),
              (f = g),
              (h = r(h, d, p, g, e[s], 7, -680876936)),
              (g = r(g, h, d, p, e[s + 1], 12, -389564586)),
              (p = r(p, g, h, d, e[s + 2], 17, 606105819)),
              (d = r(d, p, g, h, e[s + 3], 22, -1044525330)),
              (h = r(h, d, p, g, e[s + 4], 7, -176418897)),
              (g = r(g, h, d, p, e[s + 5], 12, 1200080426)),
              (p = r(p, g, h, d, e[s + 6], 17, -1473231341)),
              (d = r(d, p, g, h, e[s + 7], 22, -45705983)),
              (h = r(h, d, p, g, e[s + 8], 7, 1770035416)),
              (g = r(g, h, d, p, e[s + 9], 12, -1958414417)),
              (p = r(p, g, h, d, e[s + 10], 17, -42063)),
              (d = r(d, p, g, h, e[s + 11], 22, -1990404162)),
              (h = r(h, d, p, g, e[s + 12], 7, 1804603682)),
              (g = r(g, h, d, p, e[s + 13], 12, -40341101)),
              (p = r(p, g, h, d, e[s + 14], 17, -1502002290)),
              (h = i(
                h,
                (d = r(d, p, g, h, e[s + 15], 22, 1236535329)),
                p,
                g,
                e[s + 1],
                5,
                -165796510
              )),
              (g = i(g, h, d, p, e[s + 6], 9, -1069501632)),
              (p = i(p, g, h, d, e[s + 11], 14, 643717713)),
              (d = i(d, p, g, h, e[s], 20, -373897302)),
              (h = i(h, d, p, g, e[s + 5], 5, -701558691)),
              (g = i(g, h, d, p, e[s + 10], 9, 38016083)),
              (p = i(p, g, h, d, e[s + 15], 14, -660478335)),
              (d = i(d, p, g, h, e[s + 4], 20, -405537848)),
              (h = i(h, d, p, g, e[s + 9], 5, 568446438)),
              (g = i(g, h, d, p, e[s + 14], 9, -1019803690)),
              (p = i(p, g, h, d, e[s + 3], 14, -187363961)),
              (d = i(d, p, g, h, e[s + 8], 20, 1163531501)),
              (h = i(h, d, p, g, e[s + 13], 5, -1444681467)),
              (g = i(g, h, d, p, e[s + 2], 9, -51403784)),
              (p = i(p, g, h, d, e[s + 7], 14, 1735328473)),
              (h = o(
                h,
                (d = i(d, p, g, h, e[s + 12], 20, -1926607734)),
                p,
                g,
                e[s + 5],
                4,
                -378558
              )),
              (g = o(g, h, d, p, e[s + 8], 11, -2022574463)),
              (p = o(p, g, h, d, e[s + 11], 16, 1839030562)),
              (d = o(d, p, g, h, e[s + 14], 23, -35309556)),
              (h = o(h, d, p, g, e[s + 1], 4, -1530992060)),
              (g = o(g, h, d, p, e[s + 4], 11, 1272893353)),
              (p = o(p, g, h, d, e[s + 7], 16, -155497632)),
              (d = o(d, p, g, h, e[s + 10], 23, -1094730640)),
              (h = o(h, d, p, g, e[s + 13], 4, 681279174)),
              (g = o(g, h, d, p, e[s], 11, -358537222)),
              (p = o(p, g, h, d, e[s + 3], 16, -722521979)),
              (d = o(d, p, g, h, e[s + 6], 23, 76029189)),
              (h = o(h, d, p, g, e[s + 9], 4, -640364487)),
              (g = o(g, h, d, p, e[s + 12], 11, -421815835)),
              (p = o(p, g, h, d, e[s + 15], 16, 530742520)),
              (h = a(
                h,
                (d = o(d, p, g, h, e[s + 2], 23, -995338651)),
                p,
                g,
                e[s],
                6,
                -198630844
              )),
              (g = a(g, h, d, p, e[s + 7], 10, 1126891415)),
              (p = a(p, g, h, d, e[s + 14], 15, -1416354905)),
              (d = a(d, p, g, h, e[s + 5], 21, -57434055)),
              (h = a(h, d, p, g, e[s + 12], 6, 1700485571)),
              (g = a(g, h, d, p, e[s + 3], 10, -1894986606)),
              (p = a(p, g, h, d, e[s + 10], 15, -1051523)),
              (d = a(d, p, g, h, e[s + 1], 21, -2054922799)),
              (h = a(h, d, p, g, e[s + 8], 6, 1873313359)),
              (g = a(g, h, d, p, e[s + 15], 10, -30611744)),
              (p = a(p, g, h, d, e[s + 6], 15, -1560198380)),
              (d = a(d, p, g, h, e[s + 13], 21, 1309151649)),
              (h = a(h, d, p, g, e[s + 4], 6, -145523070)),
              (g = a(g, h, d, p, e[s + 11], 10, -1120210379)),
              (p = a(p, g, h, d, e[s + 2], 15, 718787259)),
              (d = a(d, p, g, h, e[s + 9], 21, -343485551)),
              (h = t(h, u)),
              (d = t(d, c)),
              (p = t(p, l)),
              (g = t(g, f));
          return [h, d, p, g];
        })(
          (function (e) {
            var t,
              n = [];
            for (n[(e.length >> 2) - 1] = void 0, t = 0; t < n.length; t += 1)
              n[t] = 0;
            for (t = 0; t < 8 * e.length; t += 8)
              n[t >> 5] |= (255 & e.charCodeAt(t / 8)) << (t % 32);
            return n;
          })(e),
          8 * e.length
        )
      );
    }
    function u(e) {
      return s(unescape(encodeURIComponent(e)));
    }
    return function (e) {
      var t,
        n,
        r = "";
      for (n = 0; n < e.length; n += 1)
        (t = e.charCodeAt(n)),
          (r +=
            "0123456789abcdef".charAt((t >>> 4) & 15) +
            "0123456789abcdef".charAt(15 & t));
      return r;
    }(u(e));
  };

  var getSecuritySign = n._getSecuritySign;
  delete n._getSecuritySign;

  // Export for Node.js
  if (typeof module !== "undefined" && module.exports) {
    module.exports = { getSecuritySign };
  }
})();
