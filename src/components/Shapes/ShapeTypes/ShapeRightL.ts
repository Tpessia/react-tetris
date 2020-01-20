import BaseShape, { Rotation, ShapeType } from '../BaseShape';

export default class ShapeRightL extends BaseShape {
    type = ShapeType.ShapeRightL
    
    rotationShapes = {
        [Rotation.Up]: [
            [0,4,0],
            [0,3,0],
            [0,2,1]
        ],
        [Rotation.Right]: [
            [0,0,0],
            [2,3,4],
            [1,0,0]
        ],
        [Rotation.Bottom]: [
            [1,2,0],
            [0,3,0],
            [0,4,0]
        ],
        [Rotation.Left]: [
            [0,0,1],
            [4,3,2],
            [0,0,0]
        ]
    }
}