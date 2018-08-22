export const convertDataUrlToFile = (
	dataUrl = '',
	fileName = 'newCropped.png',
	mineType = 'image/png'
) => {
	return (
		fetch(dataUrl)
			.then((res) => {
				return res.arrayBuffer();
			})
			.then((buf) => {
				return new File([buf], fileName, {type: mineType});
			})
	);
};