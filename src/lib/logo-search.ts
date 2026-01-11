/**
 * Gets a company logo using Logo.dev Image CDN
 * @param companyName - The name of the company to get a logo for
 * @returns The URL of the logo from Logo.dev, or null if token is not configured
 */
export async function searchCompanyLogo(companyName: string): Promise<string | null> {
  try {
    const token = process.env.LOGO_DEV_PUBLISHABLE_KEY;

    // If API token is not configured, return null
    if (!token) {
      console.warn("Logo.dev API token not configured. Skipping logo search.");
      return null;
    }

    // Convert company name to a domain format
    // Remove common suffixes, special characters, convert to lowercase
    let domain = companyName
      .toLowerCase()
      .trim()
      .replace(/\s+(inc|llc|corp|corporation|ltd|limited|co|company)\.?$/i, '') // Remove trailing suffixes
      .replace(/^(inc|llc|corp|corporation|ltd|limited|co|company)\s+/i, '') // Remove leading suffixes
      .replace(/\s+/g, '') // Remove all spaces
      .replace(/[^a-z0-9.-]/g, ''); // Remove special characters except dots and hyphens

    if (!domain) {
      return null;
    }

    // If it already looks like a domain (contains a dot), use it as-is
    // Otherwise, append .com
    const domainToUse = domain.includes('.') ? domain : `${domain}.com`;

    // Return the Logo.dev CDN URL
    // The CDN will return a logo if available, or handle it gracefully if not
    return `https://img.logo.dev/${encodeURIComponent(domainToUse)}?token=${token}`;
  } catch (error) {
    console.error("Error generating Logo.dev URL:", error);
    return null;
  }
}

