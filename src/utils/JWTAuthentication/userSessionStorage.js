import jwtDecode from 'jwt-decode';
import {Headers} from 'node-fetch';

let user;

export const AUTH_TOKEN = 'AUTH_TOKEN';

export const REFRESH_TOKEN = 'REFRESH_TOKEN';

export const USER_DATA = 'USER_DATA';

export const USER_RIGHTS = 'USER_RIGHTS';

const decodeAuthToken = (token) => jwtDecode(token);

export const checkUserTokenValid = () => {
	const currentUser = getUser();
	const timestampNow = Math.ceil(new Date().valueOf() / 1000);
	if (currentUser[USER_DATA] && currentUser[USER_DATA].exp) {
		return timestampNow < currentUser[USER_DATA].exp;
	}
	return false;
};

export const addUserTokenToRequestOptions = (options = {}) => {
	const currentUser = getUser();
	const requestHeaders = options.headers || new Headers();
	if (currentUser[AUTH_TOKEN] && !options.public) {
		requestHeaders.set('Authorization', `Bearer ${currentUser[AUTH_TOKEN]}`);
	}
	return {
		...options,
		headers: requestHeaders
	};
};

export const addLocaleToRequestOptions = (options = {}) => {
	const requestHeaders = options.headers || new Headers();
	if (!options.withAllTranslations) {
		requestHeaders.set('locale', 'fr');
	}
	return {
		...options,
		headers: requestHeaders
	};
};

const setToken = (tokenName, tokenValue) => {
	if (typeof localStorage !== 'undefined') {
		localStorage.setItem(tokenName, tokenValue);
	}
};

const clearToken = (tokenName) => {
	if (typeof localStorage !== 'undefined') {
		localStorage.removeItem(tokenName);
	}
};

const getToken = tokenName => {
	if (typeof localStorage !== 'undefined') {
		return localStorage.getItem(tokenName);
	} else {
		return null;
	}
};

export const clearUser = () => {
	clearToken(AUTH_TOKEN);
	clearToken(REFRESH_TOKEN);
	clearToken(USER_DATA);
	clearToken(USER_RIGHTS);
};

export const setUser = (token, refreshToken) => {
	if (token && refreshToken) {
		setToken(AUTH_TOKEN, token);
		setToken(REFRESH_TOKEN, refreshToken);
		setToken(USER_DATA, JSON.stringify(decodeAuthToken(token)));
		user = {
			[USER_DATA]: JSON.parse(getToken(USER_DATA)),
			[AUTH_TOKEN]: getToken(AUTH_TOKEN),
			[REFRESH_TOKEN]: getToken(REFRESH_TOKEN),
		};
	}
};

export const getUser = () => {
	const userDataInLocalStorage = JSON.parse(getToken(USER_DATA));
	const userRightsInLocalStorage = JSON.parse(getToken(USER_RIGHTS));
	if (!user && userDataInLocalStorage) {
		setUser(getToken(AUTH_TOKEN), getToken(REFRESH_TOKEN));
		setUserRights(userRightsInLocalStorage);
	}
	if (user && user[USER_DATA] && userDataInLocalStorage && user[USER_DATA].iat !== userDataInLocalStorage.iat) {
		location.reload();
	}
	return {
		[USER_DATA]: JSON.parse(getToken(USER_DATA)),
		[AUTH_TOKEN]: getToken(AUTH_TOKEN),
		[REFRESH_TOKEN]: getToken(REFRESH_TOKEN),
		[USER_RIGHTS]: JSON.parse(getToken(USER_RIGHTS))
	};
};

export const setUserRights = (userRights) => {
	setToken(USER_RIGHTS, JSON.stringify(userRights));
};