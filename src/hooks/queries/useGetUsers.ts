import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export type User = {
  document: Document;
  _id: string;
  name: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  monthlyIncome: number;
  address: string;
  municipality: Municipality;
};

type Municipality = {
  _id: string;
  name: string;
  department: Department;
};

type Department = {
  _id: string;
  name: string;
};

type Document = {
  documentType: string;
  documentNumber: string;
  documentPhoto: string;
};

const getUsers = (page: number = 1, limit: number = 10) =>
  axios.get<{
    users: User[];
    page: number;
    total: number;
  }>(`${import.meta.env.VITE_API_URL}/users`, {
    params: {
      skip: page,
      limit,
    },
  });

export default function useGetUsers(page?: number, limit?: number) {
  const { data, isFetching, isError } = useQuery({
    queryKey: ['users', page, limit],
    queryFn: () => getUsers(page, limit),
  });

  return {
    users: data?.data && Array.isArray(data?.data.users) ? data?.data.users : [],
    current: data?.data?.page ?? 1,
    total: data?.data?.total ?? 100,
    isFetching,
    isError,
  };
}
