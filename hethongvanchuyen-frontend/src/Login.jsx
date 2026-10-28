import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { useState } from 'react';

function Login(){
    const [tenDangNhap, setTenDangNhap] = useState('');
    const [matKhau, setMatKhau] = useState('');
    const navigate = useNavigate();


    const handleLogin = async (e) =>{
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:8080/api/auth/authenticate', {
                method: "POST",
                headers: {
                    "Content-Type" : "application/json",
                },
                body: JSON.stringify({tenDangNhap, matKhau}),
            });

            if(!response.ok){
                console.log("Tài khoản hoặc mật khẩu không đúng!");
                alert("Tài khoản hoặc mật khẩu không đúng!");
                return;
            }

            const data = await response.json();
            const token = data.token;

            localStorage.setItem("token",token);

            const decoded = jwtDecode(token);
            const username = decoded.sub;

            const userRole = decoded.vaiTro; 
            if (userRole === 'Admin') {
                navigate('/admin');
            } else if (userRole === 'Shipper') {
                navigate('/shipper');
            } else {
                console.log("Tài khoản của bạn không có quyền truy cập hệ thống này!");
            }

            console.log("Đăng nhập thành công!");

        } catch (error) {
            console.error("Lỗi server");
        }
    };


    return(
        <div className="flex items-center justify-center min-h-screen w-full bg-slate-100">
            <div className="bg-white rounded-xl p-5 md:px-8 w-11/12 max-w-sm md:max-w-md">
                
                {/* Logo */}
                <div className="flex items-center gap-3">
                    <div className="bg-blue-500 w-12 h-12 flex shrink-0 items-center justify-center rounded-xl text-white shadow-md">
                        <svg xmlns="http://w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/>
                            <path d="m3.3 7 8.7 5 8.7-5"/>
                            <path d="M12 22V12"/>
                        </svg>
                    </div>

                    <div>
                        <p className="font-bold text-lg">Giao nhanh</p>
                        <p className="text-xs text-gray-400">Hệ thống quản lý vận chuyển</p>    
                    </div>    
                </div>
                
                {/* Tiêu đề */}
                <div>
                    <p className="text-blue-500 font-bold mt-6 text-xs">DÀNH CHO NHÂN SỰ VẬN HÀNH</p>
                    <p className="text-xl md:text-2xl mt-2 font-bold">ĐĂNG NHẬP HỆ THỐNG</p>
                    <p className="mt-2 text-gray-500 text-xs">Chỉ dành cho Quản lý và Người vận chuyển</p>
                </div>

                {/* Form Login */}
                <form className="mt-6" onSubmit={handleLogin}>
                    <div className="mt-3">
                        <label className="font-bold text-xs">Tên đăng nhập</label>
                        <input value={tenDangNhap} onChange={e => setTenDangNhap(e.target.value)} className="mt-2 w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:border-blue-500" type="text" placeholder="Nhập tên đăng nhập" required />
                    </div>

                    <div className="mt-4">
                        <label className="font-bold text-xs">Mật khẩu</label>
                        <input value={matKhau} onChange={e => setMatKhau(e.target.value)} className="mt-2 w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:border-blue-500" type="password" placeholder="Nhập mật khẩu" required />
                    </div>

                    <button type="submit" className="w-full font-bold text-white bg-blue-500 cursor-pointer hover:bg-blue-600 rounded-xl p-3 mt-6">
                        Đăng nhập
                    </button>
                </form>

                <div className="flex items-center justify-center mt-6 text-center">
                    <p className="text-xs text-gray-500">Dữ liệu được bảo mật theo tiêu chuẩn doanh nghiệp</p>
                </div>
            </div>
        </div>
    )
}

export default Login;