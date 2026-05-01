/**
 * Extracts the Second Level Domain (SLD) from a hostname.
 * Examples:
 * - www.netflix.com -> netflix
 * - sub.amazon.com.mx -> amazon
 * - github.com -> github
 * 
 * @param {string} hostname 
 * @returns {string}
 */
export function getSLD(hostname) {
  if (!hostname) return '';

  // Remove common subdomains like 'www'
  let parts = hostname.toLowerCase().split('.');
  if (parts[0] === 'www') {
    parts.shift();
  }

  // Handle common multi-part TLDs (e.g., .com.mx, .org.uk, .co.jp)
  const multiPartTLDs = [
    'com.mx', 'org.mx', 'gob.mx', 'edu.mx',
    'com.ar', 'org.ar',
    'com.br', 'org.br',
    'co.uk', 'org.uk', 'me.uk',
    'com.au', 'org.au',
    'co.jp', 'ne.jp',
    'com.cn', 'edu.cn'
  ];

  const lastTwo = parts.slice(-2).join('.');
  const lastThree = parts.slice(-3).join('.');

  if (multiPartTLDs.includes(lastThree)) {
    // case like sub.amazon.com.mx -> parts are [sub, amazon, com, mx]
    // lastThree is amazon.com.mx (Wait, no, that's not right)
    // Actually if parts are [sub, amazon, com, mx], lastThree is 'amazon.com.mx'
    // This is tricky. Let's refine.
  }

  // Improved logic:
  // 1. Join everything back
  const host = parts.join('.');
  
  // 2. Check for multi-part TLDs at the end
  for (const tld of multiPartTLDs) {
    if (host.endsWith('.' + tld)) {
      const remaining = host.slice(0, -(tld.length + 1));
      const remainingParts = remaining.split('.');
      return remainingParts[remainingParts.length - 1];
    }
  }

  // 3. Fallback for single-part TLDs (e.g., .com, .org, .net)
  // Just take the part before the last dot
  if (parts.length >= 2) {
    return parts[parts.length - 2];
  }

  return parts[0] || '';
}
