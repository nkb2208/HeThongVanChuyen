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
    const [isOpenCamera, setIsOpenCamera] = useState(false);
    const [getOneOrder, setGetOneOrder] = useState(null);
    const [trangThaiMoi, setTrangThaiMoi] = useState("");
    const [isOpenOrderDetail, setIsOpenOrderDetail] = useState(false);

    // Quét mã QR tại cửa hàng để chuyển đơn hàng từ Đã nhận sang Đang giao
    useEffect(() => {
        if (isOpenCamera) {
            const scanner = new Html5QrcodeScanner("qr-reader", {
                fps: 10,
                qrbox: { width: 250, height: 250 }
            });

            scanner.render(
                async (decodedText) => {
                    scanner.clear(); 
                    setIsOpenCamera(false); 

                    try {
                        const token = localStorage.getItem("token");
                        const response = await fetch("http://localhost:8080/api/order/scan-qr", {
                            method: "POST",
                            headers: { 
                                "Content-Type": "application/json",
                                'Authorization': `Bearer ${token}`
                            
                            },
                            body: JSON.stringify({
                                maDonHang: decodedText,
                                maShipper: shipper.maShipper,
                                maTaiKhoan: shipper.maTaiKhoan
                            })
                        });

                        const responseText = await response.text();

                        if (!response.ok) {
                            alert("Không thể nhận hàng: " + responseText);
                            return;
                        }

                        alert("Quét mã QR thành công! Đơn hàng đã chuyển sang trạng thái Đang giao.");
                        
                        getAllDonHang(); 
                        if (getOneOrder && getOneOrder.maDonHang === decodedText) {
                            setGetOneOrder(prev => ({ ...prev, trangThaiHienTai: "Đang giao" }));
                            setTrangThaiMoi("Giao thành công");
                        }

                    } catch (error) {
                        console.error("Lỗi khi gọi API quét QR: ", error);
                        alert("Lỗi kết nối đến máy chủ!");
                    }
                },
            );

            return () => {
                scanner.clear().catch(error => console.error("Failed to clear scanner. ", error));
            };
        }
    }, [isOpenCamera]);

    useEffect(()=> {
        getAllDonHang();
        const interval = setInterval(() => {
            getAllDonHang();
        }, 1000);
    },[]);

    // Lấy danh sách đơn hàng từ hệ thống
    const getAllDonHang = async() => {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch("http://localhost:8080/api/order", {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })

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

    // Chọn xem chi tiết một đơn hàng
    const handleGetOrder =async (order) =>{
        try {
            const token = localStorage.getItem("token");
            
            const response = await fetch(`http://localhost:8080/api/order/${order.maDonHang}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                console.error("Lỗi khi lấy chi tiết đơn hàng");
                return;
            }

            const data = await response.json(); 
            
            setGetOneOrder(data);   
            setIsOpenOrderDetail(true);
        } catch (error) {
            console.error("Lỗi gọi API chi tiết đơn hàng: ", error);
        }
    }


    const [isOpenReason, setIsOpenReason] = useState(false);

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

    // Lấy thông tin shipper
    const [shipper, setShipper] = useState({
        maTaiKhoan: "",
        tenDangNhap: "",
        maShipper: "", 
        hoTen: "",
        soDienThoai: "",
        trangThaiHoatDong: "Đang rảnh",
        bienSoXe: "",
        loaiXe: "Xe máy"
    });

    useEffect(() => {
        getShipperInfo();
        const interval = setInterval(() => {
            getShipperInfo();
        }, 1000);
    }, []);

    const getShipperInfo = async () => {
        try {
            const token = localStorage.getItem("token");
            if(!token){
                return
            };

            const response = await fetch(`http://localhost:8080/api/shipper/profile`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!response.ok) {
                console.log("Lỗi server hoặc không tìm thấy Shipper");
                return;
            }
            const data = await response.json();

            setShipper(data);
        } catch (error) {
            console.error("Lỗi kết nối: ", error);
        }
    };


    // Shipper ấn nút nhận đơn hoặc nút cập nhật kết quả giao hàng
    const [lyDo, setLyDo] = useState("");

    const handleUpdateStatus = async (newStatus) => {
        if (!getOneOrder || !newStatus) return;

        
        if (!shipper || !shipper.maShipper) {
            alert("Đang tải thông tin Shipper, vui lòng bấm lại sau 2 giây!");
            return;
        }

        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`http://localhost:8080/api/order/update-status/${getOneOrder.maDonHang}`, {
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    trangThaiHienTai: newStatus,
                    maShipper: String(shipper.maShipper),
                    maTaiKhoan: String(shipper.maTaiKhoan || ""),
                    lyDo: lyDo,
                })
            });

            const responseText = await response.text();

            if (!response.ok) {
                alert(responseText || "Lỗi khi cập nhật trạng thái!");
                return;
            }

            alert(responseText || "Cập nhật trạng thái thành công!");
            

            getAllDonHang(); 
            
            try {
                const refreshRes = await fetch(`http://localhost:8080/api/order/${getOneOrder.maDonHang}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (refreshRes.ok) {
                    const freshData = await refreshRes.json();
                    setGetOneOrder(freshData); 
                }
            } catch (err) {
                console.error("Lỗi làm mới modal", err);
            }

        } catch (error) {
            console.error("Lỗi cập nhật: ", error);
        }
    };

    const handleFailureStatus = (e) => {
        e.preventDefault();
        handleUpdateStatus("Giao thất bại");
        setIsOpenReason(false);
    }

    const getShipperStatusStyle = (status) => {
        switch (status) {
            case 'Đang rảnh': return { text: 'text-green-700', bg: 'bg-green-50', dot: 'bg-green-500' };
            case 'Đang giao': return { text: 'text-blue-700', bg: 'bg-blue-50', dot: 'bg-blue-500' };
            case 'Nghỉ phép': return { text: 'text-amber-700', bg: 'bg-amber-50', dot: 'bg-amber-500' };
            case 'Đã khóa': return { text: 'text-red-700', bg: 'bg-red-50', dot: 'bg-red-500' };
            default: return { text: 'text-gray-700', bg: 'bg-gray-50', dot: 'bg-gray-500' };
        }
    };

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


            </div>

            {/* Profile and Logout */}
            <div className="bg-white p-5 border-t border-gray-300 flex items-center justify-between pt-5 lg:pt-10 px-4 md:px-10 lg:px-20 xl:px-50 gap-5">
                {shipper && (
                    <div className="flex items-center gap-3">
                        <div>
                            <p className="font-semibold">{shipper.hoTen}</p>   
                            <p className="text-xs text-gray-500">{shipper.loaiXe} • {shipper.bienSoXe}</p>
                        </div>
                        
                        <div>              
                            {(() => {
                                const style = getShipperStatusStyle(shipper.trangThaiHoatDong);
                                return (
                                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-full ${style.text} ${style.bg}`}>
                                        <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`}></span>
                                        {shipper.trangThaiHoatDong}
                                    </span>
                                );
                            })()}

                        </div>
                    </div>
                )}

                <Link to='/shipper/profile' className="text-white bg-blue-500 font-bold rounded-full p-1">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="30" height="30" fill="currentColor">
                        <path d="M12 4a4 4 0 0 1 4 4a4 4 0 0 1-4 4a4 4 0 0 1-4-4a4 4 0 0 1 4-4m0 10c4.42 0 8 1.79 8 4v2H4v-2c0-2.21 3.58-4 8-4"/>
                    </svg>
                </Link>
            </div>

            {/* Body Content */}
            {/* Camera Scan QR */}
            <div className="md:hidden mt-10 flex items-center justify-center w-full">
                <button onClick={()=> setIsOpenCamera(true)} className="bg-blue-500 p-3 rounded-xl text-white font-semibold cursor-pointer">Quét QR để lấy đơn hàng</button>
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
                            {donHanglst.filter(donhang => ["Chờ lấy hàng", "Đã nhận", "Đang giao"].includes(donhang.trangThaiHienTai)).map((donhang) => (
                                <button key={donhang.maDonHang} onClick={()=> {handleGetOrder(donhang), setIsOpenOrderDetail(true)}} className="cursor-pointer border border-gray-100 p-3 rounded-xl w-full">
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
                                <button key={donhang.maDonHang} onClick={()=> {handleGetOrder(donhang), setIsOpenOrderDetail(true)}} className="cursor-pointer border border-gray-100 p-3 rounded-xl w-full">
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
                                <button key={donhang.maDonHang} onClick={()=> {handleGetOrder(donhang), setIsOpenOrderDetail(true)}} className="cursor-pointer border border-gray-100 p-3 rounded-xl w-full">
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
            </div>

            <Modal isOpen={isOpenOrderDetail} onClose={() => setIsOpenOrderDetail(false)}>
                <div className="">
                    <div className="w-full flex items-center justify-end p-1">
                        <button onClick={()=>setIsOpenOrderDetail(false)} className="cursor-pointer">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </button>
                    </div>
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
                                        {(getOneOrder.trangThaiHienTai === 'Giao thất bại' || getOneOrder.trangThaiHienTai === 'Đã hủy') && getOneOrder.lichSuTrangThai && (
                                            <p className="text-red-500 text-sm mt-2 font-semibold">
                                                {getOneOrder.lichSuTrangThai[getOneOrder.lichSuTrangThai.length - 1]?.ghiChu}
                                            </p>
                                        )}
                                    </div>
                                ) : getOneOrder.trangThaiHienTai === 'Chờ lấy hàng' ? (
                                    <button
                                        type="button"
                                        onClick={() => handleUpdateStatus("Đã nhận")}
                                        className="cursor-pointer w-full bg-blue-600 p-3 rounded-xl text-white font-bold hover:bg-blue-700 transition-colors"
                                    >
                                        Nhận đơn hàng
                                    </button>
                                ) : getOneOrder.trangThaiHienTai === 'Đã nhận' ? (
                                    <div className="bg-blue-50 p-4 rounded-xl border border-blue-200 text-center">
                                        <p className="text-blue-700 font-medium">Đã nhận đơn hàng.</p>
                                        <p className="text-sm text-blue-500 mt-1">Vui lòng đến cửa hàng quét mã QR để bắt đầu giao hàng.</p>
                                    </div>
                                ) : getOneOrder.trangThaiHienTai === 'Đang giao' ? (
                                    <div className="flex gap-3">
                                        <button
                                            type="button"
                                            onClick={() => handleUpdateStatus("Giao thành công")}
                                            className="cursor-pointer w-1/2 bg-green-600 p-3 rounded-xl text-white font-bold hover:bg-green-700 transition-colors"
                                        >
                                            Giao hàng thành công
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setIsOpenReason(true)}
                                            className="cursor-pointer w-1/2 bg-red-600 p-3 rounded-xl text-white font-bold hover:bg-red-700 transition-colors"
                                        >
                                            Giao hàng thất bại
                                        </button>
                                    </div>
                                ) : null}

                                {isOpenReason ? (
                                    <form className="mt-4 w-full" action="" onSubmit={handleFailureStatus}>
                                        <input onChange={(e) => setLyDo(e.target.value)} className="w-full p-3 rounded-xl border border-gray-300" type="text" name="" id="" placeholder="Lí do giao hàng thất bại"/>
                                        <div className="flex items-center justify-end">
                                            <button type="submit" className="bg-red-500 p-1 pr-2 pl-2 rounded-xl text-white cursor-pointer text-xl mt-4 ">Lưu</button>
                                        </div>
                                    </form>
                                ) : (
                                    <></>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center justify-center h-full w-full">
                            <p className="text-xs text-blue-500 text-xl italic">Chọn một đơn hàng</p>
                        </div>
                    )}
                </div>
            </Modal>
            
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
