import { useState } from "react";
import { Link } from "react-router-dom";
import Report from "./Report";
import Shipper from "./Shipper";
import Product from "./Products";

function Admin(){
    const [changePage, setChangePage] = useState('quanlidonhang');


    return(
        <div className="flex min-h-screen w-full bg-slate-100">
            {/* Sidebar */}
            <div className="flex flex-col w-1/6 min-h-screen border bg-white  pt-5 pb-5 pr-4 pl-4">
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
                    <button onClick={()=> setChangePage('quanlydonhang')} className={changePage === 'quanlydonhang'?"cursor-pointer w-full flex items-center gap-3 text-blue-500 bg-blue-100 p-3 pr-4 pl-4  rounded-xl":"cursor-pointer hover:text-blue-500 w-full flex items-center gap-3 p-3 pr-4 pl-4 text-slate-500"}>
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

                    <button onClick={()=> setChangePage('quanlynguoivanchuyen')} className={changePage === 'quanlynguoivanchuyen'?"mt-4 cursor-pointer w-full flex items-center gap-3 text-blue-500 bg-blue-100 p-3 pr-4 pl-4  rounded-xl":"mt-4 cursor-pointer hover:text-blue-500 w-full flex items-center gap-3 p-3 pr-4 pl-4 text-slate-500"}>
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

                    <button onClick={()=> setChangePage('thongkebaocao')} className={changePage === 'thongkebaocao'?"mt-4 cursor-pointer w-full flex items-center gap-3 text-blue-500 bg-blue-100 p-3 pr-4 pl-4  rounded-xl":"mt-4 cursor-pointer hover:text-blue-500 w-full flex items-center gap-3 p-3 pr-4 pl-4 text-slate-500"}>
                        <div className="flex items-center justify-between w-full">
                            <div className="flex items-center gap-3">
                                <svg xmlns="http://w3.org" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <rect x="3" y="3" width="7" height="7"></rect>
                                    <rect x="14" y="3" width="7" height="7"></rect>
                                    <rect x="14" y="14" width="7" height="7"></rect>
                                    <rect x="3" y="14" width="7" height="7"></rect>
                                </svg>
                                <p>Thống kê báo cáo</p>
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
                </div>

                {/* Logout */}
                <div className="mt-auto">
                    <Link to='/login' className="flex items-center text-red-500 gap-3 bg-red-50 hover:bg-red-100 font-bold rounded-xl p-2 pr-3 pl-3">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                            <polyline points="16 17 21 12 16 7"></polyline>
                            <line x1="21" y1="12" x2="9" y2="12"></line>
                        </svg>
                        <p>Đăng xuất</p>
                    </Link>
                </div>
            </div>

            {/* Content */}
            <div className="w-5/6">
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
            </div>

        </div>
    );
}

export default Admin;