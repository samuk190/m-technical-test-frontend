import '@testing-library/jest-dom'
import './test-utils/mock-router'
global.setImmediate = global.setImmediate || ((fn: () => void) => setTimeout(fn, 0));
