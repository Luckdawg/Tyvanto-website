/**
 * SchemaHead Component
 * Injects JSON-LD structured data into the document head for SEO
 */

interface SchemaHeadProps {
  schema: Record<string, any>;
}

export function SchemaHead({ schema }: SchemaHeadProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
