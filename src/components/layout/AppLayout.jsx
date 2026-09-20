import { Layout, Menu } from 'antd'
import { Link } from 'react-router-dom'

const { Header, Footer, Content } = Layout

function AppLayout({ children }) {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ display: 'flex', alignItems: 'center', padding: '0 24px', background: '#001529' }}>
        <div style={{ color: '#fff', fontSize: 18, fontWeight: 'bold', marginRight: 48 }}>
          MyApp
        </div>
        <Menu theme="dark" mode="horizontal" style={{ flex: 1, borderBottom: 'none' }}>
          <Menu.Item key="login"><Link to="/login" style={{ color: '#fff' }}>Login</Link></Menu.Item>
          <Menu.Item key="home"><Link to="/" style={{ color: '#fff' }}>Home</Link></Menu.Item>
        </Menu>
      </Header>
      <Content style={{ padding: '24px 50px' }}>
        {children}
      </Content>
      <Footer style={{ textAlign: 'center' }}>MyApp ©2026 Created with Ant Design</Footer>
    </Layout>
  )
}

export default AppLayout
