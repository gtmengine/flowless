const handleError = (e) => {
	console.error('-------------------------------------');
	console.error(
		'Something went wrong loading Flowless. Please take a screenshot of these details:'
	);
	console.error(e);
	console.error(e.stack);
	console.error('-------------------------------------');
};

export default handleError;
