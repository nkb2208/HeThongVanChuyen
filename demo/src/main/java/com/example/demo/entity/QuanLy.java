package com.example.demo.entity;

import jakarta.persistence.*;
import lombok.Data;


@Entity 
@Table(name ="QuanLy")
@Data 
public class QuanLy {
    @Id 
    @GeneratedValue (strategy = GenerationType.IDENTITY)
    @Column (name = "MaQuanLy")
    private Integer maQuanLy;

    @ManyToOne 
    @JoinColumn (name = "MaChiNhanh")
    private ChiNhanh chiNhanh;

    @OneToOne 
    @JoinColumn (name = "MaTaiKhoan")
    private TaiKhoan taiKhoan;

    @Column (name = "HoTen", nullable = false, length = 100)
    private String hoTen;

    @Column (name = "SoDienThoai", nullable = false, length = 20)
    private String soDienThoai;

    @Column (name = "Email", nullable = false, length = 100)
    private String email;
}
