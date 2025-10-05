import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import {
    AppBar, Toolbar, Typography, Box, IconButton, Avatar, Menu, MenuItem, Divider, ListItemIcon
} from '@mui/material';
import Logout from '@mui/icons-material/Logout';

const drawerWidth = 240;

// Các hàm stringToColor và stringAvatar giữ nguyên như cũ
function stringToColor(string) {
    let hash = 0;
    for (let i = 0; i < string.length; i += 1) {
        hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }
    let color = '#';
    for (let i = 0; i < 3; i += 1) {
        const value = (hash >> (i * 8)) & 0xff;
        color += `00${value.toString(16)}`.slice(-2);
    }
    return color;
}
function stringAvatar(name = 'User') {
    return {
        sx: {
            bgcolor: stringToColor(name),
        },
        children: `${name.split(' ')[0][0]}${name.split(' ').length > 1 ? name.split(' ')[1][0] : ''}`,
    };
}


const Header = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const handleClick = (event) => setAnchorEl(event.currentTarget);
    const handleClose = () => setAnchorEl(null);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };
    
    // Giữ nguyên phần render của Header nhưng cập nhật AppBar
    return (
         <AppBar
            position="fixed" // Thay đổi thành fixed
            sx={{
                width: `calc(100% - ${drawerWidth}px)`, // Chiều rộng bằng 100% trừ đi chiều rộng sidebar
                ml: `${drawerWidth}px`, // Margin left bằng chiều rộng sidebar
                backgroundColor: '#fff',
                color: '#000',
                boxShadow: 'none',
                borderBottom: '1px solid #e0e0e0'
            }}
        >
            <Toolbar>
                {/* Dùng flexGrow để đẩy các item bên phải raสุด */}
                <Box sx={{ flexGrow: 1 }} />

                {user && (
                    <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
                        <Typography sx={{ minWidth: 100 }}>Chào, {user.username}</Typography>
                        <IconButton onClick={handleClick} size="small" sx={{ ml: 2 }}>
                            <Avatar {...stringAvatar((user.username || 'U').toUpperCase())} />
                        </IconButton>
                    </Box>
                )}

                <Menu
                    anchorEl={anchorEl}
                    id="account-menu"
                    open={open}
                    onClose={handleClose}
                    onClick={handleClose}
                    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                >
                    <Box sx={{ padding: '10px 20px' }}>
                        <Typography variant="subtitle1">{user?.username || 'Not logged in'}</Typography>
                        <Typography variant="body2" color="text.secondary">
                           Chức vụ: {(user?.roles && user.roles.join(', ')) || 'N/A'}
                        </Typography>
                    </Box>
                    <Divider />
                    <MenuItem onClick={handleLogout}>
                        <ListItemIcon>
                            <Logout fontSize="small" />
                        </ListItemIcon>
                        Đăng xuất
                    </MenuItem>
                </Menu>
            </Toolbar>
        </AppBar>
    );
};

export default Header;