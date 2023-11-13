import React from 'react';
import { Button, Col } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types';
import { inputType, Search } from '@/components';

import { globalStyles } from '@/styles';

const { Content } = globalStyles;

const generateFields = () => [
  {
    name: 'name',
    label: '广告名称',
    type: inputType.input,
    inputProps: {
      placeholder: '请输入或选择',
      allowClear: true,
    },
  },
  {
    name: 'putPosition',
    label: '投放位置',
    type: inputType.select,
    showAllOption: false,
    inputProps: {
      allowClear: true,
      placeholder: '请输入或选择',
      options: [
        {
          value: 'HOME_BANNER',
          label: '首页Banner',
        },
        {
          value: 'HOME_POP',
          label: '首页弹窗',
        },
      ],
    },
  },
  {
    name: 'status',
    label: '发布状态',
    type: inputType.select,
    showAllOption: false,
    inputProps: {
      allowClear: true,
      placeholder: '请输入或选择',
      options: [
        {
          value: 'PUBLISHED',
          label: '已发布',
        },
        {
          value: 'PENDING',
          label: '待发布',
        },
        {
          value: 'TAKE_DOWN',
          label: '已下线',
        },
      ],
    },
  },
];

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
