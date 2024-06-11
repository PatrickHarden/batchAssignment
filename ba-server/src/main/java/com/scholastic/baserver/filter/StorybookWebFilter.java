package com.scholastic.baserver.filter;

import java.net.URI;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import org.springframework.web.server.WebFilter;
import org.springframework.web.server.WebFilterChain;

import reactor.core.publisher.Mono;

@Component
public class StorybookWebFilter implements WebFilter {

    private final boolean isProd;
    private static final String STORYBOOK_PATH = "/storybook";

    public StorybookWebFilter(@Value("${env:local}") String env) {
        this.isProd = env.equals("prod");
    }

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, WebFilterChain chain) {
        var webExchange = exchange;
        var path = webExchange.getRequest().getURI().getPath();

        if (isProd) {
            return chain.filter(webExchange);
        }

        // storybook routing logic
        if (path.startsWith(STORYBOOK_PATH)) {
            // home page
            if (path.equals(STORYBOOK_PATH)) {
                webExchange = webExchange.mutate()
                        .request(webExchange.getRequest().mutate().path(STORYBOOK_PATH.concat("/index.html")).build())
                        .build();
            } else if (path.startsWith(STORYBOOK_PATH.concat("/")) && !path.contains(".")) {
                // redirect to home page if not requesting static resource
                // this is for handling abritary routes like /storybook/blah
                var response = webExchange.getResponse();
                response.setStatusCode(HttpStatus.FOUND);
                response.getHeaders().setLocation(URI.create(STORYBOOK_PATH));
                return Mono.empty();
            } else if (path.startsWith("/storybook/storybook")) {
                // requesting static resource, we need to manually correct route due to serving from /storybook base
                // flatten/correct the path that FE requests e.g. /storybook/storybook/some-asset.js -> /storybook/some-asset.js
                webExchange = webExchange.mutate()
                        .request(
                                webExchange.getRequest().mutate().path(STORYBOOK_PATH + path.replace(STORYBOOK_PATH, "")).build())
                        .build();
            }
        }

        return chain.filter(webExchange);
    }

}
