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
      </div>
    </div>,
    document.body
  );
}

function Product(){
    const [isOpenCreate, setIsOpenCreate] = useState(false);

    // Lay danh sách đơn hàng
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

            console.log("Lấy danh sách đơn hàng thành công!");
            setDonHanglst(data);
        } catch (error) {
            console.error("Lấy danh sách đơn hàng thất bại! ", error);
        }
    }

    // khai bao doi tuong don hang de tao don hang
    const [newDonHang, setNewDonHang] = useState({
        tenNguoiGui: '',
        sdtNguoiGui: '',
        diaChiGui: '',
        tenNguoiNhan: '',
        sdtNguoiNhan: '',
        diaChiGiao: '',
        tongKhoiLuong: 0,
        phiVanChuyen: 0,
        tongThuHo_COD: 0
    });
    

    // tinh phi van chuyen tu dong
    const tinhPhiVanChuyen = (khoiLuong) =>{
        const kl = parseFloat(khoiLuong) || 0;
        if (kl <= 0) return { phiCoBan: 0, phiVuotCan: 0, tongPhi: 0 };

        const phiCoBan = 20000;
        let phiVuotCan = 0;

        if (kl > 2) {
            phiVuotCan = Math.ceil(kl - 2) * 10000; 
        }

        return {
            phiCoBan,
            phiVuotCan,
            tongPhi: phiCoBan + phiVuotCan
        };
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        setNewDonHang(prev => {
            const updated = { ...prev, [name]: value };

            if (name === 'tongKhoiLuong') {
                const chiTiet = tinhPhiVanChuyen(value);
                updated.phiVanChuyen = chiTiet.tongPhi;
            }

            return updated;
        });
    };

    const chiTietPhi = tinhPhiVanChuyen(newDonHang.tongKhoiLuong);

    // ham tao don hang moi
    const createDonHang = async (e) =>{
        e.preventDefault();
        try {
            const response = await fetch("http://localhost:8080/api/order/create", {
                method : "POST",
                headers: {
                    'Content-Type' : 'application/json',
                },
                body: JSON.stringify(newDonHang)
            });

            if(!response){
                console.log("Lỗi server");
                return;
            }
            
            setIsOpenCreate(false);
            getAllDonHang();

            setNewDonHang({
                tenNguoiGui: '',
                sdtNguoiGui: '',
                diaChiGui: '',
                tenNguoiNhan: '',
                sdtNguoiNhan: '',
                diaChiGiao: '',
                tongKhoiLuong: 0,
                phiVanChuyen: 0,
                tongThuHo_COD: 0
            })

            console.log("Tạo đơn hàng thành công!");
        } catch (error) {
            console.error("Không thể tạo đơn hàng!");
        }
    }

    const [isOpenEdit, setIsOpenEdit] = useState(false);
    const [editDonHang, setEditDonHang] = useState(null);


    const handleOpenEdit = (donHang) => {
        setEditDonHang(donHang);
        setIsOpenEdit(true);
    };

    const handleEditInputChange = (e) => {
        const { name, value } = e.target;
        setEditDonHang(prev => {
            const updated = { ...prev, [name]: value };
            if (name === 'tongKhoiLuong') {
                const chiTiet = tinhPhiVanChuyen(value);
                updated.phiVanChuyen = chiTiet.tongPhi;
            }
            return updated;
        });
    };

    // Hàm cập nhật đơn hàng
    const updateDonHang = async (e) => {
        e.preventDefault(); 
        try {
            const response = await fetch(`http://localhost:8080/api/order/update/${editDonHang.maDonHang}`, {
                method : "PUT",
                headers: {
                    'Content-Type' : 'application/json',
                },
                body: JSON.stringify(editDonHang)
            });

            if(!response.ok){
                alert("Lỗi khi cập nhật!");
                return;
            }

            alert("Cập nhật đơn hàng thành công!");
            setIsOpenEdit(false); 
            getAllDonHang();      

        } catch (error) {
            console.error("Không thể cập nhật đơn hàng: ", error);
        }
    }

    const cancelDonHang = async(maDonHang) => {
        // 1. Hiển thị hộp thoại xác nhận để tránh bấm nhầm
        const xacNhan = window.confirm(`Bạn có chắc chắn muốn HỦY đơn hàng ${maDonHang} không?`);
        
        if (!xacNhan) return; 

        try {
            // 2. Gọi API cập nhật trạng thái (Bạn cần tạo API này ở Spring Boot)
            const response = await fetch(`http://localhost:8080/api/order/cancel/${maDonHang}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' }
            });

            if (!response.ok) {
                alert("Lỗi khi hủy đơn hàng!");
                return;
            }

            alert("Đã hủy đơn hàng thành công!");
            
            await getAllDonHang();

        } catch (error) {
            console.error("Lỗi kết nối khi hủy đơn: ", error);
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
                                        <button onClick= {()=> handleOpenEdit(donhang)} class="px-3 py-1 text-xs font-medium text-blue-600 border border-blue-200 rounded hover:bg-blue-50">Sửa</button>
                                        <button onClick={()=>cancelDonHang(donhang.maDonHang)} class="px-3 py-1 text-xs font-medium text-red-600 border border-red-200 rounded hover:bg-red-50">Hủy đơn</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            
            {/* Model Tạo đơn hàng */}
            <Modal isOpen={isOpenCreate} onClose={() => setIsOpenCreate(false)}>
                <div className="sticky top-2 pb-2 border-b border-gray-300 flex items-center justify-between">
                    <div className="">
                        <p>Tạo đơn hàng mới</p>
                        <p className="text-xs text-gray-500">Nhập đầy đủ thông tin giao nhận</p>
                    </div>

                    <div>

                    </div>
                </div>

                <div className="mt-4">
                    <form className="mt-4 w-full" action="" onSubmit={createDonHang}>
                        <p className="text-blue-500">Thông tin người gửi</p>

                        <div className="mt-4 flex items-center gap-3">
                            <div>
                                <label className="text-xs font-semibold" htmlFor="">Họ tên người gửi</label>
                                <input className="w-full border border-gray-300 p-2 rounded-xl" value={newDonHang.tenNguoiGui} onChange={handleInputChange} type="text" name="tenNguoiGui" id="" />
                            </div>

                            <div>
                                <label className="text-xs font-semibold" htmlFor="">Số điện thoại</label>
                                <input value={newDonHang.sdtNguoiGui} onChange={handleInputChange} className="w-full border border-gray-300 p-2 rounded-xl" type="text" name="sdtNguoiGui" id="" />
                            </div>
                        </div>

                        <div className="mt-4">
                            <label className="text-xs font-semibold" htmlFor="">Địa chỉ lấy hàng</label>
                            <input value={newDonHang.diaChiGui} onChange={handleInputChange} className="w-full border border-gray-300 p-2 rounded-xl" type="text" name="diaChiGui" id="" />
                        </div>


                        <p className="text-blue-500">Thông tin người gửi</p>
                        <div className="mt-4 flex items-center gap-3">
                            <div>
                                <label className="text-xs font-semibold" htmlFor="">Họ tên người nhận</label>
                                <input value={newDonHang.tenNguoiNhan} onChange={handleInputChange} className="w-full border border-gray-300 p-2 rounded-xl" type="text" name="tenNguoiNhan" id="" />
                            </div>

                            <div>
                                <label className="text-xs font-semibold" htmlFor="">Số điện thoại</label>
                                <input value={newDonHang.sdtNguoiNhan} onChange={handleInputChange} className="w-full border border-gray-300 p-2 rounded-xl" type="text" name="sdtNguoiNhan" id="" />
                            </div>
                        </div>
                        <div className="mt-4">
                            <label className="text-xs font-semibold" htmlFor="">Địa chỉ giao hàng</label>
                            <input value={newDonHang.diaChiGiao} onChange={handleInputChange} className="w-full border border-gray-300 p-2 rounded-xl" type="text" name="diaChiGiao" id="" />
                        </div>

                        <p className="text-blue-500">Thông tin kiện hàng</p>
                        <div className="mt-4">
                            <div>
                                <label className="text-xs font-semibold" htmlFor="">Khối lượng (kg)</label>
                                <input value={newDonHang.tongKhoiLuong} onChange={handleInputChange} className="w-full border border-gray-300 p-2 rounded-xl" type="text" name="tongKhoiLuong" id="" />
                            </div>
                        </div>
                        <div className="mt-4">
                            <label className="text-xs font-semibold" htmlFor="">Tiền thu COD</label>
                            <input value={newDonHang.tongThuHo_COD} onChange={handleInputChange} className="w-full border border-gray-300 p-2 rounded-xl" type="text" name="tongThuHo_COD" id="" />
                        </div>

                        <div className="mt-4 p-3 pt-4 pb-4 bg-blue-100 rounded-xl">
                            <div className="mt-3 flex items-center justify-between">
                                <p className="text-blue-500 font-semibold">Tự động tính phí vận chuyển</p>
                                <p className="text-blue-500 text-xs font-bold bg-blue-200 px-2 py-1 rounded">
                                    {newDonHang.tongKhoiLuong > 0 ? "Đã tính" : "Chưa tính"}
                                </p>
                            </div>

                            <div className="mt-3 flex items-center justify-between">
                                <p className="text-gray-500">Phí cơ bản</p>
                                <p className="text-gray-500 font-semibold">{chiTietPhi.phiCoBan.toLocaleString('vi-VN')}đ</p>
                            </div>

                            <div className="mt-3 flex items-center justify-between">
                                <p className="text-gray-500">Phí vượt cân</p>
                                <p className="text-gray-500 font-semibold">{chiTietPhi.phiVuotCan.toLocaleString('vi-VN')}đ</p>
                            </div>

                            <div className="mt-3 flex items-center justify-between border-t border-blue-200 pt-2">
                                <p className="text-gray-700 font-bold">Tổng phí vận chuyển</p>
                                <p className="text-blue-600 font-bold text-xl">{chiTietPhi.tongPhi.toLocaleString('vi-VN')}đ</p>
                            </div>
                        </div>

                        <div className="mt-4 flex items-center justify-end gap-3">
                            <button type= "button" className="cursor-pointer border border-slate-100 rounded-xl p-3 mt-auto cursor-pointer" onClick={() => {setIsOpenCreate(false)}}>Hủy</button>
                            <button type="submit" className="text-white cursor-pointer bg-blue-500 rounded-xl p-3 cursor-pointer">Lưu đơn hàng</button>
                        </div>
                    </form>
                </div>
            </Modal>

            {/* Model Chỉnh sửa đơn hàng */}
            <Modal isOpen={isOpenEdit} onClose={() => setIsOpenEdit(false)}>
                <div className="sticky top-2 pb-2 border-b border-gray-300 flex items-center justify-between">
                    <div className="">
                        <p>Chỉnh sửa đơn hàng</p>
                        <p className="text-xs text-gray-500">Chỉnh sửa thông tin giao nhận</p>
                    </div>
                </div>

                <div className="mt-4">
                    {editDonHang && (
                        <form className="mt-4 w-full" action="" onSubmit={updateDonHang}>
                            <p className="text-blue-500">Thông tin người gửi</p>

                            <div className="mt-4 flex items-center gap-3">
                                <div>
                                    <label className="text-xs font-semibold" htmlFor="">Họ tên người gửi</label>
                                    <input className="w-full border border-gray-300 p-2 rounded-xl" value={editDonHang.tenNguoiGui} onChange={handleEditInputChange} type="text" name="tenNguoiGui" id="" />
                                </div>

                                <div>
                                    <label className="text-xs font-semibold" htmlFor="">Số điện thoại</label>
                                    <input value={editDonHang.sdtNguoiGui} onChange={handleEditInputChange} className="w-full border border-gray-300 p-2 rounded-xl" type="text" name="sdtNguoiGui" id="" />
                                </div>
                            </div>

                            <div className="mt-4">
                                <label className="text-xs font-semibold" htmlFor="">Địa chỉ lấy hàng</label>
                                <input value={editDonHang.diaChiGui} onChange={handleEditInputChange} className="w-full border border-gray-300 p-2 rounded-xl" type="text" name="diaChiGui" id="" />
                            </div>


                            <p className="text-blue-500">Thông tin người gửi</p>
                            <div className="mt-4 flex items-center gap-3">
                                <div>
                                    <label className="text-xs font-semibold" htmlFor="">Họ tên người nhận</label>
                                    <input value={editDonHang.tenNguoiNhan} onChange={handleEditInputChange} className="w-full border border-gray-300 p-2 rounded-xl" type="text" name="tenNguoiNhan" id="" />
                                </div>

                                <div>
                                    <label className="text-xs font-semibold" htmlFor="">Số điện thoại</label>
                                    <input value={editDonHang.sdtNguoiNhan} onChange={handleEditInputChange} className="w-full border border-gray-300 p-2 rounded-xl" type="text" name="sdtNguoiNhan" id="" />
                                </div>
                            </div>
                            <div className="mt-4">
                                <label className="text-xs font-semibold" htmlFor="">Địa chỉ giao hàng</label>
                                <input value={editDonHang.diaChiGiao} onChange={handleEditInputChange} className="w-full border border-gray-300 p-2 rounded-xl" type="text" name="diaChiGiao" id="" />
                            </div>

                            <p className="text-blue-500">Thông tin kiện hàng</p>
                            <div className="mt-4">
                                <div>
                                    <label className="text-xs font-semibold" htmlFor="">Khối lượng (kg)</label>
                                    <input value={editDonHang.tongKhoiLuong} onChange={handleEditInputChange} className="w-full border border-gray-300 p-2 rounded-xl" type="text" name="tongKhoiLuong" id="" />
                                </div>
                            </div>
                            <div className="mt-4">
                                <label className="text-xs font-semibold" htmlFor="">Tiền thu COD</label>
                                <input value={editDonHang.tongThuHo_COD} onChange={handleEditInputChange} className="w-full border border-gray-300 p-2 rounded-xl" type="text" name="tongThuHo_COD" id="" />
                            </div>

                            <div className="mt-4 p-3 pt-4 pb-4 bg-blue-100 rounded-xl">
                                <div className="mt-3 flex items-center justify-between">
                                    <p className="text-blue-500 font-semibold">Tự động tính phí vận chuyển</p>
                                    <p className="text-blue-500 text-xs font-bold bg-blue-200 px-2 py-1 rounded">
                                        {editDonHang.tongKhoiLuong > 0 ? "Đã tính" : "Chưa tính"}
                                    </p>
                                </div>

                                <div className="mt-3 flex items-center justify-between">
                                    <p className="text-gray-500">Phí cơ bản</p>
                                    <p className="text-gray-500 font-semibold">{chiTietPhi.phiCoBan.toLocaleString('vi-VN')}đ</p>
                                </div>

                                <div className="mt-3 flex items-center justify-between">
                                    <p className="text-gray-500">Phí vượt cân</p>
                                    <p className="text-gray-500 font-semibold">{chiTietPhi.phiVuotCan.toLocaleString('vi-VN')}đ</p>
                                </div>

                                <div className="mt-3 flex items-center justify-between border-t border-blue-200 pt-2">
                                    <p className="text-gray-700 font-bold">Tổng phí vận chuyển</p>
                                    <p className="text-blue-600 font-bold text-xl">{chiTietPhi.tongPhi.toLocaleString('vi-VN')}đ</p>
                                </div>
                            </div>

                            <div className="mt-4 flex items-center justify-end gap-3">
                                <button type="button" className="cursor-pointer border border-slate-100 rounded-xl p-3 mt-auto cursor-pointer" onClick={() => {setIsOpenEdit(false)}}>Hủy</button>
                                <button type="submit" className="text-white cursor-pointer bg-blue-500 rounded-xl p-3 cursor-pointer">Lưu đơn hàng</button>
                            </div>
                        </form>
                    )}

                </div>
            </Modal>
        </div>
    );
}

export default Product;