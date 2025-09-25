import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import EmailSignup from '../components/EmailSignup'

describe('EmailSignup Component', () => {
  beforeEach(() => {
    render(<EmailSignup />)
  })

  describe('Email Validation - Valid Emails', () => {
    const validEmails = [
      'user@example.com',
      'test.email@domain.co.uk',
      'user+tag@example.org',
      'user.name@company.io',
      'admin@test-domain.net',
      'contact@subdomain.example.com',
      'user123@domain123.co',
      'test_email@domain.info',
      'user-name@example-domain.com'
    ]

    validEmails.forEach(email => {
      it(`should accept valid email: ${email}`, async () => {
        const user = userEvent.setup()
        const emailInput = screen.getByLabelText(/email address/i)
        const submitButton = screen.getByRole('button', { name: /get free consultation/i })

        await user.type(emailInput, email)
        await user.click(submitButton)

        await waitFor(() => {
          expect(screen.queryByText(/invalid email address/i)).not.toBeInTheDocument()
        })
      })
    })
  })

  describe('Email Validation - Invalid Emails (Missing or Invalid Domain Extensions)', () => {
    const invalidEmails = [
      'user@domain',           // No domain extension - should fail regex
      'user@domain.c',         // Single character domain extension - should fail regex
      '',                     // Empty email - required validation should catch this
    ]

    invalidEmails.forEach(email => {
      it(`should reject invalid email: "${email}"`, async () => {
        const user = userEvent.setup()
        const emailInput = screen.getByLabelText(/email address/i)
        const submitButton = screen.getByRole('button', { name: /get free consultation/i })

        await user.clear(emailInput)
        if (email) {
          await user.type(emailInput, email)
        }
        await user.click(submitButton)

        await waitFor(() => {
          expect(screen.getByText(/email is required|invalid email address/i)).toBeInTheDocument()
        })
      })
    })
  })

  describe('Domain Extension Requirements', () => {
    it('should specifically require domain extensions with 2+ characters', async () => {
      const user = userEvent.setup()
      const emailInput = screen.getByLabelText(/email address/i)
      const submitButton = screen.getByRole('button', { name: /get free consultation/i })

      // Test that single character domains are rejected
      await user.clear(emailInput)
      await user.type(emailInput, 'user@domain.x')
      await user.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText(/invalid email address/i)).toBeInTheDocument()
      })

      // Test that 2+ character domains are accepted
      await user.clear(emailInput)
      await user.type(emailInput, 'user@domain.co')
      await user.click(submitButton)

      await waitFor(() => {
        expect(screen.queryByText(/invalid email address/i)).not.toBeInTheDocument()
      })
    })

    it('should accept common domain extensions', async () => {
      const validDomainExtensions = [
        'user@example.com',
        'user@example.org',
        'user@example.net',
        'user@example.co.uk',
        'user@example.edu',
        'user@example.gov',
        'user@example.info',
      ]

      for (const email of validDomainExtensions) {
        const user = userEvent.setup()
        const emailInput = screen.getByLabelText(/email address/i)
        const submitButton = screen.getByRole('button', { name: /get free consultation/i })

        await user.clear(emailInput)
        await user.type(emailInput, email)
        await user.click(submitButton)

        await waitFor(() => {
          expect(screen.queryByText(/invalid email address/i)).not.toBeInTheDocument()
        })

        // Reset for next test
        if (screen.queryByText(/thank you!/i)) {
          const resetButton = screen.getByText(/submit another email/i)
          await user.click(resetButton)
        }
      }
    })
  })

  describe('Form Behavior', () => {
    it('should display required error when email is empty', async () => {
      const user = userEvent.setup()
      const submitButton = screen.getByRole('button', { name: /get free consultation/i })

      await user.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText(/email is required/i)).toBeInTheDocument()
      })
    })

    it('should show loading state during form submission', async () => {
      const user = userEvent.setup()
      const emailInput = screen.getByLabelText(/email address/i)
      const submitButton = screen.getByRole('button', { name: /get free consultation/i })

      await user.type(emailInput, 'valid@example.com')
      await user.click(submitButton)

      expect(screen.getByText(/submitting.../i)).toBeInTheDocument()
      expect(submitButton).toBeDisabled()
    })

    it('should show success message after valid submission', async () => {
      const user = userEvent.setup()
      const emailInput = screen.getByLabelText(/email address/i)
      const submitButton = screen.getByRole('button', { name: /get free consultation/i })

      await user.type(emailInput, 'valid@example.com')
      await user.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText(/thank you!/i)).toBeInTheDocument()
      }, { timeout: 3000 })

      expect(screen.getByText(/we'll be in touch soon/i)).toBeInTheDocument()
    })

    it('should reset form after successful submission', async () => {
      const user = userEvent.setup()
      const emailInput = screen.getByLabelText(/email address/i)
      const submitButton = screen.getByRole('button', { name: /get free consultation/i })

      await user.type(emailInput, 'valid@example.com')
      await user.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText(/thank you!/i)).toBeInTheDocument()
      })

      const resetButton = screen.getByText(/submit another email/i)
      await user.click(resetButton)

      expect(screen.getByLabelText(/email address/i)).toHaveValue('')
    })

    it('should allow optional name field', async () => {
      const user = userEvent.setup()
      const nameInput = screen.getByLabelText(/name.*optional/i)
      const emailInput = screen.getByLabelText(/email address/i)
      const submitButton = screen.getByRole('button', { name: /get free consultation/i })

      await user.type(nameInput, 'John Doe')
      await user.type(emailInput, 'john@example.com')
      await user.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText(/thank you!/i)).toBeInTheDocument()
      })
    })
  })

  describe('Visual Feedback', () => {
    it('should apply error styling to email field when invalid', async () => {
      const user = userEvent.setup()
      const emailInput = screen.getByLabelText(/email address/i)
      const submitButton = screen.getByRole('button', { name: /get free consultation/i })

      await user.type(emailInput, 'invalid@email')
      await user.click(submitButton)

      await waitFor(() => {
        expect(emailInput).toHaveClass('border-red-300')
      })
    })

    it('should display error message below email field', async () => {
      const user = userEvent.setup()
      const emailInput = screen.getByLabelText(/email address/i)
      const submitButton = screen.getByRole('button', { name: /get free consultation/i })

      await user.type(emailInput, 'invalid@email')
      await user.click(submitButton)

      await waitFor(() => {
        const errorMessage = screen.getByText(/invalid email address/i)
        expect(errorMessage).toHaveClass('text-red-600')
      })
    })
  })

  describe('Edge Cases', () => {
    it('should handle very long valid email addresses', async () => {
      const user = userEvent.setup()
      const longValidEmail = 'verylongusernamethatisvalidbutunusuallylong@verylongdomainnamethatisvalidbutunusual.com'
      const emailInput = screen.getByLabelText(/email address/i)
      const submitButton = screen.getByRole('button', { name: /get free consultation/i })

      await user.type(emailInput, longValidEmail)
      await user.click(submitButton)

      await waitFor(() => {
        expect(screen.queryByText(/invalid email address/i)).not.toBeInTheDocument()
      })
    })

    it('should handle emails with multiple valid domain extensions', async () => {
      const user = userEvent.setup()
      const emailInput = screen.getByLabelText(/email address/i)
      const submitButton = screen.getByRole('button', { name: /get free consultation/i })

      await user.type(emailInput, 'user@domain.co.uk')
      await user.click(submitButton)

      await waitFor(() => {
        expect(screen.queryByText(/invalid email address/i)).not.toBeInTheDocument()
      })
    })
  })
})