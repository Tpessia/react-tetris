import React, { useState } from 'react';
import './App.scss';
import GameBoy from './components/GameBoy/GameBoy';
import FullScreenToggle from './components/GameBoy/FullScreenToggle';
import GameBoyFull from './components/GameBoy/GameBoyLight';

const App: React.FC = () => {
  const [fullScreen,setFullScreen] = useState(false)

  return (
    <div style={{ position: 'relative' }}>
      {fullScreen ? <GameBoyFull /> : <GameBoy />}
      <FullScreenToggle onClick={() => setFullScreen(!fullScreen)} />
    </div>
  )
}

export default App;
