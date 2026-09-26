import { Row, Col, Empty, Skeleton } from 'antd';
import ProductCard from './ProductCard';

function ProductGrid({ products, isLoading }) {
  if (isLoading) {
    return (
      <Row gutter={[24, 24]}>
        {[1, 2, 3, 4].map((item) => (
          <Col xs={24} sm={12} md={8} lg={6} key={item}>
            <Skeleton.Image
              active
              style={{ width: '100%', height: 220 }}
            />
            <Skeleton active paragraph={{ rows: 2 }} />
          </Col>
        ))}
      </Row>
    );
  }

  if (!products || products.length === 0) {
    return (
      <Empty
        description="Chưa có sản phẩm nào"
        style={{ padding: 60 }}
      />
    );
  }

  return (
    <Row gutter={[24, 24]}>
      {products.map((product) => (
        <Col xs={24} sm={12} md={8} lg={6} key={product.id}>
          <ProductCard product={product} />
        </Col>
      ))}
    </Row>
  );
}

export default ProductGrid;