import BaseShape, { Rotation } from '../BaseShape';

export default class ShapeT extends BaseShape {
    rotationShapes = {
        [Rotation.Up]: [
            [0,1,0],
            [2,3,4],
            [0,0,0]
        ],
        [Rotation.Right]: [
            [0,2,0],
            [0,3,1],
            [0,4,0]
        ],
        [Rotation.Bottom]: [
            [0,0,0],
            [4,3,2],
            [0,1,0]
        ],
        [Rotation.Left]: [
            [0,4,0],
            [1,3,0],
            [0,2,0]
        ]
    }
}