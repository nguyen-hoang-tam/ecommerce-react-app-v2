import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Card, Row, Col, Typography, Button, Divider, Breadcrumb,
  Spin, Form, Modal, Input, message, Image, InputNumber
} from 'antd';
import {
  ArrowLeftOutlined, ArrowRightOutlined, PlusOutlined,
  CarOutlined, ThunderboltOutlined, ShopOutlined,
  CreditCardOutlined, BankOutlined, WalletOutlined, TagOutlined, DeleteOutlined
} from '@ant-design/icons';

import AppLayout from '../../components/layout/AppLayout';
import OptionCard from '../../components/card/OptionCard';
import OptionAddress from '../../components/card/OptionAddress';
import VoucherModal from '../../components/modal/VoucherModal';
import { fetchProductById } from '@/features/product/productSlice';
import { getVouchersAPI } from '@/features/auth/voucherAPI';
import { createOrderAPI } from '@/features/order/orderAPI';
import { removeFromCart, updateQuantity } from '../../features/cartSlice/index'

const { Title, Text } = Typography;

const shippingMethods = [
  { id: 'standard', icon: <CarOutlined />, title: 'Giao hàng tiêu chuẩn', desc: '3 - 5 ngày làm việc', price: 0 },
  { id: 'fast', icon: <ThunderboltOutlined />, title: 'Giao hàng nhanh', desc: '1 - 2 ngày làm việc', price: 30000 },
  { id: 'pickup', icon: <ShopOutlined />, title: 'Nhận tại cửa hàng', desc: 'Trong ngày', price: 0 },
];

const paymentMethods = [
  { id: 'cod', icon: <CreditCardOutlined />, title: 'Thanh toán khi nhận hàng', desc: '(COD)' },
  { id: 'bank', icon: <BankOutlined />, title: 'Chuyển khoản ngân hàng', desc: '(Internet Banking)' },
  { id: 'credit', icon: <CreditCardOutlined />, title: 'Thẻ tín dụng/ Ghi nợ', desc: '(Visa, Mastercard, JCB)' },
  { id: 'wallet', icon: <WalletOutlined />, title: 'Ví điện tử', desc: '(Momo, ZaloPay, VNPay)' },
];


