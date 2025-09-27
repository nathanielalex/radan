package com.example.radan_backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class RadanBackendApplication {

	public static void main(String[] args) {
        System.out.println("Hello world");
        SpringApplication.run(RadanBackendApplication.class, args);
	}

}
