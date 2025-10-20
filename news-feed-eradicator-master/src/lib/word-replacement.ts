import { CustomWordReplacement } from '../background/store/reducer';

export type Rule = { 
	pattern: string; 
	flags?: string; 
	replace: string;
	from?: string;
	to?: string;
};

// Built-in word replacement rules using proper regex patterns with boundaries
export const builtinWordReplacements: Rule[] = [
	{ pattern: '(^|[^A-Za-z])(A\\.?I\\.?)($|[^A-Za-z])', flags: 'g', replace: '$1cocaine$3' },
	{ pattern: '(^|[^A-Za-z])(artificial intelligence)($|[^A-Za-z])', flags: 'gi', replace: '$1cocaine$3' },
	{ pattern: '(^|[^A-Za-z])(machine learning)($|[^A-Za-z])', flags: 'gi', replace: '$1cocaine$3' },
	{ pattern: '(^|[^A-Za-z])(neural network)($|[^A-Za-z])', flags: 'gi', replace: '$1cocaine network$3' },
	{ pattern: '(^|[^A-Za-z])(LLM)($|[^A-Za-z])', flags: 'g', replace: '$1cocaine$3' },
	{ pattern: '(^|[^A-Za-z])(large language model)($|[^A-Za-z])', flags: 'gi', replace: '$1cocaine$3' },
];

/**
 * Convert custom word replacements to proper regex rules
 */
export function customToRules(customReplacements: CustomWordReplacement[]): Rule[] {
	return customReplacements.map(r => {
		const escapedFrom = r.from.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
		return {
			pattern: `(^|[^A-Za-z])(${escapedFrom})($|[^A-Za-z])`,
			flags: 'gi',
			replace: `$1${r.to}$3`,
			from: r.from,
			to: r.to,
		};
	});
}

/**
 * Compile rules into regex objects for performance
 */
export function compileRules(rules: Rule[]): Array<{ re: RegExp; replace: string }> {
	return rules.map(r => ({ 
		re: new RegExp(r.pattern, r.flags ?? 'g'), 
		replace: r.replace 
	}));
}

