import React, { useState } from "react";
import { Button, Card, Checkbox, Form, Input, message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import style from "./index.module.less";
import * as adminApi from "../../api/adminApi";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [commitLoading, setCommitLoading] = useState(false);

  async function onLogin(form: any) {
    // 登录
    try {
      setCommitLoading(true);
      const res = await adminApi.login({
        mobile: form.mobile,
        password: form.password,
      });

      localStorage.setItem("access_token", res.access_token || "");

      navigate("/", { replace: true });
    } catch (error: any) {
      message.error(`${error.response.data}`);
    } finally {
      setCommitLoading(false);
    }

    // 判断是否不需要保持登录
    if (!form.remember) {
      localStorage.removeItem("access_token");
    }
  }

  return (
    <div className={`${style.bg} ${style}`}>
      <Card
        title="登录"
        extra={<Link to="/register">注册</Link>}
        style={{ width: 400 }}
      >
        <Form
          initialValues={{ remember: true }}
          layout="vertical"
          onFinish={onLogin}
        >
          <Form.Item
            label="手机号"
            name="mobile"
            rules={[{ required: true, message: "请输入手机号" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="密码"
            name="password"
            rules={[{ required: true, message: "请输入密码" }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item name="remember" valuePropName="checked">
            <Checkbox>保持登录</Checkbox>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              loading={commitLoading}
            >
              登录
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Login;
