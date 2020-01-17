import BaseShape, { Rotation } from '../BaseShape';

export default class ShapeLeftL extends BaseShape {
    rotationShapes = {
        [Rotation.Up]: [
            [0,4,0],
            [0,3,0],
            [1,2,0]
        ],
        [Rotation.Right]: [
            [1,0,0],
            [2,3,4],
            [0,0,0]
        ],
        [Rotation.Bottom]: [
            [0,2,1],
            [0,3,0],
            [0,4,0]
        ],
        [Rotation.Left]: [
            [0,0,0],
            [4,3,2],
            [0,0,1]
        ]
    }
}