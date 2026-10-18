function Shipper(){
    return(
        <div className="p-5">
            {/* Title */}
            <div className="w-full flex items-center justify-between">
                <div>
                    <p className="text-xl">Quản lý người vận chuyển</p>
                    <p className="text-xs text-gray-500">Quản lý tài khoản và trạng thái hoạt động</p>
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
                        <input className="border border-gray-300 rounded-xl p-3 w-full rounded-xl" type="text" placeholder="Tìm mã người vận chuyển, SĐT,..."/>
                    </div>

                    <div className="w-1/6">
                        <select defaultValue="all" className="border border-gray-300 rounded-xl p-3 rounded-xl w-full">
                            <option value="all">Tất cả trạng thái</option>
                            <option value="">Đang rảnh</option>
                            <option value="">Đang giao</option>
                            <option value="">Nghỉ phép</option>
                            <option value="">Đã khóa</option>
                        </select>
                    </div>

                    <div className=" w-1/6">
                        <button className="font-bold text-white bg-blue-500 border border-gray-300 rounded-xl w-full p-3">
                            + Thêm người vận chuyển
                        </button>
                    </div>
                </form>
            </div>

            {/* List of orders */}
            <div className="mt-4">
                <table class="w-full rounded-xl text-left border-collapse">
                    <thead>
                        <tr class="text-xs font-semibold text-gray-500 uppercase bg-gray-50 border-b border-gray-200">
                            <th class="px-6 py-4">MÃ NVC</th>
                            <th class="px-6 py-4">HỌ TÊN</th>
                            <th class="px-6 py-4">SĐT</th>
                            <th class="px-6 py-4 whitespace-nowrap">BIỂN SỐ XE</th>
                            <th class="px-6 py-4 whitespace-nowrap">LOẠI XE</th>
                            <th class="px-6 py-4 whitespace-nowrap">TRẠNG THÁI</th>
                            <th class="px-6 py-4 text-center">HÀNH ĐỘNG</th>
                        </tr>
                    </thead>
                    <tbody class="text-sm text-gray-700">

                        <tr class="border-b border-gray-200 bg-white hover:bg-gray-50 transition-colors">
                            <td class="px-6 py-4 font-bold text-blue-600">NVC001</td>
                            <td class="px-6 py-4">
                                <p class="font-bold text-gray-900">Nguyễn Văn A</p>
                            </td>
                            <td class="px-6 py-4 text-gray-500">	0903 456 789</td>
                            <td class="px-6 py-4">59X1-123.45</td>
                            <td class="px-6 py-4 text-gray-400">Xe máy</td>
                            <td class="px-6 py-4">
                                <span class="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium text-green-700 bg-green-50 rounded-full">
                                    <span class="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                                    Đang rảnh
                                </span>
                            </td>
                            <td class="px-6 py-4">
                                <div class="flex gap-2">
                                    <button class="w-1/3 rounded-xl px-3 py-1 text-xs font-medium text-blue-600 border border-blue-200 rounded hover:bg-blue-50">Sửa</button>
                                    <button class="w-2/3 rounded-xl px-3 py-1 text-xs font-medium text-red-600 border border-red-200 rounded hover:bg-red-50">Khóa tài khoản</button>
                                </div>
                            </td>
                        </tr>
                        
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Shipper;