import React from 'react';
import styled from 'styled-components';
import {Droppable, Draggable} from 'react-beautiful-dnd';
import Task from'./Task';

const Container = styled.div`
    margin: 8px;
    border: 1px solid lightgrey;
    background-color: white;
    border-radius: 2px;
    width: 220px;
    height: fit-content;
    display: flex;
    flex-direction: column;
    
`;
const Title = styled.h3`
    padding: 8px;
`;
const TaskList = styled.div`
    padding: 8px;
    transition: background-color 0.2s ease;
    background-color: ${props => (props.isDraggingOver ? 'skyblue' : 'inherit')}
    flex-grow: 1;
    
`;
const TaskNameInput = styled.input`
    border: 1px solid lightgrey;
    border-radius: 10px;
    padding: 8px;
    margin-bottom: 8px;
    width: 90%;
`;
const AddTitleDiv = styled.div`
    padding: 8px;
`;

export default class Column extends React.Component {
    render () {
        const addTitleText = this.props.column.title ? '' : 'Add name for this column'
        return (
            <Draggable draggableId={this.props.column.id} index={this.props.index}>
                {(provided) => (
                    <Container
                        style={{ display:'block'}}
                        {...provided.draggableProps}
                        ref={provided.innerRef}
                    >
                        <Title
                            {...provided.dragHandleProps}
                        >
                            {this.props.column.title}
                        </Title>
                        <Droppable droppableId={this.props.column.id} type='task'>
                            {(provided, snapshot) => (
                                <TaskList
                                    ref={provided.innerRef}
                                    isDraggingOver={snapshot.isDraggingOver}
                                    {...provided.droppableProps}
                                >
                                    <TaskNameInput onKeyUp = {(event) => {
                                        if(event.keyCode == 13) {
                                            event.preventDefault();
                                            if(this.props.column.title) {
                                                this.props.onChangeInput(event, this.props.column.id);
                                            } else {
                                                this.props.onChangeTitle(event, this.props.column.id);
                                            }

                                        }
                                    }} />
                                    {this.props.tasks.map((task, index) => (
                                        <Task key={task.id} task={task} index={index}/>
                                    ))}
                                    <AddTitleDiv>{addTitleText}</AddTitleDiv>
                                    {provided.placeholder}
                                </TaskList>
                            )}
                        </Droppable>
                    </Container>
                )}
            </Draggable>
        );
    }
}