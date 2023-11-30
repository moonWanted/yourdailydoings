import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { apiUrl } from '../config/config';

export const useAddColumn = () => {
  const queryClient = useQueryClient()

  const addColumn = useMutation({
    mutationKey: 'columns',
    mutationFn: (data) => axios.post(`${apiUrl}/columns`, data.columnData),
    onSuccess: () => {
      queryClient.invalidateQueries('columns')
    }
  })
  return addColumn;
}

export const useEditColumn = () => {
  const queryClient = useQueryClient()

  const editColumn = useMutation({
    mutationKey: 'columns',
    mutationFn: (data) => axios.put(`${apiUrl}/columns/${data.id}`, data.columnData),
    onSuccess: () => {
      queryClient.invalidateQueries('columns')
    }
  })
  return editColumn;
}

export const useDeleteColumn = () => {
  const queryClient = useQueryClient()

  const deleteColumn = useMutation({
    mutationKey: 'columns',
    mutationFn: (id) => axios.delete(`${apiUrl}/columns/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries('columns')
    }
  })
  return deleteColumn;
}

