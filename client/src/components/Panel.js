import React, { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import styled from 'styled-components';
import { apiUrl } from '../config/config.js';
import { useAddColumn, useEditColumn, useDeleteColumn } from '../mutations/columnMutations.js';
import { useAddTask, useDeleteTask, useMoveTask } from '../mutations/taskMutations.js';
// import useLocalStorage from '../hooks/useLocalStorage.js';
import Column from './Column';

const Panel = () => {
  //const [tasksData, setTasksData] = useLocalStorage(initialData);
  const [tasksData, setTasksData] = useState(null);
  const editColumnMutation = useEditColumn();
  const addColumnMutation = useAddColumn();
  const deleteColumnMutation = useDeleteColumn();
  const addTaskMutation = useAddTask();
  const deleteTaskMutation = useDeleteTask();
  const moveTaskMutation = useMoveTask();

  const { data } = useQuery({
    queryKey: ['columns'],
    queryFn: () => 
      axios.get(`${apiUrl}/columns`).then(res => res.data),
  })

  useEffect(() => {
    if (data) {
      setTasksData({
        columns: formatIds(data)
      })
    }
  }, [data, setTasksData])

  const formatIds = (columns) => {
    const newColumns = columns.map((column) => {
      const newColumn = {
        ...column,
        id: `column-${column.id}`,
        tasks: column.tasks.map((task) => {
          return {
            ...task,
            id: `task-${task.id}`
          }
        }).sort((a, b) => a.position - b.position)
      }
      return newColumn;
    }).sort((a, b) => a.position - b.position)
    return newColumns;
  }

  const getIdNumber = (id) => {
    return id.split('-')[1];
  }

  const editColumnTitle = useCallback((newTitle, columnId) => {
    editColumnMutation.mutate({
      id: getIdNumber(columnId),
      columnData: {
        title: newTitle
      }
    })
  }, [editColumnMutation]);

  const addNewColumn = useCallback(() => {
    addColumnMutation.mutate({
      columnData: {
        title: 'New column',
      }
    })

  }, [addColumnMutation]);

  const removeColumn = useCallback((columnId) => {
    deleteColumnMutation.mutate(getIdNumber(columnId))
  }, [tasksData, setTasksData]);

  // TODO add onEnterPress
  const addNewTask = useCallback((contentText, columnId) => {
    addTaskMutation.mutate({
      content: contentText,
      column_id: getIdNumber(columnId)
    })
  }, [addTaskMutation]);

  const removeTask = useCallback((taskId, columnId) => {
    deleteTaskMutation.mutate(getIdNumber(taskId))
  }, [tasksData, setTasksData]);

  const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  };
  
  const move = (coulmns, sourceCoulumnId, destinationCoulumnId, droppableSource, droppableDestination) => {
    const sourceClone = Array.from(coulmns[sourceCoulumnId].tasks);
    const destClone = Array.from(coulmns[destinationCoulumnId].tasks);
    const [removed] = sourceClone.splice(droppableSource.index, 1);
    destClone.splice(droppableDestination.index, 0, removed);
    const result = [ ...coulmns ];
    result[sourceCoulumnId].tasks = sourceClone;
    result[destinationCoulumnId].tasks = destClone;
    return result;
  };

  const onDragEnd = useCallback((result) => {
    const { source, destination, type, draggableId } = result;
    const stateColumns = Array.from(tasksData.columns);

    if (!destination) {
      return;
    }
    const sInd = source.droppableId;
    const dInd = destination.droppableId;
    const sourceCoulumnId = tasksData.columns.findIndex((col) => col.id === sInd);
    if (sInd === dInd) {
      if(type === 'Column') {
        // to prevent glitch animation first change state and then send request
        // TODO add optimistic update
        const columns = reorder(tasksData.columns, source.index, destination.index);
        setTasksData({ columns: columns });

        return editColumnMutation.mutate({
          id: getIdNumber(draggableId),
          columnData: {
            position: destination.index + 1
          }
        })
      }

      const currentColumn = { ...tasksData.columns[sourceCoulumnId] };
      const items = reorder(tasksData.columns[sourceCoulumnId].tasks, source.index, destination.index);
      currentColumn.tasks = items;
      const newState = [...stateColumns];
      newState[sourceCoulumnId] = currentColumn;
      setTasksData({ columns: newState });

      moveTaskMutation.mutate({
        id: getIdNumber(draggableId),
        taskData: {
          column_id: getIdNumber(source.droppableId),
          position: destination.index + 1
        }
      })
    } else {
      const destinationCoulumnId = tasksData.columns.findIndex((col) => col.id === dInd);
      const result = move(stateColumns, sourceCoulumnId, destinationCoulumnId, source, destination);
      setTasksData({ columns: result });

      moveTaskMutation.mutate({
        id: getIdNumber(draggableId),
        taskData: {
          column_id: getIdNumber(destination.droppableId),
          position: destination.index + 1
        }
      })
    }
  }, [tasksData, setTasksData]);

  return (
    <Container>
      <Title>Your Daily Doings</Title>
      <DragDropContext onDragEnd={onDragEnd} >
        <Droppable 
          droppableId="all-columns"
          type="Column"
          direction="horizontal"
        >
          {(providedColumnDrop) => (
            <ColumnsContainer
              ref={providedColumnDrop.innerRef}
              {...providedColumnDrop.droppableProps}
            >
              {tasksData && tasksData.columns.map((column, index) => (
                <Draggable draggableId={column.id} index={index} key={column.id}>
                  {(providedColumnDrag, snapshot) => (
                      <ColumnContainer
                         ref={providedColumnDrag.innerRef}
                         {...providedColumnDrag.draggableProps}                         
                      >
                        <Column
                          key={column.id}
                          column={column}
                          index={index}
                          addNewTask={addNewTask}
                          removeTask={removeTask}
                          editColumnTitle={editColumnTitle}
                          removeColumn={removeColumn}
                          dragHandleProps={providedColumnDrag.dragHandleProps}
                        />
                      </ColumnContainer>
                  )}
                </Draggable>
              ))}
              {providedColumnDrop.placeholder}
              <AddColumnButton onClick={e => addNewColumn()}>+</AddColumnButton>
            </ColumnsContainer>
          )}
        </Droppable>
      </DragDropContext>
    </Container>
  );
}

const Container = styled.div`
    display: flex;
    padding: 2em 4em;
    flex-wrap: wrap;
    flex-direction: column;
`;

const Title = styled.h1`
    font-size: 2em;
    text-align: center;
    color: palevioletred;
    margin: 0 auto 2em auto;
`;

const ColumnsContainer = styled.div`
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: flex-start;
`;

const AddColumnButton = styled.button`
    border: 1px solid;
    width: 100px;
    height: 100px;
    background-color: white;
    cursor: pointer;
    color: palevioletred;
    font-size: 1.5em;
    margin: auto 2em;

    :hover {
        background-color: palevioletred;
        color: white;
    }
`;

const ColumnContainer = styled.div`
    border: 1px solid lightgrey;
    background-color: white;
    border-radius: 2px;
    height: fit-content;
    margin: 8px;
`;

export default Panel;