import styled from "styled-components";

// 90 x 148
export const GameBoyDevice = styled.div`
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 30px;
    border-radius: 10px;
    background: #C4BEBB;
    border: 1px solid black;
`

export const GameBoyScreenWrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 25px 50px;
    background: #908D90;
    border-radius: 10px 10px 50px 10px;
    border: 1px solid black;
`

export const GameBoyScreen = styled.div`
    border: 1px solid black;
`

export const GameBoyFont = styled.div`
    font-weight: 700;
    color: #414187;
    font-size: 0.8rem;
`

export const GameBoyFontWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    transform: rotate(-20deg);
`

export const GameBoyControls = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    width: 100%;
    margin-bottom: 50px;
`

export const GameBoyArrowGroup = styled.div`
    font-size: 0;
    flex-basis: 50%;
    padding: 60px 0 0 10px;
`

export const GameBoyArrowCenter = styled.div`
    display: inline-block;
    background: #0a0a0a;
    width: 25px;
    height: 25px;
`

export const GameBoyArrow = styled.div`
    display: inline-block;
    background: black;
    width: 25px;
    height: 25px;
    cursor: pointer;
`

export const GameBoyLightArrowGroup = styled.div`
    font-size: 0;
    padding: 35px 0 55px;
`

export const GameBoyLightArrowCenter = styled.div`
    display: inline-block;
    background: #0a0a0a;
    width: 45px;
    height: 45px;
`

export const GameBoyLightArrow = styled.div`
    display: inline-block;
    background: black;
    width: 45px;
    height: 45px;
    cursor: pointer;
`

export const GameBoyBtnActionGroup = styled.div`
    display: flex;
    flex-direction: row-reverse;
    width: 50px;
    flex-basis: 50%;
    padding-right: 10px;
`

export const GameBoyBtnAction = styled.div`
    background: #981F55;
    width: 40px;
    height: 40px;
    border-radius: 20px;
    border: 1px solid black;
    cursor: pointer;
    margin-bottom: 5px;
`

export const GameBoyBtnStateGroup = styled.div`
    display: flex;
    justify-content: space-between;
    width: 100px;
    padding-top: 45px;
`

export const GameBoyBtnState = styled.div`
    background: #353535;
    width: 40px;
    height: 10px;
    border: 1px solid black;
    cursor: pointer;
    margin-bottom: 5px;
    border-radius: 5px;
`