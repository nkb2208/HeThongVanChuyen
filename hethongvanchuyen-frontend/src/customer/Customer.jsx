import { Link } from "react-router-dom";

function Customer(){
    const timelineData = [
        {
            id: 1,
            title: 'Đã tạo đơn',
            time: '08:15 • 17/06/2025',
            description: 'Hệ thống đã tiếp nhận đơn hàng',
            status: 'completed', // completed | pending
        },
        {
            id: 2,
            title: 'Đã lấy hàng',
            time: '09:30 • 18/06/2025',
            description: 'Người vận chuyển đã lấy hàng từ người gửi',
            status: 'completed',
        },
        {
            id: 3,
            title: 'Đang giao',
            time: '10:32 • 18/06/2025',
            description: 'Đơn hàng đang trên đường giao đến bạn',
            status: 'completed',
        },
        {
            id: 4,
            title: 'Giao thành công / Giao thất bại',
            time: 'Dự kiến trước 17:00',
            description: 'Lý do sẽ được hiển thị nếu giao thất bại',
            status: 'pending',
        },
    ];


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
                    <Link>Hướng dẫn tra cứu</Link>

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

                <div className="w-1/2 mt-10 bg-white rounded-xl p-2">
                    <form className="flex items-center gap-2" action="">
                        <svg xmlns="http://w3.org" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <circle cx="11" cy="11" r="8"></circle>
                            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                        </svg>
                        <input className="w-5/6 p-3 rounded-xl focus:outline-none" type="text" placeholder="Nhập mã vận đơn" name="" id="" />
                        <button className="w-1/6 bg-blue-500 text-white font-bold p-3 rounded-xl">Tra cứu</button>
                    </form>
                </div>


                <div className="mt-10 bg-white w-3/4 rounded-xl mb-10">
                    <div className="p-5 border-b border-gray-300 flex items-center justify-between">
                        <div>
                            <p>Mã vận đơn</p>
                            <p className="mt-3">Cập nhật lần cuối: 10:32, 18/06/2025</p>
                        </div>

                        <span class="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium text-orange-700 bg-orange-50 rounded-full">
                            <span class="w-1.5 h-1.5 bg-orange-500 rounded-full"></span>
                            Đang giao
                        </span>
                    </div>

                    <div className="flex w-full">
                        <div className="p-5 w-1/2 border-r border-gray-300">
                            <p>Thông tin tóm tắt</p>

                            <div className="mt-4 border-b border-gray-300 pb-3 flex items-center justify-between">
                                <p className="text-gray-500">Người gửi</p>
                                <p className="font-semibold">Công ty An Phát</p>
                            </div>

                            <div className="mt-4 border-b border-gray-300 pb-3 flex items-center justify-between">
                                <p className="text-gray-500">Người nhận</p>
                                <p className="font-semibold">Trần Minh Hà</p>
                            </div>

                            <div className="mt-4 border-b border-gray-300 pb-3 flex items-center justify-between">
                                <p className="text-gray-500">Địa chỉ giao</p>
                                <p className="font-semibold">28 Nguyễn Trãi, Quận 1, TP.HCM</p>
                            </div>

                            <div className="mt-4 border-b border-gray-300 pb-3 flex items-center justify-between">
                                <p className="text-gray-500">Thu hộ COD</p>
                                <p className="font-semibold">850.000đ</p>
                            </div>

                            <div className="mt-4">
                                <p>Người vận chuyển</p>

                                <div className="mt-4">
                                    <div className="bg-slate-100 p-3 rounded-xl flex items-center gap-3">
                                        {/* avatar */}
                                        <div className="bg-blue-100 rounded-full text-blue-500 font-bold w-10 h-10 flex items-center justify-center">
                                            NA
                                        </div>

                                        {/* name and role */}
                                        <div>
                                            <p className="font-bold">Nguyễn Văn A</p>
                                            <p className="text-xs text-gray-500">0903 456 789 • 59X1-123.45</p>
                                            <p className="text-xs text-gray-500">Xe máy • Đang giao hàng</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-5 w-1/2 border-gray-300">
                            <div className="w-full bg-white p-6 rounded-xl border border-gray-200 shadow-sm font-sans">
                                <h3 className="text-lg font-medium text-gray-800 mb-6">
                                    Lịch sử trạng thái đơn hàng
                                </h3>

                                <div className="flex flex-col">
                                    {timelineData.map((item, index) => {
                                    const isLast = index === timelineData.length - 1;
                                    const isCompleted = item.status === 'completed';

                                    return (
                                        <div key={item.id} className="flex gap-4">
                                            <div className="relative flex flex-col items-center">
                                                <div
                                                className={`w-8 h-8 flex items-center justify-center rounded-full z-10 ${
                                                    isCompleted
                                                    ? 'bg-emerald-100 text-emerald-600'
                                                    : 'bg-gray-100 text-gray-500'
                                                }`}
                                                >
                                                {isCompleted ? (
                                                    <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width="16"
                                                    height="16"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="2.5"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    >
                                                    <polyline points="20 6 9 17 4 12"></polyline>
                                                    </svg>
                                                ) : (
                                                    <span className="text-sm font-semibold">{item.id}</span>
                                                )}
                                                </div>
                                                {!isLast && (
                                                <div className="absolute top-8 bottom-0 w-[2px] bg-gray-200 -mb-2"></div>
                                                )}
                                            </div>

                                            <div className={`${!isLast ? 'pb-6' : ''}`}>
                                                <p className="text-sm font-bold text-gray-800">{item.title}</p>
                                                <p className="text-xs text-blue-600 mt-1 mb-1 font-medium">
                                                {item.time}
                                                </p>
                                                <p className="text-xs text-gray-500">{item.description}</p>
                                            </div>
                                        </div>
                                    );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Customer;