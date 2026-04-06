/**
 * Task state cycle for bullet journal tasks
 * 
 * Cycle order (forward): 
 * [ ] → [/] → [x] → [>] → [<] → [-] → [*] → [?] → [!] → [ ]
 * 
 * States:
 * - space: to-do / unchecked
 * - /: incomplete / in progress  
 * - x: done / checked
 * - >: rescheduled / forwarded
 * - <: scheduled / scheduling
 * - -: canceled / cancelled
 * - *: star / important
 * - ?: question / inquiry
 * - !: important / urgent
 */
const CYCLE = [' ', '/', 'x', '>', '<', '-', '*', '?', '!'] as const;

/**
 * Get the next state in the forward cycle
 * @param current The current state character
 * @returns The next state character, or null if unknown
 */
export function getNextState(current: string): string | null {
	const index = CYCLE.indexOf(current as any);
	if (index === -1) {
		return null; // Unknown state, leave untouched
	}
	return CYCLE[(index + 1) % CYCLE.length];
}

/**
 * Get the previous state in the reverse cycle
 * @param current The current state character
 * @returns The previous state character, or null if unknown
 */
export function getPrevState(current: string): string | null {
	const index = CYCLE.indexOf(current as any);
	if (index === -1) {
		return null; // Unknown state, leave untouched
	}
	return CYCLE[(index - 1 + CYCLE.length) % CYCLE.length];
}

/**
 * Get the state character from state name
 * @param name The state name (case-insensitive)
 * @returns The state character or null if not found
 */
export function getStateFromName(name: string): string | null {
	const stateMap: Record<string, string> = {
		'todo': ' ',
		'unchecked': ' ',
		'to-do': ' ',
		'incomplete': '/',
		'in-progress': '/',
		'done': 'x',
		'checked': 'x',
		'rescheduled': '>',
		'forwarded': '>',
		'scheduled': '<',
		'scheduling': '<',
		'canceled': '-',
		'cancelled': '-',
		'star': '*',
		'starred': '*',
		'question': '?',
		'inquiry': '?',
		'important': '!',
		'urgent': '!',
	};
	const lower = name.toLowerCase().trim();
	return stateMap[lower] ?? null;
}

/**
 * Get the state name from character
 * @param char The state character
 * @returns The state name or null if not found
 */
export function getStateName(char: string): string | null {
	const nameMap: Record<string, string> = {
		' ': 'to-do',
		'/': 'incomplete',
		'x': 'done',
		'>': 'rescheduled',
		'<': 'scheduled',
		'-': 'canceled',
		'*': 'star',
		'?': 'question',
		'!': 'important',
	};
	return nameMap[char] ?? null;
}

/**
 * Cycle a line containing a bullet journal task
 * Matches lines with list markers (-, *, +) and bracket notation
 * @param line The line text to cycle
 * @param direction 'forward' or 'reverse'
 * @returns The modified line, or null if no match or unknown state
 */
export function cycleLine(line: string, direction: 'forward' | 'reverse'): string | null {
	// Matches lines starting with whitespace, a list marker (-, *, +), and brackets
	// Groups: (1) prefix including bracket, (2) state char, (3) suffix including closing bracket
	const match = line.match(/^(\s*(?:-|\*|\+)\s*\[)(.)(\].*)$/);

	if (!match) {
		return null; // No match, leave line untouched
	}

	const prefix = match[1];
	const stateChar = match[2];
	const suffix = match[3];

	const nextChar = direction === 'forward' 
		? getNextState(stateChar)
		: getPrevState(stateChar);

	if (nextChar === null) {
		return null; // Unknown state, leave line untouched
	}

	return prefix + nextChar + suffix;
}