package com.example.demo.controller;
import com.example.demo.entity.TaiKhoan;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.RestController;
import com.example.demo.repository.TaiKhoanRepository;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import  java.util.*;
import org.springframework.web.bind.annotation.PutMapping;



@RestController 
@RequestMapping("/api/account")
@PreAuthorize("hasAuthority('Admin')")
public class TaiKhoanController {
    @Autowired 
    private TaiKhoanRepository taiKhoanRepository;

    @Autowired 
    private PasswordEncoder passwordEncoder;

    @GetMapping("")
    public List<TaiKhoan> getAllTaiKhoan() {
        return taiKhoanRepository.findAll();
    }

    @GetMapping ("/{id}")
    public Optional<TaiKhoan> getTaiKhoanById(@PathVariable Integer id){
        return taiKhoanRepository.findById(id);
    }

    @PostMapping ("/create")
    public TaiKhoan createTaiKhoan(@RequestBody TaiKhoan taikhoan){
        taikhoan.setMatKhau(passwordEncoder.encode(taikhoan.getMatKhau()));
        return taiKhoanRepository.save(taikhoan);
    }

    @PutMapping("/update/{id}")
    public TaiKhoan updateTaiKhoan(@PathVariable Integer id, @RequestBody TaiKhoan updateTaiKhoan) {
        Optional<TaiKhoan> getTaiKhoan = taiKhoanRepository.findById(id);

        if(getTaiKhoan.isEmpty()){
            return null;
        }
        
        TaiKhoan taiKhoan= getTaiKhoan.get();
        taiKhoan.setTenDangNhap(updateTaiKhoan.getTenDangNhap());
        taiKhoan.setMatKhau(passwordEncoder.encode(updateTaiKhoan.getMatKhau()));
        taiKhoan.setTrangThai(updateTaiKhoan.getTrangThai());
        taiKhoan.setVaiTro(updateTaiKhoan.getVaiTro());
        
        return  taiKhoanRepository.save(taiKhoan);
    }
    
    @DeleteMapping ("/delete/{id}")
    public ResponseEntity<String> deleteTaiKhoan(@PathVariable Integer id){
        Optional<TaiKhoan> getTaiKhoan = taiKhoanRepository.findById(id);

        if(getTaiKhoan.isEmpty()){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Không tìm thấy tài khoản");
        }

        taiKhoanRepository.deleteById(id);

        return  ResponseEntity.ok("Xoá tài khoản thành công");
    }
    
}
