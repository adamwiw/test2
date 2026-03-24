/* eslint-env jest */
import React from 'react';
import { renderToString } from 'react-dom/server';
import Counter from '../components/Counter';

describe('Counter Component', () => {
  it('renders basic content', () => {
    const html = renderToString(<Counter />);
    expect(html).toContain('Counter');
  });
});