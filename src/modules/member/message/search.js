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

const generateFields = ({ sourceChannel }) => [
  {
    name: 'keywords',
    label: '姓名/身份证',
    type: inputType.input,
    inputProps: {
      placeholder: '请输入姓名或者身份证',
      options: sourceChannel,
    },
  },
  {
    name: 'mobile',
    label: '手机号',
    type: inputType.input,
    inputProps: {
      placeholder: '请输入手机号',
      options: sourceChannel,
    },
  },
  {
    name: 'sourceChannelCode',
    label: '渠道来源',
    type: inputType.select,
    inputProps: {
      placeholder: '请选择渠道来源',
      options: sourceChannel,
      showSearch: true,
      filterOption: (input, option) => option.label.includes(input),
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
];
const SearchForm = ({ onSubmit, exportHandle }) => {
  const formRef = useRef(null);
  const { sourceChannel } = optionHooks.useSourceChannel();
  const [exportRecordDrawerVisible, setExportRecordDrawerVisible] = useState(false);
  const handleExport = async (form) => {
    await exportHandle(form.getFieldValue());
    setExportRecordDrawerVisible(true);
  };
  const fields = generateFields({ sourceChannel });
  const exportRecordSearchCriteria = fields.map((f) => {
    let render;
    switch (f.name) {
      case 'sourceChannelId':
        render = (search) => sourceChannel.find((o) => o.value === search?.sourceChannelId)?.label;
        break;
      case 'date':
        render = (search) => search?.registerStartTime && `${search?.registerStartTime ? moment(search?.registerStartTime).format(datetimeFormat.date) : ''}-${
          search?.registerEndTime ? moment(search?.registerEndTime).format(datetimeFormat.date) : ''
        }`;
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
        type="MEMBER"
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
