package com.example.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.example.demo.entity.CauHinh;

@Repository
public interface CauHinhRepository extends JpaRepository<CauHinh, String> {

}
