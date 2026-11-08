import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Card, Row, Col, Typography, Button, Divider, Breadcrumb, Spin, message
} from 'antd';
import {
  ArrowLeftOutlined, ArrowRightOutlined,
  CarOutlined, ThunderboltOutlined, ShopOutlined,
  CreditCardOutlined, BankOutlined, WalletOutlined,
  SafetyCertificateOutlined, TagOutlined,
} from '@ant-design/icons';

import AppLayout from '../../components/layout/AppLayout';
import AddressSection from '../../components/address/AddressSection';
import OptionCard from '../../components/card/OptionCard';
import VoucherModal from '../../components/modal/VoucherModal';
import AddBankModal from '../../components/modal/AddBankModal';
import EWalletPaymentModal from '../../components/modal/EWalletPaymentModal';
import CardPaymentModal from '../../components/modal/CardPaymentModal';
import { fetchProductById } from '@/features/product/productSlice';
import { getVouchersAPI } from '@/features/auth/voucherAPI';
import { createOrderAPI } from '@/features/order/orderAPI';
import { setAddressList } from '@/features/address/addressSlice';

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
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const { profile } = useSelector((state) => state.auth);
  const { currentProduct: product, isLoading, error } = useSelector((state) => state.products);
  const { list: addressList } = useSelector((state) => state.address);

  const [shipping, setShipping] = useState('standard');
  const [payment, setPayment] = useState('cod');
  const [quantity, setQuantity] = useState(1);

  const [isModalbankOpen, setIsModalbankOpen] = useState(false);
  const [isCardPaymentModal, setIsCardPaymentModal] = useState(false);
  const [isEWalletPaymentModal, setIsEWalletPaymentModal] = useState(false);

  const [isVoucherOpen, setIsVoucherOpen] = useState(false);
  const [vouchers, setVouchers] = useState([]);
  const [isVoucherLoading, setIsVoucherLoading] = useState(false);

  const [discount, setDiscount] = useState(0);
  const [appliedVoucher, setAppliedVoucher] = useState(null);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  const defaultAddress = {
    id: 'default',
    name: profile?.fullname ?? null,
    phone: profile?.phone ?? null,
    address: profile?.address ?? null,
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

  const selectedMethod = shippingMethods.find((m) => m.id === shipping);
  const shippingFee = selectedMethod?.price || 0;
  const selectedPayment = paymentMethods.find((m) => m.id === payment);
  const subtotal = (product?.price || 0) * quantity;
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

  const executeOrder = async (paymentDetails = null) => {
    try {
      setIsPlacingOrder(true);

      const currentAddress = addressList.find((a) => a.id === selectedAddress) || defaultAddress;

      if (!currentAddress?.address || !currentAddress?.name || !currentAddress?.phone) {
        message.warning('Vui lòng nhập đầy đủ Tên, Số điện thoại và Địa chỉ!');
        return;
      }

      const orderData = {
        items: [{
          productId: product.id,
          name: product.name,
          price: product.price,
          quantity,
          image: product.image,
        }],
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
      return;
    }

    if (payment === 'bank') {
      setIsModalbankOpen(true);
      return;
    } else if (payment === 'credit') {
      setIsCardPaymentModal(true);
      return;
    } else if (payment === 'wallet') {
      setIsEWalletPaymentModal(true);
      return;
    }

    executeOrder();
  };

  if (error) return <p>Lỗi: {error}</p>;

  if (isLoading || !product) {
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
      <main style={{ padding: '24px 50px' }}>
        <Breadcrumb style={{ marginBottom: 16 }}>
          <Breadcrumb.Item><Link to="/">Trang chủ</Link></Breadcrumb.Item>
          <Breadcrumb.Item><Link to="/cart">Giỏ hàng</Link></Breadcrumb.Item>
          <Breadcrumb.Item>Thanh toán</Breadcrumb.Item>
        </Breadcrumb>

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
              <Text type="secondary">Chọn phương thức thanh toán theo nhu cầu của bạn.</Text>

              <Row gutter={[12, 12]} style={{ marginTop: 16 }}>
                {paymentMethods.map((item) => (
                  <Col xs={12} md={6} key={item.id}>
                    <OptionCard item={item} isSelected={payment === item.id} onSelect={() => setPayment(item.id)} />
                  </Col>
                ))}
              </Row>
            </Card>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 24 }}>
              <Link to="/cart" style={{ color: '#666', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8 }}>
                <ArrowLeftOutlined />
                Quay lại giỏ hàng
              </Link>

              <Button type="primary" size="large" style={{ background: '#001529', borderColor: '#001529', padding: '0 40px' }} icon={<ArrowRightOutlined />} iconPlacement="end" onClick={handlePlaceOrder} loading={isPlacingOrder}>
                Đặt hàng
              </Button>
            </div>
          </Col>

          <Col xs={24} lg={8}>
            <Card style={{ borderRadius: 12, position: 'sticky', top: 24 }} styles={{ body: { padding: 24 } }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <Title level={5} style={{ margin: 0 }}>Đơn hàng của bạn</Title>
                <Text type="secondary">{quantity} sản phẩm</Text>
              </div>

              <div style={{ display: 'flex', gap: 12, paddingBottom: 16, borderBottom: '1px solid #f0f0f0' }}>
                <img src={product?.image || 'https://picsum.photos/300/300?random=6'} alt={product?.name || 'Sản phẩm'} style={{ width: 64, height: 64, borderRadius: 8, objectFit: 'cover' }} />
                <div style={{ flex: 1 }}>
                  <div>{product?.name || 'Chưa có sản phẩm'}</div>
                  <div style={{ color: '#888', fontSize: 12, marginTop: 2 }}>Màu: Đen</div>
                  <div style={{ color: '#111', fontWeight: 600, marginTop: 4 }}>{product?.brand}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, border: '1px solid #e5e5e5', borderRadius: 6, padding: '2px 8px' }}>
                    <span onClick={() => setQuantity(Math.max(1, quantity - 1))} style={{ cursor: 'pointer', userSelect: 'none' }}>−</span>
                    <span style={{ minWidth: 20, textAlign: 'center', fontSize: 13 }}>{quantity}</span>
                    <span onClick={() => setQuantity(quantity + 1)} style={{ cursor: 'pointer', userSelect: 'none' }}>+</span>
                  </div>
                  <div style={{ fontWeight: 700, marginTop: 8 }}>
                    {subtotal.toLocaleString('vi-VN')}đ
                  </div>
                </div>
              </div>

              <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
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
                  <Text type="secondary">Phương thức giao hàng</Text>
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

              <div
                onClick={() => setIsVoucherOpen(true)}
                style={{ marginTop: 16, padding: 12, background: '#f0f5ff', borderRadius: 8, display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}>
                <TagOutlined style={{ color: '#001529', fontSize: 18 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, color: '#001529', fontSize: 13 }}>
                    {appliedVoucher ? `Đã áp dụng: ${appliedVoucher.code}` : 'Bạn có mã giảm giá?'}
                  </div>
                  <div style={{ color: '#888', fontSize: 12 }}>
                    {appliedVoucher ? `Giảm ${discount.toLocaleString('vi-VN')}đ` : 'Nhập mã giảm giá để được hưởng ưu đãi tốt nhất.'}
                  </div>
                </div>
                <ArrowRightOutlined style={{ color: '#999' }} />
              </div>

              <div style={{ marginTop: 12, padding: 12, background: '#f5f9ff', borderRadius: 8, display: 'flex', alignItems: 'center', gap: 12 }}>
                <SafetyCertificateOutlined style={{ color: '#1677ff', fontSize: 20 }} />
                <div>
                  <div style={{ fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>Thanh toán an toàn</div>
                  <div style={{ color: '#888', fontSize: 12 }}>Chúng tôi cam kết bảo mật thông tin thanh toán của bạn.</div>
                </div>
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