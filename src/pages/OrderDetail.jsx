import React, { useMemo, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useParams, useNavigate, useLocation } from 'react-router-dom';
import {
  Card, Row, Col, Typography, Button, Divider, Breadcrumb, Steps, Space, Modal, message, Image
} from 'antd';
import {
  ArrowLeftOutlined, TruckOutlined, ShoppingCartOutlined,
  CustomerServiceOutlined, StopOutlined, CopyOutlined,
  UserOutlined, EnvironmentOutlined, PhoneOutlined,
  CreditCardOutlined, CheckCircleOutlined, CalendarOutlined, InfoCircleOutlined
} from '@ant-design/icons';
import { addToCart } from '@/features/cart';

import AppLayout from '../components/layout/AppLayout';

const { Title, Text } = Typography;


const formatDate = (date) => {
  if (!date) return '--';

  const value = date?.seconds
    ? new Date(date.seconds * 1000)
    : new Date(date);

  if (Number.isNaN(value.getTime())) return '--';

  return value.toLocaleString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

function OrderDetail({ onCancelOrder, onReorder, onContact }) {

  const dispatch = useDispatch();

  const { id } = useParams();
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

  const [isCancelling, setIsCancelling] = useState(false);


  const isDelivered = status === 'delivered';
  const canCancel = status === 'pending';


  const handleCancelOrder = () => {
    Modal.confirm({
      title: 'Xác nhận hủy đơn hàng',
      content: 'Bạn có chắc chắn muốn hủy đơn hàng này không?',
      okText: 'Xác nhận hủy',
      cancelText: 'Quay lại',
      okButtonProps: { danger: true, loading: isCancelling },
      onOk: async () => {
        if (!onCancelOrder) {
          message.warning('Chưa cấu hình chức năng hủy đơn hàng!');
          return;
        }

        try {
          setIsCancelling(true);
          await onCancelOrder(orderId);
          message.success('Hủy đơn hàng thành công!');
        } catch (error) {
          message.error(error?.message || 'Hủy đơn hàng thất bại!');
          throw error;
        } finally {
          setIsCancelling(false);
        }
      },
    });
  };


   const handleReorder = () => {
  if (!orderData?.items || orderData.items.length === 0) {
    message.warning('Không có sản phẩm nào để mua lại!');
    return;
  }
  orderData.items.forEach((item) => {
    const cartItem = {
      id: item.productId || item.id,
      name: item.name,
      price: item.price,
      image: item.image,
      brand: item.brand || '',
      color: item.color || '',
      size: item.size || '',
      quantity: item.quantity,
    };
    dispatch(addToCart(cartItem));
    console.log('Product add to cart', cartItem)
  });

  message.success('Đã thêm các sản phẩm vào giỏ hàng!');
  navigate('/shoppingcart'); 
};

  const handleContact = () => {
    if (onContact) {
      onContact();
      return;
    }

    message.info('Vui lòng liên hệ bộ phận hỗ trợ!');
  };

  const firstItem = orderData.items[0];
  const subtotal = firstItem.price * firstItem.quantity;

  return (
    <AppLayout>
      <main style={{ padding: '24px 50px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div>
            <Breadcrumb style={{ marginBottom: 12 }}>
              <Breadcrumb.Item>
                <Link to="/">Trang chủ</Link>
              </Breadcrumb.Item>
              <Breadcrumb.Item>
                <Link to="/orders">Đơn hàng</Link>
              </Breadcrumb.Item>
              <Breadcrumb.Item>Chi tiết đơn hàng</Breadcrumb.Item>
            </Breadcrumb>
          </div>

          <Button icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)}>
            Quay lại
          </Button>
        </div>

        <Row gutter={[24, 16]}>
          <Col xs={24} lg={16}>
            <Card
              style={{ borderRadius: 12, marginBottom: 16 }}
              styles={{ body: { padding: 24 } }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <Title level={5} style={{ margin: 0 }}>
                  Trạng thái đơn hàng
                </Title>
              </div>

              <Steps
                current={0}
                responsive
                labelPlacement="vertical"
                items={[
                  { title: 'Chờ xử lý' },
                  { title: 'Đã xác nhận' },
                  { title: 'Đang giao hàng' },
                  { title: 'Thành công' },
                ]}
              />

              <Divider style={{ margin: '24px 0 20px' }} />

              <Row gutter={[16, 16]}>
                <Col xs={24} md={8}>
                  <Text type="secondary" style={{ display: 'block', marginBottom: 6 }}>
                    Mã đơn hàng
                  </Text>
                  <Space size={4}>
                    <Text strong>{orderData.orderId}</Text>
                    <Button
                      type="text"
                      size="small"
                      icon={<CopyOutlined />}
                    />
                  </Space>
                </Col>

                <Col xs={24} md={8}>
                  <Text type="secondary" style={{ display: 'block', marginBottom: 6 }}>
                    <CalendarOutlined /> Ngày đặt
                  </Text>
                  <Text strong>{ formatDate(orderData.createdAt) }</Text>
                </Col>

                <Col xs={24} md={8}>
                  <Text type="secondary" style={{ display: 'block', marginBottom: 6 }}>
                    Phương thức thanh toán
                  </Text>
                  <Text strong>{orderData.paymentMethod}</Text>
                </Col>
              </Row>
            </Card>

            <Card bordered={false} style={{ borderRadius: 12, marginBottom: 20 }} styles={{ body: { padding: 24 } }}>
              <Title level={4} style={{ margin: '0 0 24px', fontSize: 16 }}>Thông tin giao hàng</Title>
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

            {canCancel && (
              <Text type="secondary" style={{ display: 'block', marginTop: 8, fontSize: 12 }}>
                <InfoCircleOutlined /> Chỉ áp dụng khi đơn hàng ở trạng thái Chờ xử lý.
              </Text>
            )}

            {isDelivered && (
              <div style={{ marginTop: 12, color: '#52c41a' }}>
                <CheckCircleOutlined /> Đơn hàng đã được giao thành công.
              </div>
            )}
          </Col>

          <Col xs={24} lg={8}>
             <Card bordered={false} style={{ borderRadius: 12}} styles={{ body: { padding: 24 } }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <Title level={5} style={{ margin: 0 }}>Thông tin đơn hàng</Title>
                <Text type="secondary">{firstItem.quantity} sản phẩm</Text>
              </div>
              {orderData?.items?.map((item, index) => (
                <div style={{ display: 'flex', gap: 12, paddingBottom: 16, borderBottom: '1px solid #f0f0f0' }}>
                  <Image src={item.image} width={68} height={68} preview={false} style={{ borderRadius: 8, objectFit: 'cover' }} />
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 5 }}>
                    <Text strong>{item.name}</Text>
                    <Text strong>{item.brand}</Text>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <Text>x{item.quantity}</Text>
                  <Text strong style={{ display: 'block', marginTop: 8 }}>{item.price.toLocaleString('vi-VN')}đ</Text>
                </div>
              </div>
              ))}

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

            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 12, marginTop: 16 }}>
              <Button
                type="primary"
                size="large"
                icon={<ShoppingCartOutlined />}
                onClick={handleReorder}
                style={{ background: '#1677ff', borderColor: '#1677ff', padding: '0 24px' }}
              >
                Mua lại
              </Button>

              <Button
                size="large"
                icon={<CustomerServiceOutlined />}
                onClick={handleContact}
                style={{ borderColor: '#1677ff', color: '#1677ff' }}
              >
                Liên hệ Shop / Hỗ trợ
              </Button>

              {canCancel && (
                <Button
                  danger
                  size="large"
                  icon={<StopOutlined />}
                  onClick={handleCancelOrder}
                >
                  Hủy đơn hàng
                </Button>
              )}
            </div>

          </Col>
        </Row>
      </main>
    </AppLayout>
  );
}

export default OrderDetail;