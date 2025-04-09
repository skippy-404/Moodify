package skippy.config;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import skippy.interceptor.DemoInterceptor;
import skippy.interceptor.TokenInterceptor;

@Slf4j
@Configuration //封装了 Component
public class WebConfig implements WebMvcConfigurer {
    @Autowired
    private DemoInterceptor demoInterceptor;
    @Autowired
    private TokenInterceptor tokenInterceptor;

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(tokenInterceptor)
                .addPathPatterns("/**")
                .excludePathPatterns("/login")
                .excludePathPatterns("/register")
                .excludePathPatterns("/homePage")
                .excludePathPatterns("/ImgsHistory");
//                .excludePathPatterns("/ImgsHistory/*")
//                .excludePathPatterns("/ImgsHistory/*/*")
//                .excludePathPatterns("/ImgsHistory/*/*/*");
    }
        @Override
        public void addCorsMappings(CorsRegistry registry) {
            registry.addMapping("/**")
                    .allowedOrigins("*")     // 允许所有来源（生产环境应指定具体域名）
                    .allowedMethods("*")     // 允许所有 HTTP 方法
                    .allowedHeaders("*");    // 允许所有请求头
        }
}

