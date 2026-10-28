import { Layout, Menu, Button, Space, message } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { UserOutlined, LogoutOutlined, ShoppingCartOutlined, HomeOutlined } from '@ant-design/icons';
import { logoutAPI } from '../../features/auth/authAPI';
import { authLogout } from '../../features/auth/authSlice';
import { clearCart } from '../../features/cartSlice';

const { Header, Footer, Content } = Layout;

function AppLayout({ children }) {
  const { profile } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logoutAPI();
      dispatch(authLogout()); 
      dispatch(clearCart()); 
      message.success('Đăng xuất thành công!');
      navigate('/login');
    } catch (error) {
      message.error('Có lỗi xảy ra khi đăng xuất!');
    }
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ display: 'flex', alignItems: 'center', padding: '0 24px', background: '#001529' }}>
        
        <div style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
          <Link to="/home" style={{ color: '#fff', fontSize: 20, fontWeight: 'bold', marginRight: 40, textDecoration: 'none' }}>
            MyApp
          </Link>
          <Menu theme="dark" mode="horizontal" style={{ flex: 1, borderBottom: 'none', minWidth: 0 }} selectedKeys={[]}>
            <Menu.Item key="home" icon={<HomeOutlined />}>
              <Link to="/home">Home</Link>
            </Menu.Item>
            <Menu.Item key="cart" icon={<ShoppingCartOutlined />}>
              <Link to="/shoppingcart">Shopping Cart</Link>
            </Menu.Item>
          </Menu>
        </div>

        <div style={{ display: 'flex', alignItems: 'center' }}>
          {profile ? (
            <Space size="middle">
              <Button 
                type="primary" 
                danger 
                icon={<LogoutOutlined />} 
                onClick={handleLogout}
              >
                Logout
              </Button>
            </Space>
          ) : (
            <Link to="/login">
              <Button type="primary" icon={<UserOutlined />}>Login</Button>
            </Link>
          )}
        </div>

      </Header>
      
      <Content style={{ padding: '24px 50px' }}>
        {children}
      </Content>
      
      <Footer style={{ textAlign: 'center' }}>
        MyApp ©2026 Created with Ant Design
      </Footer>
    </Layout>
  );
}

export default AppLayout;