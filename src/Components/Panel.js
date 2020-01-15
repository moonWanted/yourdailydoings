import React from 'react';
import ReactDOM from 'react-dom';
import '@atlaskit/css-reset';
import styled from 'styled-components'
import {DragDropContext, Droppable} from 'react-beautiful-dnd';
import {LocalStorageManager} from "../LocalStorageManager.js";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    useRouteMatch,
    useLocation,
    useParams
} from "react-router-dom";
import Board from "./Board";

const initialData = {};

const Container = styled.div`
    display: flex;
    padding: 60px 30px;
    flex-wrap: wrap;
`;

const PanelContainer = styled.div`
    box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);
    margin: 8px;
    font-size: 1.5em;
    border: 1px solid lightgrey;
    background-color: white;
    border-radius: 20px;
    width: 350px;
    height: 100px;
    display: flex;
    outline: none;
    justify-content: center;
    flex-direction: column;
    text-align: center;
`;

const BoardContainer = styled.div`
    box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);
    margin: 8px;
    border: 1px solid lightgrey;
    background-color: white;
    border-radius: 15px;
    width: 200px;
    height: fit-content;
    display: flex;
    outline: none;
    justify-content: center;
    flex-direction: column;
    text-align: center;
`;

const BoardNameInput = styled.input`
    border: 1px solid lightgrey;
    border-radius: 10px;
    padding: 8px;
    margin-bottom: 8px;
    width: 80%;
     margin-left: auto;
    margin-right: auto;
`;

const Title = styled.h3`
    padding: 8px;
    outline: none;
`;

const HomeButton = styled.button`
    margin: 10px;
    font-size: 2em;
    padding: 0.25em 1em;
    border: 1px solid lightgrey;
    border-radius: 3px;
    outline: none;
    height: fit-content;
    display: block;
    margin-left: auto;
    margin-right: auto;
`;

const BoardButton = styled.button`
    margin: 10px;
    font-size: 1em;
    padding: 0.25em 1em;
    border: 1px solid lightgrey;
    border-radius: 3px;
    outline: none;
    height: fit-content;
    display: flex;
    margin-left: auto;
    margin-right: auto;
`;

const StyledNewBoardButtonNotClicked = styled.div`
    box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);
    margin: 8px;
    font-size: 1.5em;
    border: 1px solid lightgrey;
    background-color: lightgreen;
    border-radius: 20px;
    outline: none;
    width: 350px;
    height: 100px;
    display: flex;
    justify-content: center;
    flex-direction: column;
    text-align: center;
`;

const StyledNewBoardButtonClicked = styled.div`
    box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);
    margin: 8px;
    font-size: 1.5em;
    border: 1px solid lightgrey;
    background-color: lightgreen;
    border-radius: 20px;
    width: 350px;
    outline: none;
    height: fit-content;
    display: flex;
    justify-content: center;
    flex-direction: column;
    text-align: center;
`;

const LSM = new LocalStorageManager();
if (LSM.get() === null) {
    LSM.set(initialData);
}

const NewBoardButton = (props) => {
    if (props.isClicked) {
        return (
            <StyledNewBoardButtonClicked>
                <h3>Create new board</h3>
                <p style={{'font-size': ' 0.7em'}}>Write a name for new board</p>
                <BoardNameInput id={'boardInput'}/>
                <div
                    style={{display: 'flex'}}
                >
                    <BoardButton
                        onClick={(e) => {
                            props.handle(e);
                        }}
                    >
                        Cancel
                    </BoardButton>
                    <BoardButton
                        onClick={(e) => {
                            props.addNewBoard(e);
                        }}
                    >
                        Create
                    </BoardButton>
                </div>
            </StyledNewBoardButtonClicked>
        )
    } else {
        return (
            <StyledNewBoardButtonNotClicked
                onClick={(e) => {
                    props.handle(e);
                }}>
                Add new board
            </StyledNewBoardButtonNotClicked>
        )
    }


}

const BoardsRow = (props) => {
    let location = useLocation();
    if (location.pathname === '/') {
        return (
            <>
                <NewBoardButton
                    handle={props.addNewBoardHandler}
                    isClicked={props.addNewBoardClicked}
                    addNewBoard={props.addNewBoard}
                >
                </NewBoardButton>
                {Object.keys(props.data).map((board) => {
                    if (board) {
                        return (
                            <PanelContainer>
                                <Link to={`/${board}`}>
                                    <Title>{props.data[board].name}</Title>
                                </Link>
                            </PanelContainer>
                        )
                    } else {
                        return
                    }
                })}
            </>
        )
    } else {
        return (
            <BoardContainer>
                <Title>{props.data[location.pathname.slice(1)].name}</Title>
            </BoardContainer>
        )
    }
}

class Panel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: LSM.get(),
            addNewBoardCheck: false
        };
    }

    addNewBoard = (e) => {
        e.preventDefault();
        const newBoardId = `board-${+Object.keys(this.state.data).length + 1}`
        const newBoards = {
            ...this.state.data,
            [newBoardId]: {
                name: document.getElementById('boardInput').value,
                tasks: {},
                columns: {},
                columnOrder: []
            }
        };
        const newState = {
            ...this.state,
            data: newBoards
        }
        this.setState(newState)
    }

    addNewBoardHandler = (e) => {
        e.preventDefault();
        this.setState({addNewBoardCheck: !this.state.addNewBoardCheck});
    }

    updateBoardsState = (boardId, boardState) => {
        const newBoards = {
            ...this.state.data,
            [boardId]: boardState
        }
        this.setState({
            data: newBoards
        })
    }

    componentDidUpdate(prevProps, prevState, prevContext) {
        LSM.set(this.state.data);
    }

    render() {
        return (
            <Router>
                <HomeButton>
                    <Link to='/'> Main</Link>
                </HomeButton>
                <Container>
                    <BoardsRow
                        addNewBoard={this.addNewBoard}
                        addNewBoardHandler={this.addNewBoardHandler}
                        addNewBoardClicked={this.state.addNewBoardCheck}
                        data={this.state.data}
                    />
                </Container>
                <Switch>
                    {Object.keys(this.state.data).map((board) => {
                        return (
                            <Route path={`/${board}`}>
                                <Board
                                    currentBoard={this.state.data[board]}
                                    boardId={board}
                                    updateBoardsState={this.updateBoardsState}
                                />
                            </Route>
                        )
                    })}
                </Switch>
            </Router>
        );
    }
}

export default Panel;