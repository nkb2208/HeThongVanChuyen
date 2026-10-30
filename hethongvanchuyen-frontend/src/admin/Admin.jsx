import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from 'jwt-decode';
import Report from "./Report";
import Shipper from "./Shipper";
import Product from "./Products";
import Setting from "./Setting";

function Admin(){
    const [changePage, setChangePage] = useState('quanlydonhang');

    const [admin , setAdmin] = useState({
        hoTen : "",
        soDienThoai : "",
        email : ""
    });

    // Lấy thông tin admin
    useEffect(() => {
        getAdminInfo();
    }, []);

    const getAdminInfo = async () => {
        try {
            const token = localStorage.getItem("token");
            if(!token){
                return
            };

            const decoded = jwtDecode(token);
            const currentAdmin =decoded.sub;

            const response = await fetch(`http://localhost:8080/api/manager`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!response.ok) {
                console.log("Lỗi server hoặc không tìm thấy Admin");
                return;
            }
            const data = await response.json();

            const myProfile = data.find(m => m.taiKhoan && m.taiKhoan.tenDangNhap === currentAdmin);
            if(myProfile){
                setAdmin(myProfile);
            }else{
              setAdmin({hoTen: currentAdmin, email: ""});
            }

        } catch (error) {
            console.error("Lỗi kết nối: ", error);
        }
    };


    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    }


    return(
        <div className="flex min-h-screen w-full bg-slate-100">
            {/* Sidebar */}
            <div className="sticky top-0 h-screen flex flex-col w-1/6 bg-white pt-5 pb-5 pr-4 pl-4">
                {/* Logo */}
                <div className="flex items-center gap-3">
                    <div className="bg-blue-500 w-12 h-12 flex items-center justify-center rounded-xl text-white shadow-md">
                        <svg xmlns="http://w3.org" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
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

                {/* Tabs */}
                <div className="mt-15">
                    <button onClick={()=> setChangePage('thongkebaocao')} className={changePage === 'thongkebaocao'?"mt-4 cursor-pointer w-full flex items-center gap-3 text-blue-500 bg-blue-100 p-3 pr-4 pl-4  rounded-xl":"bg-slate-50 rounded-xl mt-4 cursor-pointer hover:text-blue-500 w-full flex items-center gap-3 p-3 pr-4 pl-4 text-slate-500"}>
                        <div className="flex items-center justify-between w-full">
                            <div className="flex items-center gap-3">
                                <svg xmlns="http://w3.org" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <rect x="3" y="3" width="7" height="7"></rect>
                                    <rect x="14" y="3" width="7" height="7"></rect>
                                    <rect x="14" y="14" width="7" height="7"></rect>
                                    <rect x="3" y="14" width="7" height="7"></rect>
                                </svg>
                                <p>Tổng quan</p>
                            </div>

                            {changePage === 'thongkebaocao'?(
                                <svg height="24" width="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <path d="M5 12h14" />
                                    <path d="m12 5 7 7-7 7" />
                                </svg>
                            ):(
                                <></>
                            )}
                        </div>
                    </button>

                    <button onClick={()=> setChangePage('quanlydonhang')} className={changePage === 'quanlydonhang'?"mt-4 cursor-pointer w-full flex items-center gap-3 text-blue-500 bg-blue-100 p-3 pr-4 pl-4  rounded-xl":"bg-slate-50 rounded-xl cursor-pointer mt-4 hover:text-blue-500 w-full flex items-center gap-3 p-3 pr-4 pl-4 text-slate-500"}>
                        <div className="flex items-center justify-between w-full">
                            <div className="flex items-center gap-3">
                                <svg xmlns="http://w3.org" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/>
                                    <path d="m3.3 7 8.7 5 8.7-5"/>
                                    <path d="M12 22V12"/>
                                </svg>
                                <p>Quản lý đơn hàng</p>
                            </div>

                            {changePage === 'quanlydonhang'?(
                                <svg height="24" width="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <path d="M5 12h14" />
                                    <path d="m12 5 7 7-7 7" />
                                </svg>
                            ):(
                                <></>
                            )}
                        </div>
                    </button>

                    <button onClick={()=> setChangePage('quanlynguoivanchuyen')} className={changePage === 'quanlynguoivanchuyen'?"mt-4 cursor-pointer w-full flex items-center gap-3 text-blue-500 bg-blue-100 p-3 pr-4 pl-4  rounded-xl":"bg-slate-50 rounded-xl mt-4 cursor-pointer hover:text-blue-500 w-full flex items-center gap-3 p-3 pr-4 pl-4 text-slate-500"}>
                        <div className="flex items-center justify-between w-full">
                            <div className="flex items-center gap-3">
                                <svg xmlns="http://w3.org" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
                                </svg>
                                <p>Quản lý người vận chuyển</p>
                            </div>

                            {changePage === 'quanlynguoivanchuyen'?(
                                <svg height="24" width="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <path d="M5 12h14" />
                                    <path d="m12 5 7 7-7 7" />
                                </svg>
                            ):(
                                <></>
                            )}

                        </div>
                    </button>

                    <button onClick={()=> setChangePage('cauhinhhethong')} className={changePage === 'cauhinhhethong'?"mt-4 cursor-pointer w-full flex items-center gap-3 text-blue-500 bg-blue-100 p-3 pr-4 pl-4  rounded-xl":"bg-slate-50 rounded-xl mt-4 cursor-pointer hover:text-blue-500 w-full flex items-center gap-3 p-3 pr-4 pl-4 text-slate-500"}>
                        <div className="flex items-center justify-between w-full">
                            <div className="flex items-center gap-3">
                                <svg xmlns="http://w3.org" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                                    <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/>
                                </svg>
                                <p>Cấu hình hệ thống</p>
                            </div>

                            {changePage === 'cauhinhhethong'?(
                                <svg height="24" width="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <path d="M5 12h14" />
                                    <path d="m12 5 7 7-7 7" />
                                </svg>
                            ):(
                                <></>
                            )}

                        </div>
                    </button>
                </div>

                {/* Logout */}
                <div className="mt-auto">
                    <button onClick={handleLogout} className="cursor-pointer flex items-center text-red-500 gap-3 bg-red-50 hover:bg-red-100 font-bold rounded-xl p-2 pr-3 pl-3">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                            <polyline points="16 17 21 12 16 7"></polyline>
                            <line x1="21" y1="12" x2="9" y2="12"></line>
                        </svg>
                        <p>Đăng xuất</p>
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="w-5/6">
                <div className="w-full flex items-center justify-between p-5">
                    <div>

                        {changePage === 'quanlydonhang'?(
                            <div>
                                <p className="text-xl">Quản lý đơn hàng</p>
                                <p className="text-xs text-gray-500">Tìm kiếm, theo dõi đơn và cập nhật đơn hàng</p>
                            </div>
                        ):(
                            <div></div>
                        )}

                        {changePage === 'quanlynguoivanchuyen'?(
                            <div>
                                <p className="text-xl">Quản lý người vận chuyển</p>
                                <p className="text-xs text-gray-500">Tìm kiếm, theo dõi đơn và cập nhật người vận chuyển</p>
                            </div>
                        ):(
                            <div></div>
                        )}

                        {changePage === 'thongkebaocao'?(
                            <div>
                                <p className="text-xl">Thống kê & Báo cáo</p>
                                <p className="text-xs text-gray-500">thống kê và báo cáo tổng quan đơn hàng và người vận chuyển</p>
                            </div>

                        ):(
                            <div></div>
                        )}

                        {changePage === 'cauhinhhethong'?(
                            <div>
                                <p className="text-xl">Cấu hình hệ thống</p>
                                <p className="text-xs text-gray-500">Cập nhật, cấu hình hệ thống</p>
                            </div>

                        ):(
                            <div></div>
                        )}
  
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-3">
                            {/* avatar */}
                            <div className="bg-blue-100 rounded-full text-blue-500 font-bold w-10 h-10 flex items-center justify-center">
                                {admin?.hoTen ? admin.hoTen.charAt(0).toUpperCase() : "A"}
                            </div>

                            {/* name and role */}
                            <div>
                                <p className="font-bold">{admin?.hoTen}</p>
                                <p className="text-xs text-gray-500">Quản lý</p>
                            </div>
                        </div>
                    </div>
                </div>
        
                {changePage === 'quanlydonhang'?(
                    <Product/>
                ):(
                    <div></div>
                )}

                {changePage === 'quanlynguoivanchuyen'?(
                    <Shipper/>
                ):(
                    <div></div>
                )}

                {changePage === 'thongkebaocao'?(
                    <Report/>
                ):(
                    <div></div>
                )}

                {changePage === 'cauhinhhethong'?(
                    <Setting/>
                ):(
                    <div></div>
                )}
            </div>

        </div>
    );
}

export default Admin;