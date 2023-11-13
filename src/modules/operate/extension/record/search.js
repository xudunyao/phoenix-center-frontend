import React from 'react';
import { Button, Col } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types';
import { inputType, Search } from '@/components';

import { globalStyles } from '@/styles';

const { Content } = globalStyles;

const generateFields = () => [{
  name: 'name',
  label: '渠道名称',
  type: inputType.input,
  inputProps: {
    placeholder: '请输入或选择',
    allowClear: true,
  },
}];

const SearchForm = ({
  onSubmit,
  onAdd,
}) => {
  const fields = generateFields();
  return (
    <Content>
      <Search
        onSubmit={onSubmit}
        fields={fields}
        extra={(
          <Col>
            <Button
              type="primary"
              ghost
              onClick={onAdd}
              icon={<PlusOutlined />}
            >
              新增
            </Button>
          </Col>
        )}
      />
    </Content>
  );
};

SearchForm.propTypes = {
  onSubmit: PropTypes.func,
  onAdd: PropTypes.func,
};

SearchForm.defaultProps = {
  onSubmit: () => {},
  onAdd: () => {},
};

export default SearchForm;
