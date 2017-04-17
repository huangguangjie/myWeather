import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { render } from 'react-dom';
import { createStore, combineReducers, bindActionCreators, applyMiddleware, compose } from 'redux';
import { Provider, connect } from 'react-redux';
import thunkMiddleware from 'redux-thunk';
import { Map, List } from 'immutable';
import fetchJsonp from 'fetch-jsonp';
// import fetch from 'isomorphic-fetch';
// import fetch from 'axios';
import 'bootstrap/dist/css/bootstrap.css';

// Actions
const GET_CITY = 'GET_CITY';
const getCity = city => ({type: GET_CITY, city});

const GET_WEATHER = 'GET_WEATHER';
const getWeather = data => ({type: GET_WEATHER, data});

const FETCHING = 'FETCHING';
const fetchingWeather = fetching => ({type: FETCHING, fetching});

const fetchWeather = city => dispatch => {
	dispatch(fetchingWeather(true));
	return fetchJsonp(`https://api.asilu.com/weather/?city=${city}`)
		.then(response => response.json())
		.then(json => json)
		.then(data => dispatch(getWeather(data)))
		.then(() => dispatch(fetchingWeather(false)));
}

// Reducers
const city = (state = Map({city: '南宁'}), action) => {
	switch(action.type) {
		case GET_CITY: return state.update('city', () => action.city);
		default: return state;
	}
}
const fetchData = (state = Map({fetching: false}), action) => {
	switch(action.type) {
		case FETCHING: return state.update('fetching', () => action.fetching);
		default: return state;
	}
}
const weatherData = (state = Map({data: {}}), action) => {
	switch(action.type) {
		case GET_WEATHER: return state.update('data', () => action.data);
		default: return state;
	}
}


// store
const store = createStore(
	combineReducers({city,fetchData,weatherData}),
	compose(
		applyMiddleware(thunkMiddleware),
		window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
	)
);

// components
const SelectCity = ({ fetchWeather, getCity, city, fetchData }) => {
	let input;
	return (
		<div className="row">
			<div className="input-group">
				<input type="text" value={city} className="form-control" placeholder="输入城市" ref={node => {input = node}} onChange={e => getCity(e.target.value)}/>
				<span className="input-group-btn">
					<button className="btn btn-default" type="button" onClick={() => fetchWeather(input.value)}>{fetchData ? "查询中..." : "查询"}</button>
				</span>
			</div>
		</div>
	)
}
const WeatherItem = ({ date, weather, wind, temp }) => (
	<div className="col-md-3">
		<p>{date}</p>
		<p>{weather}</p>
		<p>{wind}</p>
		<p>{temp}</p>
	</div>
)
const WeatherInfo = ({ city, pm25, date, weather }) => (
	<div className="row" style={{marginTop: "20px"}}>
		<div className="jumbotron">
			<h1>{city}</h1>
			<ul className="list-inline">
				<li>pm2.5: {pm25}</li>
				<li>日期：{date}</li>
			</ul>
			<div className="row">
				{weather instanceof Array && weather.map((item,i) => {
					return <WeatherItem {...item} key={i} />
				})}
			</div>
		</div>
	</div>
)

// containers
@connect(state => state, dispatch => bindActionCreators({fetchWeather,getCity,fetchingWeather},dispatch))
class App extends Component {
	componentDidMount() {
		this.props.fetchWeather(this.props.city.get('city'));
	}
	render() {
		const { city, fetchWeather, fetchData, weatherData, getCity } = this.props;
		return (
			<div className="container" style={{marginTop: "20px"}}>
				<SelectCity
					fetchWeather={fetchWeather}
					getCity={getCity}
					city={city.get('city')}
					fetchData={fetchData.get('fetching')}/>
				<WeatherInfo {...weatherData.get('data')} />
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