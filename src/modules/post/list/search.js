import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { globalStyles } from '@/styles';
import { options as optionHooks } from '@/hooks';
import { inputType, Search } from '@/components';

const { Content } = globalStyles;

const generateFields = ({ tenantOption }) => [
  {
    label: '劳务公司',
    name: 'tenantId',
    type: inputType.select,
    rules: [{ required: true }],
    inputProps: {
      placeholder: '请选择',
      options: tenantOption,
    },
  },
  {
    label: '用工单位名称',
    name: 'coreCompanyName',
    type: inputType.input,
    rules: [{ required: true }],
    inputProps: {
      placeholder: '请输入',
    },
  },
  {
    name: 'positionName',
    label: '岗位名称',
    type: inputType.input,
    inputProps: {
      placeholder: '请输入',
      allowClear: true,
    },
  },
  {
    name: 'date',
    label: '创建日期',
    type: inputType.rangePicker,
    inputProps: {
      allowClear: true,
      placeholder: ['开始日期', '结束日期'],
      format: 'YYYY-MM-DD',
    },
  },
];
const SearchForm = ({ onSubmit }) => {
  const { tenantOption } = optionHooks.useTenantOption();
  const fields = generateFields({ tenantOption });
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
