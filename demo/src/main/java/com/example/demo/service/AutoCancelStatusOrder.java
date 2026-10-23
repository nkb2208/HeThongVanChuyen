package com.example.demo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import com.example.demo.entity.DonHang;
import com.example.demo.entity.LichSuTrangThai;
import com.example.demo.repository.DonHangRepository;
import com.example.demo.repository.LichSuTrangThaiRepository;

import java.time.LocalDateTime;
import java.util.*;

@Service 
public class AutoCancelStatusOrder {
    @Autowired 
    private DonHangRepository donHangRepository;

    @Autowired 
    private LichSuTrangThaiRepository lichSuTrangThaiRepository;


    @Scheduled(fixedRate = 60000)
    public void quetDonHangQuaHan(){
        List<DonHang> danhDonHangTreo = donHangRepository.findByTrangThaiHienTai("Đã nhận đơn");


        for(DonHang donHang : danhDonHangTreo){
            Optional<LichSuTrangThai> lichSuCuoi= lichSuTrangThaiRepository.findTopByDonHangOrderByThoiGianCapNhatDesc(donHang);

            if(lichSuCuoi.isPresent()){
                LocalDateTime thoiGianNhan = lichSuCuoi.get().getThoiGianCapNhat();

                // Demo nen de plusMinutes(1)
                if(LocalDateTime.now().isAfter(thoiGianNhan.plusMinutes(1))){
                    donHang.setShipper(null);
                    donHang.setTrangThaiHienTai("Chờ lấy hàng");
                    donHangRepository.save(donHang);


                    LichSuTrangThai lichSuTrangThai = new LichSuTrangThai();
                    lichSuTrangThai.setDonHang(donHang);
                    lichSuTrangThai.setTrangThai("Chờ lấy hàng");
                    lichSuTrangThai.setThoiGianCapNhat(LocalDateTime.now());
                    lichSuTrangThai.setGhiChu("Hệ thống tự động hủy giữ chỗ do Shipper không đến lấy hàng quá 2 tiếng.");
                    lichSuTrangThai.setPhanLoaiLyDo("Hệ thống (Scheduled Task)");
                    lichSuTrangThaiRepository.save(lichSuTrangThai);
                }   
            }
        }

    }
}
