package com.example.demo.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity 
@Table(name = "Shipper")
@Data

public class Shipper {
    @Id 
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column (name = "MaShipper")
    private Integer maShipper;

    @OneToOne
    @JoinColumn (name = "MaTaiKhoan")
    private TaiKhoan taiKhoan;

    @ManyToOne 
    @JoinColumn (name = "MaChiNhanh")
    private ChiNhanh chiNhanh;

    @Column(name = "HoTen", length = 100, nullable = false)
    private String hoTen;

    @Column(name = "SoDienThoai", length = 20, nullable = false)
    private String soDienThoai;

    @Column(name = "BienSoXe", length = 20, nullable = false)
    private String bienSoXe;

    @Column(name = "TrangThaiHoatDong", length = 50)
    private String trangThaiHoatDong;

    @Column (name = "LoaiXe", length =50 , nullable = false)
    private String loaiXe;
}
