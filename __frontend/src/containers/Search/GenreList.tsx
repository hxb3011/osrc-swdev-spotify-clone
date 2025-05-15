import { GenreSummriesType } from '../../types';
import { useNavigate } from 'react-router-dom';

export interface GenreListProps {
  genres: GenreSummriesType;
}

export default function GenreList(props: GenreListProps) {
  const navigate = useNavigate();
  return (
    <div style={{ padding: '0 16px' }}>
      <div className='text-7xl text-white font-bold' style={{ margin: '16px 0 32px' }}>Thể loại</div>
      <div className='flex flex-wrap' style={{ gap: '16px' }}>
        {props.genres.map((genre) => {
          return (
            <div className='text-5xl font-bold text-white rounded-xl cursor-pointer hover:opacity-70 duration-500'
              style={{ backgroundColor: genre.color, height: "240px", width: "240px", padding: "16px", wordBreak: 'break-word' }} key={genre.id}
              onClick={() => { navigate(`/genres/${genre.id}`) }}
            >{genre.title}</div>
          )
        })}
      </div>
    </div>
  );
}
