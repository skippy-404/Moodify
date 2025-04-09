package skippy.pojo;


import lombok.Data;


@Data
public class Result {
    private Integer code; //状态码
    private String msg; //提示信息
    private Object data; //返回数据
    public static Result success(){
        Result result = new Result();
        result.code=1;
        result.msg="操作成功";
        return result;
    }
    public static Result success(Object object){
        Result result = new Result();
        result.code=1;
        result.msg="操作成功";
        result.data=object;
        return result;
    }

    public static Result error(){
        Result result = new Result();
        result.code=0;
        result.msg="操作失败";
        return result;
    }
    public static Result error(String msg){
        Result result = new Result();
        result.code=0;
        result.msg=msg;
        return result;
    }
}
