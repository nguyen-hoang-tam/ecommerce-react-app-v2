import AppLayout from '../../components/layout/AppLayout';
import { Card, Row, Col, Typography, Button, Divider, Image, Breadcrumb, Spin } from 'antd';
import { ArrowRightOutlined } from '@ant-design/icons';
import { ShoppingCartOutlined, HeartOutlined, StarOutlined } from '@ant-design/icons';
import { Link, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { fetchProducts, fetchProductById } from '@/features/product/productSlice';
import { Grid } from '../../components/product';
import { RelatedProductCard } from '../../components/product';
import { useNavigate } from 'react-router-dom';

const { Title, Text, Paragraph } = Typography;

function ProductDetail() {
    const navigate = useNavigate();

    const handleClickCard = () => {
    navigate(`/Payment/${id}`);
  }; 
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
    );
  }

  return (
    <AppLayout>
      <main style={{ padding: '24px 50px', animation: 'fadeIn 0.5s ease' }}>
        <Breadcrumb style={{ marginBottom: 16 }}>
          <Breadcrumb.Item><Link to="/home">Trang chủ</Link></Breadcrumb.Item>
          <Breadcrumb.Item>Sản phẩm</Breadcrumb.Item>
          <Breadcrumb.Item>{product.brand}</Breadcrumb.Item>
          <Breadcrumb.Item>{product.name}</Breadcrumb.Item>
        </Breadcrumb>

        <Card
          style={{ borderRadius: 12, overflow: 'hidden' }}
          styles={{ body: { padding: 24 } }}
        >
          <Row gutter={[48, 48]} align="middle">
            <Col xs={24} lg={12}>
              <Image
                src={product.image}
                alt={product.name}
                style={{ width: '800px',height: '800px', borderRadius: 12, objectFit: 'cover' }}
                placeholder
              />
            </Col>
            <Col xs={24} lg={12}>
              <Title level={2} style={{ marginBottom: 12, fontWeight: 700 }}>{product.name}</Title>

              <Divider style={{ margin: '16px 0' }} />

              <div style={{ fontSize: 32, fontWeight: 700, color: '#111', marginBottom: 24 }}>
                {product.price?.toLocaleString('vi-VN')}đ
              </div>

              <Paragraph style={{ marginBottom: 24, color: '#555', lineHeight: 1.8 }}>
                {product.description}
              </Paragraph>

              <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
                <Button
                  size="large"
                  icon={<ShoppingCartOutlined />}
                  style={{ borderColor: '#101010', color: '#101010' }}
                >
                  Thêm vào giỏ hàng
                </Button>
                <Button
                  onClick={handleClickCard}
                  type="primary"
                  size="large"
                  block
                  style={{ background: '#101010', borderColor: '#101010' }}
                >
                  Mua ngay
                </Button>
              </div>

              <Divider style={{ margin: '16px 0' }} />

              <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
                <Text><strong>Danh mục:</strong> { product.brand}</Text>
              </div>
            </Col>
          </Row>
        </Card>

        <Divider style={{ margin: '40px 0' }} />

         <section style={{ marginTop: 56 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
            <h2 style={{ fontSize: 24, fontWeight: 600, margin: 0 }}>Sản phẩm liên quan</h2>
            <Link to="/shop" style={{ color: '#101010', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6 }}>
              Xem tất cả <ArrowRightOutlined />
            </Link>
          </div>
          <Grid
            items={relatedProducts}
            isLoading={isLoading}
            columns={{ xs: 24, sm: 12, md: 8, lg: 4 }}
            renderItem={(p) => <RelatedProductCard product={p} />}
          />
        </section>
      </main>
    </AppLayout>
  );
}

export default ProductDetail;