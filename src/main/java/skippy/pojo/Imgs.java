package skippy.pojo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Imgs {
    private Integer id;
    private String username;
    private String url;
    private LocalDateTime create_time;
    private LocalDateTime update_time;
}
