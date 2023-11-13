import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { datetimeFormat } from '@constants';
import { globalStyles } from '@/styles';
import { inputType, Search } from '@/components';

const { Content } = globalStyles;

const generateFields = () => [
  {
    label: '姓名',
    name: 'name',
    type: inputType.input,
    rules: [{ required: true }],
    inputProps: {
      placeholder: '请输入',
    },
  },
  {
    label: '身份证',
    name: 'idCard',
    type: inputType.input,
    rules: [{ required: true }],
    inputProps: {
      placeholder: '请输入',
    },
  },
  {
    label: '手机号',
    name: 'mobile',
    type: inputType.input,
    rules: [{ required: true }],
    inputProps: {
      placeholder: '请输入',
    },
  },
  {
    label: '状态',
    name: 'status',
    type: inputType.select,
    rules: [{ required: true }],
    showAllOption: false,
    inputProps: {
      placeholder: '请选择状态',
      options: [
        {
          label: '已审核',
          value: 'PASS',
        },
        {
          label: '已驳回',
          value: 'REJECT',
        },
        {
          label: '审核中',
          value: 'INIT',
        },
      ],
    },
  },
  {
    name: 'time',
    label: '转账日期',
    type: inputType.rangePicker,
    inputProps: {
      placeholder: ['开始日期', '结束日期'],
      allowClear: true,
      format: datetimeFormat.date,
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
