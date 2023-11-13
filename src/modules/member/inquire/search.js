import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { SearchOutlined } from '@ant-design/icons';
import {
  Button, Checkbox, Form, Input, Row, Col, Space,
} from 'antd';
import { globalStyles } from '@/styles';
// import { options as optionHooks } from '@/hooks';
import { inputType, Search } from '@/components';

const { Content } = globalStyles;

const SearchForm = ({ onSubmit, reset }) => {
  const [form] = Form.useForm();
  return (
    <Content>
      <Form
        form={form}
        onFinish={onSubmit}
      >
        <Row>
          <Col>
            <Form.Item
              label="身份证"
              name="identityCard"
              rules={[
                {
                  required: true,
                  message: '请输入身份证号',
                },
              ]}
            >
              <Input placeholder="请输入" />
            </Form.Item>
          </Col>
          <Col>
            <Space size={10}>
              <Button icon={<SearchOutlined />} type="primary" htmlType="submit" style={{ marginLeft: '15px' }}>搜索</Button>
              <Button
                onClick={() => {
                  form.resetFields();
                  reset();
                }}
              >
                重置
              </Button>
            </Space>
          </Col>
        </Row>
      </Form>
    </Content>
  );
};

SearchForm.propTypes = {
  onSubmit: PropTypes.func,
  reset: PropTypes.func,
};

SearchForm.defaultProps = {
  onSubmit: () => {},
  reset: () => {},
};

export default SearchForm;
