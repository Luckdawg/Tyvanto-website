import { z } from 'zod';
import { publicProcedure, router } from '../_core/trpc';
import { notifyOwner } from '../_core/notification';

/**
 * Leads Router
 * Handles lead capture from various forms and resources
 */

const capabilitiesDeckLeadSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Valid email is required'),
  company: z.string().optional(),
});

export const leadsRouter = router({
  /**
   * Capture lead from Capabilities Deck
   */
  capabilitiesDeckLead: publicProcedure
    .input(capabilitiesDeckLeadSchema)
    .mutation(async ({ input }) => {
      try {
        // Log the lead capture
        console.log('[Leads] Capabilities Deck lead captured:', {
          name: input.name,
          email: input.email,
          company: input.company || 'Not provided',
          timestamp: new Date().toISOString(),
        });

        // Notify owner about new lead
        const leadSummary = `
**New Capabilities Deck Lead**

**Name:** ${input.name}
**Email:** ${input.email}
**Company:** ${input.company || 'Not provided'}
**Source:** Capabilities Deck PDF
**Time:** ${new Date().toLocaleString()}
        `.trim();

        await notifyOwner({
          title: 'New Capabilities Deck Lead',
          content: leadSummary,
        });

        return {
          success: true,
          message: 'Lead captured successfully',
          leadId: `lead_${Date.now()}`,
        };
      } catch (error) {
        console.error('[Leads] Error capturing lead:', error);
        return {
          success: false,
          message: 'Failed to capture lead',
        };
      }
    }),

  /**
   * Capture lead from generic contact form
   */
  contactFormLead: publicProcedure
    .input(
      z.object({
        name: z.string().min(1),
        email: z.string().email(),
        company: z.string().optional(),
        message: z.string().optional(),
        source: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        console.log('[Leads] Contact form lead captured:', {
          name: input.name,
          email: input.email,
          company: input.company || 'Not provided',
          source: input.source || 'Contact Form',
          timestamp: new Date().toISOString(),
        });

        const leadSummary = `
**New Contact Form Lead**

**Name:** ${input.name}
**Email:** ${input.email}
**Company:** ${input.company || 'Not provided'}
**Source:** ${input.source || 'Contact Form'}
**Message:** ${input.message || 'No message provided'}
**Time:** ${new Date().toLocaleString()}
        `.trim();

        await notifyOwner({
          title: 'New Contact Form Lead',
          content: leadSummary,
        });

        return {
          success: true,
          message: 'Lead captured successfully',
          leadId: `lead_${Date.now()}`,
        };
      } catch (error) {
        console.error('[Leads] Error capturing contact form lead:', error);
        return {
          success: false,
          message: 'Failed to capture lead',
        };
      }
    }),

  /**
   * Capture demo request lead
   */
  demoRequestLead: publicProcedure
    .input(
      z.object({
        name: z.string().min(1),
        email: z.string().email(),
        company: z.string().optional(),
        role: z.string().optional(),
        preferredDate: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        console.log('[Leads] Demo request lead captured:', {
          name: input.name,
          email: input.email,
          company: input.company || 'Not provided',
          role: input.role || 'Not specified',
          preferredDate: input.preferredDate || 'Not specified',
          timestamp: new Date().toISOString(),
        });

        const leadSummary = `
**New Demo Request**

**Name:** ${input.name}
**Email:** ${input.email}
**Company:** ${input.company || 'Not provided'}
**Role:** ${input.role || 'Not specified'}
**Preferred Date:** ${input.preferredDate || 'Not specified'}
**Time:** ${new Date().toLocaleString()}
        `.trim();

        await notifyOwner({
          title: 'New Demo Request',
          content: leadSummary,
        });

        return {
          success: true,
          message: 'Demo request submitted successfully',
          leadId: `demo_${Date.now()}`,
        };
      } catch (error) {
        console.error('[Leads] Error capturing demo request:', error);
        return {
          success: false,
          message: 'Failed to submit demo request',
        };
      }
    }),
});
