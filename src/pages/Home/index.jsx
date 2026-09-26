import AppLayout from '../../components/layout/AppLayout';
import { Link } from 'react-router-dom';
import bannerImg from '../../images/banner-girl.png';
import { ProductGrid } from '@/components/product';
import { ArrowRightOutlined } from '@ant-design/icons';

const imgProduct = 'https://bizweb.dktcdn.net/thumb/1024x1024/100/082/372/products/img-6532-1.jpg?v=1739365920343'

const mockProducts = [
  { id: '1', name: 'Kính mát Rayban', price: 1200000, image: imgProduct, brand: 'Rayban', },
  { id: '2', name: 'Kính cận gọng vàng', price: 350000, image: imgProduct, brand: 'Salinaka', },
  { id: '3', name: 'Kính mát Gentle Monster', price: 2500000, image:imgProduct, brand: 'Gentle Monster', },
  { id: '4', name: 'Kính mát thể thao', price: 450000, image:imgProduct, brand: 'Nike'},
  { id: '4', name: 'Kính mát thể thao', price: 450000, image: imgProduct, brand: 'Nike'},
  { id: '4', name: 'Kính mát thể thao', price: 450000, image: imgProduct, brand: 'Nike'},
  { id: '4', name: 'Kính mát thể thao', price: 450000, image: imgProduct, brand: 'Nike'},
  { id: '4', name: 'Kính mát thể thao', price: 450000, image: imgProduct, brand: 'Nike'},
];

function Homepage() {
  return (
    <AppLayout>
      <main style={{ width: '100%', padding: '18px 32px 40px', animation: 'fadeIn 0.5s ease' }}>
        <section style={{ width: '100%', height: 400, background: '#ebebeb', display: 'flex', overflow: 'hidden' }}>
          <div style={{ width: '50%', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '48px 64px' }}>
            <h1 style={{ fontWeight: 400, fontSize: 48, lineHeight: 1.15, margin: 0 }}><strong>See</strong> everything with <strong>Clarity</strong></h1>
            <p style={{ color: '#4a4a4a', lineHeight: 1.8, maxWidth: 520, margin: '24px 0' }}>Buying eyewear should leave you happy and good-looking, with money in your pocket. Glasses, sunglasses, and contacts—we’ve got your eyes covered.</p>
            <Link to="/shop" style={{ background: '#101010', padding: '12px 20px', color: '#fff', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, textDecoration: 'none', width: 182 }}>Shop Now <ArrowRightOutlined /></Link>
          </div>
          <div style={{ width: '50%', height: '100%', overflow: 'hidden' }}>
            <img src={bannerImg} alt="Eyewear" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }} />
          </div>
        </section>

        <section style={{ marginTop: 56 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
            <h2 style={{ fontSize: 32, fontWeight: 600, margin: 0 }}>Sản phẩm nổi bật</h2>
            <Link to="/shop" style={{ color: '#101010', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6 }}>Xem tất cả <ArrowRightOutlined /></Link>
          </div>
          <ProductGrid products={mockProducts} isLoading={false} />
        </section>
      </main>
    </AppLayout>
  );
}

export default Homepage;