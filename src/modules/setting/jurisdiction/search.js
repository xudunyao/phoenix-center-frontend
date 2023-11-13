import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { globalStyles } from '@/styles';
import { datetimeFormat } from '@/constants';
import { inputType, Search } from '@/components';

const { Content } = globalStyles;

const fields = [
  {
    name: 'name',
    label: '角色名',
    type: inputType.input,
    inputProps: {
      placeholder: '请输入或选择',
      allowClear: true,
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
