import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Form, Tree, Input, Button, Row, Space, message,
} from 'antd';
import { globalStyles } from '@/styles';
import { httpRequest } from '@/utils';

const { Content } = globalStyles;
const Edit = () => {
  const [expandedKeys, setExpandedKeys] = useState([]);
  const [checkedKeys, setCheckedKeys] = useState([]);
  const [autoExpandParent, setAutoExpandParent] = useState(true);
  const { id } = useParams();
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [treeData, setTreeData] = useState([]);
  const onExpand = (expandedKeysValue) => {
    setExpandedKeys(expandedKeysValue);
    setAutoExpandParent(false);
  };
  const onCheck = (checkedKeysValue) => {
    setCheckedKeys(checkedKeysValue);
    form.setFieldsValue({
      permissionIds: checkedKeysValue,
    });
  };
  const flatArrayObject = (data) => {
    const pre = [];
    const getValue = (arr) => {
      arr.forEach((item) => {
        if (item.childMenuVOList.length > 0) {
          getValue(item.childMenuVOList);
        } else {
          pre.push(item.permission);
        }
      });
    };
    getValue(data);
    return pre;
  };
  const getDetailsData = async () => {
    try {
      const res = await httpRequest.get(`role/${id}`);
      if (res.code !== 0) {
        throw new Error(res.msg);
      }
      form.setFieldsValue({
        name: res.data.name,
        permissionIds: res.data.permissionIds,
      });
      setCheckedKeys(res.data.permissionIds);
    } catch (err) {
      message.error(err.message);
    }
  };
  const getPermissionIds = async () => {
    try {
      const res = await httpRequest.get('permission/list');
      if (res.code !== 0) {
        throw new Error(res.msg);
      }
      setTreeData(res.data);
      const allKeys = flatArrayObject(res.data);
      if (!id) {
        setCheckedKeys(allKeys);
      }
      setExpandedKeys(allKeys);
      form.setFieldsValue({
        permissionIds: allKeys,
      });
    } catch (err) {
      message.error(err.message);
    }
  };
  const handleSelectAll = (e) => {
    const allKeys = flatArrayObject(treeData);
    setCheckedKeys(allKeys);
    form.setFieldsValue({
      permissionIds: allKeys,
    });
  };
  const handleOnFinish = async (values) => {
    try {
      const res = id
        ? await httpRequest.put(`/role/${id}`, values)
        : await httpRequest.post('/role', values);
      if (res.code !== 0) {
        throw new Error(res.msg);
      }
      if (id) {
        message.success('修改角色权限成功');
      } else {
        message.success('添加角色成功');
      }
      form.resetFields();
    } catch (err) {
      message.error(err.message);
    } finally {
      navigate('/setting/jurisdiction');
    }
  };
  useEffect(() => {
    getPermissionIds();
    if (id) {
      getDetailsData();
    }
  }, []);
  return (
    <Content>
      <Form
        form={form}
        onFinish={handleOnFinish}
        layout="vertical"
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 8 }}
        initialValues={{ remember: true }}
        autoComplete="off"
      >
        <Form.Item
          label="角色名称"
          name="name"
          rules={[{ required: true, message: '请输入你的角色' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label={(
            <Row style={{ display: 'flex', alignItems: 'center' }}>
              <span>选择权限</span>
              <Button
                type="primary"
                size="small"
                shape="round"
                style={{ margin: '0px 5px' }}
                onClick={handleSelectAll}
              >
                全选
              </Button>
              {' '}
              <Button
                onClick={() => {
                  setCheckedKeys([]);
                  form.setFieldsValue({
                    permissionIds: [],
                  });
                }}
                type="primary"
                ghost
                shape="round"
                size="small"
              >
                取消
              </Button>
            </Row>
          )}
          labelCol={{ span: 24 }}
          name="permissionIds"
          rules={[{ required: true, message: '请选择权限' }]}
        >
          <Tree
            checkable
            onExpand={onExpand}
            expandedKeys={expandedKeys}
            autoExpandParent={autoExpandParent}
            onCheck={onCheck}
            checkedKeys={checkedKeys}
            treeData={treeData}
            fieldNames={{
              title: 'name',
              key: 'permission',
              children: 'childMenuVOList',
            }}
          />
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Space size={10}>
            <Button type="primary" htmlType="submit">
              确认
            </Button>
            <Button
              onClick={() => {
                navigate('/setting/jurisdiction');
              }}
            >
              取消
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Content>
  );
};

export default Edit;
