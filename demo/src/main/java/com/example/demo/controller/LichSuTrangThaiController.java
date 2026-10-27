package com.example.demo.controller;

import java.util.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.example.demo.entity.LichSuTrangThai;
import com.example.demo.repository.LichSuTrangThaiRepository;

@RestController 
@RequestMapping("/api/status-history")
public class LichSuTrangThaiController {
    @Autowired 
    private LichSuTrangThaiRepository lichSuTrangThaiRepository;

    @GetMapping("")
    @PreAuthorize("hasAnyAuthority('Admin', 'Shipper')" )
    public List<LichSuTrangThai> getAllLichSuTrangThai() {
        return lichSuTrangThaiRepository.findAll();
    }
    

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('Admin', 'Shipper')" )
    public Optional<LichSuTrangThai> getLichSuTrangThaiById(@PathVariable Integer id) {
        return lichSuTrangThaiRepository.findById(id);
    }
    
    @PostMapping("/create")
    @PreAuthorize("hasAnyAuthority('Admin', 'Shipper')" )
    public LichSuTrangThai createLichSuTrangThai(@RequestBody LichSuTrangThai newLichSuTrangThai) {
        return lichSuTrangThaiRepository.save(newLichSuTrangThai);
    }
    

    @PutMapping("/update/{id}")
    @PreAuthorize("hasAnyAuthority('Admin', 'Shipper')" )
    public LichSuTrangThai updateLichSuTrangThai(@PathVariable Integer id, @RequestBody LichSuTrangThai updateLichSuTrangThai) {
        Optional<LichSuTrangThai> getLichSuTrangThai = lichSuTrangThaiRepository.findById(id);

        if(getLichSuTrangThai.isEmpty()){
            return null;
        }
        
        LichSuTrangThai lichSuTrangThai = getLichSuTrangThai.get();
        lichSuTrangThai.setDonHang(updateLichSuTrangThai.getDonHang());
        lichSuTrangThai.setTaiKhoan(updateLichSuTrangThai.getTaiKhoan());
        lichSuTrangThai.setTrangThai(updateLichSuTrangThai.getTrangThai());
        lichSuTrangThai.setThoiGianCapNhat(updateLichSuTrangThai.getThoiGianCapNhat());
        lichSuTrangThai.setGhiChu(updateLichSuTrangThai.getGhiChu());
        lichSuTrangThai.setPhanLoaiLyDo(updateLichSuTrangThai.getPhanLoaiLyDo());
        lichSuTrangThai.setNoiDungChiTietLyDo(updateLichSuTrangThai.getNoiDungChiTietLyDo());

        return lichSuTrangThaiRepository.save(lichSuTrangThai);
    }


    @DeleteMapping ("/delete/{id}")
    @PreAuthorize("hasAuthority('Admin')" )
    public ResponseEntity<String> deleteLichSuTrangThai(@PathVariable Integer id){
        Optional<LichSuTrangThai> getLichSuTrangThai = lichSuTrangThaiRepository.findById(id);

        if(getLichSuTrangThai.isEmpty()){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Không tìm thấy lịch sử trạng thái");
        }

        lichSuTrangThaiRepository.deleteById(id);

        return  ResponseEntity.ok("Xoá lịch sử trạng thái thành công");
    }
}
