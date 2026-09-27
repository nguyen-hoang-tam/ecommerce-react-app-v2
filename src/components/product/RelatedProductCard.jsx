import { Card } from 'antd';
import { Link } from 'react-router-dom';

function RelatedProductCard({ product }) {
  const { id, name, price, image } = product;

  return (
    <Link to={`/product/${id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
      <Card
        hoverable
        style={{ width: '100%', borderRadius: 12, overflow: 'hidden' }}
        styles={{ body: { padding: 16 } }}
        cover={
          <div style={{ height: 220, overflow: 'hidden', background: '#f5f5f5' }}>
            <img
              src={image}
              alt={name}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
        }
      >
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

        <h3 style={{ color: '#111', fontWeight: 700, margin: 0 }}>
          {price?.toLocaleString('vi-VN')}đ
        </h3>
      </Card>
    </Link>
  );
}

export default RelatedProductCard;