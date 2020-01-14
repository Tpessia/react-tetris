import { Svg } from "@svgdotjs/svg.js";
import BaseShape from "./BaseShape";

export default function shapeBuilder<T extends BaseShape>(draw: Svg, shape: (new (draw: Svg) => T)) {
    return (new shape(draw))
}