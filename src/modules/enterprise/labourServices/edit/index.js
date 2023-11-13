import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { useNavigate, useParams, Link } from 'react-router-dom';
import {
  Form, Button, Card, Space, Row, Col, Upload, Modal, message, Spin,
} from 'antd';
import { LoadingOutlined, PlusOutlined, UploadOutlined } from '@ant-design/icons';
import { enterpriseOptions, pattern } from '@/constants';
import { options as optionHooks } from '@/hooks';
import { FormItem, inputType } from '@/components';
import { httpRequest } from '@/utils';

const generateColumns = ({ areaStatus, id }) => [
  {
    label: '企业名称',
    name: 'name',
    type: inputType.input,
    inputProps: {
      placeholder: '请输入企业名称',
    },
    rules: [{ required: true }],
  },
  {
    label: '企业注册号',
    name: 'registerCode',
    type: inputType.input,
    rules: [{ required: true }],
    inputProps: {
      placeholder: '请输入企业注册号',
    },
  },
  {
    label: '注册地址',
    name: 'registerAddress',
    type: inputType.input,
    rules: [{ required: true }],
    inputProps: {
      placeholder: '请输入注册地址',
    },
  },
  {
    label: '企业法人',
    name: 'legalPerson',
    type: inputType.input,
    rules: [{ required: true }],
    inputProps: {
      placeholder: '请输入企业法人',
    },
  },
  {
    label: '联系电话',
    name: 'contactMobile',
    type: inputType.input,
    rules: [{ required: true, pattern: pattern.mobile, message: '请输入正确的手机号' }],
    inputProps: {
      placeholder: '请输入联系电话',
    },
  },
  {
    label: '法人证件号',
    name: 'legalPersonIdNo',
    type: inputType.input,
    rules: [{ pattern: pattern.idCard, message: '请输入正确的法人证件号' }],
    inputProps: {
      placeholder: '请输入法人证件号',
    },
  },
  {
    label: '所在城市',
    name: 'city',
    type: inputType.cascader,
    rules: [{ required: true }],
    inputProps: {
      placeholder: '请选择所在城市',
      options: areaStatus,
    },
  },
  {
    label: '注册资本',
    name: 'registerCapital',
    type: inputType.input,
    rules: [{ pattern: pattern.decimal, message: '请输入正确的格式' }],
    inputProps: {
      placeholder: '请输入注册资本',
    },
  },
  {
    label: '员工人数',
    name: 'employeeCount',
    type: inputType.input,
    rules: [{ pattern: pattern.int, message: '请输入正确的格式' }],
    inputProps: {
      placeholder: '请输入员工人数',
    },
  },
  {
    label: '所属类型',
    name: 'belongType',
    type: inputType.select,
    rules: [{ required: true }],
    showAllOption: false,
    inputProps: {
      placeholder: '请输入所属类型',
      options: enterpriseOptions,
    },
  },
  {
    label: '联系邮箱',
    name: 'contactEmail',
    type: inputType.input,
    rules: [
      {
        required: true,
        pattern: pattern.email,
        message: '请输入正确的邮箱',
      },
    ],
    inputProps: {
      placeholder: '请输入联系邮箱',
    },
  },
  {
    label: '管理账号',
    name: 'adminAccount',
    type: inputType.input,
    rules: [{ required: true, pattern: pattern.mobile, message: '请输入正确的管理账号' }],
    inputProps: {
      placeholder: '请输入管理账号',
      disabled: !!id,
    },
  },
  {
    label: '管理员',
    name: 'adminName',
    type: inputType.input,
    rules: [{ required: true }],
    inputProps: {
      placeholder: '请输入管理员',
    },
  },
];
const validateMessages = {
  // eslint-disable-next-line no-template-curly-in-string
  required: "'${label}' 是必选字段",
};
const Edit = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');
  const [logoList, setLogoList] = useState([]);
  const [brandList, setBrandList] = useState([]);
  const { areaStatus } = optionHooks.useAreaStatus();
  const handlePreview = async (file) => {
    setPreviewImage(file.url || file.thumbUrl);
    setPreviewVisible(true);
    setPreviewTitle('图片');
  };
  const handleChange = async (event, category = 'logo') => {
    const { file } = event;
    if (file.status === 'removed') {
      if (category === 'logo') {
        form.setFieldsValue({ logoUrl: [] });
      } else {
        form.setFieldsValue({ brandUrl: [] });
      }
      return;
    }
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await httpRequest.post('/file/image/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      if (res.code !== 0) {
        throw new Error(res.msg);
      }
      if (category === 'logo') {
        form.setFieldsValue({ logoUrl: res.data.fileKey });
        setLogoList([...logoList, { ...file, url: res.data.url }]);
      } else {
        form.setFieldsValue({ brandUrl: res.data.fileKey });
        setBrandList([...brandList, { ...file, url: res.data.url }]);
      }
    } catch (err) {
      message.error(err.message || '图片上传失败');
    }
  };
  const handleCancel = () => {
    setPreviewVisible(false);
  };
  const handleSubmit = async (values) => {
    const { city, registerCapital } = values;
    try {
      let res = null;
      if (id) {
        res = await httpRequest.put(`/tenant/edit/${id}`, {
          ...values,
          city: `${city[0]},${city[1]},${city[2]}`,
          registerCapital: Number(registerCapital),
        });
      } else {
        res = await httpRequest.post('/tenant/add', {
          ...values,
          city: `${city[0]},${city[1]},${city[2]}`,
          registerCapital: Number(registerCapital),
        });
      }
      if (res.code !== 0) {
        throw new Error(res.msg);
      }
      message.success(id ? '修改成功' : '添加成功');
    } catch (err) {
      message.error(err.message);
    } finally {
      form.resetFields();
      setBrandList([]);
      setLogoList([]);
      navigate('/enterprise/labour-services');
    }
  };
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
      const res = await httpRequest.get(`/tenant/detail/${id}`);
      if (res.code !== 0) {
        throw new Error(res.msg);
      }
      const [logo, brand] = await Promise.all([
        res.data.logoUrl && fetchUrl(res.data.logoUrl),
        res.data.brandUrl && fetchUrl(res.data.brandUrl),
      ]);
      form.setFieldsValue({ ...res.data, city: res.data.city.split(',') });
      setLogoList([{ fileKey: res.data?.logoUrl, url: logo?.data }]);
      setBrandList([{ fileKey: res.data?.brandUrl, url: brand?.data }]);
    } catch (err) {
      message.error(err.message);
    } finally {
      setLoading(false);
    }
  };
  const beforeUpload = (file) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg';
    if (!isJpgOrPng) {
      message.warn('你只能上传 JPG/PNG/JPG 格式的图片!');
    }
    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      message.warn('图片的大小不能操作5MB!');
    }
    return isJpgOrPng && isLt5M;
  };
  const fields = generateColumns({ areaStatus, id });
  useEffect(() => {
    if (id) {
      getDetailsData();
    }
  }, [id]);
  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>上传图片</div>
    </div>
  );
  return (
    <Spin spinning={loading}>
      <Card
        title={id ? '编辑企业' : '新增企业'}
        style={{ height: '100%' }}
        extra={<Link to="/enterprise/labour-services">返回</Link>}
      >
        <Form
          form={form}
          onFinish={handleSubmit}
          validateMessages={validateMessages}
          labelCol={{ span: 3 }}
          wrapperCol={{ span: 9 }}
        >
          <Row>
            {fields.map((f) => (
              <Col span={12} key={f.name}>
                <FormItem
                  name={f.name}
                  label={f.label}
                  type={f.type}
                  rules={f.rules}
                  inputProps={f.inputProps}
                  showAllOption={f.showAllOption}
                  labelAlign="right"
                  labelCol={{ span: 6 }}
                  wrapperCol={{ span: 18 }}
                />
              </Col>
            ))}
            <Col span={24}>
              <Form.Item name="logoUrl" label="企业LOGO">
                <>
                  <Upload
                    listType="picture-card"
                    fileList={logoList}
                    accept="image/png,image/jpeg,image/jpg"
                    beforeUpload={beforeUpload}
                    maxCount={1}
                    onPreview={handlePreview}
                    customRequest={(event) => {
                      handleChange(event, 'logo');
                    }}
                    onRemove={(file) => {
                      setLogoList(logoList.filter((item) => item.uid !== file.uid));
                    }}
                  >
                    {logoList.length >= 1 ? null : uploadButton}
                  </Upload>
                  <Modal
                    visible={previewVisible}
                    title={previewTitle}
                    footer={null}
                    onCancel={handleCancel}
                  >
                    <img alt="example" style={{ width: '100%' }} src={previewImage} />
                  </Modal>
                </>
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item name="brandUrl" label="品牌brand">
                <>
                  <Upload
                    listType="picture-card"
                    fileList={brandList}
                    accept="image/png,image/jpeg,image/jpg"
                    beforeUpload={beforeUpload}
                    onPreview={handlePreview}
                    customRequest={(event) => {
                      handleChange(event, 'brand');
                    }}
                    onRemove={(file) => {
                      setBrandList(brandList.filter((item) => item.uid !== file.uid));
                    }}
                  >
                    {brandList.length >= 1 ? null : uploadButton}
                  </Upload>
                  <Modal
                    visible={previewVisible}
                    title={previewTitle}
                    footer={null}
                    onCancel={handleCancel}
                  >
                    <img alt="example" style={{ width: '100%' }} src={previewImage} />
                  </Modal>
                </>
              </Form.Item>
            </Col>
          </Row>
          <Form.Item wrapperCol={{ offset: 10 }}>
            <Space size={20}>
              <Button
                onClick={() => {
                  form.resetFields();
                  navigate(-1);
                }}
              >
                取消
              </Button>
              <Button type="primary" htmlType="submit">
                {id ? '修改' : '新增'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </Spin>
  );
};

export default Edit;
