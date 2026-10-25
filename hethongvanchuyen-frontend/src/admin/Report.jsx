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

    const pieData = [
    { name: 'Thành công', value: 84, color: '#22c55e' },
    { name: 'Đang giao', value: 10, color: '#f59e0b' },  
    { name: 'Thất bại/Hủy', value: 6, color: '#ef4444' },
    ];

    const [orderLst, setOrderLst] = useState([]);
    const [shipperLst, setShipperLst] = useState([]);

    useEffect(()=>{
        getAllOrders();
        getAllShippers();
    }, []);

    const getAllOrders = async () => {
        try {
            const response = await fetch("http://localhost:8080/api/order");

            if(!response){
                console.log("Lỗi server");
                return;
            }

            const data =  response.json();
            setOrderLst(data);
            console.log("Lấy danh sách đơn hàng thành công");
        } catch (error) {
            console.error("Không thể lấy danh sách đơn hàng: ", error);
        }
    }

    const getAllShippers = async () => {
        try {
            const response = await fetch("http://localhost:8080/api/shipper");

            if(!response){
                console.log("Lỗi server");
                return;
            }

            const data =  response.json();
            setShipperLst(data);
            console.log("Lấy danh sách shipper thành công");
        } catch (error) {
            console.error("Không thể lấy danh sách shipper: ", error);
        }
    }

    return(
        <div className="p-5">
            {/* Title */}
            <div className="w-full flex items-center justify-between">
                <div>
                    <p className="text-xl">Thống kê báo cáo</p>
                    <p className="text-xs text-gray-500">Theo dõi hiệu suất vận hành hệ thống</p>
                </div>

                <div className="flex items-center gap-3">
                    <div>

                    </div>

                    <div className="flex items-center gap-3">
                        {/* avatar */}
                        <div className="bg-blue-100 rounded-full text-blue-500 font-bold w-10 h-10 flex items-center justify-center">
                            AN
                        </div>

                        {/* name and role */}
                        <div>
                            <p className="font-bold">Anh Nguyễn</p>
                            <p className="text-xs text-gray-500">Quản lý</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Searchbar */}
            <div className="bg-white p-5 mt-5 rounded-xl">

                <form className=" pr-2 pl-2 flex gap-3 items-center" action="">
                    <div className=" w-4/6">
                        <p className="font-semibold">Báo cáo tổng quan</p>
                        <p className="text-xs text-gray-500">Dữ liệu được cập nhật theo thời gian thực</p>
                    </div>

                    <div className="w-1/6">
                        <select defaultValue="all" className="border border-gray-300 rounded-xl p-3 rounded-xl w-full">
                            <option value="all">7 ngày gần nhất</option>
                            <option value="">30 ngày gần nhất</option>
                            <option value="">Tháng này</option>

                        </select>
                    </div>

                    <div className=" w-1/6">
                        <button className="font-bold text-white bg-blue-500 border border-gray-300 rounded-xl w-full p-3">
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
                        <p className="font-bold text-xl"></p>
                        <p className="text-xs text-gray-500">+12,5%</p>
                    </div>
                    <div className="w-1/4 p-5 bg-white rounded-xl border-l-3 border-green-500">
                        <p className="text-xs text-gray-500">Giao thành công</p>
                        <p className="font-bold text-xl">1.050</p>
                        <p className="text-xs text-gray-500">+84% tổng đơn</p>
                    </div>
                    <div className="w-1/4 p-5 bg-white rounded-xl border-l-3 border-orange-300">
                        <p className="text-xs text-gray-500">Đang giao</p>
                        <p className="font-bold text-xl">120</p>
                        <p className="text-xs text-gray-500">+9,6% tổng đơn</p>
                    </div>
                    <div className="w-1/4 p-5 bg-white rounded-xl border-l-3 border-red-500">
                        <p className="text-xs text-gray-500">Giao thất bại</p>
                        <p className="font-bold text-xl"></p>
                        <p className="text-xs text-gray-500">6,4% tổng đơn</p>
                    </div>
                </div> 

                {/* Total Income */}
                <div className="mt-4 flex items-center gap-4">
                    <div className="w-1/2 flex items-center justify-between p-5 bg-white rounded-xl border-l-3 border-green-500">
                        <div>
                            <p>Tổng doanh thu (Phí vận chuyển)</p>
                            <p className="text-xs text-gray-500">Doanh thu ghi nhận trong kỳ</p>
                        </div>

                        <div>
                            <p className="text-xl font-bold">15.450.000đ</p>
                            <p className="text-xs text-green-500">+12% so với kỳ trước</p>
                        </div>
                    </div>

                    <div className="w-1/2 flex items-center justify-between p-5 bg-white rounded-xl border-l-3 border-blue-500">
                        <div>
                            <p>Tổng tiền COD chờ đối soát</p>
                            <p className="text-xs text-gray-500">Công nợ cần xử lý</p>
                        </div>

                        <div>
                            <p className="text-xl font-bold">85.000.000đ</p>
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
                                <BarChart data={barData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
                                <span className="text-xl font-bold text-gray-800">1.250</span>
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
                                    <span className="font-bold text-gray-800">{item.value}%</span>
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
                            <tr class="border-b border-gray-200 bg-white hover:bg-gray-50 transition-colors">
                                <td class="px-6 py-4">
                                    <p class="font-bold text-gray-900">Nguyễn Văn A</p>
                                </td>
                                <td class="px-6 py-4 text-gray-500">0903 456 789</td>
                                <td class="font-semibold text-blue-500 px-6 py-4">
                                    286
                                </td>
                                <td class="flex items-center justify-center px-6 py-4">
                                    126.500.000đ
                                </td>
                            </tr>
                            
                        </tbody>
                    </table>
                </div>

            </div>
        </div>
    );
}

export default Report;