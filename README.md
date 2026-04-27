# Aurelion Fitness SPA

Premium one-page React + Vite gym website with a dark luxury UI, neon glow aesthetics, scroll animations, and a high-converting lead capture form powered by EmailJS.

## Features

- React SPA with all requested sections:
  - Hero, About, Programs, Trainers, Transformations, Pricing, Testimonials, CTA, Contact
- Conversion-focused consultation form:
  - Full Name, Email, Phone, Goal dropdown, Message
  - Client-side validation + loading state + success/error feedback
  - Sends lead email via EmailJS
- Dark premium glassmorphism interface with hover glow effects
- Scroll reveal animations via Framer Motion
- Loading screen animation
- Floating WhatsApp button

## Quick Start

```bash
npm install
cp .env.example .env
npm run dev
```

## EmailJS Setup

1. Create an EmailJS service.
2. Create an EmailJS template.
3. Add values to `.env`:

```bash
VITE_EMAILJS_SERVICE_ID=...
VITE_EMAILJS_TEMPLATE_ID=...
VITE_EMAILJS_PUBLIC_KEY=...
```

4. In your EmailJS template, map variables from the app payload:
   - `subject`
   - `to_email`
   - `user_name`
   - `user_email`
   - `user_phone`
   - `user_goal`
   - `user_message`
   - `formatted_body`

Set destination email to `webigeeksofficial@gmail.com` (directly in template or with `to_email`).

## Required Email Output

Subject:

`New Gym Lead - {User Name}`

Body:

```text
🏋️ New Gym Membership Inquiry

Name: {Full Name}
Email: {Email}
Phone: {Phone Number}
Goal: {Goal}

Message:
{User Message}

---
Submitted from Website
```

## Build

```bash
npm run build
```
