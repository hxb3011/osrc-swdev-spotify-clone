import * as React from 'react';
import Player from '../../components/ActionbarItems/Player';
import VolumeControl from '../../components/ActionbarItems/VolumeControl';
import TrackInfo from '../../components/ActionbarItems/TrackInfo';

export interface ActionbarProps {
}

export default function Actionbar (props: ActionbarProps) {
  
  return (
    <div className='bg-zinc-800 flex justify-between items-center' style={{ 
      height: "120px",
      bottom: 0,
      gap: 16,
      left: 0,
      padding: "2px 8px",
      right: 0,
      width: "100%"
    }}>
      <div className='basis-2/12'><TrackInfo /></div>
      <div className='basis-4/12'><Player /></div>
      <div className='basis-2/12'><VolumeControl /></div>
    </div>
  );
}
