import { Rect, SVG, Svg } from '@svgdotjs/svg.js';
import update from 'immutability-helper';
import { cloneDeep } from 'lodash-es';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { GlobalHotKeys } from "react-hotkeys";
import { EnumDictionary } from '../../models/Dictionary';
import getRandomInt from '../../utils/getRandomInt';
import { Control } from '../GameBoy/GameBoy';
import BaseShape from '../Shapes/BaseShape';
import shapeBuilder, { ShapeClass } from '../Shapes/shapeBuilder';
import ShapeLeftL from '../Shapes/ShapeTypes/ShapeLeftL';
import ShapeLeftS from '../Shapes/ShapeTypes/ShapeLeftS';
import ShapeLine from '../Shapes/ShapeTypes/ShapeLine';
import ShapeRightL from '../Shapes/ShapeTypes/ShapeRightL';
import ShapeRightS from '../Shapes/ShapeTypes/ShapeRightS';
import ShapeSquare from '../Shapes/ShapeTypes/ShapeSquare';
import ShapeT from '../Shapes/ShapeTypes/ShapeT';
import configs from './configs';
import './GameCanvas.scss';
import { Canvas, CanvasDevice, CanvasNextShapeImg, CanvasOverlay, CanvasOverlayText, CanvasScore, CanvasWrapper } from './GameCanvasStyles';
const tetrisAudio = require('../../assets/tetris.mp3');

type Grid = ((Rect | undefined)[] | undefined)[]

interface Position {
    x: number,
    y: number,
    pixel: Rect
}

interface ShapeState {
    shape: BaseShape,
    active: boolean
}

interface Props {
    control: { control: Control } | null
}

