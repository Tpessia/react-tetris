import { Rect, Svg } from '@svgdotjs/svg.js';
import { EnumDictionaryStrict } from '../../models/Dictionary';
import configs from '../GameCanvas/configs';
import getRandomInt from '../../utils/getRandomInt';

export enum ShapeType {
    ShapeLeftL = 'ShapeLeftL',
    ShapeRightL = 'ShapeRightL',
    ShapeLeftS = 'ShapeLeftS',
    ShapeRightS = 'ShapeRightS',
    ShapeLine = 'ShapeLine',
    ShapeSquare = 'ShapeSquare',
    ShapeT = 'ShapeT'
}

export enum Rotation {
    Up,
    Right,
    Bottom,
    Left
}

export type RotationShape = number[][]
export type RotationShapes = EnumDictionaryStrict<Rotation, RotationShape>

const rotations = Object.values(Rotation).filter(e => typeof(e) === 'number') as Rotation[]

export default abstract class BaseShape {
    abstract rotationShapes: RotationShapes

    abstract type: ShapeType

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

    get widthGap() {
        const shape = this.rotationShapes[this.rotation]
        let gap = 0

        for (let i in shape[0]) {
            let hasValue = false
            
            for (let j in shape) {
                if (shape[j][i] !== 0)
                    hasValue = true
            }

            if (!hasValue) gap++ 
        }
        
        return gap
    }

    get widthStartGap() {
        const shape = this.rotationShapes[this.rotation]
        let gap = 0

        for (let i in shape[0]) {
            let hasValue = false
            
            for (let j in shape) {
                if (shape[j][i] !== 0)
                    hasValue = true
            }

            if (!hasValue) gap++
            else break
        }
        
        return gap
    }

    get heightGap() {
        const shape = this.rotationShapes[this.rotation]
        let gap = 0

        for (let i in shape) {
            let hasValue = false
            
            for (let j in shape[0]) {
                if (shape[i][j] !== 0)
                    hasValue = true
            }

            if (!hasValue) gap++
        }
        
        return gap
    }

    get heightStartGap() {
        const shape = this.rotationShapes[this.rotation]
        let gap = 0

        for (let i in shape) {
            let hasValue = false
            
            for (let j in shape[0]) {
                if (shape[i][j] !== 0)
                    hasValue = true
            }

            if (!hasValue) gap++
            else break
        }
        
        return gap
    }

    get realWidth() {
        return this.nested.bbox().width + this.widthGap * this.widthT
    }
    
    get realStartWidth() {
        return this.nested.bbox().width + this.widthStartGap * this.widthT
    }

    get realHeight() {
        return this.nested.bbox().height + this.heightGap * this.heightT
    }
    
    get realStartHeight() {
        return this.nested.bbox().height + this.heightStartGap * this.heightT
    }

    protected render(matrix: RotationShape, create: boolean = false) {
        const pixels: Rect[] = []
        
        for (const i in matrix) {
            for (const j in matrix[i]) {
                const label = matrix[i][j]
                if (label !== 0) {
                    let rect = create ? this.nested.rect(this.width, this.height) : this.pixels[label-1]
                    rect = rect.x(+j * this.offsetX + this.offset).y(+i * this.offsetY + this.offset)
                    pixels.push(rect)
                }
            }
        }

        return pixels
    }

    build() {
        this.rotation = rotations[getRandomInt(0,rotations.length - 1)]

        this.pixels = this.render(this.rotationShapes[this.rotation], true)

        this.nested
            .fill(configs.pixel.backgroundColor)
            .stroke({ width: this.strokeWidth, color: this.strokeColor })

        return this
    }

    rotate() {
        this.rotation = this.rotation === Rotation.Left ? Rotation.Up : this.rotation+1
        this.pixels = this.render(this.rotationShapes[this.rotation])
    }
}