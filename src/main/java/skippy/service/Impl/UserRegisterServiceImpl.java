package skippy.service.Impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import skippy.mapper.UserInfoMapper;
import skippy.pojo.UserInfo;
import skippy.service.UserRegisterService;

@Service
public class UserRegisterServiceImpl implements UserRegisterService {
    @Autowired
    private UserInfoMapper userInfoMapper;
    @Override
    public void register(UserInfo userInfo) {
        // 创建独立参数对象
        UserInfo userParam = new UserInfo();
        userParam.setUsername(userInfo.getUsername());
        UserInfo existingUser = userInfoMapper.selectUserByName(userParam);

        if (existingUser != null) {
            throw new RuntimeException("用户名已存在");
        }
        // 补全插入操作返回值
        else userInfoMapper.insertUser(userInfo);
    }

}
