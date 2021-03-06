import { Svg } from "@svgdotjs/svg.js";
import BaseShape from "./BaseShape";

export type ShapeClass = new (draw: Svg) => BaseShape

export default function shapeBuilder(draw: Svg, shape: ShapeClass) {
    return (new shape(draw)).build()
}