import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

type Department = {
  _id: string;
  name: string;
  municipalities: {
    _id: string;
    name: string;
  }[];
};

const getDepartments = () => axios.get<Department[]>(`${import.meta.env.VITE_API_URL}/geo/departments`);

export default function useGetDepartments() {
  const {
    data: res,
    isFetching,
    isError,
  } = useQuery({
    queryKey: ['deparments'],
    queryFn: getDepartments,
  });

  return {
    departments: res?.data && Array.isArray(res?.data) ? res.data : [],
    isLoading: isFetching,
    isError,
  };
}
