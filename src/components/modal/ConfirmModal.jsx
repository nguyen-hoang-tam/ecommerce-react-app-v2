import { Modal } from "antd";

const ConfirmModal = ({
  open,
  title = "Xác nhận",
  content = "Bạn có chắc chắn muốn thực hiện hành động này?",
  okText = "Xác nhận",
  cancelText = "Hủy",
  type = "default",
  loading = false,
  onConfirm,
  onCancel,
}) => {
  const isDanger = type === "danger";

  return (
    <Modal
      open={open}
      title={title}
      centered
      okText={okText}
      cancelText={cancelText}
      okButtonProps={{
        danger: isDanger,
        loading,
      }}
      onOk={onConfirm}
      onCancel={onCancel}
      closable={!loading}
      maskClosable={!loading}
      cancelButtonProps={{ disabled: loading }}
    >
      {content}
    </Modal>
  );
};

export default ConfirmModal;