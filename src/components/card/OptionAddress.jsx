import { Radio, Typography } from 'antd';
import { EditOutlined } from '@ant-design/icons';

const { Text } = Typography;

function OptionAddress({ item, isSelected, onSelect , onEdit }) {
  return (
    <div onClick={onSelect} style={{ padding: 16, border: isSelected ? '2px solid #2a8ae4' : '1px solid #e5e5e5', borderRadius: 8, background: isSelected ? '#f0f5ff' : '#fff', display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', marginTop: 12 }}>
      <Radio checked={isSelected} style={{ accentColor: '#001529' }} />

      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Text strong>{item.name}</Text>
          {item.isDefault && <span style={{ background: '#e6f0ff', color: '#001529', fontSize: 12, padding: '2px 8px', borderRadius: 4 }}>Mặc định</span>}
        </div>
        <div style={{ color: '#666', fontSize: 13, marginTop: 4 }}>{item.phone}</div>
        <div style={{ color: '#666', fontSize: 13, marginTop: 2 }}>{item.address}</div>
      </div>

      <EditOutlined style={{ fontSize: 18, color: '#666' }} 
        onClick={() => onEdit(item)}
      /> 
    </div>
  );
}

export default OptionAddress;