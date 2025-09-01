# Useful React Hooks

A collection of useful React hooks written in TypeScript that help you build better React applications.

## 🚀 Installation

```bash
npm install iuseful-react-hooks
```

```bash
yarn add iuseful-react-hooks
```

```bash
pnpm add iuseful-react-hooks
```

## 📖 Usage

```typescript
import { useBoolean, useArray, useAsync } from 'iuseful-react-hooks'

function MyComponent() {
  const { value, toggle, set } = useBoolean(false)
  const { items, push, remove, clear } = useArray([])
  
  return (
    <div>
      <p>Boolean value: {value.toString()}</p>
      <button onClick={toggle}>Toggle</button>
      <button onClick={() => set(true)}>Set True</button>
      
      <p>Array items: {items.length}</p>
      <button onClick={() => push('new item')}>Add Item</button>
    </div>
  )
}
```

## 🎯 Available Hooks

Below is a complete list of all available hooks in this library.

### State Management Hooks
- **useBoolean** - Manage boolean state with toggle and set functions
- **useArray** - Manage array state with helpful methods
- **useStateWithHistory** - State management with undo/redo functionality
- **useStateWithValidation** - State with built-in validation
- **usePrevious** - Access the previous value of a state or prop

### Async & Effects Hooks  
- **useAsync** - Handle async operations with loading, error, and data states
- **useEffectAfterMount** - Run effects only after the initial mount
- **useDebouncedEffect** - Debounced version of useEffect
- **useDebouncedValue** - Debounce any value with customizable delay

### DOM & Browser Hooks
- **useEventListener** - Add event listeners to DOM elements safely
- **useClickOutside** - Detect clicks outside of a specific element
- **useWindowSize** - Track window dimensions with resize handling
- **useSize** - Get dimensions of any DOM element
- **useMediaQuery** - Listen to CSS media query changes
- **useNearScreen** - Detect when elements are near the viewport

### Storage & Persistence Hooks
- **useStorage** - Sync state with localStorage or sessionStorage
- **useCookies** - Manage browser cookies with ease
- **useDarkMode** - Toggle and persist dark/light mode preference

### Network & Communication Hooks
- **useIsOnline** - Monitor the online/offline status
- **useBroadcastChannelSender** - Send messages via BroadcastChannel API
- **useBroadcastChannelListeners** - Listen to BroadcastChannel messages
- **useSingletonBroadcastChannel** - Singleton pattern for BroadcastChannel

### Utility & Helper Hooks
- **useGeolocation** - Access user's geolocation with permission handling
- **useCopyToClipboard** - Copy text to clipboard with success feedback
- **useScript** - Dynamically load external scripts
- **useLongPress** - Detect long press gestures on elements
- **useTimeout** - Manage timeouts with cleanup
- **useIsFirstRender** - Detect if component is on its first render

##  TypeScript Support

This library is built with TypeScript and provides full type definitions. All hooks are properly typed and will provide excellent IntelliSense support in your IDE.

## 🤝 Contributing

We welcome contributions! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-hook`)
3. Add tests for your hook
4. Commit your changes (`git commit -am 'Add amazing hook'`)
5. Push to the branch (`git push origin feature/amazing-hook`)
6. Create a Pull Request

## 📄 License

MIT © [Santiago Gutiérrez Barreneche](https://github.com/santiagogubadev)

## 🔗 Links

- [GitHub Repository](https://github.com/santiagogubadev/react-hooks)
- [NPM Package](https://www.npmjs.com/package/iuseful-react-hooks)
- [Issues & Bug Reports](https://github.com/santiagogubadev/react-hooks/issues)
