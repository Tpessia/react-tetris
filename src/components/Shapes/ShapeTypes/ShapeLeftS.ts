import BaseShape, { Rotation, ShapeType } from '../BaseShape';

export default class ShapeLeftS extends BaseShape {
    type = ShapeType.ShapeLeftS

    rotationShapes = {
        [Rotation.Up]: [
            [0,0,1],
            [0,3,2],
            [0,4,0]
        ],
        [Rotation.Right]: [
            [0,0,0],
            [4,3,0],
            [0,2,1]
        ],
        [Rotation.Bottom]: [
            [0,4,0],
            [2,3,0],
            [1,0,0]
        ],
        [Rotation.Left]: [
            [1,2,0],
            [0,3,4],
            [0,0,0]
        ]
    }
}