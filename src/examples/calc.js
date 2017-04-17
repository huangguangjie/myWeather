import React, { Component } from 'react';
import { render } from 'react-dom';
import { createStore, combineReducers, bindActionCreators, applyMiddleware } from 'redux';
import { Provider, connect } from 'react-redux';
import { Map } from 'immutable';

const ADD = 'ADD';
const SUB = 'SUB';
const add = () => ({type: ADD})
const sub = () => ({type: SUB})

const calc = (state = Map({number: 0}), action) => {
	switch(action.type) {
		case ADD: return state.update('number', v => v + 1);
		case SUB: return state.update('number', v => v - 1);
		default: return state;
	}
}

const store = createStore(combineReducers({calc}));

@connect(state => state, dispatch => bindActionCreators({add,sub},dispatch))
class App extends Component {
	render() {
		const { calc, add, sub } = this.props;
		return (
			<div>
				<input type="button" value="-" onClick={() => sub()}/>
				<input type="text" value={calc.get('number')}/>
				<input type="button" value="+" onClick={() => add()}/>
			</div>
		)
	}
}

render(<Provider store={store}><App /></Provider>,document.getElementById('root'))
