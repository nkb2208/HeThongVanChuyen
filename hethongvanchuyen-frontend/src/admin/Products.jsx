function Product(){
    return(
        <div className="p-5">
            {/* Title */}
            <div className="w-full flex items-center justify-between">
                <div>
                    <p className="text-xl">Quản lý đơn hàng</p>
                    <p className="text-xs text-gray-500">Tìm kiếm, theo dõi đơn và cập nhật đơn hàng</p>
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
                        <input className="border border-gray-300 rounded-xl p-3 w-full rounded-xl" type="text" placeholder="Tìm mã vận đơn..."/>
                    </div>

                    <div className="w-1/6">
                        <select defaultValue="all" className="border border-gray-300 rounded-xl p-3 rounded-xl w-full">
                            <option value="all">Tất cả trạng thái</option>
                            <option value="">Chờ xử lí</option>
                            <option value="">Đang giao</option>
                            <option value="">Giao thành công</option>
                            <option value="">Giao thất bại</option>
                        </select>
                    </div>

                    <div className=" w-1/6">
                        <button className="font-bold text-white bg-blue-500 border border-gray-300 rounded-xl w-full p-3">
                            + Tạo đơn hàng
                        </button>
                    </div>
                </form>
            </div>

            {/* List of orders */}
            <div className="mt-4">
                <table class="w-full rounded-xl text-left border-collapse">
                    <thead>
                        <tr class="text-xs font-semibold text-gray-500 uppercase bg-gray-50 border-b border-gray-200">
                            <th class="px-6 py-4">MÃ VẬN ĐƠN</th>
                            <th class="px-6 py-4">NGƯỜI GỬI / NGƯỜI NHẬN</th>
                            <th class="px-6 py-4">ĐỊA CHỈ GIAO</th>
                            <th class="px-6 py-4 whitespace-nowrap">KHỐI LƯỢNG</th>
                            <th class="px-6 py-4 whitespace-nowrap">PHÍ VẬN CHUYỂN</th>
                            <th class="px-6 py-4 whitespace-nowrap">TIỀN COD</th>
                            <th class="px-6 py-4">NGƯỜI VẬN CHUYỂN</th>
                            <th class="px-6 py-4 text-center">TRẠNG THÁI</th>
                            <th class="px-6 py-4 text-center">HÀNH ĐỘNG</th>
                        </tr>
                    </thead>
                    <tbody class="text-sm text-gray-700">
                        <tr class="border-b border-gray-200 bg-white hover:bg-gray-50 transition-colors">
                            <td class="px-6 py-4 font-bold text-blue-600">VD1001</td>
                            <td class="px-6 py-4">
                                <p class="font-bold text-gray-900">Công ty An Phát</p>
                                <p class="text-gray-400 text-xs mt-1">Trần Minh Hà</p>
                            </td>
                            <td class="px-6 py-4 text-gray-500">28 Nguyễn Trãi, Q.1</td>
                            <td class="px-6 py-4">2,5 kg</td>
                            <td class="px-6 py-4">30.000đ</td>
                            <td class="px-6 py-4 font-bold text-gray-900">850.000đ</td>
                            <td class="px-6 py-4 text-gray-500">Nguyễn Văn A</td>
                            <td class="px-6 py-4">
                                <span class="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium text-amber-700 bg-amber-50 rounded-full">
                                    <span class="w-1.5 h-1.5 bg-amber-500 rounded-full"></span>
                                    Đang giao
                                </span>
                            </td>
                            <td class="px-6 py-4">
                                <div class="flex flex-col gap-2">
                                    <button class="px-3 py-1 text-xs font-medium text-blue-600 border border-blue-200 rounded hover:bg-blue-50">Sửa</button>
                                    <button class="px-3 py-1 text-xs font-medium text-red-600 border border-red-200 rounded hover:bg-red-50">Hủy đơn</button>
                                </div>
                            </td>
                        </tr>

                        <tr class="border-b border-gray-200 bg-white hover:bg-gray-50 transition-colors">
                            <td class="px-6 py-4 font-bold text-blue-600">VD1002</td>
                            <td class="px-6 py-4">
                                <p class="font-bold text-gray-900">Shop Mộc Nhiên</p>
                                <p class="text-gray-400 text-xs mt-1">Lê Thùy Dung</p>
                            </td>
                            <td class="px-6 py-4 text-gray-500">104 Lê Lợi, Q.3</td>
                            <td class="px-6 py-4">1,2 kg</td>
                            <td class="px-6 py-4">25.000đ</td>
                            <td class="px-6 py-4 font-bold text-gray-900">420.000đ</td>
                            <td class="px-6 py-4 text-gray-400 italic">Chưa phân công</td>
                            <td class="px-6 py-4">
                                <span class="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium text-orange-700 bg-orange-50 rounded-full">
                                    <span class="w-1.5 h-1.5 bg-orange-500 rounded-full"></span>
                                    Chờ xử lý
                                </span>
                            </td>
                            <td class="px-6 py-4">
                                <div class="flex flex-col gap-2">
                                    <button class="px-3 py-1 text-xs font-medium text-blue-600 border border-blue-200 rounded hover:bg-blue-50">Sửa</button>
                                    <button class="px-3 py-1 text-xs font-medium text-red-600 border border-red-200 rounded hover:bg-red-50">Hủy đơn</button>
                                </div>
                            </td>
                        </tr>
                        
                        <tr class="border-b border-gray-200 bg-white hover:bg-gray-50 transition-colors">
                            <td class="px-6 py-4 font-bold text-blue-600">VD1003</td>
                            <td class="px-6 py-4">
                                <p class="font-bold text-gray-900">Phạm Hoàng Nam</p>
                                <p class="text-gray-400 text-xs mt-1">Đỗ Quốc Huy</p>
                            </td>
                            <td class="px-6 py-4 text-gray-500">19 Phan Xích Long</td>
                            <td class="px-6 py-4">4,0 kg</td>
                            <td class="px-6 py-4">40.000đ</td>
                            <td class="px-6 py-4 font-bold text-gray-900">0đ</td>
                            <td class="px-6 py-4 text-gray-500">Trần Văn Bình</td>
                            <td class="px-6 py-4">
                                <span class="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium text-green-700 bg-green-50 rounded-full">
                                    <span class="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                                    Giao thành công
                                </span>
                            </td>
                            <td class="px-6 py-4">
                                <div class="flex flex-col gap-2">
                                    <button class="px-3 py-1 text-xs font-medium text-blue-600 border border-blue-200 rounded hover:bg-blue-50">Sửa</button>
                                    <button class="px-3 py-1 text-xs font-medium text-red-600 border border-red-200 rounded hover:bg-red-50">Hủy đơn</button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Product;