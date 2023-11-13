import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Form } from 'antd';
import moment from 'moment';
import { datetimeFormat } from '@constants';
import { CloudDownloadOutlined, FileDoneOutlined } from '@ant-design/icons';
import { globalStyles } from '@/styles';
import { options as optionHooks } from '@/hooks';
import { inputType, Search } from '@/components';
import ExportRecordDrawer from '@/modules/components/exportRecordDrawer';

const { Content } = globalStyles;

const generateFields = () => [
  {
    name: 'mobile',
    label: '手机号',
    type: inputType.input,
    inputProps: {
      placeholder: '请输入',
    },
  },
  {
    name: 'name',
    label: '姓名',
    type: inputType.input,
    inputProps: {
      placeholder: '请输入姓名',
    },
  },
  {
    name: 'idCard',
    label: '身份证号',
    type: inputType.input,
    inputProps: {
      placeholder: '请输入',
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
  {
    name: 'payStatus',
    label: '支付状态',
    type: inputType.select,
    inputProps: {
      placeholder: '请选择',
      options: [
        {
          value: 'SUCCESS',
          label: '成功',
        },
        {
          value: 'FAIL',
          label: '失败',
        },
      ],
    },
  },
];
const SearchForm = ({ onSubmit }) => {
  const fields = generateFields();
  return (
    <Content>
      <Search onSubmit={onSubmit} fields={fields} />
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
