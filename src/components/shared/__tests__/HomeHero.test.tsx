import { render, screen, act, fireEvent } from '@testing-library/react';
import "@testing-library/jest-dom";
import { MemoryRouter } from 'react-router-dom';
import { describe, test, vi, beforeEach, afterEach, expect } from 'vitest';
import { HomeHero } from '../HomeHero';

function renderHero() {
  return render(
    <MemoryRouter>
      <HomeHero />
    </MemoryRouter>
  );
}

function stubMatchMedia(matches: boolean) {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    configurable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
}

beforeEach(() => {
  stubMatchMedia(false);
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

describe('HomeHero carousel', () => {
  test('renders first slide with heading, description and CTA link', () => {
    renderHero();
    expect(screen.getByRole('heading', { name: /students serving casablanca/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /about the club/i })).toHaveAttribute('href', '/about');
    expect(screen.getByRole('region')).toHaveAttribute('aria-roledescription', 'carousel');
  });

  test('next button advances and wraps around', () => {
    renderHero();
    const next = screen.getByRole('button', { name: /next slide/i });
    fireEvent.click(next);
    expect(screen.getByRole('heading', { name: /health, youth and solidarity/i })).toBeInTheDocument();
    fireEvent.click(next);
    expect(screen.getByRole('heading', { name: /your turn to serve/i })).toBeInTheDocument();
    fireEvent.click(next);
    expect(screen.getByRole('heading', { name: /students serving casablanca/i })).toBeInTheDocument();
  });

  test('prev button wraps from first to last slide', () => {
    renderHero();
    fireEvent.click(screen.getByRole('button', { name: /previous slide/i }));
    expect(screen.getByRole('heading', { name: /your turn to serve/i })).toBeInTheDocument();
  });

  test('dots navigate directly to slides', () => {
    renderHero();
    fireEvent.click(screen.getByRole('button', { name: /go to slide 3/i }));
    expect(screen.getByRole('link', { name: /contact us/i })).toHaveAttribute('href', '/contact');
  });

  test('autoplay advances slides on a timer', () => {
    renderHero();
    expect(screen.getByRole('heading', { name: /students serving casablanca/i })).toBeInTheDocument();
    act(() => {
      vi.advanceTimersByTime(7000);
    });
    expect(screen.getByRole('heading', { name: /health, youth and solidarity/i })).toBeInTheDocument();
  });

  test('hover pauses autoplay until leave', () => {
    renderHero();
    const region = screen.getByRole('region');
    fireEvent.mouseEnter(region);
    act(() => {
      vi.advanceTimersByTime(21000);
    });
    expect(screen.getByRole('heading', { name: /students serving casablanca/i })).toBeInTheDocument();
    fireEvent.mouseLeave(region);
    act(() => {
      vi.advanceTimersByTime(7000);
    });
    expect(screen.getByRole('heading', { name: /health, youth and solidarity/i })).toBeInTheDocument();
  });

  test('reduced motion disables autoplay', () => {
    stubMatchMedia(true);
    renderHero();
    act(() => {
      vi.advanceTimersByTime(21000);
    });
    expect(screen.getByRole('heading', { name: /students serving casablanca/i })).toBeInTheDocument();
  });

  test('inactive slides are hidden from assistive tech', () => {
    renderHero();
    const visibleGroups = screen.getAllByRole('group', { hidden: false });
    expect(visibleGroups.length).toBeGreaterThan(0);
    const hiddenSlides = document.querySelectorAll('[aria-roledescription="slide"][aria-hidden="true"]');
    expect(hiddenSlides.length).toBe(2);
    expect(screen.getAllByRole('heading', { hidden: false }).length).toBe(1);
  });

  test('each slide CTA links to its target', () => {
    renderHero();
    fireEvent.click(screen.getByRole('button', { name: /go to slide 2/i }));
    expect(screen.getByRole('link', { name: /see our actions/i })).toHaveAttribute('href', '/events');
    fireEvent.click(screen.getByRole('button', { name: /go to slide 3/i }));
    expect(screen.getByRole('link', { name: /contact us/i })).toHaveAttribute('href', '/contact');
  });

  test('pause toggle stops and resumes autoplay', () => {
    renderHero();
    fireEvent.click(screen.getByRole('button', { name: /pause autoplay/i }));
    act(() => {
      vi.advanceTimersByTime(21000);
    });
    expect(screen.getByRole('heading', { name: /students serving casablanca/i })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /play autoplay/i }));
    act(() => {
      vi.advanceTimersByTime(7000);
    });
    expect(screen.getByRole('heading', { name: /health, youth and solidarity/i })).toBeInTheDocument();
  });
});
