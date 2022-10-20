import React, { useState } from "react";
import { Button, Card, Form, Input, message } from "antd";
import { Link, useNavigate } from "react-router-dom";

import * as adminApi from "../../api/adminApi";

import style from "./index.module.less";

interface Props {}

const Register: React.FC<Props> = (...props) => {
  const navigate = useNavigate();
  const [commitLoading, setCommitLoading] = useState(false);

  async function onRegister(form: any) {
    // 注册
    try {
      setCommitLoading(true);
      await adminApi.register({
        nick_name: form.nickName,
        mobile: form.mobile,
        password: form.password,
      });
      message.success("注册成功，请登录");
      setTimeout(() => {
        navigate("/login", { replace: true });
      }, 1000);
    } catch (error: any) {
      message.error(`${error.response.data}`);
    } finally {
      setCommitLoading(false);
    }
  }

  return (
    <div className={`${style.bg} ${style}`}>
      <Card
        title="注册"
        extra={<Link to="/login">登录</Link>}
        style={{ width: 400 }}
      >
        <Form
          initialValues={{ remember: true }}
          layout="vertical"
          onFinish={onRegister}
        >
          <Form.Item label="昵称" name="nickName">
            <Input />
          </Form.Item>

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

          <Form.Item
            label="确认密码"
            name="passwordAgain"
            validateStatus="error"
            rules={[
              { required: true, message: "请输入密码" },
              (formInstance) => ({
                async validator(_item, value) {
                  const password = formInstance.getFieldValue("password");
                  const passwordAgain = value;
                  if (password === passwordAgain) {
                    return Promise.resolve();
                  } else {
                    return Promise.reject("两次输入的密码不一致");
                  }
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              loading={commitLoading}
            >
              注册
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Register;
