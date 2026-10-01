import AppLayout from '../../components/layout/AppLayout';
import {
  ArrowLeftOutlined,
  ArrowRightOutlined,
  PlusOutlined,
  EditOutlined,
  CarOutlined,
  ThunderboltOutlined,
  ShopOutlined,
  CreditCardOutlined,
  BankOutlined,
  WalletOutlined,
  SafetyCertificateOutlined,
  TagOutlined,
} from '@ant-design/icons';
import OptionCard from '../../components/card/OptionCard';
import { Link, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '@/features/product/productSlice';
import { useState, useEffect } from 'react';
import { Card, Row, Col, Typography, Button, Divider, Breadcrumb, Radio, Spin } from 'antd';
import { fetchProductById } from '@/features/product/productSlice';

const { Title, Text } = Typography;

export const shippingMethods = [
  { id: 'standard', icon: <CarOutlined />, title: 'Giao hàng tiêu chuẩn', desc: '3 - 5 ngày làm việc', price: 0 },
  { id: 'fast', icon: <ThunderboltOutlined />, title: 'Giao hàng nhanh', desc: '1 - 2 ngày làm việc', price: 30000 },
  { id: 'pickup', icon: <ShopOutlined />, title: 'Nhận tại cửa hàng', desc: 'Trong ngày', price: 0 },
];

export const paymentMethods = [
  { id: 'cod', icon: <CreditCardOutlined />, title: 'Thanh toán khi nhận hàng', desc: '(COD)' },
  { id: 'bank', icon: <BankOutlined />, title: 'Chuyển khoản ngân hàng', desc: '(Internet Banking)' },
  { id: 'credit', icon: <CreditCardOutlined />, title: 'Thẻ tín dụng/ Ghi nợ', desc: '(Visa, Mastercard, JCB)' },
  { id: 'wallet', icon: <WalletOutlined />, title: 'Ví điện tử', desc: '(Momo, ZaloPay, VNPay)' },
];

function Payment() {
  const [shipping, setShipping] = useState('standard');
  const [payment, setPayment] = useState('cod');

  const { profile } = useSelector((state) => state.auth);

    const dispatch = useDispatch();
    const { id } = useParams();
  
   const { currentProduct: product, items, isLoading, error } = useSelector(
    (state) => state.products
  );

    useEffect(() => {
    dispatch(fetchProductById(id)); 
    dispatch(fetchProducts());       
    }, [dispatch, id]);
    
    const relatedProducts = items.filter((p) => p.id !== id).slice(0, 6);


    if (error) return <p>Lỗi: {error}</p>;
    
  if (isLoading || !product) {
    return (
      <AppLayout>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
          <Spin size="large" />
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <main style={{ padding: '24px 50px' }}>
        <Breadcrumb style={{ marginBottom: 16 }}>
          <Breadcrumb.Item><Link to="/">Trang chủ</Link></Breadcrumb.Item>
          <Breadcrumb.Item><Link to="/cart">Giỏ hàng</Link></Breadcrumb.Item>
          <Breadcrumb.Item>Thanh toán</Breadcrumb.Item>
        </Breadcrumb>

        <Row gutter={[24, 24]}>
          <Col xs={24} lg={16}>
            <Card style={{ borderRadius: 12, marginBottom: 16 }} styles={{ body: { padding: 24 } }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                <Title level={4} style={{ margin: 0 }}>Địa chỉ nhận hàng</Title>
              </div>

              <Text type="secondary">Vui lòng kiểm tra và xác nhận thông tin địa chỉ giao hàng của bạn.</Text>

              <div style={{ marginTop: 16, padding: 16, border: '1px solid #2e9aff', borderRadius: 8, display: 'flex', alignItems: 'center', gap: 12, background: '#f0f5ff' }}>
                <Radio checked />
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Text strong>{ profile?.fullname || 'Chưa có tên'}</Text>
                    <span style={{ background: '#e6f0ff', color: '#001529', fontSize: 12, padding: '2px 8px', borderRadius: 4 }}>Mặc định</span>
                  </div>
                  <div style={{ color: '#666', fontSize: 13, marginTop: 4 }}>{ profile?.phone || 'Chưa có SĐT'}</div>
                  <div style={{ color: '#666', fontSize: 13, marginTop: 2 }}>Số 123 Nguyễn Văn Cừ, Quận Long Biên, Hà Nội</div>
                </div>
                <EditOutlined style={{ fontSize: 18, color: '#666', cursor: 'pointer' }} />
              </div>

              <Button type="dashed" block icon={<PlusOutlined />} style={{ marginTop: 12, height: 48, borderRadius: 8 }}>
                Thêm địa chỉ mới
              </Button>
            </Card>

            <Card style={{ borderRadius: 10, marginBottom: 16 }} styles={{ body: { padding: 20 } }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                <div>
                  <Title level={4} style={{ margin: 0, fontSize: 16 }}>Phương thức giao hàng</Title>
                  <Text type="secondary" style={{ fontSize: 12 }}>Chọn phương thức giao hàng phù hợp với bạn.</Text>
                </div>
              </div>

              <Row gutter={[10, 10]}>
                {shippingMethods.map((item) => (
                  <Col xs={24} sm={12} md={8} key={item.id}>
                    <OptionCard item={item} isSelected={shipping === item.id} onSelect={() => setShipping(item.id)} />
                  </Col>
                ))}
              </Row>
            </Card>

            <Card style={{ borderRadius: 12, marginBottom: 16 }} styles={{ body: { padding: 24 } }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                <Title level={4} style={{ margin: 0 }}>Phương thức thanh toán</Title>
              </div>

              <Text type="secondary">Chọn phương thức thanh toán theo nhu cầu của bạn.</Text>

              <Row gutter={[12, 12]} style={{ marginTop: 16 }}>
                {paymentMethods.map((item) => {
                  const isSelected = payment === item.id;

                  return (
                    <Col xs={12} md={6} key={item.id}>
                         <OptionCard item={item} isSelected={shipping === item.id} onSelect={() => setShipping(item.id)} />
                    </Col>
                  );
                })}
              </Row>
            </Card>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 24 }}>
              <Link to="/cart" style={{ color: '#666', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8 }}>
                <ArrowLeftOutlined />
                Quay lại giỏ hàng
              </Link>

              <Button
                type="primary"
                size="large"
                style={{ background: '#001529', borderColor: '#001529', padding: '0 40px' }}
                icon={<ArrowRightOutlined />}
                iconPosition="end"
              >
                Đặt hàng
              </Button>
            </div>
          </Col>

          <Col xs={24} lg={8}>
            <Card style={{ borderRadius: 12, position: 'sticky', top: 24 }} styles={{ body: { padding: 24 } }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <Title level={5} style={{ margin: 0 }}>Đơn hàng của bạn</Title>
                <Text type="secondary">1 sản phẩm</Text>
              </div>

              <div style={{ display: 'flex', gap: 12, paddingBottom: 16, borderBottom: '1px solid #f0f0f0' }}>
                <img
                  src={product?.image || 'https://picsum.photos/300/300?random=6'}
                  alt={product?.name || 'Sản phẩm'}
                  style={{ width: 64, height: 64, borderRadius: 8, objectFit: 'cover' }}
                />
                <div style={{ flex: 1 }}>
                  <div>{product?.name || 'Chưa có sản phẩm'}</div>
                  <div style={{ color: '#888', fontSize: 12, marginTop: 2 }}>Màu: Đen</div>
                  <div style={{ color: '#111', fontWeight: 600, marginTop: 4 }}>{ product.brand}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, border: '1px solid #e5e5e5', borderRadius: 6, padding: '2px 8px' }}>
                    <span style={{ cursor: 'pointer', fontSize: 14, userSelect: 'none' }}>−</span>
                    <span style={{ minWidth: 20, textAlign: 'center', fontSize: 13 }}>1</span>
                    <span style={{ cursor: 'pointer', fontSize: 14, userSelect: 'none' }}>+</span>
                  </div>
                  <div style={{ fontWeight: 700, marginTop: 8 }}>3.500.000đ</div>
                </div>
              </div>

              <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Text type="secondary">Tạm tính</Text>
                  <Text>3.500.000đ</Text>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Text type="secondary">Phí vận chuyển</Text>
                  <Text style={{ color: '#52c41a' }}>Miễn phí</Text>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Text type="secondary">Giảm giá</Text>
                  <Text>- 0đ</Text>
                </div>
              </div>

              <Divider style={{ margin: '16px 0' }} />

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Title level={5} style={{ margin: 0 }}>Tổng cộng</Title>
                <span style={{ fontSize: 22, fontWeight: 700, color: '#001529' }}>3.500.000đ</span>
              </div>

              <div style={{ marginTop: 16, padding: 12, background: '#f0f5ff', borderRadius: 8, display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}>
                <TagOutlined style={{ color: '#001529', fontSize: 18 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, color: '#001529', fontSize: 13 }}>Bạn có mã giảm giá?</div>
                  <div style={{ color: '#888', fontSize: 12 }}>Nhập mã giảm giá để được hưởng ưu đãi tốt nhất.</div>
                </div>
                <ArrowRightOutlined style={{ color: '#999' }} />
              </div>

              <div style={{ marginTop: 12, padding: 12, background: '#f5f9ff', borderRadius: 8, display: 'flex', alignItems: 'center', gap: 12 }}>
                <SafetyCertificateOutlined style={{ color: '#1677ff', fontSize: 20 }} />
                <div>
                  <div style={{ fontWeight: 600, fontSize: 13 }}>Thanh toán an toàn</div>
                  <div style={{ color: '#888', fontSize: 12 }}>Chúng tôi cam kết bảo mật thông tin thanh toán của bạn.</div>
                </div>
              </div>
            </Card>
          </Col>
        </Row>
      </main>
    </AppLayout>
  );
  }

export default Payment;