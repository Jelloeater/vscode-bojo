import * as assert from 'assert';
import { getNextState, getPrevState, cycleLine } from '../cycler';

describe('Cycler Tests', () => {
	describe('getNextState', () => {
		it('should cycle space to forward slash', () => {
			assert.strictEqual(getNextState(' '), '/');
		});

		it('should cycle forward slash to exclamation', () => {
			assert.strictEqual(getNextState('/'), '!');
		});

		it('should cycle exclamation to x', () => {
			assert.strictEqual(getNextState('!'), 'x');
		});

		it('should cycle x back to space', () => {
			assert.strictEqual(getNextState('x'), ' ');
		});

		it('should return null for unknown state', () => {
			assert.strictEqual(getNextState('?'), null);
		});
	});

	describe('getPrevState', () => {
		it('should cycle space back to x', () => {
			assert.strictEqual(getPrevState(' '), 'x');
		});

		it('should cycle forward slash back to space', () => {
			assert.strictEqual(getPrevState('/'), ' ');
		});

		it('should cycle exclamation back to forward slash', () => {
			assert.strictEqual(getPrevState('!'), '/');
		});

		it('should cycle x back to exclamation', () => {
			assert.strictEqual(getPrevState('x'), '!');
		});

		it('should return null for unknown state', () => {
			assert.strictEqual(getPrevState('?'), null);
		});
	});

	describe('cycleLine', () => {
		it('should cycle hyphen list forward', () => {
			const result = cycleLine('- [ ] Task', 'forward');
			assert.strictEqual(result, '- [/] Task');
		});

		it('should cycle asterisk list forward', () => {
			const result = cycleLine('* [/] Task', 'forward');
			assert.strictEqual(result, '* [!] Task');
		});

		it('should cycle plus list forward', () => {
			const result = cycleLine('+ [!] Task', 'forward');
			assert.strictEqual(result, '+ [x] Task');
		});

		it('should cycle indented list forward', () => {
			const result = cycleLine('  - [x] Task', 'forward');
			assert.strictEqual(result, '  - [ ] Task');
		});

		it('should cycle line with extra content', () => {
			const result = cycleLine('- [ ] Task with more text', 'forward');
			assert.strictEqual(result, '- [/] Task with more text');
		});

		it('should cycle reverse', () => {
			const result = cycleLine('- [/] Task', 'reverse');
			assert.strictEqual(result, '- [ ] Task');
		});

		it('should return null for line without brackets', () => {
			const result = cycleLine('- Task without brackets', 'forward');
			assert.strictEqual(result, null);
		});

		it('should return null for line without list marker', () => {
			const result = cycleLine('[ ] Task without marker', 'forward');
			assert.strictEqual(result, null);
		});

		it('should return null for unknown state', () => {
			const result = cycleLine('- [?] Task', 'forward');
			assert.strictEqual(result, null);
		});

		it('should handle multiple spaces before list marker', () => {
			const result = cycleLine('    - [ ] Task', 'forward');
			assert.strictEqual(result, '    - [/] Task');
		});

		it('should handle multiple spaces after list marker', () => {
			const result = cycleLine('-   [ ] Task', 'forward');
			assert.strictEqual(result, '-   [/] Task');
		});
	});
});
