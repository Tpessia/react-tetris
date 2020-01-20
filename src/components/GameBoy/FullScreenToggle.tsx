import React from 'react';
import FlatButton from '../FlatButton/FlatButton';
import fullScreenIcon from '../../assets/fullscreen.png';

interface Props {
    onClick: () => void
}

const FullScreenToggle: React.FC<Props> = props => {
    return (
        <FlatButton onClick={props.onClick} bg="transparent"
            style={{ padding: 0, borderRadius: '3px', position: 'absolute', right: 0, bottom: 0 }}>
            <img src={fullScreenIcon} alt="FullScreen" style={{ display: 'block', width: '25px', margin: '5px' }} />
        </FlatButton>
    )
}

export default FullScreenToggle;