import { useState } from 'react';
import { Layout, Menu, Button, Space, message, Input } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { UserOutlined, LogoutOutlined, ShoppingCartOutlined, HomeOutlined, DeleteOutlined } from '@ant-design/icons';
import { doc, deleteDoc } from 'firebase/firestore'; 
import { deleteUser } from 'firebase/auth'; 
import ConfirmModal from '../modal/ConfirmModal'
import { logoutAPI } from '../../features/auth/authAPI';
import { authLogout } from '../../features/auth/authSlice';
import { clearCart } from '../../features/cartSlice';
import { auth, db } from '@/lib/firebase';

const { Header, Footer, Content } = Layout;
const { Search } = Input;

function AppLayout({ children }) {
  const { profile } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    if (value.trim()) {
      navigate(`/home?q=${encodeURIComponent(value.trim())}`);
    } else {
      navigate('/home'); 
    }
  };

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

  const deleteAccountAPI = async () => {
    const user = auth.currentUser;
    if (!user) throw new Error('Không tìm thấy người dùng hiện tại.');
    await deleteDoc(doc(db, 'users', user.uid));
    await deleteUser(user);
  };

  const handleDelete = async () => {
    try {
      setLoading(true);
      await deleteAccountAPI();
      dispatch(authLogout());
      dispatch(clearCart());
      setOpen(false);
      message.success('Xóa tài khoản thành công!');
      navigate('/login');
    } catch (error) {
      setOpen(false);
      console.error(error);
      message.error(error.code === 'auth/requires-recent-login' ? 'Vui lòng đăng nhập lại để xác nhận xóa tài khoản.' : 'Có lỗi xảy ra khi xóa tài khoản!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ display: 'flex', alignItems: 'center', padding: '0 24px', background: '#001529' }}>
        
        <div style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
          <Link to="/home" style={{ color: '#fff', fontSize: 20, fontWeight: 'bold', marginRight: 40, textDecoration: 'none' }}>MyApp</Link>
          <Menu theme="dark" mode="horizontal" style={{ flex: 1, borderBottom: 'none', minWidth: 0 }} selectedKeys={[]}>
            <Menu.Item key="home" icon={<HomeOutlined />}><Link to="/home">Home</Link></Menu.Item>
            <Menu.Item key="cart" icon={<ShoppingCartOutlined />}><Link to="/shoppingcart">Shopping Cart</Link></Menu.Item>
          </Menu>
        </div>

        <div style={{ maxWidth: 600, margin: '0 auto', marginRight: '12px' }}>
          <Search
            onChange={handleInputChange}
            placeholder="Tìm kiếm sản phẩm (UI)..."
            size="medium" 
            value={searchTerm}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center' }}>
          {profile ? (
            <Space size="middle">
              <Button type="primary" danger icon={<LogoutOutlined />} onClick={handleLogout}>Logout</Button>
              <Button danger icon={<DeleteOutlined />} onClick={() => setOpen(true)}>Xóa tài khoản</Button>
            </Space>
          ) : (
            <Link to="/login"><Button type="primary" icon={<UserOutlined />}>Login</Button></Link>
          )}
        </div>
      </Header>

      <Content style={{ padding: '24px 50px' }}>{children}</Content>

      <ConfirmModal
        open={open}
        title="Xác nhận xóa tài khoản"
        content="Bạn có chắc chắn muốn xóa tài khoản này không? Hành động này không thể hoàn tác."
        okText="Xóa tài khoản"
        cancelText="Hủy"
        type="danger"
        loading={loading}
        onConfirm={handleDelete}
        onCancel={() => setOpen(false)}
      />

      <Footer style={{ textAlign: 'center' }}>MyApp ©2026 Created with Ant Design</Footer>
    </Layout>
  );
}

export default AppLayout;