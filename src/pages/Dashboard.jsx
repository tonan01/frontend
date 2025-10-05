import { useAuth } from '../hooks/useAuth';
import { Typography } from '@mui/material';

const Dashboard = () => {
    const { user } = useAuth();

    return (
        <div>
            <Typography variant="h4" gutterBottom>
                Dashboard
            </Typography>
            {user && (
                <Typography variant="h6">
                    Chào mừng trở lại, {user.username}!
                </Typography>
            )}
            <Typography sx={{ mt: 2 }}>
                Hãy chọn chức năng từ thanh điều hướng bên trái để bắt đầu.
            </Typography>
        </div>
    );
};

export default Dashboard;