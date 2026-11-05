import { Modal, Button, QRCode, Typography, Divider, message } from "antd";
import { CopyOutlined } from "@ant-design/icons";

const { Text } = Typography;

const BankTransferModal = ({
  open,
  loading = false,
  onConfirm,
  onCancel,
  bankName = "Vietcombank",
  accountNumber = "123456789012",
  accountName = "CÔNG TY TNHH MISA",
  amount = 0,
  transferContent = "THANHTOAN AUT-HD-2026-0048",
  qrValue,
}) => {
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(accountNumber);
      message.success("Đã sao chép số tài khoản");
    } catch {
      message.error("Không thể sao chép số tài khoản");
    }
  };

  const handleConfirm = () => {
    onConfirm?.();
    message.success("Đã xác nhận thanh toán");
  };

  const qrData =
    qrValue ||
    `https://qr.sepay.vn/img?acc=${accountNumber}&bank=VCB&amount=${amount}&des=${encodeURIComponent(transferContent)}`;

  return (
    <Modal open={open} title="Quét mã QR để thanh toán" centered width={520} style={{ maxWidth: "calc(100vw - 32px)" }} onCancel={onCancel} footer={null} closable={!loading} mask={{ closable: !loading }} destroyOnHidden>
      <div style={{ marginTop: 8 }}>
        <Text type="secondary" style={{ display: "block", textAlign: "center", fontSize: 13, marginBottom: 16 }}>
          Vui lòng quét mã QR bằng ứng dụng ngân hàng để chuyển khoản
        </Text>

        <div style={{ display: "flex", justifyContent: "center", marginBottom: 12 }}>
          <QRCode value={qrData} size={210} bordered color="#111827" bgColor="#ffffff" errorLevel="H" />
        </div>

        <Divider plain style={{ margin: "16px 0", color: "#8c8c8c", fontSize: 13 }}>
          Hoặc chuyển khoản theo thông tin bên dưới
        </Divider>

        <div style={{ display: "flex", alignItems: "center", padding: "14px 16px", border: "1px solid #e8e8e8", borderRadius: 10, gap: 16 }}>
          <div style={{ width: "38%", display: "flex", alignItems: "center", gap: 10, borderRight: "1px solid #e8e8e8", minHeight: 48 }}>
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#e8f7ee", color: "#16864a", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700 }}>
              V
            </div>

            <Text strong style={{ fontSize: 13 }}>{bankName}</Text>
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <Text strong style={{ fontSize: 14 }}>STK: {accountNumber}</Text>
              <Button type="text" size="small" icon={<CopyOutlined />} onClick={handleCopy} style={{ color: "#1677ff" }} />
            </div>

            <Text type="secondary" style={{ fontSize: 12 }}>
              Chủ TK: {accountName}
            </Text>
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 4px", borderBottom: "1px solid #f0f0f0", marginBottom: 24 }}>
          <Text type="secondary">Số tiền thanh toán</Text>
          <Text strong style={{ color: "#1677ff", fontSize: 16 }}>{amount.toLocaleString("vi-VN")}đ</Text>
        </div>

        <Button type="primary" size="large" block loading={loading} onClick={handleConfirm} style={{ height: 44, borderRadius: 8, fontWeight: 600 }}>
          Tôi đã chuyển khoản
        </Button>

        <Text type="secondary" style={{ display: "block", textAlign: "center", fontSize: 11, marginTop: 10 }}>
          Vui lòng chỉ xác nhận sau khi bạn đã thực hiện chuyển khoản.
        </Text>
      </div>
    </Modal>
  );
};

export default BankTransferModal;