import axios, { AxiosError } from 'axios';
import { useEffect, useState } from 'react';

const useAxios = <T>(url: string) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<AxiosError>();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get<T>(url);
        setData(data);
      } catch (error) {
        setError(error as AxiosError<any>);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [url]);

  return { data, loading, error };
};

export default useAxios;
