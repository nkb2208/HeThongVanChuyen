import { use, useEffect, useState } from "react";
import { createPortal } from 'react-dom';

function Modal({ isOpen, onClose, children }) {
  if (!isOpen) return null;

  return createPortal(
    <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'end',
        justifyContent: 'end'
    }}>
      <div className="w-fit p-5 flex flex-col min-h-screen bg-white">
        {children}
        <div className="mt-4 flex items-center justify-end gap-3">
            <button className="cursor-pointer border border-slate-100 rounded-xl p-3 mt-auto cursor-pointer" onClick={onClose}>Hủy</button>
            <button className="bg-blue-500 rounded-xl p-3 cursor-pointer" onClick={onClose}>Lưu đơn hàng</button>
        </div>
      </div>
    </div>,
    document.body
  );
}

function Product(){
    const [isOpenCreate, setIsOpenCreate] = useState(false);

    const [donHanglst, setDonHanglst] = useState([]);

    useEffect(()=> {
        getAllDonHang();
    },[]);

    const getAllDonHang = async() => {
        try {
            const response =  await fetch("http://localhost:8080/api/order")

            if(!response){
                console.log("Lỗi server");
                return;
            }

            const data = await response.json();

            setDonHanglst(data);
        } catch (error) {
            console.error("Lấy danh sách đơn hàng thất bại! ", error);
        }
    }

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
                        <button type="button" onClick= {()=> setIsOpenCreate(true)} className="cursor-pointer font-bold text-white bg-blue-500 border border-gray-300 rounded-xl w-full p-3">
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
                        {donHanglst.map((donhang) => (
                            <tr key={donhang.maDonHang} class="border-b border-gray-200 bg-white hover:bg-gray-50 transition-colors">
                                <td class="px-6 py-4 font-bold text-blue-600">{donhang.maDonHang}</td>
                                <td class="px-6 py-4">
                                    <p class="font-bold text-gray-900">{donhang.tenNguoiGui}</p>
                                    <p class="text-gray-400 text-xs mt-1">{donhang.tenNguoiNhan}</p>
                                </td>
                                <td class="px-6 py-4 text-gray-500">{donhang.diaChiGiao}</td>
                                <td class="px-6 py-4">{donhang.tongKhoiLuong}</td>
                                <td class="px-6 py-4">{donhang.phiVanChuyen}</td>
                                <td class="px-6 py-4 font-bold text-gray-900">{donhang.tongThuHo_COD}</td>
                                <td class="px-6 py-4 text-gray-500">{donhang.shipper?.hoTen || <span className="text-gray-400 italic">Chưa có shipper nào nhận đơn</span>}</td>
                                <td class="px-6 py-4">
                                    <span class="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium text-amber-700 bg-amber-50 rounded-full">
                                        <span class="w-1.5 h-1.5 bg-amber-500 rounded-full"></span>
                                        {donhang.trangThaiHienTai}
                                    </span>
                                </td>
                                <td class="px-6 py-4">
                                    <div class="flex flex-col gap-2">
                                        <button onClick= {()=> setIsOpenCreate(true)} class="px-3 py-1 text-xs font-medium text-blue-600 border border-blue-200 rounded hover:bg-blue-50">Sửa</button>
                                        <button class="px-3 py-1 text-xs font-medium text-red-600 border border-red-200 rounded hover:bg-red-50">Hủy đơn</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            
            <Modal isOpen={isOpenCreate} onClose={() => setIsOpenCreate(false)}>
                <div className="sticky top-3 pb-3 border-b border-gray-300 flex items-center justify-between">
                    <div className="">
                        <p>Tạo đơn hàng mới</p>
                        <p className="text-xs text-gray-500">Nhập đầy đủ thông tin giao nhận</p>
                    </div>

                    <div>

                    </div>
                </div>

                <div className="mt-4">
                    <form className="mt-4 w-full" action="">
                        <p className="text-blue-500">Thông tin người gửi</p>

                        <div className="mt-4 flex items-center gap-3">
                            <div>
                                <label className="text-xs font-semibold" htmlFor="">Họ tên người gửi</label>
                                <input className="w-full border border-gray-300 p-2 rounded-xl" type="text" name="" id="" />
                            </div>

                            <div>
                                <label className="text-xs font-semibold" htmlFor="">Số điện thoại</label>
                                <input className="w-full border border-gray-300 p-2 rounded-xl" type="text" name="" id="" />
                            </div>
                        </div>

                        <div className="mt-4">
                            <label className="text-xs font-semibold" htmlFor="">Địa chỉ lấy hàng</label>
                            <input className="w-full border border-gray-300 p-2 rounded-xl" type="text" name="" id="" />
                        </div>


                        <p className="text-blue-500">Thông tin người gửi</p>
                        <div className="mt-4 flex items-center gap-3">
                            <div>
                                <label className="text-xs font-semibold" htmlFor="">Họ tên người nhận</label>
                                <input className="w-full border border-gray-300 p-2 rounded-xl" type="text" name="" id="" />
                            </div>

                            <div>
                                <label className="text-xs font-semibold" htmlFor="">Số điện thoại</label>
                                <input className="w-full border border-gray-300 p-2 rounded-xl" type="text" name="" id="" />
                            </div>
                        </div>
                        <div className="mt-4">
                            <label className="text-xs font-semibold" htmlFor="">Địa chỉ giao hàng</label>
                            <input className="w-full border border-gray-300 p-2 rounded-xl" type="text" name="" id="" />
                        </div>

                        <p className="text-blue-500">Thông tin kiện hàng</p>
                        <div className="mt-4 flex items-center gap-3">
                            <div>
                                <label className="text-xs font-semibold" htmlFor="">Khối lượng (kg)</label>
                                <input className="w-full border border-gray-300 p-2 rounded-xl" type="text" name="" id="" />
                            </div>

                            <div>
                                <label className="text-xs font-semibold" htmlFor="">Khu vực giao</label>
                                <input className="w-full border border-gray-300 p-2 rounded-xl" type="text" name="" id="" />
                            </div>
                        </div>
                        <div className="mt-4">
                            <label className="text-xs font-semibold" htmlFor="">Tiền thu COD</label>
                            <input className="w-full border border-gray-300 p-2 rounded-xl" type="text" name="" id="" />
                        </div>

                        <div className="mt-4 p-3 pt-4 pb-4 bg-blue-100 rounded-xl">
                            <div className="mt-3 flex items-center justify-between">
                                <p className="text-blue-500">Tự động tính phí vận chuyển</p>
                                <p className="text-blue-500"><span></span>Đã tính</p>
                            </div>

                            <div className="mt-3 flex items-center justify-between">
                                <p className="text-gray-500">Phí cơ bản</p>
                                <p className="text-gray-500 font-semibold">20.000đ</p>
                            </div>

                            <div className="mt-3 flex items-center justify-between">
                                <p className="text-gray-500">Phí vượt cân</p>
                                <p className="text-gray-500 font-semibold">10.000đ</p>
                            </div>

                            <div className="mt-3 flex items-center justify-between">
                                <p className="text-gray-500">Tổng phí vận chuyển</p>
                                <p className="text-blue-500 font-semibold text-xl">30.000đ</p>
                            </div>
                        
                        </div>
                    </form>
                </div>
            </Modal>
        </div>
    );
}

export default Product;