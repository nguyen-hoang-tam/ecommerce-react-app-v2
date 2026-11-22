import { Card } from 'antd';
import { Link } from 'react-router-dom';

function RelatedProductCard({ product }) {
  const { id, name, price, image, stock, sold, brand, originalPrice } = product;

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
         <p
        style={{
          color: '#999',
          fontSize: 14,
          margin: '0 0 4px'
        }}
      >
        {brand}
      </p>

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

       <div
        style={{
          display: 'flex',
          alignItems: 'baseline',
          justifyContent: 'space-between',
          gap: 8,
          marginBottom: 16
        }}
      >
        <span
          style={{
            fontSize: 16,
            fontWeight: 700,
            color: '#111',
            lineHeight: 1
          }}
        >
          {price?.toLocaleString('vi-VN')}đ
        </span>

        {originalPrice && (
          <span
            style={{
              color: '#999',
              fontSize: 15,
              textDecoration: 'line-through',
              whiteSpace: 'nowrap'
            }}
          >
            {originalPrice?.toLocaleString('vi-VN')}đ
          </span>
        )}
      </div>

        <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderTop: '1px solid #f0f0f0',
          paddingTop: 14,
        }}
      >
        <span
          style={{
            color: '#666',
            fontSize: 14
          }}
        >
          {stock} cổ phần
        </span>

        <span
          style={{
            color: '#666',
            fontSize: 14
          }}
        >
          {sold} đã bán
        </span>
      </div>
      </Card>
    </Link>
  );
}

export default RelatedProductCard;