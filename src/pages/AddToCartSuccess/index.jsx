import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Card, Row, Col, Typography, Button, Image, Spin } from 'antd';
import { ArrowRightOutlined, CheckOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import AppLayout from '../../components/layout/AppLayout';
import { fetchProducts, fetchProductById } from '@/features/product/productSlice';

const { Title, Text } = Typography;

function AddToCartSuccess() {
  const dispatch = useDispatch();
  const { id } = useParams();

  const { currentProduct: product, items, isLoading, error } = useSelector(
    (state) => state.products
  );


  useEffect(() => {
    if (id) dispatch(fetchProductById(id));
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
    );
  }

  return (
    <AppLayout>
      <main style={{ padding: '32px 50px', background: '#f7f8fa', minHeight: 'calc(100vh - 54px)' }}>
        
        <Row justify="center" style={{ marginBottom: 40 }}>
          <Col xs={24} md={20} lg={14}>
            <Card bordered={false} style={{ borderRadius: 12 }} styles={{ body: { padding: 32 } }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ width: 58, height: 58, margin: '0 auto 20px', borderRadius: '50%', background: '#52c878', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 30, boxShadow: '0 0 0 10px #edf9f0' }}>
                  <CheckOutlined />
                </div>
                <Title level={2} style={{ margin: '0 0 10px', color: '#001529' }}>Đã thêm sản phẩm vào giỏ hàng!</Title>
                <Text type="secondary">Sản phẩm đã được thêm vào giỏ hàng của bạn. Bạn có thể tiếp tục mua sắm hoặc xem giỏ hàng của mình.</Text>
              </div>

              <div style={{ marginTop: 30, padding: 16, background: '#fafafa', borderRadius: 8, display: 'flex', alignItems: 'center', gap: 14 }}>
                <Image 
                  src={product.image} 
                  width={68} 
                  height={68} 
                  preview={false} 
                  style={{ borderRadius: 8, objectFit: 'cover' }} 
                />
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <Text strong>{product.name}</Text>
                  <Text strong>{product.brand}</Text>
                </div>
                <Text strong>{product.price?.toLocaleString('vi-VN')}đ</Text>
              </div>

              <div style={{ display: 'flex', justifyContent: 'center', gap: 14, marginTop: 22 }}>
                <Link to="/shoppingcart">
                  <Button 
                    size="large" 
                    icon={<ShoppingCartOutlined />} 
                    style={{ minWidth: 215, height: 44, borderRadius: 8, color: '#1677ff', borderColor: '#1677ff' }}
                  >
                    Xem giỏ hàng
                  </Button>
                </Link>
                <Link to="/home">
                  <Button 
                    type="primary" 
                    size="large" 
                    icon={<ArrowRightOutlined />} 
                    iconPosition="end" 
                    style={{ minWidth: 215, height: 44, borderRadius: 8 }}
                  >
                    Tiếp tục mua sắm
                  </Button>
                </Link>
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