package skippy.Utils;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import java.util.Date;
import java.util.Map;

/**
 * JWT令牌工具类
 */
public class JwtUtils {
    // 使用与测试类相同的密钥（Base64编码后的密钥）
    private static final String SECRET_KEY = "c2tpcHB5";
    // 过期时间设置为12小时（单位：毫秒）
    private static final long EXPIRATION_TIME = 12 * 3600 * 1000;

    /**
     * 生成JWT令牌
     * @param claims 需要存储的Claims数据
     * @return 生成的JWT令牌字符串
     */
    public static String generateToken(Map<String, Object> claims) {
        return Jwts.builder()
                .signWith(SignatureAlgorithm.HS256, SECRET_KEY)
                .addClaims(claims)
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .compact();
    }

    /**
     * 解析JWT令牌
     * @param token JWT令牌字符串
     * @return 解析后的Claims对象
     */
    public static Claims parseToken(String token) {
        return Jwts.parser()
                .setSigningKey(SECRET_KEY)
                .parseClaimsJws(token)
                .getBody();
    }
}
