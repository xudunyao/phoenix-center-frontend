import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Form } from 'antd';
import { CloudDownloadOutlined, FileDoneOutlined } from '@ant-design/icons';
import { globalStyles } from '@/styles';
import { inputType, Search } from '@/components';
import ExportRecordDrawer from '@/modules/components/exportRecordDrawer';

const { Content } = globalStyles;

const generateFields = () => [
  {
    name: 'mobile',
    label: '手机号',
    type: inputType.input,
    inputProps: {
      placeholder: '请输入手机号',
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
      placeholder: '请输入身份证号',
    },
  },
];
const SearchForm = ({ onSubmit, exportHandle }) => {
  const formRef = useRef(null);
  const [exportRecordDrawerVisible, setExportRecordDrawerVisible] = useState(false);
  const handleExport = async (form) => {
    await exportHandle(form.getFieldValue());
    setExportRecordDrawerVisible(true);
  };
  const fields = generateFields();
  const exportRecordSearchCriteria = fields.map((f) => ({
    key: f.name,
    label: f.label,
  }));
  return (
    <Content>
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
        type="WITHDRAW_RECORD"
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
