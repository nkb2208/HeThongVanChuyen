-- 1. TẠO VÀ SỬ DỤNG DATABASE
CREATE DATABASE IF NOT EXISTS db_giaonhanh_logistics
CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE db_giaonhanh_logistics;

-- ==========================================
-- 2. TẠO CÁC BẢNG DANH MỤC ĐỘC LẬP (TẠO TRƯỚC)
-- ==========================================

-- Bảng TaiKhoan
CREATE TABLE TaiKhoan (
    MaTaiKhoan INT AUTO_INCREMENT PRIMARY KEY,
    TenDangNhap VARCHAR(50) NOT NULL UNIQUE,
    MatKhau VARCHAR(255) NOT NULL,
    VaiTro VARCHAR(20) NOT NULL,
    TrangThai VARCHAR(50) DEFAULT 'Hoạt động'
);

-- Bảng ChiNhanh
CREATE TABLE ChiNhanh (
    MaChiNhanh INT AUTO_INCREMENT PRIMARY KEY,
    TenChiNhanh VARCHAR(100) NOT NULL,
    DiaChi VARCHAR(255) NOT NULL,
    Hotline VARCHAR(20)
);

-- ==========================================
-- 3. TẠO CÁC BẢNG NHÂN SỰ (CÓ KHÓA NGOẠI TỚI TÀI KHOẢN & CHI NHÁNH)
-- ==========================================

-- Bảng QuanLy
CREATE TABLE QuanLy (
    MaQuanLy INT AUTO_INCREMENT PRIMARY KEY,
    MaTaiKhoan INT UNIQUE, -- Thêm UNIQUE vì mỗi quản lý chỉ có 1 tài khoản
    MaChiNhanh INT,
    HoTen VARCHAR(100) NOT NULL,
    SoDienThoai VARCHAR(20),
    Email VARCHAR(100),
    FOREIGN KEY (MaTaiKhoan) REFERENCES TaiKhoan(MaTaiKhoan),
    FOREIGN KEY (MaChiNhanh) REFERENCES ChiNhanh(MaChiNhanh)
);

-- Bảng Shipper
CREATE TABLE Shipper (
    MaShipper INT AUTO_INCREMENT PRIMARY KEY,
    MaTaiKhoan INT UNIQUE, -- Thêm UNIQUE vì mỗi shipper chỉ có 1 tài khoản
    MaChiNhanh INT,
    HoTen VARCHAR(100) NOT NULL,
    SoDienThoai VARCHAR(20),
    BienSoXe VARCHAR(20),
    TrangThaiHoatDong VARCHAR(50),
    FOREIGN KEY (MaTaiKhoan) REFERENCES TaiKhoan(MaTaiKhoan),
    FOREIGN KEY (MaChiNhanh) REFERENCES ChiNhanh(MaChiNhanh)
);

-- ==========================================
-- 4. TẠO BẢNG NGHIỆP VỤ CHÍNH (ĐƠN HÀNG)
-- ==========================================

-- Bảng DonHang
CREATE TABLE DonHang (
    MaDonHang VARCHAR(50) PRIMARY KEY, -- Dùng VARCHAR vì mã đơn thường có chữ, VD: 'VD1001'
    MaQuanLy INT,
    MaShipper INT,
    MaChiNhanh INT,
    TenNguoiGui VARCHAR(100),
    SdtNguoiGui VARCHAR(20),
    DiaChiGui TEXT,
    TenNguoiNhan VARCHAR(100),
    SdtNguoiNhan VARCHAR(20),
    DiaChiGiao TEXT,
    TongKhoiLuong DECIMAL(10,2),
    PhiVanChuyen DECIMAL(15,2),
    TongThuHo_COD DECIMAL(15,2),
    ThoiGianTao DATETIME DEFAULT CURRENT_TIMESTAMP,
    TrangThaiHienTai VARCHAR(50) DEFAULT 'Chờ lấy hàng',
    FOREIGN KEY (MaQuanLy) REFERENCES QuanLy(MaQuanLy),
    FOREIGN KEY (MaShipper) REFERENCES Shipper(MaShipper),
    FOREIGN KEY (MaChiNhanh) REFERENCES ChiNhanh(MaChiNhanh)
);

-- ==========================================
-- 5. TẠO CÁC BẢNG CHI TIẾT (PHỤ THUỘC VÀO ĐƠN HÀNG)
-- ==========================================

-- Bảng ChiTietDonHang
CREATE TABLE ChiTietDonHang (
    MaChiTiet INT AUTO_INCREMENT PRIMARY KEY,
    MaDonHang VARCHAR(50),
    TenHangHoa VARCHAR(255) NOT NULL,
    SoLuong INT NOT NULL,
    KhoiLuongDonVi DECIMAL(10,2),
    FOREIGN KEY (MaDonHang) REFERENCES DonHang(MaDonHang)
);

-- Bảng LichSuTrangThai
CREATE TABLE LichSuTrangThai (
    MaLichSu INT AUTO_INCREMENT PRIMARY KEY,
    MaDonHang VARCHAR(50),
    MaTaiKhoan INT, 
    TrangThai VARCHAR(50),
    ThoiGianCapNhat DATETIME DEFAULT CURRENT_TIMESTAMP,
    GhiChu TEXT,
    PhanLoaiLyDo VARCHAR(100),
    NoiDungChiTietLyDo TEXT,
    FOREIGN KEY (MaDonHang) REFERENCES DonHang(MaDonHang),
    FOREIGN KEY (MaTaiKhoan) REFERENCES TaiKhoan(MaTaiKhoan)
);