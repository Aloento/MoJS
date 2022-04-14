/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter letiations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
import h from "../h";
import bezier from "./bezier-easing";
import PathEasing from "./path-easing";
import mix from "./mix";
import { default as approximate } from "./approximate";

const { sin } = Math;
const { PI } = Math;

class Easing {
  static initClass() {
    this.prototype.bezier = bezier;
    this.prototype.PathEasing = PathEasing;
    this.prototype.path = new PathEasing("creator").create;
    this.prototype.approximate = approximate;

    // EASINGS
    this.prototype.linear = {
      none(k) {
        return k;
      },
    };
    this.prototype.ease = {
      in: bezier.apply(this, [0.42, 0, 1, 1]),
      out: bezier.apply(this, [0, 0, 0.58, 1]),
      inout: bezier.apply(this, [0.42, 0, 0.58, 1]),
    };
    this.prototype.sin = {
      in(k) {
        return 1 - Math.cos((k * PI) / 2);
      },
      out(k) {
        return sin((k * PI) / 2);
      },
      inout(k) {
        return 0.5 * (1 - Math.cos(PI * k));
      },
    };
    this.prototype.quad = {
      in(k) {
        return k * k;
      },
      out(k) {
        return k * (2 - k);
      },
      inout(k) {
        if ((k *= 2) < 1) {
          return 0.5 * k * k;
        }
        return -0.5 * (--k * (k - 2) - 1);
      },
    };
    this.prototype.cubic = {
      in(k) {
        return k * k * k;
      },
      out(k) {
        return --k * k * k + 1;
      },
      inout(k) {
        if ((k *= 2) < 1) {
          return 0.5 * k * k * k;
        }
        return 0.5 * ((k -= 2) * k * k + 2);
      },
    };
    this.prototype.quart = {
      in(k) {
        return k * k * k * k;
      },
      out(k) {
        return 1 - --k * k * k * k;
      },
      inout(k) {
        if ((k *= 2) < 1) {
          return 0.5 * k * k * k * k;
        }
        return -0.5 * ((k -= 2) * k * k * k - 2);
      },
    };
    this.prototype.quint = {
      in(k) {
        return k * k * k * k * k;
      },
      out(k) {
        return --k * k * k * k * k + 1;
      },
      inout(k) {
        if ((k *= 2) < 1) {
          return 0.5 * k * k * k * k * k;
        }
        return 0.5 * ((k -= 2) * k * k * k * k + 2);
      },
    };
    this.prototype.expo = {
      in(k) {
        if (k === 0) {
          return 0;
        } else {
          return Math.pow(1024, k - 1);
        }
      },
      out(k) {
        if (k === 1) {
          return 1;
        } else {
          return 1 - Math.pow(2, -10 * k);
        }
      },
      inout(k) {
        if (k === 0) {
          return 0;
        }
        if (k === 1) {
          return 1;
        }
        if ((k *= 2) < 1) {
          return 0.5 * Math.pow(1024, k - 1);
        }
        return 0.5 * (-Math.pow(2, -10 * (k - 1)) + 2);
      },
    };
    this.prototype.circ = {
      in(k) {
        return 1 - Math.sqrt(1 - k * k);
      },
      out(k) {
        return Math.sqrt(1 - --k * k);
      },
      inout(k) {
        if ((k *= 2) < 1) {
          return -0.5 * (Math.sqrt(1 - k * k) - 1);
        }
        return 0.5 * (Math.sqrt(1 - (k -= 2) * k) + 1);
      },
    };
    this.prototype.back = {
      in(k) {
        const s = 1.70158;
        return k * k * ((s + 1) * k - s);
      },
      out(k) {
        const s = 1.70158;
        return --k * k * ((s + 1) * k + s) + 1;
      },
      inout(k) {
        const s = 1.70158 * 1.525;
        if ((k *= 2) < 1) {
          return 0.5 * (k * k * ((s + 1) * k - s));
        }
        return 0.5 * ((k -= 2) * k * ((s + 1) * k + s) + 2);
      },
    };
    this.prototype.elastic = {
      in(k) {
        let s = undefined;
        // a = 0.1
        const p = 0.4;
        if (k === 0) {
          return 0;
        }
        if (k === 1) {
          return 1;
        }
        // if a < 1
        const a = 1;
        s = p / 4;
        // else
        //   s = p * Math.asin(1 / a) / (2 * Math.PI)
        return -(
          a *
          Math.pow(2, 10 * (k -= 1)) *
          Math.sin(((k - s) * (2 * Math.PI)) / p)
        );
      },
      out(k) {
        let s = undefined;
        // a = 0.1
        const p = 0.4;
        if (k === 0) {
          return 0;
        }
        if (k === 1) {
          return 1;
        }
        // if not a or a < 1
        const a = 1;
        s = p / 4;
        // else
        //   s = p * Math.asin(1 / a) / (2 * Math.PI)
        return (
          a * Math.pow(2, -10 * k) * Math.sin(((k - s) * (2 * Math.PI)) / p) + 1
        );
      },
      inout(k) {
        let s = undefined;
        // a = 0.1
        const p = 0.4;
        if (k === 0) {
          return 0;
        }
        if (k === 1) {
          return 1;
        }
        // if not a or a < 1
        const a = 1;
        s = p / 4;
        // else
        //   s = p * Math.asin(1 / a) / (2 * Math.PI)
        if ((k *= 2) < 1) {
          return (
            -0.5 *
            (a *
              Math.pow(2, 10 * (k -= 1)) *
              Math.sin(((k - s) * (2 * Math.PI)) / p))
          );
        }
        return (
          a *
            Math.pow(2, -10 * (k -= 1)) *
            Math.sin(((k - s) * (2 * Math.PI)) / p) *
            0.5 +
          1
        );
      },
    };
    this.prototype.bounce = {
      in(k) {
        return 1 - easing.bounce.out(1 - k);
      },
      out(k) {
        if (k < 1 / 2.75) {
          return 7.5625 * k * k;
        } else if (k < 2 / 2.75) {
          return 7.5625 * (k -= 1.5 / 2.75) * k + 0.75;
        } else if (k < 2.5 / 2.75) {
          return 7.5625 * (k -= 2.25 / 2.75) * k + 0.9375;
        } else {
          return 7.5625 * (k -= 2.625 / 2.75) * k + 0.984375;
        }
      },
      inout(k) {
        if (k < 0.5) {
          return easing.bounce.in(k * 2) * 0.5;
        }
        return easing.bounce.out(k * 2 - 1) * 0.5 + 0.5;
      },
    };
  }
  // ---

