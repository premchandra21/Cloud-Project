import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useAuth } from '../features/auth/useAuth'
import './contact-admin.css'

interface ContactForm {
  name: string
  email: string
  category: string
  subject: string
  message: string
}

const CATEGORIES = [
  'Account issue',
  'Wallet / top-up problem',
  'Toll transaction dispute',
  'Vehicle / RFID tag',
  'Feedback or suggestion',
  'Other',
]

const MAX_MESSAGE = 1000

export default function ContactAdminPage() {
  const { user } = useAuth()
  const [sent, setSent] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ContactForm>({
    defaultValues: {
      name: user?.name ?? '',
      email: user?.email ?? '',
      category: CATEGORIES[0],
      subject: '',
      message: '',
    },
  })

  const messageLength = (watch('message') ?? '').length

  // FRONTEND ONLY: simulates a network call. Replace with a real API call later.
  const onSubmit = async (values: ContactForm) => {
    await new Promise((resolve) => setTimeout(resolve, 800))
    console.log('Contact admin (not sent anywhere yet):', values)
    setSent(true)
    reset({ ...values, subject: '', message: '' })
  }

  return (
    <div className="contact">
      <div className="contact__intro">
        <h2>Contact Admin</h2>
        <p className="muted">
          Have a question or a problem? Send us a message and the admin team will get back to you.
        </p>
      </div>

      <div className="contact__layout">
        <form onSubmit={handleSubmit(onSubmit)} className="form card" noValidate>
          {sent && (
            <div className="alert alert--ok" role="status">
              Thanks! Your message has been submitted. The admin will reply by email.
            </div>
          )}

          <div className="contact__row">
            <label>
              Name
              <input
                type="text"
                placeholder="Your name"
                {...register('name', {
                  required: 'Name is required',
                  minLength: { value: 2, message: 'Name is too short' },
                })}
              />
              {errors.name && <span className="error">{errors.name.message}</span>}
            </label>

            <label>
              Email
              <input
                type="email"
                placeholder="you@example.com"
                {...register('email', {
                  required: 'Email is required',
                  pattern: { value: /^\S+@\S+\.\S+$/, message: 'Enter a valid email' },
                })}
              />
              {errors.email && <span className="error">{errors.email.message}</span>}
            </label>
          </div>

          <label>
            Category
            <select {...register('category', { required: true })}>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>

          <label>
            Subject
            <input
              type="text"
              placeholder="Short summary of your issue"
              {...register('subject', {
                required: 'Subject is required',
                maxLength: { value: 120, message: 'Keep it under 120 characters' },
              })}
            />
            {errors.subject && <span className="error">{errors.subject.message}</span>}
          </label>

          <label>
            Message
            <textarea
              rows={6}
              placeholder="Describe your issue in detail..."
              {...register('message', {
                required: 'Message is required',
                minLength: { value: 10, message: 'Please write at least 10 characters' },
                maxLength: {
                  value: MAX_MESSAGE,
                  message: `Maximum ${MAX_MESSAGE} characters`,
                },
              })}
            />
            <span className="contact__counter muted">
              {messageLength}/{MAX_MESSAGE}
            </span>
            {errors.message && <span className="error">{errors.message.message}</span>}
          </label>

          <button type="submit" className="btn" disabled={isSubmitting}>
            {isSubmitting ? 'Sending...' : 'Send message'}
          </button>
        </form>

        <aside className="contact__side card">
          <h3>Other ways to reach us</h3>
          <ul>
            <li>
              <strong>Email</strong>
              <span>admin@tollcloud.example</span>
            </li>
            <li>
              <strong>Phone</strong>
              <span>+91 00000 00000</span>
            </li>
            <li>
              <strong>Support hours</strong>
              <span>Mon – Fri, 9:00 AM – 6:00 PM IST</span>
            </li>
          </ul>
          <p className="contact__note">Typical response time: within 1–2 working days.</p>
        </aside>
      </div>
    </div>
  )
}