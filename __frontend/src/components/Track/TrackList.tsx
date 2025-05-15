import * as React from 'react';
import { Track, TracksType } from '../../types';
import TrackItem from './TrackItem';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

export interface TrackListProps {
    tracks: TracksType,
    onChangeTrack: (track: Track) => void
}

export default function TrackList(props: TrackListProps) {
    return (
        <div>
            <div className='grid grid-cols-12 text-white font-bold bg-stone-900 p-4'>
                <div className='col-span-1 flex justify-center' style={{ padding: "8px" }}>#</div>
                <div className='col-span-5 flex justify-center' style={{ padding: "8px" }}>Tên</div>
                <div className='col-span-3 flex justify-center' style={{ padding: "8px" }}>Thể loại</div>
                <div className='col-span-1 flex justify-center' style={{ padding: "8px" }}></div>
                <div className='col-span-1 flex justify-center' style={{ padding: "8px" }}><AccessTimeIcon /></div>
            </div>
            <div>
                {props.tracks.map((track, index) => {
                    return <TrackItem key={track.id} index={index + 1} track={track} onPlay={() => props.onChangeTrack(track)} />
                })}
            </div>
        </div>
    );
}
