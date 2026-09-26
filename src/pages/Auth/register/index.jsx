import React from 'react';
import { Button, Form, Input, Typography, message } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import imgBg from '@/assets/img_bg.png';
import { registerAPI, getUserProfile } from '@/features/auth/authAPI';
import { useDispatch } from 'react-redux';
import { authStart, authSuccess, authFailure, setProfile } from '../../../features/auth/authSlice' 

function Register() {
    const [form] = Form.useForm();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const onFinish = async (values) => {
      dispatch(authStart());
      try {
    const { user, token } = await registerAPI(
      values.email,
      values.password,
      values.fullName
    );

    const profile = await getUserProfile(user.uid);

    dispatch(authSuccess({ user, token }));
    dispatch(setProfile(profile));

    message.success('Đăng ký thành công!');
    navigate('/login');
  } catch (error) {
    dispatch(authFailure(error.message));
    message.error(error.message || 'Đăng ký thất bại!');
  }
  }; 

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundImage: `url(${imgBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div
        style={{
          background: 'rgba(255,255,255,0.92)',
          padding: 40,
          borderRadius: 12,
          boxShadow: '0 2px 12px rgba(0,0,0,0.12)',
          width: 400,
        }}
      >
        <Typography.Title level={3} style={{ textAlign: 'center', marginBottom: 24 }}>
          Đăng Ký
        </Typography.Title>

        <Form
          form={form}
          name="register"
          layout="vertical"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
        >
          <Form.Item
            name="fullName"
            label="Họ và tên"
            rules={[
              { required: true, message: 'Vui lòng nhập họ và tên!' },
            ]}
          >
            <Input prefix={<UserOutlined />} placeholder="Nhập họ và tên" size="large" />
          </Form.Item>

          <Form.Item
            name="email"
            label="Nhập Email"
            rules={[
              { required: true, message: 'Vui lòng nhập Email!' },
            ]}
          >
            <Input prefix={<MailOutlined />} placeholder="Nhập Email" size="large" />
          </Form.Item>

          <Form.Item
            name="password"
            label="Mật khẩu"
            rules={[
              { required: true, message: 'Vui lòng nhập mật khẩu!' },
              { min: 6, message: 'Mật khẩu tối thiểu 6 ký tự!' },
            ]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Nhập mật khẩu" size="large" />
          </Form.Item>

          <Form.Item style={{ marginBottom: 16 }}>
            <Button type="primary" htmlType="submit" size="large" block>
              Đăng Ký
            </Button>
          </Form.Item>

          <div style={{ textAlign: 'center' }}>
            <Typography.Text type="secondary">
              Đã có tài khoản?{' '}
              <Link to="/login" style={{ fontWeight: 600, color: '#1677ff' }}>
                Đăng nhập ngay
              </Link>
            </Typography.Text>
          </div>
        </Form>
      </div>
    </div>
  );
}

export default Register;
