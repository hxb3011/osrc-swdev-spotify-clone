import { Divider, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import spotifyLogo from '../../assets/images/spotify-logo.png'
import HomeIcon from '@mui/icons-material/Home';
import SearchIcon from '@mui/icons-material/Search';
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded';
import { NavLink } from "react-router-dom";

export interface SidebarProps {
}

export default function Sidebar(props: SidebarProps) {
    return (
        <div className='flex flex-col basis-[20%] h-full bg-stone-900' style={{
            gap: "8px"
        }}>
            <div className='flex content-center justify-center' style={{ height: "56px" }}>
                <img src={spotifyLogo} alt="Sptoify Logo" />
            </div>
            <List className='text-white'>
                <NavLink to="/">
                    <ListItem disablePadding>
                        <ListItemButton>
                            <ListItemIcon>
                                <HomeIcon className='text-white' />
                            </ListItemIcon>
                            <ListItemText primary="Trang chủ" />
                        </ListItemButton>
                    </ListItem>
                </NavLink>
                <NavLink to="/search">
                    <ListItem disablePadding>
                        <ListItemButton>
                            <ListItemIcon>
                                <SearchIcon className='text-white' />
                            </ListItemIcon>
                            <ListItemText primary="Thể loại" />
                        </ListItemButton>
                    </ListItem>
                </NavLink>
            </List>
            <Divider className='bg-white' />
            <List className='text-white'>
                <NavLink to="/liked-tracks">
                    <ListItem disablePadding>
                        <ListItemButton>
                            <ListItemIcon>
                                <FavoriteRoundedIcon className='text-white' />
                            </ListItemIcon>
                            <ListItemText primary="Bản nhạc yêu thích" />
                        </ListItemButton>
                    </ListItem>
                </NavLink>
            </List>
        </div>
    );
}
