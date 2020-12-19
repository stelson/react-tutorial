import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square (props) {
    return (
        <button className="square" onClick={props.onClick} style={{'background': props.changeBackground ? '#b1e9b2' : '#fff'}}>
            { props.value }
        </button>
    );
}

class Board extends Component {
    renderSquare(i) {
        return <Square
            value = {this.props.squares[i]}
            changeBackground = {this.props.winnerSeq.some(x => x === i)}
            onClick = { () => this.props.onClick(i)}
        />;
    }

    renderRow(row) {
        return <div className="board-row">
            {
                [0,1,2].map((j) => {
                    return this.renderSquare(3 * j + row);
                })
            }
        </div>
    }

    render() {
        return <div>
            {
                [0,1,2].map((row) => {
                    return this.renderRow(row);
                })
            }
        </div>;
    }
}

class Game extends Component {
    constructor(props) {
        super(props);
        this.state = {
            squarePos: Array(9).fill(null),
            history: [{
                squares: Array(9).fill(null),
            }],
            stepNumber: 0,
            xIsNext: true,
            revertSort: false
        }
    }

    handleSortClick() {
        this.setState({
            revertSort: !this.state.revertSort
        })
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const squarePos = this.state.squarePos.slice(0, this.state.stepNumber + 1);
        squarePos.push(i);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        if (calculateWinner(squares).length > 0 || squares[i]) {
            return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            squarePos: squarePos,
            history: history.concat([{
                squares: squares,
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext
        });
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
        });
    }

    render() {
        const history = this.state.history;
        const historyOrder = history.slice(0, this.state.stepNumber + 1);
        const squarePosOrder = this.state.squarePos.slice(0, this.state.stepNumber + 1);
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);
        const moves = historyOrder.map((step, move) => {
            const pos = this.state.revertSort && move ? this.state.stepNumber + 1 - move : move;
            const squareId = squarePosOrder[pos];
            const row = squareId % 3 + 1;
            const col = Math.floor(squareId/3) + 1;
            const desc = pos ? 'Go to move #' + pos + ' col: ' + col + ' ,row: ' + row : 'Reset game';
            const currentMove = pos === this.state.stepNumber;
            return (
                <li key={pos} style={{'fontWeight': currentMove ? 'bold' : 'normal'}}>
                    <button onClick={() => this.jumpTo(pos)} style={{'fontWeight':  currentMove ? 'bold' : 'normal'}}>{desc}</button>
                </li>
            );
        });
        let status;
        if (winner.length > 0) {
            status = 'The winner is: ' + current.squares[winner[0]];
        } else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }
        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        squares={current.squares}
                        winnerSeq={winner}
                        onClick={(i) => this.handleClick(i)}
                    />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <ol>{moves}</ol>
                    <button onClick={() => this.handleSortClick()}>Revert moves sorting</button>
                </div>
            </div>
        );
    }
}

function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return [a, b, c];
        }
    }
    return [];
}

// ========================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);
