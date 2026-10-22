package com.example.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.example.demo.entity.Shipper;

@Repository 
public interface ShipperRepository extends JpaRepository<Shipper, Integer>{

    
}