package com.example.demo.controller;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;
import java.util.Random;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.demo.entity.DonHang;
import com.example.demo.repository.DonHangRepository;

@RestController
@RequestMapping("/api/order")
public class DonHangController {
    @Autowired 
    private DonHangRepository donHangRepository;
    
    private String generatedMaDonHang(){
        String timestamp =LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyMMdd"));
        String s = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";

        StringBuilder randomStr = new StringBuilder();
        Random random = new Random();


        for(int i =0 ; i< 4; i++){
            int index = random.nextInt(s.length());
            randomStr.append(s.charAt(index));
        }

        return "DH-"+ timestamp+"-"+randomStr.toString();
    }

    @GetMapping ("")
    public List<DonHang> getAllDonHang(){
        return donHangRepository.findAll();
    }

    @GetMapping ("/{maDonHang}")
    public Optional<DonHang> getDonHangById(@PathVariable String maDonHang){
        return donHangRepository.findById(maDonHang);
    }


    @PostMapping ("/create")
    public DonHang createDonHang(@RequestBody DonHang newDonHang  ){
        String maDonHang = generatedMaDonHang();
        newDonHang.setMaDonHang(maDonHang);

        return donHangRepository.save(newDonHang);
    }

    @PutMapping ("/update/{maDonHang}")
    public DonHang updateDonHang(@RequestBody DonHang updateDonHang,@PathVariable String maDonHang){
        Optional<DonHang> getDonHang = donHangRepository.findById(maDonHang);

        if(getDonHang.isEmpty()){
            return null;
        }

        DonHang donHang = getDonHang.get();
        donHang.setTenNguoiGui(updateDonHang.getTenNguoiGui());
        donHang.setSdtNguoiGui(updateDonHang.getSdtNguoiGui());
        donHang.setDiaChiGui(updateDonHang.getDiaChiGui());

        donHang.setTenNguoiNhan(updateDonHang.getTenNguoiNhan());
        donHang.setSdtNguoiNhan(updateDonHang.getSdtNguoiNhan());
        donHang.setDiaChiGiao(updateDonHang.getDiaChiGiao());
        
        donHang.setTongKhoiLuong(updateDonHang.getTongKhoiLuong());
        donHang.setPhiVanChuyen(updateDonHang.getPhiVanChuyen());
        donHang.setTongThuHo_COD(updateDonHang.getTongThuHo_COD());
        donHang.setThoiGianTao(updateDonHang.getThoiGianTao());
        donHang.setTrangThaiHienTai(updateDonHang.getTrangThaiHienTai());

        
        return donHangRepository.save(donHang);
    }
        
    @DeleteMapping("/delete/{maDonHang}")
    public ResponseEntity<String> deleteDonHang(@PathVariable String maDonHang){
        Optional<DonHang> donHang = donHangRepository.findById(maDonHang);

        if(donHang.isEmpty()){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Không tìm thấy đơn hàng");
        }

        donHangRepository.deleteById(maDonHang);

        return ResponseEntity.ok("Xóa đơn hàng thành công");
    }


}
