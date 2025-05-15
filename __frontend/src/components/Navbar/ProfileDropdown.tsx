import * as React from "react";
import { useAppDispatch, useAppSelector } from "../../store/reduxhooks";
import { logoutAction } from "../../store/slices/authSlice";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Divider from "@mui/material/Divider";
import ListItemIcon from "@mui/material/ListItemIcon";

import Logout from "@mui/icons-material/Logout";
import { getProfile } from "../../api/authApi";
import { Profile as ProfileType } from "../../types";
import profilePhoto from "../../assets/images/profile-photo.webp";

export default function ProfileDropDown() {
  const [profile, setProfile] = React.useState<ProfileType>();

  const authInfo = useAppSelector((state) => state.auth.authInfo);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClose = () => setAnchorEl(null);

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  React.useEffect(() => {
    // set profile details and profile image
    getProfile().then((res) => {
      setProfile(res.data);
    });
  }, []);

  return (
    <>
      <Box sx={{ display: "flex", alignItems: "center", textAlign: "center" }}>
        <Tooltip title="Hồ sơ">
          <IconButton
            onClick={(event: React.MouseEvent<HTMLElement>) =>
              setAnchorEl(event.currentTarget)
            }
            size="small"
            sx={{ ml: 2 }}
            aria-controls={anchorEl && "account-menu"}
            aria-haspopup="true"
            aria-expanded={anchorEl && "true"}
          >
            <Avatar sx={{ width: 32, height: 32 }}>
              <img
                className="object-cover rounded-full"
                style={{ width: 32, height: 32 }}
                src={profile?.image || profilePhoto}
                alt=""
              />
            </Avatar>
          </IconButton>
        </Tooltip>
      </Box>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        slotProps={{
          paper: {
            elevation: 0,
            sx: {
              overflow: "visible",
              filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
              mt: 1.5,
              "& .MuiAvatar-root": {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
              "&::before": {
                content: '""',
                display: "block",
                position: "absolute",
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: "background.paper",
                transform: "translateY(-50%) rotate(45deg)",
                zIndex: 0,
              },
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem
          onClick={() => {
            handleClose();
            navigate("/profile");
          }}
        >
          <Avatar>
            <img
              className="object-cover rounded-full"
              style={{ width: 32, height: 32 }}
              src={profile?.image || profilePhoto}
              alt=""
            />
          </Avatar>
          {profile ? profile.last_name + " " + profile.first_name : "Hồ sơ"}
        </MenuItem>
        <Divider />
        <MenuItem
          onClick={() => {
            handleClose();
            dispatch(logoutAction());
          }}
        >
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Đăng xuất
        </MenuItem>
      </Menu>
    </>
  );
}
