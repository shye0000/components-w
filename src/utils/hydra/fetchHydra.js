import HttpError from './HttpError';
import fetchJsonLd from './fetchJsonLd';
import {getDocumentationUrlFromHeaders} from 'api-doc-parser/lib/hydra/parseHydraDocumentation';
import {promises} from 'jsonld';
import {Headers} from 'node-fetch';

export default (url, options = {}) => {
	const params = options.params;
	let paramsStr = '';
	if (params) {
		paramsStr = Object.keys(params).map(function (k) {
			if (Array.isArray(params[k])) {
				const keyE = encodeURIComponent(k + '[]');
				return params[k].map(function (subData) {
					return keyE + '=' + encodeURIComponent(subData);
				}).join('&');
			} else {
				return encodeURIComponent(k) + '=' + encodeURIComponent(params[k]);
			}
		}).join('&');
		paramsStr = '?' +paramsStr;
	}
	url += paramsStr;

	const requestHeaders = options.headers || new Headers();

	return fetchJsonLd(url, {
		...options,
		headers: requestHeaders,
	}).then(data => {
		const status = data.response.status;
		if (status < 200 || status >= 300) {
			return promises
				.expand(data.body, {
					base: getDocumentationUrlFromHeaders(data.response.headers),
				})
				.then(json => {
					return Promise.reject(
						new HttpError(
							json[0]['http://www.w3.org/ns/hydra/core#description'][0]['@value'],
							status
						)
					);
				})
				.catch(e => {
					if (e instanceof HttpError) {
						return Promise.reject(e);
					}

					return Promise.reject(
						new HttpError(data.response.statusText, status)
					);
				});
		}

		return {
			status: status,
			headers: data.response.headers,
			json: data.body,
		};
	});
};