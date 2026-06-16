import { Link } from 'react-router-dom';
import { ArrowLeft, Layers, Mail, Phone, MapPin } from 'lucide-react';

export function AboutPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-dark-900 px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-dark-500 hover:text-dark-700 mb-8"><ArrowLeft size={14} /> Home</Link>
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center"><Layers size={18} className="text-white" /></div>
          <div>
            <h1 className="text-2xl font-bold text-dark-900 dark:text-dark-50 font-display">About LCU Portal</h1>
            <p className="text-sm text-dark-500">Academic Management System</p>
          </div>
        </div>
        <div className="prose prose-sm text-dark-600 dark:text-dark-400 space-y-4">
          <p className="text-base leading-relaxed">The LCU Academic Portal is a comprehensive course registration and management platform built for Landmark Christian University. It enables students, lecturers, and administrators to manage academic activities from a single, unified interface.</p>
          <h2 className="text-lg font-semibold text-dark-800 dark:text-dark-100 mt-6">Our Mission</h2>
          <p>To simplify the academic registration process, reduce administrative burden, and provide real-time visibility into course offerings, examination schedules, and registration statistics.</p>
          <h2 className="text-lg font-semibold text-dark-800 dark:text-dark-100 mt-6">Features</h2>
          <ul className="space-y-1 list-disc list-inside">
            <li>Online course registration with credit unit validation</li>
            <li>Real-time examination timetable</li>
            <li>Printable course registration forms</li>
            <li>Multi-role access: students, lecturers, administrators</li>
            <li>Analytics dashboard for administrators</li>
            <li>Dark mode support</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export function ContactPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-dark-900 px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-dark-500 hover:text-dark-700 mb-8"><ArrowLeft size={14} /> Home</Link>
        <h1 className="text-2xl font-bold text-dark-900 dark:text-dark-50 font-display mb-2">Contact Us</h1>
        <p className="text-dark-500 mb-8">Get in touch with the Academic Registry.</p>
        <div className="grid gap-4 mb-8">
          {[
            { icon: Mail, label: 'Email', value: 'registry@lcu.edu.ng' },
            { icon: Phone, label: 'Phone', value: '+234-800-LCU-PORTAL' },
            { icon: MapPin, label: 'Address', value: 'Landmark Christian University, Omu-Aran, Kwara State, Nigeria' },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex items-center gap-4 p-4 card">
              <div className="w-9 h-9 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                <Icon size={16} className="text-primary-600" />
              </div>
              <div>
                <p className="text-xs text-dark-400 font-medium uppercase tracking-wide">{label}</p>
                <p className="text-sm text-dark-800 dark:text-dark-100 font-medium">{value}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="card p-6">
          <h3 className="font-semibold text-dark-800 dark:text-dark-100 mb-4">Send a message</h3>
          <div className="space-y-3">
            <input placeholder="Your name" className="input-field" />
            <input type="email" placeholder="Your email" className="input-field" />
            <textarea placeholder="Your message..." className="input-field" rows={4} />
            <button className="btn-primary">Send Message</button>
          </div>
        </div>
      </div>
    </div>
  );
}
