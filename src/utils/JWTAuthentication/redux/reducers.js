import * as constants from './actionTypes';

const initialState = {
	data: null,
	isLoading: false
};

export default function (state = initialState, {type, payload}) {
	switch (type) {
		case constants.USER_LOGGING_IN:
			return {...initialState, isLoading: true};
		case constants.USER_LOGGED_IN:
			return {data: payload, isLoading: false};
		case constants.USER_CHANGED:
			return {data: payload, isLoading: false};
		case constants.USER_LOGGED_OUT:
			return {data: null, isLoading: false};
		default:
			return state;
	}
}
