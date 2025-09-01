---
name: Performance Issue
about: Report a performance problem with a hook
title: '[PERFORMANCE] '
labels: ['performance', 'bug']
assignees: ['santiagogubadev']

---

## Performance Issue
Describe the performance problem you're experiencing.

## Hook Affected
Which hook is causing performance issues?

## Performance Symptoms
- [ ] Slow renders
- [ ] Memory leaks
- [ ] Excessive re-renders
- [ ] High CPU usage
- [ ] Large bundle size
- [ ] Other: ________________

## Code Example
```tsx
// Code that demonstrates the performance issue
import { useHook } from 'iuseful-react-hooks'

function SlowComponent() {
  // Your code that's experiencing performance issues
}
```

## Expected Performance
What performance did you expect?

## Actual Performance
What performance are you experiencing?

## Measurements
If you have any performance measurements, please share them:
- Render time: ____ms
- Memory usage: ____MB
- Number of re-renders: ____
- Bundle size impact: ____KB

## Environment
- **React Version**: [e.g. 18.2.0]
- **Package Version**: [e.g. 0.1.0]
- **Browser**: [e.g. Chrome 91]
- **Device**: [e.g. MacBook Pro M1]

## Profiling Data
If you have React DevTools profiler data or Chrome performance traces, please attach them.

## Proposed Solution
If you have ideas on how to improve performance, please share them.
