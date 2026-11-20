-- Đảm bảo phiên nạp SQL luôn đọc/ghi đúng bảng mã UTF-8 (tiếng Việt)
SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci;
SET CHARACTER SET utf8mb4;

-- 1. TẠO VÀ SỬ DỤNG DATABASE
CREATE DATABASE IF NOT EXISTS db_giaonhanh_logistics
CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE db_giaonhanh_logistics;

-- ==========================================
-- 2. TẠO CÁC BẢNG DANH MỤC ĐỘC LẬP (TẠO TRƯỚC)
-- ==========================================

-- Bảng TaiKhoan
CREATE TABLE IF NOT EXISTS TaiKhoan (
    MaTaiKhoan INT AUTO_INCREMENT PRIMARY KEY,
    TenDangNhap VARCHAR(50) NOT NULL UNIQUE,
    MatKhau VARCHAR(255) NOT NULL,
    VaiTro VARCHAR(20) NOT NULL,
    TrangThai VARCHAR(50) DEFAULT 'Hoạt động'
);

-- Bảng ChiNhanh
CREATE TABLE IF NOT EXISTS ChiNhanh (
    MaChiNhanh INT AUTO_INCREMENT PRIMARY KEY,
    TenChiNhanh VARCHAR(100) NOT NULL,
    DiaChi VARCHAR(255) NOT NULL,
    Hotline VARCHAR(20)
);

-- Bảng CauHinh
CREATE TABLE IF NOT EXISTS CauHinh (
    MaCauHinh VARCHAR(50) PRIMARY KEY,
    GiaTri VARCHAR(255) NOT NULL,
    MoTa TEXT
);

-- ==========================================
-- 3. TẠO CÁC BẢNG NHÂN SỰ (CÓ KHÓA NGOẠI TỚI TÀI KHOẢN & CHI NHÁNH)
-- ==========================================

-- Bảng QuanLy
CREATE TABLE IF NOT EXISTS QuanLy (
    MaQuanLy INT AUTO_INCREMENT PRIMARY KEY,
    MaTaiKhoan INT UNIQUE,
    MaChiNhanh INT,
    HoTen VARCHAR(100) NOT NULL,
    SoDienThoai VARCHAR(20),
    Email VARCHAR(100),
    FOREIGN KEY (MaTaiKhoan) REFERENCES TaiKhoan(MaTaiKhoan),
    FOREIGN KEY (MaChiNhanh) REFERENCES ChiNhanh(MaChiNhanh)
);

-- Bảng Shipper
CREATE TABLE IF NOT EXISTS Shipper (
    MaShipper INT AUTO_INCREMENT PRIMARY KEY,
    MaTaiKhoan INT UNIQUE,
    MaChiNhanh INT,
    HoTen VARCHAR(100) NOT NULL,
    SoDienThoai VARCHAR(20) NOT NULL,
    LoaiXe VARCHAR(50) NOT NULL,
    BienSoXe VARCHAR(20) NOT NULL,
    TrangThaiHoatDong VARCHAR(50) DEFAULT 'Đang rảnh',
    FOREIGN KEY (MaTaiKhoan) REFERENCES TaiKhoan(MaTaiKhoan),
    FOREIGN KEY (MaChiNhanh) REFERENCES ChiNhanh(MaChiNhanh)
);

-- ==========================================
-- 4. TẠO BẢNG NGHIỆP VỤ CHÍNH (ĐƠN HÀNG)
-- ==========================================

