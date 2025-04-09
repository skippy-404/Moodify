package skippy.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import skippy.pojo.Result;
import skippy.pojo.UserInfo;
import skippy.service.UserRegisterService;

@RestController
public class RegisterController {
    @Autowired
    private UserRegisterService userRegisterService;
    @PostMapping("/register")
    public Result register(@RequestBody UserInfo userInfo) {
        try {
            userRegisterService.register(userInfo);
            return Result.success();
        } catch (RuntimeException e) {
            return Result.error("error");
        }
    }
}
