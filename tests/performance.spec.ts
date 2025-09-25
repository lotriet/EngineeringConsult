import { test, expect } from '@playwright/test';

test.describe('Performance Tests', () => {

  test.describe('Page Load Performance', () => {

    test('should load homepage within acceptable time limits', async ({ page }) => {
      // Start timing
      const startTime = Date.now();

      // Navigate to homepage
      await page.goto('/', { waitUntil: 'networkidle' });

      // Calculate load time
      const loadTime = Date.now() - startTime;

      // Should load within 3 seconds
      expect(loadTime).toBeLessThan(3000);

      // Verify page is fully loaded
      await expect(page.locator('h1')).toBeVisible();
      await expect(page.locator('text=Transform your business')).toBeVisible();
    });

    test('should have fast time to first meaningful paint', async ({ page }) => {
      // Measure performance metrics
      await page.goto('/');

      const performanceMetrics = await page.evaluate(() => {
        return new Promise((resolve) => {
          new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const navigationEntry = entries[0] as PerformanceNavigationTiming;
            resolve({
              domContentLoaded: navigationEntry.domContentLoadedEventEnd - navigationEntry.fetchStart,
              loadComplete: navigationEntry.loadEventEnd - navigationEntry.fetchStart,
              firstPaint: performance.getEntriesByType('paint').find(entry => entry.name === 'first-paint')?.startTime || 0,
              firstContentfulPaint: performance.getEntriesByType('paint').find(entry => entry.name === 'first-contentful-paint')?.startTime || 0
            });
          }).observe({ type: 'navigation', buffered: true });
        });
      });

      console.log('Performance Metrics:', performanceMetrics);

      // Verify reasonable performance thresholds
      expect((performanceMetrics as any).domContentLoaded).toBeLessThan(2000);
      expect((performanceMetrics as any).firstContentfulPaint).toBeLessThan(1500);
    });

    test('should not have any slow network requests', async ({ page }) => {
      const slowRequests: any[] = [];

      page.on('response', async (response) => {
        const request = response.request();
        const timing = response.timing();
        const totalTime = timing.responseEnd;

        if (totalTime > 1000) {
          slowRequests.push({
            url: request.url(),
            method: request.method(),
            responseTime: totalTime,
            status: response.status()
          });
        }
      });

      await page.goto('/', { waitUntil: 'networkidle' });

      // Report any slow requests
      if (slowRequests.length > 0) {
        console.log('Slow requests detected:', slowRequests);
      }

      // Should not have requests taking longer than 2 seconds
      const verySlowRequests = slowRequests.filter(req => req.responseTime > 2000);
      expect(verySlowRequests).toHaveLength(0);
    });
  });

  test.describe('Core Web Vitals', () => {

    test('should have good Largest Contentful Paint (LCP)', async ({ page }) => {
      await page.goto('/');

      const lcp = await page.evaluate(() => {
        return new Promise((resolve) => {
          new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const lastEntry = entries[entries.length - 1];
            resolve(lastEntry.startTime);
          }).observe({ type: 'largest-contentful-paint', buffered: true });

          // Fallback timeout
          setTimeout(() => resolve(0), 5000);
        });
      });

      console.log('LCP:', lcp);

      // LCP should be under 2.5 seconds for good performance
      expect(lcp as number).toBeLessThan(2500);
    });

    test('should have good First Input Delay simulation', async ({ page }) => {
      await page.goto('/');

      // Simulate user interaction and measure response time
      const startTime = Date.now();

      // Click a button and measure response
      await page.click('text=Get Started Today');
      await page.waitForSelector('text=Free AI Consultation', { timeout: 1000 });

      const responseTime = Date.now() - startTime;

      // Should respond within 100ms for good FID
      expect(responseTime).toBeLessThan(100);
    });

    test('should have minimal layout shift', async ({ page }) => {
      await page.goto('/');

      // Wait for all content to load
      await page.waitForLoadState('networkidle');

      // Take initial screenshot
      const initialScreenshot = await page.screenshot();

      // Wait a bit more and take another screenshot
      await page.waitForTimeout(2000);
      const finalScreenshot = await page.screenshot();

      // Screenshots should be identical (no layout shift)
      expect(initialScreenshot).toEqual(finalScreenshot);
    });
  });

  test.describe('Resource Performance', () => {

    test('should not load excessive resources', async ({ page }) => {
      const resources: any[] = [];

      page.on('response', async (response) => {
        const request = response.request();
        const resourceSize = parseInt(response.headers()['content-length'] || '0');

        resources.push({
          url: request.url(),
          type: request.resourceType(),
          size: resourceSize,
          status: response.status()
        });
      });

      await page.goto('/', { waitUntil: 'networkidle' });

      // Analyze resource usage
      const totalSize = resources.reduce((sum, resource) => sum + resource.size, 0);
      const imageResources = resources.filter(r => r.type === 'image');
      const scriptResources = resources.filter(r => r.type === 'script');
      const stylesheetResources = resources.filter(r => r.type === 'stylesheet');

      console.log('Total page size:', totalSize, 'bytes');
      console.log('Number of requests:', resources.length);
      console.log('Images:', imageResources.length);
      console.log('Scripts:', scriptResources.length);
      console.log('Stylesheets:', stylesheetResources.length);

      // Page should not be too large
      expect(totalSize).toBeLessThan(5 * 1024 * 1024); // 5MB limit

      // Should not have too many requests
      expect(resources.length).toBeLessThan(50);

      // No 4xx or 5xx errors
      const errorResponses = resources.filter(r => r.status >= 400);
      expect(errorResponses).toHaveLength(0);
    });

    test('should cache static resources properly', async ({ page }) => {
      // First visit
      await page.goto('/');

      const firstVisitResources: any[] = [];

      page.on('response', async (response) => {
        const request = response.request();
        firstVisitResources.push({
          url: request.url(),
          fromCache: response.fromServiceWorker() || response.timing().receiveHeadersEnd === 0
        });
      });

      // Second visit (should use cached resources)
      await page.reload({ waitUntil: 'networkidle' });

      // Wait a moment for cache check
      await page.waitForTimeout(1000);

      // Check that some resources are loaded from cache
      const cachedResources = firstVisitResources.filter(r => r.fromCache);
      console.log('Cached resources on reload:', cachedResources.length);

      // At least some static resources should be cached
      expect(cachedResources.length).toBeGreaterThan(0);
    });
  });

  test.describe('Form Performance', () => {

    test('should handle form interactions quickly', async ({ page }) => {
      await page.goto('/');

      // Measure time to show form
      const showFormStart = Date.now();
      await page.click('text=Get Started Today');
      await page.waitForSelector('text=Free AI Consultation');
      const showFormTime = Date.now() - showFormStart;

      expect(showFormTime).toBeLessThan(100); // Should be near instant

      // Measure typing responsiveness
      const typingStart = Date.now();
      await page.fill('input[id="email"]', 'test@example.com');
      const typingTime = Date.now() - typingStart;

      expect(typingTime).toBeLessThan(50); // Typing should be responsive

      // Measure form submission response
      const submitStart = Date.now();
      await page.click('text=Get Free Consultation');
      await page.waitForSelector('text=Submitting...');
      const submitResponseTime = Date.now() - submitStart;

      expect(submitResponseTime).toBeLessThan(100); // UI feedback should be immediate
    });

    test('should validate form fields without blocking UI', async ({ page }) => {
      await page.goto('/');
      await page.click('text=Get Started Today');

      // Type invalid email
      const validationStart = Date.now();
      await page.fill('input[id="email"]', 'invalid-email');
      await page.click('text=Get Free Consultation');
      await page.waitForSelector('text=Invalid email address');
      const validationTime = Date.now() - validationStart;

      // Validation should be quick
      expect(validationTime).toBeLessThan(200);

      // UI should remain responsive during validation
      await page.fill('input[id="name"]', 'Test User');
      const nameField = page.locator('input[id="name"]');
      await expect(nameField).toHaveValue('Test User');
    });
  });

  test.describe('Mobile Performance', () => {

    test('should perform well on mobile devices', async ({ page, browser }) => {
      // Create mobile context
      const mobileContext = await browser.newContext({
        ...browser.contexts()[0], // Copy existing context
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15',
        viewport: { width: 375, height: 667 },
        deviceScaleFactor: 2,
        isMobile: true,
        hasTouch: true
      });

      const mobilePage = await mobileContext.newPage();

      // Measure mobile load time
      const mobileStartTime = Date.now();
      await mobilePage.goto('/', { waitUntil: 'networkidle' });
      const mobileLoadTime = Date.now() - mobileStartTime;

      // Mobile should still load reasonably fast
      expect(mobileLoadTime).toBeLessThan(4000); // Slightly more lenient for mobile

      // Verify mobile-specific interactions work well
      await mobilePage.tap('text=Get Started Today');
      await expect(mobilePage.locator('text=Free AI Consultation')).toBeVisible();

      // Test mobile form interaction
      await mobilePage.fill('input[id="email"]', 'mobile@test.com');
      await mobilePage.tap('text=Get Free Consultation');
      await expect(mobilePage.locator('text=Thank you!')).toBeVisible({ timeout: 5000 });

      await mobileContext.close();
    });
  });

  test.describe('Memory and CPU Performance', () => {

    test('should not cause memory leaks during interactions', async ({ page }) => {
      await page.goto('/');

      // Get initial memory usage
      const initialMemory = await page.evaluate(() => {
        return (performance as any).memory ? {
          used: (performance as any).memory.usedJSHeapSize,
          total: (performance as any).memory.totalJSHeapSize,
          limit: (performance as any).memory.jsHeapSizeLimit
        } : null;
      });

      if (initialMemory) {
        // Perform multiple interactions
        for (let i = 0; i < 10; i++) {
          await page.click('text=Get Started Today');
          await page.waitForSelector('text=Free AI Consultation');
          await page.fill('input[id="email"]', `test${i}@example.com`);
          await page.click('text=Get Free Consultation');
          await page.waitForSelector('text=Thank you!', { timeout: 5000 });
          await page.click('text=Submit another email');
        }

        // Check final memory usage
        const finalMemory = await page.evaluate(() => {
          return (performance as any).memory ? {
            used: (performance as any).memory.usedJSHeapSize,
            total: (performance as any).memory.totalJSHeapSize,
            limit: (performance as any).memory.jsHeapSizeLimit
          } : null;
        });

        if (finalMemory) {
          const memoryIncrease = finalMemory.used - initialMemory.used;
          console.log('Memory increase:', memoryIncrease, 'bytes');

          // Memory increase should not be excessive
          expect(memoryIncrease).toBeLessThan(10 * 1024 * 1024); // 10MB limit
        }
      }
    });
  });
});