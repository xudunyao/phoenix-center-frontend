import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { globalStyles } from '@/styles';
import { datetimeFormat, approvalOptions } from '@/constants';
import { inputType, Search } from '@/components';

const { Content } = globalStyles;

const fields = [
  {
    name: 'status',
    label: '状态',
    type: inputType.select,
    inputProps: {
      placeholder: '请选择状',
      options: approvalOptions,
    },
  },
  {
    name: 'date',
    label: '日期',
    type: inputType.rangePicker,
    inputProps: {
      placeholder: ['开始日期', '结束日期'],
      allowClear: true,
      format: datetimeFormat.date,
    },
  },
];

const SearchForm = ({ onSubmit, onClick }) => (
  <Content>
    <Search
      onSubmit={onSubmit}
      fields={fields}
      extra={(
        <Button
          icon={<PlusOutlined />}
          type="primary"
          ghost
          onClick={onClick}
          style={{ marginLeft: 10 }}
        >
          新增
        </Button>
      )}
    />
  </Content>
);

SearchForm.propTypes = {
  onSubmit: PropTypes.func,
  onClick: PropTypes.func,
};

SearchForm.defaultProps = {
  onSubmit: () => {},
  onClick: () => {},
};

export default SearchForm;
