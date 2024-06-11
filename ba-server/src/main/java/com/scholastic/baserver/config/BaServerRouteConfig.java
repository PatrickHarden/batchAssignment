package com.scholastic.baserver.config;

import java.net.URI;
import java.time.Duration;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.circuitbreaker.resilience4j.ReactiveResilience4JCircuitBreakerFactory;
import org.springframework.cloud.client.circuitbreaker.Customizer;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import io.github.resilience4j.circuitbreaker.CircuitBreakerConfig;
import io.github.resilience4j.timelimiter.TimeLimiterConfig;

@Configuration
public class BaServerRouteConfig {
    @Value("${kongToken}")
    private String kongToken;
    @Value("${baServiceBaseUrl}")
    private String baServiceBaseUrl;

    @Bean
    public RouteLocator gatewayRoute(RouteLocatorBuilder routeLocatorBuilder) {
        var prefixPath = URI.create(baServiceBaseUrl).getPath();
        return routeLocatorBuilder.routes()
                .route("baService",
                        rt -> rt.path("/api/**")
                                .filters(f -> f.setRequestHeader("Authorization", "Bearer " + kongToken)
                                        .prefixPath(prefixPath)
                                        .circuitBreaker(c -> c
                                                .setName("baCircuitBreaker")
                                                .setFallbackUri("forward:/fallback"))
                                        // defaults to 3 retries, for 5XX GET requests
                                        .retry(c -> c
                                                // wait 50ms before retrying, multiplying by factor of 2 subsequently
                                                // capping off at 500ms
                                                .setBackoff(Duration.ofMillis(50), Duration.ofMillis(500), 2, false)))
                                .uri(baServiceBaseUrl))
                .build();
    }

    @Bean
    public Customizer<ReactiveResilience4JCircuitBreakerFactory> resilience4JCircuitBreakerCustomizer() {
        return factory -> factory.configure(c -> c
                .circuitBreakerConfig(CircuitBreakerConfig.custom()
                        .slidingWindowSize(4) // # of calls to use calculating failure rate
                        .minimumNumberOfCalls(4) // minimum # of calls before evaluating failure rate
                        .failureRateThreshold(50) // failure rate threshhold in %
                        .waitDurationInOpenState(Duration.ofSeconds(3)) // time in open state before going half-open
                        .permittedNumberOfCallsInHalfOpenState(1) // # of calls allowed in half-open state
                        .build())
                .timeLimiterConfig(TimeLimiterConfig.custom()
                        .timeoutDuration(Duration.ofSeconds(4))
                        .build())
                .build(), "baCircuitBreaker");
    }
}
