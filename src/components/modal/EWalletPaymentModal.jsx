import { useState } from "react";
import { Modal, Button, Typography } from "antd";
import {
  WalletOutlined,
  CheckCircleFilled,
  SafetyOutlined,
} from "@ant-design/icons";

const { Text } = Typography;

const EWalletPaymentModal = ({
  open,
  loading = false,
  onConfirm,
  onCancel,
}) => {
  const [selectedWallet, setSelectedWallet] = useState("zalopay");

  const imgZaloPay = "https://cdn.haitrieu.com/wp-content/uploads/2022/10/Logo-ZaloPay-Square.png";
  const imgMoMo = "https://cdn.haitrieu.com/wp-content/uploads/2022/10/Logo-MoMo-Square.png";
  const imgViettelMoney = "https://cdn.tgdd.vn/2022/09/GameApp/viettel-money-200x200.jpg";
  const imgShopeePay = "https://cdn.haitrieu.com/wp-content/uploads/2022/10/Logo-ShopeePay-V.png";

  const wallets = [
    {
      key: "zalopay",
      name: "ZaloPay",
      image: imgZaloPay,
    },
    {
      key: "momo",
      name: "MoMo",
      image: imgMoMo,
    },
    {
      key: "viettelmoney",
      name: "Viettel Money",
      image: imgViettelMoney,
    },
    {
      key: "shopeepay",
      name: "ShopeePay",
      image: imgShopeePay,
    },
  ];

  const handleConfirm = () => {
    onConfirm?.({
      wallet: selectedWallet,
    });
  };

  return (
    <Modal
      open={open}
      centered
      width={500}
      title="Chọn ví điện tử"
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
          marginBottom: 18,
        }}
      >
        Vui lòng chọn ví điện tử để thanh toán đơn hàng
      </Text>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 12,
        }}
      >
        {wallets.map((wallet) => {
          const selected = selectedWallet === wallet.key;

          return (
            <div
              key={wallet.key}
              onClick={() => setSelectedWallet(wallet.key)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                minHeight: 68,
                padding: "12px 14px",
                border: `1px solid ${
                  selected ? "#1677ff" : "#e5e7eb"
                }`,
                borderRadius: 10,
                background: selected ? "#f0f7ff" : "#fff",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
            >
              <img
                src={wallet.image}
                alt={wallet.name}
                style={{
                  width: 40,
                  height: 40,
                  objectFit: "contain",
                  borderRadius: 8,
                  flexShrink: 0,
                }}
              />

              <Text
                strong
                style={{
                  flex: 1,
                  fontSize: 14,
                }}
              >
                {wallet.name}
              </Text>

              {selected && (
                <CheckCircleFilled
                  style={{
                    color: "#1677ff",
                    fontSize: 18,
                  }}
                />
              )}
            </div>
          );
        })}
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "11px 12px",
          marginTop: 18,
          marginBottom: 16,
          borderRadius: 8,
          background: "#eef6ff",
          border: "1px solid #d6e9ff",
        }}
      >
        <SafetyOutlined
          style={{
            color: "#1677ff",
            fontSize: 18,
            flexShrink: 0,
          }}
        />

        <Text
          type="secondary"
          style={{
            fontSize: 12,
            lineHeight: 1.5,
          }}
        >
          Bạn sẽ được chuyển đến ứng dụng ví điện tử để hoàn tất thanh toán
        </Text>
      </div>

      <Button
        type="primary"
        size="large"
        block
        loading={loading}
        onClick={handleConfirm}
        icon={<WalletOutlined />}
        style={{
          height: 44,
          borderRadius: 8,
          fontWeight: 600,
        }}
      >
        Thanh toán ngay
      </Button>
    </Modal>
  );
};

export default EWalletPaymentModal;