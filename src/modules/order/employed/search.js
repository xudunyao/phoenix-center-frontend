import React, { useRef, useState } from 'react';
import { Form, Button } from 'antd';
import { CloudDownloadOutlined, FileDoneOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types';
import moment from 'moment';
import { datetimeFormat, exportType } from '@constants';
import { inputType, Search } from '@/components';
import { options as optionHooks } from '@/hooks';
import ExportRecordDrawer from '@/modules/components/exportRecordDrawer';

import { globalStyles } from '@/styles';

const { Content } = globalStyles;

const generateFields = ({
  tenantOption,
  typeOfWork,
  joinedStatus,
}) => [{
  name: 'tenantId',
  label: '劳务公司',
  type: inputType.select,
  inputProps: {
    placeholder: '请输入或选择',
    allowClear: true,
    options: tenantOption,
  },
}, {
  name: 'keywords',
  label: '姓名',
  type: inputType.input,
  inputProps: {
    placeholder: '请输入或选择',
    allowClear: true,
  },
}, {
  name: 'mobile',
  label: '手机号',
  type: inputType.input,
  inputProps: {
    placeholder: '请输入或选择',
    allowClear: true,
  },
}, {
  name: 'coreCompany',
  label: '用工单位',
  type: inputType.input,
  inputProps: {
    placeholder: '请输入或选择',
    allowClear: true,
  },
}, {
  name: 'typeOfWork',
  label: '岗位类型',
  type: inputType.select,
  inputProps: {
    placeholder: '请输入或选择',
    allowClear: true,
    options: typeOfWork,
  },
}, {
  name: 'status',
  label: '状态',
  type: inputType.select,
  inputProps: {
    placeholder: '请输入或选择',
    allowClear: true,
    options: joinedStatus,
  },
}, {
  name: 'entryDate',
  label: '入职日期',
  type: inputType.rangePicker,
  inputProps: {
    placeholder: ['开始日期', '结束日期'],
    allowClear: true,
    format: datetimeFormat.date,
  },
}];

const SearchForm = ({
  onSubmit,
  exportHandle,
}) => {
  const formRef = useRef(null);
  const { tenantOption } = optionHooks.useTenantOption();
  const { typeOfWork } = optionHooks.useTypeOfWork();
  const { joinedStatus } = optionHooks.useJoinedStatus();
  const [exportRecordDrawerVisible, setExportRecordDrawerVisible] = useState(false);
  const fields = generateFields({ tenantOption, typeOfWork, joinedStatus });

  const handleExport = async (form) => {
    exportHandle(form.getFieldValue());
  };
  const exportRecordSearchCriteria = fields.map((f) => {
    let render;
    switch (f.name) {
      case 'tenantId':
        render = (search) => tenantOption.find((o) => o.value === search?.tenantId)?.label;
        break;
      case 'status':
        render = (search) => joinedStatus.find((o) => o.value === search?.status)?.label;
        break;
      case 'typeOfWork':
        render = (search) => typeOfWork.find((o) => o.value === search?.typeOfWork)?.label;
        break;
      case 'entryDate':
        render = (search) => search?.entryDateStart && `${search?.entryDateStart ? moment(search?.entryDateStart).format(datetimeFormat.date) : ''} - ${search?.entryDate ? moment(search?.entryDateEnd).format(datetimeFormat.date) : ''}`;
        break;
      default:
        break;
    }
    return {
      key: f.name,
      label: f.label,
      render,
    };
  });

  return (
    <Content>
      <Search
        onSubmit={onSubmit}
        fields={fields}
        getForm={(form) => { formRef.current = form; }}
        extra={(
          <Form.Item style={{ marginLeft: 10 }}>
            <Button.Group>
              <Button
                icon={<CloudDownloadOutlined />}
                type="primary"
                onClick={() => handleExport(formRef?.current)}
              >
                导出
              </Button>
              <Button
                icon={<FileDoneOutlined />}
                type="primary"
                ghost
                onClick={() => setExportRecordDrawerVisible(true)}
                title="导出记录"
              >
                导出记录
              </Button>
            </Button.Group>
          </Form.Item>
        )}
      />
      <ExportRecordDrawer
        visible={!!exportRecordDrawerVisible}
        type={exportType.joined}
        searchCriteria={exportRecordSearchCriteria}
        onClose={() => setExportRecordDrawerVisible(false)}
      />
    </Content>
  );
};

SearchForm.propTypes = {
  onSubmit: PropTypes.func,
  exportHandle: PropTypes.func,
};

SearchForm.defaultProps = {
  onSubmit: () => {},
  exportHandle: () => {},
};

export default SearchForm;
