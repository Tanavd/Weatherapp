package com.weatherapp.controller;

import java.sql.Timestamp;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import com.weatherapp.entity.City;
import com.weatherapp.repository.CityRepository;

@RestController
public class WeatherController {

    @Autowired
    private CityRepository cityRepository;

    private final String API_KEY = "e9677b12aa81391a79f0f7fb01ce5307";
    private final String API_URL = "http://api.openweathermap.org/data/2.5/weather";

    @GetMapping("/weather")
    public String getWeather(@RequestParam String city) {
        try {
            RestTemplate restTemplate = new RestTemplate();
            String url = String.format("%s?q=%s&appid=%s&units=metric", API_URL, city, API_KEY);
            String weatherData = restTemplate.getForObject(url, String.class);

            // Save city to database
            City cityEntity = new City();
            cityEntity.setCityName(city);
            cityEntity.setTimestamp(new Timestamp(System.currentTimeMillis()));
            cityRepository.save(cityEntity);

            return weatherData;
        } catch (Exception e) {
            e.printStackTrace(); // Log the exception
            return "Error fetching weather data.";
        }
    }

    @GetMapping("/recent-cities")
    public List<City> getRecentCities() {
        return cityRepository.findTop10ByOrderByTimestampDesc();
    }
}
