import React, { useState } from 'react';
import './FlatButton.scss';

interface Props extends React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> {
    color?: string,
    hovercolor?: string
}

const FlatButton: React.FC<Props> = ({ children, ...props }) => {
    const [state,setState] = useState({
        hover: false,
        focus: false
    })

    
    const active = () => state.hover || state.focus
    
    return (
        <button {...props}
            style={{
                backgroundColor: active() && props.hovercolor ? props.hovercolor : (props.color ? props.color : 'white')
            }}
            onMouseEnter={() => setState({ ...state, hover: true })}
            onMouseLeave={() => setState({ ...state, hover: false })}
            onFocus={() => setState({ ...state, focus: true })}
            onBlur={() => setState({ ...state, focus: false })}
        >
            {children}
        </button>
    )
}

export default FlatButton