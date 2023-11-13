import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Button, Row, Space, Col, Modal, Form,
} from 'antd';
import { DownloadOutlined, PlusOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'antd/lib/form/Form';
import { globalStyles } from '@/styles';
import { inputType, Search, FormItem } from '@/components';

const fields = [
  {
    label: '企业名称',
    name: 'name',
    type: inputType.input,
    rules: [{ required: true }],
    inputProps: {
      placeholder: '请输入企业名称',
    },
  },
  {
    label: '管理员',
    name: 'adminName',
    type: inputType.input,
    rules: [{ required: true }],
    inputProps: {
      placeholder: '请输入管理员',
    },
  },
  {
    label: '管理员账号',
    name: 'adminAccount',
    type: inputType.input,
    rules: [{ required: true }],
    inputProps: {
      placeholder: '请输入管理员账号',
    },
  },
];
const { Content } = globalStyles;

const SearchForm = ({ onSubmit }) => {
  const navigate = useNavigate();
  const handleAdd = () => {
    navigate('/enterprise/labour-services/add');
  };
  return (
    <Content>
      <Search
        onSubmit={onSubmit}
        fields={fields}
        extra={(
          <Button
            icon={<PlusOutlined />}
            type="primary"
            ghost
            onClick={handleAdd}
            style={{ marginLeft: 10 }}
          >
            新增
          </Button>
        )}
      />
    </Content>
  );
};

SearchForm.propTypes = {
  onSubmit: PropTypes.func,
};

SearchForm.defaultProps = {
  onSubmit: () => {},
};

export default SearchForm;
