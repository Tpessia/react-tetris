import { Svg, Rect } from '@svgdotjs/svg.js';
import configs from '../GameCanvas/configs';

export type Rotation = 0 | 1 | 2 | 3

export default abstract class BaseShape {
    nested: Svg
    pixels: Rect[] = []

    rotation: Rotation = 0

    offset = configs.pixel.offset
    strokeWidth = configs.pixel.strokeWidth
    strokeColor = configs.pixel.strokeColor
    width = configs.pixel.width
    height = configs.pixel.height
    widthT = configs.pixel.widthT
    heightT = configs.pixel.heightT
    offsetX = this.width + this.strokeWidth
    offsetY = this.height + this.strokeWidth

    constructor(draw: Svg) {
        this.nested = draw.nested()
    }

    abstract rotate(): void
}