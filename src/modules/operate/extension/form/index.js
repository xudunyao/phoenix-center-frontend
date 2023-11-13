import React, { useState, useEffect } from 'react';
import {
  Form, Spin, Modal, message,
} from 'antd';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { globalStyles } from '@styles';
import { FormItem, inputType } from '@components';
import { httpRequest } from '@/utils';

const { Content } = globalStyles;
const generateFields = ({ optionsList }) => [
  {
    name: 'name',
    label: '渠道名称',
    inputProps: {
      placeholder: '请输入渠道名称',
    },
    rules: [
      {
        required: true,
      },
    ],
  },
  {
    name: 'desc',
    label: '渠道描述',
    inputProps: {
      placeholder: '请输入渠道描述',
    },
    rules: [
      {
        required: true,
      },
    ],
  },
  {
    name: 'userClient',
    label: '推广用户端',
    type: inputType.radioGroup,
    inputProps: {
      options: [
        {
          value: 'MINI_PROGRAM',
          label: '小程序',
        },
        {
          value: 'H5',
          label: 'H5',
        },
      ],
    },
    rules: [
      {
        required: true,
      },
    ],
  },
  {
    name: 'pageId',
    label: '推广页面',
    type: inputType.select,
    inputProps: {
      options: optionsList.map((item) => ({
        value: item.id,
        label: item.name,
      })),
    },
    showAllOption: false,
    rules: [
      {
        required: true,
      },
    ],
  },
  {
    name: 'channelUrl',
    label: '链接地址',
    type: inputType.inputTextArea,
    inputProps: {
      placeholder: '请输入链接地址',
      disabled: true,
    },
    rules: [
      {
        required: true,
      },
    ],
  },
];
const DetailForm = ({
  id, visible, onClose, title,
}) => {
  const [form] = Form.useForm();
  const [spinning, setSpinning] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [pageList, setPageList] = useState([]);
  const [formFields, setFormFields] = useState([]);
  const onFinish = async (values) => {
    const { channelUrl, ...rest } = values;
    setSpinning(true);
    let res = null;
    try {
      if (id) {
        res = await httpRequest.put(`admin/channel/${id}`, rest);
      } else {
        res = await httpRequest.post('/admin/channel', rest);
      }
      if (res.code !== 0) {
        throw new Error(res.msg);
      }
      message.success(id ? '修改成功' : '添加成功');
      form.resetFields();
      onClose(true);
    } catch (err) {
      message.error(err.message || '添加渠道失败');
    } finally {
      setSpinning(false);
    }
  };
  const validateMessages = {
    // eslint-disable-next-line no-template-curly-in-string
    required: '${label}不能为空！',
  };
  const getPageList = async () => {
    try {
      const [h5, miniProgram] = await Promise.all([
        httpRequest.get('admin/channel/pageList/H5'),
        httpRequest.get('admin/channel/pageList/MINI_PROGRAM'),
      ]);
      setPageList({
        H5: h5.data,
        MINI_PROGRAM: miniProgram.data,
      });
      setFormFields(
        generateFields({
          optionsList: miniProgram.data,
        }),
      );
    } catch (err) {
      message.error(err.message || '获取推广页面失败');
    }
  };
  const handleFormValue = (values) => {
    const { userClient, pageId } = values;
    if (!userClient && !pageId) {
      return;
    }
    setFormFields(
      generateFields({
        optionsList:
          form.getFieldValue('userClient') === 'H5' ? pageList.H5 : pageList.MINI_PROGRAM,
      }),
    );
    if (userClient) {
      form.setFieldsValue({
        channelUrl: '',
        pageId: '',
      });
    }
    if (pageId) {
      form.setFieldsValue({
        channelUrl: [...pageList.H5, ...pageList.MINI_PROGRAM].find((item) => item?.id === pageId)
          ?.url,
      });
    }
  };
  const handleClose = () => {
    onClose(false);
    form.resetFields();
  };
  useEffect(() => {
    getPageList();
    form.setFieldsValue({
      userClient: 'MINI_PROGRAM',
    });
  }, []);
  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        setSpinning(true);
        try {
          const res = await httpRequest.get(`/admin/channel/${id}`);
          if (res.code !== 0) {
            throw new Error(res.msg);
          }
          setFormFields(
            generateFields({
              optionsList: res.data.userClient === 'H5' ? pageList.H5 : pageList.MINI_PROGRAM,
            }),
          );
          form.setFieldsValue({
            ...res.data,
          });
        } catch (err) {
          message.error(err.message || '获取渠道信息失败');
        } finally {
          setSpinning(false);
        }
      }
    };
    fetchData();
  }, [id]);
  return (
    <Modal
      title={title}
      visible={visible}
      width={600}
      onCancel={handleClose}
      onOk={() => form.submit()}
      confirmLoading={submitting}
      okText="确定"
      cancelText="取消"
    >
      <Spin spinning={spinning}>
        <Content>
          <Form
            labelCol={{ span: 6 }}
            layout="horizontal"
            form={form}
            onFinish={onFinish}
            validateMessages={validateMessages}
            onValuesChange={handleFormValue}
          >
            {formFields.map((f) => (
              <FormItem
                key={f.name}
                name={f.name}
                label={f.label}
                inputProps={f.inputProps}
                rules={f.rules}
                type={f.type}
                showAllOption={f.showAllOption}
              />
            ))}
          </Form>
        </Content>
      </Spin>
    </Modal>
  );
};
DetailForm.propTypes = {
  id: PropTypes.string.isRequired,
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
};
export default DetailForm;
