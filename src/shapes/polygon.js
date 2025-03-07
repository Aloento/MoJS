import h from "../h";

import { default as Bit } from "./bit";

class Polygon extends Bit {
  /*
    Method to declare defaults.
    @overrides @ Bit
  */
  _declareDefaults() {
    super._declareDefaults(...arguments);
    this._defaults.tag = "path";
    return (this._defaults.points = 3);
  }
  /*
    Method to draw the shape.
    @overrides @ Bit
  */
  _draw() {
    const p = this._props;

    const radiusX =
      this._props.radiusX != null ? this._props.radiusX : this._props.radius;
    const radiusY =
      this._props.radiusY != null ? this._props.radiusY : this._props.radius;

    const isRadiusX = radiusX === this._prevRadiusX;
    const isRadiusY = radiusY === this._prevRadiusY;
    const isPoints = p.points === this._prevPoints;
    // skip if nothing changed
    if (!(isRadiusX && isRadiusY && isPoints)) {
      let i;
      let asc, end;
      const step = 360 / this._props.points;
      // reuse radial points buffer
      if (this._radialPoints == null) {
        this._radialPoints = [];
      } else {
        this._radialPoints.length = 0;
      }

      for (
        i = 0, end = this._props.points, asc = 0 <= end;
        asc ? i < end : i > end;
        asc ? i++ : i--
      ) {
        this._radialPoints.push(
          h.getRadialPoint({
            radius: this._props.radius,
            radiusX: this._props.radiusX,
            radiusY: this._props.radiusY,
            rotate: i * step,
            center: { x: p.width / 2, y: p.height / 2 },
          })
        );
      }

      let d = "";
      for (i = 0; i < this._radialPoints.length; i++) {
        const point = this._radialPoints[i];
        const char = i === 0 ? "M" : "L";
        d += `${char}${point.x.toFixed(4)},${point.y.toFixed(4)} `;
      }

      // save the properties
      this._prevPoints = p.points;
      this._prevRadiusX = radiusX;
      this._prevRadiusY = radiusY;

      this.el.setAttribute("d", (d += "z"));
    }
    return super._draw(...arguments);
  }

  /*
    Method to get length of the shape.
    @overrides @ Bit
  */
  _getLength() {
    return this._getPointsPerimiter(this._radialPoints);
  }
}

export default Polygon;
