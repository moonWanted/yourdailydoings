import React from 'react';
import ReactDOM from 'react-dom';
import '@atlaskit/css-reset';
import styled from 'styled-components'
import {DragDropContext, Droppable} from 'react-beautiful-dnd';
import Column from './Column';

const Container = styled.div`
    display: flex;
`;

const NewColumnButton = styled.button`
    font-size: 2em;
    margin: 1em;
    padding: 0.25em 1em;
    border: 1px solid lightgrey;
    border-radius: 3px;
   
    height: fit-content;
`;


class Board extends React.Component {
    constructor(props) {
        super(props);
        this.state = this.props.currentBoard;
    }

    addTask = (e, c) => {
        const newTaskId = `task-${+Object.keys(this.state.tasks).length+1}`;

        let newTasks = {
            ...this.state.tasks,
            [newTaskId] : {id: newTaskId, content: e.target.value}
        };

        let currentColumn = this.state.columns[c];
        const newTaskIds = Array.from(currentColumn.taskIds);
        newTaskIds.push(newTaskId);
        const newColumn = {
            ...currentColumn,
            taskIds: newTaskIds
        }

        const newState = {
            ...this.state,
            tasks: newTasks,
            columns: {
                ...this.state.columns,
                [c]: newColumn
            }
        }
        this.setState(newState);
        this.props.updateBoardsState(this.props.boardId, newState)

        e.target.value = '';
    };

    addNewColumn = () => {
        const newColumnId = `column-${+Object.keys(this.state.columns).length+1}`
        const newColumns = {
            ...this.state.columns,
            [newColumnId]: {
                id: newColumnId,
                title: '',
                taskIds: [],
            }
        };

        const newColumnOrder = Array.from(this.state.columnOrder);
        newColumnOrder.push(newColumnId);
        const newState = {
            ...this.state,
            columns: newColumns,
            columnOrder: newColumnOrder,
        }
        this.setState(newState);
        this.props.updateBoardsState(this.props.boardId, newState)
    }

    addTitle = (e, columnId) => {
        const newState = {
            ...this.state,
            columns: {
                ...this.state.columns,
                [columnId]: {
                    ...this.state.columns[columnId],
                    title: e.target.value,
                }
            }
        }

        this.setState(newState);
        this.props.updateBoardsState(this.props.boardId, newState)
    }

    onDragEnd = result => {
        const {destination, source, draggableId, type} = result;

        if(!destination) {
            return;
        }

        if(
            destination.droppableId === source.droppableId &&
            destination.index === source.index
        ) {
            return;
        }

        if(type ==='column') {
            const newColumnOrder = Array.from(this.state.columnOrder);
            newColumnOrder.splice(source.index, 1);
            newColumnOrder.splice(destination.index,0, draggableId);

            const newState = {
                ...this.state,
                columnOrder: newColumnOrder,
            };
            this.setState(newState);
            this.props.updateBoardsState(this.props.boardId, newState)
            return;
        }

        const start = this.state.columns[source.droppableId];
        const finish = this.state.columns[destination.droppableId];
        if(start === finish) {
            const newTaskIds = Array.from(start.taskIds);
            newTaskIds.splice(source.index, 1);
            newTaskIds.splice(destination.index, 0, draggableId);

            const newColumn = {
                ...start,
                taskIds: newTaskIds,
            };

            const newState = {
                ...this.state,
                columns: {
                    ...this.state.columns,
                    [newColumn.id]: newColumn,
                }
            }

            this.setState(newState);
            this.props.updateBoardsState(this.props.boardId, newState)
            return;
        }

        const startTaskIds = Array.from(start.taskIds);
        startTaskIds.splice(source.index, 1);
        const newStart = {
            ...start,
            taskIds: startTaskIds,
        };

        const finishTaskIds = Array.from(finish.taskIds);
        finishTaskIds.splice(destination.index, 0, draggableId);
        const newFinish = {
            ...finish,
            taskIds: finishTaskIds,
        }

        const newState = {
            ...this.state,
            columns: {
                ...this.state.columns,
                [newStart.id]: newStart,
                [newFinish.id]: newFinish,
            },
        };
        this.setState(newState);
        this.props.updateBoardsState(this.props.boardId, newState)
    };

    render() {
        return (
            <DragDropContext onDragEnd={this.onDragEnd}>
                <Droppable
                    droppableId='all-columns'
                    direction='horizontal'
                    type='column'
                >
                    {(provided) =>(
                        <Container
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                        >
                            {this.state.columnOrder.map((columnId, index) => {
                                const column = this.state.columns[columnId];
                                const tasks = column.taskIds.map(taskId => this.state.tasks[taskId]);

                                return <Column
                                    key={column.id}
                                    column={column}
                                    tasks={tasks}
                                    index={index}
                                    onChangeInput={this.addTask}
                                    onChangeTitle={this.addTitle}
                                />;
                            })}
                            <NewColumnButton
                                onClick={this.addNewColumn}
                            >
                                +
                            </NewColumnButton>
                            {provided.placeholder}
                        </Container>
                    )}
                </Droppable>
            </DragDropContext>

        );
    }
}

export default Board;