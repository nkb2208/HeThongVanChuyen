package com.example.demo.controller;


import org.springframework.web.bind.annotation.RestController;

import com.example.demo.entity.CauHinh;
import com.example.demo.repository.CauHinhRepository;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.PathVariable;





@RestController 
@RequestMapping("/api/setting")
public class CauHinhController {
    
    @Autowired 
    private CauHinhRepository cauHinhRepository;


    @GetMapping("")
    @PreAuthorize("hasAuthority('Admin')")
    public List<CauHinh> getSetting() {
        return cauHinhRepository.findAll();
    }
    
    @PutMapping("/update/{maCauHinh}")
    @PreAuthorize("hasAuthority('Admin')")
    public ResponseEntity<?> putSetting(@PathVariable String maCauHinh, @PathVariable CauHinh updateCauHinh) {
        Optional<CauHinh> getCauHinh = cauHinhRepository.findById(maCauHinh);
        if(getCauHinh.isEmpty()){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Không tìm thấy mã cấu hình");
        }


        CauHinh cauHinh = getCauHinh.get();

        cauHinh.setGiaTri(updateCauHinh.getGiaTri());
        
        return ResponseEntity.ok(cauHinhRepository.save(cauHinh));
    }
}
