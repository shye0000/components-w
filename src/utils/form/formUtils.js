export const formatFormValues = (formValues) => {
	return formatFormTranslationsValues(formValues);
};

export const formatFormTranslationsValues = (formValues) => {
	let formattedValues = {
		translations: {}
	};
	Object.keys(formValues).forEach(function (key) {
		const keyArray = key.split('::');
		if (keyArray[0] === 'translationValue') {
			if (!formattedValues.translations[keyArray[1]]) {
				formattedValues.translations[keyArray[1]] = {};
			}
			formattedValues.translations[keyArray[1]][keyArray[2]] = formValues[key];
		} else {
			formattedValues[key] = formValues[key];
		}
	});
	return formattedValues;
};