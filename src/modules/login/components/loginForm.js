import React, { useState } from 'react';
import md5 from 'js-md5';
import { Form, message, Checkbox } from 'antd';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { LockOutlined, UserOutlined, InsuranceOutlined } from '@ant-design/icons';
import { httpRequest } from '@utils';
import authStore from '@stores/auth';
import { storageKeys } from '@/constants';
import { FormItem, inputType } from '@/components';
import VerifyCode from '@/modules/components/verifyCode';

import { SubmitBtn } from '../style';
import './styles.css';

const getSmsFields = ({
  onSendSms, sendStatus, type, restSendStatus,
}) => [
  {
    name: 'phone',
    label: '手机号',
    inputProps: {
      placeholder: '请输入手机号',
      value: Cookies.get('phone') || '',
      prefix: <UserOutlined />,
      maxLength: 11,
    },
    rules: [
      {
        required: true,
      },
    ],
  },
  type === 'sms'
    ? {
      name: 'smsValidCode',
      label: '验证码',
      inputProps: {
        placeholder: '验证码',
        prefix: <InsuranceOutlined />,
        suffix: (
          <VerifyCode
            onSendSms={sendStatus ? onSendSms : () => {}}
            restSendStatus={restSendStatus}
          />
        ),
        maxLength: 6,
      },
      rules: [
        {
          required: true,
        },
      ],
    }
    : {
      name: 'password',
      label: '密码',
      type: inputType.password,
      inputProps: {
        placeholder: '请输入密码',
        prefix: <LockOutlined />,
      },
      rules: [
        {
          required: true,
        },
      ],
    },
];

const LoginForm = ({ type }) => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [sendStatus, setSendStatus] = useState(true);
  const smsFields = getSmsFields({
    sendStatus,
    onSendSms: async (cb) => {
      const formValue = form.getFieldValue();
      if (formValue?.phone) {
        const res = await httpRequest.post('/sms/send', {
          mobile: formValue?.phone,
          type: 'centerLogin',
        });
        if (res.code === 0) {
          message.success('验证码已发送');
          if (cb) {
            cb();
          }
          setSendStatus(false);
        } else {
          message.error(res.msg);
        }
      } else {
        message.error('请输入手机号');
      }
    },
    restSendStatus: () => {
      setSendStatus(true);
    },
    type,
  });
  const validateMessages = {
    required: '此选项不能为空！',
  };
  const onFinish = async (val) => {
    const { password, ...rest } = val;
    try {
      const res = await httpRequest.post('/client/noauth/user/login', {
        loginType: type,
        password: md5(`${password}erGDxe8L`),
        ...rest,
      });
      if (res?.code !== 0) {
        throw new Error(res?.msg);
      }
      authStore.setIsLoggedIn(true);
      authStore.setProfile(res.data.userName);
      Cookies.set(storageKeys.username, res.data.userName);
      Cookies.set(storageKeys.token, res?.data.token);
      if (val?.remember) {
        Cookies.set('phone', val.phone, { expires: 7 });
        Cookies.set('password', val.password, { expires: 7 });
        Cookies.set('remember', 'true', { expires: 7 });
      } else {
        Cookies.remove('phone');
        Cookies.remove('password');
        Cookies.remove('remember');
      }
      navigate('/', { replace: true });
    } catch (err) {
      message.error(err.message || '登陆失败');
    }
  };

  return (
    <Form
      form={form}
      validateMessages={validateMessages}
      onFinish={onFinish}
      initialValues={{
        remember: Cookies.get('remember') || false,
        password: Cookies.get('password') || '',
        phone: Cookies.get('phone'),
      }}
      className="login-form"
    >
      {smsFields.map((f) => (
        <FormItem
          key={f.name}
          name={f.name}
          inputProps={f.inputProps}
          type={f.type}
          rules={f.rules}
        />
      ))}
      <Form.Item name="remember" valuePropName="checked">
        {type !== 'sms' ? <Checkbox>记住密码</Checkbox> : null}
      </Form.Item>
      <Form.Item>
        <SubmitBtn className="submitBtn" onClick={() => form.submit()}>
          登录
        </SubmitBtn>
      </Form.Item>
    </Form>
  );
};

LoginForm.propTypes = {
  type: PropTypes.string,
};

LoginForm.defaultProps = {
  type: '',
};
export default LoginForm;
