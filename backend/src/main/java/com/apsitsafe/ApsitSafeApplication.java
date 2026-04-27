package com.apsitsafe;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class ApsitSafeApplication {

    public static void main(String[] args) {
        SpringApplication.run(ApsitSafeApplication.class, args);
    }
}
