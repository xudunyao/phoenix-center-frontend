/* eslint-disable react/jsx-props-no-spreading */
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Form, Button, Row, Col, Space,
} from 'antd';
import _ from 'lodash';
import { SearchOutlined } from '@ant-design/icons';
import { searchFieldCol } from '@/constants';

import FormItem from '../formItem';

const Search = ({
  onSubmit,
  fields,
  extra,
  initialValues,
  getForm,
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (getForm) {
      getForm(form);
    }
  }, [getForm]);

  const handleOnValueChange = _.debounce((changedValues, allValues) => {
    const { pageNumber, ...rest } = allValues;
    const params = {
      pageNumber: 0,
      ...rest,
    };
    onSubmit(params);
  }, 500);

  return (
    <Form
      form={form}
      onFinish={onSubmit}
      initialValues={initialValues}
      onValuesChange={handleOnValueChange}
    >
      <Row gutter={24}>
        {
            fields.map((f) => (f.fields?.length ? (
              <Col span={12}>
                <Form.Item name={f.name} label={f.label} style={{ marginBottom: 0 }}>
                  <Row size={20} align="middle">
                    {
                    f.fields.map((cf, index) => (
                      <>
                        {index > 0 && <span style={{ margin: '0 10px 24px' }}>{f.separator}</span>}
                        <FormItem
                          key={cf.name}
                          name={cf.name}
                          label={cf.label}
                          type={cf.type}
                          inputProps={{
                            ...cf.inputProps,
                            onChange: (val) => {
                              if (cf?.inputProps?.onChange) {
                                cf.inputProps.onChange(val, cf.name);
                              }
                            },
                          }}
                          labelAlign="right"
                        />
                      </>
                    ))
                  }
                  </Row>
                </Form.Item>
              </Col>
            ) : (
              <Col {...searchFieldCol.basic} key={f.name}>
                <FormItem name={f.name} label={f.label} type={f.type} inputProps={f.inputProps} showAllOption={f.showAllOption} labelAlign="right" />
              </Col>
            )))
          }
        <Col />
        <Form.Item>
          <Space size={10}>
            <Button icon={<SearchOutlined />} type="primary" htmlType="submit">搜索</Button>
            <Button
              onClick={() => {
                form.resetFields();
                form.submit();
              }}
            >
              重置
            </Button>
          </Space>
        </Form.Item>
        {extra}
      </Row>
    </Form>
  );
};

Search.propTypes = {
  onSubmit: PropTypes.func,
  fields: PropTypes.arrayOf({
    name: PropTypes.string,
    label: PropTypes.string,
    type: PropTypes.string,
    inputProps: PropTypes.object,
  }),
  extra: PropTypes.oneOf([PropTypes.node, PropTypes.string]),
  //  eslint-disable-next-line react/forbid-prop-types
  initialValues: PropTypes.object,
  // initialValues: PropTypes.shape,
  getForm: PropTypes.func,
};

Search.defaultProps = {
  onSubmit: () => {},
  fields: [],
  extra: null,
  initialValues: {},
  getForm: () => {},
};

export default Search;
