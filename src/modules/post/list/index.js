import React, { useState } from 'react';
import {
  Button, message, Form, Modal, Tag,
} from 'antd';
import { EditOutlined } from '@ant-design/icons';
import { useQuery } from 'react-query';
import { httpRequest } from '@utils';
import { globalStyles } from '@styles';
import moment from 'moment';
import { datetimeFormat } from '@constants';
import { Table, inputType, FormItem } from '@/components';
import Search from './search';

const { Content } = globalStyles;
const generateColumns = ({ onEditClick }) => [
  {
    title: '序号',
    render(text, record, index) {
      return `${index + 1}`;
    },
  },
  {
    title: '岗位命名',
    dataIndex: 'positionName',
    key: 'positionName',
  },
  {
    title: '岗位日期',
    dataIndex: 'orderDate',
    key: 'orderDate',
    render(text, record, index) {
      return moment(Number(record.orderDate)).format(datetimeFormat.date);
    },
  },
  {
    title: '用工单位名称',
    dataIndex: 'coreCompanyName',
    key: 'coreCompanyName',
  },
  {
    title: '招聘人数',
    dataIndex: 'wantedNum',
    key: 'wantedNum',
  },
  {
    title: '薪资范围',
    dataIndex: 'salaryRange',
    key: 'salaryRange',
  },
  {
    title: '上架状态',
    dataIndex: 'publish',
    key: 'publish',
    render: (text, record, index) => (
      <Tag color={record.publish ? 'green' : 'red'}>{record.publish ? '已上架' : '已下架'}</Tag>
    ),
  },
  {
    title: '是否补贴',
    dataIndex: 'subsidy',
    key: 'subsidy',
    render: (text, record, index) => (record.subsidy ? <Tag color="green">补贴</Tag> : <Tag color="red">不补贴</Tag>),
  },
  {
    title: '1288.8活动',
    dataIndex: 'registerAward',
    key: 'registerAward',
    render: (text, record, index) => (
      <Tag color={record.registerAward ? 'green' : 'red'}>{record.registerAward ? '已参加' : '未参加'}</Tag>
    ),
  },
  {
    title: '补贴金额',
    dataIndex: 'subsidyAmount',
    key: 'subsidyAmount',
  },
  {
    title: '操作',
    dataIndex: 'action',
    key: 'action',
    fixed: 'right',
    width: 100,
    render: (text, record, index) => (
      <Button type="link" icon={<EditOutlined />} onClick={() => onEditClick(record)}>
        编辑
      </Button>
    ),
  },
];
const getFieldsForm = (form) => [
  {
    label: '平台补贴: ',
    name: 'subsidy',
    type: inputType.radioGroup,
    inputProps: {
      placeholder: '请输入',
      options: [
        {
          label: '是',
          value: true,
        },
        {
          label: '否',
          value: false,
        },
      ],
    },
  },
  {
    label: '补贴金额:',
    name: 'subsidyAmount',
    type: inputType.inputNumber,
    inputProps: {
      placeholder: '请输入',
      addonAfter: '小时/元',
    },
    rules: [
      {
        validator: async (_, value) => {
          if (form.getFieldsValue().subsidy) {
            if (value > 0) {
              return Promise.resolve();
            }
            return Promise.reject(new Error('请输入正确的补贴金额'));
          }
          form.setFieldsValue({ subsidyAmount: '' });
          return Promise.resolve();
        },
      },
    ],
    autoFocus: true,
  },
  {
    label: '注册大礼包:',
    name: 'registerAward',
    type: inputType.radioGroup,
    inputProps: {
      placeholder: '请输入',
      options: [
        {
          label: '是',
          value: true,
        },
        {
          label: '否',
          value: false,
        },
      ],
    },
  },
  {
    name: 'id',
    type: inputType.input,
    inputProps: {
      placeholder: '请输入',
      hidden: true,
    },
  },
];
const Review = () => {
  const [searchCriteria, setSearchCriteria] = useState({ pageSize: 10 });
  const [visible, setVisible] = useState(false);
  const [form] = Form.useForm();
  const [confirmLoading, setConfirmLoading] = useState(false);
  const fieldsForm = getFieldsForm(form);
  const search = { ...searchCriteria, total: 0 };
  const {
    isLoading, isError, error, data, refetch,
  } = useQuery(['list', search], async () => {
    const res = await httpRequest.post('/position/inquiry', search);
    if (res.code !== 0) {
      throw new Error(res.msg);
    }
    setSearchCriteria({ ...searchCriteria, total: res.data.total });
    return res.data?.content;
  });
  if (isError) {
    message.error(error.msg);
  }
  const columns = generateColumns({
    onEditClick: (record) => {
      setVisible(true);
      form.setFieldsValue({ id: record.id });
      form.setFieldsValue({ subsidy: record.subsidy });
      form.setFieldsValue({ subsidyAmount: parseFloat(record.subsidyAmount) });
      form.setFieldsValue({ registerAward: record.registerAward });
    },
  });
  const handleSearch = (searchValue) => {
    const { date, ...rest } = searchValue;
    setSearchCriteria({
      ...searchCriteria,
      ...rest,
      createdDateBegin: date && moment(date[0]).startOf('day').format('x'),
      createdDateEnd: date && moment(date[1]).endOf('day').format('x'),
      timestamp: new Date().getTime(),
    });
  };
  const handleSubmit = () => {
    form.validateFields().then(async () => {
      try {
        const {
          id, subsidy, subsidyAmount, registerAward,
        } = form.getFieldsValue();
        setConfirmLoading(true);
        const res = await httpRequest.put(`/position/setSubsidy/${id}`, { subsidy, subsidyAmount, registerAward });
        if (res.code !== 0) {
          throw new Error(res.msg || '操作失败');
        }
        message.success('修改成功');
      } catch (e) {
        message.error(e);
      } finally {
        setConfirmLoading(false);
        setVisible(false);
        refetch();
      }
    }).catch(() => {});
  };
  const handleTableChange = (params) => {
    setSearchCriteria({ ...searchCriteria, ...params, pageNumber: params.current - 1 });
  };
  const handleFormChange = () => {
    form.validateFields();
  };

  return (
    <>
      <Search onSubmit={handleSearch} />
      <Content>
        <Table
          loading={isLoading}
          columns={columns}
          dataSource={data}
          pagination={{
            ...searchCriteria,
            showSizeChanger: true,
          }}
          onChange={handleTableChange}
          scroll={{ x: 1500 }}
        />
        <Modal
          title={<div style={{ textAlign: 'center' }}>编辑岗位</div>}
          visible={visible}
          onOk={() => {
            handleSubmit();
          }}
          closable={false}
          confirmLoading={confirmLoading}
          cancelText="取消"
          okText="确定"
          centered
          bodyStyle={{
            height: '100%',
            textAlign: 'center',
          }}
          onCancel={() => {
            setVisible(false);
          }}
        >
          <Form
            form={form}
            onFinish={handleSubmit}
            labelCol={{ span: 6, offset: 3 }}
            wrapperCol={{ span: 8 }}
            onChange={handleFormChange}
          >
            {fieldsForm.map((f) => (
              <FormItem
                name={f.name}
                label={f.label}
                type={f.type}
                rules={f.rules}
                inputProps={f.inputProps}
                labelAlign="right"
              />
            ))}
          </Form>
        </Modal>
      </Content>
    </>
  );
};

export default Review;
