import { useEffect, useState } from 'react';
import { 
  BarChart, Bar, XAxis, CartesianGrid, ResponsiveContainer, 
  PieChart, Pie, Cell 
} from 'recharts';

function Report(){
    const barData = [
    { name: 'T2', value: 60 },
    { name: 'T3', value: 85 },
    { name: 'T4', value: 55 },
    { name: 'T5', value: 90 },
    { name: 'T6', value: 75 },
    { name: 'T7', value: 95 },
    { name: 'CN', value: 70 },
    ];



    const [orderLst, setOrderLst] = useState([]);
    const [shipperLst, setShipperLst] = useState([]);
    const [dateRange, setDateRange] = useState("all");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    useEffect(()=>{
        getAllOrders();
        getAllShippers();
    }, []);

    const getAllOrders = async () => {
        try {
            const token = localStorage.getItem("token"); 
            const response = await fetch("http://localhost:8080/api/order", {
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });

            if(!response){
                console.log("Lỗi server");
                return;
            }

            const data = await response.json();
            setOrderLst(data);
            console.log("Lấy danh sách đơn hàng thành công");
        } catch (error) {
            console.error("Không thể lấy danh sách đơn hàng: ", error);
        }
    }

    const getAllShippers = async () => {
        try {
            const token = localStorage.getItem("token"); 
            const response = await fetch("http://localhost:8080/api/shipper", {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if(!response){
                console.log("Lỗi server");
                return;
            }

            const data = await response.json();
            setShipperLst(data);
            console.log("Lấy danh sách shipper thành công");
        } catch (error) {
            console.error("Không thể lấy danh sách shipper: ", error);
        }
    }

    // Lọc danh sách đơn hàng theo mốc thời gian người dùng chọn
    const getFilteredOrders = () => {
        if (!Array.isArray(orderLst)) return [];
        if (dateRange === "all") return orderLst;

        const now = new Date();
        const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
        const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

        let rangeStart = null;
        let rangeEnd = endOfToday;

        if (dateRange === "today") {
            rangeStart = startOfToday;
        } else if (dateRange === "7days") {
            rangeStart = new Date(startOfToday);
            rangeStart.setDate(rangeStart.getDate() - 6);
        } else if (dateRange === "30days") {
            rangeStart = new Date(startOfToday);
            rangeStart.setDate(rangeStart.getDate() - 29);
        } else if (dateRange === "thisMonth") {
            rangeStart = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
        } else if (dateRange === "custom") {
            rangeStart = startDate ? new Date(`${startDate}T00:00:00`) : null;
            rangeEnd = endDate ? new Date(`${endDate}T23:59:59.999`) : null;
        }

        return orderLst.filter((order) => {
            if (!order.thoiGianTao) return false;
            const created = new Date(order.thoiGianTao);
            if (Number.isNaN(created.getTime())) return false;
            if (rangeStart && created < rangeStart) return false;
            if (rangeEnd && created > rangeEnd) return false;
            return true;
        });
    };

    const filteredOrders = getFilteredOrders();

    const totalOrder = () => {
        return filteredOrders.length;
    }

    const totalDeliveringOrder = () => {
        return filteredOrders.filter(donHang => donHang.trangThaiHienTai === 'Đang giao').length;
    }

    const totalCompleteOrder = () => {
        return filteredOrders.filter(donHang => donHang.trangThaiHienTai === 'Giao thành công').length;
    }

    const totalCancelOrder = () => {
        return filteredOrders.filter(donHang => donHang.trangThaiHienTai === 'Giao thất bại' || donHang.trangThaiHienTai === 'Đã hủy').length;
    }

    const calcPercent = (count) => {
        const total = totalOrder();
        if (total === 0) return 0;
        return Math.round((count / total) * 100);
    }

    const pieData = [
        { name: 'Thành công', value: totalCompleteOrder(), color: '#22c55e' },
        { name: 'Đang giao', value: totalDeliveringOrder(), color: '#f59e0b' },  
        { name: 'Thất bại/Hủy', value: totalCancelOrder(), color: '#ef4444' },
    ];

    const totalShipCost = () => {
        let total = 0;
        filteredOrders.forEach(dh => {
            total += (dh.phiVanChuyen || 0);
        });

        return total;
    }

    const totalCODCost = () => {
        let total = 0;
        filteredOrders.forEach(dh => {
            if(dh.trangThaiHienTai === "Giao thành công"){
                total += (dh.tongThuHo_COD || 0);
            }

        });

        return total;
    }

    const getTopShippers = () => {
        if (!filteredOrders || !Array.isArray(filteredOrders)) return [];

        const successOrders = filteredOrders.filter(
            order => order.trangThaiHienTai === 'Giao thành công' && order.shipper != null
        );

        const shipperStats = {};
        successOrders.forEach(order => {
            const shipperId = order.shipper.maShipper; 
            
            if (!shipperStats[shipperId]) {
                shipperStats[shipperId] = {
                    hoTen: order.shipper.hoTen,
                    sdt: order.shipper.soDienThoai,
                    soDonThanhCong: 0,
                    tongCOD: 0
                };
            }
            
            shipperStats[shipperId].soDonThanhCong += 1;
            shipperStats[shipperId].tongCOD += (order.tongThuHo_COD || 0);
        });

      
        const sortedShippers = Object.values(shipperStats)
            .sort((a, b) => b.soDonThanhCong - a.soDonThanhCong)
            .slice(0, 3); 

        return sortedShippers;
    };

    const getChartData = () => {
        const daysCount = {
            'T2': 0, 'T3': 0, 'T4': 0, 'T5': 0, 'T6': 0, 'T7': 0, 'CN': 0
        };

        filteredOrders.forEach(order => {
            if (order.thoiGianTao) {
                const date = new Date(order.thoiGianTao);
                const dayIndex = date.getDay();
                
                switch (dayIndex) {
                    case 0: daysCount['CN'] += 1; break;
                    case 1: daysCount['T2'] += 1; break;
                    case 2: daysCount['T3'] += 1; break;
                    case 3: daysCount['T4'] += 1; break;
                    case 4: daysCount['T5'] += 1; break;
                    case 5: daysCount['T6'] += 1; break;
                    case 6: daysCount['T7'] += 1; break;
                }
            }
        });

        return [
            { name: 'T2', value: daysCount['T2'] },
            { name: 'T3', value: daysCount['T3'] },
            { name: 'T4', value: daysCount['T4'] },
            { name: 'T5', value: daysCount['T5'] },
            { name: 'T6', value: daysCount['T6'] },
            { name: 'T7', value: daysCount['T7'] },
            { name: 'CN', value: daysCount['CN'] }
        ];
    };

    const handleExportExcel = () => {
        const headers = ["Mã vận đơn", "Người gửi", "Người nhận", "Shipper", "Phí vận chuyển", "Tiền COD", "Trạng thái", "Thời gian tạo"];
        const rows = filteredOrders.map((dh) => [
            dh.maDonHang || "",
            dh.tenNguoiGui || "",
            dh.tenNguoiNhan || "",
            dh.shipper?.hoTen || "Chưa phân công",
            dh.phiVanChuyen ?? 0,
            dh.tongThuHo_COD ?? 0,
            dh.trangThaiHienTai || "",
            dh.thoiGianTao || ""
        ]);

        const csvContent = "\uFEFF" + [headers, ...rows]
            .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
            .join("\n");

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `bao_cao_tong_quan_${dateRange}.csv`;
        link.click();
        URL.revokeObjectURL(url);
    };

    return(
        <div className="p-5">
            {/* Title */}
            {/* Searchbar */}
            <div className="bg-white p-5 mt-5 rounded-xl">

                <form onSubmit={(e) => e.preventDefault()} className="pr-2 pl-2 flex flex-wrap gap-3 items-center" action="">
                    <div className="flex-1 min-w-[200px]">
                        <p className="font-semibold">Báo cáo tổng quan</p>
                        <p className="text-xs text-gray-500">Dữ liệu được cập nhật theo khoảng thời gian đã chọn</p>
                    </div>

                    <div className="w-48">
                        <select
                            value={dateRange}
                            onChange={(e) => setDateRange(e.target.value)}
                            className="border border-gray-300 rounded-xl p-3 w-full bg-white cursor-pointer"
                        >
                            <option value="all">Tất cả thời gian</option>
                            <option value="today">Hôm nay</option>
                            <option value="7days">7 ngày gần nhất</option>
                            <option value="30days">30 ngày gần nhất</option>
                            <option value="thisMonth">Tháng này</option>
                            <option value="custom">Tùy chọn ngày</option>
                        </select>
                    </div>

                    {dateRange === "custom" && (
                        <div className="flex items-center gap-2">
                            <input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="border border-gray-300 rounded-xl p-2.5 text-sm"
                                title="Từ ngày"
                            />
                            <span className="text-gray-400 text-sm">-</span>
                            <input
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="border border-gray-300 rounded-xl p-2.5 text-sm"
                                title="Đến ngày"
                            />
                        </div>
                    )}

                    <div className="w-40">
                        <button
                            type="button"
                            onClick={handleExportExcel}
                            className="font-bold text-white bg-blue-500 hover:bg-blue-600 cursor-pointer border border-gray-300 rounded-xl w-full p-3 transition-colors"
                        >
                            Xuất Excel
                        </button>
                    </div>
                </form>
            </div>

            {/* List of orders */}
            <div className="mt-4">
                {/* Sumary */}
                <div className="flex gap-4 items-center">
                    <div className="w-1/4 p-5 bg-white rounded-xl border-l-3 border-blue-500">
                        <p className="text-xs text-gray-500">Tổng đơn</p>
                        <p className="font-bold text-xl">{totalOrder()}</p>
                        <p className="text-xs text-gray-500">Tổng đơn trong kỳ</p>
                    </div>
                    <div className="w-1/4 p-5 bg-white rounded-xl border-l-3 border-green-500">
                        <p className="text-xs text-gray-500">Giao thành công</p>
                        <p className="font-bold text-xl">{totalCompleteOrder()}</p>
                        <p className="text-xs text-gray-500">{calcPercent(totalCompleteOrder())}% tổng đơn</p>
                    </div>
                    <div className="w-1/4 p-5 bg-white rounded-xl border-l-3 border-orange-300">
                        <p className="text-xs text-gray-500">Đang giao</p>
                        <p className="font-bold text-xl">{totalDeliveringOrder()}</p>
                        <p className="text-xs text-gray-500">{calcPercent(totalDeliveringOrder())}% tổng đơn</p>
                    </div>
                    <div className="w-1/4 p-5 bg-white rounded-xl border-l-3 border-red-500">
                        <p className="text-xs text-gray-500">Giao thất bại</p>
                        <p className="font-bold text-xl">{totalCancelOrder()}</p>
                        <p className="text-xs text-gray-500">{calcPercent(totalCancelOrder())}% tổng đơn</p>
                    </div>
                </div> 

                {/* Total Income */}
                <div className="mt-4 flex items-center gap-4">
                    <div className="w-1/2 flex items-center justify-between p-5 bg-white rounded-xl border-l-3 border-green-500">
                        <div>
                            <p>Tổng doanh thu (Phí vận chuyển)</p>
                            <p className="text-xs text-gray-500">Doanh thu ghi nhận trong kỳ</p>
                        </div>

                        <div className='flex flex-col items-end'>
                            <p className="text-xl font-bold">{totalShipCost().toLocaleString('vi-VN')} đ</p>
                            <p className="text-xs text-green-500">+12% so với kỳ trước</p>
                        </div>
                    </div>

                    <div className="w-1/2 flex items-center justify-between p-5 bg-white rounded-xl border-l-3 border-blue-500">
                        <div>
                            <p>Tổng tiền COD chờ đối soát</p>
                            <p className="text-xs text-gray-500">Công nợ cần xử lý</p>
                        </div>

                        <div className='flex flex-col items-end'>
                            <p className="text-xl font-bold">{totalCODCost().toLocaleString('vi-VN')} đ</p>
                            <p className="text-xs text-green-500">Số tiền tài xế đang giữ</p>
                        </div>
                    </div>
                </div>

                {/* Chart */}
                <div className='mt-4'>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
                        <div className="col-span-2 bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                            <div>
                            <h3 className="text-lg font-bold text-gray-800">Đơn hàng theo ngày</h3>
                            <p className="text-sm text-gray-400 mt-1">Khối lượng xử lý trong kỳ</p>
                            </div>
                            
                            <div className="h-64 mt-6">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={getChartData()} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                                {/* Trục X */}
                                <XAxis 
                                    dataKey="name" 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{ fill: '#9ca3af', fontSize: 12 }} 
                                    dy={10} 
                                />
                                <Bar 
                                    dataKey="value" 
                                    fill="#3b82f6" 
                                    radius={[4, 4, 0, 0]} 
                                    barSize={40} 
                                />
                                </BarChart>
                            </ResponsiveContainer>
                            </div>
                        </div>

                        <div className="col-span-1 bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col">
                            <div>
                            <h3 className="text-lg font-bold text-gray-800">Tỷ lệ trạng thái</h3>
                            <p className="text-sm text-gray-400 mt-1">Phân bổ toàn bộ đơn hàng</p>
                            </div>
                            
                            <div className="flex-1 flex items-center justify-between mt-6 gap-4">
                            
                            <div className="relative w-36 h-36 flex-shrink-0">
                                <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                    data={pieData}
                                    innerRadius={50}
                                    outerRadius={70}
                                    paddingAngle={0}
                                    dataKey="value"
                                    stroke="none"
                                    >
                                    {pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                    </Pie>
                                </PieChart>
                                </ResponsiveContainer>

                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-xl font-bold text-gray-800">{totalOrder()}</span>
                                <span className="text-xs text-gray-400">Tổng đơn</span>
                                </div>
                            </div>

                            <div className="flex-1 flex flex-col gap-4 pl-2">
                                {pieData.map((item, index) => (
                                <div key={index} className="flex items-center justify-between text-sm">
                                    <div className="flex items-center gap-2">
                                    <span 
                                        className="w-2.5 h-2.5 rounded-full" 
                                        style={{ backgroundColor: item.color }}
                                    ></span>
                                    <span className="text-gray-600">{item.name}</span>
                                    </div>
                                    <span className="font-bold text-gray-800">{calcPercent(item.value)}%</span>
                                </div>
                                ))}
                            </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-4">
                <div className="bg-white rounded-xl pt-3 pb-3">
                    <div className="flex items-center justify-between p-3">
                        <div>
                            <p className="text-xl">Top Shipper trong kỳ</p>
                            <p className="text-xs text-gray-500">Xếp hạng theo số đơn giao thành công trong khoảng thời gian đã chọn</p>
                        </div>

                        <div>
                            <span class="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium text-blue-700 bg-blue-50 rounded-full">
                                <span class="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                                Top 3 hiệu suất
                            </span>
                        </div>
                    </div>
                    <table class="w-full rounded-xl text-left border-collapse">
                        <thead>
                            <tr class="text-xs font-semibold text-gray-500 uppercase bg-gray-50 border-b border-gray-200">
                                <th class="px-6 py-4">HỌ VÀ TÊN</th>
                                <th class="px-6 py-4">SĐT</th>
                                <th class="px-6 py-4 whitespace-nowrap">SỐ ĐƠN HÀNG THÀNH CÔNG</th>
                                <th class="px-6 py-4 text-center">TỔNG COD ĐÃ THU</th>
                            </tr>
                        </thead>
                        <tbody class="text-sm text-gray-700">
                            {getTopShippers().map((shipper, index) => (
                                <tr key={index} class="border-b border-gray-200 bg-white hover:bg-gray-50 transition-colors">
                                    <td class="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <span className={`font-bold ${index === 0 ? 'text-yellow-500' : index === 1 ? 'text-gray-400' : 'text-orange-400'}`}>
                                                #{index + 1}
                                            </span>
                                            <p class="font-bold text-gray-900">{shipper.hoTen}</p>
                                        </div>
                                    </td>
                                    <td class="px-6 py-4 text-gray-500">{shipper.sdt}</td>
                                    <td class="font-semibold text-blue-500 px-6 py-4">
                                        {shipper.soDonThanhCong} đơn
                                    </td>
                                    <td class="flex items-center justify-center font-bold px-6 py-4">
                                        {shipper.tongCOD.toLocaleString('vi-VN')}đ
                                    </td>
                                </tr>
                            ))}
                            
                            {getTopShippers().length === 0 && (
                                <tr>
                                    <td colSpan="4" className="px-6 py-4 text-center text-gray-500 italic">
                                        Chưa có dữ liệu giao hàng thành công trong kỳ
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

            </div>
        </div>
    );
}

export default Report;