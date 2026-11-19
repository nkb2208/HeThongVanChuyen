import { Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { createPortal } from 'react-dom';
import { Html5QrcodeScanner, Html5QrcodeSupportedFormats } from "html5-qrcode";
import * as ZXing from "html5-qrcode/third_party/zxing-js.umd";

// Thử giải mã QR từ một canvas bằng ZXing với TRY_HARDER
function decodeCanvasWithZXing(canvas) {
    const hints = new Map();
    hints.set(ZXing.DecodeHintType.POSSIBLE_FORMATS, [ZXing.BarcodeFormat.QR_CODE]);
    hints.set(ZXing.DecodeHintType.TRY_HARDER, true);

    const reader = new ZXing.QRCodeReader();
    const source = new ZXing.HTMLCanvasElementLuminanceSource(canvas);
    const candidates = [
        new ZXing.BinaryBitmap(new ZXing.HybridBinarizer(source)),
        new ZXing.BinaryBitmap(new ZXing.GlobalHistogramBinarizer(source)),
        new ZXing.BinaryBitmap(new ZXing.HybridBinarizer(new ZXing.InvertedLuminanceSource(source)))
    ];

    for (const bitmap of candidates) {
        try {
            const result = reader.decode(bitmap, hints);
            if (result && result.text) return result.text;
        } catch {
            // thử binarizer tiếp theo
        }
    }
    return null;
}

// Giải mã QR dự phòng từ file ảnh (hỗ trợ ảnh thiếu viền trắng, ảnh chụp màn hình, ảnh mờ)
async function decodeQrFromImageFile(file) {
    const imageUrl = URL.createObjectURL(file);
    try {
        const img = await new Promise((resolve, reject) => {
            const el = new Image();
            el.onload = () => resolve(el);
            el.onerror = reject;
            el.src = imageUrl;
        });

        if ("BarcodeDetector" in window) {
            try {
                const detector = new window.BarcodeDetector({ formats: ["qr_code"] });
                const barcodes = await detector.detect(img);
                if (barcodes.length > 0 && barcodes[0].rawValue) {
                    return barcodes[0].rawValue;
                }
            } catch {
                // fallback sang ZXing
            }
        }

        const w = img.naturalWidth || img.width;
        const h = img.naturalHeight || img.height;
        const padding = 48;

        const renderCrop = (sx, sy, sw, sh, scale = 1, highContrast = false) => {
            const canvas = document.createElement("canvas");
            const drawW = Math.round(sw * scale);
            const drawH = Math.round(sh * scale);
            canvas.width = drawW + padding * 2;
            canvas.height = drawH + padding * 2;
            const ctx = canvas.getContext("2d", { willReadFrequently: true });
            ctx.fillStyle = "#ffffff";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.imageSmoothingEnabled = scale <= 1;
            ctx.drawImage(img, sx, sy, sw, sh, padding, padding, drawW, drawH);

            if (highContrast) {
                const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                const data = imgData.data;
                for (let i = 0; i < data.length; i += 4) {
                    const lum = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
                    const v = lum < 140 ? 0 : 255;
                    data[i] = data[i + 1] = data[i + 2] = v;
                    data[i + 3] = 255;
                }
                ctx.putImageData(imgData, 0, 0);
            }
            return canvas;
        };

        const baseScale = Math.max(w, h) < 400 ? 2 : 1;
        const attempts = [
            renderCrop(0, 0, w, h, baseScale, false),
            renderCrop(0, 0, w, h, baseScale, true),
            renderCrop(w * 0.15, h * 0.15, w * 0.7, h * 0.7, 1, false),
            renderCrop(w * 0.25, h * 0.2, w * 0.5, h * 0.5, 1.5, false),
            renderCrop(w * 0.35, h * 0.15, w * 0.5, h * 0.6, 1.5, false),
            renderCrop(w * 0.5, 0, w * 0.5, h * 0.6, 1.5, false),
            renderCrop(0, 0, w * 0.6, h * 0.6, 1.5, false),
            renderCrop(0, h * 0.4, w * 0.6, h * 0.6, 1.5, false),
            renderCrop(w * 0.4, h * 0.4, w * 0.6, h * 0.6, 1.5, false)
        ];

        for (const canvas of attempts) {
            const decoded = decodeCanvasWithZXing(canvas);
            if (decoded) return decoded;
        }
        return null;
    } finally {
        URL.revokeObjectURL(imageUrl);
    }
}

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
        justifyContent: 'center',
        padding: '16px',
        zIndex: 50
    }}>
      <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto p-5 rounded-xl bg-white shadow-lg">
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
    const [manualMaDonHang, setManualMaDonHang] = useState("");

    const shipperRef = useRef(null);
    const getOneOrderRef = useRef(null);

    // Gọi API xác nhận quét mã QR hoặc nhập mã thủ công để lấy hàng
    const handleScanQrSuccess = async (decodedText) => {
        const cleanCode = (decodedText || "").trim();
        const currentShipper = shipperRef.current;
        if (!cleanCode || !currentShipper?.maShipper) {
            alert("Đang tải thông tin Shipper, vui lòng thử lại!");
            return false;
        }

        try {
            const token = localStorage.getItem("token");
            const response = await fetch("http://localhost:8080/api/order/scan-qr", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    maDonHang: cleanCode,
                    maShipper: currentShipper.maShipper,
                    maTaiKhoan: currentShipper.maTaiKhoan
                })
            });

            const responseText = await response.text();

            if (!response.ok) {
                alert("Không thể nhận hàng: " + responseText);
                return false;
            }

            alert("Xác nhận lấy hàng thành công! Đơn hàng đã chuyển sang trạng thái Đang giao.");

            getAllDonHang();
            if (getOneOrderRef.current && getOneOrderRef.current.maDonHang === cleanCode) {
                setGetOneOrder(prev => ({ ...prev, trangThaiHienTai: "Đang giao" }));
                setTrangThaiMoi("Giao thành công");
            }
            return true;
        } catch (error) {
            console.error("Lỗi khi gọi API lấy hàng: ", error);
            alert("Lỗi kết nối đến máy chủ!");
            return false;
        }
    };

    // Xác nhận lấy hàng bằng mã vận đơn nhập thủ công khi quét QR bị lỗi
    const handleManualPickup = async (e) => {
        e.preventDefault();
        const code = manualMaDonHang.trim();
        if (!code) {
            alert("Vui lòng nhập mã vận đơn!");
            return;
        }
        const ok = await handleScanQrSuccess(code);
        if (ok) {
            setManualMaDonHang("");
            setIsOpenCamera(false);
        }
    };

    // Quét mã QR tại cửa hàng để chuyển đơn hàng từ Đã nhận sang Đang giao
    useEffect(() => {
        if (!isOpenCamera) return;

        let isCancelled = false;
        let isHandled = false;
        let scanner = null;
        let lastSelectedFile = null;
        let readerElement = null;

        const onFileChange = (e) => {
            if (e.target && e.target.type === "file" && e.target.files?.[0]) {
                lastSelectedFile = e.target.files[0];
            }
        };

        const onFileDrop = (e) => {
            const file = e.dataTransfer?.files?.[0];
            if (file && file.type.startsWith("image/")) {
                lastSelectedFile = file;
            }
        };

        const completeScan = async (decodedText) => {
            if (isHandled || isCancelled) return;
            isHandled = true;
            if (scanner) {
                await scanner.clear().catch(() => {});
            }
            setIsOpenCamera(false);
            await handleScanQrSuccess(decodedText);
        };

        const initTimer = setTimeout(() => {
            if (isCancelled) return;
            readerElement = document.getElementById("qr-reader");
            if (!readerElement) return;

            readerElement.addEventListener("change", onFileChange, true);
            readerElement.addEventListener("drop", onFileDrop, true);

            scanner = new Html5QrcodeScanner(
                "qr-reader",
                {
                    fps: 10,
                    qrbox: (viewfinderWidth, viewfinderHeight) => {
                        const minEdge = Math.min(viewfinderWidth, viewfinderHeight);
                        const size = Math.max(120, Math.floor(minEdge * 0.75));
                        return { width: size, height: size };
                    },
                    formatsToSupport: [Html5QrcodeSupportedFormats.QR_CODE],
                    experimentalFeatures: {
                        useBarCodeDetectorIfSupported: true
                    },
                    rememberLastUsedCamera: true
                },
                false
            );

            scanner.render(
                async (decodedText) => {
                    await completeScan(decodedText);
                },
                async () => {
                    if (lastSelectedFile && !isHandled && !isCancelled) {
                        const fileToRetry = lastSelectedFile;
                        lastSelectedFile = null;
                        const fallbackText = await decodeQrFromImageFile(fileToRetry);
                        if (fallbackText) {
                            await completeScan(fallbackText);
                        } else {
                            const msgEl = document.getElementById("qr-reader__header_message");
                            if (msgEl) {
                                msgEl.innerText = "Không nhận diện được mã QR từ ảnh này. Vui lòng dùng ảnh tải từ nút 'Tải ảnh QR' hoặc chụp rõ mã QR.";
                            }
                        }
                    }
                }
            );
        }, 0);

        return () => {
            isCancelled = true;
            clearTimeout(initTimer);
            if (readerElement) {
                readerElement.removeEventListener("change", onFileChange, true);
                readerElement.removeEventListener("drop", onFileDrop, true);
            }
            if (scanner) {
                scanner.clear().catch(() => {});
            }
        };
    }, [isOpenCamera]);

    useEffect(()=> {
        getAllDonHang();
        const interval = setInterval(() => {
            getAllDonHang();
        }, 1000);
        return () => clearInterval(interval);
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
            setIsOpenReason(false);
            setPhanLoaiLyDo("");
            setLyDo("");
            setAnhMinhChung("");
            setReasonError("");
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
        getOneOrderRef.current = getOneOrder;
    }, [getOneOrder]);

    useEffect(() => {
        shipperRef.current = shipper;
    }, [shipper]);

    useEffect(() => {
        getShipperInfo();
        const interval = setInterval(() => {
            getShipperInfo();
        }, 1000);
        return () => clearInterval(interval);
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
    const [phanLoaiLyDo, setPhanLoaiLyDo] = useState("");
    const [lyDo, setLyDo] = useState("");
    const [anhMinhChung, setAnhMinhChung] = useState("");
    const [reasonError, setReasonError] = useState("");

    // Đọc và nén ảnh minh chứng giao thất bại thành base64 để lưu lịch sử trạng thái
    const handleProofImageChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) {
            setAnhMinhChung("");
            return;
        }
        const reader = new FileReader();
        reader.onload = () => {
            const img = new Image();
            img.onload = () => {
                const maxWidth = 900;
                const scale = img.width > maxWidth ? maxWidth / img.width : 1;
                const canvas = document.createElement("canvas");
                canvas.width = Math.round(img.width * scale);
                canvas.height = Math.round(img.height * scale);
                const ctx = canvas.getContext("2d");
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                setAnhMinhChung(canvas.toDataURL("image/jpeg", 0.8));
            };
            img.onerror = () => setAnhMinhChung(reader.result || "");
            img.src = reader.result;
        };
        reader.readAsDataURL(file);
    };

    const handleUpdateStatus = async (newStatus) => {
        if (!getOneOrder || !newStatus) return false;

        if (!shipper || !shipper.maShipper) {
            alert("Đang tải thông tin Shipper, vui lòng bấm lại sau 2 giây!");
            return false;
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
                    phanLoaiLyDo: phanLoaiLyDo,
                    lyDo: lyDo.trim(),
                    anhMinhChung: anhMinhChung,
                })
            });

            const responseText = await response.text();

            if (!response.ok) {
                alert(responseText || "Lỗi khi cập nhật trạng thái!");
                return false;
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
            return true;
        } catch (error) {
            console.error("Lỗi cập nhật: ", error);
            return false;
        }
    };

    // Kiểm tra bắt buộc chọn và nhập lý do trước khi lưu giao hàng thất bại
    const handleFailureStatus = async (e) => {
        e.preventDefault();
        if (!phanLoaiLyDo) {
            setReasonError("Vui lòng chọn lý do giao hàng thất bại!");
            return;
        }
        if (!lyDo || lyDo.trim() === "") {
            setReasonError("Vui lòng nhập lý do cụ thể!");
            return;
        }
        setReasonError("");
        const success = await handleUpdateStatus("Giao thất bại");
        if (success) {
            setIsOpenReason(false);
            setPhanLoaiLyDo("");
            setLyDo("");
            setAnhMinhChung("");
        }
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
            {/* Camera Scan QR & Nhập mã thủ công */}
            <div className="mt-6 flex items-center justify-center w-full px-4">
                <button onClick={()=> setIsOpenCamera(true)} className="bg-blue-500 hover:bg-blue-600 p-3 px-5 rounded-xl text-white font-semibold cursor-pointer">Quét QR / Nhập mã lấy hàng</button>
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

                            <div className="mt-4 border-t border-b border-gray-200 py-3">
                                <div className="flex gap-3">
                                    <div className="w-1/2 p-3 border border-gray-200 rounded-xl text-sm">
                                        <p className="text-xs text-gray-500">Người gửi</p>
                                        <p className="mt-1 font-semibold">{getOneOrder.tenNguoiGui}</p>
                                        <p className="text-xs text-gray-500 mt-0.5">{getOneOrder.sdtNguoiGui}</p> 
                                    </div>

                                    <div className="w-1/2 p-3 border border-gray-200 rounded-xl text-sm">
                                        <p className="text-xs text-gray-500">Người nhận</p>
                                        <p className="mt-1 font-semibold">{getOneOrder.tenNguoiNhan}</p>
                                        <p className="text-xs text-gray-500 mt-0.5">{getOneOrder.sdtNguoiNhan}</p> 
                                    </div>
                                </div>

                                <div className="mt-3 flex flex-col sm:flex-row gap-3">
                                    <div className="w-full sm:w-3/5 p-3 bg-slate-100 border border-gray-200 rounded-xl text-sm">
                                        <p className="text-xs text-gray-500">Địa chỉ giao hàng</p>
                                        <p className="mt-1 font-semibold">{getOneOrder.diaChiGiao}</p>
                                    </div>

                                    <div className="w-full sm:w-2/5 p-3 bg-slate-100 border border-gray-200 rounded-xl text-sm">
                                        <p className="text-xs text-gray-500">Tiền cần thu (COD + Ship)</p>
                                        <p className="text-lg mt-1 font-bold text-blue-600">{(getOneOrder.tongThuHo_COD+ getOneOrder.phiVanChuyen).toLocaleString('vi-VN')}đ</p>
                                        <p className="text-xs text-gray-500 mt-0.5">Đã bao gồm phí vận chuyển</p> 
                                    </div>
                                </div>
                            </div>
                            
                            <div className="mt-4">
                                <p className="font-semibold text-sm mb-3">Cập nhật trạng thái đơn hàng</p>

                                {['Đã hủy', 'Giao thất bại', 'Giao thành công'].includes(getOneOrder.trangThaiHienTai) ? (
                                    <div className="bg-gray-100 p-4 rounded-xl border border-gray-200 text-center">
                                        <p className="text-gray-500 text-sm font-medium">Đơn hàng này đã kết thúc quá trình giao nhận.</p>
                                        <p className="text-xs text-gray-400 mt-1">Không thể thay đổi trạng thái nữa.</p>
                                        {(getOneOrder.trangThaiHienTai === 'Giao thất bại' || getOneOrder.trangThaiHienTai === 'Đã hủy') && getOneOrder.lichSuTrangThai && (
                                            <div className="mt-2">
                                                <p className="text-red-500 text-xs font-semibold">
                                                    {getOneOrder.lichSuTrangThai[getOneOrder.lichSuTrangThai.length - 1]?.ghiChu}
                                                </p>
                                                {getOneOrder.lichSuTrangThai[getOneOrder.lichSuTrangThai.length - 1]?.anhMinhChung && (
                                                    <div className="mt-2 flex flex-col items-center">
                                                        <p className="text-xs text-gray-500 mb-1">Ảnh minh chứng:</p>
                                                        <img
                                                            src={getOneOrder.lichSuTrangThai[getOneOrder.lichSuTrangThai.length - 1].anhMinhChung}
                                                            alt="Ảnh minh chứng"
                                                            className="max-h-40 rounded-lg border border-gray-300 object-contain"
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                ) : getOneOrder.trangThaiHienTai === 'Chờ lấy hàng' ? (
                                    <button
                                        type="button"
                                        onClick={() => handleUpdateStatus("Đã nhận")}
                                        className="cursor-pointer w-full bg-blue-600 py-2.5 px-4 rounded-xl text-white text-sm font-semibold hover:bg-blue-700 transition-colors"
                                    >
                                        Nhận đơn hàng
                                    </button>
                                ) : getOneOrder.trangThaiHienTai === 'Đã nhận' ? (
                                    <div className="bg-blue-50 p-4 rounded-xl border border-blue-200 flex flex-col gap-3">
                                        <div className="text-center">
                                            <p className="text-blue-700 text-sm font-medium">Đã nhận đơn hàng.</p>
                                            <p className="text-xs text-blue-500 mt-1">Vui lòng đến cửa hàng quét mã QR hoặc nhập mã vận đơn để bắt đầu giao hàng.</p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setIsOpenCamera(true)}
                                            className="cursor-pointer w-full bg-blue-600 py-2.5 px-4 rounded-xl text-white text-sm font-semibold hover:bg-blue-700 transition-colors"
                                        >
                                            Quét mã QR lấy hàng
                                        </button>
                                        <form onSubmit={handleManualPickup} className="flex gap-2">
                                            <input
                                                type="text"
                                                value={manualMaDonHang}
                                                onChange={(e) => setManualMaDonHang(e.target.value)}
                                                placeholder={`Nhập mã vận đơn (VD: ${getOneOrder.maDonHang})`}
                                                className="w-2/3 p-2.5 text-sm rounded-xl border border-gray-300 bg-white focus:outline-none focus:border-blue-500"
                                            />
                                            <button
                                                type="submit"
                                                className="cursor-pointer w-1/3 bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold rounded-xl px-3 py-2"
                                            >
                                                Lấy hàng
                                            </button>
                                        </form>
                                    </div>
                                ) : getOneOrder.trangThaiHienTai === 'Đang giao' ? (
                                    <div className="flex gap-3">
                                        <button
                                            type="button"
                                            onClick={() => handleUpdateStatus("Giao thành công")}
                                            className="cursor-pointer w-1/2 bg-green-600 py-2.5 px-3 rounded-xl text-white text-sm font-semibold hover:bg-green-700 transition-colors"
                                        >
                                            Giao thành công
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setIsOpenReason(true);
                                                setReasonError("");
                                            }}
                                            className="cursor-pointer w-1/2 bg-red-50 text-red-600 border border-red-200 py-2.5 px-3 rounded-xl text-sm font-semibold hover:bg-red-100 transition-colors"
                                        >
                                            Giao thất bại
                                        </button>
                                    </div>
                                ) : null}

                                {isOpenReason ? (
                                    <form className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded-xl flex flex-col gap-3" action="" onSubmit={handleFailureStatus}>
                                        <div>
                                            <label className="text-xs font-semibold text-gray-700">Chọn lý do thất bại <span className="text-red-500">*</span></label>
                                            <select
                                                value={phanLoaiLyDo}
                                                onChange={(e) => {
                                                    setPhanLoaiLyDo(e.target.value);
                                                    setReasonError("");
                                                }}
                                                className="mt-1 w-full p-2.5 text-sm rounded-xl border border-gray-300 bg-white focus:outline-none focus:border-blue-500"
                                            >
                                                <option value="">-- Chọn lý do giao hàng thất bại --</option>
                                                <option value="Khách hàng không nghe máy">Khách hàng không nghe máy</option>
                                                <option value="Sai địa chỉ / Không tìm thấy địa chỉ">Sai địa chỉ / Không tìm thấy địa chỉ</option>
                                                <option value="Khách hàng từ chối nhận hàng">Khách hàng từ chối nhận hàng</option>
                                                <option value="Khách hàng hẹn giao lại sau">Khách hàng hẹn giao lại sau</option>
                                                <option value="Sự cố vận chuyển / Hư hỏng hàng">Sự cố vận chuyển / Hư hỏng hàng</option>
                                                <option value="Lý do khác">Lý do khác</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="text-xs font-semibold text-gray-700">Lý do cụ thể <span className="text-red-500">*</span></label>
                                            <input
                                                value={lyDo}
                                                onChange={(e) => {
                                                    setLyDo(e.target.value);
                                                    setReasonError("");
                                                }}
                                                className="mt-1 w-full p-2.5 text-sm rounded-xl border border-gray-300 bg-white focus:outline-none focus:border-blue-500"
                                                type="text"
                                                placeholder="Nhập lý do cụ thể..."
                                            />
                                        </div>

                                        <div>
                                            <label className="text-xs font-semibold text-gray-700">Ảnh minh chứng</label>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleProofImageChange}
                                                className="mt-1 w-full text-xs text-gray-600 file:mr-3 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-600 hover:file:bg-blue-100"
                                            />
                                            {anhMinhChung && (
                                                <div className="mt-2 relative inline-block">
                                                    <img
                                                        src={anhMinhChung}
                                                        alt="Xem trước ảnh minh chứng"
                                                        className="max-h-36 rounded-xl border border-gray-300 object-contain"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => setAnhMinhChung("")}
                                                        className="mt-1 text-xs text-red-600 font-medium cursor-pointer block"
                                                    >
                                                        Xóa ảnh
                                                    </button>
                                                </div>
                                            )}
                                        </div>

                                        {reasonError && (
                                            <p className="text-xs text-red-600 font-medium">{reasonError}</p>
                                        )}

                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setIsOpenReason(false);
                                                    setPhanLoaiLyDo("");
                                                    setLyDo("");
                                                    setAnhMinhChung("");
                                                    setReasonError("");
                                                }}
                                                className="px-4 py-2 rounded-xl border border-gray-300 bg-white text-gray-600 text-sm font-medium hover:bg-gray-100 cursor-pointer"
                                            >
                                                Hủy
                                            </button>
                                            <button
                                                type="submit"
                                                className="px-4 py-2 rounded-xl bg-red-600 text-white text-sm font-semibold hover:bg-red-700 cursor-pointer"
                                            >
                                                Lưu
                                            </button>
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
                <div className="w-full">
                    <div className="flex items-center justify-between mb-4 border-b pb-2">
                        <p className="font-bold text-lg">Đưa mã QR vào khung</p>
                        <button onClick={() => setIsOpenCamera(false)} className="text-red-500 font-bold cursor-pointer">Đóng</button>
                    </div>
                    
                    <div id="qr-reader" className="w-full"></div>

                    <div className="mt-4 pt-3 border-t border-gray-200">
                        <p className="text-xs font-semibold text-gray-600 mb-2">Quét QR bị lỗi? Nhập mã vận đơn thủ công:</p>
                        <form onSubmit={handleManualPickup} className="flex gap-2">
                            <input
                                type="text"
                                value={manualMaDonHang}
                                onChange={(e) => setManualMaDonHang(e.target.value)}
                                placeholder="Nhập mã vận đơn..."
                                className="w-2/3 p-2.5 text-sm rounded-xl border border-gray-300 bg-white focus:outline-none focus:border-blue-500"
                            />
                            <button
                                type="submit"
                                className="cursor-pointer w-1/3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl px-3 py-2"
                            >
                                Lấy hàng
                            </button>
                        </form>
                    </div>
                </div>
            </Modal>
        </div>
    );
}

export default Shipper;
