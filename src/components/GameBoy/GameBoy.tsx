import React, { useState } from 'react';
import GameCanvas from '../GameCanvas/GameCanvas';
import { GameBoyArrow, GameBoyArrowCenter, GameBoyArrowGroup, GameBoyBtnAction, GameBoyBtnActionGroup, GameBoyBtnState, GameBoyBtnStateGroup, GameBoyControls, GameBoyDevice, GameBoyFont, GameBoyFontWrapper, GameBoyScreen, GameBoyScreenWrapper } from './GameBoyStyles';

export enum Control {
    Up,
    Down,
    Left,
    Right,
    A,
    B,
    Select,
    Start
}

const GameBoy: React.FC = () => {
    const [control,setControl] = useState<{ control: Control } | null>(null)

    return (
        <GameBoyDevice>
            <GameBoyScreenWrapper>
                <GameBoyScreen>
                    <GameCanvas control={control} />
                </GameBoyScreen>
            </GameBoyScreenWrapper>
            <GameBoyControls>
                <GameBoyArrowGroup>
                    <GameBoyArrow onClick={() => setControl({ control: Control.Up })} style={{ display: 'block', marginLeft: '25px', borderRadius: '3px 3px 0 0' }} />
                    <GameBoyArrow onClick={() => setControl({ control: Control.Left })} style={{ borderRadius: '3px 0 0 3px' }} />
                    <GameBoyArrowCenter />
                    <GameBoyArrow onClick={() => setControl({ control: Control.Right })} style={{ borderRadius: '0 3px 3px 0' }} />
                    <GameBoyArrow onClick={() => setControl({ control: Control.Down })} style={{ display: 'block', marginLeft: '25px', borderRadius: '0 0 3px 3px' }} />
                </GameBoyArrowGroup>
                <GameBoyBtnActionGroup>
                    <GameBoyFontWrapper style={{ paddingTop: '65px' }}>
                        <GameBoyBtnAction onClick={() => setControl({ control: Control.A })} />
                        <GameBoyFont>A</GameBoyFont>
                    </GameBoyFontWrapper>
                    <GameBoyFontWrapper style={{ paddingTop: '85px', paddingRight: '15px' }}>
                        <GameBoyBtnAction onClick={() => setControl({ control: Control.B })} />
                        <GameBoyFont>B</GameBoyFont>
                    </GameBoyFontWrapper>
                </GameBoyBtnActionGroup>
                <GameBoyBtnStateGroup>
                    <GameBoyFontWrapper>
                        <GameBoyBtnState onClick={() => setControl({ control: Control.Select })} />
                        <GameBoyFont>SELECT</GameBoyFont>
                    </GameBoyFontWrapper>
                    <GameBoyFontWrapper>
                        <GameBoyBtnState onClick={() => setControl({ control: Control.Start })} />
                        <GameBoyFont>START</GameBoyFont>
                    </GameBoyFontWrapper>
                </GameBoyBtnStateGroup>
            </GameBoyControls>
        </GameBoyDevice>
    )
}

export default GameBoy;