import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Button, Form } from 'antd';
import { datetimeFormat } from '@constants';
import { CloudDownloadOutlined, FileDoneOutlined } from '@ant-design/icons';
import { globalStyles } from '@/styles';
import { inputType, Search } from '@/components';
import ExportRecordDrawer from '@/modules/components/exportRecordDrawer';

const generateFields = () => [
  {
    name: 'date',
    label: '日期',
    type: inputType.rangePicker,
    inputProps: {
      placeholder: ['开始日期', '结束日期'],
      allowClear: true,
      ranges: {
        昨天: [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
        最近7天: [moment().subtract(6, 'days'), moment()],
        最近30天: [moment().subtract(29, 'days'), moment()],
      },
      format: datetimeFormat.date,
    },
  },
];
const SearchForm = ({ onSubmit, exportHandle }) => {
  const fields = generateFields();
  const formRef = useRef(null);
  const [exportRecordDrawerVisible, setExportRecordDrawerVisible] = useState(false);
  const handleExport = async (form) => {
    await exportHandle(form.getFieldValue());
    setExportRecordDrawerVisible(true);
  };
  const exportRecordSearchCriteria = fields.map((f) => {
    let render;
    switch (f.name) {
      case 'date':
        render = (search) => search?.registerStartTime
          && `${
            search?.registerStartTime
              ? moment(search?.registerStartTime).format(datetimeFormat.date)
              : ''
          }-${
            search?.registerEndTime
              ? moment(search?.registerEndTime).format(datetimeFormat.date)
              : ''
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
        type="TRACK_LIST"
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
