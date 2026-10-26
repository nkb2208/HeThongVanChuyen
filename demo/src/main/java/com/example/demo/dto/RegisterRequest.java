package com.example.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data 
@Builder 
@AllArgsConstructor 
@NoArgsConstructor 
public class RegisterRequest {
    private String tenDangNhap;
    private String matKhau;
    private String vaiTro;
    private String trangThai;
}