  // Method to inverse the easing value
  // @param {Number} Value to inverse
  // @return {Number} Inversed value
  inverse(p) {
    return 1 - p;
  }

  // ---

  // Method to parse easing
  // @method parseEasing
  //
  // @param {String, Function, Array}
  //   - *String*: Easing name delimited by dot e.g "cubic.in" or "elastic.out"
  //     all avaliable options you can find at
  //     [easing module](easing.coffee.html) page.
  //   - *String*: SVG path coordinates in rectangle of 100x100
  //   - *Function*: function that recieve current time and returns modified one
  //     e.g. *function (k) { return k*k; }*. The function can be created by
  //     calling mojs.easing.bezier(0.55,0.085,0.68,0.53) or
  //     mojs.easing.path('M0,0 ...') function.
  //
  // @return {Function}
  parseEasing(easing) {
    if (easing == null) {
      easing = "linear.none";
    }

    const type = typeof easing;
    if (type === "string") {
      if (easing.charAt(0).toLowerCase() === "m") {
        return this.path(easing);
      } else {
        easing = this._splitEasing(easing);
        const easingParent = this[easing[0]];
        if (!easingParent) {
          h.error(`Easing with name \"${easing[0]}\" was not found, \
fallback to \"linear.none\" instead`);
          return this["linear"]["none"];
        }
        return easingParent[easing[1]];
      }
    }
    if (h.isArray(easing)) {
      return this.bezier.apply(this, easing);
    }
    if ("function") {
      return easing;
    }
  }
  // ---

  // Method to parse easing name string
  // @method splitEasing
  //
  // @param {String} easing name. All easing names can be found
  //                 at [easing module](easing.coffee.html) page.
  // @return {Array}
  _splitEasing(string) {
    if (typeof string === "function") {
      return string;
    }
    if (typeof string === "string" && string.length) {
      const split = string.split(".");
      const firstPart = split[0].toLowerCase() || "linear";
      const secondPart = split[1].toLowerCase() || "none";
      return [firstPart, secondPart];
    } else {
      return ["linear", "none"];
    }
  }
}
Easing.initClass();

let easing = new Easing();

easing.mix = mix(easing);

export default easing;
