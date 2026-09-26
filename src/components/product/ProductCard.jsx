
import { Button, Card, Tag } from 'antd';
import { ShoppingCartOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';

function ProductCard({ product }) {
  const { id, name, price, image, brand } = product;

  return (
    <Card
      hoverable
      style={{ width: '100%', borderRadius: 12, overflow: 'hidden' }}
      styles={{ body: { padding: 16 } }}
      cover={
        <Link to={`/product/${id}`}>
          <div style={{ height: 220, overflow: 'hidden', background: '#f5f5f5' }}>
            <img
              src={image}
              alt={name}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
        </Link>
      }
    >
      <div style={{ minHeight: 110 }}>
        <p style={{ color: '#999', fontSize: 13, marginBottom: 4 }}>{brand}</p>

        <Link to={`/product/${id}`}>
          <h4
            style={{
              fontSize: 16,
              fontWeight: 600,
              marginBottom: 8,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {name}
          </h4>
        </Link>

        <h3 style={{ color: '#111', fontWeight: 700, marginBottom: 12 }}>
          {price?.toLocaleString('vi-VN')}đ
        </h3>
      </div>

          <div style={{display: 'flex'}} className='action-btn'>
        <Button
        type="text"
        icon={<ShoppingCartOutlined />}
        block
        size="large"
      >
        Thêm vào giỏ
          </Button>
          
        <Button
        type="primary"
        block
        size="large"
      >
        Mua ngay
        </Button>
      </div>
    </Card>
  );
}

export default ProductCard;