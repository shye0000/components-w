export default (language) => {
	return new Promise((resolve) => {
		const xobj = new XMLHttpRequest();
		xobj.overrideMimeType('application/json');
		xobj.open('GET', '/locale/' + language + '/messages.custom.json', true); // Replace 'my_data' with the path to your file
		xobj.onreadystatechange = () => {
			if (xobj.readyState == 4 && xobj.status == '200') {
				// Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
				resolve(JSON.parse(xobj.responseText));
			}
		};
		xobj.send(null);
	});
};