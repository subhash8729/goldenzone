/**
 * Centralized Golden Zone Company & Site Settings Constants
 * Used as official defaults across storefront and customer channels.
 */
export const DEFAULT_SITE_SETTINGS = {
  // Brand & Company Info
  brand_name: 'Golden Zone',
  hero_title: 'Golden Zone',
  hero_subtitle: 'Discover premium 1 gram gold-plated jewellery crafted to complement your style with timeless elegance.',
  hero_video_url: 'https://res.cloudinary.com/dgxaol7mz/video/upload/v1789876791/videoplayback_hwcfti.mp4',
  hero_image: 'https://res.cloudinary.com/dgxaol7mz/image/upload/v1789872269/ChatGPT_Image_Sep_19_2026_11_08_00_AM_1_xjiro4.png',
  announcement_bar: 'PREMIUM 1 GRAM GOLD-PLATED JEWELLERY • SAME DAY DISPATCH • 100% INSURED TRANSIT • VERIFIED COD AVAILABLE',
  brand_description: 'Golden Zone brings thoughtfully designed 1 gram gold-plated jewellery for everyday and occasion wear. Timeless styling, rich aesthetics, and trustworthy craftsmanship.',

  // Contact Emails
  contact_email: 'goldenzone676@gmail.com',
  support_email: 'support@goldenzone.in',

  // Telephone & WhatsApp Support
  whatsapp_number: '+91 92861 29921',
  whatsapp_clean_number: '919286129921',
  contact_phone: '9286129921',
  whatsapp_contact_name: 'Golden Zone Care',
  whatsapp_chat_url: 'https://wa.me/919286129921?text=Hello,%20I%20want%20to%20know%20more%20about%20Golden%20Zone%20jewellery.',
  whatsapp_group_url: 'https://chat.whatsapp.com/invite/goldenzone',

  // Social Channels
  instagram_url: 'https://www.instagram.com/goldenzone.in',
  instagram_username: '@goldenzone.in',

  // Physical Registered Address
  company_address: 'Jyoti Nagar, Sanchore, Rajasthan, Jalore',
  company_pincode: '343041',
  full_address: 'Jyoti Nagar, Sanchore, Rajasthan, Jalore PIN: 343041',

  // Footer & Policies
  footer_text: '© 2026 Golden Zone. All rights reserved. Specializing exclusively in 1 Gram Gold-Plated Jewellery.'
};

/**
 * Merge live server settings with centralized defaults.
 */
export function getMergedSettings(serverSettings = {}) {
  return {
    ...DEFAULT_SITE_SETTINGS,
    ...(serverSettings || {})
  };
}
