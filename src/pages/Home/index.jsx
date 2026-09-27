import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ArrowRightOutlined } from '@ant-design/icons';
import AppLayout from '@/components/layout/AppLayout';
import bannerImg from '@/images/banner-girl.png';
import { Grid } from '../../components/product';
import { ProductCard } from '../../components/product';
import { RelatedProductCard } from '../../components/product';
import { fetchProducts } from '@/features/product';

function Homepage() {
  const dispatch = useDispatch();
  const { items, isLoading, error } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  if (error) return <p>Lỗi: {error}</p>;

  const featuredProducts = items.slice(0, 6);
  const suggestedProducts = items.slice(6, 12);

  return (
    <AppLayout>
      <main style={{ width: '100%', padding: '18px 32px 40px', animation: 'fadeIn 0.5s ease' }}>
        <section style={{ width: '100%', height: 400, background: '#ebebeb', display: 'flex', overflow: 'hidden' }}>
          <div style={{ width: '50%', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '48px 64px' }}>
            <h1 style={{ fontWeight: 400, fontSize: 48, lineHeight: 1.15, margin: 0 }}>
              <strong>See</strong> everything with <strong>Clarity</strong>
            </h1>
            <p style={{ color: '#4a4a4a', lineHeight: 1.8, maxWidth: 520, margin: '24px 0' }}>
              Buying eyewear should leave you happy and good-looking, with money in your pocket.
            </p>
            <Link
              to="/shop"
              style={{ background: '#101010', padding: '12px 20px', color: '#fff', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, textDecoration: 'none', width: 182 }}
            >
              Shop Now <ArrowRightOutlined />
            </Link>
          </div>
          <div style={{ width: '50%', height: '100%', overflow: 'hidden' }}>
            <img src={bannerImg} alt="Eyewear" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }} />
          </div>
        </section>
    
        <section style={{ marginTop: 56 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
            <h2 style={{ fontSize: 24, fontWeight: 600, margin: 0 }}>Sản phẩm nổi bật</h2>
            <Link to="/shop" style={{ color: '#101010', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6 }}>
              Xem tất cả <ArrowRightOutlined />
            </Link>
          </div>
          <Grid items={featuredProducts} loading={isLoading} renderItem={(product) => <ProductCard product={product} />} />

          <section style={{ marginTop: 56 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
            <h2 style={{ fontSize: 24, fontWeight: 600, margin: 0 }}>Sản phẩm đề xuất</h2>
            <Link to="/shop" style={{ color: '#101010', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6 }}>
              Xem tất cả <ArrowRightOutlined />
            </Link>
          </div>
          <Grid items={suggestedProducts} loading={isLoading} renderItem={(product) => <RelatedProductCard product={product} />} />
        </section>
        </section>

      </main>
    </AppLayout>
  );
}

export default Homepage;