import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'antd';

let timer = null;
const VerifyCode = ({ onSendSms, restSendStatus }) => {
  const [time, setTime] = useState(0);
  useEffect(() => {
    if (timer) {
      clearInterval(timer);
    }
    return () => timer && clearInterval(timer);
  }, []);
  useEffect(() => {
    if (time === 60) {
      timer = setInterval(() => {
        setTime((pre) => pre - 1);
      }, 1000);
    } else if (time === 0) {
      restSendStatus();
      clearInterval(timer);
    }
  }, [time]);
  const getCode = () => {
    if (onSendSms) {
      onSendSms(() => {
        setTime(60);
      });
    }
  };
  return (
    <Button type="text" style={{ color: '#80A2FF' }} onClick={getCode}>
      { time ? `${time}s后重新获取` : '获取验证码' }
    </Button>
  );
};
VerifyCode.propTypes = {
  onSendSms: PropTypes.func,
  restSendStatus: PropTypes.func,
};

VerifyCode.defaultProps = {
  onSendSms: () => {},
  restSendStatus: () => {},
};
export default VerifyCode;
