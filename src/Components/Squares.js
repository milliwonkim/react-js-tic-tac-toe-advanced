import React, { Component } from 'react';
import './Squares.scss';
import Square from './FC/square';
import Winner from './FC/winner';
import { isThereWinner } from '../_methods';
import Rollback from './FC/rollback';
import * as _ from 'lodash';

class Squares extends Component {
    state = {
        history: [
            {
                squares: Array(9).fill(null),
            },
        ],
        stepNumber: 0,
        nextIsX: true,
        squareNothing: false,
    };

    // history를 [Array(9).fill(null)]로 하면 [] 안에 [] 가 안생기고
    // 하나의 []로 합쳐짐

    handleClick = (i) => {
        const nextIsX = this.state.nextIsX;
        const stepNumber = this.state.stepNumber;

        // ----------------------------------------

        // 여기도 cloneDeep을 써야하나?
        // 쓸 필요는 없다
        // 왜냐하면 일단 cloneDeep안에 들어가는 argument가 가독성이 떨어짐
        // 그냥 deep copy는 뒤에서 해도 괜찮아서 뒤에서 함
        const historyElement = this.state.history.slice(0, stepNumber + 1);
        const current = historyElement[historyElement.length - 1];

        // 완전한 deep copy를 위해 lodash를 씀
        const squares = _.cloneDeep(current.squares);

        if (isThereWinner(squares) || squares[i]) {
            return;
        }

        squares[i] = nextIsX ? 'X' : 'O';

        this.setState({
            history: historyElement.concat({
                squares: squares,
            }),
            stepNumber: stepNumber + 1,
            nextIsX: !nextIsX,
        });
    };

    jumpTo = (step) => {
        const stepNumber = this.state.stepNumber;
        const historyElement = this.state.history.slice(0, stepNumber + 1);
        const current = historyElement[stepNumber];

        // If there's no X or O, then throw UI for Click anythin

        const isSquaresNothing = (history) => {
            return history === null;
        };

        // if every element is null,
        if (current.squares.every(isSquaresNothing)) {
            this.setState({
                squareNothing: !this.state.squareNothing,
            });
        }

        this.setState({
            stepNumber: step,
            nextIsX: step % 2 === 0,
        });
    };

    rollbackHistory = () => {
        const stepNumber = this.state.stepNumber;
        const history = this.state.history.slice(0, stepNumber + 1);
        let i = 0;

        if (stepNumber < history.length) {
            this.a = setInterval(() => {
                this.setState({
                    stepNumber: i,
                    nextIsX: i % 2 === 0,
                });
                i++;
                if (stepNumber < i) {
                    clearInterval(this.a);
                }
            }, 1000);
        }
    };

    render() {
        const stepNumber = this.state.stepNumber;

        const historyElement = this.state.history.slice(0, stepNumber + 1);
        const current = historyElement[stepNumber];
        const isWinner = isThereWinner(current.squares);

        const square = current.squares.map((a, index) => {
            return (
                <Square
                    key={index}
                    value={a}
                    handleClick={() => this.handleClick(index)}
                    jumpTo={() => this.jumpTo(index)}
                />
            );
        });

        const rollBack = historyElement.map((_, i) => {
            if (i === 0) {
                return (
                    <Rollback
                        key={i}
                        value={`Go To ${
                            current.squares.includes(null) ? 'Start' : 'Back'
                        }`}
                        jumpTo={() => this.jumpTo(i)}
                    />
                );
            } else {
                return (
                    <Rollback
                        value={`Go To ${i}`}
                        key={i}
                        stepNumber={stepNumber}
                        jumpTo={() => this.jumpTo(i)}
                    />
                );
            }
        });

        return (
            <div className='outer-squares'>
                <div className='squares'>
                    {isWinner ? (
                        <Winner value={isWinner} />
                    ) : !current.squares.includes(null) ? (
                        <h1>We've Got No Winner</h1>
                    ) : this.state.squareNothing ? (
                        <h1>Hey, You Should have clicked ANY BOX!</h1>
                    ) : (
                        square
                    )}
                </div>
                <button onClick={() => this.rollbackHistory()}>
                    Roll Back History
                </button>
                <div className='rollback'>{rollBack}</div>
            </div>
        );
    }
}

export default Squares;
