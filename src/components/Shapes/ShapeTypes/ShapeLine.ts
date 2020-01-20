import BaseShape, { Rotation, ShapeType } from '../BaseShape';

export default class ShapeLine extends BaseShape {
    type = ShapeType.ShapeLine

    rotationShapes = {
        [Rotation.Up]: [
            [0,0,1,0],
            [0,0,2,0],
            [0,0,3,0],
            [0,0,4,0]
        ],
        [Rotation.Right]: [
            [0,0,0,0],
            [0,0,0,0],
            [1,2,3,4],
            [0,0,0,0]
        ],
        [Rotation.Bottom]: [
            [0,0,1,0],
            [0,0,2,0],
            [0,0,3,0],
            [0,0,4,0]
        ],
        [Rotation.Left]: [
            [0,0,0,0],
            [0,0,0,0],
            [1,2,3,4],
            [0,0,0,0]
        ]
    }
}