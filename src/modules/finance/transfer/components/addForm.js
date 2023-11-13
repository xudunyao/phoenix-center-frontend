import React, {
  useState, useRef, useContext, useEffect,
} from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  message,
  AutoComplete,
  Input,
  Button,
  Col,
  Space,
  Form,
  Popconfirm,
  InputNumber,
  Upload,
} from 'antd';
import PropTypes from 'prop-types';
import { httpRequest } from '@utils';
import { PlusOutlined, CheckCircleOutlined, UploadOutlined } from '@ant-design/icons';
import { Table, inputType, FormItem } from '@/components';
import { pattern } from '@/constants';

const EditableContext = React.createContext(null);

const generateFields = () => [
  {
    label: '申请理由',
    name: 'reason',
    type: inputType.inputTextArea,
    inputProps: {
      placeholder: '请输入申请理由',
    },
    rules: [{ required: true }],
  },
];
const EditableRow = ({ index, ...props }) => {
  /* eslint-disable react/jsx-props-no-spreading */
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};
const EditableCell = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  ...restProps
}) => {
  /* eslint-disable react/jsx-props-no-spreading */
  const [editing, setEditing] = useState(false);
  const inputRef = useRef(null);
  const form = useContext(EditableContext);
  useEffect(() => {
    if (editing) {
      inputRef.current.focus();
    }
  }, [editing]);
  const toggleEdit = () => {
    setEditing(!editing);
    form.setFieldsValue({ [dataIndex]: record[dataIndex] });
  };
  const save = async () => {
    const values = await form.getFieldsValue();

    toggleEdit();
    handleSave({ ...record, ...values });
  };
  let childNode = children;
  if (editable) {
    childNode = editing ? (
      <Form.Item style={{ margin: 0 }} name={dataIndex}>
        {dataIndex === 'amount' ? (
          <InputNumber min={0.01} ref={inputRef} precision={2} onPressEnter={save} onBlur={save} />
        ) : (
          <Input ref={inputRef} onPressEnter={save} onBlur={save} />
        )}
      </Form.Item>
    ) : (
      <div
        style={{
          paddingRight: 24,
          border: '1px solid #d9d9d9',
          lineHeight: '32px',
          height: '32px',
        }}
        aria-hidden="true"
        onClick={toggleEdit}
      >
        {children}
      </div>
    );
  }
  return <td {...restProps}>{childNode}</td>;
};
const components = {
  body: {
    row: EditableRow,
    cell: EditableCell,
  },
};
const Review = () => {
  const navigate = useNavigate();
  const [options, setOptions] = useState([]);
  const [fileList, setFileList] = useState([]);
  const location = useLocation();
  const [form] = Form.useForm();
  const { state } = location;
  const [dataSource, setDataSource] = useState(() => {
    if (state && state.selectedRows) {
      return state.selectedRows.map((item) => ({
        ...item,
        amount: '10',
        remark: '',
        isExist: true,
      }));
    }
    return [];
  });
  const handleDelete = (id) => {
    const newData = dataSource.filter((item) => item.memberId !== id);
    setDataSource(newData);
  };
  const handleAdd = (item) => {
    const newData = {
      ...item,
      remark: '',
      isExist: true,
    };
    setDataSource((prevData) => [...prevData, newData]);
    setOptions((prevData) => {
      const newOptions = prevData.filter((curr) => curr.memberId !== newData.memberId);
      return newOptions;
    });
  };
  const handleSave = (row) => {
    const newData = [...dataSource];
    const index = newData.findIndex((item) => row.memberId === item.memberId);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row,
    });
    setDataSource(newData);
  };
  const handleSearchResult = (data) => data.map((item) => ({
    memberId: item.memberId,
    value: item.phone,
    label: (
      <div
        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
        onClick={() => {
          if (!item.isExist) {
            handleAdd(item);
          } else {
            message.warning('此用户已添加，平台限制每个用户每次仅可被添加一次，不可重复转账');
          }
        }}
        aria-hidden="true"
      >
        <span style={item.isExist ? { color: '#1890ff' } : null}>
          {`手机号:${item.mobile} 姓名:${item.name ? item.name : '未实名'}`}
        </span>
        {!item.isExist ? <PlusOutlined /> : <CheckCircleOutlined />}
      </div>
    ),
  }));
  const handleSearch = async (query) => {
    try {
      const res = await httpRequest.post('/admin/member/inquiryMember', {
        keyWords: query,
      });
      if (res.code !== 0) {
        throw new Error(res.msg);
      }
      const data = res.data.map((item) => {
        const isExist = dataSource.find((curr) => curr.memberId === item.memberId);
        return {
          ...item,
          isExist,
        };
      });
      const result = handleSearchResult(data);
      setOptions(query ? result : []);
    } catch (err) {
      message.warn(err.message);
    }
  };
  const handleSubmit = async () => {
    const validateRes = await form.validateFields();
    let isValid = true;
    let isTrue = true;
    dataSource.forEach((item) => {
      if (!item.amount) {
        isValid = false;
      }
      if (!pattern.decimal.test(item.amount)) {
        isTrue = false;
      }
    });
    if (!isValid) {
      message.error('请输入转账金额');
      return;
    }
    if (!isTrue) {
      message.error('转账金额最多保留两位小数');
      return;
    }
    try {
      const res = await httpRequest.post('/admin/transfer/transferApply/apply', {
        reason: form.getFieldValue('reason'),
        transferSubmitVOS: dataSource.map((item) => ({
          memberId: item.memberId,
          mobile: item.mobile,
          name: item.name,
          idCard: item.idCard,
          amount: item.amount,
          remark: item.remark,
        })),
        fileVOS: fileList.map((item) => ({
          fileName: item.name,
          fileKey: item.fileKey,
        })),
      });
      if (res.code !== 0) {
        throw new Error(res.msg);
      }
      message.success('申请成功');
      navigate(-1);
    } catch (err) {
      message.warn(err.message);
    } finally {
      form.resetFields();
      setDataSource([]);
    }
  };
  const handleCancel = () => {
    navigate(-1);
  };
  const defaultColumns = [
    {
      title: '用户ID',
      dataIndex: 'memberId',
      width: '100',
    },
    {
      title: '注册手机号',
      dataIndex: 'mobile',
    },
    {
      title: '姓名',
      dataIndex: 'name',
    },
    {
      title: '身份证号',
      dataIndex: 'idCard',
    },
    {
      title: '转账金额(元)',
      dataIndex: 'amount',
      editable: true,
    },
    {
      title: '备注',
      dataIndex: 'remark',
      editable: true,
    },

    {
      title: '操作',
      dataIndex: 'operation',
      width: '80',
      render: (_, record) => (
        <Popconfirm title="你确定要删除?" onConfirm={() => handleDelete(record.memberId)}>
          <Button type="primary" danger>
            删除
          </Button>
        </Popconfirm>
      ),
    },
  ];
  const columns = defaultColumns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave,
      }),
    };
  });
  const fields = generateFields();
  const validateMessages = {
    // eslint-disable-next-line no-template-curly-in-string
    required: "'${label}' 是必选字段",
  };
  const beforeUpload = (file) => {
    const isLt30M = file.size / 1024 / 1024 < 30;
    const isExcel = file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      || 'application/vnd.ms-excel';
    const isWord = file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      || 'application/msword';
    if (!isExcel && !isWord) {
      message.error('只能上传excel和word文件');
      return false;
    }
    if (!isLt30M) {
      message.error('文件大小不能超过30M');
      return false;
    }
    return true;
  };
  const handleChange = async (event) => {
    const { file } = event;
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await httpRequest.post('/file/file/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      if (res.code !== 0) {
        throw new Error(res.msg);
      }
      setFileList([...fileList, { ...res.data, uid: file.uid, name: file.name }]);
    } catch (err) {
      message.error(err.message || '附件上传失败');
    }
  };
  return (
    <>
      <AutoComplete
        dropdownMatchSelectWidth={252}
        options={options}
        onChange={handleSearch}
        style={{ width: 300, borderRadius: '10px' }}
        notFoundContent="暂无数据"
      >
        <Input.Search size="large" placeholder="请输入姓名或者手机号查询" enterButton />
      </AutoComplete>
      <Table
        components={components}
        rowClassName={() => 'editable-row'}
        bordered
        dataSource={dataSource}
        columns={columns}
        pagination={false}
        scroll={{ y: 500 }}
        style={{ marginTop: '20px', marginBottom: '20px' }}
      />
      <Form form={form} validateMessages={validateMessages}>
        {fields.map((f) => (
          <Col span={24}>
            <FormItem
              name={f.name}
              label={f.label}
              type={f.type}
              rules={f.rules}
              inputProps={f.inputProps}
              showAllOption={f.showAllOption}
              labelAlign="left"
              labelCol={{ span: 2 }}
              wrapperCol={{ span: 22 }}
            />
          </Col>
        ))}
        {
          <Col span={24}>
            <Upload
              name="file"
              fileList={fileList}
              beforeUpload={beforeUpload}
              customRequest={(event) => {
                handleChange(event);
              }}
              onRemove={(file) => {
                setFileList(fileList.filter((item) => item.uid !== file.uid));
              }}
            >
              <Button icon={<UploadOutlined />}>选择文件</Button>
            </Upload>
          </Col>
        }
        <Col span={24} style={{ height: '32px' }} offset={10}>
          <Space>
            <Button type="primary" onClick={handleCancel}>
              取消
            </Button>
            <Button type="primary" ghost onClick={handleSubmit}>
              确认
            </Button>
          </Space>
        </Col>
      </Form>
    </>
  );
};
EditableCell.propTypes = {
  title: PropTypes.string,
  editable: PropTypes.bool,
  children: PropTypes.node,
  dataIndex: PropTypes.string,
  record: PropTypes.shape({}),
  handleSave: PropTypes.func,
};
EditableCell.defaultProps = {
  title: '',
  editable: false,
  children: '',
  dataIndex: '',
  record: {},
  handleSave: () => {},
};
EditableRow.propTypes = {
  index: PropTypes.number,
};
EditableRow.defaultProps = {
  index: 0,
};
export default Review;
