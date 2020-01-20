import styled from 'styled-components';

export const CanvasDevice = styled.div`
    display: flex;
`

export const CanvasWrapper = styled.div`
    position: relative;
`

export const CanvasOverlay = styled.div`
    position: absolute;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(0,0,0,0.75);
`

export const CanvasOverlayText = styled.div`
    font-weight: 700;
    color: #f5f5f5;
    font-size: 1.5rem;
`

export const CanvasScore = styled.div`
    font-family: monospace;
    position: absolute;
    right: 0;
    margin-right: 3px;
    top: 0;
    line-height: 1rem;
    font-size: 1rem;
`

export const CanvasNextShapeImg = styled.img`
    position: absolute;
    display: block;
    width: 30px;
    margin: 1px;
    opacity: 0.75;
    filter: sepia(0.5);
`

export const Canvas = styled.div`
    display: flex;
    border: 1px solid #000;
`