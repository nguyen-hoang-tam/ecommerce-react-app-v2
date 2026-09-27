import AppLayout from '../../components/layout/AppLayout';
import { Card, Checkbox, Row, Col, Typography, Button, Image, Breadcrumb, Spin, Input } from 'antd';
import { ShopOutlined, DeleteOutlined, MinusOutlined, PlusOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { Link, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { fetchProductById } from '@/features/product/productSlice';

const { Text } = Typography;

function Payment() {
  const dispatch = useDispatch();
  const { id } = useParams();
  const { currentProduct: product, isLoading, error } = useSelector((state) => state.products);
  const [quantity, setQuantity] = useState(1);
  const [selected, setSelected] = useState(true);
  const [voucher, setVoucher] = useState('');

  useEffect(() => {
    dispatch(fetchProductById(id));
  }, [dispatch, id]);

  if (error) return <p>Lỗi: {error}</p>;

  if (isLoading || !product) {
    return <AppLayout><div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}><Spin size="large" /></div></AppLayout>;
  }

  const price = product.price || 0;
  const subtotal = price * quantity;
  const shippingFee = 30000;
  const total = subtotal + shippingFee;
  const formatPrice = (value) => `${value.toLocaleString('vi-VN')}đ`;

  return (
    <AppLayout>
      <main style={{ padding: '24px 50px 100px', background: '#f5f5f5', minHeight: 'calc(100vh - 64px)' }}>
        <Breadcrumb style={{ marginBottom: 16 }}>
          <Breadcrumb.Item><Link to="/home">Trang chủ</Link></Breadcrumb.Item>
          <Breadcrumb.Item>Thanh toán</Breadcrumb.Item>
        </Breadcrumb>

        <div style={{ background: '#fff', borderRadius: 8, padding: '18px 24px', marginBottom: 16 }}>
          <Row align="middle">
            <Col span={2}><Checkbox checked={selected} onChange={(e) => setSelected(e.target.checked)} /></Col>
            <Col span={8}><Text strong style={{ fontSize: 16 }}>Sản phẩm</Text></Col>
            <Col span={4} style={{ textAlign: 'center' }}><Text type="secondary">Đơn giá</Text></Col>
            <Col span={3} style={{ textAlign: 'center' }}><Text type="secondary">Số lượng</Text></Col>
            <Col span={4} style={{ textAlign: 'center' }}><Text type="secondary">Số tiền</Text></Col>
            <Col span={3} style={{ textAlign: 'center' }}><Text type="secondary">Thao tác</Text></Col>
          </Row>
        </div>

        <div style={{ background: '#fff', borderRadius: 8, marginBottom: 16, overflow: 'hidden' }}>
          <div style={{ padding: '18px 24px', borderBottom: '1px solid #f0f0f0' }}>
            <Row align="middle">
              <Col span={2}><Checkbox checked={selected} onChange={(e) => setSelected(e.target.checked)} /></Col>
              <Col><div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><ShopOutlined style={{ fontSize: 18 }} /><Text strong style={{ fontSize: 16 }}>{product.brand || 'MyApp Store'}</Text></div></Col>
            </Row>
          </div>

          <div style={{ padding: 24 }}>
            <Row align="middle" gutter={16}>
              <Col span={2}><Checkbox checked={selected} onChange={(e) => setSelected(e.target.checked)} /></Col>

              <Col span={8}>
                <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                  <Image src={product.image} alt={product.name} width={90} height={90} preview={false} style={{ borderRadius: 8, objectFit: 'cover', border: '1px solid #eee' }} />
                  <div>
                    <Text strong style={{ fontSize: 15, display: 'block', marginBottom: 8 }}>{product.name}</Text>
                    <Text type="secondary">{product.brand || 'Sản phẩm chính hãng'}</Text>
                  </div>
                </div>
              </Col>

              <Col span={4} style={{ textAlign: 'center' }}><Text>{formatPrice(price)}</Text></Col>

              <Col span={3}>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <Button size="small" icon={<MinusOutlined />} disabled={quantity <= 1} onClick={() => setQuantity((value) => value - 1)} />
                  <Input value={quantity} readOnly size="small" style={{ width: 42, textAlign: 'center', margin: '0 4px' }} />
                  <Button size="small" icon={<PlusOutlined />} onClick={() => setQuantity((value) => value + 1)} />
                </div>
              </Col>

              <Col span={4} style={{ textAlign: 'center' }}><Text strong style={{ fontSize: 16 }}>{formatPrice(subtotal)}</Text></Col>

              <Col span={3} style={{ textAlign: 'center' }}><Button type="text" danger icon={<DeleteOutlined />}>Xóa</Button></Col>
            </Row>
          </div>
        </div>

        <Card styles={{ body: { padding: 20 } }} style={{ borderRadius: 8, position: 'sticky', bottom: 16, zIndex: 10, boxShadow: '0 -2px 12px rgba(0,0,0,0.06)' }}>
          <Row align="middle">
            <Col span={8}><Checkbox checked={selected} onChange={(e) => setSelected(e.target.checked)}>Chọn tất cả (1)</Checkbox></Col>
            <Col span={6}><Button type="text" danger icon={<DeleteOutlined />}>Xóa</Button></Col>

            <Col span={6}>
              <div style={{ textAlign: 'right' }}>
                <Text>Tổng cộng ({quantity} sản phẩm):</Text>
                <div style={{ fontSize: 22, fontWeight: 700, marginTop: 4 }}>{formatPrice(total)}</div>
                <Text type="secondary">Phí vận chuyển: {formatPrice(shippingFee)}</Text>
              </div>
            </Col>

            <Col span={4}>
              <Button type="primary" size="large" block icon={<ShoppingCartOutlined />} style={{ height: 48, width: 270, background: '#000', borderColor: '#000', fontWeight: 600, marginLeft: 32 }}>Mua hàng</Button>
            </Col>
          </Row>
        </Card>
      </main>
    </AppLayout>
  );
}

export default Payment;