import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Button, Space, Col, message, Upload, Modal, Row,
} from 'antd';
import { DownloadOutlined, PlusOutlined, VerticalAlignTopOutlined } from '@ant-design/icons';
import { httpRequest } from '@/utils';
import { globalStyles } from '@/styles';
import { inputType, Search, FormItem } from '@/components';
import { options as optionHooks, options } from '@/hooks';
import { flowPoolTemplateLink } from '@/constants';

const { Content } = globalStyles;

const generateFields = ({ sourceChannel }) => [
  {
    name: 'sourceChannelCode',
    label: '渠道来源',
    type: inputType.select,
    showAllOption: false,
    inputProps: {
      placeholder: '请选择渠道来源',
      options: sourceChannel,
      showSearch: true,
      filterOption: (input, option) => option.label.includes(input),
    },
  },
  {
    name: 'mobile',
    label: '手机号',
    type: inputType.input,
    showAllOption: false,
    inputProps: {
      placeholder: '请输入手机号',
      options: sourceChannel,
    },
  },
  {
    name: 'realName',
    label: '姓名',
    type: inputType.input,
    showAllOption: false,
    inputProps: {
      placeholder: '请输入姓名',
      options: sourceChannel,
    },
  },
  {
    name: 'date',
    label: '日期',
    type: inputType.rangePicker,
    inputProps: {
      placeholder: ['开始日期', '结束日期'],
      allowClear: true,
    },
  },
];
const SearchForm = ({ onSubmit, onAdd, refetch }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [errorList, setErrorList] = useState([]);
  const { sourceChannel } = optionHooks.useSourceChannel();
  const uploadFile = async (event) => {
    try {
      const formData = new FormData();
      formData.append('file', event.file);
      const res = await httpRequest.post('/admin/flowPool/import', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      if (res.code === 0) {
        message.success('导入成功');
        refetch();
      } else {
        setIsModalVisible(true);
        setErrorList(res.data);
      }
    } catch (err) {
      message.error(err);
    }
  };
  const handleModalOk = () => {
    setIsModalVisible(false);
  };
  const fields = generateFields({ sourceChannel });
  return (
    <Content>
      <Search
        onSubmit={onSubmit}
        fields={fields}
        extra={(
          <Col>
            <Space>
              <Button icon={<PlusOutlined />} type="primary" ghost onClick={onAdd}>
                新增
              </Button>
              <Upload showUploadList={false} onChange={uploadFile} beforeUpload={() => false}>
                <Button type="primary" icon={<VerticalAlignTopOutlined />}>
                  批量导入
                </Button>
              </Upload>
              <Button type="link" href={flowPoolTemplateLink} icon={<DownloadOutlined />}>
                下载模板
              </Button>
            </Space>
          </Col>
        )}
      />
      <Modal
        title="错误提示"
        visible={isModalVisible}
        mask
        maskClosable={false}
        onCancel={() => {
          setIsModalVisible(false);
        }}
        footer={[
          <Button key="submit" type="primary" onClick={handleModalOk}>
            确认
          </Button>,
        ]}
      >
        <Row>
          {errorList.map((item) => (
            <React.Fragment key={item}>
              <Col span={8}>
                表格第
                {item.row}
                行：
              </Col>
              <Col span={16}>{item.errorMsg}</Col>
            </React.Fragment>
          ))}
        </Row>
      </Modal>
    </Content>
  );
};
SearchForm.propTypes = {
  onSubmit: PropTypes.func,
  onAdd: PropTypes.func,
  refetch: PropTypes.func,
};
SearchForm.defaultProps = {
  onSubmit: () => {},
  onAdd: () => {},
  refetch: () => {},
};

export default SearchForm;
