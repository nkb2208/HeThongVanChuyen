package com.example.demo.repository;

import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.entity.QuanLy;

@Repository 
public interface QuanLyRepository extends JpaRepository<QuanLy, Integer>{

    
} 
