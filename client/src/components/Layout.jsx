import { useState } from 'react';
import { Layout, Menu, theme } from 'antd';
import { 
  CalendarOutlined, 
  UserOutlined, 
  CheckCircleOutlined
} from '@ant-design/icons';
import { Outlet, Link, useLocation } from 'react-router-dom';

const { Header, Content, Footer, Sider } = Layout;

const AppLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const { token } = theme.useToken();

  const getSelectedKey = () => {
    const path = location.pathname;
    if (path === '/') return ['1'];
    if (path === '/attendees') return ['2'];
    if (path === '/attendance') return ['3'];
    return ['1'];
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider 
        collapsible 
        collapsed={collapsed} 
        onCollapse={setCollapsed}
        theme="light"
        style={{
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
          zIndex: 10
        }}
      >
        <div style={{ 
          height: 32, 
          margin: 16, 
          textAlign: 'center',
          fontSize: '18px',
          fontWeight: 'bold',
          color: token.colorPrimary,
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          textOverflow: 'ellipsis'
        }}>
          {collapsed ? "AS" : "Attendance System"}
        </div>
        <Menu 
          theme="light" 
          defaultSelectedKeys={getSelectedKey()} 
          selectedKeys={getSelectedKey()}
          mode="inline"
        >
          <Menu.Item key="1" icon={<CalendarOutlined />}>
            <Link to="/">Events</Link>
          </Menu.Item>
          <Menu.Item key="2" icon={<UserOutlined />}>
            <Link to="/attendees">Attendees</Link>
          </Menu.Item>
          <Menu.Item key="3" icon={<CheckCircleOutlined />}>
            <Link to="/attendance">Attendance</Link>
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout>
        <Header style={{ 
          padding: '0 16px', 
          background: token.colorBgContainer, 
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.09)',
          position: 'relative',
          zIndex: 1
        }}>
          <div style={{ 
            color: token.colorText, 
            fontSize: '18px', 
            lineHeight: '64px',
            fontWeight: 'bold'
          }}>
            {location.pathname === '/' && 'Events Management'}
            {location.pathname === '/attendees' && 'Attendees Management'}
            {location.pathname === '/attendance' && 'Attendance Tracking'}
          </div>
        </Header>
        <Content style={{ margin: '16px', background: token.colorBgContainer }}>
          <div style={{ 
            padding: '16px', 
            minHeight: 360, 
            background: token.colorBgContainer,
            borderRadius: token.borderRadius,
          }}>
            <Outlet />
          </div>
        </Content>
        <Footer style={{ textAlign: 'center', background: token.colorBgContainer }}>
          Attendance System ©{new Date().getFullYear()} Created with Ant Design
        </Footer>
      </Layout>
    </Layout>
  );
};

export default AppLayout; 