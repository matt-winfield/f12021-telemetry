const getFilePath = (name) => {
	return name.replace(/\s+|([^^/])([A-Z])/g, '$1-$2').toLowerCase();
}

module.exports = function (plop) {
	plop.setHelper('fileName', (name) => {
		let pathElements = getFilePath(name).split('/')
		return pathElements[pathElements.length - 1];
	});

	plop.setHelper('fileNameWithPath', (name) => {
		return getFilePath(name);
	});

	plop.setHelper('className', (name) => {
		let pathElements = getFilePath(name).split('/');
		return pathElements[pathElements.length - 1]
			.replace(/(?:^|[\s-])+\S/g, match => match.toUpperCase())
			.replace(/[\s-]/g, '');
	});

	plop.setHelper('camelCase', (name) => {
		let pathElements = getFilePath(name).split('/');
		return pathElements[pathElements.length - 1]
			.replace(/(?:^|[\s-])+\S/g, match => match.toUpperCase())
			.replace(/(?:\s)?^\S/g, match => match.toLowerCase())
			.replace(/[\s-]/g, '');
	});

	plop.setGenerator('component', {
		prompts: [{
			type: 'input',
			name: 'name',
			message: 'Component name'
		}],
		actions: [
			{
				type: 'add',
				path: 'src/components/{{fileNameWithPath name}}/{{fileName name}}.tsx',
				templateFile: '_templates/component.hbs'
			},
			{
				type: 'add',
				path: 'src/components/{{fileNameWithPath name}}/{{fileName name}}.test.tsx',
				templateFile: '_templates/component-tests.hbs'
			}
		]
	});

	plop.setGenerator('slice', {
		prompts: [{
			type: 'input',
			name: 'name',
			message: 'Slice name'
		}],
		actions: [{
			type: 'add',
			path: 'src/slices/{{fileName name}}-slice.ts',
			templateFile: '_templates/slice.hbs'
		}]
	})
};