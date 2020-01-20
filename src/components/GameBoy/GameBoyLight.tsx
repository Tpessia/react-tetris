import React, { useState } from 'react';
import GameCanvas from '../GameCanvas/GameCanvas';
import { Control } from './GameBoy';
import { GameBoyLightArrow, GameBoyLightArrowCenter, GameBoyLightArrowGroup } from './GameBoyStyles';
import styled from 'styled-components';
import FlatButton from '../FlatButton/FlatButton';
import playIcon from '../../assets/play.png';
import muteIcon from '../../assets/mute.png';

const LightDevice = styled.div`
    background: white;
    padding: 20px 20px 10px;
    display: flex;
    flex-direction: column;
    align-items: center;
`

const GameBoyLight: React.FC = () => {
    const [control,setControl] = useState<{ control: Control } | null>(null)

    return (
        <LightDevice>
            <GameCanvas control={control} />
            <GameBoyLightArrowGroup>
                <GameBoyLightArrow onClick={() => setControl({ control: Control.Up })} style={{ display: 'block', marginLeft: '45px', borderRadius: '3px 3px 0 0' }} />
                <GameBoyLightArrow onClick={() => setControl({ control: Control.Left })} style={{ borderRadius: '3px 0 0 3px' }} />
                <GameBoyLightArrowCenter />
                <GameBoyLightArrow onClick={() => setControl({ control: Control.Right })} style={{ borderRadius: '0 3px 3px 0' }} />
                <GameBoyLightArrow onClick={() => setControl({ control: Control.Down })} style={{ display: 'block', marginLeft: '45px', borderRadius: '0 0 3px 3px' }} />
            </GameBoyLightArrowGroup>
            <FlatButton onClick={() => setControl({ control: Control.Start })}
                style={{ position: 'absolute', bottom: 0, left: '0', margin: '1px' }}>
                <img src={playIcon} alt="Start" style={{ display: 'block', width: '25px' }} />
            </FlatButton>
            <FlatButton onClick={() => setControl({ control: Control.Select })}
                style={{ position: 'absolute', bottom: 0, left: '33px', margin: '1px' }}>
                <img src={muteIcon} alt="Mute" style={{ display: 'block', width: '25px' }} />
            </FlatButton>
        </LightDevice>
    )
}

export default GameBoyLight;