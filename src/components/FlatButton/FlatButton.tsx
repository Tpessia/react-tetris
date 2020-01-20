import React, { useState } from 'react';
import './FlatButton.scss';

interface Props extends React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> {
    bg?: string,
    hoverBg?: string
}

const FlatButton: React.FC<Props> = ({ bg, hoverBg, children, style, onMouseEnter, onMouseLeave, ...props }) => {
    const [hover,setHover] = useState(false)

    const backgroundColor = (() => {
        if (props.disabled) return '#ddd'
        if (hover && hoverBg) return hoverBg
        return bg ? bg : 'white'
    })()
    
    return (
        <button {...props}
            style={{
                ...style,
                backgroundColor,
                cursor: props.disabled ? 'default' : 'pointer'
            }}
            onMouseEnter={e => { setHover(true); onMouseEnter?.(e); }}
            onMouseLeave={e => { setHover(false); onMouseLeave?.(e); }}
        >
            {children}
        </button>
    )
}

export default FlatButton