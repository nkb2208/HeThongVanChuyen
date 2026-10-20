package com.example.demo.entity;

import java.math.BigDecimal;

import jakarta.persistence.*;
import lombok.Data;


@Entity 
@Table (name = "ChiTietDonHang")
@Data 
public class ChiTietDonHang {
    @Id 
    @GeneratedValue (strategy = GenerationType.IDENTITY)
    @Column (name = "MaChiTiet")
    private Integer maChiTiet;

    @ManyToOne 
    @JoinColumn (name = "MaDonHang")
    private DonHang donHang;
    @Column (name = "TenHangHoa", nullable = false, length = 255)
    private String tenHangHoa;
    @Column (name = "SoLuong", nullable = false)
    private Integer soLuong;

    @Column (name = "KhoiLuongDonVi",precision = 15, scale = 2)
    private BigDecimal khoiLuongDonVi;

}
