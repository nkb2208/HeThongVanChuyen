import { useState } from "react";
import { Link } from "react-router-dom";

function Customer(){
    const formatTime = (timeString) => {
        if (!timeString) return "";
        const date = new Date(timeString);
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${hours}:${minutes} • ${day}/${month}/${year}`;
    };


    const [donHang, setDonHang] = useState (null);

    const [searchOrder, setSearchOrder] = useState("");

    const handleGetDonHang = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://localhost:8080/api/order/${searchOrder}`);

            if(!response){
                console.log("Lỗi server");
                setDonHang(null);
                return;
            }

            const data = await response.json();
            setDonHang(data);
            console.log("Lấy đơn hàng thành công");
        } catch (error) {
            console.error("Không tìm thấy đơn hàng")
        }
    }

    const getStatusStyle = (status) => {
        switch (status) {
            case 'Chờ lấy hàng': return { text: 'text-yellow-700', bg: 'bg-yellow-50', dot: 'bg-yellow-500' };
            case 'Đã nhận': return { text: 'text-blue-700', bg: 'bg-blue-50', dot: 'bg-blue-500' };
            case 'Đang giao': return { text: 'text-blue-700', bg: 'bg-blue-50', dot: 'bg-blue-500' };
            case 'Giao thành công': return { text: 'text-green-700', bg: 'bg-green-50', dot: 'bg-green-500' };
            case 'Giao thất bại': return { text: 'text-red-700', bg: 'bg-red-50', dot: 'bg-red-500' };
            case 'Đã hủy': return { text: 'text-red-700', bg: 'bg-red-50', dot: 'bg-red-500' };
            default: return { text: 'text-gray-700', bg: 'bg-gray-50', dot: 'bg-gray-500' };
        }
    };

    return(
        <div className="w-full bg-slate-100 min-h-screen">
            {/* Nav Bar */}
            <div className="sticky top-0 p-5 bg-white flex items-center justify-between">
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
                        <p className="text-xs text-gray-400">Tra cứu vận đơn trực tuyến</p>    
                    </div>    
                </div>

                {/* Profile and Logout */}
                <div className="flex items-center gap-3">
                    <Link className="hidden md:flex">Hướng dẫn tra cứu</Link>

                    <Link className="flex items-center border border-gray-300 font-semibold rounded-xl p-2 pr-3 pl-3">
                        <p>Liên hệ hỗ trợ</p>
                    </Link>
                </div>
            </div>

            {/* Content */}
            <div className="mt-10 w-full flex flex-col items-center justify-center">
                <p className="mt-4 text-blue-500 font-bold">TRA CỨU CÔNG KHAI • KHÔNG CẦN ĐĂNG NHẬP</p>
                <p className="text-xl mt-4">Tìm kiếm đơn hàng của bạn ngay</p>
                <p className="mt-4 text-xs text-gray-500">Nhập mã vận đơn được gửi qua Email, SMS hoặc sử dụng số điện thoại nhận hàng</p>


                {/* Search */}
                <div className="w-11/12 md:w-1/2 mt-10 bg-white rounded-xl p-2 shadow-sm">
                    <form className="flex items-center gap-2" action="" onSubmit={handleGetDonHang}>
                        <svg xmlns="http://w3.org" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <circle cx="11" cy="11" r="8"></circle>
                            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                        </svg>
                        <input value={searchOrder} onChange={(e) => setSearchOrder(e.target.value)} className="w-5/6 p-3 rounded-xl focus:outline-none" type="text" placeholder="Nhập mã vận đơn" name="" id="" />
                        <button type="submit" className="cursor-pointer w-1/6 bg-blue-500 text-white font-bold text-xs  p-3 rounded-xl">Tra cứu</button>
                    </form>
                </div>

            {donHang ? (
                <div className="mt-10 bg-white w-11/12 lg:w-3/4 rounded-xl mb-10 shadow-md">
                    <div className="p-5 border-b border-gray-300 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <p>Mã vận đơn: {donHang.maDonHang}</p>
                            <p className="mt-3">
                                Cập nhật lần cuối: {donHang.lichSuTrangThai?.length > 0 
                                    ? formatTime(donHang.lichSuTrangThai[donHang.lichSuTrangThai.length - 1].thoiGian) 
                                    : "Chưa có thông tin"}
                            </p>
                        </div>

                        <span class="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium w-fit rounded-full">
                            {(() => {
                                const style = getStatusStyle(donHang.trangThaiHienTai);
                                return (
                                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-full ${style.text} ${style.bg}`}>
                                        <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`}></span>
                                        {donHang.trangThaiHienTai}
                                    </span>
                                );
                            })()}
                        </span>
                    </div>

                    <div className="flex flex-col md:flex-row w-full">
                        <div className="p-5 w-full md:w-1/2 border-b md:border-b-0 md:border-r border-gray-300">
                            <p>Thông tin tóm tắt</p>

                            <div className="mt-4 border-b border-gray-300 pb-3 flex items-center justify-between">
                                <p className="text-gray-500">Người gửi</p>
                                <p className="font-semibold">{donHang.tenNguoiGui}</p>
                            </div>

                            <div className="mt-4 border-b border-gray-300 pb-3 flex items-center justify-between">
                                <p className="text-gray-500">Người nhận</p>
                                <p className="font-semibold">{donHang.tenNguoiNhan}</p>
                            </div>

                            <div className="mt-4 border-b border-gray-300 pb-3 flex items-center justify-between">
                                <p className="text-gray-500">Địa chỉ giao</p>
                                <p className="font-semibold">{donHang.diaChiGiao}</p>
                            </div>

                            <div className="mt-4 border-b border-gray-300 pb-3 flex items-center justify-between">
                                <p className="text-gray-500">Thu hộ COD</p>
                                <p className="font-semibold">{donHang.tongThuHo_COD.toLocaleString("vi-VN")}đ</p>
                            </div>

                            <div className="mt-4">
                                <p>Người vận chuyển</p>

                                <div className="bg-slate-100 p-3 rounded-xl flex items-center gap-3">
                                    <div className="bg-blue-100 rounded-full text-blue-500 font-bold w-10 h-10 flex items-center justify-center">
                                        {donHang.tenShipper ? donHang.tenShipper.charAt(0).toUpperCase() : "?"}
                                    </div>

                                    {donHang.tenShipper ? (
                                        <div>
                                            <p className="font-bold">{donHang.tenShipper}</p>
                                            <p className="text-xs text-gray-500">{donHang.sdtShipper} • {donHang.bienSoXeShipper}</p>
                                        </div>
                                    ) : (
                                        <div>
                                            <p className="font-bold text-gray-500">Chưa phân công</p>
                                            <p className="text-xs text-gray-400">Đơn hàng đang chờ điều phối tài xế</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="p-5 w-full md:w-1/2 border-gray-300">
                            <div className="w-full bg-white p-6 rounded-xl border border-gray-200 shadow-sm font-sans">
                                <h3 className="text-lg font-medium text-gray-800 mb-6">
                                    Lịch sử trạng thái đơn hàng
                                </h3>

                            <div className="flex flex-col">
                                {donHang.lichSuTrangThai && donHang.lichSuTrangThai.map((item, index) => {
                                    const isLast = index === donHang.lichSuTrangThai.length - 1;
                                    const isCompleted = true; 

                                    return (
                                        <div key={index} className="flex gap-4">
                                            <div className="relative flex flex-col items-center">
                                                <div className="w-8 h-8 flex items-center justify-center rounded-full z-10 bg-emerald-100 text-emerald-600">
                                                    {isCompleted ? (
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                            <polyline points="20 6 9 17 4 12"></polyline>
                                                        </svg>
                                                    ) : (
                                                        <span className="text-sm font-semibold">{index + 1}</span>
                                                    )}
                                                </div>
                                                {!isLast && (
                                                    <div className="absolute top-8 bottom-0 w-[2px] bg-emerald-200 -mb-2"></div>
                                                )}
                                            </div>

                                            <div className={`${!isLast ? 'pb-6' : ''}`}>
                                                <p className="text-sm font-bold text-gray-800">{item.trangThai}</p>
                                                <p className="text-xs text-blue-600 mt-1 mb-1 font-medium">
                                                    {formatTime(item.thoiGian)}
                                                </p>
                                                <p className="text-xs text-gray-500">{item.ghiChu}</p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                            </div>
                        </div>
                    </div>
                </div>
            ): (
                <div></div>
            )}

            </div>
        </div>
    );
}

export default Customer;