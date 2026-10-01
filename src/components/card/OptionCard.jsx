import { Radio } from 'antd';

function OptionCard({ item, isSelected, onSelect }) {
  return (
    <div
      onClick={onSelect}
      style={{
        padding: 16,
        border: isSelected ? '2px solid #0084ff' : '1px solid #e5e5e5',
        borderRadius: 8,
        background: isSelected ? '#f0f5ff' : '#fff',
        height: '100%',
        cursor: 'pointer',
        position: 'relative',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: 20, color: isSelected ? '#001529' : '#666' }}>
          {item.icon}
        </span>
        <Radio checked={isSelected} style={{ accentColor: '#001529' }} />
      </div>

      <div style={{ fontWeight: 600, marginTop: 8, fontSize: 14 }}>
        {item.title}
      </div>

      <div style={{ color: '#888', fontSize: 13, marginTop: 4 }}>
        {item.desc}
      </div>

      {item.price !== undefined && (
        <div style={{ color: item.price === 0 ? '#52c41a' : '#111', fontWeight: 600, marginTop: 8 }}>
          {item.price === 0 ? 'Miễn phí' : `${item.price.toLocaleString('vi-VN')}đ`}
        </div>
      )}
    </div>
  );
}

export default OptionCard;