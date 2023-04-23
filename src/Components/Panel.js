import React, { useCallback } from 'react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import styled from 'styled-components';
import useLocalStorage from '../hooks/useLocalStorage.js';
import Column from './Column';

const initialData = {
  columns: [
    {
      id: 'column-1',
      title: 'To do',
      tasks: [
        {
          id: 'task-1',
          content: 'Take out the garbage',
        },
        {
          id: 'task-2',
          content: 'Watch my favorite show',
        }
      ],
    },
    {
      id: 'column-2',
      title: 'In progress',
      tasks: [
        {
          id: 'task-3',
          content: 'Charge my phone',
        },
      ],
    },
  ]
};

const Panel = () => {
  const [tasksData, setTasksData] = useLocalStorage(initialData);

  // TODO add useCallback to prevent unnecessary rerenders
  const editColumnTitle = useCallback((newTitle, columnId) => {
    const columnIndex = tasksData.columns.findIndex((col) => col.id === columnId);
    const newColumns = tasksData.columns.slice()
    newColumns[columnIndex].title = newTitle;
    setTasksData({ columns: newColumns });
  }, [tasksData, setTasksData]);

  const addNewColumn = useCallback(() => {
    const newColumnId = `column-${+Object.keys(tasksData.columns).length+1}`
    const newColumns = [
      ...tasksData.columns,
      {
        id: newColumnId,
        title: 'New column',
        tasks: []
      }
    ]
    setTasksData({ columns: newColumns });
  }, [tasksData, setTasksData]);

  const removeColumn = useCallback((columnId) => {
    const newColumns = tasksData.columns.filter((col) => col.id !== columnId);
    setTasksData({ columns: newColumns });
  }, [tasksData, setTasksData]);

  const addNewTask = useCallback((contentText, columnId) => {
    const columnIndex = tasksData.columns.findIndex((col) => col.id === columnId);
    const newColumns = tasksData.columns.slice()
    newColumns[columnIndex].tasks.push({
      id: `task-${Date.now()}`,
      content: contentText
    })
    setTasksData({ columns: newColumns });
  }, [tasksData, setTasksData]);

  const removeTask = useCallback((taskId, columnId) => {
    const columnIndex = tasksData.columns.findIndex((col) => col.id === columnId);
    const newColumns = tasksData.columns.slice()
    newColumns[columnIndex].tasks = newColumns[columnIndex].tasks.filter((task) => task.id !== taskId);
    setTasksData({ columns: newColumns });
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
    const { source, destination, type } = result;
    const stateColumns = Array.from(tasksData.columns);

    if (!destination) {
      return;
    }
    const sInd = source.droppableId;
    const dInd = destination.droppableId;
    const sourceCoulumnId = tasksData.columns.findIndex((col) => col.id === sInd);
    if (sInd === dInd) {
      if(type === 'Column') {
        const columns = reorder(tasksData.columns, source.index, destination.index);
        return setTasksData({ columns: columns });
      }
      const currentColumn = { ...tasksData.columns[sourceCoulumnId] };
      const items = reorder(tasksData.columns[sourceCoulumnId].tasks, source.index, destination.index);
      currentColumn.tasks = items;
      const newState = [...stateColumns];
      newState[sourceCoulumnId] = currentColumn;
      setTasksData({ columns: newState });
    } else {
      const destinationCoulumnId = tasksData.columns.findIndex((col) => col.id === dInd);
      const result = move(stateColumns, sourceCoulumnId, destinationCoulumnId, source, destination);
      setTasksData({ columns: result });
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