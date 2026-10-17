import AppLayout from '../../components/layout/AppLayout';
import { CheckOutlined, ShoppingCartOutlined, ArrowRightOutlined, HeartOutlined, TruckOutlined, SafetyCertificateOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { Card, Row, Col, Typography, Button, Divider, Image } from 'antd';

const { Title, Text } = Typography;

const recommendations = [
  { id: 1, name: 'Kính mát Dior', color: 'Đen', brand: 'Dior', price: 4500000, image: 'https://picsum.photos/300/200?random=10' },
  { id: 2, name: 'Kính mát Rayban', color: 'Nâu', brand: 'Rayban', price: 3200000, image: 'https://picsum.photos/300/200?random=11' },
  { id: 3, name: 'Kính mát Gentle Monster', color: 'Đen', brand: 'Gentle Monster', price: 5800000, image: 'https://picsum.photos/300/200?random=12' },
  { id: 4, name: 'Kính mát Salinaka', color: 'Xám', brand: 'Salinaka', price: 2900000, image: 'https://picsum.photos/300/200?random=13' },
  { id: 5, name: 'Kính mát Dior', color: 'Nâu', brand: 'Dior', price: 4200000, image: 'https://picsum.photos/300/200?random=14' },
];

function AddToCartSuccess() {
    
  const product = {
    name: 'Kính mát Oakley',
    color: 'Đen',
    brand: 'Oakley',
    quantity: 1,
    price: 780000,
    image: 'https://picsum.photos/300/300?random=6',
  };

  const subtotal = product.price * product.quantity;
  const shippingFee = 0;
  const discount = 0;
  const total = subtotal + shippingFee - discount;

  return (
    <AppLayout>
      <main style={{ padding: '32px 50px', background: '#f7f8fa', minHeight: 'calc(100vh - 54px)' }}>
        <Row gutter={[20, 20]} align="top">
          <Col xs={24} lg={16}>
            <Card bordered={false} style={{ borderRadius: 12, marginBottom: 20 }} styles={{ body: { padding: 32 } }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ width: 58, height: 58, margin: '0 auto 20px', borderRadius: '50%', background: '#52c878', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 30, boxShadow: '0 0 0 10px #edf9f0' }}>
                  <CheckOutlined />
                </div>
                <Title level={2} style={{ margin: '0 0 10px', color: '#001529' }}>Đã thêm sản phẩm vào giỏ hàng!</Title>
                <Text type="secondary">Sản phẩm đã được thêm vào giỏ hàng của bạn. Bạn có thể tiếp tục mua sắm hoặc xem giỏ hàng của mình.</Text>
              </div>

              <div style={{ marginTop: 30, padding: 16, background: '#f0f6ff', borderRadius: 8, display: 'flex', alignItems: 'center', gap: 14 }}>
                <Image src={product.image} width={68} height={68} preview={false} style={{ borderRadius: 8, objectFit: 'cover' }} />
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <Text strong>{product.name}</Text>
                  <Text type="secondary" style={{ fontSize: 12 }}>Màu: {product.color}</Text>
                  <Text strong>{product.brand}</Text>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: '#fff', borderRadius: 6, padding: '5px 12px' }}>
                  <span>−</span><span>{product.quantity}</span><span>+</span>
                </div>
                <Text strong>{product.price.toLocaleString('vi-VN')}đ</Text>
              </div>

              <div style={{ display: 'flex', justifyContent: 'center', gap: 14, marginTop: 22 }}>
                <Link to="/cart">
                  <Button size="large" icon={<ShoppingCartOutlined />} style={{ minWidth: 215, height: 44, borderRadius: 8, color: '#1677ff', borderColor: '#1677ff' }}>Xem giỏ hàng</Button>
                </Link>
                <Link to="/">
                  <Button type="primary" size="large" icon={<ArrowRightOutlined />} iconPosition="end" style={{ minWidth: 215, height: 44, borderRadius: 8 }}>Tiếp tục mua sắm</Button>
                </Link>
              </div>
            </Card>

            <Card bordered={false} style={{ borderRadius: 12 }} styles={{ body: { padding: 20 } }}>
              <Title level={4} style={{ margin: '0 0 4px' }}>Có thể bạn sẽ thích</Title>
              <Text type="secondary">Những sản phẩm được đề xuất dựa trên nhu cầu của bạn.</Text>

              <Row gutter={[12, 12]} style={{ marginTop: 18 }}>
                {recommendations.map((item) => (
                  <Col xs={12} sm={8} md={6} lg={24 / 5} key={item.id}>
                    <Card bordered style={{ borderRadius: 8, height: '100%' }} styles={{ body: { padding: 10 } }}>
                      <div style={{ position: 'relative' }}>
                        <Image src={item.image} preview={false} width="100%" height={105} style={{ borderRadius: 6, objectFit: 'cover' }} />
                        <HeartOutlined style={{ position: 'absolute', right: 8, top: 8, padding: 6, background: '#fff', borderRadius: '50%', color: '#64748b' }} />
                      </div>
                      <div style={{ marginTop: 8 }}>
                        <Text strong style={{ display: 'block', fontSize: 12 }}>{item.name}</Text>
                        <Text type="secondary" style={{ display: 'block', fontSize: 11, marginTop: 4 }}>Màu: {item.color}</Text>
                        <Text type="secondary" style={{ display: 'block', fontSize: 11, marginTop: 2 }}>{item.brand}</Text>
                        <Text strong style={{ display: 'block', color: '#1677ff', marginTop: 10 }}>{item.price.toLocaleString('vi-VN')}đ</Text>
                        <Button type="primary" block icon={<ShoppingCartOutlined />} style={{ marginTop: 10, height: 32, borderRadius: 6, fontSize: 11 }}>Thêm vào giỏ</Button>
                      </div>
                    </Card>
                  </Col>
                ))}
              </Row>
            </Card>
          </Col>

          <Col xs={24} lg={8}>
            <Card bordered={false} style={{ borderRadius: 12, position: 'sticky', top: 24 }} styles={{ body: { padding: 24 } }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <Title level={5} style={{ margin: 0 }}>Thông tin đơn hàng</Title>
                <Text type="secondary">1 sản phẩm</Text>
              </div>

              <div style={{ display: 'flex', gap: 12, paddingBottom: 16, borderBottom: '1px solid #f0f0f0' }}>
                <Image src={product.image} width={64} height={64} preview={false} style={{ borderRadius: 8, objectFit: 'cover' }} />
                <div style={{ flex: 1 }}>
                  <div>{product.name}</div>
                  <Text type="secondary" style={{ fontSize: 12 }}>Màu: {product.color}</Text>
                  <Text strong style={{ display: 'block', marginTop: 4 }}>{product.brand}</Text>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div>{product.quantity}</div>
                  <Text strong style={{ display: 'block', marginTop: 8 }}>{subtotal.toLocaleString('vi-VN')}đ</Text>
                </div>
              </div>

              <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><Text type="secondary">Tạm tính</Text><Text>{subtotal.toLocaleString('vi-VN')}đ</Text></div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><Text type="secondary">Phí vận chuyển</Text><Text style={{ color: '#52c41a' }}>Miễn phí</Text></div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><Text type="secondary">Giảm giá</Text><Text>{discount.toLocaleString('vi-VN')}đ</Text></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 20 }}><Text type="secondary">Phương thức giao hàng</Text><Text style={{ textAlign: 'right' }}>Thanh toán khi nhận hàng</Text></div>
              </div>

              <Divider style={{ margin: '16px 0' }} />

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Title level={5} style={{ margin: 0 }}>Tổng cộng</Title>
                <span style={{ fontSize: 22, fontWeight: 700, color: '#001529' }}>{total.toLocaleString('vi-VN')}đ</span>
              </div>

              <div style={{ marginTop: 18, padding: 13, background: '#f0f6ff', borderRadius: 8, display: 'flex', alignItems: 'center', gap: 12 }}>
                <TruckOutlined style={{ color: '#1677ff', fontSize: 20 }} />
                <div>
                  <div style={{ fontWeight: 600, color: '#315a88', fontSize: 13 }}>Thời gian giao hàng dự kiến</div>
                  <div style={{ color: '#7187a0', fontSize: 12 }}>2 - 5 ngày làm việc</div>
                </div>
              </div>

              <div style={{ marginTop: 12, padding: 13, background: '#f5f9ff', borderRadius: 8, display: 'flex', alignItems: 'center', gap: 12 }}>
                <SafetyCertificateOutlined style={{ color: '#1677ff', fontSize: 20 }} />
                <div>
                  <div style={{ fontWeight: 600, fontSize: 13 }}>Thanh toán an toàn</div>
                  <div style={{ color: '#888', fontSize: 12 }}>Chúng tôi cam kết bảo mật thông tin thanh toán của bạn.</div>
                </div>
              </div>
            </Card>
          </Col>
        </Row>

        <div style={{ textAlign: 'center', paddingTop: 55, color: '#607286', fontSize: 12 }}>
          MyApp ©2026 Created with Ant Design
        </div>
      </main>
    </AppLayout>
  );
}

export default AddToCartSuccess;