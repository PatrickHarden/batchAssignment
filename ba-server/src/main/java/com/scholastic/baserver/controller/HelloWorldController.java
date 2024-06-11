package com.scholastic.baserver.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/helloworld")
public class HelloWorldController {

    private static final String GREETING = "Hello, World!";

    @GetMapping()
    public String helloWorld() {
        return GREETING;
    }

}
