import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Card, Row, Col, Typography, Button, Divider, Breadcrumb,
  Spin, message, Image
} from 'antd';
import {
  ArrowLeftOutlined, ArrowRightOutlined,
  CarOutlined, ThunderboltOutlined, ShopOutlined,
  CreditCardOutlined, BankOutlined, WalletOutlined,
  TagOutlined, DeleteOutlined
} from '@ant-design/icons';

import AppLayout from '../../components/layout/AppLayout';
import AddressSection from '../../components/address/AddressSection';
import OptionCard from '../../components/card/OptionCard';
import VoucherModal from '../../components/modal/VoucherModal';
import AddBankModal from '../../components/modal/AddBankModal';
import EWalletPaymentModal from '../../components/modal/EWalletPaymentModal';
import CardPaymentModal from '../../components/modal/CardPaymentModal';
import { getVouchersAPI } from '@/features/auth/voucherAPI';
import { createOrderAPI } from '@/features/order/orderAPI';
import { removeFromCart, updateQuantity } from '../../features/cartSlice/index';
import { setAddressList } from '@/features/address/addressSlice';

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
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cartItems = useSelector((state) => state.cart.items);
  const { profile } = useSelector((state) => state.auth);
  const { list: addressList } = useSelector((state) => state.address);
  const { isLoading } = useSelector((state) => state.products);

  const [isModalbankOpen, setIsModalbankOpen] = useState(false);
  const [isCardPaymentModal, setIsCardPaymentModal] = useState(false);
  const [isEWalletPaymentModal, setIsEWalletPaymentModal] = useState(false);

  const [shipping, setShipping] = useState('standard');
  const [payment, setPayment] = useState('cod');
  const [isVoucherOpen, setIsVoucherOpen] = useState(false);
  const [vouchers, setVouchers] = useState([]);
  const [isVoucherLoading, setIsVoucherLoading] = useState(false);
  const [discount, setDiscount] = useState(0);
  const [appliedVoucher, setAppliedVoucher] = useState(null);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  const defaultAddress = {
    id: 'default',
    name: profile?.fullname || 'Chưa có tên',
    phone: profile?.phone || 'Chưa có SĐT',
    address: profile?.address || 'Chưa có địa chỉ',
    isDefault: true,
  };

  const [selectedAddress, setSelectedAddress] = useState(defaultAddress.id);

  useEffect(() => {
    if (profile && addressList.length === 0) {
      dispatch(setAddressList([defaultAddress]));
      setSelectedAddress('default');
    }
  }, [profile, addressList.length, dispatch]);

  useEffect(() => {
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
  }, []);

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

  const handleRemoveItem = (id) => {
    dispatch(removeFromCart(id));
    message.success('Đã xóa sản phẩm khỏi giỏ hàng');
  };

  const handleIncrease = (item) => {
    dispatch(updateQuantity({ id: item.id, quantity: item.quantity + 1 }));
  };

  const handleDecrease = (item) => {
    if (item.quantity > 1) {
      dispatch(updateQuantity({ id: item.id, quantity: item.quantity - 1 }));
    }
  };

  const executeOrder = async (paymentDetails = null) => {
    try {
      setIsPlacingOrder(true);
      const currentAddress = addressList.find((a) => a.id === selectedAddress) || defaultAddress;

      const orderData = {
        items: cartItems,
        shippingAddress: currentAddress,
        paymentMethod: selectedPayment?.title,
        paymentDetails,
        shippingFee,
        discount,
        total: finalTotal,
        voucherCode: appliedVoucher ? appliedVoucher.code : null,
      };

      const newOrderId = await createOrderAPI(orderData);
      const finalOrderData = { ...orderData, orderId: newOrderId };

      message.success('Đặt hàng thành công!');
      navigate('/ordersuccess', { state: { orderData: finalOrderData } });
    } catch (err) {
      console.error(err);
      message.error(err?.message || 'Có lỗi xảy ra khi đặt hàng. Vui lòng thử lại!');
    } finally {
      setIsPlacingOrder(false);
    }
  };

  const handlePlaceOrder = () => {
    if (!profile) {
      message.warning('Vui lòng đăng nhập để đặt hàng!');
      return navigate('/login');
    }

    const currentAddress = addressList.find((a) => a.id === selectedAddress);
    if (!currentAddress?.address || !currentAddress?.name || !currentAddress?.phone) {
      return message.warning('Vui lòng nhập đầy đủ Tên, Số điện thoại và Địa chỉ!');
    }

    if (cartItems.length === 0) {
      return message.warning('Giỏ hàng của bạn đang trống!');
    }

    if (payment === 'bank') {
      setIsModalbankOpen(true);
      return;
    } 
    if (payment === 'credit') {
      setIsCardPaymentModal(true);
      return;
    } 
    if (payment === 'wallet') {
      setIsEWalletPaymentModal(true);
      return;
    }

    executeOrder();
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
                  <Text type="secondary" style={{ fontSize: 12 }}>Màu: {item.color || 'N/A'} | Size: {item.size || 'N/A'}</Text>
                </div>
              </div>
              <Text strong>{item.price.toLocaleString('vi-VN')}đ</Text>
              <div style={{ margin: 'auto', alignItems: 'center', textAlign: 'center', width: 'fit-content' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, border: '1px solid #e5e5e5', borderRadius: 6, padding: '2px 8px' }}>
                  <span onClick={() => handleDecrease(item)} style={{ cursor: 'pointer', userSelect: 'none', padding: '0 8px' }}>−</span>
                  <span style={{ minWidth: 20, textAlign: 'center', fontSize: 13 }}>{item.quantity}</span>
                  <span onClick={() => handleIncrease(item)} style={{ cursor: 'pointer', userSelect: 'none', padding: '0 8px' }}>+</span>
                </div>
              </div>
              <Text strong style={{ textAlign: 'right' }}>{(item.price * item.quantity).toLocaleString('vi-VN')}đ</Text>
              <Button onClick={() => handleRemoveItem(item.id)} type="text" danger icon={<DeleteOutlined />} />
            </div>
          ))}
        </Card>

        <Row gutter={[24, 24]}>
          <Col xs={24} lg={16}>
            <AddressSection
              selectedAddressId={selectedAddress}
              onSelectAddress={setSelectedAddress}
            />

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
                  <Text>{subtotal.toLocaleString('vi-VN')}đ</Text>
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
                  <Text type="secondary">Phương thức thanh toán</Text>
                  <Text>{selectedPayment?.title}</Text>
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

        <VoucherModal
          open={isVoucherOpen}
          onClose={() => setIsVoucherOpen(false)}
          onApply={handleApplyVoucher}
          vouchers={vouchers}
          isLoading={isVoucherLoading}
        />

        <AddBankModal
          amount={finalTotal}
          open={isModalbankOpen}
          onCancel={() => setIsModalbankOpen(false)}
          onConfirm={(bankData) => {
            setIsModalbankOpen(false);
            executeOrder(bankData);
          }}
        />

        <CardPaymentModal
          amount={finalTotal}
          open={isCardPaymentModal}
          onCancel={() => setIsCardPaymentModal(false)}
          onConfirm={(cardData) => {
            setIsCardPaymentModal(false);
            executeOrder(cardData);
          }}
        />

        <EWalletPaymentModal
          amount={finalTotal}
          open={isEWalletPaymentModal}
          onCancel={() => setIsEWalletPaymentModal(false)}
          onConfirm={(walletData) => {
            setIsEWalletPaymentModal(false);
            executeOrder(walletData);
          }}
        />
      </main>
    </AppLayout>
  );
}

export default Payment;