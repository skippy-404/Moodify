package skippy.mapper;

import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;
import skippy.pojo.UserInfo;


@Mapper
public interface UserInfoMapper {
    @Select("SELECT id, username, password FROM userInfo WHERE username = #{username} AND password = #{password}")
    UserInfo selectUserByNameAndPassword(UserInfo userInfo);
    @Insert("INSERT INTO userInfo(email, username, password) VALUES (#{email}, #{username}, #{password})")
    void insertUser(UserInfo userInfo);
    @Select("SELECT id, username, password FROM userInfo WHERE username = #{username}")
    UserInfo selectUserByName(UserInfo userInfo);

}
