import React, { useState } from 'react';
import moment from 'moment';
import {
  Form, Button, Card, Modal, message, Row, Col,
} from 'antd';
import { useQuery } from 'react-query';
import { httpRequest } from '@utils';
import { datetimeFormat } from '@/constants';
import { Table, FormItem, inputType } from '@/components';
import Search from './search';
import constants from '../constants';

const getfields = (data) => [
  {
    label: '姓名',
    name: constants.memberName,
    key: constants.memberName,
    type: inputType.input,
    inputProps: {
      placeholder: '',
      disabled: true,
    },
  },
  {
    label: '邀请人',
    name: constants.recommendName,
    key: constants.memberName,
    type: inputType.input,
    inputProps: {
      placeholder: '',
      disabled: true,
    },
  },
  {
    label: '用户身份证号',
    name: constants.memberIdNo,
    key: constants.memberIdNo,
    type: inputType.input,
    inputProps: {
      placeholder: '',
      disabled: true,
    },
  },
  {
    label: '用户当前状态',
    name: constants.currentStageDesc,
    key: constants.currentStageDesc,
    type: inputType.input,
    inputProps: {
      placeholder: '',
      disabled: true,
    },
  },
  {
    label: '变更用户状态',
    name: 'nextStageList',
    key: 'nextStageList',
    type: inputType.select,
    showAllOption: false,
    inputProps: {
      placeholder: '',
      options: data?.map((item) => ({
        label: item.value,
        value: item.key,
      })),
    },
    rules: [{ required: true }],
  },
  {
    name: 'date',
    label: '日期',
    type: inputType.datePicker,
    inputProps: {
      placeholder: '请选择日期',
      allowClear: true,
      style: {
        width: '100%',
      },
    },
    rules: [{ required: true }],
  },
  {
    label: '注册时间',
    name: constants.registerTime,
    key: constants.registerTime,
    type: inputType.input,
    inputProps: {
      placeholder: '',
      disabled: true,
    },
  },
  {
    label: '首次报名时间',
    name: constants.signUpTime,
    key: constants.signUpTime,
    type: inputType.input,
    inputProps: {
      placeholder: '',
      disabled: true,
    },
  },
  {
    label: '面试时间',
    name: constants.interviewTime,
    key: constants.interviewTime,
    type: inputType.input,
    inputProps: {
      placeholder: '',
      disabled: true,
    },
  },
  {
    label: '面试通过时间',
    name: constants.interviewPassTime,
    key: constants.interviewPassTime,
    type: inputType.input,
    inputProps: {
      placeholder: '',
      disabled: true,
    },
  },
  {
    label: '入职时间',
    name: constants.entryTime,
    key: constants.entryTime,
    type: inputType.input,
    inputProps: {
      placeholder: '',
      disabled: true,
    },
  },
  {
    label: '首次打卡满7天',
    name: constants.firstClickOn7daysTime,
    key: constants.firstClickOn7daysTime,
    type: inputType.input,
    inputProps: {
      placeholder: '',
      disabled: true,
    },
  },
  {
    label: '首次打卡满30天',
    name: constants.firstClickOn30daysTime,
    key: constants.firstClickOn30daysTime,
    type: inputType.input,
    inputProps: {
      placeholder: '',
      disabled: true,
    },
  },
  {
    label: '第二次打卡满30天',
    name: constants.secondClickOn30daysTime,
    key: constants.secondClickOn30daysTime,
    type: inputType.input,
    inputProps: {
      placeholder: '',
      disabled: true,
    },
  },
  {
    label: '第三次打卡满30天',
    name: constants.thirdClickOn30daysTime,
    key: constants.thirdClickOn30daysTime,
    type: inputType.input,
    inputProps: {
      placeholder: '',
      disabled: true,
    },
  },
];

