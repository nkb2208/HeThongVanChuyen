package com.example.demo.controller;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Random;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import com.example.demo.dto.DonHangDTO;
import com.example.demo.entity.DonHang;
import com.example.demo.entity.LichSuTrangThai;
import com.example.demo.entity.Shipper;
import com.example.demo.entity.TaiKhoan;
import com.example.demo.repository.DonHangRepository;
import com.example.demo.repository.LichSuTrangThaiRepository;
import com.example.demo.repository.ShipperRepository;
import com.example.demo.repository.TaiKhoanRepository;



@RestController
@RequestMapping("/api/order")
public class DonHangController {
    @Autowired 
    private DonHangRepository donHangRepository;

    @Autowired
    private ShipperRepository shipperRepository;

    @Autowired
    private TaiKhoanRepository taiKhoanRepository;

    @Autowired
    private LichSuTrangThaiRepository lichSuTrangThaiRepository;
    
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
    public ResponseEntity<?> getDonHangById(@PathVariable String maDonHang){
        Optional<DonHang> getDonHang = donHangRepository.findById(maDonHang);

        if(getDonHang.isEmpty()){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Không tìm thấy đơn hàng");
        }

        DonHang donHang = getDonHang.get();
        DonHangDTO dto = new DonHangDTO();

        dto.setMaDonHang(donHang.getMaDonHang());
        dto.setTenNguoiGui(donHang.getTenNguoiGui());
        dto.setTenNguoiNhan(donHang.getTenNguoiNhan());
        dto.setDiaChiGiao(donHang.getDiaChiGiao());
        dto.setTongThuHo_COD(donHang.getTongThuHo_COD());
        dto.setTrangThaiHienTai(donHang.getTrangThaiHienTai());

        if(donHang.getShipper()!= null){
            dto.setTenShipper(donHang.getShipper().getHoTen());
            dto.setBienSoXeShipper(donHang.getShipper().getBienSoXe());
            dto.setSdtShipper(donHang.getShipper().getSoDienThoai());
        }


        List<LichSuTrangThai> lichSuList = lichSuTrangThaiRepository.findByDonHang(donHang);

        if (lichSuList != null && !lichSuList.isEmpty()) {
                List<DonHangDTO.LichSuDTO> historyList = lichSuList.stream().map(ls -> {
                    DonHangDTO.LichSuDTO lsDto = new DonHangDTO.LichSuDTO();
                    lsDto.setTrangThai(ls.getTrangThai());
                    lsDto.setThoiGianCapNhat(ls.getThoiGianCapNhat());
                    lsDto.setGhiChu(ls.getGhiChu());
                    return lsDto;
                }).collect(Collectors.toList());
                
                dto.setLichSuTrangThai(historyList);
            }

        return ResponseEntity.ok(dto);
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

    public static class ScanQrRequest{
        public String maDonHang;
        public Integer maTaiKhoan;
        public Integer maShipper;
    }

    @PostMapping("/scan-qr")
    public ResponseEntity<?> scanQrNhanDon(@RequestBody ScanQrRequest scanQrRequest) {
        Optional<DonHang> getDonHang = donHangRepository.findById(scanQrRequest.maDonHang);
        if (getDonHang.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Không tìm thấy đơn hàng!");
        }

        DonHang donHang = getDonHang.get();

        if (!donHang.getTrangThaiHienTai().equals("Chờ lấy hàng")) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Lỗi: Đơn hàng này đã có người nhận hoặc đã bị hủy.");
        }

        Optional<Shipper> getShipper = shipperRepository.findById(scanQrRequest.maShipper);
        Optional<TaiKhoan> getTaiKhoan = taiKhoanRepository.findById(scanQrRequest.maTaiKhoan);

        if (getShipper.isEmpty() || getTaiKhoan.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Thông tin Shipper không hợp lệ.");
        }

        donHang.setShipper(getShipper.get()); 
        donHang.setTrangThaiHienTai("Đã nhận đơn");
        donHangRepository.save(donHang); 

        LichSuTrangThai lichSu = new LichSuTrangThai();
        lichSu.setDonHang(donHang);
        lichSu.setTaiKhoan(getTaiKhoan.get());
        lichSu.setTrangThai("Đã nhận đơn");
        lichSu.setThoiGianCapNhat(LocalDateTime.now());
        lichSu.setGhiChu("Shipper " + getShipper.get().getHoTen() + " quét mã QR nhận đơn thành công.");
        lichSu.setPhanLoaiLyDo("Hệ thống tự động");
        
        lichSuTrangThaiRepository.save(lichSu);
        
        return ResponseEntity.ok("Nhận đơn thành công");
    }
    

    @PutMapping("cancel/{id}")
    public ResponseEntity<String> huyDonHang(@PathVariable String id) {
        Optional<DonHang> getDonHang = donHangRepository.findById(id);
        if(getDonHang.isEmpty()){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Không tìm thấy đơn hàng");
        }
        

        DonHang donHang = getDonHang.get();
        donHang.setTrangThaiHienTai("Đã hủy");
        
        LichSuTrangThai lichSuTrangThai = new LichSuTrangThai();
        lichSuTrangThai.setDonHang(donHang);
        lichSuTrangThai.setTaiKhoan(null);
        lichSuTrangThai.setTrangThai("Đã hủy");
        lichSuTrangThai.setThoiGianCapNhat(LocalDateTime.now());
        lichSuTrangThai.setGhiChu("Đã hủy đơn hàng");
        lichSuTrangThai.setPhanLoaiLyDo("Quản lý hủy đơn hàng");


        donHangRepository.save(donHang);
        lichSuTrangThaiRepository.save(lichSuTrangThai);

        return ResponseEntity.ok("Hủy đơn hàng thành công");
    }

    
    @PutMapping("update-status/{id}")
    @Transactional 
    public ResponseEntity<String> updateOrderStatus(@PathVariable String id, @RequestBody Map<String, String> requestBody) {
        Optional<DonHang> getDonHang = donHangRepository.findById(id);
        if(getDonHang.isEmpty()){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Không tìm thấy đơn hàng");
        }
    
        String newStatus = requestBody.get("trangThaiHienTai");
        
        if (newStatus == null || newStatus.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Trạng thái mới không hợp lệ");
        }
    
        DonHang donHang = getDonHang.get();
        donHang.setTrangThaiHienTai(newStatus);
        donHangRepository.save(donHang);
        
        LichSuTrangThai lichSuTrangThai = new LichSuTrangThai();
        lichSuTrangThai.setDonHang(donHang);
        lichSuTrangThai.setTaiKhoan(null); 
        lichSuTrangThai.setTrangThai(newStatus);
        lichSuTrangThai.setThoiGianCapNhat(LocalDateTime.now());
        lichSuTrangThai.setGhiChu("Shipper cập nhật trạng thái");
        lichSuTrangThai.setPhanLoaiLyDo("Tiến trình giao hàng");
        
        lichSuTrangThaiRepository.save(lichSuTrangThai);
        
        return ResponseEntity.ok("Đã cập nhật trạng thái đơn hàng");
    }
}

