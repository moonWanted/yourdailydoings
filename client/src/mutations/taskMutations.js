import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { apiUrl } from '../config/config';

export const useAddTask = () => {
  const queryClient = useQueryClient()

  const addTask = useMutation({
    mutationKey: 'tasks',
    mutationFn: (data) => axios.post(`${apiUrl}/tasks`, data),
    onSuccess: () => {
      queryClient.invalidateQueries('columns')
    }
  })
  return addTask;
}

export const useDeleteTask = () => {
  const queryClient = useQueryClient()

  const deleteTask = useMutation({
    mutationKey: 'tasks',
    mutationFn: (id) => axios.delete(`${apiUrl}/tasks/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries('columns')
    }
  })
  return deleteTask;
}

export const useMoveTask = () => {
  const queryClient = useQueryClient()

  const moveTask = useMutation({
    mutationKey: 'tasks',
    mutationFn: (data) => axios.put(`${apiUrl}/tasks/${data.id}`, data.taskData),
    onSuccess: () => {
      queryClient.invalidateQueries('columns')
    },
    onError: (error) => {
      console.log(error)
      queryClient.invalidateQueries('columns')
    }
  })
  return moveTask;
}