const getColumns = ({ handleClick }) => [
  {
    title: '序号',
    dataIndex: 'serialNumber',
    key: 'serialNumber',
    render(text, record, index) {
      return `${index + 1}`;
    },
  },
  {
    title: '用户姓名',
    dataIndex: constants.memberName,
    key: constants.memberName,
  },
  {
    title: '用户手机',
    dataIndex: constants.memberMobile,
    key: constants.memberMobile,
  },
  {
    title: '邀请人',
    dataIndex: constants.recommendName,
    key: constants.recommendName,
  },
  {
    title: '邀请人手机',
    dataIndex: constants.recommendMobile,
    key: constants.recommendMobile,
  },
  {
    title: '用户状态',
    dataIndex: constants.currentStageDesc,
    key: constants.currentStageDesc,
  },
  {
    title: '注册时间',
    dataIndex: constants.registerTime,
    key: constants.registerTime,
    render(_, record) {
      return (
        record.registerTime && moment(Number(record.registerTime)).format(datetimeFormat.date)
      );
    },
  },
  {
    title: '首次报名时间',
    dataIndex: constants.signUpTime,
    key: constants.signUpTime,
    render(_, record) {
      return record.signUpTime && moment(Number(record.signUpTime)).format(datetimeFormat.date);
    },
  },
  {
    title: '面试时间',
    dataIndex: constants.interviewTime,
    key: constants.interviewTime,
    render(_, record) {
      return (
        record.interviewTime && moment(Number(record.interviewTime)).format(datetimeFormat.date)
      );
    },
  },
  {
    title: '通知面试时间',
    dataIndex: constants.interviewPassTime,
    key: constants.interviewPassTime,
    render(_, record) {
      return (
        record.interviewPassTime
        && moment(Number(record.interviewPassTime)).format(datetimeFormat.date)
      );
    },
  },
  {
    title: '入职时间',
    dataIndex: constants.entryTime,
    key: constants.entryTime,
    render(_, record) {
      return record.entryTime && moment(Number(record.entryTime)).format(datetimeFormat.date);
    },
  },
  {
    title: '首次打卡满7天',
    dataIndex: constants.firstClickOn7daysTime,
    key: constants.firstClickOn7daysTime,
    render(_, record) {
      return (
        record.firstClickOn7daysTime
        && moment(Number(record.firstClickOn7daysTime)).format(datetimeFormat.date)
      );
    },
  },
  {
    title: '首次打卡满30天',
    dataIndex: constants.firstClickOn30daysTime,
    key: constants.firstClickOn30daysTime,
    render(_, record) {
      return (
        record.firstClickOn30daysTime
        && moment(Number(record.firstClickOn30daysTime)).format(datetimeFormat.date)
      );
    },
  },
  {
    title: '第二次打卡满30天',
    dataIndex: constants.secondClickOn30daysTime,
    key: constants.secondClickOn30daysTime,
    render(_, record) {
      return (
        record.secondClickOn30daysTime
        && moment(Number(record.secondClickOn30daysTime)).format(datetimeFormat.date)
      );
    },
  },
  {
    title: '第三次打卡满30天',
    dataIndex: constants.thirdClickOn30daysTime,
    key: constants.thirdClickOn30daysTime,
    render(_, record) {
      return (
        record.thirdClickOn30daysTime
        && moment(Number(record.thirdClickOn30daysTime)).format(datetimeFormat.date)
      );
    },
  },
  {
    title: '操作',
    dataIndex: 'operate',
    key: 'operate',
    fixed: 'right',
    width: 80,
    render: (_, record, index) => (
      <Button type="link" onClick={() => handleClick(record)}>
        编辑
      </Button>
    ),
  },
];

