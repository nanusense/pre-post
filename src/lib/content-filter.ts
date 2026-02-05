// Common offensive words - this list can be expanded
const BLOCKED_WORDS = [
  'fuck', 'shit', 'ass', 'bitch', 'bastard', 'damn', 'cunt', 'dick', 'cock',
  'pussy', 'whore', 'slut', 'fag', 'faggot', 'nigger', 'nigga', 'retard',
  'kill yourself', 'kys', 'die', 'hate you', 'go to hell',
]

// Create regex patterns that match whole words and common evasions
function createPattern(word: string): RegExp {
  // Replace letters with patterns that catch common substitutions
  const escaped = word
    .replace(/a/gi, '[a@4]')
    .replace(/e/gi, '[e3]')
    .replace(/i/gi, '[i1!]')
    .replace(/o/gi, '[o0]')
    .replace(/s/gi, '[s$5]')
    .replace(/t/gi, '[t7]')
    .replace(/l/gi, '[l1]')

  return new RegExp(escaped, 'gi')
}

const PATTERNS = BLOCKED_WORDS.map(createPattern)

export function containsBlockedContent(text: string): { blocked: boolean; reason?: string } {
  const lowerText = text.toLowerCase()

  for (let i = 0; i < PATTERNS.length; i++) {
    if (PATTERNS[i].test(lowerText)) {
      return {
        blocked: true,
        reason: 'Your message contains language that is not allowed. Please revise and try again.',
      }
    }
  }

  return { blocked: false }
}

export function getBlockedWords(): string[] {
  return BLOCKED_WORDS
}
