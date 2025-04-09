package skippy.interceptor;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;
import skippy.Utils.JwtUtils;

@Slf4j
@Component
public class TokenInterceptor implements HandlerInterceptor {
    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
         String requestURI = request.getRequestURI(); //获取请求路径
        if(requestURI.contains("/login")){
            log.info("登陆请求放行");
            return true;
        }
        String token = request.getHeader("token");
        if(token == null|| token.isEmpty()){
            response.setStatus(401);
            return false;
        }
        try {
            JwtUtils.parseToken(token);
            log.info("token验证通过");
            return true;
        }catch (Exception e){
            log.info("token验证失败");
            response.setStatus(401);
            return false;
        }
    }
}
