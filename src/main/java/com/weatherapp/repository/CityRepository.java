package com.weatherapp.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.weatherapp.entity.City;

@Repository
public interface CityRepository extends JpaRepository<City, Long> {

    List<City> findTop10ByOrderByTimestampDesc();
}
