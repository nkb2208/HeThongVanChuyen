import { use, useEffect, useState } from "react";
import { createPortal } from 'react-dom';
import GenerateQR from "./GenerateQR";

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
      <div className="w-fit p-5 flex flex-col h-screen overflow-y-auto bg-white">
        {children}
      </div>
    </div>,
    document.body
  );
}

function Product(){
    const [isOpenCreate, setIsOpenCreate] = useState(false);
    const [isOpenQR, setIsOpenQR] = useState(false);
    const [qrOrder, setQrOrder] = useState(null);

    const handleOpenQR = (donhang) => {
        setQrOrder(donhang);
        setIsOpenQR(true);
    };
    // Lay danh sách đơn hàng
    const [donHanglst, setDonHanglst] = useState([]);
    useEffect(()=> {
        getAllDonHang();
    },[]);

    const getAllDonHang = async() => {
        try {
            const token = localStorage.getItem("token");
            const response =  await fetch("http://localhost:8080/api/order", {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })

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
    const [chiTietItems, setChiTietItems] = useState([]);

    // Thêm dòng chi tiết đơn hàng
    const handleAddChiTietItem = () => {
        setChiTietItems(prev => [...prev, { tenHangHoa: '', soLuong: 1, khoiLuongDonVi: 0 }]);
    };

    // Xóa dòng chi tiết đơn hàng và tính lại tổng khối lượng
    const handleRemoveChiTietItem = (index) => {
        const updatedItems = chiTietItems.filter((_, i) => i !== index);
        setChiTietItems(updatedItems);
        const tongKL = updatedItems.reduce((sum, item) => sum + ((parseFloat(item.soLuong) || 0) * (parseFloat(item.khoiLuongDonVi) || 0)), 0);
        const chiTiet = tinhPhiVanChuyen(tongKL);
        setNewDonHang(prev => ({
            ...prev,
            tongKhoiLuong: tongKL,
            phiVanChuyen: chiTiet.tongPhi
        }));
    };

    // Cập nhật thông tin từng món hàng trong chi tiết đơn hàng
    const handleChiTietItemChange = (index, field, value) => {
        const updatedItems = chiTietItems.map((item, i) => i === index ? { ...item, [field]: value } : item);
        setChiTietItems(updatedItems);
        const tongKL = updatedItems.reduce((sum, item) => sum + ((parseFloat(item.soLuong) || 0) * (parseFloat(item.khoiLuongDonVi) || 0)), 0);
        const chiTiet = tinhPhiVanChuyen(tongKL);
        setNewDonHang(prev => ({
            ...prev,
            tongKhoiLuong: tongKL,
            phiVanChuyen: chiTiet.tongPhi
        }));
    };

    // ham tao don hang moi
    const createDonHang = async (e) =>{
        e.preventDefault();
        try {
            const token = localStorage.getItem("token");
            const response = await fetch("http://localhost:8080/api/order/create", {
                method : "POST",
                headers: {
                    'Content-Type' : 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(newDonHang)
            });

            if(!response.ok){
                console.log("Lỗi server");
                return;
            }

            const createdOrder = await response.json();

            if (chiTietItems.length > 0) {
                for (const item of chiTietItems) {
                    if (item.tenHangHoa && item.tenHangHoa.trim() !== '') {
                        await fetch("http://localhost:8080/api/order-detail/create", {
                            method: "POST",
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${token}`
                            },
                            body: JSON.stringify({
                                donHang: { maDonHang: createdOrder.maDonHang },
                                tenHangHoa: item.tenHangHoa,
                                soLuong: parseInt(item.soLuong) || 1,
                                khoiLuongDonVi: parseFloat(item.khoiLuongDonVi) || 0
                            })
                        });
                    }
                }
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
            });
            setChiTietItems([]);
            setQrOrder(createdOrder);
            setIsOpenQR(true);
            console.log("Tạo đơn hàng thành công!");
        } catch (error) {
            console.error("Không thể tạo đơn hàng!");
        }
    }

    const [isOpenEdit, setIsOpenEdit] = useState(false);
    const [editDonHang, setEditDonHang] = useState(null);
    const chiTietPhiEdit = tinhPhiVanChuyen(editDonHang ? editDonHang.tongKhoiLuong : 0);


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
            const token = localStorage.getItem("token");
            const response = await fetch(`http://localhost:8080/api/order/update/${editDonHang.maDonHang}`, {
                method : "PUT",
                headers: {
                    'Content-Type' : 'application/json',
                    'Authorization': `Bearer ${token}`
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
        const xacNhan = window.confirm(`Bạn có chắc chắn muốn HỦY đơn hàng ${maDonHang} không?`);
        
        if (!xacNhan) return; 

        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`http://localhost:8080/api/order/cancel/${maDonHang}`, {
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` 
                }
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

    // Điều phối shipper giao hàng
    const [shipperList, setShipperList] = useState([]);
    const [isOpenAssign, setIsOpenAssign] = useState(false);
    const [assignOrder, setAssignOrder] = useState(null);
    const [selectedShipper, setSelectedShipper] = useState("");

    const getAllShippers = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch("http://localhost:8080/api/shipper", {
                headers: {
                    'Authorization': `Bearer ${token}`
                }                 
            });
            if(!response) {
                console.log("Lỗi server!");
            }
            const data = await response.json();
            setShipperList(data);
            console.log("Lấy danh sách thành công");
        } catch (error) {
            console.error("Lỗi lấy danh sách shipper: ", error);
        }
    }

    useEffect(() =>{
        getAllDonHang();
        getAllShippers(); 
        const interval = setInterval(() => {
            getAllDonHang();
            getAllShippers();
        }, 5000);
        return () => clearInterval(interval);
    }, []);


    const handleOpenAssign = (donHang) => {
        setAssignOrder(donHang);
        setSelectedShipper("");
        setIsOpenAssign(true);
    };

    const assignDonHang = async (e) => {
        e.preventDefault();
        if (!selectedShipper) return;

        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`http://localhost:8080/api/order/assign/${assignOrder.maDonHang}`, {
                method: "PUT",
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                 },
                body: JSON.stringify({ maShipper: parseInt(selectedShipper) })
            });

            if (!response.ok) {
                alert("Lỗi khi phân công!");
                return;
            }

            alert("Phân công thành công!");
            setIsOpenAssign(false);
            getAllDonHang();  
            getAllShippers(); 
        } catch (error) {
            console.error("Lỗi phân công: ", error);
        }
    };

    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState("all");

    return(
        <div className="p-5">
            {/* Title */}
            {/* Searchbar */}
            <div className="bg-white p-5 mt-5 rounded-xl">
                <form className=" pr-2 pl-2 flex gap-3 items-center" action="">
                    <div className=" w-4/6">
                        <input onChange={(e)=> setSearchTerm(e.target.value)} className="border border-gray-300 rounded-xl p-3 w-full rounded-xl" type="text" placeholder="Tìm mã vận đơn..."/>
                    </div>

                    <div className="w-1/6">
                        <select defaultValue="all" onChange={(e)=>setFilterStatus(e.target.value)} className="border border-gray-300 rounded-xl p-3 rounded-xl w-full">
                            <option value="all">Tất cả trạng thái</option>
                            <option value="Chờ lấy hàng">Chờ xử lí</option>
                            <option value="Đang giao">Đang giao</option>
                            <option value="Giao thành công">Giao thành công</option>
                            <option value="Giao thất bại">Giao thất bại</option>
                            <option value="Đã hủy">Đã hủy</option>
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
                        {donHanglst.filter(dh => filterStatus === "all" || dh.trangThaiHienTai === filterStatus).filter(dh => dh.maDonHang.toLowerCase().includes(searchTerm.toLowerCase())).map((donhang) => (
                            <tr key={donhang.maDonHang} class="border-b border-gray-200 bg-white hover:bg-gray-50 transition-colors">
                                <td class="px-6 py-4 font-bold text-blue-600">{donhang.maDonHang}</td>
                                <td class="px-6 py-4">
                                    <p class="font-bold text-gray-900">{donhang.tenNguoiGui}</p>
                                    <p class="text-gray-400 text-xs mt-1">{donhang.tenNguoiNhan}</p>
                                </td>
                                <td class="px-6 py-4 text-gray-500">{donhang.diaChiGiao}</td>
                                <td class="px-6 py-4">{donhang.tongKhoiLuong}kg</td>
                                <td class="px-6 py-4">{donhang.phiVanChuyen.toLocaleString('vi-VN')}đ</td>
                                <td class="px-6 py-4 font-bold text-gray-900">{donhang.tongThuHo_COD.toLocaleString('vi-VN')}đ</td>
                                <td class="px-6 py-4 text-gray-500">{donhang.shipper?.hoTen || <span className="text-gray-400 italic">Chưa có shipper nào nhận đơn</span>}</td>
                                <td class="px-6 py-4">
                                    {(() => {
                                        const style = getStatusStyle(donhang.trangThaiHienTai);
                                        return (
                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-full w-fit ${style.text} ${style.bg}`}>
                                                <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`}></span>
                                                {donhang.trangThaiHienTai}
                                            </span>
                                        );
                                    })()}
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex flex-col gap-2">
                                        {(donhang.trangThaiHienTai === "Giao thành công" || donhang.trangThaiHienTai === "Giao thất bại" || donhang.trangThaiHienTai === "Đã hủy"  || donhang.trangThaiHienTai === "Đang giao") ? (
                                            <div></div>
                                        ):(
                                            <button onClick={() => handleOpenQR(donhang)} className="px-3 py-1 text-xs font-bold text-gray-700 bg-gray-100 border border-gray-300 rounded hover:bg-gray-200 cursor-pointer">
                                                Mã QR
                                            </button>
                                        )}
                                        {/* Nút Xem QR cho mọi đơn hàng */}

                                    
                                        {(!donhang.shipper || donhang.trangThaiHienTai.includes('Chờ xử lý')) && (
                                            <button onClick={() => handleOpenAssign(donhang)} className="px-3 py-1 text-xs font-medium text-green-600 border border-green-200 rounded hover:bg-green-50">
                                                Phân công
                                            </button>
                                        )}

                                        {(donhang.trangThaiHienTai === "Đã hủy" || donhang.trangThaiHienTai === "Giao thành công" || donhang.trangThaiHienTai === "Giao thất bại" ||donhang.trangThaiHienTai === "Đang giao")? (
                                            <div></div>
                                        ): (
                                            <div className="flex flex-col gap-3">
                                                <button onClick={() => handleOpenEdit(donhang)} className="px-3 py-1 text-xs font-medium text-blue-600 border border-blue-200 rounded hover:bg-blue-50 w-full">Sửa</button>
                                                <button onClick={() => cancelDonHang(donhang.maDonHang)} className="px-3 py-1 text-xs font-medium text-red-600 border border-red-200 rounded hover:bg-red-50 w-full">Hủy đơn</button>
                                            </div>
                                        )}

                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            
            {/* Model Tạo đơn hàng */}
            <Modal isOpen={isOpenCreate} onClose={() => setIsOpenCreate(false)}>
                <div className="pb-2 border-b border-gray-300 flex items-center justify-between bg-white">
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


                        <p className="mt-4 text-blue-500">Thông tin người nhận</p>
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

                        <div className="mt-4 flex items-center justify-between">
                            <p className="text-blue-500">Thông tin kiện hàng</p>
                            <button
                                type="button"
                                onClick={handleAddChiTietItem}
                                className="text-xs font-semibold text-blue-600 bg-blue-50 border border-blue-200 px-3 py-1.5 rounded-xl hover:bg-blue-100 cursor-pointer"
                            >
                                + Thêm chi tiết món hàng
                            </button>
                        </div>

                        {chiTietItems.length > 0 && (
                            <div className="mt-3 p-3 bg-gray-50 border border-gray-200 rounded-xl flex flex-col gap-3">
                                <p className="text-xs font-semibold text-gray-600">Danh sách chi tiết món hàng</p>
                                {chiTietItems.map((item, idx) => (
                                    <div key={idx} className="flex items-end gap-2">
                                        <div className="w-5/12">
                                            <label className="text-[11px] text-gray-500">Tên hàng hóa</label>
                                            <input
                                                type="text"
                                                placeholder="Tên món hàng"
                                                value={item.tenHangHoa}
                                                onChange={(e) => handleChiTietItemChange(idx, 'tenHangHoa', e.target.value)}
                                                className="w-full border border-gray-300 p-2 rounded-xl text-sm bg-white"
                                                required
                                            />
                                        </div>
                                        <div className="w-3/12">
                                            <label className="text-[11px] text-gray-500">Số lượng</label>
                                            <input
                                                type="number"
                                                min="1"
                                                value={item.soLuong}
                                                onChange={(e) => handleChiTietItemChange(idx, 'soLuong', e.target.value)}
                                                className="w-full border border-gray-300 p-2 rounded-xl text-sm bg-white"
                                                required
                                            />
                                        </div>
                                        <div className="w-3/12">
                                            <label className="text-[11px] text-gray-500">KL/món (kg)</label>
                                            <input
                                                type="number"
                                                step="0.1"
                                                min="0"
                                                value={item.khoiLuongDonVi}
                                                onChange={(e) => handleChiTietItemChange(idx, 'khoiLuongDonVi', e.target.value)}
                                                className="w-full border border-gray-300 p-2 rounded-xl text-sm bg-white"
                                                required
                                            />
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveChiTietItem(idx)}
                                            className="w-1/12 p-2 text-red-500 hover:text-red-700 font-bold text-sm cursor-pointer"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="mt-4">
                            <div>
                                <label className="text-xs font-semibold" htmlFor="">Tổng khối lượng (kg)</label>
                                <input value={newDonHang.tongKhoiLuong} onChange={handleInputChange} disabled={chiTietItems.length > 0} className="w-full border border-gray-300 p-2 rounded-xl disabled:bg-gray-100" type="text" name="tongKhoiLuong" id="" />
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
                <div className="pb-2 border-b border-gray-300 flex items-center justify-between bg-white">
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


                            <p className="mt-4 text-blue-500">Thông tin người nhận</p>
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

                            <p className="mt-4 text-blue-500">Thông tin kiện hàng</p>
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
                                    <p className="text-gray-500 font-semibold">{chiTietPhiEdit.phiCoBan.toLocaleString('vi-VN')}đ</p>
                                </div>

                                <div className="mt-3 flex items-center justify-between">
                                    <p className="text-gray-500">Phí vượt cân</p>
                                    <p className="text-gray-500 font-semibold">{chiTietPhiEdit.phiVuotCan.toLocaleString('vi-VN')}đ</p>
                                </div>

                                <div className="mt-3 flex items-center justify-between border-t border-blue-200 pt-2">
                                    <p className="text-gray-700 font-bold">Tổng phí vận chuyển</p>
                                    <p className="text-blue-600 font-bold text-xl">{chiTietPhiEdit.tongPhi.toLocaleString('vi-VN')}đ</p>
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
            
            {/* Model Phân công đơn hàng cho shipper */}
            <Modal isOpen={isOpenAssign} onClose={() => setIsOpenAssign(false)}>
                <div className="pb-2 border-b border-gray-300 flex items-center justify-between bg-white">
                    <div>
                        <p className="font-bold">Phân công người vận chuyển</p>
                        <p className="text-xs text-gray-500">Đơn hàng: {assignOrder?.maDonHang}</p>
                    </div>
                </div>

                <form className="mt-4 w-80 sm:w-96" onSubmit={assignDonHang}>
                    <label className="text-sm font-semibold text-gray-700">Chọn Shipper (Đang rảnh)</label>
                    
                    <select 
                        value={selectedShipper} 
                        onChange={(e) => setSelectedShipper(e.target.value)}
                        className="mt-2 w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:border-blue-500"
                    >
                        <option value="" disabled>-- Chọn nhân sự vận chuyển --</option>
                        {shipperList
                            .filter(shipper => shipper.trangThaiHoatDong === 'Đang rảnh')
                            .map(shipper => (
                                <option key={shipper.maShipper} value={shipper.maShipper}>
                                    {shipper.hoTen} - {shipper.bienSoXe}
                                </option>
                            ))
                        }
                    </select>

                    {/* Cảnh báo nếu không có Shipper nào rảnh */}
                    {shipperList.filter(s => s.trangThaiHoatDong === 'Đang rảnh').length === 0 && (
                        <p className="text-xs text-red-500 mt-2 italic">Hiện tại không có Shipper nào đang rảnh!</p>
                    )}

                    <div className="mt-6 flex items-center justify-end gap-3">
                        <button type="button" onClick={() => setIsOpenAssign(false)} className="px-4 py-2 border border-gray-300 rounded-xl hover:bg-gray-50">Hủy</button>
                        <button type="submit" disabled={!selectedShipper} className="px-4 py-2 bg-green-500 text-white font-bold rounded-xl hover:bg-green-600 disabled:bg-gray-400">
                            Xác nhận
                        </button>
                    </div>
                </form>
            </Modal>
            
            {/* Tạo mã QR */}
            <GenerateQR 
                isOpen={isOpenQR} 
                onClose={() => setIsOpenQR(false)} 
                qrOrder={qrOrder} 
            />
        </div>
    );
}

export default Product;