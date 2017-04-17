import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { render } from 'react-dom';
import { createStore, combineReducers, bindActionCreators, applyMiddleware, compose } from 'redux';
import { Provider, connect } from 'react-redux';
import thunkMiddleware from 'redux-thunk';
import { Map } from 'immutable';
import fetchJsonp from 'fetch-jsonp';
import 'bootstrap/dist/css/bootstrap.css';

const GET_MOBILE = 'GET_MOBILE';
const getMobile = mobile => ({type: GET_MOBILE, mobile});

const FETCHING = 'FETCHING';
const fetchingMobile = fetching => ({type: FETCHING, fetching});

const ADD_HISTORY = 'ADD_HISTORY';
const addHistory = mobile => ({type: ADD_HISTORY, mobile});

const fetchMobile = mobile => dispatch => {
	dispatch(fetchingMobile(true));
	return fetchJsonp(`https://tcc.taobao.com/cc/json/mobile_tel_segment.htm?tel=${mobile}`)
		.then(response => response.json())
		.then(json => json)
		.then(mobile => dispatch(getMobile(mobile)))
		.then(() => dispatch(fetchingMobile(false)))
}

const mobile = (state = Map({mobile: {}, fetching: false, list: []}), action) => {
	switch(action.type) {
		case GET_MOBILE: return state.update('mobile',() => action.mobile);
		case FETCHING: return state.update('fetching',() => action.fetching);
		case ADD_HISTORY: return state.update('list',() => action.list);
		default: return state;
	}
}

const history = (state = List(), action) => {
	switch(action.type) {
		case ADD_HISTORY: return state.push(action.mobile);
		default: return state;
	}
}

const store = createStore(combineReducers({mobile}), compose(applyMiddleware(thunkMiddleware), window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()));


const Search = ({ onSearch }) => {
	let input;
	return (
		<div className="col-lg-12">
			<div className="input-group">
				<input type="text" className="form-control" placeholder="输入手机号码" ref={node => {input = node}}/>
				<span className="input-group-btn">
					<button className="btn btn-default" type="button" onClick={() => onSearch(input.value)}>查询</button>
				</span>
			</div>
		</div>
	)
}
Search.propTypes = {
	onSearch: PropTypes.func.isRequired
}

const Infos = ({ mts, province, catName, telString, areaVid, ispVid, carrier }) => (
	<div className="col-lg-12" style={{marginTop: "30px"}}>
		<div className="jumbotron">
			<h1>{telString}</h1>
			<p>号码归属地：{province}</p>
			<p>运营商：{catName}</p>
		</div>
	</div>
)

@connect(state => state, dispatch => bindActionCreators({fetchMobile},dispatch))
class App extends Component {
	render() {
		const { mobile, fetchMobile } = this.props;
		return (
			<div className="container" style={{marginTop: "20px"}}>
				<Search onSearch={fetchMobile} />
				{!Map(mobile.get('mobile')).isEmpty() && <Infos {...mobile.get('mobile')} />}
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