export const PLAN_LIMITS = {
	FREE: {
		prs: 10,
		prsCreated: 5,
		issues: 20,
		chat: 50,
		repositories: 5,
		reviewsPerRepo: 5,
	},
	PRO: {
		prs: 150,
		prsCreated: 50,
		issues: 200,
		chat: 1000,
		repositories: null as number | null,
		reviewsPerRepo: null as number | null,
	},
} as const;

export type PlanType = keyof typeof PLAN_LIMITS;
