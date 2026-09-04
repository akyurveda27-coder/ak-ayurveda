export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { isAdminRequest, unauthorized } from '@/lib/adminAuth'

const SERVICES_DATA = [
  {
    name: 'Ayurvedic Consultation & Personalised Wellness Guidance',
    duration: '60 minutes',
    price_from: '£65',
    hero_image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=1200&q=80',
    benefits: ['Personalised Dosha Assessment', 'Root-Cause Healing', 'Diet & Lifestyle Guidance', 'Herbal Remedy Recommendations', 'Ongoing Wellness Support'],
    benefit_descriptions: [
      'Discover your unique mind-body constitution (Vata, Pitta, or Kapha) through traditional pulse diagnosis and a detailed health questionnaire — the foundation of all personalised care.',
      'Rather than treating symptoms, our Ayurvedic doctor identifies the underlying imbalances driving your health concerns, creating a plan that addresses the source of disharmony.',
      'Receive tailored advice on diet, daily routines (dinacharya), sleep hygiene, and seasonal adjustments that align with your prakriti and current health goals.',
      'Walk away with a curated list of Ayurvedic herbs, oils, and supplements recommended specifically for your constitution and current imbalance — no generic protocols.',
      'Your consultation includes a follow-up plan with clear milestones and check-in guidance, ensuring you stay on track and can adjust your programme as you evolve.'
    ],
    process: ['Health History Review', 'Pulse Diagnosis & Dosha Analysis', 'Personalised Wellness Plan', 'Q&A and Next Steps'],
    process_days: ['0–10 min', '10–30 min', '30–50 min', '50–60 min'],
    process_descriptions: [
      'We begin with a thorough review of your current symptoms, medical history, sleep patterns, digestion, and lifestyle habits to build a complete picture of your health.',
      'Our practitioner takes your Nadi (pulse) and assesses your Prakriti and Vikriti — your natural constitution versus your current state of imbalance — using classical Ayurvedic methods.',
      'A customised wellness plan is discussed, covering dietary recommendations, daily routine adjustments, herbal supplements, and any specific treatments recommended for your condition.',
      'We walk through your plan together, answer all your questions, and set clear, achievable goals with follow-up guidance so you leave feeling confident and empowered.'
    ],
    ideal_for: ['Those new to Ayurveda seeking a holistic health assessment', 'People with chronic or recurring health concerns', 'Anyone seeking preventive wellness and disease management', 'Those wanting natural, plant-based alternatives to conventional medicine'],
    faqs: [
      { q: 'Do I need to prepare anything before my consultation?', a: 'Please arrive with a list of any current medications, supplements, or health concerns. Avoid heavy meals, coffee, or alcohol 2–3 hours before your appointment as these can affect pulse diagnosis.' },
      { q: 'Is this a medical diagnosis?', a: 'Our Ayurvedic consultations are wellness assessments based on traditional principles and are not a substitute for medical diagnosis. We work alongside your GP and other healthcare providers.' },
      { q: 'How often should I have a consultation?', a: 'We recommend an initial consultation followed by a review after 4–6 weeks to assess progress. Ongoing quarterly consultations help maintain balance throughout the year.' },
      { q: 'Can children and elderly patients receive consultations?', a: 'Yes, Ayurvedic consultations are safe for all ages. We tailor our recommendations to the individual — whether child, adult, or senior — with age-appropriate guidance.' }
    ]
  },
  {
    name: 'Abhyanga – Full Body Ayurvedic Massage',
    duration: '60 minutes',
    price_from: '£85',
    hero_image: 'https://images.unsplash.com/photo-1600334129128-685c5582fd35?w=1200&q=80',
    benefits: ['Deep Stress Relief & Relaxation', 'Improved Blood Circulation', 'Nourished, Glowing Skin', 'Gentle Detoxification', 'Balanced Nervous System'],
    benefit_descriptions: [
      'Warm medicated oils penetrate deeply into muscle tissue, dissolving tension and activating the parasympathetic nervous system — leaving you in a profound state of rest and restoration.',
      'The long, flowing strokes of Abhyanga stimulate lymphatic flow and peripheral circulation, delivering oxygen and nutrients to every cell while flushing out metabolic waste.',
      'Sesame, coconut, or specially formulated herbal oils are chosen for your dosha type, deeply moisturising and nourishing the skin, improving texture, tone, and natural radiance.',
      'Abhyanga mobilises ama (toxins) stored in the tissues, moving them into the digestive channel for elimination — especially powerful when combined with a cleansing diet.',
      "Regular Abhyanga is clinically associated with lower cortisol levels, improved sleep quality, and reduced anxiety — building resilience in the body's stress-response system over time."
    ],
    process: ['Dosha Consultation & Oil Selection', 'Warm Oil Application', 'Full Body Massage', 'Rest & Integration'],
    process_days: ['0–5 min', '5–10 min', '10–55 min', '55–60 min'],
    process_descriptions: [
      'A brief assessment determines the ideal medicated herbal oil blend for your constitution and any specific concerns — ensuring the treatment is fully personalised from the start.',
      'Oils are gently warmed to body temperature and applied along the energy channels (srotas) of the body to prepare the tissues and begin the therapeutic process.',
      'Your therapist uses traditional Abhyanga strokes — long, rhythmic movements toward the heart interspersed with circular joint massage — covering the entire body systematically.',
      'You rest quietly on the table for 5 minutes after the massage, allowing the oils and treatment to integrate. A warm towel wrap is applied before you rise slowly.'
    ],
    ideal_for: ['Stress, anxiety, and burnout', 'Dry skin, fatigue, and depleted energy (Vata imbalance)', 'Muscle tension and joint stiffness', 'Anyone seeking deep relaxation and nervous system restoration'],
    faqs: [
      { q: 'What oil is used during Abhyanga?', a: 'We use dosha-specific herbal oils — typically sesame-based for Vata, coconut or sunflower for Pitta, and mustard or light herbal oils for Kapha. The exact blend is chosen based on your consultation.' },
      { q: 'Should I shower before or after my treatment?', a: 'We recommend a warm shower before your appointment. After treatment, we advise waiting at least 1–2 hours before showering to allow the oils to absorb fully into the skin.' },
      { q: 'How often should I receive Abhyanga?', a: 'For therapeutic benefits, once a week is ideal. For general maintenance and relaxation, every 2–4 weeks is excellent. Daily self-Abhyanga at home is also encouraged between sessions.' },
      { q: 'Is Abhyanga safe during pregnancy?', a: 'Abhyanga can be adapted safely during pregnancy but certain pressure points and oils are avoided. Please inform us at booking so we can make appropriate modifications.' }
    ]
  },
  {
    name: 'Abhyanga with Kizhi – Full Body Massage with Hot Herbal Bundles',
    duration: '90 minutes',
    price_from: '£105',
    hero_image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=1200&q=80',
    benefits: ['Powerful Pain Relief', 'Reduced Joint Inflammation', 'Deep Muscle Relaxation', 'Enhanced Detoxification', 'Improved Mobility & Flexibility'],
    benefit_descriptions: [
      'The heat and herbal compounds in the Kizhi bundles penetrate deeply into muscle and joint tissue, providing significant relief from chronic and acute pain.',
      'Specially selected anti-inflammatory herbs such as Dashamoola and Rasnadi reduce swelling and stiffness in joints affected by arthritis or overuse.',
      'Combining the oil-based Abhyanga with the heat of the Kizhi bundles creates a profound dual effect — muscles surrender tension at a level that massage alone cannot achieve.',
      'The herbal steam released from Kizhi bundles opens skin pores, allowing medicated oils to penetrate deeper tissues while drawing out accumulated toxins.',
      'Regular Kizhi treatments noticeably improve range of motion, ease of movement, and overall flexibility.'
    ],
    process: ['Consultation & Oil Preparation', 'Abhyanga Full Body Massage', 'Kizhi Bundle Application', 'Cool Down & Integration'],
    process_days: ['0–10 min', '10–50 min', '50–80 min', '80–90 min'],
    process_descriptions: [
      'We assess your current pain points, constitution, and health status to prepare the appropriate herbal bundle composition and warm medicated oil for your session.',
      'The session begins with a full-body Abhyanga massage using warm herbal oils, preparing the muscles and tissues to receive the deeper benefit of the Kizhi treatment.',
      'Freshly prepared linen bundles filled with Ayurvedic herbs are heated in warm oil and applied rhythmically across the body — alternating between two bundles to maintain consistent warmth.',
      'The session concludes with a rest period, allowing your body to integrate the heat, herbs, and oils. You will be offered a light herbal tea to support the detoxification process.'
    ],
    ideal_for: ['Chronic back, neck, and shoulder pain', 'Arthritis, rheumatism, and joint inflammation', 'Post-workout muscle soreness and sports recovery', 'Those who find conventional massage insufficiently deep'],
    faqs: [
      { q: 'What herbs are inside the Kizhi bundles?', a: 'Our Kizhi bundles typically contain Dashamoola, Rasnadi herbs, eucalyptus, and other anti-inflammatory botanicals selected based on your dosha and presenting condition.' },
      { q: 'Is the heat from the bundles uncomfortable?', a: 'The heat is kept at a therapeutic but comfortable level. Your therapist will check the temperature throughout and adjust accordingly. Most clients find the warmth deeply soothing.' },
      { q: 'How many sessions do I need?', a: 'For chronic pain or inflammation, we recommend a course of 5–7 sessions over 2–3 weeks for best results. Single sessions provide immediate relief but a course creates lasting change.' }
    ]
  },
  {
    name: 'Abhyanga with Kati Vasti – Full Body Massage with Lower Back Therapy',
    duration: '90 minutes',
    price_from: '£110',
    hero_image: 'https://images.unsplash.com/photo-1600334129128-685c5582fd35?w=1200&q=80',
    benefits: ['Targeted Lower Back Pain Relief', 'Spinal Disc Nourishment', 'Reduced Sciatic Nerve Pain', 'Strengthened Lumbar Muscles', 'Full Body Relaxation'],
    benefit_descriptions: [
      'Kati Vasti creates a warm medicated oil well directly over the lumbar spine, delivering sustained heat and herbal therapy to the exact site of pain.',
      'The warm oil retained in the Kati Vasti dam deeply nourishes the intervertebral discs and surrounding ligaments, addressing dryness and degeneration behind chronic back problems.',
      'The combination of heat, oil, and herbal compounds reduces inflammation around the sciatic nerve root, providing significant relief from radiating leg pain and numbness.',
      'Kati Vasti coupled with Abhyanga re-activates the deep stabilising muscles of the lumbar region, improving posture and reducing the risk of recurrent back injury.',
      'The full-body Abhyanga component ensures deep systemic relaxation, reducing muscular guarding and compensatory tension accompanying lower back conditions.'
    ],
    process: ['Assessment & Preparation', 'Full Body Abhyanga', 'Kati Vasti Therapy', 'Gentle Stretching & Rest'],
    process_days: ['0–10 min', '10–45 min', '45–80 min', '80–90 min'],
    process_descriptions: [
      'A focused assessment of your lower back condition, pain patterns, and any recent imaging or physiotherapy notes. We select the most appropriate medicated oil for your presentation.',
      'The session opens with a thorough full-body Abhyanga massage, loosening the entire musculoskeletal system before we focus on the lumbar area.',
      'A dough dam made from black gram flour is formed on the lower back, filled with warm medicated oil (Ksheerabala, Mahanarayan, or Dhanwantharam oils), and maintained for 25–30 minutes.',
      'The session closes with gentle guided stretches appropriate for your condition, followed by a rest period before you slowly rise.'
    ],
    ideal_for: ['Chronic lower back pain and lumbar stiffness', 'Disc bulge, prolapse, or degenerative disc disease', 'Sciatica and radiating leg pain', 'Those recovering from back surgery or injury'],
    faqs: [
      { q: 'Is Kati Vasti safe if I have a disc herniation?', a: 'Kati Vasti is generally beneficial for disc conditions; however, we require details of your diagnosis before proceeding. Acute disc herniations with severe neurological symptoms require medical clearance first.' },
      { q: 'How warm is the oil retained on the back?', a: 'The oil is maintained at a comfortably warm temperature — typically 38–42°C. Your therapist will monitor and refresh the oil as needed to maintain consistent therapeutic warmth throughout.' },
      { q: 'How many sessions are recommended?', a: 'For chronic conditions, a course of 7–14 sessions is traditional. Many clients notice significant improvement within the first 3–5 sessions.' }
    ]
  },
  {
    name: 'Abhyanga with Janu Vasti – Full Body Massage with Knee Therapy',
    duration: '90 minutes',
    price_from: '£110',
    hero_image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1200&q=80',
    benefits: ['Knee Pain Relief', 'Cartilage & Synovial Nourishment', 'Reduced Knee Inflammation', 'Improved Joint Mobility', 'Full Body Relaxation'],
    benefit_descriptions: [
      'Warm medicated oil retained over the knee joint delivers deep therapeutic heat and herbal compounds directly to the site of pain and degeneration.',
      'Specialised oils such as Ksheerabala nourish the cartilage and synovial membrane, addressing the root cause of knee deterioration at a tissue level.',
      'The anti-inflammatory herbs in Janu Vasti oil reduce swelling, heat, and redness around the knee joint, making it beneficial for osteoarthritis and sports injuries.',
      'Regular Janu Vasti treatments increase the range of motion in the knee joint, reducing stiffness and allowing for more comfortable daily movement and exercise.',
      'The accompanying Abhyanga massage promotes full-body relaxation and reduces the compensatory tension in hips, thighs, and calves that often accompanies chronic knee conditions.'
    ],
    process: ['Knee Assessment', 'Full Body Abhyanga', 'Janu Vasti Oil Therapy', 'Cool Down & Guidance'],
    process_days: ['0–10 min', '10–45 min', '45–80 min', '80–90 min'],
    process_descriptions: [
      'We assess your knee condition, range of motion, and history of injury or surgery to select the most appropriate medicated oil and ensure safe treatment delivery.',
      'A full-body Abhyanga massage reduces overall muscle tension and improves circulation before the focused knee therapy begins.',
      'A flour dam is formed around the knee and filled with warm medicated oil, held for 20–25 minutes. The warmth and herbs work deeply into the joint capsule and surrounding tissues.',
      'We conclude with gentle mobility guidance and advice on home care between sessions, including recommended self-massage techniques.'
    ],
    ideal_for: ['Osteoarthritis and knee degeneration', 'Sports injuries and ligament damage', 'Post-operative knee recovery', 'Chronic knee stiffness and reduced mobility'],
    faqs: [
      { q: 'Can Janu Vasti be done on both knees simultaneously?', a: 'Yes, we can treat both knees in one session if required. This may extend the treatment duration slightly and we will advise accordingly.' },
      { q: 'Is this treatment suitable after knee replacement?', a: 'Janu Vasti can be beneficial after knee replacement surgery once the wound has fully healed (typically 3+ months post-op). Medical clearance is required before proceeding.' }
    ]
  },
  {
    name: 'Abhyanga with Greeva Vasti – Full Body Massage with Neck & Upper Back Therapy',
    duration: '90 minutes',
    price_from: '£110',
    hero_image: 'https://images.unsplash.com/photo-1600334129128-685c5582fd35?w=1200&q=80',
    benefits: ['Neck & Shoulder Pain Relief', 'Cervical Disc Nourishment', 'Headache & Migraine Reduction', 'Improved Posture', 'Deep Upper Body Relaxation'],
    benefit_descriptions: [
      'Greeva Vasti delivers a sustained column of warm medicated oil directly over the cervical vertebrae, penetrating deeply to relieve chronic neck stiffness and pain.',
      'The herbal oils nourish the intervertebral discs and surrounding soft tissue of the cervical spine, addressing the root cause of neck-related headaches and referred arm pain.',
      'By reducing cervical muscle spasm and improving blood flow to the upper body, Greeva Vasti is highly effective in reducing tension headaches and certain forms of migraine.',
      'Regular treatments correct the forward head posture and rounded shoulders that result from desk work, screen time, and accumulated stress — reshaping your postural habits from within.',
      'The accompanying Abhyanga covers the full body, melting the deep-seated tension in the trapezius, rhomboids, and shoulder girdle that reinforces cervical problems.'
    ],
    process: ['Cervical Assessment', 'Full Body Abhyanga', 'Greeva Vasti Oil Therapy', 'Neck Mobility Work & Rest'],
    process_days: ['0–10 min', '10–45 min', '45–80 min', '80–90 min'],
    process_descriptions: [
      'We assess your neck mobility, pain referral patterns, and any history of cervical disc issues or whiplash before selecting the appropriate medicated oil.',
      'A thorough full-body Abhyanga massage begins the session, releasing the broader patterns of tension that feed into cervical dysfunction.',
      'A flour dam is formed around the base of the neck and filled with warm medicated oil (Ksheerabala, Murivenna, or Balashwagandhadi), held for 20–25 minutes.',
      'Gentle guided neck mobility exercises close the session, followed by a rest period. Home care advice on ergonomics and self-massage is provided.'
    ],
    ideal_for: ['Chronic neck and shoulder pain', 'Cervical spondylosis and disc issues', 'Tension headaches and office-related strain', 'Those with forward head posture from screen use'],
    faqs: [
      { q: 'Can this help with cervical spondylosis?', a: 'Yes, Greeva Vasti is one of the primary Ayurvedic treatments for cervical spondylosis. A course of treatments alongside dietary and lifestyle modifications can significantly reduce pain and improve mobility.' },
      { q: 'Is it safe if I have had cervical surgery?', a: "Post-surgical treatment requires full medical clearance and we will work with your surgical team's guidelines. We can often still perform the Abhyanga component while modifying or omitting the Vasti." }
    ]
  },
  {
    name: 'Shirodhara – Ayurvedic Oil Flow Therapy',
    duration: '60 minutes',
    price_from: '£95',
    hero_image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=1200&q=80',
    benefits: ['Profound Mental Calm', 'Improved Sleep Quality', 'Reduced Anxiety & Overthinking', 'Hormonal Balance', 'Nervous System Restoration'],
    benefit_descriptions: [
      'The steady, warm stream of oil on the forehead activates the ajna (third eye) marma point and the prefrontal cortex, inducing a state of deep meditative calm within minutes.',
      'Shirodhara is clinically studied for its effect on sleep — regular treatments significantly improve sleep onset, duration, and quality by calming the hyperactive nervous system.',
      'The rhythmic, uninterrupted oil flow quiets the vata in the mind — reducing mental chatter, restlessness, and the racing thoughts that characterise anxiety and stress disorders.',
      'Shirodhara supports endocrine balance by reducing cortisol and regulating neurotransmitter activity — beneficial for hormonal fluctuations in menopause, PMS, and thyroid conditions.',
      'The treatment is deeply restorative for the entire nervous system, rebuilding depleted ojas (vital essence) and improving cognitive clarity, focus, and emotional resilience.'
    ],
    process: ['Head & Scalp Preparation', 'Oil Calibration', 'Shirodhara Flow Therapy', 'Silent Rest'],
    process_days: ['0–10 min', '10–15 min', '15–50 min', '50–60 min'],
    process_descriptions: [
      'A brief scalp massage with warm oil prepares the head and neck, opens the channels, and begins to calm the nervous system before the main therapy commences.',
      'The medicated oil (Brahmi, Ksheerabala, or plain sesame oil) is warmed to the precise temperature and the Shirodhara vessel is adjusted to the correct height and flow rate.',
      'Warm oil flows in an unbroken stream from the copper vessel onto the centre of the forehead (ajna marma), oscillating gently from side to side for 35–40 minutes.',
      'After the oil flow concludes, you remain lying in silence for 10 minutes in a state of deep stillness. You are gently guided back to wakefulness before sitting up slowly.'
    ],
    ideal_for: ['Insomnia and sleep disorders', 'Anxiety, stress, and mental exhaustion', 'PTSD and emotional trauma', 'Burnout, adrenal fatigue, and chronic overwhelm'],
    faqs: [
      { q: 'What does Shirodhara feel like?', a: 'Most clients describe an immediate sense of profound peace — as though the mind switches off. Many enter a deeply meditative or sleep-like state within the first 5 minutes of the oil flow.' },
      { q: 'Will my hair be very oily afterwards?', a: 'Yes — your hair will be saturated with oil after the treatment. We recommend wearing old clothes and arranging to wash your hair a few hours later (not immediately — allow the oil to absorb). We provide a hair wrap.' },
      { q: 'How many sessions do I need?', a: 'A single session is deeply beneficial. For chronic insomnia or anxiety, a course of 7–10 consecutive sessions delivers the most lasting results. Many clients also enjoy monthly maintenance sessions.' },
      { q: 'Is Shirodhara safe for everyone?', a: 'Shirodhara is contraindicated in the first trimester of pregnancy, active fever, open scalp wounds, and certain psychiatric conditions. Please disclose your full health history when booking.' }
    ]
  },
  {
    name: 'Udvartana – Ayurvedic Herbal Powder Massage',
    duration: '60 minutes',
    price_from: '£85',
    hero_image: 'https://images.unsplash.com/photo-1559181567-c3190bfbf9be?w=1200&q=80',
    benefits: ['Skin Exfoliation & Renewal', 'Lymphatic Stimulation', 'Weight & Inch Management', 'Cellulite Reduction', 'Energising & Invigorating'],
    benefit_descriptions: [
      'The dry herbal powder (churna) creates gentle friction that exfoliates dead skin cells, unclogs pores, and reveals fresher, smoother skin — leaving you with a visible post-treatment glow.',
      "Unlike oil-based massages, Udvartana's dry friction technique directly stimulates the lymphatic system, encouraging drainage and reducing fluid retention and puffiness.",
      'Udvartana is traditionally prescribed as part of Ayurvedic weight management, using specific herbs to stimulate metabolism, break down subcutaneous fat deposits, and improve body composition.',
      'The mechanical action of the herbal powder combined with warming spices like ginger and pepper helps break down cellulite deposits and improve the texture of the skin over the affected areas.',
      'Udvartana is uniquely stimulating — unlike most Ayurvedic treatments, it increases rather than decreases energy, making it excellent for Kapha types or anyone feeling sluggish and heavy.'
    ],
    process: ['Consultation & Churna Preparation', 'Dry Powder Application', 'Friction Massage', 'Steam & Cleanse'],
    process_days: ['0–10 min', '10–20 min', '20–50 min', '50–60 min'],
    process_descriptions: [
      'A brief consultation determines your dosha and specific goals. The appropriate herbal churna is prepared — typically containing triphala, ginger, turmeric, and other metabolic herbs.',
      'Warm herbal powder is applied to the body in upward strokes, opposite to the direction of hair growth, beginning from the feet and working systematically upward.',
      'Vigorous circular and friction-based strokes work the powder deep into the skin, stimulating circulation, lymphatic flow, and the breakdown of fat deposits.',
      'The session concludes with a herbal steam (swedana) to open pores and allow any remaining herbal compounds to absorb, followed by a gentle cleanse and moisturising application.'
    ],
    ideal_for: ['Weight management and body toning', 'Oily or congested skin', 'Kapha imbalance — sluggishness, heaviness, fluid retention', 'Those wanting an energising alternative to relaxation massage'],
    faqs: [
      { q: 'Is Udvartana messy?', a: 'The herbal powder can be quite messy! We use a private treatment room with full containment. You will be thoroughly cleansed after the treatment so there is no need to worry.' },
      { q: 'Will it be too abrasive for sensitive skin?', a: 'The powder is finely milled and the pressure adjusted to your comfort level. We can use a lighter technique for sensitive skin types and avoid any areas of active irritation.' },
      { q: 'How many sessions for visible weight management results?', a: 'Best results are seen with a course of 7–14 sessions combined with dietary changes. Individual sessions improve skin tone and energy immediately.' }
    ]
  },
  {
    name: 'Back Massage',
    duration: '30 minutes',
    price_from: '£45',
    hero_image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=1200&q=80',
    benefits: ['Back Pain Relief', 'Improved Posture', 'Muscle Tension Release', 'Stress Reduction', 'Improved Circulation'],
    benefit_descriptions: [
      'Targeted massage of the back muscles releases deep-seated knots and tension, providing significant relief from acute and chronic back pain.',
      'Regular back massage reduces muscular imbalances that pull the spine out of alignment, gradually improving postural habits and reducing the risk of injury.',
      'The therapist works methodically through the superficial and deep layers of back musculature, releasing trigger points and restoring normal muscle length and function.',
      'Even a 30-minute back massage significantly reduces cortisol levels and activates the relaxation response — having a whole-body calming effect beyond just the back.',
      'Massage stimulates local blood flow, delivering oxygen and nutrients to tired muscles and accelerating the removal of metabolic waste products that cause soreness.'
    ],
    process: ['Brief Consultation', 'Warm Oil Application', 'Back Massage', 'Rest'],
    process_days: ['0–2 min', '2–5 min', '5–28 min', '28–30 min'],
    process_descriptions: [
      'We briefly discuss any specific areas of tension, pain, or sensitivity before beginning the treatment.',
      'Warm herbal oil appropriate for your skin type is applied to the back to reduce friction and begin warming the muscles.',
      'A thorough massage covers the entire back — from the base of the skull to the sacrum — using a combination of effleurage, petrissage, and targeted pressure point work.',
      'A warm towel is applied to the back and you rest for 2 minutes before concluding your session.'
    ],
    ideal_for: ['Office workers and desk-based professionals', 'Those with upper or lower back tension', 'Anyone seeking a quick, targeted treatment', 'Between full-body sessions'],
    faqs: [
      { q: 'Does this include the neck and shoulders?', a: 'Yes — our back massage includes the neck, shoulders, and the full back from the cranial base to the sacrum for a thorough release.' },
      { q: 'Can I book this as an add-on to another treatment?', a: 'Absolutely. The back massage is frequently added to Shirodhara or facial treatments for a more complete session.' }
    ]
  },
  {
    name: 'Leg Massage',
    duration: '30 minutes',
    price_from: '£45',
    hero_image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1200&q=80',
    benefits: ['Reduced Leg Fatigue', 'Improved Circulation', 'Reduced Swelling', 'Muscle Recovery', 'Improved Sleep'],
    benefit_descriptions: [
      'Focused massage of the lower limbs drains accumulated lactic acid and fluid, dramatically reducing the heaviness and fatigue that comes from prolonged standing or sitting.',
      'Upward strokes along the leg compress and then release the venous and lymphatic vessels, actively pumping stagnant fluid back toward the heart.',
      'Particularly beneficial for those prone to leg swelling (oedema), the massage reduces water retention and the sensation of tight, puffy legs by end of day.',
      'Athletes and active individuals benefit from post-exercise leg massage that accelerates glycogen restoration and reduces DOMS (delayed-onset muscle soreness).',
      'Addressing the marma points of the lower limbs in Ayurvedic leg massage is known to promote deeper, more restorative sleep — especially for restless leg sufferers.'
    ],
    process: ['Brief Consultation', 'Warm Oil Application', 'Leg Massage', 'Elevation & Rest'],
    process_days: ['0–2 min', '2–5 min', '5–27 min', '27–30 min'],
    process_descriptions: [
      'We briefly assess any areas of concern, swelling, or sensitivity before beginning the leg massage.',
      'Warm herbal oil is applied from feet to hips, beginning the warming process and preparing the tissues for therapeutic massage.',
      'Systematic massage covers the feet, calves, knees, and thighs — combining long draining strokes with targeted muscle work and gentle joint mobilisation.',
      'The legs are briefly elevated and wrapped in a warm towel for 3 minutes to maximise the lymphatic drainage benefit before you conclude your session.'
    ],
    ideal_for: ['Those who stand for long hours', 'Travellers with leg stiffness from flights', 'Athletes in recovery', 'Anyone with tired, swollen, or heavy legs'],
    faqs: [
      { q: 'Is this suitable if I have varicose veins?', a: 'Light leg massage can be beneficial for mild varicose veins, but we avoid direct pressure on varicosed areas. Please inform us at booking so we can adapt our technique accordingly.' }
    ]
  },
  {
    name: 'Indian Head Massage',
    duration: '45 minutes',
    price_from: '£55',
    hero_image: 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=1200&q=80',
    benefits: ['Scalp Stimulation & Hair Health', 'Headache Relief', 'Mental Clarity', 'Neck & Shoulder Release', 'Deep Relaxation'],
    benefit_descriptions: [
      'Massage stimulates blood flow to the scalp and hair follicles, nourishing the roots and supporting healthy hair growth — a cornerstone of Ayurvedic hair care tradition.',
      'By releasing the scalp, occipital muscles, and cervical fascia, Indian head massage provides rapid, effective relief from tension headaches without medication.',
      'The treatment stimulates key marma points on the head that are directly associated with mental clarity, concentration, and the clearing of mental fog.',
      'The neck and shoulder component of the treatment targets the most common sites of office-related tension — the trapezius, levator scapulae, and sternocleidomastoid muscles.',
      "Clients commonly report an altered state of consciousness during the treatment — a floating, deeply meditative sensation — due to the treatment's action on the nervous system."
    ],
    process: ['Scalp & Hair Assessment', 'Shoulder & Neck Work', 'Scalp Massage', 'Face & Marma Work'],
    process_days: ['0–5 min', '5–20 min', '20–35 min', '35–45 min'],
    process_descriptions: [
      'A brief assessment of your scalp condition, hair type, and any headache or neck pain concerns guides the treatment approach and oil selection.',
      'The session begins at the shoulders and upper back, systematically releasing the major muscle groups before moving to the neck and base of skull.',
      'Medicated oil is applied to the scalp and massaged in using circular friction, linear strokes, and gentle pressure on specific marma points from crown to hairline.',
      'The final phase works the face — temples, forehead, jaw, and sinus areas — stimulating the energy points (marmas) of the head for a complete upper body experience.'
    ],
    ideal_for: ['Tension headaches and migraines', 'Stress, anxiety, and mental fatigue', 'Dry scalp or hair loss', 'Those wanting relaxation without undressing fully'],
    faqs: [
      { q: 'Will oil be applied to my hair?', a: "Yes — warm medicated oil is applied to the scalp and massaged in. This is integral to the treatment's therapeutic benefit. We recommend allowing the oil to absorb for a few hours before washing." },
      { q: 'Do I need to undress for this treatment?', a: 'No — you remain fully dressed for the Indian Head Massage. Only the upper back, neck, and head are treated, all accessible through or above clothing.' }
    ]
  },
  {
    name: 'Indian Foot Massage',
    duration: '45 minutes',
    price_from: '£55',
    hero_image: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=1200&q=80',
    benefits: ['Whole-Body Energy Restoration', 'Improved Sleep', 'Reduced Foot Pain', 'Stimulated Organ Systems', 'Deep Relaxation'],
    benefit_descriptions: [
      'The feet contain over 72,000 nerve endings and numerous marma (vital energy) points connected to every organ system. Foot massage activates these pathways for whole-body benefit.',
      'Stimulation of the sleep-related marma points in the sole of the foot — particularly Talahridaya — is a traditional remedy for insomnia and restless sleep.',
      'Plantar fasciitis, heel pain, and metatarsal discomfort respond well to the targeted pressure and stretching techniques used in Ayurvedic foot massage.',
      'Foot massage stimulates the reflex zones corresponding to the digestive organs, supporting better digestion, reduced bloating, and improved elimination.',
      'Patients with peripheral neuropathy report significant reduction in symptoms including tingling, numbness, and burning sensations after a course of Ayurvedic foot massage.'
    ],
    process: ['Foot Bath & Assessment', 'Warm Oil Application', 'Foot & Calf Massage', 'Marma Point Therapy'],
    process_days: ['0–5 min', '5–10 min', '10–35 min', '35–45 min'],
    process_descriptions: [
      'The session begins with a warm herbal foot bath to soften tissues, cleanse the feet, and begin the relaxation process — a grounding and nourishing ritual.',
      'Warm sesame or bhringaraj oil is applied to the feet and lower legs, preparing the tissues for deeper work.',
      'The feet are massaged systematically — sole, heel, arch, toes, ankle, and calf — using both relaxing strokes and specific pressure techniques to address the reflex zones.',
      'The final phase applies precise pressure to the key marma points of the foot (Talahridaya, Kshipra, Kurcha) for their systemic therapeutic effects on organs and energy flow.'
    ],
    ideal_for: ['Insomnia and disturbed sleep', 'Diabetes-related foot care (non-ulcerated)', 'Plantar fasciitis and foot pain', 'Those seeking whole-body benefits through the feet'],
    faqs: [
      { q: 'Is foot massage safe for diabetics?', a: 'Gentle foot massage without vigorous pressure is generally safe and beneficial for well-controlled diabetics without active ulcers or neuropathy complications. Please consult your GP and inform us of your condition.' }
    ]
  },
  {
    name: 'Ayurvedic Herbal Facial',
    duration: '60 minutes',
    price_from: '£75',
    hero_image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=1200&q=80',
    benefits: ['Natural Skin Radiance', 'Deep Pore Cleansing', 'Anti-Ageing Effects', 'Improved Skin Tone', 'Stress-Relieving Facial Massage'],
    benefit_descriptions: [
      'Our Ayurvedic facial uses traditional herbs and plant-based formulations tailored to your skin type — promoting natural luminosity without harsh chemicals or synthetic ingredients.',
      'Herbal steam, clay-based cleansers, and botanical exfoliants work to deeply cleanse pores, remove impurities, and prevent congestion and breakouts.',
      'Ingredients such as saffron, turmeric, ashwagandha, and manjistha stimulate collagen synthesis and cellular renewal — visibly reducing fine lines and improving skin elasticity.',
      'Customised herbal preparations address uneven skin tone, hyperpigmentation, and dark spots using traditional Ayurvedic brightening botanicals with a proven track record.',
      'The facial massage component stimulates the lymphatic drainage of the face, reduces puffiness, and lifts and tones the facial muscles — a natural, non-invasive approach to facial rejuvenation.'
    ],
    process: ['Skin Assessment & Cleanse', 'Herbal Steam', 'Facial Massage & Mask', 'Toning & Moisturising'],
    process_days: ['0–10 min', '10–20 min', '20–50 min', '50–60 min'],
    process_descriptions: [
      'We assess your skin type, current concerns, and sensitivities before selecting the appropriate herbal formulations. A gentle botanical cleanser removes impurities and makeup.',
      'Medicated herbal steam opens the pores and softens the skin, preparing it to receive maximum benefit from the mask and massage that follow.',
      'A dosha-specific facial massage using warm facial oil is followed by application of a freshly prepared herbal mask — left on for 15 minutes to work its therapeutic effects.',
      "The mask is removed with warm towels, a botanical toner is applied to balance the skin's pH, and a light Ayurvedic moisturiser seals in the treatment's benefits."
    ],
    ideal_for: ['Dull, fatigued, or stressed skin', 'Ageing concerns and loss of elasticity', 'Oily, congested, or acne-prone skin (Pitta/Kapha)', 'Those seeking natural, chemical-free skincare'],
    faqs: [
      { q: 'Are the products used natural and organic?', a: 'Yes — we use certified natural and organic Ayurvedic preparations wherever possible, free from synthetic fragrances, parabens, and sulphates.' },
      { q: 'Can this help with acne?', a: 'Our Ayurvedic facial is highly effective for acne-prone skin when combined with dietary and lifestyle adjustments. Herbs like neem, turmeric, and manjistha have proven antibacterial and anti-inflammatory properties.' }
    ]
  },
  {
    name: 'Ayurvedic Herbal Face Mask',
    duration: '30 minutes',
    price_from: '£45',
    hero_image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=1200&q=80',
    benefits: ['Instant Skin Glow', 'Deep Cleansing', 'Soothing & Calming', 'Hydration Boost', 'Natural Radiance'],
    benefit_descriptions: [
      'A freshly prepared herbal mask delivers an immediate visible improvement in skin luminosity and texture — a perfect pre-event or regular maintenance treatment.',
      'Herbal clays, botanical powders, and plant extracts draw out impurities, excess oil, and environmental pollutants from within the pores.',
      'Cooling botanicals such as rose, sandalwood, and aloe calm redness, irritation, and inflammation — making this an excellent treatment for sensitive or reactive skin.',
      "Hydrating herbs and plant-based humectants infuse moisture into the skin's layers, plumping fine lines and restoring suppleness and softness.",
      'The combination of traditional Ayurvedic botanicals creates a synergistic brightening effect — visibly improving complexion clarity in just one treatment.'
    ],
    process: ['Cleanse', 'Exfoliation', 'Mask Application', 'Tone & Moisturise'],
    process_days: ['0–5 min', '5–10 min', '10–22 min', '22–30 min'],
    process_descriptions: [
      'A gentle botanical cleanser removes surface impurities and prepares the skin for the active ingredients in the mask.',
      'A light herbal scrub removes dead skin cells and maximises mask penetration — adapted to be gentle for sensitive skin types.',
      'A freshly mixed herbal mask is applied evenly across the face and neck, left for 12 minutes while you rest and relax.',
      'The mask is removed, a herbal toner is applied, and a light moisturiser completes the treatment, leaving skin balanced and radiant.'
    ],
    ideal_for: ['Quick glow before events', 'Sensitive or reactive skin', 'Add-on to other treatments', 'Lunchtime skin refresh'],
    faqs: [
      { q: 'Is this suitable as a standalone treatment?', a: 'Absolutely. The Herbal Face Mask is a complete 30-minute standalone treatment or can be combined with the Back Massage, Indian Head Massage, or other compatible treatments.' }
    ]
  },
  {
    name: 'Deep Tissue & Sports Massage',
    duration: '60 minutes',
    price_from: '£80',
    hero_image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=1200&q=80',
    benefits: ['Chronic Pain Relief', 'Improved Athletic Performance', 'Injury Recovery', 'Postural Correction', 'Scar Tissue Breakdown'],
    benefit_descriptions: [
      'Deep tissue techniques work through the superficial fascia to address the underlying muscle bellies and connective tissue where chronic pain and tension patterns are stored.',
      'Pre-event sports massage warms tissues, improves neuromuscular activation, and prepares the body for peak performance — reducing injury risk significantly.',
      'Post-event and recovery massage accelerates the healing of micro-tears, reduces DOMS, and restores optimal muscle length and function after intense training.',
      'Systematic deep tissue work lengthens shortened muscles, releases fascial adhesions, and restores normal joint mechanics — addressing the musculoskeletal causes of poor posture.',
      'Deep transverse friction techniques break down scar tissue and adhesions from old injuries, restoring normal tissue mobility and reducing pain from chronic scar-related restrictions.'
    ],
    process: ['Movement Assessment', 'Warm-Up Techniques', 'Deep Tissue Work', 'Stretching & Cool Down'],
    process_days: ['0–5 min', '5–15 min', '15–50 min', '50–60 min'],
    process_descriptions: [
      'A brief postural and movement assessment identifies the key areas of restriction, compensation patterns, and priorities for the session.',
      'Superficial warming techniques prepare the tissues before deeper pressure is applied — essential for safety and effectiveness.',
      'Slow, focused deep tissue strokes address the specific muscle groups and fascial planes identified in the assessment, working at a depth tailored to your comfort.',
      'Assisted stretching and myofascial release techniques complete the session, integrating the deep work and restoring normal range of motion.'
    ],
    ideal_for: ['Athletes and regular gym-goers', 'Chronic muscular pain and trigger points', 'Post-injury rehabilitation', 'Office workers with postural pain'],
    faqs: [
      { q: 'Will deep tissue massage be painful?', a: 'Deep tissue work involves therapeutic discomfort but should never be sharply painful. We work within your tolerance, using the principle of "good pain" — a sensation of pressure and release rather than sharp or burning pain.' },
      { q: 'Should I exercise after a deep tissue massage?', a: 'We recommend resting for 24 hours after a deep tissue session. Light walking is fine; intense exercise should be avoided to allow the tissue changes to consolidate.' }
    ]
  },
  {
    name: 'Stress Management & Relaxation Therapy',
    duration: '75 minutes',
    price_from: '£90',
    hero_image: 'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?w=1200&q=80',
    benefits: ['Deep Stress Relief', 'Nervous System Reset', 'Emotional Balance', 'Improved Sleep', 'Mental Clarity'],
    benefit_descriptions: [
      'A carefully sequenced combination of Ayurvedic techniques creates a cumulative relaxation response — shifting the nervous system from sympathetic dominance to parasympathetic rest.',
      'The session is designed to interrupt the stress cycle at multiple levels — physical, mental, and energetic — providing a comprehensive reset that persists well beyond the treatment.',
      "Specific marma point therapy activates the body's own emotional processing centres, facilitating a gentle release of stored stress, grief, or anxiety held in the tissues.",
      'The deeply calming effects of the combined treatment carry through into the night — most clients report noticeably improved sleep quality following their session.',
      'By clearing the fog of accumulated stress, clients consistently report improved decision-making, creativity, and cognitive sharpness in the days following a session.'
    ],
    process: ['Wellness Consultation', 'Abhyanga Massage', 'Shirodhara or Marma Work', 'Guided Breathwork & Rest'],
    process_days: ['0–10 min', '10–40 min', '40–65 min', '65–75 min'],
    process_descriptions: [
      'An in-depth consultation explores your stress triggers, sleep quality, emotional state, and current lifestyle to customise the treatment sequence for maximum therapeutic impact.',
      'A calming full-body Abhyanga massage with stress-specific medicated oils (Brahmi, Ashwagandha, Bala) begins the deep physical relaxation process.',
      'A 20-minute Shirodhara or targeted marma point therapy is applied to address the mental and energetic dimension of stress — inducing a state of deep meditative calm.',
      'The session closes with a 10-minute guided pranayama (breathwork) practice tailored to your nervous system type, extending the relaxation benefit after you leave.'
    ],
    ideal_for: ['Corporate burnout and overwhelm', 'Anxiety, worry, and mental exhaustion', 'Those going through major life transitions', 'High-performers seeking sustainable recovery'],
    faqs: [
      { q: 'How is this different from a regular relaxation massage?', a: 'This session combines multiple Ayurvedic modalities — massage, Shirodhara, marma therapy, and breathwork — in a sequence specifically designed to address the root causes of stress rather than just providing temporary relaxation.' },
      { q: 'How often should I have this treatment?', a: 'For acute stress or burnout, weekly sessions for 4–6 weeks are recommended. For ongoing maintenance of mental wellbeing, monthly sessions are ideal.' }
    ]
  },
  {
    name: 'Ayurvedic Weight Management & Wellness Therapy',
    duration: '90 minutes',
    price_from: '£95',
    hero_image: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=1200&q=80',
    benefits: ['Metabolic Stimulation', 'Reduced Water Retention', 'Digestive Support', 'Improved Body Composition', 'Sustainable Wellness Habits'],
    benefit_descriptions: [
      "The combination of Udvartana and targeted Ayurvedic bodywork stimulates sluggish metabolism, improving the body's ability to process and burn stored energy.",
      'The lymphatic-stimulating techniques used in this session actively reduce fluid retention, bloating, and the sensation of heaviness that often accompanies weight concerns.',
      'Specific herbs and massage techniques stimulate agni (digestive fire), improving nutrient absorption and the efficient elimination of ama (metabolic waste) that impedes weight balance.',
      'Regular sessions combined with personalised dietary guidance create measurable improvements in body composition — reducing adipose tissue and improving muscle tone.',
      'The consultation component provides personalised Ayurvedic dietary and lifestyle guidance that creates lasting change beyond the treatment table — addressing the root cause, not just the symptom.'
    ],
    process: ['Comprehensive Wellness Assessment', 'Udvartana Powder Massage', 'Abdominal & Lymphatic Work', 'Dietary Consultation'],
    process_days: ['0–15 min', '15–55 min', '55–75 min', '75–90 min'],
    process_descriptions: [
      'A thorough assessment of your constitution, digestive health, sleep patterns, stress levels, and current diet provides the foundation for a personalised treatment plan.',
      'An invigorating Udvartana herbal powder massage stimulates lymphatic flow, breaks down fat deposits, and energises the metabolism — the cornerstone of this treatment.',
      'Specialised abdominal massage (Nabhi Chikitsa) stimulates digestive function and the lymph nodes of the abdomen, followed by targeted lymphatic drainage work.',
      'The session concludes with a 15-minute dietary consultation providing practical, Ayurvedic-based nutritional guidance you can implement immediately.'
    ],
    ideal_for: ['Those struggling with unexplained weight gain', 'Kapha constitutional types prone to weight gain', 'Anyone with sluggish digestion and metabolism', 'Those wanting a holistic approach to body composition'],
    faqs: [
      { q: 'How much weight can I expect to lose?', a: 'Ayurvedic weight management focuses on restoring balance and healthy metabolism rather than rapid weight loss. Clients typically notice reduced bloating, improved energy, and gradual sustainable change rather than dramatic short-term results.' },
      { q: 'Do I need to follow a special diet?', a: 'We provide personalised dietary guidance based on your dosha and current condition. Implementing even partial dietary recommendations significantly enhances treatment outcomes.' }
    ]
  },
  {
    name: 'Ayurvedic Acne & Skin Wellness Therapy',
    duration: '75 minutes',
    price_from: '£85',
    hero_image: 'https://images.unsplash.com/photo-1487412840181-a40b2c8e6f31?w=1200&q=80',
    benefits: ['Reduced Acne & Breakouts', 'Hormonal Skin Balance', 'Reduced Scarring', 'Internal Detoxification', 'Long-Term Skin Health'],
    benefit_descriptions: [
      'Our approach addresses acne at its Ayurvedic root — excess Pitta (heat and inflammation) and Kapha (congestion) in the rasa and rakta dhatus — rather than just treating the surface.',
      'Ayurvedic herbs with natural anti-androgenic properties support hormonal balance, reducing the hormonal fluctuations that trigger cystic and cyclical acne patterns.',
      'Neem, turmeric, manjistha, and other Ayurvedic botanicals have potent antibacterial and anti-inflammatory actions that reduce active breakouts while fading existing scarring.',
      'Internal Ayurvedic herbs support liver function and gut health — the two most common internal triggers of skin inflammation — creating clearer skin from within.',
      "Unlike conventional acne treatments that often create dependency, our approach builds the skin's natural resilience and regulatory capacity for lasting, sustainable clarity."
    ],
    process: ['Skin & Constitution Assessment', 'Herbal Steam & Cleanse', 'Specialised Herbal Mask', 'Dietary & Lifestyle Guidance'],
    process_days: ['0–15 min', '15–35 min', '35–60 min', '60–75 min'],
    process_descriptions: [
      'A detailed assessment of your skin condition, hormonal history, diet, stress levels, and gut health identifies the specific Ayurvedic imbalances driving your skin concerns.',
      'A medicated herbal steam softens comedones and opens pores, followed by gentle manual cleansing and a botanical toner tailored for acne-prone skin.',
      'A freshly prepared antimicrobial and anti-inflammatory herbal mask (neem, turmeric, multani mitti, sandalwood) is applied and left for 20 minutes to draw out impurities and calm inflammation.',
      'The session concludes with a personalised consultation covering Ayurvedic dietary modifications, internal herbal support, and a daily skin care routine — the foundation of long-term results.'
    ],
    ideal_for: ['Acne vulgaris, hormonal acne, and cystic acne', 'Those frustrated by conventional acne treatments', 'Post-acne scarring and hyperpigmentation', 'Teenagers and adults with persistent skin concerns'],
    faqs: [
      { q: 'How quickly will I see results?', a: 'Many clients notice reduced redness and improved texture after the first session. Significant and lasting improvement in acne typically requires a course of 4–6 sessions alongside dietary changes.' },
      { q: 'Can this replace my existing skincare routine?', a: 'We recommend continuing any medically prescribed acne treatments alongside our Ayurvedic approach unless advised otherwise by your GP. Our treatments are complementary to conventional care.' }
    ]
  }
]

// POST, not GET: this overwrites every service row, and a GET could be
// triggered by simply following a link while logged in as admin.
export async function POST(request: NextRequest) {
  if (!isAdminRequest(request)) return unauthorized()

  const results: { name: string; success: boolean; error: string | undefined }[] = []

  for (const service of SERVICES_DATA) {
    const { name, ...data } = service
    const { error } = await supabaseAdmin
      .from('services')
      .update(data)
      .eq('name', name)
    results.push({ name, success: !error, error: error?.message })
  }

  const success = results.filter(r => r.success).length
  const failed = results.filter(r => !r.success)

  return NextResponse.json({
    message: `Updated ${success}/18 services`,
    failed,
    results
  })
}
