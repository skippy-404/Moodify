package skippy.mapper;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;
import skippy.pojo.Imgs;
import skippy.pojo.UserInfo;

import java.util.List;

@Mapper
public interface ImgsMapper {
    //test need fit
    @Select("select url from publicImgs where username =#{username}")
    List<Imgs>findAll(UserInfo userinfo);
    //只拿三个图片
    @Select("select url,username from publicImgs where username = 'skippy' order by stars desc limit 3")
    List<Imgs>homePage();
}
