import { test, expect, devices } from '@playwright/test';

test.describe('Responsive Design Tests', () => {

  test.describe('Desktop Layouts', () => {

    test('should display correctly on large desktop (1920x1080)', async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      await page.goto('/');

      // Check that content doesn't stretch too wide
      const mainContainer = page.locator('main');
      const containerWidth = await mainContainer.evaluate(el => el.offsetWidth);
      expect(containerWidth).toBeLessThan(1400); // Should have max-width constraint

      // Hero section should be properly laid out
      await expect(page.locator('h1')).toBeVisible();
      await expect(page.locator('text=Transform your business')).toBeVisible();

      // Buttons should be side by side
      const buttons = page.locator('text=Get Started Today, text=Learn More');
      const buttonsContainer = await buttons.first().locator('..').boundingBox();
      expect(buttonsContainer?.height).toBeLessThan(80); // Should be in one row

      // Form should be reasonably sized
      await page.click('text=Get Started Today');
      const formContainer = page.locator('text=Free AI Consultation').locator('..');
      const formWidth = await formContainer.evaluate(el => el.offsetWidth);
      expect(formWidth).toBeLessThan(600); // Shouldn't be too wide

      // Footer should be in multiple columns
      const footerColumns = page.locator('footer .grid > div');
      const columnCount = await footerColumns.count();
      expect(columnCount).toBeGreaterThan(1);
    });

    test('should display correctly on standard desktop (1366x768)', async ({ page }) => {
      await page.setViewportSize({ width: 1366, height: 768 });
      await page.goto('/');

      // All key content should be visible above the fold
      await expect(page.locator('h1')).toBeVisible();
      await expect(page.locator('text=Get Started Today')).toBeVisible();

      // Content should be well-proportioned
      const heroSection = page.locator('section').first();
      const heroHeight = await heroSection.evaluate(el => el.offsetHeight);
      expect(heroHeight).toBeLessThan(768); // Should fit in viewport

      // Navigation and layout should be optimal
      await page.click('text=Get Started Today');
      await expect(page.locator('text=Free AI Consultation')).toBeVisible();

      // Form should fit comfortably
      const emailField = page.locator('input[id="email"]');
      await expect(emailField).toBeInViewport();
    });

    test('should work correctly on smaller desktop (1024x768)', async ({ page }) => {
      await page.setViewportSize({ width: 1024, height: 768 });
      await page.goto('/');

      // Layout should adapt gracefully
      await expect(page.locator('h1')).toBeVisible();

      // Text should be readable
      const heading = page.locator('h1');
      const headingSize = await heading.evaluate(el => {
        const style = window.getComputedStyle(el);
        return parseInt(style.fontSize);
      });
      expect(headingSize).toBeGreaterThan(30); // Should still be large enough

      // Form interaction should work well
      await page.click('text=Get Started Today');
      const formContainer = page.locator('text=Free AI Consultation').locator('..');
      await expect(formContainer).toBeInViewport();

      await page.fill('input[id="email"]', 'desktop@test.com');
      await page.click('text=Get Free Consultation');
      await expect(page.locator('text=Thank you!')).toBeVisible({ timeout: 5000 });
    });
  });

  test.describe('Tablet Layouts', () => {

    test('should display correctly on iPad (768x1024)', async ({ page, browser }) => {
      const tabletContext = await browser.newContext({
        ...devices['iPad']
      });
      const tabletPage = await tabletContext.newPage();
      await tabletPage.goto('/');

      // Content should be well-organized
      await expect(tabletPage.locator('h1')).toBeVisible();

      // Check that buttons might stack on smaller screens
      const buttonContainer = tabletPage.locator('text=Get Started Today').locator('..');
      const containerLayout = await buttonContainer.evaluate(el => {
        const style = window.getComputedStyle(el);
        return {
          flexDirection: style.flexDirection,
          display: style.display
        };
      });

      // Should be using responsive layout
      expect(containerLayout.display).toBe('flex');

      // Form should be appropriately sized
      await tabletPage.tap('text=Get Started Today');
      const form = tabletPage.locator('text=Free AI Consultation').locator('..');
      const formWidth = await form.evaluate(el => el.offsetWidth);
      expect(formWidth).toBeLessThan(500); // Appropriate for tablet

      // Touch interactions should work
      await tabletPage.fill('input[id="email"]', 'tablet@test.com');
      await tabletPage.tap('text=Get Free Consultation');
      await expect(tabletPage.locator('text=Thank you!')).toBeVisible({ timeout: 5000 });

      await tabletContext.close();
    });

    test('should work on iPad Pro (1024x1366)', async ({ page, browser }) => {
      const tabletContext = await browser.newContext({
        ...devices['iPad Pro']
      });
      const tabletPage = await tabletContext.newPage();
      await tabletPage.goto('/');

      // Should use desktop-like layout due to larger screen
      await expect(tabletPage.locator('h1')).toBeVisible();

      // Footer should still be multi-column
      const footerColumns = tabletPage.locator('footer .grid > div');
      const columnCount = await footerColumns.count();
      expect(columnCount).toBeGreaterThan(1);

      // Form should be well-proportioned
      await tabletPage.tap('text=Get Started Today');
      const formContainer = tabletPage.locator('text=Free AI Consultation').locator('..');
      await expect(formContainer).toBeInViewport();

      await tabletContext.close();
    });
  });

  test.describe('Mobile Layouts', () => {

    test('should display correctly on iPhone 12 (390x844)', async ({ page, browser }) => {
      const mobileContext = await browser.newContext({
        ...devices['iPhone 12']
      });
      const mobilePage = await mobileContext.newPage();
      await mobilePage.goto('/');

      // Content should be stacked vertically
      await expect(mobilePage.locator('h1')).toBeVisible();

      // Heading should be appropriately sized
      const heading = mobilePage.locator('h1');
      const headingBounds = await heading.boundingBox();
      expect(headingBounds?.width).toBeLessThan(380); // Should fit in mobile width

      // Buttons should stack vertically on mobile
      const buttonContainer = mobilePage.locator('text=Get Started Today').locator('..');
      const containerStyle = await buttonContainer.evaluate(el => {
        const style = window.getComputedStyle(el);
        return {
          flexDirection: style.flexDirection,
          gap: style.gap
        };
      });

      expect(containerStyle.flexDirection).toBe('column');

      // Form should be mobile-optimized
      await mobilePage.tap('text=Get Started Today');
      const form = mobilePage.locator('text=Free AI Consultation').locator('..');
      const formBounds = await form.boundingBox();
      expect(formBounds?.width).toBeLessThan(380); // Should fit mobile screen

      // Input fields should be touch-friendly
      const emailField = mobilePage.locator('input[id="email"]');
      const emailBounds = await emailField.boundingBox();
      expect(emailBounds?.height).toBeGreaterThan(44); // Minimum touch target

      // Form submission should work on mobile
      await mobilePage.fill('input[id="email"]', 'mobile@test.com');
      await mobilePage.tap('text=Get Free Consultation');
      await expect(mobilePage.locator('text=Thank you!')).toBeVisible({ timeout: 5000 });

      await mobileContext.close();
    });

    test('should work on smaller mobile devices (iPhone SE - 375x667)', async ({ page, browser }) => {
      const mobileContext = await browser.newContext({
        ...devices['iPhone SE']
      });
      const mobilePage = await mobileContext.newPage();
      await mobilePage.goto('/');

      // All content should fit and be accessible
      await expect(mobilePage.locator('h1')).toBeVisible();

      // Text should be readable
      const paragraph = mobilePage.locator('text=Transform your business').first();
      const textSize = await paragraph.evaluate(el => {
        const style = window.getComputedStyle(el);
        return parseInt(style.fontSize);
      });
      expect(textSize).toBeGreaterThan(14); // Should be readable

      // Form should work in limited space
      await mobilePage.tap('text=Get Started Today');
      await expect(mobilePage.locator('text=Free AI Consultation')).toBeVisible();

      // Should be able to complete form
      await mobilePage.fill('input[id="email"]', 'small@test.com');
      await mobilePage.tap('text=Get Free Consultation');
      await expect(mobilePage.locator('text=Thank you!')).toBeVisible({ timeout: 5000 });

      await mobileContext.close();
    });

    test('should work on Android devices (Pixel 5)', async ({ page, browser }) => {
      const mobileContext = await browser.newContext({
        ...devices['Pixel 5']
      });
      const mobilePage = await mobileContext.newPage();
      await mobilePage.goto('/');

      // Layout should be mobile-optimized
      await expect(mobilePage.locator('h1')).toBeVisible();

      // Check that text wraps properly
      const valueProposition = mobilePage.locator('text=Transform your business');
      const textBounds = await valueProposition.boundingBox();
      expect(textBounds?.width).toBeLessThan(400);

      // Footer should stack on mobile
      const footerContent = mobilePage.locator('footer .grid');
      const footerStyle = await footerContent.evaluate(el => {
        const style = window.getComputedStyle(el);
        return {
          gridTemplateColumns: style.gridTemplateColumns,
          flexDirection: style.flexDirection
        };
      });

      // Should be single column or vertical layout
      expect(
        footerStyle.gridTemplateColumns === '1fr' ||
        footerStyle.flexDirection === 'column'
      ).toBe(true);

      await mobileContext.close();
    });
  });

  test.describe('Responsive Breakpoints', () => {

    test('should transition smoothly between breakpoints', async ({ page }) => {
      const breakpoints = [
        { width: 1920, height: 1080, name: 'Large Desktop' },
        { width: 1366, height: 768, name: 'Desktop' },
        { width: 1024, height: 768, name: 'Small Desktop/Large Tablet' },
        { width: 768, height: 1024, name: 'Tablet' },
        { width: 390, height: 844, name: 'Mobile' },
        { width: 375, height: 667, name: 'Small Mobile' }
      ];

      for (const breakpoint of breakpoints) {
        await page.setViewportSize({ width: breakpoint.width, height: breakpoint.height });
        await page.goto('/');

        console.log(`Testing ${breakpoint.name} (${breakpoint.width}x${breakpoint.height})`);

        // Core content should always be visible
        await expect(page.locator('h1')).toBeVisible();
        await expect(page.locator('text=Get Started Today')).toBeVisible();

        // Form should work at all sizes
        await page.click('text=Get Started Today');
        await expect(page.locator('text=Free AI Consultation')).toBeVisible();

        const emailField = page.locator('input[id="email"]');
        await expect(emailField).toBeVisible();
        await expect(emailField).toBeInViewport();

        // Test form interaction
        await page.fill('input[id="email"]', `test-${breakpoint.width}@example.com`);
        await page.click('text=Get Free Consultation');
        await expect(page.locator('text=Thank you!')).toBeVisible({ timeout: 5000 });

        // Reset for next iteration
        await page.click('text=Submit another email');
        await expect(page.locator('text=Free AI Consultation')).toBeVisible();
      }
    });

    test('should handle edge cases around breakpoints', async ({ page }) => {
      const edgeCases = [
        { width: 769, height: 800, name: 'Just above tablet breakpoint' },
        { width: 767, height: 800, name: 'Just below tablet breakpoint' },
        { width: 1025, height: 800, name: 'Just above mobile breakpoint' },
        { width: 1023, height: 800, name: 'Just below desktop breakpoint' }
      ];

      for (const edgeCase of edgeCases) {
        await page.setViewportSize({ width: edgeCase.width, height: edgeCase.height });
        await page.goto('/');

        console.log(`Testing edge case: ${edgeCase.name} (${edgeCase.width}x${edgeCase.height})`);

        // Layout should not break at edge cases
        await expect(page.locator('h1')).toBeVisible();

        // No horizontal scrolling should be needed
        const bodyScrollWidth = await page.evaluate(() => document.body.scrollWidth);
        expect(bodyScrollWidth).toBeLessThanOrEqual(edgeCase.width + 1); // Allow 1px tolerance

        // Interactive elements should remain accessible
        await page.click('text=Get Started Today');
        await expect(page.locator('text=Free AI Consultation')).toBeVisible();

        const formContainer = page.locator('text=Free AI Consultation').locator('..');
        await expect(formContainer).toBeInViewport();
      }
    });
  });

  test.describe('Orientation Changes', () => {

    test('should handle portrait to landscape rotation on tablets', async ({ page, browser }) => {
      // Start in portrait
      const context = await browser.newContext({
        viewport: { width: 768, height: 1024 }
      });
      const tabletPage = await context.newPage();
      await tabletPage.goto('/');

      // Verify portrait layout
      await expect(tabletPage.locator('h1')).toBeVisible();

      // Rotate to landscape
      await tabletPage.setViewportSize({ width: 1024, height: 768 });

      // Layout should adapt
      await expect(tabletPage.locator('h1')).toBeVisible();

      // Form should still work after rotation
      await tabletPage.tap('text=Get Started Today');
      await expect(tabletPage.locator('text=Free AI Consultation')).toBeVisible();

      await context.close();
    });

    test('should handle orientation changes on mobile', async ({ page, browser }) => {
      // Start in portrait (mobile)
      const context = await browser.newContext({
        viewport: { width: 375, height: 667 },
        isMobile: true
      });
      const mobilePage = await context.newPage();
      await mobilePage.goto('/');

      await expect(mobilePage.locator('h1')).toBeVisible();

      // Rotate to landscape
      await mobilePage.setViewportSize({ width: 667, height: 375 });

      // Content should still be accessible
      await expect(mobilePage.locator('h1')).toBeVisible();

      // Form should adapt to landscape
      await mobilePage.tap('text=Get Started Today');
      await expect(mobilePage.locator('text=Free AI Consultation')).toBeVisible();

      const form = mobilePage.locator('text=Free AI Consultation').locator('..');
      await expect(form).toBeInViewport();

      await context.close();
    });
  });

  test.describe('Content Readability', () => {

    test('should maintain appropriate font sizes across devices', async ({ page }) => {
      const devices = [
        { width: 1920, height: 1080, minFontSize: 16 },
        { width: 768, height: 1024, minFontSize: 16 },
        { width: 375, height: 667, minFontSize: 14 }
      ];

      for (const device of devices) {
        await page.setViewportSize({ width: device.width, height: device.height });
        await page.goto('/');

        // Check paragraph text size
        const paragraph = page.locator('p').first();
        const fontSize = await paragraph.evaluate(el => {
          const style = window.getComputedStyle(el);
          return parseInt(style.fontSize);
        });

        expect(fontSize).toBeGreaterThanOrEqual(device.minFontSize);

        // Check heading sizes are proportionally larger
        const heading = page.locator('h1');
        const headingSize = await heading.evaluate(el => {
          const style = window.getComputedStyle(el);
          return parseInt(style.fontSize);
        });

        expect(headingSize).toBeGreaterThan(fontSize * 1.5);
      }
    });

    test('should maintain appropriate line spacing', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/');

      const paragraph = page.locator('text=Transform your business').first();
      const lineHeight = await paragraph.evaluate(el => {
        const style = window.getComputedStyle(el);
        const fontSize = parseInt(style.fontSize);
        const lineHeight = parseFloat(style.lineHeight);
        return lineHeight / fontSize;
      });

      // Line height should be at least 1.4 for good readability
      expect(lineHeight).toBeGreaterThan(1.4);
    });
  });

  test.describe('Images and Media', () => {

    test('should handle images responsively', async ({ page }) => {
      const viewports = [
        { width: 1920, height: 1080 },
        { width: 768, height: 1024 },
        { width: 375, height: 667 }
      ];

      for (const viewport of viewports) {
        await page.setViewportSize(viewport);
        await page.goto('/');

        // Check for any images
        const images = await page.locator('img').all();

        for (const img of images) {
          const imgBounds = await img.boundingBox();
          if (imgBounds) {
            // Image should not overflow container
            expect(imgBounds.width).toBeLessThanOrEqual(viewport.width);

            // Image should be visible
            await expect(img).toBeVisible();
          }
        }
      }
    });
  });

  test.describe('Performance on Different Screen Sizes', () => {

    test('should maintain good performance on mobile', async ({ page, browser }) => {
      const mobileContext = await browser.newContext({
        ...devices['iPhone 12']
      });
      const mobilePage = await mobileContext.newPage();

      const startTime = Date.now();
      await mobilePage.goto('/', { waitUntil: 'networkidle' });
      const loadTime = Date.now() - startTime;

      // Mobile load time should be reasonable (allowing for slower networks)
      expect(loadTime).toBeLessThan(5000);

      // Interactions should be responsive
      const interactionStart = Date.now();
      await mobilePage.tap('text=Get Started Today');
      await mobilePage.waitForSelector('text=Free AI Consultation');
      const interactionTime = Date.now() - interactionStart;

      expect(interactionTime).toBeLessThan(200);

      await mobileContext.close();
    });
  });
});