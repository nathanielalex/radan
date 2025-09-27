package com.example.radan_backend.security.jwt;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.security.core.GrantedAuthority;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Collection;
import java.util.Date;
import java.util.stream.Collectors;

public class JwtUtil {

    public static String generateToken(String email, String userId, Collection<? extends GrantedAuthority> authorities) {
        String roles = authorities.stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.joining(","));

        return Jwts
                .builder()
                .subject(email)
                .claim("userId", userId)
                .claim("roles", roles) // Add roles as a custom claim
                .expiration(new Date(System.currentTimeMillis() + 3_600_000)) //5min
                .signWith(getSigningKey())
                .compact();
    }

    public static Claims getClaims(String token) {
        return Jwts
                .parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    public static boolean isTokenValid(String token) {
        //validate more claims
        return !isExpired(token);
    }

    private static boolean isExpired(String token) {
        return getClaims(token)
                .getExpiration()
                .before(new Date());
    }

    public static SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(SecretKeyReader.getSecretKeyProperty().getBytes(StandardCharsets.UTF_8));
    }

}
