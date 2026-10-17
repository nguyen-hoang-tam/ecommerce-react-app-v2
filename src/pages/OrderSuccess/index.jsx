import React from 'react';
import AppLayout from '../../components/layout/AppLayout';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import {
  CheckOutlined,
  HomeOutlined,
  FileTextOutlined,
  UserOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  CreditCardOutlined,
  TruckOutlined,
  ClockCircleOutlined,
  ShoppingOutlined,
} from '@ant-design/icons';
import { Card, Row, Col, Typography, Button, Divider, Image, Result } from 'antd';

const { Title, Text } = Typography;

function OrderSuccess() {
  const navigate = useNavigate();
  const location = useLocation();

  const orderData = location.state?.orderData;

  if (!orderData) {
    return (
      <AppLayout>
        <div style={{ padding: 50, display: 'flex', justifyContent: 'center' }}>
          <Result
            status="warning"
            title="Không tìm thấy thông tin đơn hàng"
            subTitle="Có thể bạn đã tải lại trang. Vui lòng kiểm tra lại trong mục Lịch sử đơn hàng."
            extra={<Button type="primary" onClick={() => navigate('/')}>Về trang chủ</Button>}
          />
        </div>
      </AppLayout>
    );
  }

  const firstItem = orderData.items[0];
  const subtotal = firstItem.price * firstItem.quantity;
  const orderDate = new Date(orderData.createdAt).toLocaleString('vi-VN');

  return (
    <AppLayout>
      <main style={{ padding: '40px 50px', background: '#f7f8fa', minHeight: 'calc(100vh - 54px)' }}>
        <Row gutter={[20, 20]} align="top">
          <Col xs={24} lg={16}>
            <Card bordered={false} style={{ borderRadius: 12, marginBottom: 20 }} styles={{ body: { padding: 32 } }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ width: 58, height: 58, margin: '0 auto 20px', borderRadius: '50%', background: '#52c878', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 30, boxShadow: '0 0 0 10px #edf9f0' }}>
                  <CheckOutlined />
                </div>
                <Title level={2} style={{ margin: '0 0 10px', color: '#001529' }}>Đặt hàng thành công!</Title>
                <Text type="secondary" style={{ display: 'block', maxWidth: 620, margin: '0 auto', lineHeight: 1.7 }}>
                  Cảm ơn bạn đã mua sắm tại MyApp. Đơn hàng của bạn đã được ghi nhận và đang được xử lý. Chúng tôi sẽ liên hệ với bạn sớm nhất.
                </Text>
              </div>

              <div style={{ marginTop: 30, padding: 16, background: '#f0f6ff', borderRadius: 8, display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ width: 42, height: 42, borderRadius: '50%', background: '#e3efff', color: '#1677ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 19 }}>
                  <ShoppingOutlined />
                </div>
                <div>
                  <Text type="secondary" style={{ display: 'block', fontSize: 12 }}>Mã đơn hàng</Text>
                  <Text strong style={{ color: '#1677ff', fontSize: 18 }}>#{orderData.orderId}</Text>
                </div>
                <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <ClockCircleOutlined style={{ color: '#1677ff' }} />
                  <div>
                    <Text type="secondary" style={{ display: 'block', fontSize: 12 }}>Thời gian đặt hàng</Text>
                    <Text>{orderDate}</Text>
                  </div>
                </div>
              </div>
            </Card>

            <Card bordered={false} style={{ borderRadius: 12, marginBottom: 20 }} styles={{ body: { padding: 24 } }}>
              <Title level={4} style={{ margin: '0 0 24px' }}>Thông tin giao hàng</Title>
              <Row gutter={[32, 24]}>
                <Col xs={24} md={13}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
                    <div style={{ display: 'flex', gap: 14 }}>
                      <span style={{ width: 38, height: 38, flexShrink: 0, borderRadius: '50%', background: '#f5f8fc', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#52677d' }}><UserOutlined /></span>
                      <div><Text type="secondary" style={{ display: 'block', fontSize: 12 }}>Người nhận</Text><Text>{orderData.shippingAddress.name}</Text></div>
                    </div>
                    <div style={{ display: 'flex', gap: 14 }}>
                      <span style={{ width: 38, height: 38, flexShrink: 0, borderRadius: '50%', background: '#f5f8fc', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#52677d' }}><PhoneOutlined /></span>
                      <div><Text type="secondary" style={{ display: 'block', fontSize: 12 }}>Số điện thoại</Text><Text>{orderData.shippingAddress.phone}</Text></div>
                    </div>
                    <div style={{ display: 'flex', gap: 14 }}>
                      <span style={{ width: 38, height: 38, flexShrink: 0, borderRadius: '50%', background: '#f5f8fc', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#52677d' }}><EnvironmentOutlined /></span>
                      <div><Text type="secondary" style={{ display: 'block', fontSize: 12 }}>Địa chỉ nhận hàng</Text><Text>{orderData.shippingAddress.address}</Text></div>
                    </div>
                  </div>
                </Col>

                <Col xs={24} md={11}>
                  <div style={{ height: '100%', paddingLeft: 26, borderLeft: '1px solid #e7ebf0' }}>
                    <div style={{ display: 'flex', gap: 14 }}>
                      <span style={{ width: 38, height: 38, flexShrink: 0, borderRadius: '50%', background: '#f5f8fc', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#52677d' }}><CreditCardOutlined /></span>
                      <div><Text type="secondary" style={{ display: 'block', fontSize: 12 }}>Phương thức thanh toán</Text><Text>{orderData.paymentMethod}</Text></div>
                    </div>
                    <div style={{ marginTop: 22, padding: 12, background: '#f0f6ff', borderRadius: 8, display: 'flex', alignItems: 'center', gap: 10, color: '#4773a6', fontSize: 12 }}>
                      <CreditCardOutlined /> Vui lòng chuẩn bị tiền mặt khi nhận hàng.
                    </div>
                  </div>
                </Col>
              </Row>
            </Card>

            <div style={{ display: 'flex', gap: 14 }}>
              <Button onClick={() => navigate('/home')} type="primary" size="large" icon={<HomeOutlined />} style={{ minWidth: 220, height: 44, borderRadius: 8 }}>
                Tiếp tục mua sắm
              </Button>
              <Link to={`/orders/${orderData.orderId}`}>
                <Button size="large" icon={<FileTextOutlined />} style={{ minWidth: 170, height: 44, borderRadius: 8 }}>
                  Xem đơn hàng
                </Button>
              </Link>
            </div>
          </Col>

          <Col xs={24} lg={8}>
            <Card bordered={false} style={{ borderRadius: 12, position: 'sticky', top: 24 }} styles={{ body: { padding: 24 } }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <Title level={5} style={{ margin: 0 }}>Thông tin đơn hàng</Title>
                <Text type="secondary">{firstItem.quantity} sản phẩm</Text>
              </div>

              <div style={{ display: 'flex', gap: 12, paddingBottom: 16, borderBottom: '1px solid #f0f0f0' }}>
                <Image src={firstItem.image} width={68} height={68} preview={false} style={{ borderRadius: 8, objectFit: 'cover' }} />
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 5 }}>
                  <Text strong>{firstItem.name}</Text>
                  <Text strong>{firstItem.brand}</Text>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <Text>x{firstItem.quantity}</Text>
                  <Text strong style={{ display: 'block', marginTop: 8 }}>{firstItem.price.toLocaleString('vi-VN')}đ</Text>
                </div>
              </div>

              <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Text type="secondary">Tạm tính</Text>
                  <Text>{subtotal.toLocaleString('vi-VN')}đ</Text>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Text type="secondary">Phí vận chuyển</Text>
                  <Text style={{ color: '#52c41a' }}>{orderData.shippingFee === 0 ? 'Miễn phí' : `${orderData.shippingFee.toLocaleString('vi-VN')}đ`}</Text>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Text type="secondary">Giảm giá</Text>
                  <Text style={{ color: orderData.discount > 0 ? '#52c41a' : '#111' }}>
                    {orderData.discount > 0 ? `- ${orderData.discount.toLocaleString('vi-VN')}đ` : '- 0đ'}
                  </Text>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 20 }}>
                  <Text type="secondary">Phương thức giao hàng</Text>
                  <Text style={{ textAlign: 'right' }}>Giao hàng tiêu chuẩn</Text>
                </div>
              </div>

              <Divider style={{ margin: '16px 0' }} />

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Title level={5} style={{ margin: 0 }}>Tổng cộng</Title>
                <span style={{ fontSize: 22, fontWeight: 700, color: '#001529' }}>
                  {orderData.total.toLocaleString('vi-VN')}đ
                </span>
              </div>

              <div style={{ marginTop: 20, padding: 14, background: '#f0f6ff', borderRadius: 8, display: 'flex', alignItems: 'center', gap: 12 }}>
                <TruckOutlined style={{ color: '#1677ff', fontSize: 20 }} />
                <div>
                  <div style={{ fontWeight: 600, color: '#315a88', fontSize: 13 }}>Thời gian giao hàng dự kiến</div>
                  <div style={{ color: '#7187a0', fontSize: 12 }}>2 - 5 ngày làm việc</div>
                </div>
              </div>
            </Card>
          </Col>
        </Row>

        <div style={{ textAlign: 'center', paddingTop: 70, color: '#607286', fontSize: 12 }}>
          MyApp ©2026 Created with Ant Design
        </div>
      </main>
    </AppLayout>
  );
}

export default OrderSuccess;