import styled from 'styled-components';
import {
  Tabs,
} from 'antd';

export const LoginContent = styled.div`
  display: flex;
  height: 100vh;
  justify-content: flex-start;
  .content-right{
    width: 50%;
    background: #F4F7FF;
  }
  .content-left{
    width: 50%;
    background: #5F83E7;
  }
  .content-shadow{
    width: 1092px;
    height: 628px;
    background: #000000;
    opacity: 0.2;
    filter: blur(39px);
    top: 50%;
    bottom: 0;
    right: 0;
    left: 50%;
    transform: translate(-50%, -50%);
    position: fixed;
  }
  .content{
    width: 1200px;
    height: 740px;
    background: #FFFFFF;
    border-radius: 24px;
    top: 50%;
    bottom: 0;
    right: 0;
    left: 50%;
    transform: translate(-50%, -50%);
    position: fixed;
    z-index: 22;
    position: fixed;
    z-index: 1;
    display: flex;
    .content-item-left{
      width: 50%;
      height: 100%;
      background: #F4F7FF;
      border-radius: 24px 0px 0px 24px;
      position: relative;
      .login-bg{
        width:625px;
        height:462px;
        top: 50%;
        margin-top: -231px;
        position: absolute;
      }
    }
    .content-item-right{
      width: 50%;
      height: 100%;
      background: #fff;
      border-radius: 0px 24px 24px 0px;
      .login{
        width:418px;
        margin:0 auto;
        .logo{
          width:160px;
          height:50px;
          margin: 70px auto;
          display:block;
        }
      }
    }
  }
`;
export const TabsContent = styled(Tabs)`
 > .ant-tabs-nav::before{
  border:none;
 }
> .ant-tabs-nav {
  > .ant-tabs-nav-wrap{
    justify-content:center;
  }
}
> .ant-tabs-ink-bar{
  color: #80A2FF;
}

>.ant-tabs-tab-active{
  > .ant-tabs-tab-btn {
    color: #80A2FF;
  }
}
`;
export const SubmitBtn = styled.div`
  height: 40px;
  line-height: 40px;
  background: #80A2FF;
  border-radius: 8px;
  font-size: 18px;
  font-weight: 600;
  color: #FFFFFF;
  text-align:center;
`;
export default {};
