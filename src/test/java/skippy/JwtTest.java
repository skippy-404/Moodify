package skippy;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.junit.jupiter.api.Test;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

public class JwtTest {
    @Test
    public void testGenerateJwt(){
        Map<String,Object>dataMAp= new HashMap<>();
        dataMAp.put("id","1");
        dataMAp.put("username","skippy");
        String jwt=Jwts.builder()
                .signWith(SignatureAlgorithm.HS256,"c2tpcHB5")//基于base64编码后的密钥
                .addClaims(dataMAp)
                .setExpiration(new Date(System.currentTimeMillis()+3600*1000))//设置过期时间一个小时
                .compact();
        System.out.println(jwt);
    }
    @Test
    public void testParseJwt(){
        String token="eyJhbGciOiJIUzI1NiJ9.eyJpZCI6IjEiLCJ1c2VybmFtZSI6InNraXBweSIsImV4cCI6MTc0MzY2ODkwMH0.fpKlsj7ItHcWbfQ_P21EASTw7J24-fY9Fffp3_41Llw";
        Claims claims= Jwts.parser()
                .setSigningKey("c2tpcHB5")
                .parseClaimsJws(token)
                .getBody(); //解析出jwt中的数据
        System.out.println(claims);
    }
}
