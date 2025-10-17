import { Router, Request, Response } from "express";
import axios from "axios";

const router = Router();

const SENTRY_ORG = process.env.SENTRY_ORG!;
const SENTRY_API_TOKEN = process.env.SENTRY_API_TOKEN!;
const BASE_URL = process.env.BASE_URL;

router.get("/sentry-dashboard", async (_req: Request, res: Response) => {
  try {
    if (!SENTRY_ORG || !SENTRY_API_TOKEN) {
      return res.status(500).json({ error: "Missing Sentry configuration" });
    }

    const issuesResp = await axios.get(
      `${BASE_URL}/organizations/${SENTRY_ORG}/issues/`,
      {
        headers: {
          Authorization: `Bearer ${SENTRY_API_TOKEN}`,
        },
        params: {
          limit: 20,
        },
      }
    );

    const issues = issuesResp.data;

    const issuesWithTags = await Promise.all(
      issues.map(async (issue: any) => {
        try {
          const tagsResp = await axios.get(
            `${BASE_URL}/organizations/${SENTRY_ORG}/issues/${issue.id}/tags/?limit=50`,
            {
              headers: {
                Authorization: `Bearer ${SENTRY_API_TOKEN}`,
              },
            }
          );

          return {
            ...issue,
            tags: tagsResp.data,
          };
        } catch (err: any) {
          console.error(
            `Failed to fetch tags for issue ${issue.id}:`,
            err.message
          );
          return {
            ...issue,
            tags: [],
          };
        }
      })
    );

    res.json({
      total: issuesWithTags.length,
      issues: issuesWithTags,
    });
  } catch (error: any) {
    console.error("Sentry API error:", error.message);
    res.status(500).json({ error: "Failed to fetch Sentry issues with tags" });
  }
});

export default router;
