import BaseShape, { Rotation, ShapeType } from '../BaseShape';

export default class ShapeRightS extends BaseShape {
    type = ShapeType.ShapeRightS
    
    rotationShapes = {
        [Rotation.Up]: [
            [1,0,0],
            [2,3,0],
            [0,4,0]
        ],
        [Rotation.Right]: [
            [0,2,1],
            [4,3,0],
            [0,0,0]
        ],
        [Rotation.Bottom]: [
            [0,4,0],
            [0,3,2],
            [0,0,1]
        ],
        [Rotation.Left]: [
            [0,0,0],
            [0,3,4],
            [1,2,0]
        ]
    }
}