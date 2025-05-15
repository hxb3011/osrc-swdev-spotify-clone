import React from 'react';
import './App.css';
import { Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home/Home';
import Search from './pages/Search/Search';
import Register from './pages/Register/Register';
import Login from './pages/Login/Login';
import Profile from './containers/Profile/Profile';
import { useAppDispatch, useAppSelector } from './store/reduxhooks';
import { checkAuthAction } from './store/slices/authSlice';
import PlaylistPage from './pages/PlaylistPage/PlaylistPage';
import { loadStoredPlaylist } from './store/slices/playlistSlice';
import LikedTracksPage from './pages/LikedTracksPage/LikedTracksPage';
import GenrePage from './pages/GenrePage/GenrePage';
import ArtistPage from './pages/ArtistPage/ArtistPage';
import Actionbar from './containers/Actionbar/Actionbar'
import Navbar from './containers/Navbar/Navbar'
import Sidebar from './containers/Sidebar/Sidebar'
import { Snackbar, Alert, createTheme, ThemeProvider } from '@mui/material'
import { closeToast } from './store/slices/notificationSlice'

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

function App() {
  const { authStatus } = useAppSelector(state => state.auth)
  const dispatch = useAppDispatch()

  // Checking autthenication status and loading stored playlist
  React.useEffect(() => {
    dispatch(checkAuthAction())
  }, [dispatch])

  React.useEffect(() => {
    // load playlist from local storage if user is logged in.
    if (authStatus === 'loggedIn')
      dispatch(loadStoredPlaylist())
  }, [authStatus, dispatch])

  const { open: toastOpen, type: toastType, message: toastMessage } = useAppSelector(state => state.notification.toast)

  const toastClose = () => { dispatch(closeToast()) }
  const isLoggedIn = useAppSelector((state) => state.auth.authStatus) === 'loggedIn';

  const routes = React.useMemo(() => {
    if (authStatus === 'loggedIn') {
      return (
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/playlists/:id/' element={<PlaylistPage />} />
          <Route path='/playlists/:id/update/' element={<PlaylistPage />} />
          <Route path='/search/' element={<Search />} />
          <Route path='/search/:query/' element={<Search />} />
          <Route path='/genres/:genreId/' element={<GenrePage />} />
          <Route path='/profile/' element={<Profile />} />
          <Route path='/artists/:artistId' element={<ArtistPage />} />
          <Route path='/liked-tracks/' element={<LikedTracksPage />} />
          <Route path='/*' element={<Navigate to="/" />} />
        </Routes>
      )
    } else if (authStatus === 'loggedOut') {
      return (
        <Routes>
          <Route path='/register/' element={<Register />} />
          <Route path='/login/' element={<Login />} />
          <Route path='/*' element={<Navigate to="/login" />} />
        </Routes>
      )
    }
  }, [authStatus])

  return (<ThemeProvider theme={darkTheme}>
    <div className='flex flex-col-reverse h-screen w-screen'>
      {isLoggedIn && <Actionbar />}
      <div className='flex h-full w-full'>
        <Sidebar />
        <div className='bg-stone-800 h-full w-full'>
          <Navbar />
          <div className='bg-stone-800 w-full overflow-y-scroll' style={{ height: "calc(100vh - 120px - 56px)", paddingTop: "20px", paddingBottom: "32px" }}>
            {routes}
          </div>
        </div>
      </div>
    </div>
    <Snackbar open={toastOpen} anchorOrigin={{ vertical: 'top', horizontal: 'right' }} autoHideDuration={6000} onClose={toastClose}>
      <Alert onClose={toastClose} severity={toastType} sx={{ width: '100%' }}>
        {toastMessage}
      </Alert>
    </Snackbar>
  </ThemeProvider>);
}

export default App;
