package com.example.demo.entity;

import jakarta.persistence.*;
import lombok.Data;


@Entity 
@Table (name="ChiNhanh")
@Data 
public class ChiNhanh {
    @Id
    @GeneratedValue (strategy = GenerationType.IDENTITY)
    @Column (name = "MaChiNhanh")
    private Integer maChiNhanh;

    @Column (name = "TenChiNhanh", nullable = false, length = 100)
    private String tenChiNhanh;

    @Column (name = "DiaChi", nullable = false, length = 255)
    private String diaChi;

    @Column (name = "HotLine", nullable = false ,length=20)
    private String hotLine;
}
