import configs from '../../GameCanvas/configs';
import BaseShape from '../BaseShape';
import { Svg } from '@svgdotjs/svg.js';

export default class ShapeL extends BaseShape {
    constructor(draw: Svg) {
        super(draw)
        this.build()
    }

    private build() {
        this.pixels.push(this.nested.rect(this.width, this.height)
            .x(0 + this.offset).y(0 + this.offset))
        this.pixels.push(this.nested.rect(this.width, this.height)
            .x(this.offsetX + this.offset).y(0 + this.offset))
        this.pixels.push(this.nested.rect(this.width, this.height)
            .x(this.offsetX * 2 + this.offset).y(0 + this.offset))
        this.pixels.push(this.nested.rect(this.width, this.height)
            .x(this.offsetX * 2 + this.offset).y(this.offsetY + this.offset))

        this.nested
            .fill(configs.pixel.backgroundColor)
            .stroke({ width: this.strokeWidth, color: this.strokeColor })

        return this.nested
    }

    rotate() {
        if (this.rotation === 0) {
            this.pixels[0].x(this.offsetX + this.offset).y(0 + this.offset)
            this.pixels[1].x(this.offsetX + this.offset).y(this.offsetY + this.offset)
            this.pixels[2].x(this.offsetX + this.offset).y(this.offsetY * 2 + this.offset)
            this.pixels[3].x(0 + this.offset).y(this.offsetY * 2 + this.offset)
        }

        this.rotation++
    }
}