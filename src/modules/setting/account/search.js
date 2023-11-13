import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { globalStyles } from '@/styles';
import { datetimeFormat } from '@/constants';
import { inputType, Search } from '@/components';

const { Content } = globalStyles;

const fields = [{
  name: 'userName',
  label: '用户名',
  type: inputType.input,
  inputProps: {
    placeholder: '请输入或选择',
    allowClear: true,
  },
}, {
  name: 'phoneNum',
  label: '手机号',
  type: inputType.input,
  inputProps: {
    placeholder: '请输入或选择',
    allowClear: true,
  },
}, {
  name: 'registerDate',
  label: '报名日期',
  type: inputType.rangePicker,
  inputProps: {
    placeholder: ['开始日期', '结束日期'],
    allowClear: true,
    format: datetimeFormat.date,
  },
}];

const SearchForm = ({
  onSubmit,
  openAccountModel,
}) => (
  <Content>
    <Search
      onSubmit={onSubmit}
      fields={fields}
      extra={(
        <Button
          icon={<PlusOutlined />}
          type="primary"
          ghost
          onClick={openAccountModel}
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
  openAccountModel: PropTypes.func,
};

SearchForm.defaultProps = {
  onSubmit: () => {},
  openAccountModel: () => {},
};

export default SearchForm;
