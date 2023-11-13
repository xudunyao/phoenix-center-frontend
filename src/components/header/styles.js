import styled from 'styled-components';
import { Button, Form } from 'antd';

export const HeaderContainer = styled.div`
  display: flex;
  justify-content: flex-end;
`;

export const LogoutButton = styled(Button)`
  &:hover,
  &:focus {
    background-color: transparent;
  }
  &:hover {
    color: #1890ff;
  }
`;
export const MyForm = styled(Form)`
  & > .ant-input:focus {
    border-color: #fff;
    box-shadow: #fff;
    background-color: #fff !important;
  }
  & > .ant-input-affix-wrapper {
    height: 42px !important;
  }
  & > .ant-input-affix-wrapper-focused {
    box-shadow: none !important;
  }
  & > input {
    border-color: #fff;
    box-shadow: #fff;
    background-color: #fff !important;
  }
`;
export default {};
