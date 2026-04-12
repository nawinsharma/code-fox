import { serve } from "inngest/next";
import { inngest } from "@/inngest/client";
import { indexRepo } from "@/inngest/functions";
import { generateReview } from "@/inngest/functions/review";
import { analyzeIssueJob } from "@/inngest/functions/issue-analysis";
import { autoPRJob } from "@/inngest/functions/auto-pr";

export const { GET, POST, PUT } = serve({
	client: inngest,
	functions: [indexRepo, generateReview, analyzeIssueJob, autoPRJob],
});