const GameCanvas: React.FC<Props> = props => {
    const [ref, setRef] = useState<HTMLElement | null>(null)
    const [game, setGame] = useState({ score: 0, paused: true, ended: false })
    const grid = useRef<Grid>([])
    const [draw, setDraw] = useState<Svg | null>(null)
    let shapes = useRef<ShapeState[]>([])
    const [tick, setTick] = useState<{ available: boolean, count: number }>({
        available: true, count: 0
    })
    let audioRef = useRef<HTMLAudioElement | null>(null)
    const [lastControl,setLastControl] = useState<{ control: Control } | null>(null)
    const [sound,setSound] = useState<boolean>(true)
    const [nextShape,setNextShape] = useState<BaseShape | null>(null)

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

        return direction === 'down' ? collision || deltaCrash <= 0 : collision
    }, [grid])
    
    const calcDeltaCrash = (draw: Svg, shape: BaseShape) => {
        return draw.height() - (shape.nested.y() + shape.strokeWidth + shape.realStartHeight)
    }

    const fixPosition = useCallback((shape: BaseShape) => {
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
    }, [draw, checkColission])

    // STARTUP
    useEffect(() => {
        function startup() {
            if (ref && !draw) {
                let tempDraw = SVG().size(configs.container.width, configs.container.height)
    
                const canvas = tempDraw
                    .rect(configs.canvas.width, configs.canvas.height)
                    .fill(configs.canvas.backgroundColor)

                let pattern = tempDraw.pattern(configs.pixel.widthT, configs.pixel.heightT, add => {
                    add.rect(configs.pixel.widthT, configs.pixel.heightT)
                        .fill(configs.canvas.patternBG)
                    add.rect(configs.pixel.width, configs.pixel.height)
                        .x(configs.pixel.offset).y(configs.pixel.offset)
                        .fill(configs.canvas.patternInnerBG)
                        .stroke({
                            color: configs.canvas.patternStroke,
                            width: configs.canvas.patternWidth
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
            
            let shape: BaseShape
            if (nextShape === null) {
                shape = shapeBuilder(draw, rndShape)
                const newRndShape = shapes[getRandomInt(0,shapes.length-1)]
                setNextShape(new newRndShape(draw))
            } else {
                shape = nextShape.build()
                setNextShape(new rndShape(draw))
            }
            
            const rndX = getRandomInt(-shape.widthStartGap * shape.widthT, configs.canvas.width - shape.realStartWidth - shape.strokeWidth)
            const x = rndX - rndX % shape.widthT
            const y = - Math.floor(shape.rotationShapes[shape.rotation].length - shape.heightStartGap) * shape.heightT - shape.heightStartGap * shape.heightT

            shape.nested.x(x).y(y)

            return shape
        }

        if (draw && tick.available) {
            setTick({ ...tick, available: false })

            let newShapes: ShapeState[] | null = null
            let newGrid: Grid | null = null

            let active = shapes.current.find(e => e.active)
            
            if (active) {
                const positions = getPositions(active.shape)
                const collision = checkColission(draw, active.shape, 'down')
                
                // COLLISION
                if (collision) {
                    const ended = positions.some(p => p.y < 0)
                    
                    if (ended) {
                        audioRef.current?.pause()
                        setGame({ ...game, paused: false, ended: true })
                        return
                    }

                    newGrid = cloneDeep(grid.current)

                    for (let pos of positions) {
                        if (!newGrid[pos.y]) newGrid[pos.y] = []
                        newGrid[pos.y]![pos.x] = pos.pixel
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
            
            fixPosition(active.shape)

            const fullLines = newGrid?.reduce((acc,val,i) => {
                if (val && val.filter(e => !!e).length === configs.canvas.gridWidth) acc.push(i)
                return acc
            }, [] as number[]).reverse()
            
            if (fullLines) {
                let lineCount = 0
                for (let i of fullLines) {
                    i += lineCount
                    for (let j = 0; j < configs.canvas.gridWidth; j++) {
                        if (newGrid?.[i]?.[j]) {
                            newGrid[i]![j]!.remove()
                            newGrid[i]![j] = undefined
                        }
                    }

                    for (let j = i - 1; j >= 0; j--) {
                        if (newGrid?.[j]) {
                            newGrid[j]!.forEach(e => { if (e) e.y(e.y() + configs.pixel.heightT) })
                            newGrid[j+1] = newGrid[j]
                            newGrid[j] = undefined
                        }
                    }

                    lineCount++
                }

                if (fullLines.length > 0)
                    setGame({ ...game, score: game.score + Math.round(Math.pow(fullLines.length,1.75)) * 100 }) 
            }

            // setState em um unico lugar evita problema de state diferente em closure (https://stackoverflow.com/a/58877875)
            if (newShapes) shapes.current = newShapes
            if (newGrid) grid.current = newGrid
            
            let tickTime = 800 - game.score * (800/10000)
            tickTime = tickTime < 200 ? 200 : tickTime 
            
            setTimeout(() => setTick({
                available: true,
                count: tick.count + 1
            }), tickTime)
        }
    }, [tick, game, draw, fixPosition, checkColission, audioRef, nextShape])

    // CONTROLS
    const runActive = (run: (shape: BaseShape) => void) => {
        const active = shapes.current.find(e => e.active)
        if (active && !game.paused && !game.ended) run(active.shape)
    }

    const moveUp = () => {
        runActive(shape => {
            shape.rotate()
            fixPosition(shape)
        })
    }

    const moveDown = () => {
        runActive(shape => {
            const y = shape.nested.y()
            const h = shape.heightT
            if (draw && !checkColission(draw, shape, 'down'))
                shape.nested.y(y + h)
            fixPosition(shape)
        })
    }

    const moveLeft = () => {
        runActive(shape => {
            const x = shape.nested.x()
            const w = shape.widthT
            const nextPos = x - w
            if (nextPos >= -shape.widthStartGap * shape.widthT) {
                if (draw && !checkColission(draw, shape, 'left')) {
                    shape.nested.x(nextPos)
                }
            }
            fixPosition(shape)
        })
    }

    const moveRight = () => {
        runActive(shape => {
            const x = shape.nested.x()
            const w = shape.widthT
            const nextPos = x + w
            if (nextPos + shape.realStartWidth <= configs.canvas.width) {
                if (draw && !checkColission(draw, shape, 'right')) {
                    shape.nested.x(nextPos)
                }
            }
            fixPosition(shape)
        })
    }

    const togglePlay = () => {
        if (game.paused && sound) audioRef.current?.play()
        else audioRef.current?.pause()

        if (game.ended) {
            draw?.remove()
            setDraw(null)
            grid.current = []
            shapes.current = []
            setNextShape(null)
            setLastControl(null)
            setGame({ score: 0, paused: false, ended: false })
            setTick({ available: true, count: 0 })

            if (audioRef.current) {
                audioRef.current.currentTime = 0
                audioRef.current.play()
            }
        }
        else {
            setGame({ ...game, paused: !game.paused })
        }
    }

    const toggleSound = () => {
        if (sound) audioRef.current?.pause()
        else if (!game.paused) audioRef.current?.play()
        setSound(!sound)
    }

    const gameBoyMap: EnumDictionary<Control, () => void> = {
        [Control.Up]: moveUp,
        [Control.Down]: moveDown,
        [Control.Left]: moveLeft,
        [Control.Right]: moveRight,
        [Control.Start]: togglePlay,
        [Control.Select]: toggleSound
    }

    if (props.control && props.control !== lastControl) {
        setLastControl(props.control)
        const command = gameBoyMap[props.control.control]
        if (command) command()
    }

    const keyMap = {
        MOVE_UP: 'up',
        MOVE_DOWN: 'down',
        MOVE_LEFT: 'left',
        MOVE_RIGHT: 'right',
        SPACE: 'space'
    }
       
    const handlers = {
        MOVE_UP: (event: any) => moveUp(),
        MOVE_DOWN: (event: any) => moveDown(),
        MOVE_LEFT: (event: any) => moveLeft(),
        MOVE_RIGHT: (event: any) => moveRight(),
        SPACE: (event: any) => togglePlay()
    }

    return (
        <GlobalHotKeys allowChanges={true} keyMap={keyMap} handlers={handlers}>
            <audio ref={ref => audioRef.current = ref} src={tetrisAudio} loop />
            <CanvasDevice>
                <CanvasWrapper>
                    {nextShape ? <CanvasNextShapeImg src={`shapes/${nextShape.type}.png`} alt={nextShape.type} /> : <></>}
                    {nextShape ? <CanvasScore>{game.score}</CanvasScore> : <></>}
                    {game.ended ? (<CanvasOverlay><CanvasOverlayText>GAME OVER</CanvasOverlayText></CanvasOverlay>) : <></>}
                    <Canvas ref={ref => setRef(ref)} />
                </CanvasWrapper>
            </CanvasDevice>
        </GlobalHotKeys>
    )
}

export default GameCanvas;