import { useState, useEffect } from "react";
function Setting(){
    const [configs, setConfigs] = useState([]);
    const [editingKey, setEditingKey] = useState(null);
    const [editValue, setEditValue] = useState("");

    useEffect(() => {
        getConfigs();
    }, []);

    const getConfigs = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch("http://localhost:8080/api/setting", {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setConfigs(data);
            }
        } catch (error) {
            console.error("Lỗi lấy cấu hình: ", error);
        }
    };

    const handleEdit = (config) => {
        setEditingKey(config.maCauHinh);
        setEditValue(config.giaTri);
    };

    const handleSave = async (maCauHinh) => {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`http://localhost:8080/api/setting/update/${maCauHinh}`, {
                method: "PUT",
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` 
                },
                body: JSON.stringify({ giaTri: editValue }) 
            });

            if (response.ok) {
                alert("Cập nhật tham số thành công!");
                setEditingKey(null);
                getConfigs(); 
            } else {
                alert("Cập nhật thất bại!");
            }
        } catch (error) {
            console.error("Lỗi cập nhật cấu hình: ", error);
        }
    };

    return (
        <div className="p-5">
            <div className="bg-white p-6 mt-5 rounded-xl shadow-sm border border-gray-100 w-full max-w-5xl">
                <div className="mb-6 border-b border-gray-200 pb-4">
                    <p className="font-bold text-xl text-gray-800">Cấu hình hệ thống</p>
                    <p className="text-sm text-gray-500 mt-1">Quản lý các tham số tính toán cước phí và chính sách vận hành</p>
                </div>

                <div className="flex flex-col gap-4">
                    {configs.map((config) => (
                        <div key={config.maCauHinh} className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                            <div className="w-1/2">
                                <p className="font-semibold text-gray-800">{config.moTa}</p>
                                <p className="text-xs text-gray-400 mt-1 font-mono">Key: {config.maCauHinh}</p>
                            </div>

                            <div className="w-1/2 flex items-center justify-end gap-3">
                                {editingKey === config.maCauHinh ? (
                                    <div className="flex gap-2 w-full justify-end">
                                        <input 
                                            type="text" 
                                            value={editValue} 
                                            onChange={(e) => setEditValue(e.target.value)}
                                            className="w-1/2 border border-blue-400 p-2 rounded-lg text-right font-semibold focus:outline-none focus:ring-2 focus:ring-blue-100"
                                        />
                                        <button onClick={() => handleSave(config.maCauHinh)} className="px-4 py-2 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition-colors cursor-pointer">
                                            Lưu
                                        </button>
                                        <button onClick={() => setEditingKey(null)} className="px-4 py-2 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-colors cursor-pointer">
                                            Hủy
                                        </button>
                                    </div>
                                ) : (
                                    <>
                                        <p className="font-bold text-lg text-blue-600 mr-4">
                                            {/* Tự động định dạng tiền tệ nếu số > 1000 để giao diện đẹp hơn */}
                                            {Number(config.giaTri) >= 1000 ? Number(config.giaTri).toLocaleString('vi-VN') + ' đ' : config.giaTri}
                                        </p>
                                        <button onClick={() => handleEdit(config)} className="px-4 py-2 text-blue-600 bg-blue-50 border border-blue-200 font-semibold rounded-lg hover:bg-blue-100 transition-colors cursor-pointer">
                                            Chỉnh sửa
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    ))}

                    {configs.length === 0 && (
                        <p className="text-gray-500 italic text-center py-4">Chưa có dữ liệu cấu hình trong hệ thống.</p>
                    )}
                </div>
            </div>
        </div>
    );
}


export default Setting;