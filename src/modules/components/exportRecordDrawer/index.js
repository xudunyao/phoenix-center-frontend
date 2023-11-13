/* eslint-disable consistent-return */
/* eslint-disable prefer-template */
import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import {
  Drawer, Popover, Progress, message, Button,
} from 'antd';
import { useQuery } from 'react-query';
import moment from 'moment';
import { Table } from '@/components';
import { httpRequest } from '@/utils';
import { datetimeFormat } from '@/constants';

const columns = [
  {
    title: '任务ID',
    dataIndex: 'id',
    key: 'id',
  },
  {
    title: '导出时间',
    dataIndex: 'timestamp',
    key: 'timestamp',
    render: (text, record) => (record.timestamp ? moment(record.timestamp).format(datetimeFormat.dateTime) : ''),
  },
  {
    title: '查询条件',
    dataIndex: 'searchShort',
    key: 'searchShort',
    width: 150,
    render: (text, record) => {
      if (text) {
        return (
          <Popover
            content={record.search?.map((s, index) => (
              <React.Fragment key={{ index }}>
                {s}
              </React.Fragment>
            ))}
          >
            {text}
          </Popover>
        );
      }
      return '';
    },
  },
  {
    title: '导出进度',
    dataIndex: 'status',
    key: 'status',
    width: 150,
    render: (status, record) => {
      switch (status) {
        case 'success':
          return <Progress percent={100} />;
        case 'failure':
          return <Progress percent={record.progress * 100} status="exception" />;
        default:
          return <Progress percent={record.progress * 100} status="active" />;
      }
    },
  },
  {
    title: '操作',
    dataIndex: 'operation',
    key: 'operation',
    render: (value, record) => (
      <Button type="link" href={record?.url}>下载到本地</Button>
    ),
  },
];

const ExportRecordDrawer = ({
  visible,
  type,
  searchCriteria,
  onClose,
}) => {
  const [pagination, setPagination] = useState({ pageNumber: 0, pageSize: 15, total: 0 });
  const timer = useRef(null);

  const handleTableChange = (params) => {
    setPagination({
      ...params,
      pageNumber: params.current - 1,
    });
  };

  const getData = async () => {
    if (!visible) { return; }
    const res = await httpRequest.post('/common/admin/syncExport/tasks', {
      type,
      ...pagination,
    });
    setPagination({
      ...pagination,
      pageNumber: res?.data?.pageNumber,
      pageSize: res?.data?.pageSize,
      total: res?.data?.total,
    });
    const records = res.data?.content?.map((r) => {
      const search = searchCriteria?.map((s) => {
        const content = s?.render ? s.render(r?.search) : r?.search?.[s?.key];
        return content ? ((s?.label || '') + ':' + content) : '';
      }).filter((s) => !!s);
      const searchShort = search?.join('；');
      return {
        ...r,
        search,
        searchShort: searchShort?.length > 15 ? searchShort.substr(0, 15) + '...' : searchShort,
      };
    });

    return records;
  };

  const {
    isLoading,
    error,
    data,
    refetch,
  } = useQuery(['settleMode', pagination, visible], getData);
  useEffect(() => {
    if (error) {
      message.error(error?.message);
    }
  }, [error]);

  useEffect(() => {
    if (visible && data?.find((r) => (r?.status === 'running' || r?.status === 'init'))) {
      timer.current = setInterval(refetch, 1000);
    }
    return () => {
      clearInterval(timer.current);
    };
  }, [visible, data]);

  return (
    <Drawer visible={visible} title="导出记录" onClose={onClose} width="800">
      <Table
        columns={columns}
        dataSource={data}
        loading={isLoading}
        pagination={pagination}
        onChange={handleTableChange}
      />
    </Drawer>
  );
};

ExportRecordDrawer.propTypes = {
  visible: PropTypes.bool,
  type: PropTypes.string.isRequired,
  searchCriteria: PropTypes.arrayOf(PropTypes.shape({
    key: PropTypes.string,
    label: PropTypes.string,
    render: PropTypes.func,
  })),
  onClose: PropTypes.func,
};

ExportRecordDrawer.defaultProps = {
  visible: false,
  searchCriteria: [],
  onClose: () => {},
};

export default ExportRecordDrawer;
