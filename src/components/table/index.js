/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import PropTypes from 'prop-types';
import { Table } from 'antd';

const MyTable = ({
  columns,
  dataSource,
  ...rest
}) => (
  <Table bordered size="small" columns={columns} dataSource={dataSource} {...rest} />
);

MyTable.propTypes = {
  columns: PropTypes.arrayOf(PropTypes.shape({
    title: PropTypes.string,
    dataIndex: PropTypes.string,
    key: PropTypes.string,
    render: PropTypes.func,
  })).isRequired,
  dataSource: PropTypes.arrayOf({}).isRequired,
};

export default MyTable;
