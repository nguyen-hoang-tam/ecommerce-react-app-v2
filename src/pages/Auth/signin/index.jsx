import React, { useState } from 'react';
import { Button, Form, Input, Typography, Divider, message, Spin } from 'antd';
import { GoogleOutlined } from '@ant-design/icons';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { Link , useNavigate} from 'react-router-dom';
import imgBg from '@/assets/img_bg.png';
import { useDispatch } from 'react-redux';
import { loginAPI, getUserProfile, loginWithGoogleAPI} from '@/features/auth/authAPI';
import { authStart, authSuccess, authFailure, setProfile } from '../../../features/auth/authSlice' 

function Signin() {
    const [form] = Form.useForm();
    const dispatch = useDispatch();
    const navigate = useNavigate();

  const onFinish = async (values) => {
      dispatch(authStart());
      try {
    const { user, token } = await loginAPI(
      values.email,
      values.password,
    );

      const profile = await getUserProfile(user.uid);
      console.log (profile)

    dispatch(authSuccess({ user, token }));
    dispatch(setProfile(profile));

    message.success('Đăng nhập thành công!');
    navigate('/home');
  } catch (error) {
    dispatch(authFailure(error.message));
    message.error(error.message || 'Đăng nhập thất bại!');
  }
  }; 

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  const handleGoogleLogin = async () => {
  dispatch(authStart());

  try {
    const { user, token } = await loginWithGoogleAPI();
    const profile = await getUserProfile(user.uid);

    dispatch(authSuccess({ user, token }));
    dispatch(setProfile(profile));

    message.success('Đăng nhập Google thành công!');
    navigate('/home');
  } catch (error) {
    dispatch(authFailure(error.message));

    if (error.code === 'auth/popup-closed-by-user') {
      message.warning('Bạn đã đóng cửa sổ đăng nhập.');
    } else if (error.code === 'auth/popup-blocked') {
      message.error('Popup bị chặn. Vui lòng cho phép popup!');
    } else if (error.code === 'auth/cancelled-popup-request') {
    } else {
      message.error('Đăng nhập Google thất bại!');
    }
  }
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
          Đăng Nhập
        </Typography.Title>

        <Form
          form={form}
          name="login"
          layout="vertical"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
        >
          <Form.Item
            name="email"
            label="Email / SĐT"
            rules={[
              { required: true, message: 'Vui lòng nhập email hoặc số điện thoại!' },
            ]}
          >
            <Input prefix={<UserOutlined />} placeholder="Nhập email hoặc số điện thoại" size="large" />
          </Form.Item>

          <Form.Item
            name="password"
            label="Mật khẩu"
            rules={[
              { required: true, message: 'Vui lòng nhập mật khẩu!' },
            ]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Nhập mật khẩu" size="large" />
          </Form.Item>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
            <Link to="/forgot-password" style={{ fontSize: 14 }}>
              Quên mật khẩu?
            </Link>
          </div>

          <Form.Item style={{ marginBottom: 16 }}>
            <Button type="primary" htmlType="submit" size="large" block>
              Đăng Nhập
            </Button>
          </Form.Item>

          <Divider plain style={{ color: '#999', fontSize: 13 }}>
            Hoặc
          </Divider>

          <Form.Item style={{ marginBottom: 16 }}>
            <Button
              size="large"
              block
              icon={<GoogleOutlined />}
              style={{ borderColor: '#dadce0', color: '#5f6368' }}
              onClick={ handleGoogleLogin}
            >
              Đăng nhập SSO với Google
            </Button>
          </Form.Item>

          <div style={{ textAlign: 'center' }}>
            <Typography.Text type="secondary">
              Chưa có tài khoản?{' '}
              <Link to="/register" style={{ fontWeight: 600, color: '#1677ff' }}>
                Đăng ký ngay
              </Link>
            </Typography.Text>
          </div>
        </Form>
      </div>
    </div>
  );
}

export default Signin;