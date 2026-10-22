package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.repository.ChiNhanhRepository;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import  com.example.demo.entity.ChiNhanh;

import java.util.*;




@RestController 
@RequestMapping("/api/office")
public class ChiNhanhController {
    @Autowired 
    private ChiNhanhRepository chiNhanhRepository;


    @GetMapping("")
    public List<ChiNhanh> getAllChiNhanh() {
        return chiNhanhRepository.findAll();
    }
    

    @GetMapping("/{id}")
    public Optional<ChiNhanh> getChiNhanhById(@PathVariable Integer id) {
        return chiNhanhRepository.findById(id);
    }
    
    @PostMapping("/create")
    public ChiNhanh createChiNhanh(@RequestBody ChiNhanh newChiNhanh) {
        return chiNhanhRepository.save(newChiNhanh);
    }
    

    @PutMapping("/update/{id}")
    public ChiNhanh updateChiNhanh(@PathVariable Integer id, @RequestBody ChiNhanh updateChiNhanh) {
        Optional<ChiNhanh> getChiNhanh = chiNhanhRepository.findById(id);

        if(getChiNhanh.isEmpty()){
            return null;
        }
        
        ChiNhanh chiNhanh = getChiNhanh.get();
        chiNhanh.setTenChiNhanh(updateChiNhanh.getTenChiNhanh());
        chiNhanh.setDiaChi(updateChiNhanh.getDiaChi());
        chiNhanh.setHotLine(updateChiNhanh.getHotLine());

        return chiNhanhRepository.save(chiNhanh);
    }


    @DeleteMapping ("/delete/{id}")
    public ResponseEntity<String> deleteChiNhanh(@PathVariable Integer id){
        Optional<ChiNhanh> getChiNhanh = chiNhanhRepository.findById(id);

        if(getChiNhanh.isEmpty()){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Không tìm thấy chi nhánh");
        }

        chiNhanhRepository.deleteById(id);

        return  ResponseEntity.ok("Xoá chi nhánh thành công");
    }
    
}
