import React, { useState, useEffect } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import moment from 'moment';
import {
  Form, Spin, Button, Card, Col, Row, message, Upload, Modal,
} from 'antd';
import {
  useNavigate, useParams, Link,
} from 'react-router-dom';
import _ from 'lodash';
import { globalStyles } from '@styles';
import { FormItem, inputType } from '@components';
import { httpRequest } from '@/utils';

const { BodyHtml } = globalStyles;

const optionsContent = [
  {
    label: '首页Banner',
    value: 'HOME_BANNER',
    describe: '（首页banner广告尺寸：750*300）',
  },
  {
    label: '首页弹窗',
    value: 'HOME_POP',
    describe: '弹框广告尺寸：750*1000',
  },
];
const DetailForm = () => {
  const navigate = useNavigate();
  const queryParams = useParams();
  const { id } = queryParams;
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const validateMessages = {
    // eslint-disable-next-line no-template-curly-in-string
    required: '${label}不能为空！',
  };
  const handleCancel = () => {
    form.resetFields();
    navigate(-1);
  };

  const range = (start, end) => {
    const result = [];
    for (let i = start; i < end; i = 1 + i) {
      result.push(i);
    }
    return result;
  };
  const disabled = (current) => current && current < moment().subtract(1, 'days');

  const disabledDateTime = (current) => {
    if (current) {
      const today = moment().date();
      if (today === current.date()) {
        const minute = Number(moment().minutes());
        const hour = Number(moment().hour());
        let finalHour; let finalMinute;
        if (current.hour() > hour) {
          finalMinute = 0;
        } else if (current.minute() >= 58) {
          finalHour = hour + 1;
          finalMinute = 0;
        } else {
          finalHour = hour;
          finalMinute = minute + 5;
        }
        return {
          disabledHours: () => range(0, finalHour),
          disabledMinutes: () => range(0, finalMinute),
        };
      }
      if (moment() > current) {
        return {
          disabledHours: () => range(0, 24),
          disabledMinutes: () => range(0, 60),
          disabledSeconds: () => range(0, 60),
        };
      }
    } else {
      return {
        disabledHours: () => range(0, 24),
        disabledMinutes: () => range(0, 60),
        disabledSeconds: () => range(0, 60),
      };
    }
    return '';
  };

  const formFieldsObject = () => [
    {
      name: 'name',
      label: '广告名称',
      span: 24,
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
      name: 'putPosition',
      label: '投放位置',
      span: 24,
      type: inputType.select,
      inputProps: {
        placeholder: '请选择',
        options: optionsContent,
      },
      showAllOption: false,
      rules: [
        {
          required: true,
        },
      ],
    },
    {
      name: 'putObject',
      label: '推送对象',
      span: 24,
      type: inputType.select,
      showAllOption: false,
      inputProps: {
        placeholder: '请选择',
        options: [
          {
            value: 'ALL',
            label: '全部会员',
          },
          {
            value: 'REGISTER',
            label: '注册会员',
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
      label: '发布时间',
      span: 24,
      name: 'publishType',
      type: inputType.radioGroup,
      inputProps: {
        options: [
          {
            value: 'PUBLISH_NOW',
            label: '立即发布',
          },
          {
            value: 'SCHEDULE',
            label: '定时',
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
      name: 'publishTime',
      label: '时间',
      type: inputType.datePicker,
      span: 24,
      show: form.getFieldValue('publishType') !== 'SCHEDULE',
      inputProps: {
        disabledDate: disabled,
        disabledTime: disabledDateTime,
        showTime: { format: 'HH:mm' },
        format: 'YYYY-MM-DD HH:mm',
      },
      rules: [
        {
          required: form.getFieldValue('publishType') === 'SCHEDULE',
        },
      ],
    },
    {
      label: '下线时间',
      name: 'takeDownType',
      span: 24,
      type: inputType.radioGroup,
      inputProps: {
        options: [
          {
            value: 'LONG_TERM',
            label: '长期有效',
          },
          {
            value: 'SCHEDULE',
            label: '定时',
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
      name: 'takeDownTime',
      label: '时间',
      type: inputType.datePicker,
      span: 24,
      show: form.getFieldValue('takeDownType') !== 'SCHEDULE',
      inputProps: {
        disabledDate: disabled,
        disabledTime: disabledDateTime,
        showTime: { format: 'HH:mm' },
        format: 'YYYY-MM-DD HH:mm',
      },
      rules: [{
        required: form.getFieldValue('takeDownType') === 'SCHEDULE',
      }],
    },
    {
      name: 'jumpUrl',
      label: '链接地址',
      span: 24,
      type: inputType.inputTextArea,
      inputProps: {
        placeholder: '请输入链接地址',
      },
    },
  ];
  const [formFields, setFormFields] = useState(
    formFieldsObject(),
  );

  const getBase64 = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
  const beforeUpload = (file) => {
    const isJpgOrPng = file.type === 'image/jpg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('只允许上传.jpg和.png格式文件');
    }
    return isJpgOrPng;
  };
  const [fileList, setFileList] = useState([]);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');
  const onFinish = async (values) => {
    const {
      publishTime, takeDownTime, publishType, takeDownType, ...rest
    } = values;
    const publish = () => {
      if (publishType === 'PUBLISHED') {
        return null;
      }
      return Date.parse(publishTime);
    };
    const takeDown = () => {
      if (takeDownType === 'LONG_TERM') {
        return null;
      }
      return Date.parse(takeDownTime);
    };
    try {
      let res = null;
      if (id) {
        res = await httpRequest.put(`/admin/banner/${id}`, {
          id,
          publishType,
          takeDownType,
          publishTime: publish() || null,
          takeDownTime: takeDown() || null,
          ...rest,
        });
      } else {
        res = await httpRequest.post('/admin/banner', {
          ...rest,
          publishType,
          takeDownType,
          publishTime: publish(),
          takeDownTime: takeDown(),
        });
      }
      if (res.code !== 0) {
        throw new Error(res.msg);
      }
      message.success(id ? '修改成功' : '添加成功');
    } catch (err) {
      message.error(err.message);
    } finally {
      setFileList([]);
      form.resetFields();
      navigate('/operate/activity/advertisement');
    }
  };
  const handleCancelImage = () => setPreviewVisible(false);
  const handlePreview = async (file) => {
    // eslint-disable-next-line no-param-reassign
    if (!file.url && !file.preview) { file.preview = await getBase64(file.originFileObj); }
    setPreviewImage(file.url || file.preview);
    setPreviewVisible(true);
    setPreviewTitle('图片');
  };
  const handleChange = async (event) => {
    form.setFieldsValue({ imageKey: [] });
    const { file } = event;
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await httpRequest.post('/file/image/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      if (res.code !== 0) {
        throw new Error(res.msg);
      } else {
        form.setFieldsValue({ imageKey: res.data.fileKey });
        setFileList([...fileList, { ...file, url: res.data.url }]);
      }
    } catch (err) {
      message.error(err.message || '图片上传失败');
    }
  };
  const uploadButton = (
    <div>
      <PlusOutlined />
      <div
        style={{
          marginTop: 8,
        }}
      >
        Upload
      </div>
    </div>
  );
  const fetchUrl = async (fileKey) => {
    try {
      const res = await httpRequest.get('file/fetchUrl', {
        params: {
          fileKey,
        },
      });
      if (res.code !== 0) {
        throw new Error(res.msg);
      }
      return res;
    } catch (err) {
      message.error(err.message);
      return '';
    }
  };
  const getDetailsData = async () => {
    setLoading(true);
    try {
      const res = await httpRequest.get(`/admin/banner/${id}`);
      if (res.code !== 0) {
        throw new Error(res.msg);
      }
      const { publishTime, takeDownTime, ...rest } = res.data;
      const imageUrl = await fetchUrl(res.data.imageKey);
      form.setFieldsValue({
        ...rest,
        publishTime: publishTime ? moment(publishTime) : null,
        takeDownTime: takeDownTime ? moment(takeDownTime) : null,
      });
      setFormFields(formFieldsObject());
      setFileList([{ url: imageUrl?.data }]);
    } catch (err) {
      message.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      getDetailsData();
    } else {
      form.setFieldsValue({
        putObject: 'ALL',
      });
    }
  }, [id]);
  return (
    <BodyHtml>
      <Spin spinning={loading}>
        <Card
          title={id ? '编辑广告' : '新增广告'}
          style={{ height: '100%' }}
          extra={<Link to="/operate/activity/advertisement">返回</Link>}
        >
          <Form
            style={{ marginLeft: '100px' }}
            labelCol={{ span: 3 }}
            wrapperCol={{ span: 9 }}
            form={form}
            onFinish={onFinish}
            validateMessages={validateMessages}
            onFieldsChange={(val) => {
              setFormFields(formFieldsObject());
            }}
          >
            <Row>
              {
                formFields.map((f) => (f?.show ? null : (
                  <Col span={f.span} key={f.name}>
                    <FormItem
                      name={f.name}
                      label={f.label}
                      inputProps={f.inputProps}
                      rules={f.rules}
                      type={f.type}
                      showAllOption={f.showAllOption}
                    />
                  </Col>
                )))
              }
              <Col span={24}>
                <Form.Item
                  name="imageKey"
                  label="广告图片"
                  rules={[{
                    required: true,
                  }]}
                >
                  <div style={{ marginTop: '5px', marginBottom: '5px' }}>
                    {
                       (() => {
                         const select = optionsContent.find((item) => item.value === form.getFieldValue('putPosition'));
                         return select?.describe;
                       })()

                    }
                  </div>
                  <Form.Item>
                    <Upload
                      beforeUpload={beforeUpload}
                      listType="picture-card"
                      fileList={fileList}
                      onPreview={handlePreview}
                      customRequest={(event) => {
                        handleChange(event);
                      }}
                      onRemove={(file) => {
                        setFileList(fileList.filter((item) => item.uid !== file.uid));
                      }}
                      accept="image/jpg,image/png"
                    >
                      {fileList.length >= 1 ? null : uploadButton}
                    </Upload>
                    <Modal
                      visible={previewVisible}
                      title={previewTitle}
                      footer={null}
                      onCancel={handleCancelImage}
                    >
                      <img
                        alt="example"
                        style={{
                          width: '100%',
                        }}
                        src={previewImage}
                      />
                    </Modal>
                  </Form.Item>
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item wrapperCol={{ offset: 6 }}>
                  <Button
                    htmlType="button"
                    style={{
                      marginRight: '90px',
                    }}
                    onClick={handleCancel}
                  >
                    取消
                  </Button>
                  <Button type="primary" htmlType="submit">
                    {id ? '提交修改' : '新增'}
                  </Button>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Card>
      </Spin>
    </BodyHtml>
  );
};
export default DetailForm;
