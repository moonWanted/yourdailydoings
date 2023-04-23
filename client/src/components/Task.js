import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
    border: 1px solid lightgrey;
    border-radius: 2px;
    padding: 8px;
    margin-bottom: 8px;
    display: flex;
    justify-content: space-between;
    background-color: ${props => (props.isDragging ? 'lightgreen' : 'white')} ;
`;

const RemoveButton = styled.button`
    border: none;
    background-color: white;
    cursor: pointer;
    color: palevioletred;
`;

const Task = ({ task, columnId, removeTask }) => {
  return (
    <Container>
      {task.content}
      <RemoveButton onClick={() => removeTask(task.id, columnId)}>x</RemoveButton>
    </Container>
  );
}

export default Task;
