package skippy.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import skippy.pojo.UserInfo;
import skippy.service.ImgsService;
import skippy.pojo.Imgs;
import skippy.pojo.Result;

import java.util.List;

@RestController
public class ImgsController {
    @Autowired
    private ImgsService imgsService;

    @PostMapping("/ImgsHistory")
    public Result list(@RequestBody UserInfo userInfo){
        System.out.println("历史生成记录");
        List<Imgs>imgelist  =imgsService.findAll(userInfo);
        return Result.success(imgelist);
    }
    @RequestMapping("/homePage")
    public Result homePage(){
        System.out.println("首页图片");
        List<Imgs>imgelist  =imgsService.homePage();
        return Result.success(imgelist);
    }
}
