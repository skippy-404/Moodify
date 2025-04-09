package skippy.pojo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserInfo {
    private String id;
    private String username;
    private String password;
    private String email;
    private String image;//头像
}
