import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { CloudDownloadOutlined, FileDoneOutlined } from '@ant-design/icons';
import { datetimeFormat } from '@constants';
import {
  Button, Form,
} from 'antd';
import { inputType, Search } from '@/components';
import { options as optionHooks } from '@/hooks';
import stringName from '../constants';
import ExportRecordDrawer from '@/modules/components/exportRecordDrawer';

const fieldsArrData = (selectData = null, stageEnum = null) => [
  {
    label: '用户姓名',
    name: stringName.memberId,
    type: inputType.select,
    rules: [{ required: true }],
    showAllOption: false,
    inputProps: {
      allowClear: true,
      style: { width: '180px' },
      dropdownMatchSelectWidth: 350,
      showSearch: true,
      optionFilterProp: 'label',
      placeholder: '请输入',
      options: selectData || [],
    },
  },
  {
    label: '状态',
    name: stringName.stage,
    type: inputType.select,
    showAllOption: false,
    inputProps: {
      placeholder: '请输入',
      allowClear: true,
      options: stageEnum || [],
    },
  },
  {
    label: '注册时间',
    name: stringName.registerTime,
    type: inputType.rangePicker,
    inputProps: {
      placeholder: ['开始日期', '结束日期'],
      allowClear: true,
      format: datetimeFormat.date,
    },
  },
];

const SearchForm = ({ onSubmit, exportHandle }) => {
  const formRef = useRef(null);
  const [exportRecordDrawerVisible, setExportRecordDrawerVisible] = useState(false);
  const { selectStatus } = optionHooks.useSelectStatus();
  const { stageEnum } = optionHooks.useStageEnum();
  const fields = fieldsArrData(selectStatus, stageEnum);
  const handleExport = async (form) => {
    await exportHandle(form.getFieldValue());
    setExportRecordDrawerVisible(true);
  };
  const exportRecordSearchCriteria = fields.map((f) => {
    let render;
    switch (f.name) {
      case stringName.recommendName:
        render = (search) => selectStatus.find((o) => o.value === search?.memberId)?.label;
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
    <>
      <Search
        onSubmit={onSubmit}
        fields={fields}
        getForm={(form) => {
          formRef.current = form;
        }}
        extra={(
          <Form.Item style={{ marginLeft: 10 }}>
            <Button.Group>
              <Button
                icon={<CloudDownloadOutlined />}
                type="primary"
                onClick={() => handleExport(formRef?.current)}
                style={{ marginLeft: 10 }}
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
        type="REGISTER_AWARD_LIST"
        searchCriteria={exportRecordSearchCriteria}
        onClose={() => setExportRecordDrawerVisible(false)}
      />
    </>
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
