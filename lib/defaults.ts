import { HeroContent, StatsContent, DoctorContent, ContactContent, Service, Condition, FAQ } from './types'

export const defaultHero: HeroContent = {
  heading: 'Ancient Wisdom, Modern Healing',
  subheading: 'Experience the transformative power of authentic Ayurvedic medicine. Holistic treatments rooted in 5000 years of Vedic science, personalized for your unique constitution.',
  cta1_text: 'Book Appointment',
  cta1_link: '#book-appointment',
  cta2_text: 'Explore Treatments',
  cta2_link: '#services',
}

export const defaultStats: StatsContent = {
  stat1_value: '15+',
  stat1_label: 'Years Experience',
  stat2_value: '8000+',
  stat2_label: 'Patients Treated',
  stat3_value: '40+',
  stat3_label: 'Treatments',
  stat4_value: '4.9/5',
  stat4_label: 'Patient Rating',
}

export const defaultDoctor: DoctorContent = {
  name: 'Dr. Anjali Kumar',
  title: 'Chief Physician & Founder',
  degree: 'BAMS, MD (Ayurveda)',
  bio: 'Dr. Anjali Kumar is a distinguished Ayurvedic physician with over 15 years of clinical experience. She completed her BAMS from Gujarat Ayurved University and pursued her MD specialization in Kayachikitsa (Internal Medicine). Her approach blends classical Ayurvedic principles with contemporary medical understanding, offering truly integrative healthcare.',
  experience: '15+ years of clinical practice',
  specialization: 'Panchakarma, Chronic Disease Management, Women\'s Health',
  photo_url: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=600&q=80',
}

export const defaultContact: ContactContent = {
  address: '42, Ayurveda Lane, Koramangala, Bengaluru – 560034',
  phone: '+91 98765 43210',
  email: 'care@akayurveda.in',
  hours: 'Mon–Sat: 9:00 AM – 7:00 PM',
  facebook_url: 'https://facebook.com',
  instagram_url: 'https://instagram.com',
  twitter_url: 'https://twitter.com',
  youtube_url: 'https://youtube.com',
}

export const defaultServices: Omit<Service, 'id'>[] = [
  { name: 'Panchakarma', description: 'The classical five-action detoxification therapy that purifies the body, restores balance, and rejuvenates the entire system from within.', icon: '🌿', sort_order: 1 },
  { name: 'Abhyanga', description: 'Therapeutic full-body warm oil massage using medicated herbal oils to nourish tissues, improve circulation, and calm the nervous system.', icon: '🫧', sort_order: 2 },
  { name: 'Shirodhara', description: 'A continuous stream of warm medicated oil poured over the forehead — deeply relaxing, relieves mental stress, anxiety, and insomnia.', icon: '💧', sort_order: 3 },
  { name: 'Herbal Medicine', description: 'Personalized classical Ayurvedic formulations and herbal preparations crafted to address your specific health concerns and constitution.', icon: '🌱', sort_order: 4 },
  { name: 'Diet & Nutrition', description: 'Customized Ahara (dietary) guidance based on your Prakriti, season, and health goals — food as medicine.', icon: '🥗', sort_order: 5 },
  { name: 'Yoga & Pranayama', description: 'Therapeutic yoga sequences and breathwork practices designed to complement your Ayurvedic treatment plan.', icon: '🧘', sort_order: 6 },
]

export const defaultConditions: Omit<Condition, 'id'>[] = [
  { name: 'Joint & Arthritis', icon: '🦴', sort_order: 1 },
  { name: 'Digestive Health', icon: '🫁', sort_order: 2 },
  { name: 'Skin Disorders', icon: '✨', sort_order: 3 },
  { name: 'Stress & Anxiety', icon: '🧠', sort_order: 4 },
  { name: 'Respiratory', icon: '💨', sort_order: 5 },
  { name: "Women's Health", icon: '🌸', sort_order: 6 },
]

export const defaultFAQs: Omit<FAQ, 'id'>[] = [
  { question: 'What is Ayurveda?', answer: 'Ayurveda is one of the world\'s oldest holistic healing systems, developed more than 3,000 years ago in India. It is based on the belief that health and wellness depend on a delicate balance between the mind, body, and spirit.', sort_order: 1 },
  { question: 'How long does a treatment session take?', answer: 'Treatment duration varies by therapy. A consultation is typically 45–60 minutes. Panchakarma programs run 7–21 days. Individual therapies like Abhyanga or Shirodhara are usually 60–90 minutes.', sort_order: 2 },
  { question: 'Is Ayurveda safe alongside modern medicine?', answer: 'Yes, Ayurveda can be safely integrated with modern medicine when guided by a qualified practitioner. Always inform both your allopathic and Ayurvedic doctors about all medications you are taking.', sort_order: 3 },
  { question: 'How many sessions will I need?', answer: 'The number of sessions depends on your condition, severity, and constitution. Acute conditions may resolve in 3–5 sessions, while chronic conditions often require 2–3 months of treatment. Dr. Kumar will outline a personalized plan during your consultation.', sort_order: 4 },
  { question: 'Do you offer online consultations?', answer: 'Yes, we offer teleconsultation for initial assessments, follow-ups, and dietary guidance. Hands-on Panchakarma therapies require in-person visits. Contact us to schedule an online session.', sort_order: 5 },
  { question: 'What should I bring to my first appointment?', answer: 'Please bring any previous medical reports, a list of current medications, and wear comfortable clothing. Arrive 10 minutes early to complete intake forms. Avoid heavy meals 2 hours before your appointment.', sort_order: 6 },
]
