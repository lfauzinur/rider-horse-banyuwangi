'use client';

import { Phone, Mail, MapPin, Clock, MessageCircle, Send } from 'lucide-react';
import { defaultSiteContent } from '@/lib/mock-data';
import { useState } from 'react';
import { useLanguage } from '@/lib/i18n/context';

export default function Contact() {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const contactInfoItems = [
    { icon: Phone, label: t.contact.labels.phone, value: defaultSiteContent.contact_phone, href: `tel:${defaultSiteContent.contact_phone.replace(/\s/g, '')}` },
    { icon: Mail, label: t.contact.labels.email, value: defaultSiteContent.contact_email, href: `mailto:${defaultSiteContent.contact_email}` },
    { icon: MapPin, label: t.contact.labels.address, value: defaultSiteContent.contact_address, href: 'https://maps.google.com/?q=Banyuwangi' },
    { icon: Clock, label: t.contact.labels.hours, value: defaultSiteContent.operating_hours, href: null },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = `Halo Rider Horse Banyuwangi!\n\nNama: ${formData.name}\nEmail: ${formData.email}\nNo. HP: ${formData.phone}\n\nPesan:\n${formData.message}`;
    const url = `https://wa.me/${defaultSiteContent.whatsapp_number}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <section id="contact" className="py-20 lg:py-28 bg-white">
      <div className="container-main">
        {/* Header */}
        <div className="text-center mb-14">
          <span className="section-badge justify-center">{t.contact.badge}</span>
          <h2
            className="mt-4 mb-4"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2rem, 4vw, 2.75rem)',
              fontWeight: 900,
              lineHeight: 1.15,
              color: '#1a1a14',
            }}
          >
            {t.contact.headline}
          </h2>
          <p className="text-neutral-500 text-base max-w-xl mx-auto leading-relaxed">
            {t.contact.description}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16">
          {/* Left – Contact info */}
          <div>
            <h3 className="text-lg font-bold text-neutral-900 mb-6">{t.contact.infoTitle}</h3>
            <div className="space-y-5 mb-8">
              {contactInfoItems.map((item) => (
                <div key={item.label} className="flex items-start gap-4">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: '#f0f5ec', color: '#2e5f1e' }}
                  >
                    <item.icon className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-0.5">{item.label}</p>
                    {item.href ? (
                      <a
                        href={item.href}
                        target={item.href.startsWith('http') ? '_blank' : undefined}
                        rel="noopener noreferrer"
                        className="text-sm font-medium text-neutral-700 hover:text-brand-700 transition-colors"
                      >
                        {item.value}
                      </a>
                    ) : (
                      <p className="text-sm font-medium text-neutral-700">{item.value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* WhatsApp button */}
            <a
              href={`https://wa.me/${defaultSiteContent.whatsapp_number}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary inline-flex items-center gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              {t.contact.whatsappBtn}
            </a>

            {/* Map placeholder */}
            <div
              className="mt-6 rounded-xl overflow-hidden flex items-center justify-center"
              style={{ height: '180px', background: '#f0f5ec', border: '1px solid #b4d4a0' }}
            >
              <div className="text-center">
                <MapPin className="w-7 h-7 mx-auto mb-2" style={{ color: '#2e5f1e' }} />
                <p className="text-sm font-medium text-neutral-700">Banyuwangi, Jawa Timur</p>
                <a
                  href="https://maps.google.com/?q=Banyuwangi+Indonesia"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-semibold mt-1 block"
                  style={{ color: '#2e5f1e' }}
                >
                  {t.contact.mapLink}
                </a>
              </div>
            </div>
          </div>

          {/* Right – Form */}
          <div className="card-flat p-8" style={{ background: '#f8f6f0' }}>
            <h3 className="text-lg font-bold text-neutral-900 mb-6">{t.contact.formTitle}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="form-label">{t.contact.nameLabel} *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder={t.contact.namePlaceholder}
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="form-label">{t.contact.emailLabel}</label>
                  <input
                    type="email"
                    className="form-input"
                    placeholder={t.contact.emailPlaceholder}
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
                <div>
                  <label className="form-label">{t.contact.phoneLabel}</label>
                  <input
                    type="tel"
                    className="form-input"
                    placeholder={t.contact.phonePlaceholder}
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <label className="form-label">{t.contact.messageLabel} *</label>
                <textarea
                  className="form-input resize-none"
                  rows={5}
                  placeholder={t.contact.messagePlaceholder}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required
                />
              </div>
              <button
                type="submit"
                className="btn-primary w-full justify-center gap-2"
                disabled={submitted}
              >
                {submitted ? (
                  t.contact.submittedBtn
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    {t.contact.submitBtn}
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
