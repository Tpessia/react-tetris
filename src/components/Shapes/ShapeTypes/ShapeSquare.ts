import BaseShape, { Rotation } from '../BaseShape';

export default class ShapeSquare extends BaseShape {
    rotationShapes = {
        [Rotation.Up]: [
            [1,2],
            [3,4]
        ],
        [Rotation.Right]: [
            [3,1],
            [4,2]
        ],
        [Rotation.Bottom]: [
            [4,3],
            [2,1]
        ],
        [Rotation.Left]: [
            [2,4],
            [1,3]
        ]
    }
}