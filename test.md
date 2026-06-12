# Markdown Viewer — Feature Test

A complete test of all supported Markdown features.

## Inline Formatting

Normal text with **bold**, *italic*, ***bold italic***, ~~strikethrough~~, `inline code`, ==highlight==, and ^superscript^.

Auto-link: https://github.com

## Links & Images

[GitHub](https://github.com "Visit GitHub")

![Placeholder image](https://via.placeholder.com/400x200 "400×200 placeholder")

## Lists

### Unordered
- Item one
- Item two
  - Nested A
  - Nested B
    - Deeply nested
- Item three

### Ordered
1. First step
2. Second step
3. Third step

### Task list
- [x] Write the parser
- [x] Add syntax highlighting
- [ ] Ship to the store

## Blockquote

> "The best code is code you don't have to write."
>
> — Someone wise

## Tables

| Language   | Paradigm      | Typed  | Stars |
|:---------- |:------------- | ------:| -----:|
| TypeScript | Multi-paradigm | Static | ⭐⭐⭐⭐⭐ |
| Python     | Multi-paradigm | Dynamic | ⭐⭐⭐⭐⭐ |
| Rust       | Systems        | Static | ⭐⭐⭐⭐  |
| Go         | Concurrent     | Static | ⭐⭐⭐⭐  |

## Horizontal Rule

---

## Code Blocks

### JavaScript
```javascript
async function fetchData(url) {
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Fetch failed:', error.message);
    return null;
  }
}

const result = await fetchData('https://api.example.com/data');
console.log(result);
```

### Python
```python
from dataclasses import dataclass
from typing import Optional

@dataclass
class User:
    name: str
    age: int
    email: Optional[str] = None

def greet(user: User) -> str:
    return f"Hello, {user.name}! You are {user.age} years old."

users = [User("Alice", 30, "alice@example.com"), User("Bob", 25)]
for u in users:
    print(greet(u))
```

### TypeScript
```typescript
interface Config {
  apiUrl: string;
  timeout: number;
  retries?: number;
}

async function createClient(config: Config) {
  const { apiUrl, timeout, retries = 3 } = config;

  const get = async <T>(path: string): Promise<T> => {
    const res = await fetch(`${apiUrl}${path}`, { signal: AbortSignal.timeout(timeout) });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json() as T;
  };

  return { get };
}
```

### SQL
```sql
SELECT
  u.name,
  COUNT(o.id)   AS order_count,
  SUM(o.amount) AS total_spent
FROM users u
LEFT JOIN orders o ON o.user_id = u.id
WHERE u.created_at >= '2024-01-01'
GROUP BY u.id, u.name
HAVING total_spent > 1000
ORDER BY total_spent DESC
LIMIT 20;
```

### JSON
```json
{
  "name": "markdown-viewer",
  "version": "1.0.0",
  "description": "Browser extension for rendering Markdown",
  "keywords": ["markdown", "browser", "extension"],
  "engines": { "node": ">=18" },
  "license": "MIT"
}
```

### Bash
```bash
#!/usr/bin/env bash
set -euo pipefail

TARGET_DIR="${1:-./dist}"

if [ ! -d "$TARGET_DIR" ]; then
  mkdir -p "$TARGET_DIR"
  echo "Created $TARGET_DIR"
fi

for file in *.md; do
  echo "Processing $file..."
  cp "$file" "$TARGET_DIR/"
done

echo "Done! Files copied to $TARGET_DIR"
```

## Setext Headers

This is H1
==========

This is H2
----------

## Nested Blockquotes

> First level
>
> > Second level
> >
> > Still second level

---

*End of test file.*
