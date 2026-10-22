package com.example.demo.controller;

import java.util.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.example.demo.entity.ChiTietDonHang;
import com.example.demo.repository.ChiTietDonHangRepository;

@RestController 
@RequestMapping("/api/order-detail")
public class ChiTietDonHangController {
    @Autowired 
    ChiTietDonHangRepository chiTietDonHangRepository;

    @GetMapping("")
    public List<ChiTietDonHang> getAllChiTietDonHang() {
        return chiTietDonHangRepository.findAll();
    }
    

    @GetMapping("/{id}")
    public Optional<ChiTietDonHang> getChiTietDonHangById(@PathVariable Integer id) {
        return chiTietDonHangRepository.findById(id);
    }
    
    @PostMapping("/create")
    public ChiTietDonHang createChiTietDonHang(@RequestBody ChiTietDonHang newChiTietDonHang) {
        return chiTietDonHangRepository.save(newChiTietDonHang);
    }
    

    @PutMapping("/update/{id}")
    public ChiTietDonHang updateChiTietDonHang(@PathVariable Integer id, @RequestBody ChiTietDonHang updateChiTietDonHang) {
        Optional<ChiTietDonHang> getChiTietDonHang = chiTietDonHangRepository.findById(id);

        if(getChiTietDonHang.isEmpty()){
            return null;
        }
        
        ChiTietDonHang chiTietDonHang = getChiTietDonHang.get();
        chiTietDonHang.setDonHang(updateChiTietDonHang.getDonHang());
        chiTietDonHang.setTenHangHoa(updateChiTietDonHang.getTenHangHoa());
        chiTietDonHang.setSoLuong(updateChiTietDonHang.getSoLuong());
        chiTietDonHang.setKhoiLuongDonVi(updateChiTietDonHang.getKhoiLuongDonVi());

        return chiTietDonHangRepository.save(chiTietDonHang);
    }


    @DeleteMapping ("/delete/{id}")
    public ResponseEntity<String> deleteChiTietDonHang(@PathVariable Integer id){
        Optional<ChiTietDonHang> getChiTietDonHang = chiTietDonHangRepository.findById(id);

        if(getChiTietDonHang.isEmpty()){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Không tìm thấy chi tiết đơn hàng");
        }

        chiTietDonHangRepository.deleteById(id);

        return  ResponseEntity.ok("Xoá chi tiết đơn hàng thành công");
    }
}
