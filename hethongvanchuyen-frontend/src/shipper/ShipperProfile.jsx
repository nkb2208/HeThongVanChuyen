import { useState, useEffect } from "react";
import { Link, Navigate, replace, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

function ShipperProfile() {
    const DEMO_SHIPPER_ID = 1003; 

    const [shipper, setShipper] = useState({
        tenDangNhap: "",
        matKhau: "",
        hoTen: "",
        soDienThoai: "",
        trangThaiHoatDong: "Đang rảnh",
        bienSoXe: "",
        loaiXe: "Xe máy"
    });

    useEffect(() => {
        getShipperInfo();
    }, []);
    const getShipperInfo = async () =>{
        try {
            const token = localStorage.getItem("token");
            if(!token) return;
            const decoded = jwtDecode(token);
            const currentUsername = decoded.sub; 
            const response = await fetch(`http://localhost:8080/api/shipper`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            
            const myProfile = data.find(s => s.taiKhoan.tenDangNhap === currentUsername);
            if(myProfile){
                setShipper({
                    maShipper: myProfile.maShipper,
                    tenDangNhap: myProfile.taiKhoan.tenDangNhap,
                    matKhau: "", 
                    hoTen: myProfile.hoTen,
                    soDienThoai: myProfile.soDienThoai,
                    trangThaiHoatDong: myProfile.trangThaiHoatDong,
                    bienSoXe: myProfile.bienSoXe,
                    loaiXe: myProfile.loaiXe
                });
            }
        } catch (error) {
            console.error("Lỗi: ", error);
        }
    };

    // update
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setShipper(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`http://localhost:8080/api/shipper/update/${DEMO_SHIPPER_ID}`, {
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(shipper)
            });

            if (!response.ok) {
                alert("Lỗi cập nhật thông tin!");
                return;
            }
            alert("Cập nhật thông tin thành công!");
        } catch (error) {
            console.error("Lỗi kết nối khi cập nhật: ", error);
        }
    };

    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login" , {replace: true})
    };

    return (
        <div className="w-full bg-slate-100 min-h-screen">
            {/* Nav Bar */}
            <div className="p-5 bg-white flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="bg-blue-500 w-12 h-12 flex items-center justify-center rounded-xl text-white shadow-md">
                        <svg xmlns="http://w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/>
                            <path d="m3.3 7 8.7 5 8.7-5"/>
                            <path d="M12 22V12"/>
                        </svg>
                    </div>
                    <div>
                        <p className="font-bold">Giao nhanh</p>
                        <p className="text-xs text-gray-400">Hệ thống quản lý vận chuyển</p>    
                    </div>    
                </div>
            </div>

            {/* Body */}
            <div className="flex flex-col items-center justify-center pt-5 lg:pt-10 px-4 md:px-10 lg:px-20 xl:px-50 gap-5">
                <div className="bg-white rounded-xl p-6 w-full max-w-2xl shadow-sm">
                    <form className="w-full" onSubmit={handleUpdateProfile}>
                        <p className="text-blue-500 font-bold mb-4">Thông tin tài khoản</p>
                        
                        <div className="flex items-center gap-3">
                            <div className="w-1/2">
                                <label className="text-xs font-semibold">Tên tài khoản</label>
                                <input value={shipper.tenDangNhap} onChange={handleInputChange} className="mt-1 w-full border border-gray-300 p-2 rounded-xl focus:outline-none focus:border-blue-500" type="text" name="tenDangNhap" disabled />
                                <p className="text-[10px] text-gray-400 mt-1 italic">* Không thể đổi tên đăng nhập</p>
                            </div>
                            <div className="w-1/2">
                                <label className="text-xs font-semibold">Mật khẩu</label>
                                <input value={shipper.matKhau} onChange={handleInputChange} className="mt-1 w-full border border-gray-300 p-2 rounded-xl focus:outline-none focus:border-blue-500" type="password" name="matKhau" />
                            </div>
                        </div>

                        <div className="mt-4">
                            <label className="text-xs font-semibold">Họ và tên</label>
                            <input value={shipper.hoTen} onChange={handleInputChange} className="mt-1 w-full border border-gray-300 p-2 rounded-xl focus:outline-none focus:border-blue-500" type="text" name="hoTen" />
                        </div>
                        
                        <div className="mt-4 flex items-center gap-3">
                            <div className="w-1/2">
                                <label className="text-xs font-semibold">Số điện thoại</label>
                                <input value={shipper.soDienThoai} onChange={handleInputChange} className="mt-1 w-full border border-gray-300 p-2 rounded-xl focus:outline-none focus:border-blue-500" type="text" name="soDienThoai" />
                            </div>
                            <div className="w-1/2">
                                <label className="text-xs font-semibold">Biển số xe</label>
                                <input value={shipper.bienSoXe} onChange={handleInputChange} className="mt-1 w-full border border-gray-300 p-2 rounded-xl focus:outline-none focus:border-blue-500" type="text" name="bienSoXe" />
                            </div>
                        </div>

                        <p className="mt-6 text-blue-500 font-bold mb-4">Phương tiện</p>
                        <div className="mt-2">
                            <select value={shipper.loaiXe} onChange={handleInputChange} className="w-full border border-gray-300 p-2 rounded-xl focus:outline-none focus:border-blue-500" name="loaiXe">
                                <option value="Xe máy">Xe máy</option>
                                <option value="Xe Tải">Xe tải</option>
                                <option value="Xe Van">Xe van</option>
                            </select>
                        </div>

                        <div className="mt-6 flex items-center justify-end gap-3 border-t border-gray-100 pt-4">
                            <Link to='/shipper' type="button" className="border border-gray-200 rounded-xl px-6 py-2 hover:bg-gray-50 transition-colors">Hủy</Link>
                            <button type="submit" className="text-white bg-blue-500 rounded-xl px-6 py-2 hover:bg-blue-600 transition-colors font-semibold">Lưu thay đổi</button>
                        </div>
                    </form>
                </div>

                <div className="flex items-center justify-between w-full max-w-2xl mt-4 bg-white rounded-xl p-5">
                    <p className="text-xl font-semibold text-red-500 ">Đăng xuất</p>
                    <button onClick={handleLogout} className="cursor-pointer flex items-center text-red-500 gap-3 bg-red-50 hover:bg-red-100 font-bold rounded-xl p-2 pr-3 pl-3">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                            <polyline points="16 17 21 12 16 7"></polyline>
                            <line x1="21" y1="12" x2="9" y2="12"></line>
                        </svg>
                        
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ShipperProfile;