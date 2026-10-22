package com.example.demo.entity;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import jakarta.persistence.*;
import lombok.Data;


@Entity 
@Table (name  = "DonHang")
@Data 
public class DonHang {
    @Id 
    @Column (name="MaDonHang", nullable = false, length = 50)
    private String maDonHang;

    @ManyToOne 
    @JoinColumn(name = "MaQuanLy")
    private QuanLy quanLy;

    @ManyToOne 
    @JoinColumn (name = "MaShipper")
    private Shipper shipper;

    @ManyToOne 
    @JoinColumn (name = "MaChiNhanh")
    private ChiNhanh chiNhanh;

    @Column (name = "TenNguoiGui", nullable = false, length = 100)
    private String tenNguoiGui;
    @Column (name = "SdtNguoiGui", nullable = false, length = 20)
    private String sdtNguoiGui;
    @Column (name ="DiaChiGui", nullable = false, columnDefinition = "TEXT")
    private String diaChiGui;

    @Column (name = "TenNguoiNhan", nullable = false, length = 100)
    private String tenNguoiNhan;
    @Column (name = "SdtNguoiNhan", nullable = false, length = 20)
    private String sdtNguoiNhan;
    @Column (name ="DiaChiGiao", nullable = false, columnDefinition = "TEXT")
    private String diaChiGiao;

    @Column (name = "TongKhoiLuong", nullable = false,precision = 10, scale = 2)
    private BigDecimal tongKhoiLuong;
    @Column (name = "PhiVanChuyen", nullable = false ,precision = 15, scale = 2)
    private BigDecimal phiVanChuyen;
    @Column (name = "TongThuHo_COD", nullable = false ,precision = 15, scale = 2)
    private BigDecimal tongThuHo_COD;
    @Column (name = "ThoiGianTao", nullable = false)
    private LocalDateTime thoiGianTao = LocalDateTime.now();
    @Column (name = "TrangThaiHienTai", nullable = false, length = 50)
    private String trangThaiHienTai ="Chờ lấy hàng";
}
