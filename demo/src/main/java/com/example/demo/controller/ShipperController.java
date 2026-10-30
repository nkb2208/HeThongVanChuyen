package com.example.demo.controller;

import com.example.demo.repository.TaiKhoanRepository;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.dto.ShipperDTO;
import com.example.demo.entity.ChiNhanh;
import com.example.demo.entity.Shipper;
import com.example.demo.entity.TaiKhoan;
import com.example.demo.repository.ChiNhanhRepository;
import com.example.demo.repository.ShipperRepository;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.PutMapping;




@RestController
@RequestMapping("/api/shipper")
public class ShipperController {

    @Autowired 
    private TaiKhoanRepository taiKhoanRepository;

    @Autowired 
    private ChiNhanhRepository chiNhanhRepository;

    @Autowired 
    private ShipperRepository shipperRepository;

    @Autowired 
    private PasswordEncoder passwordEncoder;

    @GetMapping("")
    @PreAuthorize("hasAnyAuthority('Admin', 'Shipper')")
    public List<Shipper> getAllShipper() {
        return shipperRepository.findAll();
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('Admin', 'Shipper')")
    public ResponseEntity<?> getShipperById(@PathVariable Integer id) {
        Optional<Shipper> getShipper = shipperRepository.findById(id);
        if(getShipper.isEmpty()){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Không tìm thấy shipper");
        }
        

        Shipper shipper = getShipper.get();
        ShipperDTO dto = new ShipperDTO();

        dto.setTenDangNhap(shipper.getTaiKhoan().getTenDangNhap());
        dto.setMatKhau((shipper.getTaiKhoan().getMatKhau()));
        dto.setMaChiNhanh(shipper.getChiNhanh().getMaChiNhanh());
        dto.setHoTen(shipper.getHoTen());
        dto.setSoDienThoai(shipper.getSoDienThoai());
        dto.setTrangThaiHoatDong(shipper.getTrangThaiHoatDong());
        dto.setBienSoXe(shipper.getBienSoXe());
        dto.setLoaiXe(shipper.getLoaiXe());      
        
        return ResponseEntity.ok(dto);
    }

    @GetMapping("/profile")
    public ResponseEntity<?> getShipperInfo() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String currentName = auth.getName();

        Optional<Shipper> getShipper = shipperRepository.findAll().stream().filter(s->s.getTaiKhoan() != null && s.getTaiKhoan().getTenDangNhap().equals(currentName)).findFirst();

        if(getShipper.isEmpty()){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Không tìm thấy shipper!");
        }

        Shipper shipper = getShipper.get();
        ShipperDTO dto = new ShipperDTO();

        dto.setMaTaiKhoan(shipper.getTaiKhoan().getMaTaiKhoan());
        dto.setTenDangNhap(shipper.getTaiKhoan().getTenDangNhap());
        dto.setMaShipper(shipper.getMaShipper());
        dto.setHoTen(shipper.getHoTen());
        dto.setSoDienThoai(shipper.getSoDienThoai());
        dto.setTrangThaiHoatDong(shipper.getTrangThaiHoatDong());
        dto.setBienSoXe(shipper.getBienSoXe());
        dto.setLoaiXe(shipper.getLoaiXe());


        return ResponseEntity.ok(dto);
    }
    
    
    
    @PostMapping("/create")
    @Transactional
    @PreAuthorize("hasAuthority('Admin')" )
    public Shipper createShipper(@RequestBody ShipperDTO newShipper) {
        TaiKhoan taiKhoan = new TaiKhoan();
        taiKhoan.setTenDangNhap(newShipper.getTenDangNhap());
        taiKhoan.setMatKhau(passwordEncoder.encode(newShipper.getMatKhau()));

        taiKhoan.setVaiTro("Shipper");
        taiKhoan.setTrangThai("Hoạt động");
        TaiKhoan newTaiKhoan = taiKhoanRepository.save(taiKhoan);


        ChiNhanh chiNhanh = chiNhanhRepository.findById(newShipper.getMaChiNhanh()).orElseThrow(() -> new RuntimeException("Không tìm thấy chi nhánh"));


        Shipper shipper = new Shipper();
        shipper.setTaiKhoan(newTaiKhoan);
        shipper.setChiNhanh(chiNhanh);
        shipper.setHoTen(newShipper.getHoTen());
        shipper.setSoDienThoai(newShipper.getSoDienThoai());
        shipper.setBienSoXe(newShipper.getBienSoXe());
        shipper.setLoaiXe(newShipper.getLoaiXe());
        shipper.setTrangThaiHoatDong("Đang rảnh");


        return shipperRepository.save(shipper);
    }



    @PutMapping("/update/{id}")
    @PreAuthorize("hasAnyAuthority('Admin', 'Shipper')" )
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
    @PreAuthorize("hasAuthority('Admin')" )
    public ResponseEntity<String> deleteShipper(@PathVariable Integer id){
        Optional<Shipper> getShipper = shipperRepository.findById(id);
        if(getShipper.isEmpty()){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Không tìm thấy shipper");
        }

        shipperRepository.deleteById(id);

        return ResponseEntity.ok("Xóa shipper thành công");
    }


    @PutMapping("/lock/{id}")
    @Transactional
    @PreAuthorize("hasAuthority('Admin')" )
    public ResponseEntity<String> lockShipper(@PathVariable Integer id) {
        Optional<Shipper> getShipper = shipperRepository.findById(id);
        if(getShipper.isEmpty()){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Không tìm thấy người vận chuyển");
        }

        Shipper shipper = getShipper.get();
        
        shipper.setTrangThaiHoatDong("Đã khóa");
        shipperRepository.save(shipper);

        TaiKhoan taiKhoan = shipper.getTaiKhoan();
        if(taiKhoan != null){
            taiKhoan.setTrangThai("Đã khóa");
            taiKhoanRepository.save(taiKhoan);
        }

        return ResponseEntity.ok("Khóa tài khoản thành công");
    }

    @PutMapping("/unlock/{id}")
    @Transactional
    @PreAuthorize("hasAuthority('Admin')" )
    public ResponseEntity<String> unlockShipper(@PathVariable Integer id) {
        Optional<Shipper> getShipper = shipperRepository.findById(id);
        if(getShipper.isEmpty()){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Không tìm thấy người vận chuyển");
        }

        Shipper shipper = getShipper.get();
        shipper.setTrangThaiHoatDong("Đang rảnh"); // Trả về trạng thái mặc định
        shipperRepository.save(shipper);

        TaiKhoan taiKhoan = shipper.getTaiKhoan();
        if (taiKhoan != null) {
            taiKhoan.setTrangThai("Hoạt động");
            taiKhoanRepository.save(taiKhoan);
        }

        return ResponseEntity.ok("Mở khóa tài khoản thành công");
    }
    
}
