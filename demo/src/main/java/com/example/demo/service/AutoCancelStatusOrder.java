package com.example.demo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.demo.entity.DonHang;
import com.example.demo.entity.LichSuTrangThai;
import com.example.demo.entity.Shipper;
import com.example.demo.repository.DonHangRepository;
import com.example.demo.repository.LichSuTrangThaiRepository;
import com.example.demo.repository.ShipperRepository;

import java.time.LocalDateTime;
import java.util.*;

@Service 
public class AutoCancelStatusOrder {
    @Autowired 
    private DonHangRepository donHangRepository;

    @Autowired 
    private LichSuTrangThaiRepository lichSuTrangThaiRepository;

    @Autowired
    private ShipperRepository shipperRepository;

    // Tự động quét và chuyển các đơn Đã nhận quá hạn (demo 1 phút) chưa quét QR về lại Chờ lấy hàng
    @Scheduled(fixedRate = 10000)
    @Transactional
    public void quetDonHangQuaHan(){
        List<DonHang> danhDonHangTreo = new ArrayList<>();
        danhDonHangTreo.addAll(donHangRepository.findByTrangThaiHienTai("Đã nhận"));
        danhDonHangTreo.addAll(donHangRepository.findByTrangThaiHienTai("Đã nhận đơn"));

        for(DonHang donHang : danhDonHangTreo){
            Optional<LichSuTrangThai> lichSuCuoi = lichSuTrangThaiRepository.findTopByDonHangOrderByThoiGianCapNhatDesc(donHang);

            LocalDateTime thoiGianNhan = lichSuCuoi.isPresent()
                    ? lichSuCuoi.get().getThoiGianCapNhat()
                    : donHang.getThoiGianTao();

            if(thoiGianNhan != null && LocalDateTime.now().isAfter(thoiGianNhan.plusMinutes(1))){
                if(donHang.getShipper() != null){
                    Shipper shipper = donHang.getShipper();
                    shipper.setTrangThaiHoatDong("Đang rảnh");
                    shipperRepository.save(shipper);
                }

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
