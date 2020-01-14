import { Svg } from '@svgdotjs/svg.js';
import configs from '../../GameCanvas/configs';
import BaseShape from '../BaseShape';

export default class ShapeSquare extends BaseShape {
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
        
    }
}