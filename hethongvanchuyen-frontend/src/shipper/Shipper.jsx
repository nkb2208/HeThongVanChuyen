import { Link } from "react-router-dom";

function Shipper(){
    return(
        <div className="w-full bg-slate-100 min-h-screen">
            {/* Nav Bar */}
            <div className="p-5 bg-white flex items-center justify-between">
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

                {/* Profile and Logout */}
                <div className="flex items-center gap-3">
                    <div>
                        <p className="font-semibold">Nguyễn Văn A</p>
                        <p className="text-xs text-gray-500">Xe máy • 59X1-123.45</p>
                    </div>

                    <div>
                        <span class="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium text-green-700 bg-green-50 rounded-full">
                            <span class="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                            Đang rảnh
                        </span>
                    </div>

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

            {/* Body Content */}
            <div className="flex pt-10 pr-50 pl-50 gap-3">
                <div className=" p-5 bg-white rounded-xl w-1/3">
                    {/* Title */}
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="">Đơn hàng khả dụng</p>
                            <p className="text-xs text-gray-500">Chọn đơn “Chờ xử lý” để chủ động nhận</p>
                        </div>

                        <span class="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium text-orange-700 bg-orange-50 rounded-full">
                            <span class="w-1.5 h-1.5 bg-orange-500 rounded-full"></span>
                            1 chờ nhận
                        </span>
                    </div>

                    {/* List of Order */}
                    <div className="mt-4 flex flex-col gap-4">
                        <button className="cursor-pointer border border-gray-100 p-3 rounded-xl w-full">
                            <div className="flex items-center justify-between">
                                <p className="font-semibold text-xl">VD001</p>
                                <span class="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium text-orange-700 bg-orange-50 rounded-full">
                                    <span class="w-1.5 h-1.5 bg-orange-500 rounded-full"></span>
                                    Đang giao
                                </span>
                            </div>

                            <div className="mt-4 w-fit">
                                <p className="flex items-center justify-start font-semibold">Trần minh hà</p>
                                <p className="flex items-center justify-start text-xs text-gray-500">104 Lê Lợi, Q.3</p>
                                <p className="flex items-center justify-start mt-2 text-xs text-gray-500">COD: 420.000đ 1.2 kg</p>
                            </div>
                        </button>

                        <button className="cursor-pointer border border-gray-100 p-3 rounded-xl w-full">
                            <div className="flex items-center justify-between">
                                <p className="font-semibold text-xl">VD002</p>
                                <span class="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium text-orange-700 bg-orange-50 rounded-full">
                                    <span class="w-1.5 h-1.5 bg-orange-500 rounded-full"></span>
                                    Đang giao
                                </span>
                            </div>

                            <div className="mt-4 w-fit">
                                <p className="flex items-center justify-start font-semibold">Trần minh hà</p>
                                <p className="flex items-center justify-start text-xs text-gray-500">104 Lê Lợi, Q.3</p>
                                <p className="flex items-center justify-start mt-2 text-xs text-gray-500">COD: 420.000đ 1.2 kg</p>
                            </div>
                        </button>

                        <button className="cursor-pointer border border-gray-100 p-3 rounded-xl w-full">
                            <div className="flex items-center justify-between">
                                <p className="font-semibold text-xl">VD003</p>
                                <span class="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium text-orange-700 bg-orange-50 rounded-full">
                                    <span class="w-1.5 h-1.5 bg-orange-500 rounded-full"></span>
                                    Đang giao
                                </span>
                            </div>

                            <div className="mt-4 w-fit">
                                <p className="flex items-center justify-start font-semibold">Trần minh hà</p>
                                <p className="flex items-center justify-start text-xs text-gray-500">104 Lê Lợi, Q.3</p>
                                <p className="flex items-center justify-start mt-2 text-xs text-gray-500">COD: 420.000đ 1.2 kg</p>
                            </div>
                        </button>

                        <button className="cursor-pointer border border-gray-100 p-3 rounded-xl w-full">
                            <div className="flex items-center justify-between">
                                <p className="font-semibold text-xl">VD004</p>
                                <span class="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium text-orange-700 bg-orange-50 rounded-full">
                                    <span class="w-1.5 h-1.5 bg-orange-500 rounded-full"></span>
                                    Đang giao
                                </span>
                            </div>

                            <div className="mt-4 w-fit">
                                <p className="flex items-center justify-start font-semibold">Trần minh hà</p>
                                <p className="flex items-center justify-start text-xs text-gray-500">104 Lê Lợi, Q.3</p>
                                <p className="flex items-center justify-start mt-2 text-xs text-gray-500">COD: 420.000đ 1.2 kg</p>
                            </div>
                        </button>
                    </div>

                </div>

                {/* Order-Detail */}
                <div className="bg-white p-5 rounded-xl w-2/3">
                    <div className="flex items-center justify-between">
                        <div>
                            <span class="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium text-orange-700 bg-orange-50 rounded-full">
                                <span class="w-1.5 h-1.5 bg-orange-500 rounded-full"></span>
                                Đang giao
                            </span>
                            <p className="mt-4 text-xl">Chi tiết đơn hàng</p>
                        </div>

                        <div className="bg-blue-500 w-12 h-12 flex items-center justify-center rounded-xl text-white shadow-md">
                            <svg xmlns="http://w3.org" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/>
                                <path d="m3.3 7 8.7 5 8.7-5"/>
                                <path d="M12 22V12"/>
                            </svg>
                        </div>
                    </div>

                    <p className="mt-2 text-xs text-gray-500">Mã vận đơn: <span className="text-black font-semibold">VD001</span></p>

                    <div className="mt-4 border-t border-b border-gray-300">
                        <div className="mt-4 flex gap-3">
                            <div className="w-1/2 p-3 border border-gray-300 rounded-xl">
                                <p className="text-gray-500">Người gửi</p>
                                <p className="mt-2 font-semibold">Công ty An Phát</p>
                                <p className="text-gray-500">0901 234 567</p> 
                            </div>

                            <div className="w-1/2 p-3 border border-gray-300 rounded-xl">
                                <p className="text-gray-500">Người nhận</p>
                                <p className="mt-2 font-semibold">Trần Minh Hà</p>
                                <p className="text-gray-500">0901 234 567</p> 
                            </div>
                        </div>

                        <div className="mt-4 mb-4 flex gap-3">
                            <div className="w-2/3 p-3 bg-slate-100 border border-gray-300 rounded-xl">
                                <p className="text-gray-500">Địa chỉ giao hàng</p>
                                <p className="mt-2 font-semibold">28 Nguyễn Trãi, Q.1, TP.HCM</p>
                            </div>

                            <div className="w-1/3 p-3 bg-slate-100 border border-gray-300 rounded-xl">
                                <p className="text-gray-500">Tiền cần thu (COD + Ship)</p>
                                <p className="text-xl mt-2 font-bold text-blue-500">850.000đ</p>
                                <p className="text-gray-500">Đã bao gồm phí vận chuyển</p> 
                            </div>
                        </div>
                    </div>

                    <div className="mt-4">
                        <p>Cập nhật trạng thái đơn hàng</p>

                        <form className="mt-3 w-full" action="">
                            <label className="text-xs font-semibold" htmlFor="">Trạng thái mới</label>
                            <select className="mt-3 w-full border border-gray-300 rounded-xl p-3" name="" id="">
                                <option value="">Đã nhận</option>
                                <option value="">Đang giao</option>
                                <option value="">Giao thành công</option>
                                <option value="">Giao thất bại</option>
                            </select>

                            <button className="cursor-pointer w-full bg-blue-600 p-3 rounded-xl mt-3 text-white font-bold">Lưu trạng thái</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Shipper;