import React, { useState } from 'react';
import styled from 'styled-components';
import { Draggable } from 'react-beautiful-dnd';
import Task from './Task';

const Container = styled.div`
    margin: 8px;
    padding: 0.5em;
    border: 1px solid lightgrey;
    background-color: white;
    border-radius: 2px;
    width: 220px;
    max-height: 35em;
    height: fit-content;
    display: flex;
    flex-direction: column;
    
`;
const Title = styled.h3`
    padding: 8px;
    margin: 0 auto 0.5em auto;
    display: flex;
    justify-content: space-between;
`;

const TitleInput = styled.input`
    margin-left: 1em;
    border: none;
    width: 90%;
    font-size: 1.3em;
    text-align: start;
`;

const RemoveButton = styled.button`
    border: none;
    background-color: white;
    cursor: pointer;
    color: palevioletred;
    position: absolute;
`;

const InputContainer = styled.div`
    display: flex;
    margin: auto auto 0.5em auto;
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

const Column = ({ 
  column, 
  index, 
  editColumnTitle,
  removeColumn, 
  addNewTask, 
  removeTask 
}) => {
  const placeholder = 'Add task...';
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

  return (
    <Container>
      <RemoveButton onClick={() => removeColumn(column.id)}>X</RemoveButton>
      <Title 
        onClick={e => setIsEditTitle(true)}
        onBlur={e => setIsEditTitle(false)}
      >
        {isEditTitle 
          ? <TitleInput 
              autoFocus 
              onBlur={e => editColumnTitle(e.target.value, column.id)}
              onKeyDown={e => onEnterKey(e)}
              type='text' 
              placeholder={column.title} 
            /> 
          : column.title}
      </Title>
      {column && column.tasks.map((task, index) => (
        <Draggable key={task.id} draggableId={task.id} index={index}>
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
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
      <InputContainer>
        <Input 
          value={inputData} 
          onChange={e => setInputData(e.target.value)} 
          type='text' 
          placeholder={placeholder} 
        />
        <SendButton 
          disabled={!inputData} 
          onClick={(e) => addNewTaskHandler(e)}
        >
          <b>{'>'}</b>
        </SendButton>
      </InputContainer>

    </Container>
    // <Droppable draggableId={id} index={index}>
    //   {(provided) => (
    //     <Container
    //       {...provided.draggableProps}
    //       ref={provided.innerRef}
    //     >
    //       <Title
    //         {...provided.dragHandleProps}
    //       >
    //         {title}
    //       </Title>
    //       <Draggable droppableId={id} type='task'>
          
    //       </Draggable>
    //     </Container>
    //   )}
    // </Droppable>
  );
}

export default Column;
