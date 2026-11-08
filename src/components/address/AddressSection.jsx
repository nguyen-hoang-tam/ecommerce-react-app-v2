import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Card, Button, Typography, message, Popconfirm } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import OptionAddress from '../card/OptionAddress'; 
import AddressFormModal from '../modal/AddressFormModal'; 
import { addAddress, updateAddress, removeAddress } from '../../features/address/addressSlice';

const { Title, Text } = Typography;

function AddressSection({ selectedAddressId, onSelectAddress }) {
  const dispatch = useDispatch();

  const addressList = useSelector((state) => state.address.list);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);

  const handleAddAddress = () => {
    setEditingAddress(null);
    setIsModalOpen(true);
  };

  const handleEditAddress = (address) => {
    setEditingAddress(address);
    setIsModalOpen(true);
  };

  const handleDeleteAddress = (id) => {
    dispatch(removeAddress(id));
    message.success('Đã xóa địa chỉ!');
    
    if (selectedAddressId === id) {
      const remaining = addressList.filter(a => a.id !== id);
      onSelectAddress(remaining.length > 0 ? remaining[0].id : null);
    }
  };

  const handleSubmitAddress = (values) => {
    if (editingAddress) {
      dispatch(updateAddress({ ...editingAddress, ...values }));
      message.success('Cập nhật địa chỉ thành công!');
    } else {
      const newAddress = { id: Date.now().toString(), ...values, isDefault: false };
      dispatch(addAddress(newAddress));
      message.success('Thêm địa chỉ thành công!');
      onSelectAddress(newAddress.id); 
    }
    setIsModalOpen(false);
  };

  return (
    <Card style={{ borderRadius: 12, marginBottom: 16 }} styles={{ body: { padding: 24 } }}>
      <Title level={4} style={{ margin: 0, fontSize: 14 }}>Địa chỉ nhận hàng</Title>
      <Text type="secondary">Vui lòng kiểm tra và xác nhận thông tin địa chỉ giao hàng của bạn.</Text>
      
      <div style={{ marginTop: 16 }}>
        {addressList.map((address) => (
          <div key={address.id} style={{ position: 'relative', marginBottom: 12 }}>
            <OptionAddress
              onEdit={handleEditAddress}
              item={address}
              isSelected={selectedAddressId === address.id}
              onSelect={() => onSelectAddress(address.id)}
            />
            <Popconfirm
              title="Xóa địa chỉ này?"
              onConfirm={() => handleDeleteAddress(address.id)}
              okText="Xóa"
              cancelText="Hủy"
              okButtonProps={{ danger: true }}
            >
              <Button 
                type="text" 
                danger 
                icon={<DeleteOutlined />} 
                style={{ position: 'absolute',margin: 'auto', top: 40, right: 42, padding: 0, height: 24, width: 24, display: 'flex', alignItems: 'center', justifyContent: 'center' }} 
              />
            </Popconfirm>
          </div>
        ))}
      </div>

      <Button 
        onClick={handleAddAddress} 
        type="dashed" 
        block 
        icon={<PlusOutlined />} 
        style={{ marginTop: 12, height: 48, borderRadius: 8 }}
      >
        Thêm địa chỉ mới
      </Button>

      <AddressFormModal
        open={isModalOpen}
        editingAddress={editingAddress}
        onSubmit={handleSubmitAddress}
        onCancel={() => setIsModalOpen(false)}
      />
    </Card>
  );
}

export default AddressSection;