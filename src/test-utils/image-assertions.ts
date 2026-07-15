import { expect } from 'vitest';
import '@testing-library/jest-dom';

/**
 * Asserts every <img> inside `container` is lazy-loaded and has explicit
 * width/height attributes (prevents CLS). Used by User Story 1 image tests.
 */
export function expectImagesLazyAndSized(container: HTMLElement): void {
  const images = container.querySelectorAll('img');
  expect(images.length, 'expected at least one <img> in the container').toBeGreaterThan(0);
  images.forEach((img) => {
    expect(img, `img ${img.getAttribute('src') ?? ''} should be lazy-loaded`).toHaveAttribute(
      'loading',
      'lazy',
    );
    expect(
      img,
      `img ${img.getAttribute('src') ?? ''} should declare explicit width`,
    ).toHaveAttribute('width');
    expect(
      img,
      `img ${img.getAttribute('src') ?? ''} should declare explicit height`,
    ).toHaveAttribute('height');
  });
}