function Payment() {

  const [quantity, setQuantity] = useState(1);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();

  const cartItems = useSelector((state) => state.cart.items);
  const [shipping, setShipping] = useState('standard');
  const [payment, setPayment] = useState('cod');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [isVoucherOpen, setIsVoucherOpen] = useState(false);
  const [vouchers, setVouchers] = useState([]);
  const [isVoucherLoading, setIsVoucherLoading] = useState(false);
  const [discount, setDiscount] = useState(0);
  const [appliedVoucher, setAppliedVoucher] = useState(null);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [form] = Form.useForm();


  const { profile } = useSelector((state) => state.auth);
    const { currentProduct: product, isLoading } = useSelector((state) => state.products);

  const defaultAddress = {
    id: 'default',
    name: profile?.fullname || 'Chưa có tên',
    phone: profile?.phone || 'Chưa có SĐT',
    address: profile?.address || 'Chưa có địa chỉ',
    isDefault: true,
  };

  const [addressList, setAddressList] = useState([defaultAddress]);
  const [selectedAddress, setSelectedAddress] = useState(defaultAddress.id);

  useEffect(() => {
    if (id) dispatch(fetchProductById(id));

    const fetchVouchers = async () => {
      setIsVoucherLoading(true);
      try {
        const data = await getVouchersAPI();
        setVouchers(data);
      } catch (err) {
        console.error('Lỗi fetch vouchers:', err);
      } finally {
        setIsVoucherLoading(false);
      }
    };

    fetchVouchers();
  }, [dispatch, id]);

  const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  const selectedMethod = shippingMethods.find((m) => m.id === shipping);
  const shippingFee = selectedMethod?.price || 0;
  const selectedPayment = paymentMethods.find((m) => m.id === payment);
  const finalTotal = subtotal + shippingFee - discount;

  const handleApplyVoucher = (voucher) => {
    if (subtotal < voucher.minOrder) {
      message.error(`Đơn tối thiểu ${voucher.minOrder.toLocaleString('vi-VN')}đ!`);
      return;
    }

    if (voucher.usageCount >= voucher.usageLimit) {
      message.error('Mã đã hết lượt sử dụng!');
      return;
    }

    let discountAmount = 0;
    if (voucher.type === 'fixed') {
      discountAmount = voucher.value;
    } else {
      discountAmount = Math.min((subtotal * voucher.value) / 100, voucher.maxDiscount);
    }

    setDiscount(discountAmount);
    setAppliedVoucher(voucher);
    setIsVoucherOpen(false);
    message.success(`Áp dụng ${voucher.code} thành công!`);
  };

  const handleAddAddress = () => {
    setEditingAddress(null);
    setIsModalOpen(true);
  };

  const handleEditAddress = (address) => {
    setEditingAddress(address);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingAddress(null);
  };

   const handleremoveFromCart = () => { 
    message.success('xoá thành công')
    dispatch(removeFromCart(product.id)); 
    console.log('Product add to cart', product.id)
  }

  const handleSubmitAddress = (values) => {
    if (editingAddress) {
      setAddressList(addressList.map((a) => a.id === editingAddress.id ? { ...a, ...values } : a));
      message.success('Cập nhật địa chỉ thành công!');
    } else {
      setAddressList([...addressList, { id: Date.now().toString(), ...values, isDefault: false }]);
      message.success('Thêm địa chỉ thành công!');
    }
    handleCloseModal();
  };

  const handlePlaceOrder = async () => {
    try {
      setIsPlacingOrder(true);
      const currentAddress = addressList.find((a) => a.id === selectedAddress);

      const orderData = {
        items: cartItems,
        shippingAddress: currentAddress,
        paymentMethod: selectedPayment?.title,
        shippingFee: shippingFee,
        discount: discount,
        total: finalTotal,
        voucherCode: appliedVoucher ? appliedVoucher.code : null,
      };

      const newOrderId = await createOrderAPI(orderData);
      const finalOrderData = { ...orderData, orderId: newOrderId };

      message.success('Đặt hàng thành công!');
      navigate('/ordersuccess', { state: { orderData: finalOrderData } });
    } catch (error) {
      message.error('Có lỗi xảy ra khi đặt hàng!');
      console.error(error);
    } finally {
      setIsPlacingOrder(false);
    }
  };

  if (isLoading) {
    return (
      <AppLayout>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
          <Spin size="large" />
        </div>
      </AppLayout>
    );
  }

  const handleIncrease = (item) => {                                                                                                                                                                                                                                                                                                                                                                                                                    
    dispatch(updateQuantity({                                                                                                                                   
      id: item.id,                                                                                                                                           
      quantity: item.quantity + 1                                                                                                                                            
    }));     
    console.log(item)                                                                                                                                                       
  };                                                                                                                                                                
  
  const handleDecrease = (item) => {                                                                                                                                                                                                                                                       
    if (item.quantity > 1) {                                                                                                                                                                                                                                                                                                              
      dispatch(updateQuantity({                                                                                                                                 
        id: item.id,                                                                                                                                         
        quantity: item.quantity - 1                                                                                                                                       
      }));                                                                                                                                                        
    }                                                                                                                                                               
  };         


  return (
    <AppLayout>
      <main style={{ padding: '24px 50px', background: '#f7f8fa', minHeight: 'calc(100vh - 54px)' }}>
        <Breadcrumb style={{ marginBottom: 16 }}>
          <Breadcrumb.Item><Link to="/">Trang chủ</Link></Breadcrumb.Item>
          <Breadcrumb.Item>Giỏ hàng & Thanh toán</Breadcrumb.Item>
        </Breadcrumb>

        <Card bordered={false} style={{ borderRadius: 12, marginBottom: 24 }} styles={{ body: { padding: 24 } }}>
          <div style={{ display: 'grid', gridTemplateColumns: '3fr 1fr 1fr 1fr 40px', gap: 16, paddingBottom: 16, borderBottom: '1px solid #f0f0f0', fontWeight: 600 }}>
            <Text>Sản phẩm</Text>
            <Text>Đơn giá</Text>
            <Text style={{ textAlign: 'center' }}>Số lượng</Text>
            <Text style={{ textAlign: 'right' }}>Thành tiền</Text>
            <span></span>
          </div>

          {cartItems.map((item) => (
            <div key={item.id} style={{ display: 'grid', gridTemplateColumns: '3fr 1fr 1fr 1fr 40px', gap: 16, alignItems: 'center', paddingTop: 16, paddingBottom: 16, borderBottom: '1px solid #f0f0f0' }}>
              <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                <Image src={item.image} width={60} height={60} preview={false} style={{ borderRadius: 8, objectFit: 'cover' }} />
                <div>
                  <Text strong style={{ display: 'block' }}>{item.name}</Text>
                  <Text type="secondary" style={{ fontSize: 12 }}>Màu: {item.color} | Size: {item.size}</Text>
                </div>
              </div>
              <Text strong>{item.price.toLocaleString('vi-VN')}đ</Text>
                  <div style={{ margin: 'auto',alignItems: 'center',textAlign: 'center', width: 'fit-Content' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, border: '1px solid #e5e5e5', borderRadius: 6, padding: '2px 8px' }}>
                    <span onClick={() => handleDecrease(item)} style={{ cursor: 'pointer', userSelect: 'none', padding: '0 8px' }}>−</span>                                           
                    <span style={{ minWidth: 20, textAlign: 'center', fontSize: 13 }}>{item.quantity}</span>                                                                          
                    <span onClick={() => handleIncrease(item)} style={{ cursor: 'pointer', userSelect: 'none', padding: '0 8px' }}>+</span>                                                                                                                                                                                               
                </div>
                </div>
              <Text strong style={{ textAlign: 'right' }}>{(item.price * item.quantity).toLocaleString('vi-VN')}đ</Text>
              <Button
              onClick={handleremoveFromCart}
              type="text" danger icon={<DeleteOutlined />} />
            </div>
          ))}
        </Card>

        <Row gutter={[24, 24]}>
          <Col xs={24} lg={16}>
            <Card style={{ borderRadius: 12, marginBottom: 16 }} styles={{ body: { padding: 24 } }}>
              <Title level={4} style={{ margin: 0 }}>Địa chỉ nhận hàng</Title>
              <Text type="secondary">Vui lòng kiểm tra và xác nhận thông tin địa chỉ giao hàng của bạn.</Text>
              
              {addressList.map((address) => (
                <OptionAddress
                  onEdit={handleEditAddress}
                  key={address.id}
                  item={address}
                  isSelected={selectedAddress === address.id}
                  onSelect={() => setSelectedAddress(address.id)}
                />
              ))}

              <Button onClick={handleAddAddress} type="dashed" block icon={<PlusOutlined />} style={{ marginTop: 12, height: 48, borderRadius: 8 }}>
                Thêm địa chỉ mới
              </Button>
            </Card>

           <Card style={{ borderRadius: 10, marginBottom: 16 }} styles={{ body: { padding: 20 } }}>
              <div style={{ marginBottom: 16 }}>
                <Title level={4} style={{ margin: 0, fontSize: 16 }}>Phương thức giao hàng</Title>
                <Text type="secondary" style={{ fontSize: 12 }}>Chọn phương thức giao hàng phù hợp với bạn.</Text>
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
              <div style={{ marginBottom: 8 }}>
                <Title level={4} style={{ margin: 0 }}>Phương thức thanh toán</Title>
              </div>
              <Row gutter={[12, 12]} style={{ marginTop: 16 }}>
                {paymentMethods.map((item) => (
                  <Col xs={12} md={6} key={item.id}>
                    <OptionCard item={item} isSelected={payment === item.id} onSelect={() => setPayment(item.id)} />
                  </Col>
                ))}
              </Row>
            </Card>
          </Col>

          <Col xs={24} lg={8}>
            <Card style={{ borderRadius: 12, position: 'sticky', top: 24 }} styles={{ body: { padding: 24 } }}>
              <Title level={5} style={{ margin: 0, marginBottom: 16 }}>Thông tin đơn hàng</Title>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Text type="secondary">Tạm tính</Text>
                  <Text>{(subtotal).toLocaleString('vi-VN')}đ</Text>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Text type="secondary">Phí vận chuyển</Text>
                  {shippingFee === 0 ? <Text style={{ color: '#52c41a' }}>Miễn phí</Text> : <Text>{shippingFee.toLocaleString('vi-VN')}đ</Text>}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Text type="secondary">Giảm giá</Text>
                  <Text style={{ color: discount > 0 ? '#52c41a' : '#111' }}>
                    {discount > 0 ? `- ${discount.toLocaleString('vi-VN')}đ` : '- 0đ'}
                  </Text>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Text type="secondary"> Phương thức thanh toán</Text>
                  <Text style={{ color: discount > 0 ? '#000000' : '#111' }}>
                   {selectedPayment.title}
                  </Text>
                </div>
              </div>

              <Divider style={{ margin: '16px 0' }} />

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Title level={5} style={{ margin: 0 }}>Tổng cộng</Title>
                <span style={{ fontSize: 22, fontWeight: 700, color: '#001529' }}>
                    {finalTotal.toLocaleString('vi-VN')}đ
                </span>
              </div>

              <div onClick={() => setIsVoucherOpen(true)} style={{ marginTop: 16, padding: 12, background: '#f0f5ff', borderRadius: 8, display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}>
                <TagOutlined style={{ color: '#001529', fontSize: 18 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, color: '#001529', fontSize: 13 }}>
                    {appliedVoucher ? `Đã áp dụng: ${appliedVoucher.code}` : 'Bạn có mã giảm giá?'}
                  </div>
                  <div style={{ color: '#888', fontSize: 12 }}>
                    {appliedVoucher ? `Giảm ${discount.toLocaleString('vi-VN')}đ` : 'Nhập mã giảm giá để được hưởng ưu đãi.'}
                  </div>
                </div>
                <ArrowRightOutlined style={{ color: '#999' }} />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 24 }}>
                <Link to="/" style={{ color: '#666', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <ArrowLeftOutlined /> Tiếp tục mua sắm
                </Link>

                <Button type="primary" size="large" style={{ background: '#001529', borderColor: '#001529', padding: '0 40px' }} onClick={handlePlaceOrder} loading={isPlacingOrder}>
                  Đặt hàng
                </Button>
              </div>
            </Card>
          </Col>
        </Row>

        <Modal title={editingAddress ? "Chỉnh sửa địa chỉ" : "Thêm địa chỉ mới"} open={isModalOpen} onCancel={handleCloseModal} footer={null} width={500} centered>
          <Form form={form} layout="vertical" onFinish={handleSubmitAddress} initialValues={editingAddress || { name: '', phone: '', address: '' }} style={{ marginTop: 16 }}>
            <Form.Item name="name" label="Họ và tên" rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}>
              <Input size="large" placeholder="Nguyễn Văn A" />
            </Form.Item>
            <Form.Item name="phone" label="Số điện thoại" rules={[{ required: true, message: 'Vui lòng nhập SĐT!' }, { pattern: /^[0-9]{10,11}$/, message: 'SĐT không hợp lệ!' }]}>
              <Input size="large" placeholder="0912345678" />
            </Form.Item>
            <Form.Item name="address" label="Địa chỉ" rules={[{ required: true, message: 'Vui lòng nhập địa chỉ!' }]}>
              <Input.TextArea rows={3} size="large" placeholder="Số nhà, đường, quận, thành phố" />
            </Form.Item>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
              <Button size="large" onClick={handleCloseModal}>Hủy</Button>
              <Button type="primary" size="large" htmlType="submit" style={{ background: '#001529', borderColor: '#001529' }}>
                Lưu địa chỉ
              </Button>
            </div>
          </Form>
        </Modal>

        <VoucherModal
          open={isVoucherOpen}
          onClose={() => setIsVoucherOpen(false)}
          onApply={handleApplyVoucher}
          vouchers={vouchers}
          isLoading={isVoucherLoading}
        />
      </main>
    </AppLayout>
  );
}

export default Payment;