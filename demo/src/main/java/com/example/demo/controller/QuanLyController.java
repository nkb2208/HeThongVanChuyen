package com.example.demo.controller;

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
import java.util.*;
import com.example.demo.entity.QuanLy;
import com.example.demo.repository.QuanLyRepository;

@RestController 
@RequestMapping("/api/manager")
public class QuanLyController {
    @Autowired 
    private QuanLyRepository quanLyRepository;

    @GetMapping("")
    public List<QuanLy> getAllQuanLy() {
        return quanLyRepository.findAll();
    }

    @GetMapping ("/{id}")
    public Optional<QuanLy> getQuanLyById(@PathVariable Integer id){
        return quanLyRepository.findById(id);
    }

    @PostMapping ("/create")
    public QuanLy createQuanLy(@RequestBody QuanLy quanLy){
        return quanLyRepository.save(quanLy);
    }

    @PutMapping("/update/{id}")
    public QuanLy updateQuanLy(@PathVariable Integer id, @RequestBody QuanLy updateQuanLy) {
        Optional<QuanLy> getQuanLy = quanLyRepository.findById(id);

        if(getQuanLy.isEmpty()){
            return null;
        }
        
        QuanLy quanLy= getQuanLy.get();
        quanLy.setTaiKhoan(updateQuanLy.getTaiKhoan());
        quanLy.setChiNhanh(updateQuanLy.getChiNhanh());
        quanLy.setHoTen(updateQuanLy.getHoTen());
        quanLy.setSoDienThoai(updateQuanLy.getSoDienThoai());
        quanLy.setEmail(updateQuanLy.getEmail());
        
        return  quanLyRepository.save(quanLy);
    }
    
    @DeleteMapping ("/delete/{id}")
    public ResponseEntity<String> deleteQuanLy(@PathVariable Integer id){
        Optional<QuanLy> getQuanLy = quanLyRepository.findById(id);

        if(getQuanLy.isEmpty()){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Không tìm thấy quản lý");
        }

        quanLyRepository.deleteById(id);

        return  ResponseEntity.ok("Xoá quản lý thành công");
    }
     
}
