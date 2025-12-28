package com.example.demo.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtDecoderFactory;
import org.springframework.security.oauth2.jwt.JwtException;
import org.springframework.security.oauth2.jwt.JwtValidators;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.List;

@Configuration
public class SecurityConfig {
    
    @Value("${spring.security.oauth2.resourceserver.jwt.jwk-set-uri}")
    private String jwkSetUri;
    
    @Value("${spring.security.oauth2.resourceserver.jwt.issuer-uri}")
    private String issuerUri;
    
    @Value("${supabase.jwt.secret}")
    private String jwtSecret;
    
    @Bean
    public JwtDecoder jwtDecoder() {
        System.out.println("=== CONFIGURING JWT DECODER ===");
        System.out.println("JWK Set URI: " + jwkSetUri);
        System.out.println("Issuer URI: " + issuerUri);
        
        try {
            // Create RS256 decoder for JWK set validation
            NimbusJwtDecoder rs256Decoder = NimbusJwtDecoder.withJwkSetUri(jwkSetUri).build();
            rs256Decoder.setJwtValidator(JwtValidators.createDefaultWithIssuer(issuerUri));
            
            // Create HS256 decoder using the JWT secret
            SecretKey secretKey = new SecretKeySpec(
                jwtSecret.getBytes(StandardCharsets.UTF_8),
                "HmacSHA256"
            );
            NimbusJwtDecoder hs256Decoder = NimbusJwtDecoder.withSecretKey(secretKey).build();
            hs256Decoder.setJwtValidator(JwtValidators.createDefaultWithIssuer(issuerUri));
            
            System.out.println("JWT Decoder created successfully (RS256 + HS256)");
            System.out.println("================================");
            
            // Return a decoder that tries both algorithms
            return new JwtDecoder() {
                @Override
                public Jwt decode(String token) throws JwtException {
                    // Try HS256 first (since Supabase tokens use HS256)
                    try {
                        return hs256Decoder.decode(token);
                    } catch (JwtException e1) {
                        // If HS256 fails, try RS256
                        try {
                            return rs256Decoder.decode(token);
                        } catch (JwtException e2) {
                            // If both fail, throw the HS256 error (more likely for Supabase)
                            throw e1;
                        }
                    }
                }
            };
        } catch (Exception e) {
            System.err.println("ERROR CREATING JWT DECODER: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }
    
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of("http://localhost:5173"));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source =
                new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
    
    @Bean
    public AuthenticationEntryPoint jwtAuthenticationEntryPoint() {
        return (request, response, authException) -> {
            // Log the actual error for debugging
            System.err.println("=== JWT AUTHENTICATION ERROR ===");
            System.err.println("Error: " + authException.getMessage());
            System.err.println("Class: " + authException.getClass().getName());
            authException.printStackTrace();
            System.err.println("Request URI: " + request.getRequestURI());
            System.err.println("Authorization Header: " + request.getHeader("Authorization"));
            System.err.println("=================================");
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.setContentType("application/json");
            try {
                response.getWriter().write("{\"error\":\"JWT validation failed: " + authException.getMessage() + "\"}");
            } catch (IOException e) {
                e.printStackTrace();
            }
        };
    }
    
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .cors(Customizer.withDefaults())
                .csrf(csrf -> csrf.disable())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                        .anyRequest().permitAll()
                )
                .exceptionHandling(ex -> ex
                        .authenticationEntryPoint(jwtAuthenticationEntryPoint())
                )
                .oauth2ResourceServer(oauth -> oauth
                        .jwt(jwt -> jwt.decoder(jwtDecoder()))
                );

        return http.build();
    }
}
