import React, { useState } from 'react';
import styled from 'styled-components';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import Task from './Task';

const Column = ({ 
  column, 
  editColumnTitle,
  removeColumn, 
  addNewTask, 
  removeTask,
  dragHandleProps
}) => {
  const [inputData, setInputData] = useState('');
  const [isEditTitle, setIsEditTitle] = useState(false);

  const addNewTaskHandler = (e) => {
    e.preventDefault();
    addNewTask(inputData, column.id);
    setInputData('');
  }

  const onEnterKey = (e) => {
    if (e.key === 'Enter') {
      editColumnTitle(e.target.value, column.id);
      setIsEditTitle(false);
    }
  }

  const getStyle = (style, snapshot) => {
    if (!snapshot.isDropAnimating) {
      return style;
    }

    return {
      ...style,
      transitionDuration: `0.05s`,
    };
  };

  return (
    <Container>
      <RemoveButton onClick={() => removeColumn(column.id)}>X</RemoveButton>
      <Title
        onClick={e => setIsEditTitle(true)}
        onBlur={e => setIsEditTitle(false)}
        {...dragHandleProps}
      >
        {isEditTitle
          ? <TitleInput
              autoFocus
              onBlur={e => editColumnTitle(e.target.value, column.id)}
              onKeyDown={e => onEnterKey(e)}
              type='text'
              placeholder={column.title}
            />
          : <TitleLabel>{column.title}</TitleLabel>}
      </Title>
      <Droppable
        type="Task"
        droppableId={column.id} 
        key={column.id}
      >
        {(providedTaskDrop, dropSnapshot) => (
          <div
          {...providedTaskDrop.droppableProps}
            ref={providedTaskDrop.innerRef}
            key={column.id}
          >
            {column && column.tasks.map((task, index) => (
              <Draggable key={task.id} draggableId={task.id} index={index}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    style={getStyle(provided.draggableProps.style, snapshot)}
                  >
                    <Task
                      key={task.id}
                      task={task}
                      columnId={column.id}
                      removeTask={removeTask}
                    />
                  </div>)}
              </Draggable>
            ))}
            {providedTaskDrop.placeholder}

            {!dropSnapshot.isDraggingOver && <InputContainer>
              <Input
                value={inputData}
                onChange={e => setInputData(e.target.value)}
                type='text'
                placeholder='Add task...'
              />
              <SendButton
                disabled={!inputData}
                onClick={(e) => addNewTaskHandler(e)}
              >
                <b>{'>'}</b>
              </SendButton>
            </InputContainer>}
          </div>
        )}
      </Droppable>
    </Container>
  );
}

const Container = styled.div`
    margin: 8px;
    padding: 0.5em;
    width: 220px;
    display: flex;
    flex-direction: column;
    
`;
const Title = styled.h3`
    padding: 8px;
    margin: 0 auto 0.5em auto;
    width: 100%;
    display: flex;
    justify-content: center;
`;

const TitleInput = styled.input`
    margin-left: 1em;
    border: none;
    width: 90%;
    font-size: 1.3em;
    text-align: start;
`;

const TitleLabel = styled.div`
    cursor: pointer;
    width: fit-content;
`

const RemoveButton = styled.button`
    border: none;
    background-color: white;
    cursor: pointer;
    color: palevioletred;
    position: absolute;
`;

const InputContainer = styled.div`
    display: flex;
`;

const Input = styled.input`
    padding: 0.5em;
    color: palevioletred;
    background: papayawhip;
    border: none;
    border-radius: 3px 0 0 3px;
    width: 90%;
    font-size: 1em;
    text-align: start;
`;

const SendButton = styled.button`
    padding: 0.5em;
    color: palevioletred;
    background: papayawhip;
    border: none;
    border-radius: 0 3px 3px 0;
    width: 2em;
    font-size: 1em;
    text-align: start;

    :hover {
      cursor: pointer;
    }

    :disabled {
      color: transparent;
    }
`;

export default Column;
