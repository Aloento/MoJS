import { default as Bit } from "./bit";

class Cross extends Bit {
  // shape: 'path'
  _declareDefaults() {
    super._declareDefaults(...arguments);
    return (this._defaults.tag = "path");
  }
  _draw() {
    super._draw(...arguments);
    const p = this._props;
    const radiusX =
      this._props.radiusX != null ? this._props.radiusX : this._props.radius;
    const radiusY =
      this._props.radiusY != null ? this._props.radiusY : this._props.radius;

    const isRadiusX = radiusX === this._prevRadiusX;
    const isRadiusY = radiusY === this._prevRadiusY;
    // skip if nothing changed
    if (isRadiusX && isRadiusY) {
      return;
    }

    const x = this._props.width / 2;
    const y = this._props.height / 2;
    const x1 = x - radiusX;
    const x2 = x + radiusX;
    const line1 = `M${x1},${y} L${x2},${y}`;
    const y1 = y - radiusY;
    const y2 = y + radiusY;
    const line2 = `M${x},${y1} L${x},${y2}`;
    const d = `${line1} ${line2}`;
    this.el.setAttribute("d", d);

    // save the properties
    this._prevRadiusX = radiusX;
    return (this._prevRadiusY = radiusY);
  }

  _getLength() {
    const radiusX =
      this._props.radiusX != null ? this._props.radiusX : this._props.radius;
    const radiusY =
      this._props.radiusY != null ? this._props.radiusY : this._props.radius;
    return 2 * (radiusX + radiusY);
  }
}

export default Cross;
