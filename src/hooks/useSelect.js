import { useEffect, useState } from 'react';
import { httpRequest } from '@utils';

function useSelect(requestUrl) {
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState([]);
  const [originData, setOriginData] = useState([]);

  const getOptions = async () => {
    try {
      setLoading(true);
      const res = await httpRequest.post(requestUrl, {
        keywords: '',
      });
      if (res.code === 0) {
        const mappedOptions = res.data.map((item) => ({
          label: `${item.name}-${item.mobile}(${item.idNo})`,
          value: item.memberId,
        }));
        setOptions(mappedOptions);
        setOriginData(res.data);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (requestUrl) {
      getOptions();
    } else {
      setOptions([]);
      setOriginData([]);
    }
  }, [requestUrl]);

  return { loading, options, originData };
}

export default useSelect;
