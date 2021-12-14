module.exports = function (plop) {
	plop.setHelper('fileName', (name) => {
		return name.toLowerCase().replace(/\s/g, '-');
	});

	plop.setHelper('className', (name) => {
		return name.replace(/(?:^|\s)+\S/g, match => match.toUpperCase()).replace(/\s/g, '');
	});

	plop.setHelper('camelCase', (name) => {
		return name.replace(/(?:^|\s)+\S/g, match => match.toUpperCase()).replace(/(?:\s)?^\S/g, match => match.toLowerCase()).replace(/\s/g, '');
	});

	plop.setGenerator('component', {
		prompts: [{
			type: 'input',
			name: 'name',
			message: 'Component name'
		}],
		actions: [{
			type: 'add',
			path: 'src/components/{{fileName name}}.tsx',
			templateFile: '_templates/component.hbs'
		}]
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