import { Rect, SVG, Svg } from '@svgdotjs/svg.js';
import update from 'immutability-helper';
import { cloneDeep } from 'lodash-es';
import React, { useEffect, useState, useRef } from 'react';
import { HotKeys } from "react-hotkeys";
import getRandomInt from '../../utils/getRandomInt';
import BaseShape from '../Shapes/BaseShape';
import shapeBuilder from '../Shapes/shapeBuilder';
import ShapeL from '../Shapes/ShapeTypes/ShapeL';
import configs from './configs';
import './GameCanvas.scss';

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
    const [grid, setGrid] = useState<Rect[][]>([])
    const [draw, setDraw] = useState<Svg | null>(null)
    let shapes = useRef<ShapeState[]>([])
    const [tick, setTick] = useState<{ available: boolean, count: number }>({
        available: true, count: 0
    })

    const getPositions = (shape: Svg) => {
        const parentPosition = {
            x: shape.x() / configs.pixel.widthT,
            y: shape.y() / configs.pixel.heightT
        }
        
        const positions: Position[] = shape.children().map(s => {
            const rect = s as Rect
            const x = (rect.x() - configs.pixel.offset) / configs.pixel.widthT
            const y = (rect.y() - configs.pixel.offset) / configs.pixel.heightT
            return {
                x: x + parentPosition.x,
                y: y + parentPosition.y,
                pixel: rect
            }
        })
        
        return positions
    }

    const checkColission = (draw: Svg, shape: Svg, delta: number = 0, positions?: Position[]) => {
        let collision = false

        if (!positions) positions = getPositions(shape)
        
        for (let pos of positions) {
            if (grid[pos.y+1]?.[pos.x]) {
                collision = true
            }
        }

        const deltaCrash = calcDeltaCrash(draw, shape) - delta

        return collision || deltaCrash <= 0
    }

    const calcDeltaCrash = (draw: Svg, shape: Svg) => {
        return draw.height() - (shape.y() + configs.pixel.strokeWidth + shape.bbox().height)
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
            const shape = shapeBuilder(draw, ShapeL)
                
            const rndX = getRandomInt(0, configs.canvas.width - shape.nested.bbox().width)
            const x = 0//rndX - rndX % configs.pixel.widthT
            const y = -configs.pixel.heightT * 2

            shape.nested.x(x).y(y)

            return shape
        }

        if (draw && tick.available) {
            setTick({ ...tick, available: false })

            let newShapes: ShapeState[] | null = null
            let newGrid: Rect[][] | null = null

            let active = shapes.current.find(e => e.active)
            
            if (active) {
                const positions = getPositions(active.shape.nested)
                const collision = checkColission(draw, active.shape.nested, 0, positions)
                
                // COLLISION
                if (collision) {
                    const ended = positions.some(p => p.y < 0)

                    if (ended) {
                        setGame({ ...game, ended: true })
                        return
                    }

                    newGrid = cloneDeep(grid)

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
            if (newGrid) setGrid(newGrid)

            console.log('s1',shapes)

            if (tick.count < 100)
                setTimeout(() => setTick({
                    available: true,
                    count: tick.count + 1
                }), 1000)
        }
    }, [tick, draw, shapes, game, grid])

    // CONTROLS
    const runActive = (run: (shape: BaseShape) => void) => {
        console.log('s2',shapes)
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
            runActive(shape => shape.rotate())
        },
        MOVE_DOWN: (event: any) => {
            runActive(shape => {
                const y = shape.nested.y()
                const h = configs.pixel.heightT
                if (draw && checkColission(draw, shape.nested.y(y + h), configs.pixel.heightT)) {
                    shape.nested.y(y)
                }
            })
        },
        MOVE_LEFT: (event: any) => {
            runActive(shape => {
                const x = shape.nested.x()
                const w = configs.pixel.widthT
                const nextPos = x - w
                if (nextPos >= 0) {
                    if (draw && checkColission(draw, shape.nested.x(nextPos))) {
                        shape.nested.x(x)
                    }
                }
            })
        },
        MOVE_RIGHT: (event: any) => {
            runActive(shape => {
                const x = shape.nested.x()
                const w = configs.pixel.widthT
                const nextPos = x + w
                if (nextPos + shape.nested.bbox().width <= configs.canvas.width) {
                    if (draw && checkColission(draw, shape.nested.x(nextPos))) {
                        shape.nested.x(x)
                    }
                }
            })
        }
    }

    return (
        <>
            <HotKeys keyMap={keyMap} handlers={handlers} >
                <div ref={ref => setRef(ref)}></div>
            </HotKeys>
        </>
    )
}

export default GameCanvas;