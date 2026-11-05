import { Modal, Button, Form, Input, Typography } from "antd";
import {
  CreditCardOutlined,
  UserOutlined,
  CalendarOutlined,
  LockOutlined,
} from "@ant-design/icons";

const { Text } = Typography;

const CardPaymentModal = ({
  open,
  loading = false,
  onConfirm,
  onCancel,
}) => {
  const [form] = Form.useForm();

  const imgBank = "https://shinhanfinance.com.vn/-/nginx-cms/assets/site/Th%E1%BA%BB-t%C3%ADn-d%E1%BB%A5ng-3.8-new_Ti%E1%BA%BFng-Vi%E1%BB%87t-1-1.png"

  const handleConfirm = async () => {
    try {
      const values = await form.validateFields();
      onConfirm?.(values);
    } catch {
      return;
    }
  };

  return (
    <Modal
      open={open}
      centered
      width={500}
      title="Nhập thông tin thẻ"
      onCancel={onCancel}
      footer={null}
      closable={!loading}
      mask={{ closable: !loading }}
      destroyOnHidden
      styles={{
        body: {
          paddingTop: 0,
        },
      }}
    >
      <Text
        type="secondary"
        style={{
          display: "block",
          fontSize: 13,
          marginBottom: 16,
        }}
      >
        Vui lòng nhập thông tin thẻ để thanh toán đơn hàng
      </Text>

     <img
      src={imgBank}
       style={{
        width: "100%",
        objectFit: "contain",
        borderRadius: "32px", 
        border: "1px solid #f0f0f0", 
        padding: 2, 
        marginBottom: 16,
     }}
    />

      <Form
        form={form}
        layout="vertical"
        requiredMark
        autoComplete="off"
      >
        <Form.Item
          label="Số thẻ"
          name="cardNumber"
          rules={[
            {
              required: true,
              message: "Vui lòng nhập số thẻ",
            },
            {
              pattern: /^[0-9\s]{13,23}$/,
              message: "Số thẻ không hợp lệ",
            },
          ]}
        >
          <Input
            size="large"
            prefix={<CreditCardOutlined />}
            placeholder="Nhập số thẻ"
            maxLength={19}
          />
        </Form.Item>

        <Form.Item
          label="Tên chủ thẻ"
          name="cardHolder"
          rules={[
            {
              required: true,
              message: "Vui lòng nhập tên chủ thẻ",
            },
          ]}
        >
          <Input
            size="large"
            prefix={<UserOutlined />}
            placeholder="Nhập tên chủ thẻ (không dấu)"
            style={{
              textTransform: "uppercase",
            }}
          />
        </Form.Item>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 16,
          }}
        >
          <Form.Item
            label="Ngày hết hạn"
            name="expiryDate"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập ngày hết hạn",
              },
              {
                pattern: /^(0[1-9]|1[0-2])\/\d{2}$/,
                message: "Định dạng MM/YY",
              },
            ]}
          >
            <Input
              size="large"
              prefix={<CalendarOutlined />}
              placeholder="MM/YY"
              maxLength={5}
            />
          </Form.Item>

          <Form.Item
            label="CVV"
            name="cvv"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập CVV",
              },
              {
                pattern: /^\d{3,4}$/,
                message: "CVV không hợp lệ",
              },
            ]}
          >
            <Input.Password
              size="large"
              prefix={<LockOutlined />}
              placeholder="Nhập CVV"
              maxLength={4}
            />
          </Form.Item>
        </div>

        <Button
          type="primary"
          size="large"
          block
          loading={loading}
          onClick={handleConfirm}
          icon={<CreditCardOutlined />}
          style={{
            height: 44,
            marginTop: 4,
            borderRadius: 8,
            fontWeight: 600,
          }}
        >
          Thanh toán ngay
        </Button>

      </Form>
    </Modal>
  );
};

export default CardPaymentModal;