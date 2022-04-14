import { default as Bit } from "./bit";

class Rect extends Bit {
  // shape:   'rect'
  // ratio:   1.43
  _declareDefaults() {
    super._declareDefaults(...arguments);
    this._defaults.tag = "rect";
    this._defaults.rx = 0;
    return (this._defaults.ry = 0);
  }
  // this._defaults.ratio = 1.43
  _draw() {
    super._draw(...arguments);
    const p = this._props;
    const radiusX = p.radiusX != null ? p.radiusX : p.radius;
    const radiusY = p.radiusY != null ? p.radiusY : p.radius;
    this._setAttrIfChanged("width", 2 * radiusX);
    this._setAttrIfChanged("height", 2 * radiusY);
    this._setAttrIfChanged("x", p.width / 2 - radiusX);
    this._setAttrIfChanged("y", p.height / 2 - radiusY);
    this._setAttrIfChanged("rx", p.rx);
    return this._setAttrIfChanged("ry", p.ry);
  }

  _getLength() {
    const radiusX =
      this._props.radiusX != null ? this._props.radiusX : this._props.radius;
    const radiusY =
      this._props.radiusY != null ? this._props.radiusY : this._props.radius;
    return 2 * (2 * radiusX + 2 * radiusY);
  }
}

export default Rect;
