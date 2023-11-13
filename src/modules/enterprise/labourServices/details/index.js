import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { httpRequest } from '@utils';
import {
  Card, Row, Col, Image, Space, Spin, message,
} from 'antd';
import { globalStyles } from '@styles';

const { Content } = globalStyles;

const ServiceDetails = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [detailsData, setDetailsData] = useState({});
  const fetchUrl = async (fileKey) => {
    try {
      const res = await httpRequest.get('/file/fetchUrl', {
        params: {
          fileKey,
        },
      });
      return res;
    } catch (err) {
      return '';
    }
  };
  const getData = async () => {
    try {
      setLoading(true);
      const { data } = await httpRequest.get(`/tenant/detail/${id}`);
      const [logo, brand] = await Promise.all([data.logoUrl && fetchUrl(data.logoUrl), data.brandUrl && fetchUrl(data.brandUrl)]);
      setDetailsData({
        ...data,
        logoUrl: logo?.data,
        brandUrl: brand?.data,
        id: null,
      });
    } catch (err) {
      message.error(err.msg);
    } finally {
      setLoading(false);
    }
  };
  const enumType = Object.freeze({
    name: '企业名称：',
    registerCapital: '注册资金：',
    registerAddress: '注册地址：',
    registerCode: '公司注册号：',
    legalPerson: '企业法人：',
    legalPersonIdNo: '法人证件号: ',
    contactMobile: '联系电话：',
    city: '所在城市：',
    belongType: '企业类型：',
    contactEmail: '联系邮箱：',
    adminAccount: '管理员账号：',
    adminName: '管理员姓名：',
    logoUrl: '企业logo：',
    brandUrl: '企业品牌：',
  });
  useEffect(() => {
    getData();
  }, [id]);
  return (
    <Spin spinning={loading} style={{ height: '100%' }}>
      <Card title="劳务公司详情" extra={<Link to="/enterprise/labour-services">返回</Link>}>
        <Row gutter={[20, 10]}>
          {detailsData
            && Object.keys(enumType).map((key) => {
              if (key === 'logoUrl' || key === 'brandUrl') {
                return (
                  <>
                    <Col span={3}>{enumType[key]}</Col>
                    <Col span={9}>
                      <Image src={detailsData[key]} style={{ width: '100%' }} />
                    </Col>
                    <Col span={12} />
                  </>
                );
              }
              return (
                <>
                  <Col span={3}>{enumType[key]}</Col>
                  <Col span={21}>{detailsData[key]}</Col>
                </>
              );
            })}
        </Row>
      </Card>
    </Spin>
  );
};

export default ServiceDetails;
