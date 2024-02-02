import { useMutation } from '@tanstack/react-query';
import axios from 'axios';

type CreateUserType = {
  name: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  address: string;
  monthlyIncome: number;
  document: {
    documentPhoto: string;
    documentType: string;
    documentNumber: string;
  };
  municipality: string;
};

const createUser = (data: CreateUserType) => axios.post(`${import.meta.env.VITE_API_URL}/users`, data);

export default function useCreateUser() {
  const { mutateAsync, isPending } = useMutation({
    mutationFn: createUser,
  });

  return {
    createUserAsync: mutateAsync,
    isLoading: isPending,
  };
}
