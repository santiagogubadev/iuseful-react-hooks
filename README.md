# Useful React Hooks

A collection of useful React hooks written in TypeScript that help you build better React applications.

## 🚀 Installation

```bash
npm install useful-react-hooks
```

```bash
yarn add useful-react-hooks
```

```bash
pnpm add useful-react-hooks
```

## 📖 Usage

```typescript
import { useBoolean, useArray, useAsync } from 'useful-react-hooks'

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

Below is a complete list of all available hooks. Click on any hook name to see detailed documentation and examples.

### State Management Hooks
- [**useBoolean**](docs/useBoolean.md) - Manage boolean state with toggle and set functions
- [**useArray**](docs/useArray.md) - Manage array state with helpful methods
- [**useStateWithHistory**](docs/useStateWithHistory.md) - State management with undo/redo functionality
- [**useStateWithValidation**](docs/useStateWithValidation.md) - State with built-in validation
- [**usePrevious**](docs/usePrevious.md) - Access the previous value of a state or prop

### Async & Effects Hooks  
- [**useAsync**](docs/useAsync.md) - Handle async operations with loading, error, and data states
- [**useEffectAfterMount**](docs/useEffectAfterMount.md) - Run effects only after the initial mount
- [**useDebouncedEffect**](docs/useDebouncedEffect.md) - Debounced version of useEffect
- [**useDebouncedValue**](docs/useDebouncedValue.md) - Debounce any value with customizable delay

### DOM & Browser Hooks
- [**useEventListener**](docs/useEventListener.md) - Add event listeners to DOM elements safely
- [**useClickOutside**](docs/useClickOutside.md) - Detect clicks outside of a specific element
- [**useWindowSize**](docs/useWindowSize.md) - Track window dimensions with resize handling
- [**useSize**](docs/useSize.md) - Get dimensions of any DOM element
- [**useMediaQuery**](docs/useMediaQuery.md) - Listen to CSS media query changes
- [**useNearScreen**](docs/useNearScreen.md) - Detect when elements are near the viewport

### Storage & Persistence Hooks
- [**useStorage**](docs/useStorage.md) - Sync state with localStorage or sessionStorage
- [**useCookies**](docs/useCookies.md) - Manage browser cookies with ease
- [**useDarkMode**](docs/useDarkMode.md) - Toggle and persist dark/light mode preference

### Network & Communication Hooks
- [**useIsOnline**](docs/useIsOnline.md) - Monitor the online/offline status
- [**useBroadcastChannelSender**](docs/useBroadcastChannelSender.md) - Send messages via BroadcastChannel API
- [**useBroadcastChannelListeners**](docs/useBroadcastChannelListeners.md) - Listen to BroadcastChannel messages
- [**useSingletonBroadcastChannel**](docs/useSingletonBroadcastChannel.md) - Singleton pattern for BroadcastChannel

### Utility & Helper Hooks
- [**useGeolocation**](docs/useGeolocation.md) - Access user's geolocation with permission handling
- [**useCopyToClipboard**](docs/useCopyToClipboard.md) - Copy text to clipboard with success feedback
- [**useScript**](docs/useScript.md) - Dynamically load external scripts
- [**useLongPress**](docs/useLongPress.md) - Detect long press gestures on elements
- [**useTimeout**](docs/useTimeout.md) - Manage timeouts with cleanup
- [**useIsFirstRender**](docs/useIsFirstRender.md) - Detect if component is on its first render

## 📚 Documentation

Each hook has its own detailed documentation page with:
- **API Reference** - Complete TypeScript definitions
- **Usage Examples** - Practical code examples
- **Parameters** - Detailed parameter descriptions
- **Return Values** - What the hook returns
- **Common Patterns** - Best practices and common use cases

## 🔧 TypeScript Support

This library is built with TypeScript and provides full type definitions. All hooks are properly typed and will provide excellent IntelliSense support in your IDE.

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-hook`)
3. Add tests for your hook
4. Commit your changes (`git commit -am 'Add amazing hook'`)
5. Push to the branch (`git push origin feature/amazing-hook`)
6. Create a Pull Request

## 📄 License

MIT © [Santiago Gutiérrez Barreneche](https://github.com/Santyzz0311)

## 🔗 Links

- [GitHub Repository](https://github.com/Santyzz0311/react-hooks)
- [NPM Package](https://www.npmjs.com/package/useful-react-hooks)
- [Issues & Bug Reports](https://github.com/Santyzz0311/react-hooks/issues)
