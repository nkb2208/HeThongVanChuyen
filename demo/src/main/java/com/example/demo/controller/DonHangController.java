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
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
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
    
    // Tạo mã vận đơn ngẫu nhiên
    private String generatedMaDonHang(){
        String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyMMdd"));
        String s = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";

        StringBuilder randomStr = new StringBuilder();
        Random random = new Random();

        for(int i = 0; i < 4; i++){
            int index = random.nextInt(s.length());
            randomStr.append(s.charAt(index));
        }

        return "DH-" + timestamp + "-" + randomStr.toString();
    }

    // Lấy danh sách tất cả đơn hàng (mới tạo lên đầu)
    @GetMapping("")
    @PreAuthorize("hasAnyAuthority('Admin', 'Shipper')" )
    public List<DonHang> getAllDonHang(){
        return donHangRepository.findAllByOrderByThoiGianTaoDesc();
    }

    // Lấy chi tiết đơn hàng và lịch sử trạng thái theo mã đơn hàng
    @GetMapping("/{maDonHang}")
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
        dto.setPhiVanChuyen(donHang.getPhiVanChuyen()); 
        dto.setTongKhoiLuong(donHang.getTongKhoiLuong());
        dto.setTrangThaiHienTai(donHang.getTrangThaiHienTai());

        if(donHang.getShipper() != null){
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
                lsDto.setPhanLoaiLyDo(ls.getPhanLoaiLyDo());
                lsDto.setNoiDungChiTietLyDo(ls.getNoiDungChiTietLyDo());
                lsDto.setAnhMinhChung(ls.getAnhMinhChung());
                return lsDto;
            }).collect(Collectors.toList());
            
            dto.setLichSuTrangThai(historyList);
        }

        return ResponseEntity.ok(dto);
    }

    // Tạo đơn hàng mới ở trạng thái Chờ lấy hàng
    @PostMapping("/create")
    @Transactional
    @PreAuthorize("hasAuthority('Admin')" )
    public DonHang createDonHang(@RequestBody DonHang newDonHang){
        String maDonHang = generatedMaDonHang();
        newDonHang.setMaDonHang(maDonHang);
        newDonHang.setTrangThaiHienTai("Chờ lấy hàng");
        newDonHang.setThoiGianTao(LocalDateTime.now());

        DonHang savedDonHang = donHangRepository.save(newDonHang);

        LichSuTrangThai lichSu = new LichSuTrangThai();
        lichSu.setDonHang(savedDonHang);
        lichSu.setTrangThai("Chờ lấy hàng");
        lichSu.setThoiGianCapNhat(LocalDateTime.now());
        lichSu.setGhiChu("Tạo đơn hàng mới thành công.");
        lichSu.setPhanLoaiLyDo("Tạo đơn hàng");
        lichSuTrangThaiRepository.save(lichSu);

        return savedDonHang;
    }

    // Cập nhật thông tin đơn hàng
    @PutMapping("/update/{maDonHang}")
    @PreAuthorize("hasAuthority('Admin')" )
    public DonHang updateDonHang(@RequestBody DonHang updateDonHang, @PathVariable String maDonHang){
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
        
    // Xóa đơn hàng theo mã
    @DeleteMapping("/delete/{maDonHang}")
    @PreAuthorize("hasAuthority('Admin')" )
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

    // Xác định shipper từ tài khoản JWT đang đăng nhập để tránh giả mạo maShipper
    private Shipper resolveAuthenticatedShipper(Integer requestedMaShipper) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.isAuthenticated()) {
            Optional<Shipper> byUsername = shipperRepository.findByTaiKhoan_TenDangNhap(auth.getName());
            if (byUsername.isPresent()) {
                return byUsername.get();
            }
        }
        if (requestedMaShipper != null) {
            return shipperRepository.findById(requestedMaShipper).orElse(null);
        }
        return null;
    }

    // Shipper quét mã QR tại cửa hàng để lấy hàng và chuyển đơn từ Đã nhận sang Đang giao
    @PostMapping("/scan-qr")
    @Transactional
    @PreAuthorize("hasAuthority('Shipper')" )
    public ResponseEntity<?> scanQrNhanDon(@RequestBody ScanQrRequest scanQrRequest) {
        String maDonHang = scanQrRequest.maDonHang != null ? scanQrRequest.maDonHang.trim() : "";
        if (maDonHang.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Vui lòng cung cấp mã vận đơn hợp lệ!");
        }

        Optional<DonHang> getDonHang = donHangRepository.findByIdForUpdate(maDonHang);
        if (getDonHang.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Không tìm thấy đơn hàng với mã: " + maDonHang);
        }

        Shipper shipper = resolveAuthenticatedShipper(scanQrRequest.maShipper);
        if (shipper == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Thông tin Shipper không hợp lệ.");
        }

        DonHang donHang = getDonHang.get();

        if (donHang.getShipper() == null) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("Lỗi: Đơn hàng này chưa được phân công hoặc chưa có shipper nào nhận.");
        }

        if (!donHang.getShipper().getMaShipper().equals(shipper.getMaShipper())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("Lỗi: Bạn quét hoặc nhập nhầm mã vận đơn! Đơn hàng này thuộc về shipper khác (" + donHang.getShipper().getHoTen() + ").");
        }

        if (!donHang.getTrangThaiHienTai().equals("Đã nhận") && !donHang.getTrangThaiHienTai().equals("Đã nhận đơn")) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Lỗi: Đơn hàng không ở trạng thái chờ lấy hàng (Trạng thái hiện tại: " + donHang.getTrangThaiHienTai() + ").");
        }

        TaiKhoan taiKhoan = shipper.getTaiKhoan();
        if (taiKhoan == null && scanQrRequest.maTaiKhoan != null) {
            taiKhoan = taiKhoanRepository.findById(scanQrRequest.maTaiKhoan).orElse(null);
        }

        donHang.setShipper(shipper); 
        donHang.setTrangThaiHienTai("Đang giao");
        donHangRepository.save(donHang); 

        shipper.setTrangThaiHoatDong("Đang giao");
        shipperRepository.save(shipper);

        LichSuTrangThai lichSu = new LichSuTrangThai();
        lichSu.setDonHang(donHang);
        lichSu.setTaiKhoan(taiKhoan);
        lichSu.setTrangThai("Đang giao");
        lichSu.setThoiGianCapNhat(LocalDateTime.now());
        lichSu.setGhiChu("Shipper " + shipper.getHoTen() + " đã quét mã QR lấy hàng và bắt đầu giao.");
        lichSu.setPhanLoaiLyDo("Hệ thống tự động");
        
        lichSuTrangThaiRepository.save(lichSu);
        
        return ResponseEntity.ok("Quét mã QR thành công, đơn hàng chuyển sang Đang giao");
    }
    
    // Quản lý hủy đơn hàng
    @PutMapping("cancel/{id}")
    @Transactional
    @PreAuthorize("hasAuthority('Admin')" )
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

    // Shipper ấn nhận đơn (khóa hàng chống race condition) hoặc cập nhật hoàn tất giao hàng
    @PutMapping("update-status/{id}")
    @Transactional
    @PreAuthorize("hasAuthority('Shipper')" )
    public ResponseEntity<String> updateOrderStatus(@PathVariable String id, @RequestBody Map<String, String> requestBody) {
        Optional<DonHang> getDonHang = donHangRepository.findByIdForUpdate(id);
        if(getDonHang.isEmpty()){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Không tìm thấy đơn hàng");
        }
    
        String newStatus = requestBody.get("trangThaiHienTai");
        if ("Nhận đơn hàng".equals(newStatus)) {
            newStatus = "Đã nhận";
        }
        
        if (newStatus == null || newStatus.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Trạng thái mới không hợp lệ");
        }
    
        DonHang donHang = getDonHang.get();
        Integer requestedShipperId = requestBody.get("maShipper") != null ? Integer.valueOf(requestBody.get("maShipper")) : null;
        Shipper authenticatedShipper = resolveAuthenticatedShipper(requestedShipperId);
        TaiKhoan taiKhoan = null;

        if ("Đã nhận".equals(newStatus)) {
            if (!"Chờ lấy hàng".equals(donHang.getTrangThaiHienTai()) || donHang.getShipper() != null) {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                        .body("Đơn hàng này vừa được shipper khác nhận hoặc không còn ở trạng thái Chờ lấy hàng!");
            }
            if (authenticatedShipper == null) {
                return ResponseEntity.badRequest().body("Không tìm thấy thông tin Shipper nhận đơn");
            }
            donHang.setShipper(authenticatedShipper);
            taiKhoan = authenticatedShipper.getTaiKhoan();
        } else if ("Đang giao".equals(newStatus)) {
            return ResponseEntity.badRequest().body("Shipper không thể tự chuyển sang Đang giao. Vui lòng đến cửa hàng quét mã QR!");
        } else if ("Giao thành công".equals(newStatus) || "Giao thất bại".equals(newStatus)) {
            if (!"Đang giao".equals(donHang.getTrangThaiHienTai())) {
                return ResponseEntity.badRequest().body("Phải quét mã QR chuyển đơn sang Đang giao trước khi hoàn tất đơn hàng");
            }
            if (authenticatedShipper == null || donHang.getShipper() == null
                    || !donHang.getShipper().getMaShipper().equals(authenticatedShipper.getMaShipper())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body("Lỗi: Bạn không phải là shipper nhận đơn hàng này nên không thể cập nhật kết quả giao hàng!");
            }
            Shipper shipper = donHang.getShipper();
            taiKhoan = shipper.getTaiKhoan();
            shipper.setTrangThaiHoatDong("Đang rảnh");
            shipperRepository.save(shipper);
        }

        donHang.setTrangThaiHienTai(newStatus);
        donHangRepository.save(donHang);
        
        LichSuTrangThai lichSuTrangThai = new LichSuTrangThai();
        lichSuTrangThai.setDonHang(donHang);
        lichSuTrangThai.setTaiKhoan(taiKhoan); 
        lichSuTrangThai.setTrangThai(newStatus);
        lichSuTrangThai.setThoiGianCapNhat(LocalDateTime.now());

        String ghiChu = "Shipper cập nhật trạng thái: "+ newStatus;
        String phanLoaiLyDo = "Tiến trình giao hàng";
        if ("Đã nhận".equals(newStatus)) {
            ghiChu = "Shipper " + donHang.getShipper().getHoTen() + " đã nhận đơn, chờ đến cửa hàng quét mã QR lấy hàng.";
        } else if ("Giao thành công".equals(newStatus)) {
            String anhMinhChung = requestBody.get("anhMinhChung");
            if (anhMinhChung != null && !anhMinhChung.trim().isEmpty()) {
                lichSuTrangThai.setAnhMinhChung(anhMinhChung.trim());
            }
        } else if ("Giao thất bại".equals(newStatus)) {
            String phanLoai = requestBody.get("phanLoaiLyDo");
            String lyDo = requestBody.get("lyDo");
            String anhMinhChung = requestBody.get("anhMinhChung");
            if (phanLoai == null || phanLoai.trim().isEmpty() || lyDo == null || lyDo.trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Vui lòng chọn phân loại và nhập lý do cụ thể khi giao hàng thất bại!");
            }
            phanLoaiLyDo = phanLoai.trim();
            ghiChu = phanLoai.trim() + " - " + lyDo.trim();
            lichSuTrangThai.setNoiDungChiTietLyDo(lyDo.trim());
            if (anhMinhChung != null && !anhMinhChung.trim().isEmpty()) {
                lichSuTrangThai.setAnhMinhChung(anhMinhChung.trim());
            }
        }
        lichSuTrangThai.setGhiChu(ghiChu);
        lichSuTrangThai.setPhanLoaiLyDo(phanLoaiLyDo);
        
        lichSuTrangThaiRepository.save(lichSuTrangThai);
        
        return ResponseEntity.ok("Đã cập nhật trạng thái đơn hàng");
    }

    // Quản lý phân công shipper cho đơn hàng
    @PutMapping("assign/{maDonHang}")
    @Transactional
    @PreAuthorize("hasAuthority('Admin')" )
    public ResponseEntity<String> assignOrderToShipper(@PathVariable String maDonHang, @RequestBody Map<String, Integer> requestBody){
        Integer maShipper = requestBody.get("maShipper");
        
        if (maShipper == null) {
            return ResponseEntity.badRequest().body("Thiếu mã người vận chuyển");
        }

        Optional<DonHang> getDonHang = donHangRepository.findByIdForUpdate(maDonHang);
        Optional<Shipper> getShipper = shipperRepository.findById(maShipper);

        if (getDonHang.isEmpty() || getShipper.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Không tìm thấy đơn hàng hoặc người vận chuyển");
        }

        DonHang donHang = getDonHang.get();
        Shipper shipper = getShipper.get();

        if (!"Chờ lấy hàng".equals(donHang.getTrangThaiHienTai()) || donHang.getShipper() != null) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Đơn hàng này đã có shipper nhận trước đó!");
        }

        if (!shipper.getTrangThaiHoatDong().equals("Đang rảnh")) {
            return ResponseEntity.badRequest().body("Shipper này đang bận hoặc đã bị khóa!");
        }

        donHang.setShipper(shipper); 
        donHang.setTrangThaiHienTai("Đã nhận");
        donHangRepository.save(donHang);

        shipper.setTrangThaiHoatDong("Đang giao");
        shipperRepository.save(shipper);

        LichSuTrangThai lichSu = new LichSuTrangThai();
        lichSu.setDonHang(donHang);
        lichSu.setTrangThai("Đã nhận");
        lichSu.setThoiGianCapNhat(LocalDateTime.now());
        lichSu.setGhiChu("Hệ thống phân công cho Shipper: " + shipper.getHoTen());
        lichSu.setPhanLoaiLyDo("Điều phối");
        lichSuTrangThaiRepository.save(lichSu);

        return ResponseEntity.ok("Phân công đơn hàng thành công");
    }
}
