import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import HomePage from './page';

describe('HomePage', () => {
  it('renders the home page without crashing', () => {
    render(<HomePage />);
    expect(screen.getByText(/Welcome to 3D Viewer/i)).toBeDefined();
  });

  it('displays the main heading', () => {
    render(<HomePage />);
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading.textContent).toContain('Welcome to 3D Viewer');
  });

  it('shows the technology stack section', () => {
    render(<HomePage />);
    expect(screen.getByText(/Technology Stack/i)).toBeDefined();
  });

  it('displays scene cards when available', () => {
    render(<HomePage />);
    expect(screen.getByText(/Available Scenes/i)).toBeDefined();
  });
});
