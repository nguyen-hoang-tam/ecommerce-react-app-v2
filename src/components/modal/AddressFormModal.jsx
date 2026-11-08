import { useEffect } from 'react';
import { Modal, Form, Input, Button } from 'antd';

const AddressFormModal = ({
  open,
  loading = false,
  editingAddress = null,
  onSubmit,
  onCancel,
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (open) {
      if (editingAddress) {
        form.setFieldsValue(editingAddress);
      } else {
        form.resetFields();
      }
    }
  }, [open, editingAddress, form]);

  const handleFinish = (values) => {
    onSubmit?.(values);
  };

  return (
    <Modal
      title={editingAddress ? "Chỉnh sửa địa chỉ" : "Thêm địa chỉ mới"}
      open={open}
      onCancel={onCancel}
      footer={null}
      width={500}
      centered
      destroyOnHidden
      closable={!loading}
      mask={{ closable: !loading }}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        style={{ marginTop: 16 }}
      >
        <Form.Item
          name="name"
          label="Họ và tên"
          rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}
        >
          <Input size="large" placeholder="Nguyễn Văn A" />
        </Form.Item>

        <Form.Item
          name="phone"
          label="Số điện thoại"
          rules={[
            { required: true, message: 'Vui lòng nhập SĐT!' },
            { pattern: /^[0-9]{10,11}$/, message: 'SĐT không hợp lệ!' }
          ]}
        >
          <Input size="large" placeholder="0912345678" />
        </Form.Item>

        <Form.Item
          name="address"
          label="Địa chỉ"
          rules={[{ required: true, message: 'Vui lòng nhập địa chỉ!' }]}
        >
          <Input.TextArea rows={3} size="large" placeholder="Số nhà, đường, quận, thành phố" />
        </Form.Item>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
          <Button size="large" onClick={onCancel} disabled={loading}>
            Hủy
          </Button>
          <Button
            type="primary"
            size="large"
            htmlType="submit"
            loading={loading}
            style={{ background: '#001529', borderColor: '#001529' }}
          >
            Lưu địa chỉ
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default AddressFormModal;