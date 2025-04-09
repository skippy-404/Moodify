package skippy.service;

import skippy.pojo.Imgs;
import skippy.pojo.UserInfo;

import java.util.List;

public interface ImgsService {
    //查询所有的历史照片
    List<Imgs>findAll(UserInfo userInfo);
    List<Imgs>homePage();
}
