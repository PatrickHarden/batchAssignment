package com.scholastic.baserver.filter;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertSame;

import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.mock.http.server.reactive.MockServerHttpRequest;
import org.springframework.mock.web.server.MockServerWebExchange;
import org.springframework.web.server.WebFilterChain;

import reactor.core.publisher.Mono;

class StorybookWebFilterTest {

    @Test
    void returnsStoryBookIndex_WhenHomePage() {
        var webFilter = new StorybookWebFilter("local");
        WebFilterChain filterChain = filterExchange -> {
            assertEquals("/storybook/index.html", filterExchange.getRequest().getURI().getPath());
            return Mono.empty();
        };
        MockServerWebExchange exchange = MockServerWebExchange.from(MockServerHttpRequest.get("/storybook"));

        webFilter.filter(exchange, filterChain);
    }

    @Test
    void redirectsToHome_WhenNotRequestingResource() {
        var webFilter = new StorybookWebFilter("local");
        WebFilterChain filterChain = filterExchange -> Mono.empty();
        MockServerWebExchange exchange = MockServerWebExchange.from(MockServerHttpRequest.get("/storybook/blah"));

        webFilter.filter(exchange, filterChain);

        assertEquals(HttpStatus.FOUND, exchange.getResponse().getStatusCode());
        assertEquals("/storybook", exchange.getResponse().getHeaders().getLocation().toString());
    }

    @Test
    void redirectsOriginalExchange_WhenNotStorybookResourcePath() {
        var webFilter = new StorybookWebFilter("local");
        MockServerWebExchange exchange = MockServerWebExchange.from(MockServerHttpRequest.get("/storybooks"));
        WebFilterChain filterChain = filterExchange -> {
            assertSame(exchange, filterExchange);
            return Mono.empty();
        };

        webFilter.filter(exchange, filterChain);
    }

    @Test
    void returnsOriginalExchange_WhenNotProd() {
        var webFilter = new StorybookWebFilter("local");
        var path = "/asd";
        MockServerWebExchange exchange = MockServerWebExchange.from(MockServerHttpRequest.get(path));
        WebFilterChain filterChain = filterExchange -> {
            assertSame(exchange, filterExchange);
            return Mono.empty();
        };

        webFilter.filter(exchange, filterChain);
    }

    @Test
    void returnsCorrectResourcePath_WhenNestedPath() {
        var webFilter = new StorybookWebFilter("local");
        var path = "/storybook/storybook/test.js";
        WebFilterChain filterChain = filterExchange -> {
            assertEquals("/storybook/test.js", filterExchange.getRequest().getPath().value());
            return Mono.empty();
        };
        MockServerWebExchange exchange = MockServerWebExchange.from(MockServerHttpRequest.get(path));

        webFilter.filter(exchange, filterChain);
    }

    @Test
    void returnsOriginalResourcePath_WhenNotNestedPath() {
        var webFilter = new StorybookWebFilter("local");
        var path = "/storybook/index.html";
        WebFilterChain filterChain = filterExchange -> {
            assertEquals(path, filterExchange.getRequest().getPath().value());
            return Mono.empty();
        };
        MockServerWebExchange exchange = MockServerWebExchange.from(MockServerHttpRequest.get(path));

        webFilter.filter(exchange, filterChain);
    }

    @Test
    void returnsOriginalExchange_WhenProd() {
        var webFilter = new StorybookWebFilter("prod");
        var path = "/storybook";
        MockServerWebExchange exchange = MockServerWebExchange.from(MockServerHttpRequest.get(path));
        WebFilterChain filterChain = filterExchange -> {
            assertSame(exchange, filterExchange);
            return Mono.empty();
        };

        webFilter.filter(exchange, filterChain);
    }

}
