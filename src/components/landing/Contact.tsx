'use client';

import { FormEvent, useState } from 'react';
import { ArrowUpRight, Clock3, Mail, MapPin, MessageCircle, Phone } from 'lucide-react';
import { defaultSiteContent } from '@/lib/mock-data';
import { useLanguage } from '@/lib/i18n/context';

export default function Contact() {
  const { t, locale, siteContent } = useLanguage();
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const content = (key: string) => siteContent[`global.${key}`] || defaultSiteContent[key];
  const phone = content('contact_phone');
  const email = content('contact_email');
  const whatsapp = content('whatsapp_number');

  if (siteContent['global.show_contact'] === 'false') return null;

  const contactItems = [
    { icon: Phone, label: t.contact.labels.phone, value: phone, href: `tel:${phone.replace(/\s/g, '')}` },
    { icon: Mail, label: t.contact.labels.email, value: email, href: `mailto:${email}` },
    { icon: MapPin, label: t.contact.labels.address, value: content('contact_address'), href: 'https://maps.google.com/?q=Rider+Horse+Banyuwangi' },
    { icon: Clock3, label: t.contact.labels.hours, value: content('operating_hours'), href: null },
  ];

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const text = `Halo Rider Horse Banyuwangi!\n\nNama: ${formData.name}\nEmail: ${formData.email || '-'}\nNo. HP: ${formData.phone}\n\nPesan:\n${formData.message}`;
    window.open(`https://wa.me/${whatsapp}?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer');
    setSubmitted(true);
  }

  return (
    <section id="contact" className="section-shell relative overflow-hidden bg-brand-950 text-white">
      <div className="absolute -left-40 top-0 h-96 w-96 rounded-full bg-accent-400/5 blur-3xl" />
      <div className="container-main relative grid gap-12 lg:grid-cols-[.85fr_1.15fr] lg:gap-20">
        <div>
          <span className="section-kicker !text-accent-300">{t.contact.badge}</span>
          <h2 className="section-title !text-white">{t.contact.headline}</h2>
          <p className="mt-6 max-w-md text-sm leading-7 text-white/58">{t.contact.description}</p>

          <div className="mt-9 space-y-5">
            {contactItems.map(({ icon: Icon, label, value, href }) => {
              const content = (
                <>
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/12 text-accent-300">
                    <Icon className="h-4 w-4" strokeWidth={1.7} />
                  </span>
                  <span>
                    <span className="block text-[0.6rem] font-extrabold uppercase tracking-[0.16em] text-white/35">{label}</span>
                    <span className="mt-1 block text-sm leading-6 text-white/78">{value}</span>
                  </span>
                </>
              );
              return href ? (
                <a key={label} href={href} target={href.startsWith('http') ? '_blank' : undefined} rel={href.startsWith('http') ? 'noopener noreferrer' : undefined} className="flex max-w-md items-start gap-3 transition-opacity hover:opacity-75">
                  {content}
                </a>
              ) : <div key={label} className="flex max-w-md items-start gap-3">{content}</div>;
            })}
          </div>
        </div>

        <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.055] p-5 backdrop-blur-sm sm:p-8 lg:p-10">
          <div className="mb-7 flex items-center justify-between gap-4">
            <div>
              <p className="font-display text-2xl font-bold text-white">{t.contact.formTitle}</p>
              <p className="mt-1 text-xs text-white/45">{locale === 'id' ? 'Kami biasanya membalas dalam 10–30 menit.' : 'We usually reply within 10–30 minutes.'}</p>
            </div>
            <MessageCircle className="h-6 w-6 text-accent-300" strokeWidth={1.5} />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="contact-name" className="form-label !text-white/70">{t.contact.nameLabel} *</label>
                <input id="contact-name" name="name" className="form-input !border-white/10 !bg-white/[0.07] !text-white placeholder:!text-white/30" value={formData.name} onChange={(event) => setFormData({ ...formData, name: event.target.value })} placeholder={t.contact.namePlaceholder} required />
              </div>
              <div>
                <label htmlFor="contact-phone" className="form-label !text-white/70">{t.contact.phoneLabel} *</label>
                <input id="contact-phone" name="phone" type="tel" className="form-input !border-white/10 !bg-white/[0.07] !text-white placeholder:!text-white/30" value={formData.phone} onChange={(event) => setFormData({ ...formData, phone: event.target.value })} placeholder={t.contact.phonePlaceholder} required />
              </div>
            </div>
            <div>
              <label htmlFor="contact-email" className="form-label !text-white/70">{t.contact.emailLabel}</label>
              <input id="contact-email" name="email" type="email" className="form-input !border-white/10 !bg-white/[0.07] !text-white placeholder:!text-white/30" value={formData.email} onChange={(event) => setFormData({ ...formData, email: event.target.value })} placeholder={t.contact.emailPlaceholder} />
            </div>
            <div>
              <label htmlFor="contact-message" className="form-label !text-white/70">{t.contact.messageLabel} *</label>
              <textarea id="contact-message" name="message" rows={4} className="form-input resize-none !border-white/10 !bg-white/[0.07] !text-white placeholder:!text-white/30" value={formData.message} onChange={(event) => setFormData({ ...formData, message: event.target.value })} placeholder={t.contact.messagePlaceholder} required />
            </div>
            <button type="submit" className="btn-primary w-full sm:w-auto">
              {submitted ? t.contact.submittedBtn : t.contact.submitBtn}
              <ArrowUpRight className="h-4 w-4" />
            </button>
            <p className="text-[0.65rem] leading-5 text-white/35" aria-live="polite">
              {submitted
                ? (locale === 'id' ? 'WhatsApp telah dibuka. Kirim pesan untuk menyelesaikan permintaan.' : 'WhatsApp is open. Send the message to complete your request.')
                : (locale === 'id' ? 'Form ini akan membuka WhatsApp dengan pesan yang sudah terisi.' : 'This form opens WhatsApp with your message pre-filled.')}
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}
