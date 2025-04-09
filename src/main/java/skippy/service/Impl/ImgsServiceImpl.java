package skippy.service.Impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import skippy.mapper.ImgsMapper;
import skippy.pojo.Imgs;
import skippy.pojo.UserInfo;
import skippy.service.ImgsService;

import java.util.List;

@Service
public class ImgsServiceImpl implements ImgsService {
    @Autowired
    private ImgsMapper imgsMapper;
    @Override
    public List<Imgs> findAll(UserInfo userInfo) {
        return imgsMapper.findAll(userInfo);
    }
    @Override
    public List<Imgs> homePage() {
        return imgsMapper.homePage();
    }
}
