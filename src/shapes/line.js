import { default as Bit } from "./bit";

class Line extends Bit {
  _declareDefaults() {
    super._declareDefaults(...arguments);
    return (this._defaults.tag = "line");
  }
  _draw() {
    const radiusX =
      this._props.radiusX != null ? this._props.radiusX : this._props.radius;
    const x = this._props.width / 2;
    const y = this._props.height / 2;
    this._setAttrIfChanged("x1", x - radiusX);
    this._setAttrIfChanged("x2", x + radiusX);
    this._setAttrIfChanged("y1", y);
    this._setAttrIfChanged("y2", y);
    return super._draw(...arguments);
  }
}

export default Line;
