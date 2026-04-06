/**
 * Task state cycle for bullet journal tasks
 * [ ] → [/] → [!] → [x] → [ ]
 */
const CYCLE = [' ', '/', '!', 'x'] as const;

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
