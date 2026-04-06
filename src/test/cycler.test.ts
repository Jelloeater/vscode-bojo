import * as assert from 'assert';
import { getNextState, getPrevState, cycleLine, getStateName, getStateFromName } from '../cycler';

describe('Cycler Tests', () => {
	describe('getNextState', () => {
		it('should cycle space to forward slash', () => {
			assert.strictEqual(getNextState(' '), '/');
		});

		it('should cycle forward slash to x', () => {
			assert.strictEqual(getNextState('/'), 'x');
		});

		it('should cycle x to greater than', () => {
			assert.strictEqual(getNextState('x'), '>');
		});

		it('should cycle greater than to less than', () => {
			assert.strictEqual(getNextState('>'), '<');
		});

		it('should cycle less than to minus', () => {
			assert.strictEqual(getNextState('<'), '-');
		});

		it('should cycle minus to star', () => {
			assert.strictEqual(getNextState('-'), '*');
		});

		it('should cycle star to question', () => {
			assert.strictEqual(getNextState('*'), '?');
		});

		it('should cycle question to exclamation', () => {
			assert.strictEqual(getNextState('?'), '!');
		});

		it('should cycle exclamation back to space', () => {
			assert.strictEqual(getNextState('!'), ' ');
		});

		it('should return null for unknown state', () => {
			assert.strictEqual(getNextState('z'), null);
		});
	});

	describe('getPrevState', () => {
		it('should cycle space back to exclamation', () => {
			assert.strictEqual(getPrevState(' '), '!');
		});

		it('should cycle forward slash back to space', () => {
			assert.strictEqual(getPrevState('/'), ' ');
		});

		it('should cycle x back to forward slash', () => {
			assert.strictEqual(getPrevState('x'), '/');
		});

		it('should cycle greater than back to x', () => {
			assert.strictEqual(getPrevState('>'), 'x');
		});

		it('should cycle less than back to greater than', () => {
			assert.strictEqual(getPrevState('<'), '>');
		});

		it('should cycle minus back to less than', () => {
			assert.strictEqual(getPrevState('-'), '<');
		});

		it('should cycle star back to minus', () => {
			assert.strictEqual(getPrevState('*'), '-');
		});

		it('should cycle question back to star', () => {
			assert.strictEqual(getPrevState('?'), '*');
		});

		it('should cycle exclamation back to question', () => {
			assert.strictEqual(getPrevState('!'), '?');
		});

		it('should return null for unknown state', () => {
			assert.strictEqual(getPrevState('z'), null);
		});
	});

	describe('getStateName', () => {
		it('should return to-do for space', () => {
			assert.strictEqual(getStateName(' '), 'to-do');
		});

		it('should return incomplete for forward slash', () => {
			assert.strictEqual(getStateName('/'), 'incomplete');
		});

		it('should return done for x', () => {
			assert.strictEqual(getStateName('x'), 'done');
		});

		it('should return rescheduled for greater than', () => {
			assert.strictEqual(getStateName('>'), 'rescheduled');
		});

		it('should return scheduled for less than', () => {
			assert.strictEqual(getStateName('<'), 'scheduled');
		});

		it('should return canceled for minus', () => {
			assert.strictEqual(getStateName('-'), 'canceled');
		});

		it('should return star for asterisk', () => {
			assert.strictEqual(getStateName('*'), 'star');
		});

		it('should return question for question mark', () => {
			assert.strictEqual(getStateName('?'), 'question');
		});

		it('should return important for exclamation', () => {
			assert.strictEqual(getStateName('!'), 'important');
		});

		it('should return null for unknown char', () => {
			assert.strictEqual(getStateName('z'), null);
		});
	});

	describe('getStateFromName', () => {
		it('should return space for todo', () => {
			assert.strictEqual(getStateFromName('todo'), ' ');
		});

		it('should return space for unchecked', () => {
			assert.strictEqual(getStateFromName('unchecked'), ' ');
		});

		it('should return forward slash for incomplete', () => {
			assert.strictEqual(getStateFromName('incomplete'), '/');
		});

		it('should return forward slash for in-progress', () => {
			assert.strictEqual(getStateFromName('in-progress'), '/');
		});

		it('should return x for done', () => {
			assert.strictEqual(getStateFromName('done'), 'x');
		});

		it('should return x for checked', () => {
			assert.strictEqual(getStateFromName('checked'), 'x');
		});

		it('should return greater than for rescheduled', () => {
			assert.strictEqual(getStateFromName('rescheduled'), '>');
		});

		it('should return greater than for forwarded', () => {
			assert.strictEqual(getStateFromName('forwarded'), '>');
		});

		it('should return less than for scheduled', () => {
			assert.strictEqual(getStateFromName('scheduled'), '<');
		});

		it('should return less than for scheduling', () => {
			assert.strictEqual(getStateFromName('scheduling'), '<');
		});

		it('should return minus for canceled', () => {
			assert.strictEqual(getStateFromName('canceled'), '-');
		});

		it('should return minus for cancelled', () => {
			assert.strictEqual(getStateFromName('cancelled'), '-');
		});

		it('should return asterisk for star', () => {
			assert.strictEqual(getStateFromName('star'), '*');
		});

		it('should return asterisk for starred', () => {
			assert.strictEqual(getStateFromName('starred'), '*');
		});

		it('should return question mark for question', () => {
			assert.strictEqual(getStateFromName('question'), '?');
		});

		it('should return question mark for inquiry', () => {
			assert.strictEqual(getStateFromName('inquiry'), '?');
		});

		it('should return exclamation for important', () => {
			assert.strictEqual(getStateFromName('important'), '!');
		});

		it('should return exclamation for urgent', () => {
			assert.strictEqual(getStateFromName('urgent'), '!');
		});

		it('should return null for unknown name', () => {
			assert.strictEqual(getStateFromName('unknown'), null);
		});
	});

	describe('cycleLine', () => {
		it('should cycle hyphen list forward space to forward slash', () => {
			const result = cycleLine('- [ ] Task', 'forward');
			assert.strictEqual(result, '- [/] Task');
		});

		it('should cycle hyphen list forward slash to x', () => {
			const result = cycleLine('- [/] Task', 'forward');
			assert.strictEqual(result, '- [x] Task');
		});

		it('should cycle hyphen list x to greater than', () => {
			const result = cycleLine('- [x] Task', 'forward');
			assert.strictEqual(result, '- [>] Task');
		});

		it('should cycle asterisk list forward', () => {
			const result = cycleLine('* [>] Task', 'forward');
			assert.strictEqual(result, '* [<] Task');
		});

		it('should cycle plus list forward', () => {
			const result = cycleLine('+ [<] Task', 'forward');
			assert.strictEqual(result, '+ [-] Task');
		});

		it('should cycle indented list forward', () => {
			const result = cycleLine('  - [-] Task', 'forward');
			assert.strictEqual(result, '  - [*] Task');
		});

		it('should cycle line with extra content', () => {
			const result = cycleLine('- [*] Task with more text', 'forward');
			assert.strictEqual(result, '- [?] Task with more text');
		});

		it('should cycle question to exclamation', () => {
			const result = cycleLine('- [?] Task', 'forward');
			assert.strictEqual(result, '- [!] Task');
		});

		it('should cycle exclamation back to space', () => {
			const result = cycleLine('- [!] Task', 'forward');
			assert.strictEqual(result, '- [ ] Task');
		});

		it('should cycle reverse', () => {
			const result = cycleLine('- [/] Task', 'reverse');
			assert.strictEqual(result, '- [ ] Task');
		});

		it('should cycle reverse through all states', () => {
			const result = cycleLine('- [ ] Task', 'reverse');
			assert.strictEqual(result, '- [!] Task');
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
			const result = cycleLine('- [z] Task', 'forward');
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

		it('should handle all states correctly forward', () => {
			// Full cycle forward
			assert.strictEqual(cycleLine('- [ ]', 'forward'), '- [/]');
			assert.strictEqual(cycleLine('- [/]', 'forward'), '- [x]');
			assert.strictEqual(cycleLine('- [x]', 'forward'), '- [>]');
			assert.strictEqual(cycleLine('- [>]', 'forward'), '- [<]');
			assert.strictEqual(cycleLine('- [<]', 'forward'), '- [-]');
			assert.strictEqual(cycleLine('- [-]', 'forward'), '- [*]');
			assert.strictEqual(cycleLine('- [*]', 'forward'), '- [?]');
			assert.strictEqual(cycleLine('- [?]', 'forward'), '- [!]');
			assert.strictEqual(cycleLine('- [!]', 'forward'), '- [ ]');
		});

		it('should handle all states correctly reverse', () => {
			// Full cycle reverse
			assert.strictEqual(cycleLine('- [ ]', 'reverse'), '- [!]');
			assert.strictEqual(cycleLine('- [!]', 'reverse'), '- [?]');
			assert.strictEqual(cycleLine('- [?]', 'reverse'), '- [*]');
			assert.strictEqual(cycleLine('- [*]', 'reverse'), '- [-]');
			assert.strictEqual(cycleLine('- [-]', 'reverse'), '- [<]');
			assert.strictEqual(cycleLine('- [<]', 'reverse'), '- [>]');
			assert.strictEqual(cycleLine('- [>]', 'reverse'), '- [x]');
			assert.strictEqual(cycleLine('- [x]', 'reverse'), '- [/]');
			assert.strictEqual(cycleLine('- [/]', 'reverse'), '- [ ]');
		});
	});
});