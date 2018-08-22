import fetch from 'node-fetch';
import * as constants from './actionTypes';
import {setUser, getUser, setUserRights, clearUser, addUserTokenToRequestOptions, USER_DATA, REFRESH_TOKEN, USER_RIGHTS} from '../userSessionStorage';

const dataToRequestFormBody = data => {
	const formBody = [];
	for (const property in data) {
		const encodedKey = encodeURIComponent(property);
		const encodedValue = encodeURIComponent(data[property]);
		formBody.push(encodedKey + '=' + encodedValue);
	}
	return formBody.join('&');
};

export const fetchUserRights = (fetchUserRightsEndPoint, options = {}) => {
	options = addUserTokenToRequestOptions(options);
	return new Promise((resolve, reject) => {
		fetch(fetchUserRightsEndPoint, options).then(
			(response) => {
				if (response.status === 200) {
					response.json().then(body => {
						setUserRights(body);
						resolve();
					});
				} else {
					reject();
				}
			},
			() => {
				reject();
			}
		);
	});
};

export const refreshToken = (def) => {
	return () => (dispatch) => {
		const currentUser = getUser();
		const refreshToken = currentUser ? currentUser[REFRESH_TOKEN] : null;
		if (refreshToken) {
			const data = {
				refresh_token: refreshToken,
				...def.config.extraData
			};
			const formBody = dataToRequestFormBody(data);
			return new Promise((resolve) => {
				fetch(def.config.endPoint, {
					...def.config.options,
					body: formBody
				}).then(
					(response) => {
						if (response.status === 200) {
							response.json().then(body => {
								setUser(body.token, body.refresh_token);
								if (def.fetchUserRightsConfig) {
									fetchUserRights(
										def.fetchUserRightsConfig.endPoint,
										def.fetchUserRightsConfig.options
									).then(
										() => {
											dispatch(loginSuccess());
											resolve();
										},
										() => {
											dispatch(logout());
										}
									);
								} else {
									dispatch(loginSuccess());
									resolve();
								}

							});
						} else {
							dispatch(logout());
						}
					},
					() => {
						dispatch(logout());
					}
				);
			});
		} else {
			return new Promise(() => {
				dispatch(logout());
			});
		}
	};
};

const runLoginRequest = (loginCheckEndPoint, options, data) => {
	const formBody = dataToRequestFormBody(data);
	return fetch(loginCheckEndPoint, {
		...options,
		body: formBody
	});
};

export const login = (def) => {
	return (data) => dispatch => {
		dispatch({
			type: constants.USER_LOGGING_IN
		});
		runLoginRequest(def.config.endPoint, def.config.options, {
			...data,
			...def.config.extraData
		}).then(
			(response) => {
				if (response.status === 200) {
					response.json().then(body => {
						setUser(body.token, body.refresh_token);
						if (def.fetchUserRightsConfig) {
							fetchUserRights(
								def.fetchUserRightsConfig.endPoint,
								def.fetchUserRightsConfig.options
							).then(
								() => {
									dispatch(loginSuccess());
								},
								() => {
									dispatch(logout());
								}
							);
						} else {
							dispatch(loginSuccess());
						}
					});
				} else {
					dispatch(logout());
				}
			},
			() => {
				dispatch(logout());
			}
		);
	};
};

export const loginSuccess = () => (dispatch) => {
	const user = getUser();
	dispatch({
		type: constants.USER_LOGGED_IN,
		payload: {
			...user[USER_DATA],
			rights: user[USER_RIGHTS]
		}
	});
};

export const logout = () => dispatch => {
	clearUser();
	dispatch({
		type: constants.USER_LOGGED_OUT
	});
};
