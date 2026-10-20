package com.example.demo.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity 
@Table(name ="TaiKhoan")
@Data

public class Taikhoan {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "MaTaiKhoan")
    private Integer maTaiKhoan;

    @Column(name = "TenDangNhap", length = 50, nullable = false, unique = true)
    private String tenDangNhap;

    @Column(name = "MatKhau", length = 255, nullable = false)
    private String matKhau;

    @Column(name = "VaiTro", length = 20, nullable = false)
    private String vaiTro;

    @Column(name ="TrangThai", length = 50)
    private String trangThai;
}
