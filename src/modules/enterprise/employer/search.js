import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { datetimeFormat } from '@constants';
import { globalStyles } from '@/styles';
import { options as optionHooks } from '@/hooks';
import { inputType, Search } from '@/components';

const { Content } = globalStyles;

const generateFields = ({ tenantOption }) => [
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
    name: 'date',
    label: '创建日期',
    type: inputType.rangePicker,
    inputProps: {
      placeholder: ['开始日期', '结束日期'],
      allowClear: true,
      format: datetimeFormat.date,
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
