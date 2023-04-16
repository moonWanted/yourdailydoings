import React from 'react';
import styled from 'styled-components';
import { Draggable } from 'react-beautiful-dnd';

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
    // <Draggable draggableId={this.props.task.id} index={this.props.index}>
    //     {(provided, snapshot) => (
    <Container
      // {...provided.draggableProps}
      // {...provided.dragHandleProps}
      // ref={provided.innerRef}
      // isDragging={snapshot.isDragging}
    >
      {task.content}
      <RemoveButton onClick={() => removeTask(task.id, columnId)}>x</RemoveButton>
    </Container>
    //     )}
    // </Draggable>
  );
}

export default Task;
