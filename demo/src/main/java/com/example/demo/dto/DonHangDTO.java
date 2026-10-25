package com.example.demo.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import lombok.Data;


@Data 
public class DonHangDTO {
    private String maDonHang;
    private String tenNguoiGui;
    private String tenNguoiNhan;
    private String diaChiGiao;
    private BigDecimal tongThuHo_COD;
    private String trangThaiHienTai;


    private String tenShipper;
    private String sdtShipper;
    private String bienSoXeShipper;

    List<LichSuDTO> lichSuTrangThai;

    @Data 
    public static class LichSuDTO {
        private String trangThai;
        private LocalDateTime thoiGianCapNhat;
        private String ghiChu;
    }

}
