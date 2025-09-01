---
name: Feature Request
about: Suggest an idea for a new hook or improvement
title: '[FEATURE] '
labels: ['enhancement']
assignees: ['Santyzz0311']

---

## Feature Description
A clear and concise description of the feature you'd like to see.

## Use Case
Describe the problem this feature would solve or the use case it would address.

**Example scenario:**
"As a developer using React, I want to... so that I can..."

## Proposed Hook Name
What would you name this hook?
```
use[YourHookName]
```

## API Design
How do you envision this hook being used?

```tsx
// Example usage
import { useYourHook } from 'iuseful-react-hooks'

function MyComponent() {
  const { value, setValue, reset } = useYourHook(initialValue)
  
  return (
    // JSX here
  )
}
```

## Similar Hooks
Are there any similar hooks in other libraries? How would this be different?

## Implementation Ideas
If you have ideas on how this could be implemented, share them here.

```tsx
// Rough implementation idea (optional)
function useYourHook(initialValue) {
  // Your implementation thoughts
}
```

## Priority
How important is this feature to you?
- [ ] Nice to have
- [ ] Would be useful
- [ ] Really need this
- [ ] Blocking my project

## Additional Context
Add any other context, examples, or screenshots about the feature request here.

## Alternatives Considered
What alternatives have you considered? Why didn't they work for your use case?
