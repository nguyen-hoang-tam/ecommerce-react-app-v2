
import { Button, Card } from 'antd';
import { ShoppingCartOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '@/features/cart';

function ProductCard({ product }) {
    const { id, name, price, originalPrice, image, brand, stock, sold, isBestSeller } = product;
    const navigate = useNavigate();
    const dispatch = useDispatch();

  const handleClickCard = () => {
    navigate(`/productdetail/${id}`);
  };

  const ClickshoppingCard = () => {
    const cartItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      brand: product.brand,
      quantity: 1
    };
      navigate(`/addtocart/${id}`);
      dispatch(addToCart(cartItem)); 
      console.log('Product add to cart', cartItem)
    }


return (
  <Card
    onClick={handleClickCard}
    hoverable
    style={{
      width: '100%',
      borderRadius: 12,
      overflow: 'hidden'
    }}
    styles={{
      body: {
        padding: 16
      }
    }}
    cover={
      <Link to={`/product/${id}`}>
        <div
          style={{
            height: 220,
            overflow: 'hidden',
            background: '#f5f5f5'
          }}
        >
          <img
            src={image}
            alt={name}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
          />
        </div>
      </Link>
    }
  >
    <div>
      <p
        style={{
          color: '#999',
          fontSize: 14,
          margin: '0 0 4px'
        }}
      >
        {brand}
      </p>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 8,
          marginBottom: 12
        }}
      >
        <Link
          to={`/product/${id}`}
          style={{
            minWidth: 0,
            flex: 1
          }}
        >
          <h4
            style={{
              fontSize: 16,
              fontWeight: 700,
              margin: 0,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              color: '#111'
            }}
          >
            {name}
          </h4>
        </Link>

        {isBestSeller && (
          <span
            style={{
              flexShrink: 0,
              color: '#999',
              fontSize: 12,
              fontWeight: 500
            }}
          >
            Best Seller
          </span>
        )}
      </div>

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
          marginBottom: 16
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

      <div
        style={{
          display: 'flex',
          gap: 8
        }}
        className="action-btn"
      >
        <Button
          onClick={(e) => {
            e.stopPropagation();
            ClickshoppingCard();
          }}
          icon={<ShoppingCartOutlined />}
          size="large"
          style={{
            width: 48,
            height: 48,
            flexShrink: 0,
            background: '#fff',
            borderColor: '#111',
            color: '#111',
            borderRadius: 10
          }}
        />

        <Button
          onClick={(e) => {
            e.stopPropagation();
            handleClickCard();
          }}
          type="primary"
          size="large"
          style={{
            flex: 1,
            height: 48,
            background: '#101010',
            color: '#fff',
            fontWeight: 500,
            borderRadius: 10
          }}
        >
          Mua ngay
        </Button>
      </div>
    </div>
  </Card>
);
}

export default ProductCard;