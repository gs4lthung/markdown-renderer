# Search Test Document

This is a test document to verify the search functionality works correctly in the markdown viewer.

## Basic Search Testing

You can search for common words like "test", "search", or "function" to see the highlighting in action.

### Code Blocks

Search should not highlight text inside code blocks like this:

```javascript
function test() {
  console.log("search this text");
  return "results";
}
```

### Lists

Regular text in lists should be searchable:

- First item with **bold text**
- Second item with *italic text*  
- Third item with `inline code`

## Advanced Features

The search functionality includes:

1. **Case insensitive** - Searching for "Test" matches "test" and "Test"
2. **Multiple matches** - Navigate with Next/Previous buttons
3. **Keyboard shortcuts** - Use Ctrl+F to open search, Enter to navigate
4. **Highlighting** - Current match is highlighted in yellow

### Special Characters

You can search for special characters like @, #, $, etc.

### Links and Images

Search works in regular text but excludes [link URLs](https://example.com) and image sources.

## Testing Different Content Types

This section contains various content types to test search exclusions:

> Blockquote content should be searchable - this is inside a blockquote

| Tables | Are | Searchable |
|--------|-----|------------|
| Yes    | they | are        |

But table headers and cells should work properly.

### Task Lists

- [x] Completed task with searchable text
- [ ] Incomplete task with different content

## Performance Testing

The search should remain fast even with long documents. Here's some repeated content:

**test test test test test**

*search search search search*

`function function function function`

## Conclusion

Try searching for:
- "search" - appears multiple times
- "test" - appears in various contexts  
- "function" - appears in code and text
- "content" - appears in headings and paragraphs

The search should highlight all matches and allow you to navigate between them using the Next/Previous buttons or keyboard shortcuts.