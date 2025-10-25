import { CheckCircleOutlined } from '@ant-design/icons';
import { Button, message } from 'antd';

import styled from '@modern-js/runtime/styled';

const Container = styled.div`
  padding: 20px;
  width: 100%;
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f5f5f5;
  height: 100%;
`;

export function Example() {
  return (
    <Container>
      <h1>Antd@5 Typescript Example</h1>
      <Button
        type="primary"
        icon={<CheckCircleOutlined />}
        onClick={() => {
          message.success('Click success!');
        }}
      >
        Primary Button
      </Button>
    </Container>
  );
}
