# Giao Nhanh Logistics - Frontend (React + Vite)

Giao diện web cho Hệ thống Quản lý Vận Chuyển (phân hệ **Admin**, **Shipper** và **Tra cứu khách hàng**).

> Xem hướng dẫn tổng quan, sơ đồ **ERD** và chạy toàn bộ hệ thống bằng **Docker** tại file [README.md](../README.md) ở thư mục gốc.

## Chạy nhanh bằng Docker (từ thư mục gốc `HeThongVanChuyen`)

```bash
docker compose up -d --build
```
Sau khi chạy xong, truy cập:
- Trang tra cứu khách hàng: http://localhost:5173
- Trang đăng nhập: http://localhost:5173/login

## Chạy ở chế độ phát triển (Dev)

```bash
npm install
npm run dev
```
Build production:
```bash
npm run build
```
