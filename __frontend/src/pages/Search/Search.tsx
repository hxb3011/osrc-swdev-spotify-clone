import * as React from 'react';
import GenreList from '../../containers/Search/GenreList';
import SearchList from '../../containers/Search/SearchList';
import { getGenreList, searchTracks, searchPlaylists } from '../../api/trackApi';
import { GenreSummriesType, PlaylistDetail, PlaylistsType } from '../../types';
import { useParams } from 'react-router-dom';

export interface SearchProps {
}

export default function Search(props: SearchProps) {
  const [genres, setGenres] = React.useState<GenreSummriesType>([]);
  // the query from url. It will be updated when user write something in search bar
  const { query } = useParams<{ query: string }>();
  const [findedTracksPlaylist, setFindedTracksPlaylist] = React.useState<PlaylistDetail>();
  const [findedPlaylists, setFindedPlaylists] = React.useState<PlaylistsType>([]);

  // search tracks and playlists
  const search = React.useCallback((query: string) => {
    (async () => {
      const newFindedPlaylists = await searchPlaylists(query);
      const tracksResult = await searchTracks(query);
      setFindedPlaylists(newFindedPlaylists.data);
      // create a dummy playlist for found tracks
      const newFindedTracksPlaylist: PlaylistDetail = {
        id: 0,
        title: 'Search Result',
        tracks: tracksResult.data,
      }
      setFindedTracksPlaylist(newFindedTracksPlaylist);
    })()
  }, [])


  // search after 1.5s when user stop typing
  const currentSearchQuery = { value: query }
  React.useEffect(() => {
    const timer = setTimeout(() => {
      if (query && currentSearchQuery.value === query) {
        search(query);
      }
    }, 1500);
    return () => {
      clearTimeout(timer);
    }
  }, [query, currentSearchQuery.value, search])

  // get genre list
  React.useEffect(() => {
    getGenreList().then((res) => {
      setGenres(res.data);
    })
  }, [])

  // if there is a query, show search result, otherwise show genre list
  const contentJSX = React.useMemo(() => {
    if (query) {
      if (findedTracksPlaylist) {
        return (
          <SearchList trackPlaylist={findedTracksPlaylist} playlists={findedPlaylists} />
        )
      }
    } else {
      return (
        <GenreList genres={genres} />
      )
    }
  }, [ genres, findedPlaylists, findedTracksPlaylist, query])

  return (
    <div className='p-10'>
      {contentJSX}
    </div>
  );
}
