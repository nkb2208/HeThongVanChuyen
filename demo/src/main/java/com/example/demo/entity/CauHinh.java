package com.example.demo.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity 
@Table (name = "CauHinh")
@Data 
public class CauHinh {
    
    @Id 
    @Column (name = "MaCauHinh", nullable = false, length = 50)
    private String maCauHinh; 

    @Column (name = "GiaTri", nullable = false)
    private String giaTri; 
    
    @Column (name = "MoTa", columnDefinition = "TEXT")
    private String moTa;
}
