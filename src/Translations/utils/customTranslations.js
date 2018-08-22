import fs from 'fs';
import path from 'path';

const localePath = path.normalize(path.resolve(process.cwd(), process.env.npm_package_config_localePath)) + '/';

fs.readdir(localePath, function (err, list) {
	list.forEach(function (file) {
		if (file !== '_build') {
			const path = localePath + file;
			fs.stat(path, function (err, stat) {
				if (stat && stat.isDirectory()) {
					if (!fs.existsSync(path + '/messages.custom.json')) {
						fs.writeFileSync(path + '/messages.custom.json', '{}');
						fs.chmodSync(path + '/messages.custom.json', '0777');
					}
				}
			});
		}
	});
});