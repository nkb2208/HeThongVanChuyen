package com.example.demo.entity;

import java.time.LocalDateTime;

import jakarta.persistence.*;
import lombok.Data;

@Entity 
@Table (name  = "LichSuTrangThai")
@Data 
public class LichSuTrangThai {
    @Id 
    @GeneratedValue (strategy = GenerationType.IDENTITY)
    @Column (name = "MaLichSu")
    private Integer maLichSu;

    @ManyToOne 
    @JoinColumn (name = "MaDonHang")
    private DonHang donHang;
    
    @ManyToOne 
    @JoinColumn (name = "MaTaiKhoan")
    private Taikhoan taiKhoan;
    
    @Column (name = "TrangThai", length = 50)
    private String trangThai;

    @Column (name = "ThoiGianCapNhat")
    private LocalDateTime thoiGianCapNhat = LocalDateTime.now();

    @Column (name = "GhiChu", columnDefinition = "TEXT")
    private String ghiChu;

    @Column (name = "PhanLoaiLyDo", length = 100)
    private String phanLoaiLyDo;

    @Column (name = "NoiDungChiTietLyDo", columnDefinition = "TEXT")
    private String noiDungChiTietLyDo;
}
