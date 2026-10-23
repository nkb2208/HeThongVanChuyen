package com.example.demo.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.entity.Shipper;
import com.example.demo.repository.ShipperRepository;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.PutMapping;




@RestController
@RequestMapping("/api/shipper")
public class ShipperController {
    @Autowired 
    private ShipperRepository shipperRepository;

    @GetMapping("")
    public List<Shipper> getAllShipper() {
        return shipperRepository.findAll();
    }

    @GetMapping("/{id}")
    public Optional<Shipper> getShipperById(@PathVariable Integer id) {
        return shipperRepository.findById(id);
    }
    
    
    @PostMapping("/create")
    public Shipper createShipper(@RequestBody Shipper newShipper) {
        return shipperRepository.save(newShipper);
    }


    @PutMapping("/update/{id}")
    public Shipper updateShipper(@PathVariable Integer id, @RequestBody Shipper updateShipper) {
        Optional<Shipper> getShipper = shipperRepository.findById(id);
        if(getShipper.isEmpty()){
            return null;
        }
        

        Shipper shipper = getShipper.get();

        shipper.setTaiKhoan(updateShipper.getTaiKhoan());
        shipper.setChiNhanh(updateShipper.getChiNhanh());
        shipper.setHoTen(updateShipper.getHoTen());
        shipper.setSoDienThoai(updateShipper.getSoDienThoai());
        shipper.setBienSoXe(updateShipper.getBienSoXe());
        shipper.setTrangThaiHoatDong(updateShipper.getTrangThaiHoatDong());
        shipper.setLoaiXe(updateShipper.getLoaiXe());

        return shipperRepository.save(shipper);
    }


    @DeleteMapping ("/delete/{id}")
    public ResponseEntity<String> deleteShipper(@PathVariable Integer id){
        Optional<Shipper> getShipper = shipperRepository.findById(id);
        if(getShipper.isEmpty()){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Không tìm thấy shipper");
        }

        shipperRepository.deleteById(id);

        return ResponseEntity.ok("Xóa shipper thành công");
    }
    
}
