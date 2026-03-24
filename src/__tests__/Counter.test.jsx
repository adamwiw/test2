import { test, expect } from 'bun:test';
import { render } from '@testing-library/react';
import Counter from '../components/Counter';

test('renders', () => {
  const { container } = render(<Counter />);
  expect(container.textContent).toContain('Counter');
});