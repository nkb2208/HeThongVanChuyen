import { createPortal } from 'react-dom';
import { useEffect, useState } from 'react';

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

function Shipper(){
    const [isOpenCreate, setIsOpenCreate] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    const [shipperLst, setShipperLst] = useState([]);

    useEffect(()=>{
        getAllShippers();
    }, []);

    const getAllShippers = async () =>{
        try {
            const response = await fetch("http://localhost:8080/api/shipper");

            if(!response){
                console.log("Lỗi server");
                return;
            }

            const data = await response.json();

            setShipperLst(data);
        } catch (error) {
            console.error('Lấy danh sách shipper thất bại!');
        }
    }

    const [newShipper, setNewShipper] = useState({
        tenDangNhap : '',
        matKhau: '',
        maChiNhanh: 999,

        hoTen: '',
        soDienThoai: '',
        bienSoXe: '',
        loaiXe: 'Xe máy',
        trangThaiHoatDong: 'Đang rảnh'
    });

    const handleInputChange = (e) =>{
        const {name, value}  = e.target;
        setNewShipper(prev => ({...prev, [name]: value}));
    };


    const createShipper = async(e)=>{
        e.preventDefault();
        try {
            const response = await fetch("http://localhost:8080/api/shipper/create", {
                method: 'POST',
                headers: {
                    'Content-Type' : 'application/json',
                },
                body: JSON.stringify(newShipper)
            });


            if(!response){
                console.log("Lỗi server");
                return;
            }

            setNewShipper({
                tenDangNhap : '',
                matKhau: '',
                maChiNhanh: 999,

                hoTen: '',
                soDienThoai: '',
                bienSoXe: '',
                loaiXe: 'Xe máy',
                trangThaiHoatDong: 'Đang rảnh'
            });

            getAllShippers();
            setIsOpenCreate(false);
            console.log("Tạo shipper thành công");
        } catch (error) {
            console.error("Không thể tạo shipper mới: ", error);
        }
    };

    const [editShipper, setEditShipper] = useState(null);
    const handleOpenEdit = (shipper) => {
        setEditShipper(shipper);
        setIsEditing(true);
    }

    const handleEditInputChange = (e) => {
        const {name, value} = e.target;
        setEditShipper(prev => {
            const update = {...prev, [name] : value};
        
            return update;
        });

    };


    const updateShipper = async (e) =>{
        e.preventDefault();

        try {
            const response = await fetch(`http://localhost:8080/api/shipper/update/${editShipper.maShipper}`, {
                method : "PUT",
                headers: {
                    'Content-Type' : 'application/json',
                },
                body: JSON.stringify(editShipper),
            });

            if(!response.ok){
                alert("Lỗi khi cập nhật!");
                return;
            }
            setIsEditing(false); 
            getAllShippers(); 
            console.log("Cập nhật shipper thành công");
        } catch (error) {
            console.error("Không thể cập nhật shipper: ", error);
        }

    };


    const handleLockShipper = async (maShipper) => {
        const xacNhan = window.confirm(`Bạn có chắc chắn muốn khóa tài khoản của Shipper mã ${maShipper} không?`);

        if(!xacNhan) return; 

        try{
            const response = await fetch(`http://localhost:8080/api/shipper/lock/${maShipper}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' }
            });

            if (!response.ok) {
                alert("Lỗi khi khóa tài khoản!");
                return;
            }

            alert("Khóa tài khoản thành công!");
            getAllShippers();
            
        }catch (error) {
            console.error("Lỗi kết nối khi khóa tài khoản: ", error);
        }
    };

    const handleUnlockShipper = async (maShipper) => {
        const xacNhan = window.confirm(`Bạn có chắc muốn MỞ khóa tài khoản Shipper mã ${maShipper}?`);
        if(!xacNhan) return; 

        try {
            const response = await fetch(`http://localhost:8080/api/shipper/unlock/${maShipper}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' }
            });

            if (!response.ok) {
                alert("Lỗi khi mở khóa tài khoản!");
                return;
            }
            alert("Mở khóa tài khoản thành công!");
            getAllShippers();
        } catch (error) {
            console.error("Lỗi kết nối: ", error);
        }
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case 'Đang rảnh': return { text: 'text-green-700', bg: 'bg-green-50', dot: 'bg-green-500' };
            case 'Đang giao': return { text: 'text-blue-700', bg: 'bg-blue-50', dot: 'bg-blue-500' };
            case 'Nghỉ phép': return { text: 'text-amber-700', bg: 'bg-amber-50', dot: 'bg-amber-500' };
            case 'Đã khóa': return { text: 'text-red-700', bg: 'bg-red-50', dot: 'bg-red-500' };
            default: return { text: 'text-gray-700', bg: 'bg-gray-50', dot: 'bg-gray-500' };
        }
    };

    
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
                        <button type="button" onClick= {()=> setIsOpenCreate(true)} className="font-bold text-white bg-blue-500 border border-gray-300 rounded-xl w-full p-3">
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
                        {shipperLst.map((shipper) => (  
                            <tr key={shipper.maShipper} class="border-b border-gray-200 bg-white hover:bg-gray-50 transition-colors">
                                <td class="px-6 py-4 font-bold text-blue-600">{shipper.maShipper}</td>
                                <td class="px-6 py-4">
                                    <p class="font-bold text-gray-900">{shipper.hoTen}</p>
                                </td>
                                <td class="px-6 py-4 text-gray-500">{shipper.soDienThoai}</td>
                                <td class="px-6 py-4">{shipper.bienSoXe}</td>
                                <td class="px-6 py-4 text-gray-400">{shipper.loaiXe}</td>
                                <td className="px-6 py-4">
                                    {(() => {
                                        const style = getStatusStyle(shipper.trangThaiHoatDong);
                                        return (
                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-full ${style.text} ${style.bg}`}>
                                                <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`}></span>
                                                {shipper.trangThaiHoatDong}
                                            </span>
                                        );
                                    })()}
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex gap-2">
                                        <button type="button" onClick={() => handleOpenEdit(shipper)} className="w-1/3 rounded-xl px-3 py-1 text-xs font-medium text-blue-600 border border-blue-200 hover:bg-blue-50">Sửa</button>
                                        
                                        {shipper.trangThaiHoatDong === 'Đã khóa' ? (
                                            <button type="button" onClick={() => handleUnlockShipper(shipper.maShipper)} className="w-2/3 rounded-xl px-3 py-1 text-xs font-medium text-green-600 border border-green-200 hover:bg-green-50">
                                                Mở tài khoản
                                            </button>
                                        ) : (
                                            <button type="button" onClick={() => handleLockShipper(shipper.maShipper)} className="w-2/3 rounded-xl px-3 py-1 text-xs font-medium text-red-600 border border-red-200 hover:bg-red-50">
                                                Khóa tài khoản
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Model Tạo shipper mới */}
            <Modal isOpen={isOpenCreate} onClose={() => setIsOpenCreate(false)}>
                <div className="sticky top-3 pb-3 border-b border-gray-300 flex items-center justify-between">
                    <div className="">
                        <p>Thêm người vận chuyển</p>
                        <p className="text-xs text-gray-500">Tạo tài khoản mới cho đội ngũ giao nhận</p>
                    </div>
                </div>

                <div className="mt-4">
                    <form className="mt-4 w-full" action="" onSubmit={createShipper}>
                        <p className="text-blue-500">Thông tin tài khoản</p>
                        <div className="mt-4 flex items-center gap-3">
                            <div>
                                <label className="text-xs font-semibold" htmlFor="">Tên tài khoản</label>
                                <input value={newShipper.tenDangNhap} onChange={handleInputChange} className="w-full border border-gray-300 p-2 rounded-xl" type="text" name="tenDangNhap" id="" />
                            </div>

                            <div>
                                <label className="text-xs font-semibold" htmlFor="">Mật khẩu</label>
                                <input value={newShipper.matKhau} onChange={handleInputChange} className="w-full border border-gray-300 p-2 rounded-xl" type="password" name="matKhau" id="" />
                            </div>
                        </div>
                        <div className="mt-4">
                            <label className="text-xs font-semibold" htmlFor="">Họ và tên</label>
                            <input value={newShipper.hoTen} onChange={handleInputChange} className="w-full border border-gray-300 p-2 rounded-xl" type="text" name="hoTen" id="" />
                        </div>
                        <div className="mt-4 flex items-center gap-3">
                            <div>
                                <label className="text-xs font-semibold" htmlFor="">Số điện thoại</label>
                                <input value={newShipper.soDienThoai} onChange={handleInputChange} className="w-full border border-gray-300 p-2 rounded-xl" type="text" name="soDienThoai" id="" />
                            </div>

                            <div>
                                <label className="text-xs font-semibold" htmlFor="">Biển số xe</label>
                                <input value={newShipper.bienSoXe} onChange={handleInputChange} className="w-full border border-gray-300 p-2 rounded-xl" type="text" name="bienSoXe" id="" />
                            </div>
                        </div>


                        <p className="mt-4 text-blue-500">Phương tiện</p>
                        <div className="mt-4">
                            <label className="text-xs font-semibold" htmlFor=""></label>
                            <select key={"xemay"} value={newShipper.loaiXe} onChange={handleInputChange} className='w-full border border-gray-300 p-2 rounded-xl' name="loaiXe" id="">
                                <option value="Xe máy">Xe máy</option>
                                <option value="Xe Tải">Xe tải</option>
                                <option value="Xe Van">Xe van</option>
                            </select>
                        </div>

                        <div className="mt-4 flex items-center justify-end gap-3">
                            <button type='button' className="cursor-pointer border border-slate-100 rounded-xl p-3 mt-auto cursor-pointer" onClick={() => setIsOpenCreate(false)}>Hủy</button>
                            <button type='submit' className="text-white cursor-pointer bg-blue-500 rounded-xl p-3 cursor-pointer" >Tạo shipper</button>
                        </div>
                    </form>
                </div>
            </Modal>

            {/* Model Sửa Shipepr */}
            <Modal isOpen={isEditing} onClose={() => setIsEditing(false)}>
                <div className="sticky top-3 pb-3 border-b border-gray-300 flex items-center justify-between">
                    <div className="">
                        <p>Sửa thông tin người vận chuyển</p>
                        <p className="text-xs text-gray-500">Sửa thông tin cho đội ngũ giao nhận</p>
                    </div>
                </div>

                <div className="mt-4">
                    {editShipper &&(
                        <form className="mt-4 w-full" action="" onSubmit={updateShipper}>
                            <p className="text-blue-500">Thông tin tài khoản</p>
                            <div className="mt-4 flex items-center gap-3">
                                <div>
                                    <label className="text-xs font-semibold" htmlFor="">Tên tài khoản</label>
                                    <input value={editShipper.tenDangNhap} onChange={handleEditInputChange} className="w-full border border-gray-300 p-2 rounded-xl" type="text" name="tenDangNhap" id="" />
                                </div>

                                <div>
                                    <label className="text-xs font-semibold" htmlFor="">Mật khẩu</label>
                                    <input value={editShipper.matKhau} onChange={handleEditInputChange} className="w-full border border-gray-300 p-2 rounded-xl" type="password" name="matKhau" id="" />
                                </div>
                            </div>
                            <div className="mt-4">
                                <label className="text-xs font-semibold" htmlFor="">Họ và tên</label>
                                <input value={editShipper.hoTen} onChange={handleEditInputChange} className="w-full border border-gray-300 p-2 rounded-xl" type="text" name="hoTen" id="" />
                            </div>
                            <div className="mt-4 flex items-center gap-3">
                                <div>
                                    <label className="text-xs font-semibold" htmlFor="">Số điện thoại</label>
                                    <input value={editShipper.soDienThoai} onChange={handleEditInputChange} className="w-full border border-gray-300 p-2 rounded-xl" type="text" name="soDienThoai" id="" />
                                </div>

                                <div>
                                    <label className="text-xs font-semibold" htmlFor="">Biển số xe</label>
                                    <input value={editShipper.bienSoXe} onChange={handleEditInputChange} className="w-full border border-gray-300 p-2 rounded-xl" type="text" name="bienSoXe" id="" />
                                </div>
                            </div>


                            <p className="mt-4 text-blue-500">Phương tiện</p>
                            <div className="mt-4">
                                <label className="text-xs font-semibold" htmlFor=""></label>
                                <select key={"xemay"} value={editShipper.loaiXe} onChange={handleEditInputChange} className='w-full border border-gray-300 p-2 rounded-xl' name="loaiXe" id="">
                                    <option value="Xe máy">Xe máy</option>
                                    <option value="Xe Tải">Xe tải</option>
                                    <option value="Xe Van">Xe van</option>
                                </select>
                            </div>

                            <div className="mt-4 flex items-center justify-end gap-3">
                                <button type='button' className="cursor-pointer border border-slate-100 rounded-xl p-3 mt-auto cursor-pointer" onClick={() => setIsEditing(false)}>Hủy</button>
                                <button type='submit' className="text-white cursor-pointer bg-blue-500 rounded-xl p-3 cursor-pointer" >Lưu</button>
                            </div>
                        </form>
                    )}

                </div>
            </Modal>
        </div>
    );
}

export default Shipper;