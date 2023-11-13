import useOption from './useOption';
import useSelect from './useSelect';

function useSourceChannel() {
  const { loading, options, originData } = useOption('/selector/sourceChannel');
  return {
    sourceChannel: options,
  };
}
function useTenantOption() {
  const { loading, options, originData } = useOption('/selector/tenant');
  return {
    tenantOption: options,
  };
}
function useTypeOfWork() {
  const { loading, options, originData } = useOption('/selector/typeOfWork');
  return {
    typeOfWork: options,
  };
}
function useAllStatus() {
  const { loading, options, originData } = useOption('/selector/orderStatus');
  return {
    allStatus: options,
  };
}
function useSignUpStatus() {
  const { loading, options, originData } = useOption('/selector/signUpOrderStatus');
  return {
    signUpStatus: options,
  };
}
function useJoinedStatus() {
  const { loading, options, originData } = useOption('/selector/joinedStatus');
  return {
    joinedStatus: options,
  };
}
function useStaffStatus() {
  const { loading, options, originData } = useOption('/selector/staffStatus');
  return {
    staffStatus: options,
  };
}
function useInterviewStatus() {
  const { loading, options, originData } = useOption('/selector/interviewStatus');
  return {
    interviewStatus: options,
  };
}
function useEmploymentStatus() {
  const { loading, options, originData } = useOption('/selector/employmentStatus');
  return {
    employmentStatus: options,
  };
}
function usePaymentChannel() {
  const { loading, options, originData } = useOption('/selector/wallet/paymentChannel');
  return {
    paymentChannel: options,
  };
}
function useAreaStatus() {
  const { loading, options, originData } = useOption('/selector/area');
  return {
    areaStatus: originData?.map((item) => ({
      label: item.provinceName,
      value: item.provinceName,
      children: item.districts.map((city) => ({
        label: city.cityName,
        value: city.cityName,
        children: city.districts.map((district) => ({
          label: district,
          value: district,
        })),
      })),
    })),
  };
}
function useSelectStatus() {
  const { loading, options, originData } = useSelect('/admin/member/list');
  return {
    selectStatus: options,
  };
}
function useStageEnum() {
  const { loading, options, originData } = useOption('admin/award/stageEnum');
  return {
    stageEnum: options,
  };
}
function useInviteStageEnum() {
  const { loading, options, originData } = useOption('admin/invite/stageEnum');
  return {
    inviteStageEnum: options,
  };
}

export default {
  useSourceChannel,
  useTenantOption,
  useTypeOfWork,
  useAllStatus,
  useSignUpStatus,
  useJoinedStatus,
  useInterviewStatus,
  useEmploymentStatus,
  useAreaStatus,
  useStaffStatus,
  usePaymentChannel,
  useSelectStatus,
  useStageEnum,
  useInviteStageEnum,
};
