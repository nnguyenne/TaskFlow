import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { check } from "../../Services/UserServices";

function PrivateRouter() {
    const [isLogin, setIsLogin] = useState(null); // null để tránh nháy trang

    useEffect(() => {
        const checkLogin = async () => {
            const token = localStorage.getItem("token");
            const user = JSON.parse(localStorage.getItem("user"));

            if (!token || !user) {
                setIsLogin(false);
                return;
            }

            const data = await check({ userID: user._id });
            setIsLogin(data.exists); // true nếu hợp lệ
        };

        checkLogin();
    }, []);

    if (isLogin === null) return <p>Đang kiểm tra đăng nhập...</p>;

    return isLogin ? <Outlet /> : <Navigate to="/login" replace />;
}

export default PrivateRouter;