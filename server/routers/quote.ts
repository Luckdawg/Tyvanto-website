/**
 * quote.ts — tRPC router for "Request a Quote" form submissions
 * Stores leads in quote_leads table and notifies the owner.
 */
import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { quoteLeads } from "../../drizzle/schema";
import { notifyOwner } from "../_core/notification";
import { eq, desc } from "drizzle-orm";

const submitQuoteSchema = z.object({
  firstName: z.string().min(1, "First name is required").max(100),
  lastName: z.string().min(1, "Last name is required").max(100),
  email: z.string().email("Valid email is required"),
  company: z.string().min(1, "Company is required").max(255),
  jobTitle: z.string().max(255).optional(),
  phone: z.string().max(50).optional(),
  productInterest: z.enum(["arqen", "truclaw", "truinsight", "eli", "bundle", "other"]),
  useCase: z.string().max(2000).optional(),
  estimatedNodes: z.number().int().min(0).max(10_000_000).optional(),
  estimatedAgents: z.number().int().min(0).max(10_000).optional(),
  estimatedMonthlyBudget: z.string().max(50).optional(),
});

export const quoteRouter = router({
  /**
   * Submit a new quote request from the /shop page.
   * Public — no auth required (prospects haven't signed up yet).
   */
  submit: publicProcedure
    .input(submitQuoteSchema)
    .mutation(async ({ input }) => {
      const database = await getDb();
      if (!database) throw new Error("Database not available");

      await database
        .insert(quoteLeads)
        .values({
          firstName: input.firstName,
          lastName: input.lastName,
          email: input.email,
          company: input.company,
          jobTitle: input.jobTitle ?? null,
          phone: input.phone ?? null,
          productInterest: input.productInterest,
          useCase: input.useCase ?? null,
          estimatedNodes: input.estimatedNodes ?? null,
          estimatedAgents: input.estimatedAgents ?? null,
          estimatedMonthlyBudget: input.estimatedMonthlyBudget ?? null,
          status: "new",
        });

      // Notify the owner of the new quote lead
      const productLabels: Record<string, string> = {
        arqen: "Arqen Core Platform",
        truclaw: "TruClaw Agentic AI Governance",
        truinsight: "Tru-InSight Video Intelligence",
        eli: "ELI Unified Surveillance Intelligence",
        bundle: "Bundle Package",
        other: "Other / General Inquiry",
      };

      await notifyOwner({
        title: `🎯 New Quote Request — ${input.company}`,
        content: `
**Contact:** ${input.firstName} ${input.lastName} (${input.jobTitle ?? "N/A"})
**Email:** ${input.email}
**Phone:** ${input.phone ?? "N/A"}
**Company:** ${input.company}
**Product Interest:** ${productLabels[input.productInterest] ?? input.productInterest}
**Estimated Monthly Budget:** ${input.estimatedMonthlyBudget ?? "Not specified"}
**Estimated Nodes:** ${input.estimatedNodes?.toLocaleString() ?? "N/A"}
**Estimated Agents:** ${input.estimatedAgents?.toLocaleString() ?? "N/A"}
**Use Case:** ${input.useCase ?? "Not provided"}
        `.trim(),
      });

      return { success: true, message: "Quote request received. Our team will be in touch within 1 business day." };
    }),

  /**
   * Admin: list all quote leads with pagination.
   */
  list: protectedProcedure
    .input(z.object({
      limit: z.number().int().min(1).max(100).default(50),
      offset: z.number().int().min(0).default(0),
    }))
    .query(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin" && ctx.user.role !== "super_admin") {
        throw new Error("Forbidden");
      }
      const database = await getDb();
      if (!database) throw new Error("Database not available");

      const rows = await database
        .select()
        .from(quoteLeads)
        .orderBy(desc(quoteLeads.createdAt))
        .limit(input.limit)
        .offset(input.offset);
      return rows;
    }),

  /**
   * Admin: update the status of a quote lead.
   */
  updateStatus: protectedProcedure
    .input(z.object({
      id: z.number().int(),
      status: z.enum(["new", "contacted", "qualified", "closed"]),
      notes: z.string().max(2000).optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin" && ctx.user.role !== "super_admin") {
        throw new Error("Forbidden");
      }
      const database = await getDb();
      if (!database) throw new Error("Database not available");

      await database
        .update(quoteLeads)
        .set({
          status: input.status,
          ...(input.notes !== undefined ? { notes: input.notes } : {}),
        })
        .where(eq(quoteLeads.id, input.id));
      return { success: true };
    }),
});
