import { QRCodeCanvas } from 'qrcode.react';

function GenerateQR({ isOpen, onClose, qrOrder }) {
    if (!isOpen || !qrOrder) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            
            <div className="bg-white p-6 rounded-xl w-80 sm:w-[400px] flex flex-col items-center shadow-lg">
                
                <div className="w-full flex items-center justify-between mb-4 border-b border-gray-200 pb-2">
                    <p className="font-bold text-lg">Mã QR Vận đơn</p>
                    <button onClick={onClose} className="text-red-500 font-bold hover:text-red-600 cursor-pointer">Đóng</button>
                </div>

                <div className="border-2 border-dashed border-gray-300 p-6 rounded-xl w-full flex flex-col items-center">
                    <p className="font-bold text-xl mb-4 text-blue-600">{qrOrder.maDonHang}</p>
                    
                    <div className="p-3 bg-white border border-gray-200 rounded-xl shadow-sm">
                        <QRCodeCanvas 
                            value={qrOrder.maDonHang} 
                            size={200} 
                            level={"H"} 
                        />
                    </div>

                    <div className="w-full mt-6 flex flex-col gap-2 text-sm border-t border-gray-200 pt-4">
                        <div className="flex justify-between">
                            <span className="text-gray-500">Người nhận:</span>
                            <span className="font-semibold text-right">{qrOrder.tenNguoiNhan}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500">SĐT:</span>
                            <span className="font-semibold">{qrOrder.sdtNguoiNhan}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500">Thu hộ (COD):</span>
                            <span className="font-bold text-red-500">{qrOrder.tongThuHo_COD.toLocaleString('vi-VN')}đ</span>
                        </div>
                    </div>
                </div>

                <div className="w-full mt-6">
                    <button onClick={() => window.print()} className="w-full py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 font-bold flex items-center justify-center gap-2 cursor-pointer">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>
                        In nhãn vận đơn
                    </button>
                </div>

            </div>
        </div>
    );
}

export default GenerateQR;