const Gift = () => {
  const [form] = Form.useForm();
  const [id, setId] = useState();
  const [fields, setFields] = useState(() => getfields());
  const [searchCriteria, setSearchCriteria] = useState({ pageSize: 10 });
  const search = { ...searchCriteria };
  const {
    isLoading, isError, error, data, refetch,
  } = useQuery(['award', search], async () => {
    const { registerTime, ...rest } = search;
    const registerTimeStart = registerTime
      ? moment(registerTime[0]).startOf('day').format('x')
      : null;
    const registerTimeEnd = registerTime ? moment(registerTime[1]).endOf('day').format('x') : null;
    const res = await httpRequest.post('/admin/award/inquiry', {
      ...rest,
      registerTimeStart,
      registerTimeEnd,
    });
    if (res.code !== 0) {
      throw new Error(res.msg);
    }
    setSearchCriteria({ ...searchCriteria, total: res.data.total });
    return res.data.content;
  });
  if (isError) {
    message.error(error.message);
  }
  const [isModalVisible, setIsModalVisible] = useState(false);
  const handleOk = () => {
    const { nextStageList, date } = form.getFieldsValue();
    form.validateFields().then(async () => {
      try {
        const res = await httpRequest.put(`/admin/award/${id}`, {
          nextStage: nextStageList,
          date: moment(date).endOf('day').format('x'),
        });
        if (res.code !== 0) {
          throw new Error(res.msg);
        }
        message.success('变更状态成功');
        form.resetFields();
        setIsModalVisible(false);
        refetch();
      } catch (err) {
        message.error(err.message);
      }
    });
  };
  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };
  const handleEdit = async (record) => {
    setId(record.id);
    const res = await httpRequest.get(`/admin/award/${record.id}`);
    if (res.code !== 0) {
      throw new Error(res.msg);
    }
    form.setFieldsValue({
      [constants.memberName]: res.data.memberName,
      [constants.recommendName]: res.data.recommendName,
      [constants.memberIdNo]: res.data.memberIdNo,
      [constants.currentStageDesc]: res.data.currentStage,
      [constants.registerTime]:
        res.data.registerTime
        && moment(Number(res.data.registerTime)).format(datetimeFormat.date),
      [constants.signUpTime]:
        res.data.signUpTime && moment(Number(res.data.signUpTime)).format(datetimeFormat.date),
      [constants.interviewTime]:
        res.data.interviewTime
        && moment(Number(res.data.interviewTime)).format(datetimeFormat.date),
      [constants.interviewPassTime]:
        res.data.interviewPassTime
        && moment(Number(res.data.interviewPassTime)).format(datetimeFormat.date),
      [constants.entryTime]:
        res.data.entryTime && moment(Number(res.data.entryTime)).format(datetimeFormat.date),
      [constants.firstClickOn7daysTime]:
        res.data.firstClickOn7daysTime
        && moment(Number(res.data.firstClickOn7daysTime)).format(datetimeFormat.date),
      [constants.firstClickOn30daysTime]:
        res.data.firstClickOn30daysTime
        && moment(Number(res.data.firstClickOn30daysTime)).format(datetimeFormat.date),
      [constants.secondClickOn30daysTime]:
        res.data.secondClickOn30daysTime
        && moment(Number(res.data.secondClickOn30daysTime)).format(datetimeFormat.date),
      [constants.thirdClickOn30daysTime]:
        res.data.thirdClickOn30daysTime
        && moment(Number(res.data.thirdClickOn30daysTime)).format(datetimeFormat.date),
    });
    setFields(() => getfields(res.data.nextStageList));
    setIsModalVisible(true);
  };
  const columns = getColumns({ handleClick: handleEdit });
  const handleSearch = (searchValue) => {
    setSearchCriteria({
      ...searchCriteria,
      ...searchValue,
      timestamp: new Date().getTime(),
    });
  };
  const exportHandle = async (val) => {
    const { registerTime, ...rest } = val;
    const params = {
      ...rest,
      registerStartTime: registerTime && moment(registerTime[0]).startOf('day').format('x'),
      registerEndTime: registerTime && moment(registerTime[1]).endOf('day').format('x'),
      timestamp: new Date().getTime(),
    };
    try {
      const res = await httpRequest.post('/admin/award/export', params);
      if (res.code !== 0) {
        throw new Error(res.msg);
      }
      message.success('导出成功');
    } catch (err) {
      message.error(err.message || '导出失败');
    }
  };
  const handleTableChange = (params) => {
    setSearchCriteria({ ...searchCriteria, ...params, pageNumber: params.current - 1 });
  };
  const validateMessages = {
    // eslint-disable-next-line no-template-curly-in-string
    required: "'${label}' 是必选字段",
  };
  return (
    <>
      <Search onSubmit={handleSearch} exportHandle={exportHandle} />
      <Table
        loading={isLoading}
        dataSource={data}
        columns={columns}
        bordered
        pagination={{
          ...searchCriteria,
          showSizeChanger: true,
        }}
        onChange={handleTableChange}
        scroll={{ x: 2500 }}
      />
      <Modal
        title="变更状态"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="确定"
        cancelText="取消"
        width="55%"
      >
        <Form form={form} labelCol={{ span: 10 }} wrapperCol={{ span: 14 }} labelAlign="right" validateMessages={validateMessages}>
          <Row>
            {fields.map((f) => (
              <Col span={12}>
                <FormItem
                  label={f.label}
                  name={f.name}
                  type={f.type}
                  inputProps={f.inputProps}
                  rules={f.rules}
                  key={f.key}
                  showAllOption={f.showAllOption}
                />
              </Col>
            ))}
          </Row>
        </Form>
      </Modal>
    </>
  );
};
export default Gift;
