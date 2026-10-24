import { useState } from 'react';
import { Modal, Input, Button, Typography, Tag, message, Checkbox } from 'antd';
import { TagOutlined, CheckCircleFilled } from '@ant-design/icons';

const { Text } = Typography;

function VoucherModal({ open, onClose, onApply, vouchers = [] }) {
  const [code, setCode] = useState('');
  const [selectedVoucher, setSelectedVoucher] = useState(null);

  const handleSelectVoucher = (voucher) => {
    setSelectedVoucher(voucher);
    setCode(voucher.code);
  };

  const handleApplyCode = () => {
    const trimmed = code.trim().toUpperCase();

    if (!trimmed) {
      message.error('Vui long nhập mã giảm giá!');
      return;
    }

    const found = vouchers.find((v) => v.code === trimmed);
    console.log(found);

    if (!found) {
      message.error('Mã giảm giá không tồn tại!');
      return;
    }

    onApply(found);
    setCode('');
    setSelectedVoucher(null);
    onClose();
    console.log('Apply voucher', found);
  };

  const formatDiscount = (voucher) => {
    if (voucher.type === 'fixed') {
      return `Giảm ${voucher.value.toLocaleString('vi-VN')}đ`;
    }
    return `Giảm ${voucher.value}%`;
  };

  return (
    <Modal
      title="Chọn mã giảm giá"
      open={open}
      onCancel={onClose}
      footer={null}
      width={500}
      centered
    >
      <div style={{ display: 'flex', gap: 8, marginBottom: 8, marginTop: 16 }}>
        <Input
          size="large"
          placeholder="Nhập mã giảm giá"
          prefix={<TagOutlined />}
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          onPressEnter={handleApplyCode}
        />
        <Button
          type="primary"
          size="large"
          onClick={handleApplyCode}
          style={{ background: '#001529', borderColor: 'rgb(42, 138, 228);' }}
        >
          Áp dụng
        </Button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 12, maxHeight: 400, overflowY: 'auto' }}>
        {vouchers.length === 0 ? (
          <div style={{ padding: 24, textAlign: 'center', color: '#999' }}>
            Không có mã giảm giá nào
          </div>
        ) : (
          vouchers.map((voucher) => {
            const isSelected = selectedVoucher?.id === voucher.id;

            return (
              <div
                key={voucher.id}
                onClick={() => handleSelectVoucher(voucher)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: 16,
                  border: isSelected ? '2px solid rgb(42, 138, 228)' : '1px dashed #d9d9d9',
                  borderRadius: 8,
                  background: isSelected ? '#f0f5ff' : '#fff',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                <div style={{ fontSize: 24, color: '#001529' }}>
                  <TagOutlined />
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <Tag color="#001529">{voucher.code}</Tag>
                    {isSelected && <CheckCircleFilled style={{ color: '#52c41a' }} />}
                  </div>

                  <Text strong style={{ fontSize: 14 }}>
                    {formatDiscount(voucher)}
                  </Text>

                  <div style={{ color: '#888', fontSize: 12, marginTop: 4 }}>
                    Đơn tối thiểu {voucher.minOrder.toLocaleString('vi-VN')}đ
                  </div>
                </div>

                <Checkbox checked={isSelected} onChange={() => handleSelectVoucher(voucher)} />
              </div>
            );
          })
        )}
      </div>
    </Modal>
  );
}

export default VoucherModal;