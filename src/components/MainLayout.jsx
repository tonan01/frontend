import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar'; // Import Sidebar
import { Box, Toolbar } from '@mui/material';

const drawerWidth = 240;

const MainLayout = () => {
    return (
        <Box sx={{ display: 'flex' }}>
            {/* Header sẽ nằm trên cùng */}
            <Header /> 
            
            {/* Sidebar sẽ nằm bên trái */}
            <Sidebar />

            {/* Content chính của trang sẽ nằm ở đây */}
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 3,
                    width: `calc(100% - ${drawerWidth}px)`,
                    backgroundColor: '#f9fafb'
                }}
            >
                <Toolbar /> {/* Thêm một Toolbar trống để đẩy content xuống dưới Header */}
                <Outlet />
            </Box>
        </Box>
    );
};

export default MainLayout;