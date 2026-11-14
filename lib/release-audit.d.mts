export type PortfolioLaunchApproval = {
  schemaVersion: number;
  approvedForPublicLaunch: boolean;
  ownerApprovedAt: string | null;
  approvedOrigin: string | null;
  reviewedCommit: string | null;
  checks: Record<string, boolean>;
};
export declare const LAUNCH_CHECKS: readonly string[];
export declare function assessLaunch(input: {
  profile: any;
  projects: any[];
  cases: any[];
  approval: PortfolioLaunchApproval;
  env?: NodeJS.ProcessEnv;
}): {
  ready: boolean;
  blockers: Array<{ id: string; message: string }>;
  summary: { origin: string | null; totalPublished: number; featured: number; caseStudies: number; checkedChecks: number; totalChecks: number };
};
export declare function hasLaunchApproval(approval: PortfolioLaunchApproval, env?: NodeJS.ProcessEnv): boolean;
