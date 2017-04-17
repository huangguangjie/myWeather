import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { render } from 'react-dom';
import { createStore, combineReducers, bindActionCreators, applyMiddleware, compose } from 'redux';
import { Provider, connect } from 'react-redux';
import thunkMiddleware from 'redux-thunk';
import { Map } from 'immutable';
import fetchJsonp from 'fetch-jsonp';
// import fetch from 'isomorphic-fetch';
// import fetch from 'axios';
// import 'bootstrap/dist/css/bootstrap.css';

const ADD = 'ADD';
const add = () => ({type: ADD});

const SUB = 'SUB';
const sub = () => ({type: SUB});

const UNIT = 'UNIT';
const unitInput = unit => ({type: UNIT,unit});

const counter = (state = Map({num: 0}), action) => {
	switch(action.type) {
		case ADD: return state.update('num', v => v + 1);
		case SUB: return state.update('num', v => v - 1);
		default: return state;
	}
}

const unit = (state = Map({unit: 0}), action) => {
	switch(action.type) {
		case UNIT: return state.update('unit', () => action.unit);
		default: return state;
	}
}

const store = createStore(combineReducers({counter, unit}));
// console.log(store.getState());

@connect(
	state => ({...state, result: state.counter.get('num') * state.unit.get('unit')}),
	dispatch => bindActionCreators({add,sub,unitInput}, dispatch)
)
class App extends Component {
	render() {
		const { counter,unit,result,add,sub,unitInput } = this.props;
		return (
			<div>
				<div>
					<input type="button" value="-" onClick={sub}/>
					<input type="text" value={counter.get('num')} style={{width: "52px", textAlign: "center"}}/>
					<input type="button" value="+" onClick={add}/>
				</div>
				<input type="text" name="unit" value={unit.get('unit')} onChange={e => unitInput(e.target.value)} style={{width: "96px", textAlign: "center"}}/>
				<p style={{width: "96px", textAlign: "center"}}>{result}</p>
			</div>
		)
	}
}

render(
	<Provider store={store}>
		<App />
	</Provider>,
	document.getElementById('root')
)