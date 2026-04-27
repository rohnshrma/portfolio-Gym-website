import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import emailjs from '@emailjs/browser'
import imageFallback from './assets/hero.png'
import ThemeParticles from './components/ThemeParticles'
import './App.css'

const navLinks = [
  { href: '#about', label: 'About' },
  { href: '#programs', label: 'Programs' },
  { href: '#trainers', label: 'Trainers' },
  { href: '#transformations', label: 'Results' },
  { href: '#pricing', label: 'Pricing' },
  { href: '#contact', label: 'Contact' },
]

const programs = [
  {
    title: 'Elite Fat Burn',
    desc: 'High-intensity classes + metabolic conditioning built to cut body fat fast.',
    tag: 'Most Popular',
  },
  {
    title: 'Strength & Power',
    desc: 'Structured progressive overload, form coaching, and measurable weekly gains.',
    tag: 'Premium',
  },
  {
    title: 'Athletic Performance',
    desc: 'Speed, agility, mobility, and endurance programming for peak performance.',
    tag: 'Athlete Track',
  },
]

const trainers = [
  {
    name: 'Aarav Malhotra',
    role: 'Head Strength Coach',
    detail: '12+ years coaching professionals and competitive athletes.',
    image: 'https://images.pexels.com/photos/6550836/pexels-photo-6550836.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    name: 'Maya Verma',
    role: 'Body Recomposition Specialist',
    detail: 'Expert in fat-loss transformations and lifestyle nutrition systems.',
    image: 'https://images.pexels.com/photos/5327466/pexels-photo-5327466.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    name: 'Rohan Iyer',
    role: 'Functional Mobility Coach',
    detail: 'Helps clients train pain-free with mobility-first strength plans.',
    image: 'https://images.pexels.com/photos/5485460/pexels-photo-5485460.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
]

const transformations = [
  {
    name: 'Karan',
    result: '-18 kg in 20 weeks',
    story: 'From burnout to confidence and consistent routine.',
    image: 'https://images.pexels.com/photos/5327532/pexels-photo-5327532.jpeg?auto=compress&cs=tinysrgb&w=1500',
  },
  {
    name: 'Nisha',
    result: '+7 kg lean muscle',
    story: 'Built strength, posture, and energy with guided programming.',
    image: 'https://images.pexels.com/photos/3757957/pexels-photo-3757957.jpeg?auto=compress&cs=tinysrgb&w=1500',
  },
  {
    name: 'Dev',
    result: 'Body fat 29% to 15%',
    story: 'Complete lifestyle reset through coaching and accountability.',
    image: 'https://images.pexels.com/photos/6456214/pexels-photo-6456214.jpeg?auto=compress&cs=tinysrgb&w=1500',
  },
]

const pricing = [
  {
    plan: 'Starter',
    price: '$59/mo',
    points: ['Gym access', '2 group sessions/week', 'Basic progress tracking'],
  },
  {
    plan: 'Pro Transformation',
    price: '$129/mo',
    points: ['Unlimited classes', '1-on-1 monthly review', 'Nutrition blueprint', 'Priority trainer support'],
    featured: true,
  },
  {
    plan: 'Elite Private',
    price: '$249/mo',
    points: ['Personalized training', 'Weekly private coaching', 'Recovery protocol', 'VIP scheduling'],
  },
]

const testimonials = [
  {
    quote: 'I joined for 30 days and stayed for 12 months. The results were unreal.',
    author: 'Simran K.',
  },
  {
    quote: 'Everything feels premium, from coaching quality to recovery support.',
    author: 'Arjun P.',
  },
  {
    quote: 'This is the first gym that made consistency feel easy and exciting.',
    author: 'Meera R.',
  },
]

const initialForm = {
  fullName: '',
  email: '',
  phone: '',
  goal: '',
  message: '',
}

const heroVideoSources = [
  '/gym-hero.mp4',
]

const reveal = {
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
}

function Section({ id, children, className = '' }) {
  return (
    <motion.section
      id={id}
      className={`section ${className}`.trim()}
      variants={reveal}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
    >
      {children}
    </motion.section>
  )
}

function App() {
  const [loading, setLoading] = useState(true)
  const [heroVideoSrcIndex, setHeroVideoSrcIndex] = useState(0)
  const [isNavOpen, setIsNavOpen] = useState(false)
  const [formData, setFormData] = useState(initialForm)
  const [errors, setErrors] = useState({})
  const [submitState, setSubmitState] = useState('idle')
  const [toast, setToast] = useState('')
  const heroVideoRef = useRef(null)

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1600)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (!toast) {
      return undefined
    }
    const timer = setTimeout(() => setToast(''), 3500)
    return () => clearTimeout(timer)
  }, [toast])

  useEffect(() => {
    const video = heroVideoRef.current
    if (!video) {
      return undefined
    }

    const attemptPlay = () => {
      video.muted = true
      const promise = video.play()
      if (promise?.catch) {
        promise.catch(() => {})
      }
    }

    attemptPlay()
    video.addEventListener('canplay', attemptPlay)

    const onVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        attemptPlay()
      }
    }

    document.addEventListener('visibilitychange', onVisibilityChange)

    return () => {
      video.removeEventListener('canplay', attemptPlay)
      document.removeEventListener('visibilitychange', onVisibilityChange)
    }
  }, [heroVideoSrcIndex])

  const year = useMemo(() => new Date().getFullYear(), [])

  const handleImageError = (event) => {
    const img = event.currentTarget
    if (img.dataset.fallbackApplied === 'true') {
      return
    }
    img.dataset.fallbackApplied = 'true'
    img.src = imageFallback
  }

  const validate = () => {
    const nextErrors = {}
    const cleanPhone = formData.phone.replace(/\D/g, '')

    if (!formData.fullName.trim()) {
      nextErrors.fullName = 'Full name is required.'
    }

    if (!formData.email.trim()) {
      nextErrors.email = 'Email is required.'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      nextErrors.email = 'Enter a valid email address.'
    }

    if (!cleanPhone) {
      nextErrors.phone = 'Phone number is required.'
    } else if (cleanPhone.length < 10 || cleanPhone.length > 15) {
      nextErrors.phone = 'Phone should be between 10 and 15 digits.'
    }

    if (!formData.goal) {
      nextErrors.goal = 'Please select your primary goal.'
    }

    if (!formData.message.trim()) {
      nextErrors.message = 'Please share your fitness objective.'
    }

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => ({ ...prev, [name]: '' }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!validate()) {
      setToast('Please fix the highlighted fields and try again.')
      return
    }

    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY

    if (!serviceId || !templateId || !publicKey) {
      setSubmitState('error')
      setToast('Email service is not configured yet. Add EmailJS environment keys.')
      return
    }

    const emailPayload = {
      to_email: 'webigeeksofficial@gmail.com',
      subject: `New Gym Lead - ${formData.fullName}`,
      user_name: formData.fullName,
      user_email: formData.email,
      user_phone: formData.phone,
      user_goal: formData.goal,
      user_message: formData.message,
      formatted_body: `🏋️ New Gym Membership Inquiry\n\nName: ${formData.fullName}\nEmail: ${formData.email}\nPhone: ${formData.phone}\nGoal: ${formData.goal}\n\nMessage:\n${formData.message}\n\n---\nSubmitted from Website`,
    }

    try {
      setSubmitState('submitting')
      await emailjs.send(serviceId, templateId, emailPayload, { publicKey })
      setSubmitState('success')
      setToast('We\'ll contact you soon 💪')
      setFormData(initialForm)
    } catch (error) {
      console.error('Email send failed:', error)
      setSubmitState('error')
      setToast('Could not send your request. Please try again in a moment.')
    }
  }

  return (
    <>
      <AnimatePresence>
        {loading && (
          <motion.div
            className="loading-screen"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.55 } }}
          >
            <motion.div
              className="loader-ring"
              animate={{ rotate: 360 }}
              transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
            />
            <p>Preparing your transformation journey...</p>
          </motion.div>
        )}
      </AnimatePresence>

      <ThemeParticles />
      <div className="site-layer">
        <div className="bg-orb orb-1" aria-hidden="true" />
        <div className="bg-orb orb-2" aria-hidden="true" />

        <header className="topbar glass">
          <a href="#hero" className="logo">AURELION FITNESS</a>
          <button
            type="button"
            className="nav-toggle"
            aria-label="Toggle navigation"
            aria-expanded={isNavOpen}
            onClick={() => setIsNavOpen((prev) => !prev)}
          >
            <span />
            <span />
            <span />
          </button>
          <nav className={isNavOpen ? 'open' : ''}>
            {navLinks.map((link) => (
              <a key={link.href} href={link.href} onClick={() => setIsNavOpen(false)}>{link.label}</a>
            ))}
          </nav>
        </header>

        <main>
        <section id="hero" className="hero-section section">
          <video
            key={heroVideoSrcIndex}
            ref={heroVideoRef}
            className="hero-video"
            autoPlay
            muted
            loop
            playsInline
            disablePictureInPicture
            preload="metadata"
            poster={imageFallback}
            onCanPlay={() => {
              const video = heroVideoRef.current
              if (video) {
                const promise = video.play()
                if (promise?.catch) {
                  promise.catch(() => {})
                }
              }
            }}
            onError={handleHeroVideoError}
          >
            <source src={heroVideoSources[heroVideoSrcIndex]} type="video/mp4" />
          </video>
          <div className="hero-overlay" />
          <div className="hero-content">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="hero-kicker"
            >
              Premium Coaching. Relentless Results.
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Build the body that matches your ambition.
            </motion.h1>
            <motion.p
              className="hero-copy"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              A high-performance training space crafted for professionals who want elite aesthetics,
              strength, and confidence with world-class guidance.
            </motion.p>
            <motion.div
              className="hero-actions"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <a href="#consultation" className="btn btn-neon">Get Free Consultation</a>
              <a href="#pricing" className="btn btn-ghost">View Memberships</a>
            </motion.div>

            <motion.div className="hero-stats" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
              <div className="glass stat">
                <strong>8,000+</strong>
                <span>Sessions Delivered</span>
              </div>
              <div className="glass stat">
                <strong>97%</strong>
                <span>Retention Rate</span>
              </div>
              <div className="glass stat">
                <strong>4.9/5</strong>
                <span>Member Ratings</span>
              </div>
            </motion.div>
          </div>
        </section>

        <Section id="consultation" className="consultation-wrap">
          <div className="section-head">
            <p className="eyebrow">Get Free Consultation</p>
            <h2>Limited Seats Available - Book Your Free Consultation Now</h2>
          </div>
          <div className="consultation-grid">
            <div className="consult-copy">
              <h3>Start with a custom strategy session.</h3>
              <p>
                Tell us your goal and our coaches will contact you with a personalized roadmap,
                schedule recommendation, and an action plan for your first 30 days.
              </p>
              <ul>
                <li>1-on-1 needs analysis</li>
                <li>Fitness baseline review</li>
                <li>Clear plan for fat loss or muscle gain</li>
              </ul>
            </div>

            <form className="consult-form glass" onSubmit={handleSubmit} noValidate>
              <div className={`field ${formData.fullName ? 'filled' : ''}`}>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                />
                <label htmlFor="fullName">Full Name</label>
                {errors.fullName && <small>{errors.fullName}</small>}
              </div>

              <div className={`field ${formData.email ? 'filled' : ''}`}>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
                <label htmlFor="email">Email</label>
                {errors.email && <small>{errors.email}</small>}
              </div>

              <div className={`field ${formData.phone ? 'filled' : ''}`}>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
                <label htmlFor="phone">Phone Number</label>
                {errors.phone && <small>{errors.phone}</small>}
              </div>

              <div className="field select-field filled">
                <label htmlFor="goal" className="inline-label">Goal</label>
                <select
                  id="goal"
                  name="goal"
                  value={formData.goal}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select goal</option>
                  <option value="Weight Loss">Weight Loss</option>
                  <option value="Muscle Gain">Muscle Gain</option>
                  <option value="General Fitness">General Fitness</option>
                </select>
                {errors.goal && <small>{errors.goal}</small>}
              </div>

              <div className={`field ${formData.message ? 'filled' : ''}`}>
                <textarea
                  id="message"
                  name="message"
                  rows="4"
                  value={formData.message}
                  onChange={handleChange}
                  required
                />
                <label htmlFor="message">Message</label>
                {errors.message && <small>{errors.message}</small>}
              </div>

              <button className="btn btn-neon submit-btn" type="submit" disabled={submitState === 'submitting'}>
                {submitState === 'submitting' ? 'Sending...' : 'Book Free Consultation'}
              </button>

              <AnimatePresence>
                {submitState === 'success' && (
                  <motion.p
                    className="success-note"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                  >
                    We&apos;ll contact you soon 💪
                  </motion.p>
                )}
              </AnimatePresence>
            </form>
          </div>
        </Section>

        <Section id="about">
          <div className="section-head">
            <p className="eyebrow">About</p>
            <h2>A luxury fitness environment with measurable outcomes.</h2>
          </div>
          <div className="about-grid">
            <p>
              Aurelion blends science-backed training, personalized nutrition support, and recovery protocols
              to engineer total physique transformation for driven people.
            </p>
            <p>
              Our ecosystem is purpose-built for consistency, accountability, and elite execution so your
              progress becomes inevitable.
            </p>
          </div>
        </Section>

        <Section id="programs">
          <div className="section-head">
            <p className="eyebrow">Programs</p>
            <h2>Choose your transformation path.</h2>
          </div>
          <div className="card-grid">
            {programs.map((item) => (
              <motion.article className="card glass hover-card" key={item.title} whileHover={{ y: -8, rotateX: 5 }}>
                <span className="tag">{item.tag}</span>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </motion.article>
            ))}
          </div>
        </Section>

        <Section id="trainers">
          <div className="section-head">
            <p className="eyebrow">Trainers</p>
            <h2>Coaches who turn goals into outcomes.</h2>
          </div>
          <div className="card-grid">
            {trainers.map((coach) => (
              <article className="card glass trainer-card" key={coach.name}>
                <img src={coach.image} alt={coach.name} loading="lazy" onError={handleImageError} />
                <h3>{coach.name}</h3>
                <p className="meta">{coach.role}</p>
                <p>{coach.detail}</p>
              </article>
            ))}
          </div>
        </Section>

        <Section id="transformations">
          <div className="section-head">
            <p className="eyebrow">Transformations</p>
            <h2>Real clients. Real body composition change.</h2>
          </div>
          <div className="card-grid">
            {transformations.map((entry) => (
              <article className="card glass transformation-card" key={entry.name}>
                <img src={entry.image} alt={entry.name} loading="lazy" onError={handleImageError} />
                <h3>{entry.name}</h3>
                <p className="result">{entry.result}</p>
                <p>{entry.story}</p>
              </article>
            ))}
          </div>
        </Section>

        <Section id="pricing">
          <div className="section-head">
            <p className="eyebrow">Pricing</p>
            <h2>Memberships built for commitment.</h2>
          </div>
          <div className="card-grid pricing-grid">
            {pricing.map((item) => (
              <article className={`card glass pricing-card ${item.featured ? 'featured' : ''}`} key={item.plan}>
                <h3>{item.plan}</h3>
                <p className="price">{item.price}</p>
                <ul>
                  {item.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </Section>

        <Section id="testimonials">
          <div className="section-head">
            <p className="eyebrow">Testimonials</p>
            <h2>Loved by ambitious members.</h2>
          </div>
          <div className="card-grid">
            {testimonials.map((item) => (
              <blockquote className="card glass quote" key={item.author}>
                <p>&quot;{item.quote}&quot;</p>
                <cite>{item.author}</cite>
              </blockquote>
            ))}
          </div>
        </Section>

        <Section id="cta" className="cta glass">
          <p className="eyebrow">Ready To Upgrade?</p>
          <h2>Join Aurelion Fitness and unlock your strongest year yet.</h2>
          <a href="#consultation" className="btn btn-neon">Claim Your Free Consultation</a>
        </Section>

        <Section id="contact">
          <div className="section-head">
            <p className="eyebrow">Contact</p>
            <h2>Visit us or connect instantly.</h2>
          </div>
          <div className="contact-grid">
            <div className="glass contact-card">
              <h3>Studio Address</h3>
              <p>22B Performance Avenue, Downtown District</p>
              <p>Mon - Sat: 5:30 AM to 11:00 PM</p>
            </div>
            <div className="glass contact-card">
              <h3>Reach Out</h3>
              <p>Email: webigeeksofficial@gmail.com</p>
              <p>Phone: +1 (555) 123-7890</p>
            </div>
          </div>
        </Section>
        </main>

        <footer className="footer">© {year} Aurelion Fitness. All rights reserved.</footer>

        <a
          href="https://wa.me/15551237890?text=Hi%20Aurelion%20Fitness%2C%20I%20want%20a%20free%20consultation"
          target="_blank"
          rel="noreferrer"
          className="whatsapp-float"
          aria-label="Chat on WhatsApp"
        >
          <svg viewBox="0 0 32 32" aria-hidden="true">
            <path d="M16.02 3.2c-7.07 0-12.8 5.65-12.8 12.64 0 2.23.59 4.42 1.72 6.36L3 29l6.98-1.83a12.9 12.9 0 0 0 6.04 1.54h.01c7.07 0 12.8-5.65 12.8-12.64S23.1 3.2 16.03 3.2Zm0 23.4h-.01a10.7 10.7 0 0 1-5.45-1.49l-.39-.23-4.14 1.08 1.11-4-.25-.41a10.5 10.5 0 0 1-1.64-5.58c0-5.84 4.8-10.6 10.78-10.6 5.95 0 10.8 4.75 10.8 10.6 0 5.84-4.84 10.59-10.8 10.59Zm5.92-7.92c-.32-.15-1.9-.93-2.2-1.04-.3-.11-.52-.15-.74.15-.22.3-.85 1.04-1.04 1.26-.19.22-.38.26-.7.09-.32-.15-1.36-.49-2.58-1.57-.96-.84-1.61-1.89-1.79-2.2-.19-.31-.02-.48.14-.63.14-.14.32-.37.48-.56.16-.19.22-.3.33-.52.11-.22.06-.41-.02-.56-.08-.15-.74-1.77-1.01-2.42-.27-.65-.54-.56-.74-.57h-.63c-.22 0-.56.08-.85.41-.3.33-1.12 1.08-1.12 2.63s1.15 3.05 1.31 3.26c.16.22 2.23 3.54 5.52 4.82.78.3 1.39.48 1.86.62.78.24 1.49.2 2.05.12.63-.09 1.9-.78 2.16-1.53.27-.74.27-1.37.19-1.52-.08-.15-.3-.22-.63-.37Z" />
          </svg>
        </a>

        <AnimatePresence>
          {toast && (
            <motion.aside
              className={`toast ${submitState === 'error' ? 'error' : ''}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 14 }}
            >
              {toast}
            </motion.aside>
          )}
        </AnimatePresence>
      </div>
    </>
  )
}

export default App
  const handleHeroVideoError = () => {
    setHeroVideoSrcIndex((prev) => {
      if (prev < heroVideoSources.length - 1) {
        return prev + 1
      }
      return prev
    })
  }
