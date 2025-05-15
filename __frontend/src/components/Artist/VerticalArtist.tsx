import * as React from 'react';
import { Artist } from '../../types';
import { useNavigate } from 'react-router-dom';

export interface VerticalArtistProps {
  artist: Artist
}

export default function VerticalArtist(props: VerticalArtistProps) {
  const navigate = useNavigate();
  return (
    <div onClick={() => navigate(`/artists/${props.artist.id}`)} className='flex flex-col rounded-lg p-6 bg-neutral-700/70 hover:bg-neutral-600/50 duration-300 cursor-pointer'>
      <div className='flex justify-center'>
        <img style={{ width: 150, height: 150 }} className='rounded-full object-cover object-center' src={props.artist.image} alt="" />
      </div>
      <div className='flex flex-col items-center' style={{ padding: "8px 16px 16px" }}>
        <div className='text-white font-bold text-lg mt-3'>{props.artist.first_name} {props.artist.last_name}</div>
        <div className='text-white'>Nghệ sĩ</div>
      </div>
    </div>
  );
}
