import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
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

  const editColumnTitle = (newTitle, columnId) => {
    const columnIndex = tasksData.columns.findIndex((col) => col.id === columnId);
    const newColumns = tasksData.columns.slice()

    newColumns[columnIndex].title = newTitle;

    setTasksData({ columns: newColumns });
  }

  const addNewColumn = () => {
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
  }

  const removeColumn = (columnId) => {
    const newColumns = tasksData.columns.filter((col) => col.id !== columnId);

    setTasksData({ columns: newColumns });
  }

  const addNewTask = (contentText, columnId) => {
    const columnIndex = tasksData.columns.findIndex((col) => col.id === columnId);
    const newColumns = tasksData.columns.slice()

    newColumns[columnIndex].tasks.push({
      id: `task-${Date.now()}`,
      content: contentText
    })
    
    setTasksData({ columns: newColumns });
  }

  const removeTask = (taskId, columnId) => {
    const columnIndex = tasksData.columns.findIndex((col) => col.id === columnId);
    const newColumns = tasksData.columns.slice()

    newColumns[columnIndex].tasks = newColumns[columnIndex].tasks.filter((task) => task.id !== taskId);

    setTasksData({ columns: newColumns });
  }


  return (
    <Container>
      <Title>Your Daily Doings</Title>
      <DragDropContext 
      >
        <ColumnsContainer>
          {tasksData && tasksData.columns.map((column, index) => (
            <Droppable droppableId={column.id} key={column.id}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  <Column 
                    key={column.id} 
                    column={column} 
                    index={index} 
                    addNewTask={addNewTask} 
                    removeTask={removeTask}
                    editColumnTitle={editColumnTitle}
                    removeColumn={removeColumn}
                  />
                </div>
              )}
            </Droppable>
          ))}
          <AddColumnButton onClick={e => addNewColumn()}>+</AddColumnButton>
        </ColumnsContainer>
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

export default Panel;