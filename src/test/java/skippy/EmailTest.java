package skippy;

import org.junit.jupiter.api.Test;
import org.skyscreamer.jsonassert.comparator.JSONCompareUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;

@SpringBootTest
public class EmailTest {
    @Autowired
    private JavaMailSender javaMailSender;

    private String Subject = "Moodify注册";
    private String Content = "Moodify注册,验证码为123456";
    private String to = "954693353@qq.com";
    private String from = "18609797119@163.com";

    @Test
    public void sendEmail() {
        SimpleMailMessage simpleMailMessage = new SimpleMailMessage();
        simpleMailMessage.setFrom(from);
        simpleMailMessage.setTo(to);
        simpleMailMessage.setSubject(Subject);
        simpleMailMessage.setText(Content);
        javaMailSender.send(simpleMailMessage);
        System.out.println("发送邮件");
    }
}
