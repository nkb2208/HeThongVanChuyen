package com.example.demo.controller;

import com.example.demo.entity.TaiKhoan;
import com.example.demo.repository.TaiKhoanRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private TaiKhoanRepository taiKhoanRepository;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody TaiKhoan loginRequest) {
        Optional<TaiKhoan> userOpt = taiKhoanRepository.findByTenDangNhap(loginRequest.getTenDangNhap());

        Map<String, Object> response = new HashMap<>();

        if (userOpt.isPresent()) {
            TaiKhoan user = userOpt.get();
            // Kiểm tra mật khẩu (có thể nâng cao mã hóa sau, hiện tại so sánh chuỗi trực tiếp cho bản demo)
            if (user.getMatKhau().equals(loginRequest.getMatKhau())) {
                response.put("success", true);
                response.put("message", "Đăng nhập thành công!");
                response.put("vaiTro", user.getVaiTro()); // Trả về vai trò để React điều hướng trang (Admin / Shipper)
                return ResponseEntity.ok(response);
            }
        }

        response.put("success", false);
        response.put("message", "Tên đăng nhập hoặc mật khẩu không chính xác!");
        return ResponseEntity.status(401).body(response);
    }
}
