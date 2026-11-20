package com.example.demo.service;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.LockedException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.demo.dto.AuthenticationDTO;
import com.example.demo.dto.AuthenticationRequest;
import com.example.demo.dto.RegisterRequest;
import com.example.demo.entity.TaiKhoan;
import com.example.demo.repository.ShipperRepository;
import com.example.demo.repository.TaiKhoanRepository;

import lombok.RequiredArgsConstructor;


@Service 
@RequiredArgsConstructor 
public class AuthenticationService {
    private final TaiKhoanRepository taiKhoanRepository;
    private final ShipperRepository shipperRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;


    public  AuthenticationDTO register(RegisterRequest request){
        var user  = TaiKhoan.builder()
                    .tenDangNhap(request.getTenDangNhap())
                    .matKhau(passwordEncoder.encode(request.getMatKhau()))
                    .vaiTro("Shipper")
                    .trangThai(request.getTrangThai())
                    .build();

        taiKhoanRepository.save(user);

        var jwtToken = jwtService.generateToken(user);
        return AuthenticationDTO.builder().token(jwtToken).build();
    }

    public  AuthenticationDTO authenticate(AuthenticationRequest request){
        authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(
                request.getTenDangNhap(), 
                request.getMatKhau()
            )
        );
        var user = taiKhoanRepository.findByTenDangNhap(request.getTenDangNhap())
        .orElseThrow();

        // Chặn đăng nhập nếu hồ sơ Shipper gắn với tài khoản này đang ở trạng thái Đã khóa
        var shipperOpt = shipperRepository.findByTaiKhoan_TenDangNhap(user.getTenDangNhap());
        if (shipperOpt.isPresent() && "Đã khóa".equalsIgnoreCase(shipperOpt.get().getTrangThaiHoatDong())) {
            throw new LockedException("Tài khoản của bạn đã bị khóa!");
        }
        
        var jwtToken = jwtService.generateToken(user);
        return AuthenticationDTO.builder().token(jwtToken).build();
    }
}