-- Bảng DonHang
CREATE TABLE IF NOT EXISTS DonHang (
    MaDonHang VARCHAR(50) PRIMARY KEY,
    MaQuanLy INT,
    MaShipper INT,
    MaChiNhanh INT,
    TenNguoiGui VARCHAR(100) NOT NULL,
    SdtNguoiGui VARCHAR(20) NOT NULL,
    DiaChiGui TEXT NOT NULL,
    TenNguoiNhan VARCHAR(100) NOT NULL,
    SdtNguoiNhan VARCHAR(20) NOT NULL,
    DiaChiGiao TEXT NOT NULL,
    TongKhoiLuong DECIMAL(10,2) NOT NULL,
    PhiVanChuyen DECIMAL(15,2) NOT NULL,
    TongThuHo_COD DECIMAL(15,2) NOT NULL,
    ThoiGianTao DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    TrangThaiHienTai VARCHAR(50) NOT NULL DEFAULT 'Chờ lấy hàng',
    FOREIGN KEY (MaQuanLy) REFERENCES QuanLy(MaQuanLy),
    FOREIGN KEY (MaShipper) REFERENCES Shipper(MaShipper),
    FOREIGN KEY (MaChiNhanh) REFERENCES ChiNhanh(MaChiNhanh)
);

-- ==========================================
-- 5. TẠO CÁC BẢNG CHI TIẾT (PHỤ THUỘC VÀO ĐƠN HÀNG)
-- ==========================================

-- Bảng ChiTietDonHang
CREATE TABLE IF NOT EXISTS ChiTietDonHang (
    MaChiTiet INT AUTO_INCREMENT PRIMARY KEY,
    MaDonHang VARCHAR(50),
    TenHangHoa VARCHAR(255) NOT NULL,
    SoLuong INT NOT NULL,
    KhoiLuongDonVi DECIMAL(10,2),
    FOREIGN KEY (MaDonHang) REFERENCES DonHang(MaDonHang)
);

-- Bảng LichSuTrangThai
CREATE TABLE IF NOT EXISTS LichSuTrangThai (
    MaLichSu INT AUTO_INCREMENT PRIMARY KEY,
    MaDonHang VARCHAR(50),
    MaTaiKhoan INT,
    TrangThai VARCHAR(50),
    ThoiGianCapNhat DATETIME DEFAULT CURRENT_TIMESTAMP,
    GhiChu TEXT,
    PhanLoaiLyDo VARCHAR(100),
    NoiDungChiTietLyDo TEXT,
    AnhMinhChung LONGTEXT,
    FOREIGN KEY (MaDonHang) REFERENCES DonHang(MaDonHang),
    FOREIGN KEY (MaTaiKhoan) REFERENCES TaiKhoan(MaTaiKhoan)
);

-- ==========================================
-- 6. DỮ LIỆU MẪU KHỞI TẠO CHO DOCKER / DEMO
-- ==========================================

INSERT IGNORE INTO ChiNhanh (MaChiNhanh, TenChiNhanh, DiaChi, Hotline) VALUES
(1, 'Chi nhánh Trung Tâm', 'Quận 1, TP.HCM', '19001111');

INSERT IGNORE INTO CauHinh (MaCauHinh, GiaTri, MoTa) VALUES
('MOC_VUOT_CAN', '2', 'Khối lượng tối đa không bị tính phí vượt cân (kg)'),
('PHI_CO_BAN', '20000', 'Phí vận chuyển cơ bản (VNĐ)'),
('PHI_VUOT_CAN_TREN_KG', '10000', 'Phí thu thêm cho mỗi kg vượt mức (VNĐ)');

INSERT IGNORE INTO TaiKhoan (MaTaiKhoan, TenDangNhap, MatKhau, VaiTro, TrangThai) VALUES
(1, 'admin1', '123456', 'Admin', 'Hoạt động'),
(2, 'shipper1', '123456', 'Shipper', 'Hoạt động');

INSERT IGNORE INTO QuanLy (MaQuanLy, MaTaiKhoan, MaChiNhanh, HoTen, SoDienThoai, Email) VALUES
(1, 1, 1, 'Quản lý Hệ thống', '0900000001', 'admin@giaonhanh.vn');

INSERT IGNORE INTO Shipper (MaShipper, MaTaiKhoan, MaChiNhanh, HoTen, SoDienThoai, LoaiXe, BienSoXe, TrangThaiHoatDong) VALUES
(1, 2, 1, 'Shipper Demo 1', '0901234567', 'Xe máy', '59X1-12345', 'Đang rảnh');
