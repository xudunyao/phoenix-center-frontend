import React, { useState, useEffect } from 'react';
import { Map, Marker } from 'react-bmap';
import { useParams } from 'react-router-dom';
import { httpRequest } from '@utils';
import {
  Card, Row, Col, Image, Spin, message, Tag,
} from 'antd';
import { globalStyles } from '@styles';

const { Content } = globalStyles;
const enumType = Object.freeze({
  companyName: '企业全称:',
  shortCompanyName: '企业简称:',
  group: '所属集团:',
  companyIntroduction: '企业简介:',
  location: '省市区:',
  addressDetail: '详细地址:',
  gpsAddress: '地图位置:',
  companyImages: '企业图片:',
  industry: '所属行业:',
  enterpriseSize: '企业规模:',
  employeeType: '企业类型:',
  companyGoodTags: '企业优势标签:',
  companyGoodDescription: '企业优势描述:',
  companyBadTags: '企业劣势标签:',
  companyBadDescription: '企业劣势描述:',
});

const Details = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [detailsData, setDetailsData] = useState({});
  const getData = async () => {
    try {
      setLoading(true);
      const { data } = await httpRequest.get(`/coreCompany/${id}`);
      const {
        companyImages, companyGoodTags, companyBadTags, province, city, area, gpsAddress,
      } = data;
      const map = (position) => (
        <Map
          style={{ height: 200, width: 350 }}
          center={{ lng: position.longitude, lat: position.latitude }}
          zoom={12}
          enableScrollWheelZoom
        >
          <Marker position={{ lng: position.longitude, lat: position.latitude }} enableDragging />
        </Map>
      );
      setDetailsData({
        ...data,
        location: `${province}-${city}-${area}`,
        gpsAddress: map(gpsAddress),
        companyImages: companyImages.map((item) => (
          <Image key={item.url} src={item.url} style={{ width: 100, height: 100 }} />
        )),
        jobRequest: [],
        companyGoodTags: companyGoodTags.map((item) => (
          <Tag key={item} color="green">
            {item}
          </Tag>
        )),
        companyBadTags: companyBadTags.map((item) => (
          <Tag key={item} color="red">
            {item}
          </Tag>
        )),
      });
    } catch (err) {
      message.error(err.msg);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    getData();
  }, [id]);
  return (
    <Spin spinning={loading} style={{ height: '100%' }}>
      <Card title="劳务公司详情" extra={<a href="/enterprise/employer">返回</a>}>
        <Row gutter={[20, 10]}>
          {detailsData
            && Object.keys(enumType).map((key) => (
              <React.Fragment key={key}>
                <Col span={3}>{enumType[key]}</Col>
                <Col span={21}>{detailsData[key]}</Col>
              </React.Fragment>
            ))}
        </Row>
      </Card>
    </Spin>
  );
};

export default Details;
