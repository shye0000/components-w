import fs from 'fs';
import path from 'path';

class controller {
	static modify (req, res) {
		const localePath = path.normalize(path.resolve(process.cwd(), process.env.npm_package_config_localePath)) + '/';
		const body = req.body;
		for(let lang of Object.keys(body)) {
			const customJsonPath = localePath + lang + '/messages.custom.json';
			if (fs.existsSync(customJsonPath)) {
				const messageCustomJsonContent = JSON.parse(fs.readFileSync(customJsonPath));
				for(let key of Object.keys(body[lang])) {
					const trans = body[lang][key];
					if (trans || trans === 0) {
						messageCustomJsonContent[key] = trans;
					} else {
						delete messageCustomJsonContent[key];
					}

				}
				fs.writeFileSync(customJsonPath, JSON.stringify(messageCustomJsonContent));
			}
		}
		res.status(200).send();
	}
	static getTransByKey (req, res) {
		const key = req.body.key;
		const languages = req.body.languages;
		let translations = {};
		for (let lang of Object.keys(languages)) {
			let customJsonContent, defaultJsonContent, customMessage, defaultMessage;
			const localePath = path.normalize(path.resolve(process.cwd(), process.env.npm_package_config_localePath)) + '/';
			const customJsonPath = localePath + lang + '/messages.custom.json';
			const defaultJsonPath = localePath + lang + '/messages.json';
			if (fs.existsSync(customJsonPath) && fs.existsSync(defaultJsonPath)) {
				customJsonContent = JSON.parse(fs.readFileSync(customJsonPath));
				defaultJsonContent = JSON.parse(fs.readFileSync(defaultJsonPath));
			}
			if (customJsonContent && defaultJsonContent) {
				customMessage = customJsonContent[key] || '';
				defaultMessage = defaultJsonContent[key] ? defaultJsonContent[key].translation : '';
			}
			translations[lang] = customMessage || defaultMessage;
		}
		res.json(translations);
		res.status(200);
	}
}
export default controller;