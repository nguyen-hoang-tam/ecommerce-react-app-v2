import { Row, Col, Empty, Skeleton } from 'antd';

function Grid({
  items = [],
  isLoading = false,
  renderItem,
  columns = { xs: 24, sm: 12, md: 8, lg: 6 },
  emptyText = 'Chưa có dữ liệu',
  skeletonCount = 6,
  skeletonHeight = 220,
}) {
  if (isLoading) {
    return (
      <Row gutter={[24, 24]}>
        {Array.from({ length: skeletonCount }).map((_, i) => (
          <Col {...columns} key={i}>
            <Skeleton.Image active style={{ width: '100%', height: skeletonHeight }} />
            <Skeleton active paragraph={{ rows: 2 }} />
          </Col>
        ))}
      </Row>
    );
  }

  if (!items.length) {
    return <Empty description={emptyText} style={{ padding: 60 }} />;
  }

  return (
    <Row gutter={[24, 24]}>
      {items.map((item) => (
        <Col {...columns} key={item.id}>
          {renderItem(item)}
        </Col>
      ))}
    </Row>
  );
}

export default Grid;