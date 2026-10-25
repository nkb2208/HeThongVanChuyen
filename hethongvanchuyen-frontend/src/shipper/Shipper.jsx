import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { createPortal } from 'react-dom';
import { Html5QrcodeScanner } from "html5-qrcode";

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
        alignItems: 'center',
        justifyContent: 'center'
    }}>
      <div className="p-3 rounded-xl bg-white">
        {children}
      </div>
    </div>,
    document.body
  );
}


function Shipper(){
    const [donHanglst, setDonHanglst] = useState([]);

    // Camera
    const [isOpenCamera, setIsOpenCamera] = useState(false);
    useEffect(() => {
        if (isOpenCamera) {
            // Khởi tạo khung quét QR
            const scanner = new Html5QrcodeScanner("qr-reader", {
                fps: 10,
                qrbox: { width: 250, height: 250 }
            });

            scanner.render(
                (decodedText) => {
                    scanner.clear(); 
                    setIsOpenCamera(false); 


                    const foundOrder = donHanglst.find(donhang => donhang.maDonHang === decodedText);
                    
                    if (foundOrder) {
                        handleGetOrder(foundOrder); 
                    } else {
                        alert(`Mã QR là ${decodedText} nhưng không tìm thấy đơn hàng này trong danh sách!`);
                    }
                },
                (errorMessage) => {
                   
                }
            );

            return () => {
                scanner.clear().catch(error => console.error("Failed to clear html5QrcodeScanner. ", error));
            };
        }
    }, [isOpenCamera, donHanglst]);
    
    // Danh sách đơn hàng


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
    };

    // Xem chi tiết đơn hàng theo mã đơn hàng
    const [getOneOrder, setGetOneOrder] = useState(null);
    const [trangThaiMoi, setTrangThaiMoi] = useState("");

    const handleGetOrder = (order) =>{
        setGetOneOrder(order);
        setTrangThaiMoi(order.trangThaiHienTai);
    }

    // Cập nhật trạng thái đơn hàng
    const handleUpdateStatus = async (e) => {
        e.preventDefault();

        if(!getOneOrder || !trangThaiMoi) return;

        try {
            const response = await fetch(`http://localhost:8080/api/order/update-status/${getOneOrder.maDonHang}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ trangThaiHienTai: trangThaiMoi })
            });

            if (!response.ok) {
                alert("Lỗi khi cập nhật trạng thái!");
                return;
            }

            alert("Cập nhật trạng thái thành công!");
            getAllDonHang(); 
            
            setGetOneOrder(prev => ({ ...prev, trangThaiHienTai: trangThaiMoi }));

        } catch (error) {
            console.error("Lỗi cập nhật: ", error);
        }
    };


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

    const totalPendingOrder = () => {
        return donHanglst.filter(donHang => donHang.trangThaiHienTai === 'Chờ lấy hàng').length;
    }

    const totalCompleteOrder = () => {
        return donHanglst.filter(donHang => donHang.trangThaiHienTai === 'Giao thành công').length;
    }

    const totalCancelOrder = () => {
        return donHanglst.filter(donHang => donHang.trangThaiHienTai === 'Giao thất bại').length;
    }

    return(
        <div className="w-full bg-slate-100 min-h-screen">
            {/* Nav Bar */}
            <div className="p-5 bg-white flex items-center justify-between">
                {/* Logo */}
                <div className="flex items-center gap-3">
                    <div className="bg-blue-500 w-12 h-12 flex items-center justify-center rounded-xl text-white shadow-md">
                        <svg xmlns="http://w3.org" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/>
                            <path d="m3.3 7 8.7 5 8.7-5"/>
                            <path d="M12 22V12"/>
                        </svg>
                    </div>


                    <div className="">
                        <p className="font-bold">Giao nhanh</p>
                        <p className="text-xs text-gray-400">Hệ thống quản lý vận chuyển</p>    
                    </div>    
                </div>

                {/* Profile and Logout */}
                <div className="flex items-center gap-3">
                    <div>
                        <p className="font-semibold">Nguyễn Văn A</p>
                        <p className="text-xs text-gray-500">Xe máy • 59X1-123.45</p>
                    </div>

                    <div>
                        <span class="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium text-green-700 bg-green-50 rounded-full">
                            <span class="w-1 h-1 bg-green-500 rounded-full"></span>
                            Đang rảnh
                        </span>
                    </div>

                    <Link to='/login' className="flex items-center text-red-500 gap-3 font-bold rounded-xl p-1 pr-2 pl-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                            <polyline points="16 17 21 12 16 7"></polyline>
                            <line x1="21" y1="12" x2="9" y2="12"></line>
                        </svg>
                    </Link>
                </div>
            </div>

            {/* Body Content */}
            {/* Camera Scan QR */}
            <div className="md:hidden mt-10 flex items-center justify-center w-full">
                <button onClick={()=> setIsOpenCamera(true)} className="bg-blue-500 p-3 rounded-xl text-white font-semibold cursor-pointer">Quét QR để nhận đơn</button>
            </div>

            {/* List of Order and Order detail */}
            <div className="flex flex-col lg:flex-row pt-5 lg:pt-10 px-4 md:px-10 lg:px-20 xl:px-50 gap-5">
                <div className="p-5 h-fit bg-white rounded-xl w-full lg:w-1/3">
                    <div className="mt-4 border-b border-gray-300 pb-3">
                        {/* Title */}
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="">Đơn hàng khả dụng</p>
                                <p className="text-xs text-gray-500">Chọn đơn “Chờ xử lý” để chủ động nhận</p>
                            </div>

                            <span class="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium text-orange-700 bg-orange-50 rounded-full">
                                <span class="w-1.5 h-1.5 bg-orange-500 rounded-full"></span>
                                {totalPendingOrder()} đơn chờ lấy hàng
                            </span>
                        </div>

                        {/* List of Order */}
                        <div className="mt-4 flex flex-col gap-4">
                            {donHanglst.filter(donhang => donhang.trangThaiHienTai === "Chờ lấy hàng").map((donhang) => (
                                <button onClick={()=> handleGetOrder(donhang)} className="cursor-pointer border border-gray-100 p-3 rounded-xl w-full">
                                    <div className="flex items-center justify-between">
                                        <p className="font-semibold text-xl">{donhang.maDonHang}</p>
                                        {(() => {
                                            const style = getStatusStyle(donhang.trangThaiHienTai);
                                            return (
                                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-full ${style.text} ${style.bg}`}>
                                                    <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`}></span>
                                                    {donhang.trangThaiHienTai}
                                                </span>
                                            );
                                        })()}
                                    </div>

                                    <div className="mt-4 w-fit">
                                        <p className="flex items-center justify-start font-semibold">{donhang.tenNguoiNhan}</p>
                                        <p className="flex items-center justify-start text-xs text-gray-500">{donhang.diaChiGiao}</p>
                                        <p className="flex items-center justify-start mt-2 text-xs text-gray-500">COD: {donhang.tongThuHo_COD.toLocaleString('vi-VN')}đ - {donhang.tongKhoiLuong} kg</p>
                                    </div>
                                </button>
                            ))}

                        </div>
                    </div>

                    <div className="mt-4 border-b border-gray-300 pb-3">
                        {/* Title */}
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="">Đơn hàng giao thành công</p>
                            </div>

                            <span class="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium text-green-700 bg-green-50 rounded-full">
                                <span class="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                                {totalCompleteOrder()} đơn thành công
                            </span>
                        </div>

                        {/* List of Order */}
                        <div className="mt-4 flex flex-col gap-4">
                            {donHanglst.filter(donhang => donhang.trangThaiHienTai === "Giao thành công").map((donhang) => (
                                <button onClick={()=> handleGetOrder(donhang)} className="cursor-pointer border border-gray-100 p-3 rounded-xl w-full">
                                    <div className="flex items-center justify-between">
                                        <p className="font-semibold text-xl">{donhang.maDonHang}</p>
                                        {(() => {
                                            const style = getStatusStyle(donhang.trangThaiHienTai);
                                            return (
                                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-full ${style.text} ${style.bg}`}>
                                                    <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`}></span>
                                                    {donhang.trangThaiHienTai}
                                                </span>
                                            );
                                        })()}
                                    </div>

                                    <div className="mt-4 w-fit">
                                        <p className="flex items-center justify-start font-semibold">{donhang.tenNguoiNhan}</p>
                                        <p className="flex items-center justify-start text-xs text-gray-500">{donhang.diaChiGiao}</p>
                                        <p className="flex items-center justify-start mt-2 text-xs text-gray-500">COD: {donhang.tongThuHo_COD.toLocaleString('vi-VN')}đ - {donhang.tongKhoiLuong} kg</p>
                                    </div>
                                </button>
                            ))}

                        </div>
                    </div>

                    <div className="mt-4 ">
                        {/* Title */}
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="">Đơn hàng đã hủy hoặc giao thất bại</p>
                            </div>

                            <span class="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium text-red-700 bg-red-50 rounded-full">
                                <span class="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                                {totalCancelOrder()} đơn thất bại
                            </span>
                        </div>

                        {/* List of Order */}
                        <div className="mt-4 flex flex-col gap-4">
                            {donHanglst.filter(donhang =>donhang.trangThaiHienTai === "Giao thất bại").map((donhang) => (
                                <button onClick={()=> handleGetOrder(donhang)} className="cursor-pointer border border-gray-100 p-3 rounded-xl w-full">
                                    <div className="flex items-center justify-between">
                                        <p className="font-semibold text-xl">{donhang.maDonHang}</p>
                                        {(() => {
                                            const style = getStatusStyle(donhang.trangThaiHienTai);
                                            return (
                                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-full ${style.text} ${style.bg}`}>
                                                    <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`}></span>
                                                    {donhang.trangThaiHienTai}
                                                </span>
                                            );
                                        })()}
                                    </div>

                                    <div className="mt-4 w-fit">
                                        <p className="flex items-center justify-start font-semibold">{donhang.tenNguoiNhan}</p>
                                        <p className="flex items-center justify-start text-xs text-gray-500">{donhang.diaChiGiao}</p>
                                        <p className="flex items-center justify-start mt-2 text-xs text-gray-500">COD: {donhang.tongThuHo_COD.toLocaleString('vi-VN')}đ - {donhang.tongKhoiLuong} kg</p>
                                    </div>
                                </button>
                            ))}

                        </div>
                    </div>
                </div>
                {/* Order-Detail */}
                <div className="bg-white p-5 rounded-xl w-full h-fit lg:w-2/3">
                    {getOneOrder ? (
                        <div>
                            <div className="flex items-center justify-between">
                                <div>
                                    {(() => {
                                        const style = getStatusStyle(getOneOrder.trangThaiHienTai);
                                        return (
                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-full ${style.text} ${style.bg}`}>
                                                <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`}></span>
                                                {getOneOrder.trangThaiHienTai}
                                            </span>
                                        );
                                    })()}
                                    <p className="mt-4 text-xl">Chi tiết đơn hàng</p>
                                </div>

                                <div className="bg-blue-500 w-12 h-12 flex items-center justify-center rounded-xl text-white shadow-md">
                                    <svg xmlns="http://w3.org" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                        <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/>
                                        <path d="m3.3 7 8.7 5 8.7-5"/>
                                        <path d="M12 22V12"/>
                                    </svg>
                                </div>
                            </div>


                            <p className="mt-2 text-xs text-gray-500">Mã vận đơn: <span className="text-black font-semibold">{getOneOrder.maDonHang}</span></p>

                            <div className="mt-4 border-t border-b border-gray-300">
                                <div className="mt-4 flex gap-3">
                                    <div className="w-1/2 p-3 border border-gray-300 rounded-xl">
                                        <p className="text-gray-500">Người gửi</p>
                                        <p className="mt-2 font-semibold">{getOneOrder.tenNguoiGui}</p>
                                        <p className="text-gray-500">{getOneOrder.sdtNguoiGui}</p> 
                                    </div>

                                    <div className="w-1/2 p-3 border border-gray-300 rounded-xl">
                                        <p className="text-gray-500">Người nhận</p>
                                        <p className="mt-2 font-semibold">{getOneOrder.tenNguoiNhan}</p>
                                        <p className="text-gray-500">{getOneOrder.sdtNguoiNhan}</p> 
                                    </div>
                                </div>

                                <div className="mt-4 mb-4 flex gap-3">
                                    <div className="w-2/3 p-3 bg-slate-100 border border-gray-300 rounded-xl">
                                        <p className="text-gray-500">Địa chỉ giao hàng</p>
                                        <p className="mt-2 font-semibold">{getOneOrder.diaChiGiao}</p>
                                    </div>

                                    <div className="w-1/3 p-3 bg-slate-100 border border-gray-300 rounded-xl">
                                        <p className="text-gray-500">Tiền cần thu (COD + Ship)</p>
                                        <p className="text-xl mt-2 font-bold text-blue-500">{(getOneOrder.tongThuHo_COD+ getOneOrder.phiVanChuyen).toLocaleString('vi-VN')}đ</p>
                                        <p className="text-gray-500">Đã bao gồm phí vận chuyển</p> 
                                    </div>
                                </div>
                            </div>
                            
                            <div className="mt-4 border-t border-gray-200 pt-4">
                                <p className="font-semibold mb-3">Cập nhật trạng thái đơn hàng</p>

                                {['Đã hủy', 'Giao thất bại', 'Giao thành công'].includes(getOneOrder.trangThaiHienTai) ? (
                                    <div className="bg-gray-100 p-4 rounded-xl border border-gray-200 text-center">
                                        <p className="text-gray-500 font-medium">Đơn hàng này đã kết thúc quá trình giao nhận.</p>
                                        <p className="text-sm text-gray-400 mt-1">Không thể thay đổi trạng thái nữa.</p>
                                    </div>
                                ) : (
                                    <form className="w-full" onSubmit={handleUpdateStatus}>
                                        <label className="text-xs font-semibold text-gray-600">Trạng thái mới</label>
                                        <select 
                                            value={trangThaiMoi} 
                                            onChange={(e) => setTrangThaiMoi(e.target.value)} 
                                            className="mt-2 w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:border-blue-500"
                                        >
                                            <option value="Nhận đơn hàng">Nhận đơn hàng</option>
                                            <option value="Đang giao">Đang giao hàng</option>
                                            <option value="Giao thành công">Giao thành công</option>
                                            <option value="Giao thất bại">Giao thất bại</option>
                                        </select>

                                        <button type="submit" className="cursor-pointer w-full bg-blue-600 p-3 rounded-xl mt-4 text-white font-bold hover:bg-blue-700 transition-colors">
                                            Lưu trạng thái
                                        </button>
                                    </form>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center justify-center h-full w-full">
                            <p className="text-blue-500 text-xl italic">Chọn một đơn hàng</p>
                        </div>
                    )}
                </div>
            </div>

            <Modal isOpen={isOpenCamera} onClose={() => setIsOpenCamera(false)}>
                <div className="w-80 sm:w-[400px]">
                    <div className="flex items-center justify-between mb-4 border-b pb-2">
                        <p className="font-bold text-lg">Đưa mã QR vào khung</p>
                        <button onClick={() => setIsOpenCamera(false)} className="text-red-500 font-bold">Đóng</button>
                    </div>
                    
                    <div id="qr-reader" className="w-full"></div>
                </div>
            </Modal>
        </div>
    );
}

export default Shipper;