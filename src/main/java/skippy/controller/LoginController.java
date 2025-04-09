package skippy.controller;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import skippy.pojo.LoginInfo;
import skippy.pojo.Result;
import skippy.pojo.UserInfo;
import skippy.service.Impl.LoginInfoServiceImpl;

@Slf4j
@RestController
public class LoginController {
    @Autowired
    LoginInfoServiceImpl loginInfoService;
    @PostMapping("/login")
    public Result login(@RequestBody UserInfo userInfo) {
        log.info("login", userInfo);
        LoginInfo info = loginInfoService.login(userInfo);
        if (info != null) {
            return Result.success(info);
        }
        return Result.error("用户名或密码错误");
    }
}
