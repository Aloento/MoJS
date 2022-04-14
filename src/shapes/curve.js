import Bit from "./bit";

class Curve extends Bit {
  /*
    Method to declare module's defaults.
    @private
    @overrides @ Bit
  */
  _declareDefaults() {
    super._declareDefaults();
    this._defaults.tag = "path";
  }

  /*
    Method to draw the module.
    @private
    @overrides @ Bit
  */
  _draw() {
    super._draw();
    let p = this._props;

    let radiusX = p.radiusX != null ? p.radiusX : p.radius;
    let radiusY = p.radiusY != null ? p.radiusY : p.radius;

    let isRadiusX = radiusX === this._prevRadiusX;
    let isRadiusY = radiusY === this._prevRadiusY;
    let isPoints = p.points === this._prevPoints;

    // skip if nothing changed
    if (isRadiusX && isRadiusY && isPoints) {
      return;
    }

    let x = p.width / 2;
    let y = p.height / 2;
    let x1 = x - radiusX;
    let x2 = x + radiusX;

    let d = `M${x1} ${y} Q ${x} ${y - 2 * radiusY} ${x2} ${y}`;

    // set the `d` attribute and save it to `_prevD`
    this.el.setAttribute("d", d);

    // save the properties
    this._prevPoints = p.points;
    this._prevRadiusX = radiusX;
    this._prevRadiusY = radiusY;
  }

  _getLength() {
    let p = this._props;

    let radiusX = p.radiusX != null ? p.radiusX : p.radius;
    let radiusY = p.radiusY != null ? p.radiusY : p.radius;

    let dRadius = radiusX + radiusY;
    let sqrt = Math.sqrt((3 * radiusX + radiusY) * (radiusX + 3 * radiusY));

    return 0.5 * Math.PI * (3 * dRadius - sqrt);
  }
}

export default Curve;
