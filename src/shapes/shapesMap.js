/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */

import h from "../h";
import { default as Bit } from "./bit";
import { default as Custom } from "./custom";
import Circle from "./circle";
import Line from "./line";
import Zigzag from "./zigzag";
import Rect from "./rect";
import Polygon from "./polygon";
import Cross from "./cross";
import Curve from "./curve";
import Equal from "./equal";

class BitsMap {
  static initClass() {
    this.prototype.bit = Bit;
    this.prototype.custom = Custom;
    this.prototype.circle = Circle;
    this.prototype.line = Line;
    this.prototype.zigzag = Zigzag;
    this.prototype.rect = Rect;
    this.prototype.polygon = Polygon;
    this.prototype.cross = Cross;
    this.prototype.equal = Equal;
    this.prototype.curve = Curve;
  }
  constructor() {
    this.addShape = h.bind(this.addShape, this);
  }
  getShape(name) {
    return (
      this[name] ||
      h.error(
        `no \"${name}\" shape available yet, \
please choose from this list:`,
        [
          "circle",
          "line",
          "zigzag",
          "rect",
          "polygon",
          "cross",
          "equal",
          "curve",
        ]
      )
    );
  }

  /*
    Method to add shape to the map.
    @public
    @param {String} Name of the shape module.
    @param {Object} Shape module class.
  */
  addShape(name, Module) {
    return (this[name] = Module);
  }
}
BitsMap.initClass();

export default new BitsMap();
