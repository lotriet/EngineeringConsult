import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Accessibility Tests', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test.describe('WCAG Compliance', () => {

    test('should not have any accessibility violations', async ({ page }) => {
      const accessibilityScanResults = await new AxeBuilder({ page }).analyze();

      expect(accessibilityScanResults.violations).toEqual([]);
    });

    test('should pass WCAG Level AA standards', async ({ page }) => {
      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
        .analyze();

      expect(accessibilityScanResults.violations).toEqual([]);

      // Log any incomplete tests for manual verification
      if (accessibilityScanResults.incomplete.length > 0) {
        console.log('Incomplete accessibility tests (require manual verification):',
          accessibilityScanResults.incomplete.map(item => item.id));
      }
    });

    test('should have no color contrast issues', async ({ page }) => {
      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(['color-contrast'])
        .analyze();

      expect(accessibilityScanResults.violations).toEqual([]);
    });

    test('should have proper heading hierarchy', async ({ page }) => {
      // Check that headings are in proper order
      const headings = await page.locator('h1, h2, h3, h4, h5, h6').all();

      // Should have exactly one h1
      const h1Elements = await page.locator('h1').count();
      expect(h1Elements).toBe(1);

      // Get all heading levels
      const headingLevels = await Promise.all(
        headings.map(async (heading) => {
          const tagName = await heading.evaluate(el => el.tagName);
          return parseInt(tagName.charAt(1));
        })
      );

      // Check that headings don't skip levels
      for (let i = 1; i < headingLevels.length; i++) {
        const currentLevel = headingLevels[i];
        const previousLevel = headingLevels[i - 1];

        // Current level should not be more than 1 level deeper than previous
        expect(currentLevel - previousLevel).toBeLessThanOrEqual(1);
      }
    });
  });

  test.describe('Keyboard Navigation', () => {

    test('should be fully navigable with keyboard', async ({ page }) => {
      // Start from the beginning
      await page.keyboard.press('Tab');

      // Should be able to reach and activate the main CTA
      let focusedElement = await page.locator(':focus');
      let elementText = await focusedElement.textContent();

      // Keep tabbing until we find the main CTA
      let attempts = 0;
      while (!elementText?.includes('Get Started Today') && attempts < 20) {
        await page.keyboard.press('Tab');
        focusedElement = await page.locator(':focus');
        elementText = await focusedElement.textContent();
        attempts++;
      }

      expect(elementText).toContain('Get Started Today');

      // Should be able to activate with Enter
      await page.keyboard.press('Enter');
      await expect(page.locator('text=Free AI Consultation')).toBeVisible();

      // Should be able to navigate to form fields
      await page.keyboard.press('Tab');
      focusedElement = await page.locator(':focus');
      const focusedTag = await focusedElement.evaluate(el => el.tagName);
      expect(focusedTag).toBe('INPUT');
    });

    test('should have proper focus indicators', async ({ page }) => {
      // Tab to first focusable element
      await page.keyboard.press('Tab');

      const focusedElement = await page.locator(':focus');

      // Check that focused element has visible focus indicator
      const focusStyle = await focusedElement.evaluate(el => {
        const style = window.getComputedStyle(el);
        return {
          outline: style.outline,
          outlineWidth: style.outlineWidth,
          outlineStyle: style.outlineStyle,
          outlineColor: style.outlineColor,
          boxShadow: style.boxShadow
        };
      });

      // Should have some form of focus indicator (outline or box-shadow)
      const hasFocusIndicator = focusStyle.outline !== 'none' ||
                               focusStyle.outlineWidth !== '0px' ||
                               focusStyle.boxShadow !== 'none';

      expect(hasFocusIndicator).toBe(true);
    });

    test('should handle form navigation with keyboard', async ({ page }) => {
      // Open form first
      await page.click('text=Get Started Today');

      // Navigate to name field
      await page.keyboard.press('Tab');
      let focusedElement = await page.locator(':focus');
      let elementId = await focusedElement.getAttribute('id');

      // Find the name field
      let attempts = 0;
      while (elementId !== 'name' && attempts < 10) {
        await page.keyboard.press('Tab');
        focusedElement = await page.locator(':focus');
        elementId = await focusedElement.getAttribute('id');
        attempts++;
      }

      // Should be able to type in name field
      expect(elementId).toBe('name');
      await page.keyboard.type('John Doe');

      // Tab to email field
      await page.keyboard.press('Tab');
      focusedElement = await page.locator(':focus');
      elementId = await focusedElement.getAttribute('id');
      expect(elementId).toBe('email');

      // Type email
      await page.keyboard.type('john@example.com');

      // Tab to submit button
      await page.keyboard.press('Tab');
      focusedElement = await page.locator(':focus');
      const buttonText = await focusedElement.textContent();
      expect(buttonText).toContain('Get Free Consultation');

      // Should be able to submit with Enter
      await page.keyboard.press('Enter');
      await expect(page.locator('text=Thank you!')).toBeVisible({ timeout: 5000 });
    });

    test('should trap focus in modal/form when active', async ({ page }) => {
      // Open the form
      await page.click('text=Get Started Today');

      // Get all focusable elements in the form
      const formContainer = page.locator('text=Free AI Consultation').locator('..');
      const focusableElements = await formContainer.locator('input, button, textarea, select, a[href], [tabindex]:not([tabindex="-1"])').all();

      expect(focusableElements.length).toBeGreaterThan(0);

      // Tab through all elements and ensure we stay within the form area
      for (let i = 0; i < focusableElements.length + 2; i++) {
        await page.keyboard.press('Tab');
        const focusedElement = await page.locator(':focus');

        // Check that focused element is within the form container or is a form element
        const isWithinForm = await formContainer.locator(':focus').count() > 0 ||
                            await focusedElement.getAttribute('id') === 'name' ||
                            await focusedElement.getAttribute('id') === 'email' ||
                            await focusedElement.getAttribute('type') === 'submit';

        expect(isWithinForm).toBe(true);
      }
    });
  });

  test.describe('Screen Reader Support', () => {

    test('should have proper ARIA labels and descriptions', async ({ page }) => {
      // Check main heading has proper role
      const mainHeading = page.locator('h1');
      await expect(mainHeading).toBeVisible();

      // Check form has proper labels
      await page.click('text=Get Started Today');

      const nameField = page.locator('input[id="name"]');
      const emailField = page.locator('input[id="email"]');

      // Check that form fields have associated labels
      const nameLabel = await nameField.getAttribute('aria-label') ||
                       await page.locator('label[for="name"]').textContent();
      const emailLabel = await emailField.getAttribute('aria-label') ||
                        await page.locator('label[for="email"]').textContent();

      expect(nameLabel).toBeTruthy();
      expect(emailLabel).toBeTruthy();
    });

    test('should have proper form validation announcements', async ({ page }) => {
      await page.click('text=Get Started Today');

      // Submit form with invalid data
      await page.fill('input[id="email"]', 'invalid-email');
      await page.click('text=Get Free Consultation');

      // Check that error message is associated with field
      const errorMessage = page.locator('text=Invalid email address');
      await expect(errorMessage).toBeVisible();

      // Check that error has proper ARIA attributes
      const emailField = page.locator('input[id="email"]');
      const ariaDescribedBy = await emailField.getAttribute('aria-describedby');
      const ariaInvalid = await emailField.getAttribute('aria-invalid');

      expect(ariaInvalid).toBe('true');
      // Should have some form of description for screen readers
      expect(ariaDescribedBy || await errorMessage.getAttribute('id')).toBeTruthy();
    });

    test('should have proper button descriptions', async ({ page }) => {
      // Check main CTAs have accessible names
      const primaryButton = page.locator('text=Get Started Today');
      const secondaryButton = page.locator('text=Learn More');

      const primaryText = await primaryButton.textContent();
      const secondaryText = await secondaryButton.textContent();

      expect(primaryText?.trim()).toBeTruthy();
      expect(secondaryText?.trim()).toBeTruthy();

      // Check that buttons are actually buttons or have button role
      const primaryRole = await primaryButton.getAttribute('role') ||
                         await primaryButton.evaluate(el => el.tagName);
      const secondaryRole = await secondaryButton.getAttribute('role') ||
                           await secondaryButton.evaluate(el => el.tagName);

      expect(['BUTTON', 'A', 'button'].some(tag =>
        primaryRole?.toUpperCase().includes(tag))).toBe(true);
      expect(['BUTTON', 'A', 'button'].some(tag =>
        secondaryRole?.toUpperCase().includes(tag))).toBe(true);
    });

    test('should announce dynamic content changes', async ({ page }) => {
      // Open form and submit successfully
      await page.click('text=Get Started Today');
      await page.fill('input[id="email"]', 'test@example.com');
      await page.click('text=Get Free Consultation');

      // Check that success message has proper ARIA live region
      const successMessage = page.locator('text=Thank you!').locator('..');

      // Success content should be announced
      const ariaLive = await successMessage.getAttribute('aria-live') ||
                      await successMessage.evaluate(el =>
                        getComputedStyle(el).getPropertyValue('--aria-live'));

      // If not explicitly set, check that it's in a context that would be announced
      const isInAnnounceableContext = ariaLive === 'polite' ||
                                     ariaLive === 'assertive' ||
                                     await successMessage.getAttribute('role') === 'status';

      expect(isInAnnounceableContext).toBe(true);
    });
  });

  test.describe('Mobile Accessibility', () => {

    test('should be accessible on touch devices', async ({ page, browser }) => {
      // Create mobile context
      const mobileContext = await browser.newContext({
        viewport: { width: 375, height: 667 },
        deviceScaleFactor: 2,
        isMobile: true,
        hasTouch: true
      });

      const mobilePage = await mobileContext.newPage();
      await mobilePage.goto('/');

      // Run accessibility scan on mobile
      const mobileAccessibilityResults = await new AxeBuilder({ page: mobilePage }).analyze();
      expect(mobileAccessibilityResults.violations).toEqual([]);

      // Check that touch targets are large enough
      const buttons = await mobilePage.locator('button, a, input[type="submit"], input[type="button"]').all();

      for (const button of buttons) {
        const boundingBox = await button.boundingBox();
        if (boundingBox) {
          // Touch targets should be at least 44x44 pixels
          expect(boundingBox.width).toBeGreaterThanOrEqual(44);
          expect(boundingBox.height).toBeGreaterThanOrEqual(44);
        }
      }

      await mobileContext.close();
    });

    test('should have proper zoom support', async ({ page }) => {
      // Test zooming to 200%
      await page.setViewportSize({ width: 640, height: 480 });

      // Simulate zoom by making viewport smaller (equivalent to 200% zoom)
      await page.setViewportSize({ width: 320, height: 240 });

      // Content should still be accessible
      await expect(page.locator('h1')).toBeVisible();

      // Should be able to interact with elements
      await page.click('text=Get Started Today');
      await expect(page.locator('text=Free AI Consultation')).toBeVisible();

      // Form should still be usable
      await page.fill('input[id="email"]', 'zoom@test.com');
      await page.click('text=Get Free Consultation');
      await expect(page.locator('text=Thank you!')).toBeVisible({ timeout: 5000 });
    });
  });

  test.describe('Visual Accessibility', () => {

    test('should work with high contrast mode', async ({ page }) => {
      // Simulate high contrast mode
      await page.emulateMedia({ colorScheme: 'dark', reducedMotion: 'reduce' });

      // Page should still be readable
      await expect(page.locator('h1')).toBeVisible();

      // Interactive elements should still be identifiable
      await page.click('text=Get Started Today');
      await expect(page.locator('text=Free AI Consultation')).toBeVisible();

      // Form should still be usable
      const emailField = page.locator('input[id="email"]');
      await expect(emailField).toBeVisible();

      // Check that form elements have sufficient contrast
      const emailFieldStyles = await emailField.evaluate(el => {
        const style = window.getComputedStyle(el);
        return {
          backgroundColor: style.backgroundColor,
          color: style.color,
          borderColor: style.borderColor
        };
      });

      // Fields should have some visual distinction
      expect(emailFieldStyles.backgroundColor).not.toBe('transparent');
      expect(emailFieldStyles.color).not.toBe(emailFieldStyles.backgroundColor);
    });

    test('should respect reduced motion preferences', async ({ page }) => {
      // Set reduced motion preference
      await page.emulateMedia({ reducedMotion: 'reduce' });

      await page.goto('/');

      // Any animations should be reduced or disabled
      const animatedElements = await page.locator('[class*="animate"], [class*="transition"]').all();

      for (const element of animatedElements) {
        const computedStyle = await element.evaluate(el => {
          const style = window.getComputedStyle(el);
          return {
            animationDuration: style.animationDuration,
            transitionDuration: style.transitionDuration
          };
        });

        // Animations should be significantly reduced or eliminated
        expect(
          computedStyle.animationDuration === '0s' ||
          computedStyle.animationDuration === 'none' ||
          computedStyle.transitionDuration === '0s'
        ).toBe(true);
      }
    });

    test('should be usable without images', async ({ page }) => {
      // Disable images
      await page.route('**/*.{png,jpg,jpeg,gif,svg,webp}', route => route.abort());

      await page.goto('/');

      // Page should still be functional
      await expect(page.locator('h1')).toBeVisible();
      await expect(page.locator('text=Transform your business')).toBeVisible();

      // Interactive elements should still work
      await page.click('text=Get Started Today');
      await expect(page.locator('text=Free AI Consultation')).toBeVisible();

      // Form should still be fully functional
      await page.fill('input[id="email"]', 'noimage@test.com');
      await page.click('text=Get Free Consultation');
      await expect(page.locator('text=Thank you!')).toBeVisible({ timeout: 5000 });
    });
  });
});