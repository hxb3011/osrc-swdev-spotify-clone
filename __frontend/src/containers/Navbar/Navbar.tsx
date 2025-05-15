import ArrowCircleLeftOutlinedIcon from '@mui/icons-material/ArrowCircleLeftOutlined';
import ArrowCircleRightOutlinedIcon from '@mui/icons-material/ArrowCircleRightOutlined';
import { useLocation, useNavigate } from 'react-router-dom';
import ProfileDropdown from '../../components/Navbar/ProfileDropdown';
import SearchBar from '../../components/Search/SearchBar';
import { useAppSelector } from '../../store/reduxhooks';
import React from 'react';
import Button from '@mui/material/Button';
export interface NavbarProps {
}

export default function Navbar(props: NavbarProps) {
  const navigate = useNavigate();
  const isLoggedIn = useAppSelector((state) => state.auth.authStatus) === 'loggedIn';
  const location = useLocation();

  // show register button if user is on login page and vice versa else show other navbar elements
  return (
    <div className='bg-teal-800/60 flex items-center justify-between' style={{
      top: 0,
      right: 0,
      width: "100%",
      padding: "4px",
      gap: "4px",
      zIndex: "20px"
    }}>
      {React.useMemo(() => (<>
        <div className='flex items-center' style={{ height: "56px", gap: "8px", padding: "8px" }}>
          <ArrowCircleLeftOutlinedIcon onClick={() => navigate(-1)} className='text-white cursor-pointer hover:text-gray-400 duration-500 mr-4' fontSize='large' />
          <ArrowCircleRightOutlinedIcon onClick={() => navigate(1)} className='text-white cursor-pointer hover:text-gray-400 duration-500' fontSize='large' />
        </div>
        <SearchBar />
        <div className='ml-auto mr-10' style={{ height: "56px", gap: "8px", padding: "8px" }}>{isLoggedIn ? (
          <ProfileDropdown />
        ) : location.pathname.includes('login') ? (
          <Button onClick={() => { navigate('/register/') }} color="success" variant="contained">Register</Button>
        ) : location.pathname.includes('register') ? (
          <Button onClick={() => { navigate('/login/') }} color="success" variant="contained">Login</Button>
        ) : ""}</div>
      </>), [location.pathname, isLoggedIn, navigate])}
    </div>
  );
}
