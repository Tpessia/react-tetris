import { Rect, SVG, Svg } from '@svgdotjs/svg.js';
import update from 'immutability-helper';
import { cloneDeep } from 'lodash-es';
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { HotKeys } from "react-hotkeys";
import getRandomInt from '../../utils/getRandomInt';
import BaseShape from '../Shapes/BaseShape';
import shapeBuilder, { ShapeClass } from '../Shapes/shapeBuilder';
import configs from './configs';
import './GameCanvas.scss';
import ShapeLeftL from '../Shapes/ShapeTypes/ShapeLeftL';
import ShapeLeftS from '../Shapes/ShapeTypes/ShapeLeftS';
import ShapeLine from '../Shapes/ShapeTypes/ShapeLine';
import ShapeRightL from '../Shapes/ShapeTypes/ShapeRightL';
import ShapeRightS from '../Shapes/ShapeTypes/ShapeRightS';
import ShapeSquare from '../Shapes/ShapeTypes/ShapeSquare';
import ShapeT from '../Shapes/ShapeTypes/ShapeT';

interface Position {
    x: number,
    y: number,
    pixel: Rect
}

interface ShapeState {
    shape: BaseShape,
    active: boolean
}

const GameCanvas: React.FC = () => {
    const [ref, setRef] = useState<HTMLElement | null>(null)
    const [game, setGame] = useState({ score: 0, paused: false, ended: false })
    const grid = useRef<Rect[][]>([])
    const [draw, setDraw] = useState<Svg | null>(null)
    let shapes = useRef<ShapeState[]>([])
    const [tick, setTick] = useState<{ available: boolean, count: number }>({
        available: true, count: 0
    })

    const getPositions = (shape: BaseShape) => {
        const parentPosition = {
            x: shape.nested.x() / shape.widthT,
            y: shape.nested.y() / shape.heightT
        }
        
        const positions: Position[] = shape.nested.children().map(s => {
            const rect = s as Rect
            const x = (rect.x() - shape.offset) / shape.widthT
            const y = (rect.y() - shape.offset) / shape.heightT
            return {
                x: x + parentPosition.x,
                y: y + parentPosition.y,
                pixel: rect
            }
        })
        
        return positions
    }

    const checkColission = useCallback((draw: Svg, shape: BaseShape, direction: 'left' | 'down' | 'right', delta: number = 0) => {
        let collision = false

        let positions = getPositions(shape)
        
        for (let pos of positions) {
            if ((direction === 'down' && !!grid.current[pos.y+1]?.[pos.x]) ||
                (direction === 'left' && !!grid.current[pos.y]?.[pos.x-1]) ||
                (direction === 'right' && !!grid.current[pos.y]?.[pos.x+1])) {
                collision = true
            }
        }

        const deltaCrash = calcDeltaCrash(draw, shape) - delta

        return collision || deltaCrash <= 0
    }, [grid])
    
    const calcDeltaCrash = (draw: Svg, shape: BaseShape) => {
        return draw.height() - (shape.nested.y() + shape.strokeWidth + shape.realStartHeight)
    }

    // STARTUP
    useEffect(() => {
        function startup() {
            if (ref && !draw) {
                let tempDraw = SVG().size(configs.container.width, configs.container.height)
    
                const canvas = tempDraw
                    .rect(configs.canvas.width, configs.canvas.height)
                    .fill(configs.canvas.backgroundColor)
    
                let pattern = tempDraw.pattern(configs.pixel.widthT, configs.pixel.heightT, add => {
                    add.rect(configs.pixel.width, configs.pixel.height)
                        .x(configs.pixel.offset).y(configs.pixel.offset)
                        .fill('transparent')
                        .stroke({
                            color: 'red',
                            width: configs.pixel.strokeWidth / 2
                        })
    
                    // const width = configs.pixel.widthT - 1
                    // const height = configs.pixel.heightT - 1
    
                    // add.line(0, 0, width, 0)
                    //     .stroke({ color: 'red', width: 2 })
                    // add.line(width, 0, width, height)
                    //     .stroke({ color: 'red', width: 2 })
                    // add.line(width, height, 0, height)
                    //     .stroke({ color: 'red', width: 2 })
                    // add.line(0, height, 0, 0)
                    //     .stroke({ color: 'red', width: 2 })
                })
    
                canvas.fill(pattern)
    
                tempDraw.addTo(ref)
    
                setDraw(tempDraw)
            }
        }

        startup()
    }, [ref, draw])

    // TICK
    useEffect(() => {
        if (game.paused || game.ended) return

        function createNewShape(draw: Svg) {
            const shapes: ShapeClass[] = [ShapeLeftL,ShapeLeftS,ShapeLine,ShapeRightL,ShapeRightS,ShapeSquare,ShapeT]
            const rndShape = shapes[getRandomInt(0,shapes.length-1)]
            const shape = shapeBuilder(draw, rndShape)
            
            const rndX = getRandomInt(-shape.widthStartGap * shape.widthT, configs.canvas.width - shape.realStartWidth - shape.strokeWidth)
            const x = rndX - rndX % shape.widthT
            const y = - Math.floor(shape.rotationShapes[shape.rotation].length - shape.heightStartGap) * shape.heightT - shape.heightStartGap * shape.heightT

            shape.nested.x(x).y(y)

            return shape
        }

        if (draw && tick.available) {
            setTick({ ...tick, available: false })

            let newShapes: ShapeState[] | null = null
            let newGrid: Rect[][] | null = null

            let active = shapes.current.find(e => e.active)
            
            if (active) {
                const positions = getPositions(active.shape)
                const collision = checkColission(draw, active.shape, 'down')
                
                // COLLISION
                if (collision) {
                    const ended = positions.some(p => p.y < 0)

                    if (ended) {
                        setGame({ ...game, ended: true })
                        return
                    }

                    newGrid = cloneDeep(grid.current)

                    for (let pos of positions) {
                        if (!newGrid[pos.y]) newGrid[pos.y] = []
                        newGrid[pos.y][pos.x] = pos.pixel
                    }

                    const index = shapes.current.indexOf(active)
                    
                    newShapes = update(shapes.current, {
                        [index]: {
                            active: { $set: false }
                        }
                    })

                    active = undefined
                }
            }

            if (!active) {
                const shape = createNewShape(draw)

                active = {
                    active: true,
                    shape: shape
                }

                newShapes = newShapes ? [...newShapes, active] : [...shapes.current, active]
            }

            active.shape.nested.y(active.shape.nested.y() + configs.pixel.heightT)

            // setState em um unico lugar evita problema de state diferente em closure (https://stackoverflow.com/a/58877875)
            if (newShapes) shapes.current = newShapes
            if (newGrid) grid.current = newGrid

            if (tick.count < 100)
                setTimeout(() => setTick({
                    available: true,
                    count: tick.count + 1
                }), 1000)
        }
    }, [tick, draw, shapes, game, grid, checkColission])

    // CONTROLS
    const runActive = (run: (shape: BaseShape) => void) => {
        const active = shapes.current.find(e => e.active)
        if (active) run(active.shape)
    }

    const keyMap = {
        MOVE_UP: 'up',
        MOVE_DOWN: 'down',
        MOVE_LEFT: 'left',
        MOVE_RIGHT: 'right'
    }
       
    const handlers = {
        MOVE_UP: (event: any) => {
            runActive(shape => {
                shape.rotate()
                if (shape.nested.x() < -shape.widthStartGap * shape.widthT)
                    shape.nested.x(shape.widthStartGap * shape.widthT)
                else if (shape.nested.x() + shape.realStartWidth > configs.canvas.width)
                    shape.nested.x(configs.canvas.width - shape.realStartWidth - shape.strokeWidth)
                else {
                    const y = shape.nested.y()
                    shape.nested.y(shape.nested.y() - shape.heightT)
                    if (draw && !checkColission(draw, shape, 'down'))
                        shape.nested.y(y)
                }
            })
        },
        MOVE_DOWN: (event: any) => {
            runActive(shape => {
                const y = shape.nested.y()
                const h = shape.heightT
                if (draw && !checkColission(draw, shape, 'down')) {
                    shape.nested.y(y + h)
                }
            })
        },
        MOVE_LEFT: (event: any) => {
            runActive(shape => {
                const x = shape.nested.x()
                const w = shape.widthT
                const nextPos = x - w
                if (nextPos >= -shape.widthStartGap * shape.widthT) {
                    if (draw && !checkColission(draw, shape, 'left')) {
                        shape.nested.x(nextPos)
                    }
                }
            })
        },
        MOVE_RIGHT: (event: any) => {
            runActive(shape => {
                const x = shape.nested.x()
                const w = shape.widthT
                const nextPos = x + w
                if (nextPos + shape.realStartWidth <= configs.canvas.width) {
                    if (draw && !checkColission(draw, shape, 'right')) {
                        shape.nested.x(nextPos)
                    }
                }
            })
        }
    }

    return (
        <HotKeys keyMap={keyMap} handlers={handlers}>
            <div ref={ref => setRef(ref)}></div>
        </HotKeys>
    )
}

export default GameCanvas;