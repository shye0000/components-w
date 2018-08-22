import FormData from 'form-data';

/**
 * Constant for API_ENTRY_POINT.
 */
export const API_ENTRY_POINT = 'API_ENTRY_POINT';
/**
 * Constant for APP_STORE.
 */
export const APP_STORE = 'appStore';
/**
 * Constant for REQUEST_RUNNER.
 */
export const REQUEST_RUNNER = 'requestRunner';
/**
 * Constant for INTERNATIONALIZATION.
 */
export const INTERNATIONALIZATION = 'internationalization';
/**
 * Constant for CHECK_USER_AUTH.
 */
export const CHECK_USER_AUTH = 'checkUserAuth';
/**
 * Constant for ADD_USER_AUTH_INFO_TO_REQUEST_OPTIONS.
 */
export const ADD_USER_AUTH_INFO_TO_REQUEST_OPTIONS = 'addUserAuthInfoToRequestOptions';
/**
 * Constant for USER_AUTH_NOT_VALID_CALLBACK.
 */
export const USER_AUTH_NOT_VALID_CALLBACK = 'userAuthNotValidCallback';
/**
 * Constant for LOGIN_CHECK.
 */
export const LOGIN_CHECK = 'loginCheck';
/**
 * Constant for FILE_ENTRY_POINT.
 */
export const FILE_ENTRY_POINT = 'fileEntryPoint';

/**
 * Class ApiClient
 */
export default class ApiClient {
	/**
	 * Create a ApiClient.
	 * @param {Object} definition - constructor apiClient definition.
	 * @param {string} definition[API_ENTRY_POINT] - Api entry point url string.
	 * @param {Object} definition[APP_STORE] - Redux store.
	 * @param {function(url: string, options: Object): Promise} definition[REQUEST_RUNNER] - Method for running requests, promise as return.
	 * @param {function(options: Object): Object} definition[INTERNATIONALIZATION] - Method for adding locale info in request configurations.
	 * @param {function(): Boolean} definition[CHECK_USER_AUTH] - Method for checking user auth validity, boolean as return.
	 * @param {function(options: Object): Object} definition[ADD_USER_AUTH_INFO_TO_REQUEST_OPTIONS] - Method for adding user auth information in request configurations.
	 * @param {function(): Promise} definition[USER_AUTH_NOT_VALID_CALLBACK] - Callback function if user auth info not valid, promise as return.
	 * @param {function(): Promise} definition[LOGIN_CHECK] - User login method, promise as return.
	 * @param {string} definition[FILE_ENTRY_POINT] - api entry point for files.
	 */
	constructor(definition = {
		[API_ENTRY_POINT]: '',
		[APP_STORE]: null,
		[REQUEST_RUNNER]: null,
		[INTERNATIONALIZATION]: null,
		[CHECK_USER_AUTH]: null,
		[ADD_USER_AUTH_INFO_TO_REQUEST_OPTIONS]: null,
		[USER_AUTH_NOT_VALID_CALLBACK]: null,
		[LOGIN_CHECK]: null,
		[FILE_ENTRY_POINT]: '',
	}) {
		/**
		 * @type {string}
		 */
		this[API_ENTRY_POINT] = definition[API_ENTRY_POINT][definition[API_ENTRY_POINT].length - 1] === '/' ?
			definition[API_ENTRY_POINT] : definition[API_ENTRY_POINT] + '/';
		/**
		 * @type {Object}
		 */
		this[APP_STORE] = definition[APP_STORE];
		/**
		 * @type {function}
		 */
		this[REQUEST_RUNNER] = definition[REQUEST_RUNNER];
		/**
		 * @type {function}
		 */
		this[INTERNATIONALIZATION] = definition[INTERNATIONALIZATION];
		/**
		 * @type {function}
		 */
		this[CHECK_USER_AUTH] = definition[CHECK_USER_AUTH];
		/**
		 * @type {function}
		 */
		this[ADD_USER_AUTH_INFO_TO_REQUEST_OPTIONS] = definition[ADD_USER_AUTH_INFO_TO_REQUEST_OPTIONS];
		/**
		 * @type {function}
		 */
		this[USER_AUTH_NOT_VALID_CALLBACK] = definition[USER_AUTH_NOT_VALID_CALLBACK];
		/**
		 * @type {function}
		 */
		this[LOGIN_CHECK] = definition[LOGIN_CHECK];
		/**
		 * @type {string}
		 */
		this[FILE_ENTRY_POINT] = definition[FILE_ENTRY_POINT];
	}

	/**
	 * Method for updating request options (add auth header or language information).
	 * @param {Object} options - Original request options.
	 * @return {Object} - updated request options.
	 */
	updateRequestHeaders(options = {}) {
		if (this[ADD_USER_AUTH_INFO_TO_REQUEST_OPTIONS]) {
			options = this[ADD_USER_AUTH_INFO_TO_REQUEST_OPTIONS](options);
		}
		if (this[INTERNATIONALIZATION]) {
			options = this[INTERNATIONALIZATION](options);
		}
		return options;
	}

	/**
	 * Method for user log in.
	 * @param {object} data - login data.
	 * @return {Promise}.
	 */
	login(data = {}) {
		return this[LOGIN_CHECK](data);
	}

	/**
	 * Method for uploading file.
	 * @param {object} file.
	 * @return {Promise}.
	 */
	uploadFile = (file = {}) => {
		const form = new FormData();
		form.append('attachment', file);
		return this.fetch(this[FILE_ENTRY_POINT], {
			method: 'POST',
			body: form
		});
	}

	/**
	 * Method for fetching api resources.
	 * @param {string} url - url string.
	 * @param {object} options - request configuration options.
	 * @return {Promise}.
	 */
	fetch(url = '', options = {}) {
		url = this[API_ENTRY_POINT] + (url[0] === '/' ? url.substring(1) : url);
		const valid = options.public || this[CHECK_USER_AUTH]();
		if (valid) {
			options = this.updateRequestHeaders(options);
			return this[REQUEST_RUNNER](url, options);
		} else {
			return new Promise((resolve, reject) => {
				this[APP_STORE].dispatch(this[USER_AUTH_NOT_VALID_CALLBACK]()).then(
					() => {
						options = this.updateRequestHeaders(options);
						resolve(this[REQUEST_RUNNER](url, options));
					},
					() => {
						reject();
					}
				);
			});
		}
	}

}
