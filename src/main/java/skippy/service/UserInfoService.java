package skippy.service;
import skippy.pojo.LoginInfo;
import skippy.pojo.UserInfo;

public interface UserInfoService {
    //用户登陆
    LoginInfo login(UserInfo userInfo);

}
