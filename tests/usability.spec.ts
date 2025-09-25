import { test, expect } from '@playwright/test';

test.describe('Usability Tests', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test.describe('Email Signup Form', () => {

    test('should show email signup form when CTA button is clicked', async ({ page }) => {
      // Click the main CTA button
      await page.click('text=Get Started Today');

      // Verify email signup form is visible
      await expect(page.locator('text=Free AI Consultation')).toBeVisible();
      await expect(page.locator('input[id="email"]')).toBeVisible();
      await expect(page.locator('input[id="name"]')).toBeVisible();
    });

    test('should show email signup form when secondary CTA is clicked', async ({ page }) => {
      // Click the secondary email CTA
      await page.click('text=Enter your email for a free consultation');

      // Verify email signup form is visible
      await expect(page.locator('text=Free AI Consultation')).toBeVisible();
      await expect(page.locator('input[id="email"]')).toBeVisible();
    });

    test('should validate email field is required', async ({ page }) => {
      // Show the form first
      await page.click('text=Get Started Today');

      // Try to submit without email
      await page.click('text=Get Free Consultation');

      // Check for validation error
      await expect(page.locator('text=Email is required')).toBeVisible();
    });

    test('should validate email format', async ({ page }) => {
      // Show the form first
      await page.click('text=Get Started Today');

      // Enter invalid email
      await page.fill('input[id="email"]', 'invalid-email');
      await page.click('text=Get Free Consultation');

      // Check for validation error
      await expect(page.locator('text=Invalid email address')).toBeVisible();
    });

    test('should accept valid email and show success state', async ({ page }) => {
      // Show the form first
      await page.click('text=Get Started Today');

      // Fill in valid data
      await page.fill('input[id="name"]', 'John Doe');
      await page.fill('input[id="email"]', 'john.doe@example.com');

      // Submit the form
      await page.click('text=Get Free Consultation');

      // Wait for loading state to complete
      await expect(page.locator('text=Submitting...')).toBeVisible();

      // Check for success message
      await expect(page.locator('text=Thank you!')).toBeVisible({ timeout: 5000 });
      await expect(page.locator('text=We\'ll be in touch soon')).toBeVisible();
    });

    test('should allow submitting another email after success', async ({ page }) => {
      // Complete a successful submission first
      await page.click('text=Get Started Today');
      await page.fill('input[id="email"]', 'john.doe@example.com');
      await page.click('text=Get Free Consultation');

      // Wait for success state
      await expect(page.locator('text=Thank you!')).toBeVisible({ timeout: 5000 });

      // Click to submit another email
      await page.click('text=Submit another email');

      // Verify form is shown again
      await expect(page.locator('text=Free AI Consultation')).toBeVisible();
      await expect(page.locator('input[id="email"]')).toBeVisible();
    });
  });

  test.describe('Navigation and CTAs', () => {

    test('should have working Learn More button', async ({ page }) => {
      // Click Learn More button
      await page.click('text=Learn More');

      // Should scroll to services section
      await expect(page.locator('#services')).toBeInViewport();
    });

    test('should have accessible main heading', async ({ page }) => {
      // Check main heading is visible and properly structured
      const mainHeading = page.locator('h1');
      await expect(mainHeading).toBeVisible();
      await expect(mainHeading).toContainText('Expert AI Engineering Consulting');
    });

    test('should display trust indicators', async ({ page }) => {
      // Check trust indicators are visible
      await expect(page.locator('text=Trusted by innovative companies')).toBeVisible();
      await expect(page.locator('text=Startups')).toBeVisible();
      await expect(page.locator('text=Enterprise')).toBeVisible();
      await expect(page.locator('text=Scale-ups')).toBeVisible();
    });
  });

  test.describe('Content and Information Architecture', () => {

    test('should display key value proposition', async ({ page }) => {
      // Check that key messaging is visible
      await expect(page.locator('text=Transform your business with cutting-edge AI solutions')).toBeVisible();
      await expect(page.locator('text=years of proven expertise')).toBeVisible();
      await expect(page.locator('text=production-ready AI applications')).toBeVisible();
    });

    test('should have footer with contact information', async ({ page }) => {
      // Scroll to footer
      await page.locator('footer').scrollIntoViewIfNeeded();

      // Check footer content
      await expect(page.locator('text=AI Engineering Consulting').nth(1)).toBeVisible();
      await expect(page.locator('text=AI Strategy & Consulting')).toBeVisible();
      await expect(page.locator('text=Custom AI Development')).toBeVisible();
      await expect(page.locator('text=Ready to start your AI project?')).toBeVisible();
    });

    test('should have proper page title and meta', async ({ page }) => {
      // Check page title
      await expect(page).toHaveTitle('AI Engineering Consulting - Expert AI Solutions');
    });
  });

  test.describe('User Flow Tests', () => {

    test('should complete full signup flow smoothly', async ({ page }) => {
      // Start from homepage
      await expect(page.locator('h1')).toBeVisible();

      // Read value proposition
      await expect(page.locator('text=Transform your business')).toBeVisible();

      // Click CTA to show interest
      await page.click('text=Get Started Today');

      // Fill out form with realistic data
      await page.fill('input[id="name"]', 'Sarah Johnson');
      await page.fill('input[id="email"]', 'sarah.johnson@techcorp.com');

      // Submit form
      await page.click('text=Get Free Consultation');

      // Verify successful completion
      await expect(page.locator('text=Thank you!')).toBeVisible({ timeout: 5000 });
    });

    test('should handle form errors gracefully', async ({ page }) => {
      // Show form
      await page.click('text=Get Started Today');

      // Try various invalid inputs
      await page.fill('input[id="email"]', 'invalid');
      await page.click('text=Get Free Consultation');
      await expect(page.locator('text=Invalid email address')).toBeVisible();

      // Clear and try empty
      await page.fill('input[id="email"]', '');
      await page.click('text=Get Free Consultation');
      await expect(page.locator('text=Email is required')).toBeVisible();

      // Fix and submit successfully
      await page.fill('input[id="email"]', 'valid@example.com');
      await page.click('text=Get Free Consultation');
      await expect(page.locator('text=Thank you!')).toBeVisible({ timeout: 5000 });
    });
  });

  test.describe('Loading States and Interactions', () => {

    test('should show loading state during form submission', async ({ page }) => {
      // Show form and fill it
      await page.click('text=Get Started Today');
      await page.fill('input[id="email"]', 'test@example.com');

      // Submit and immediately check for loading state
      await page.click('text=Get Free Consultation');

      // Should show loading state
      await expect(page.locator('text=Submitting...')).toBeVisible();

      // Button should be disabled during loading
      const submitButton = page.locator('button[type="submit"]');
      await expect(submitButton).toBeDisabled();
    });

    test('should maintain form state during errors', async ({ page }) => {
      // Show form
      await page.click('text=Get Started Today');

      // Fill name and invalid email
      await page.fill('input[id="name"]', 'Test User');
      await page.fill('input[id="email"]', 'invalid-email');

      // Submit to trigger validation
      await page.click('text=Get Free Consultation');

      // Name field should still contain the value
      await expect(page.locator('input[id="name"]')).toHaveValue('Test User');

      // Email field should still contain the invalid value for correction
      await expect(page.locator('input[id="email"]')).toHaveValue('invalid-email');
    });
  });
});