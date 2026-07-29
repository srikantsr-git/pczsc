import React, { createContext, useContext, useState, useEffect } from 'react';
import { safeSaveStorage, hydrateImagesFromIDB } from '../utils/persistentStorage';
import { saveMediaToIDB } from '../utils/mediaDB';
import { initialPEDirectorsList, defaultBlankAvatar } from '../data/defaultPEDirectors';
import { allSportsCalendarDocuments } from '../data/allSportsCalendarDocuments';
import { SEOStore, PageSEOConfig } from '../types/seo';
import { DEFAULT_PAGE_SEO } from '../utils/sitemapGenerator';
import {
  fetchDocumentsFromDB,
  saveDocumentToDB,
  deleteDocumentFromDB,
  fetchGalleryFromDB,
  saveGalleryItemToDB,
  deleteGalleryItemFromDB,
  fetchContactInquiriesFromDB,
  saveContactInquiryToDB,
  fetchHeroSlidesFromDB,
  saveHeroSlideToDB,
  deleteHeroSlideFromDB,
  fetchPEDirectorsFromDB,
  savePEDirectorToDB,
  deletePEDirectorFromDB,
  fetchSiteSettingFromDB,
  saveSiteSettingToDB
} from '../utils/neonDB';

export interface DocumentItem {
  id: string;
  srNo: number;
  title: string;
  category:
    | 'News'
    | 'Circulars'
    | 'Rules & Regulations'
    | 'Souvenirs'
    | 'Annual Reports - BOS&PE, SPPU, Pune'
    | 'Sports Calendar - Intercollegiate'
    | 'Sports Calendar - Inter Zonal'
    | 'Draws'
    | 'Results';
  date: string;
  viewUrl: string;
  downloadUrl: string;
  showOnNewsMarquee?: boolean;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  description: string;
  date: string;
}

export interface SectionContent {
  id: string;
  title: string;
  subtitle?: string;
  body: string;
  imageUrl?: string;
  imagePosition?: 'left' | 'right';
  isHidden?: boolean;
}

export interface ContactInfo {
  organisation: string;
  contactPerson: string;
  address: string;
  mobile: string;
  email: string;
  mapEmbedUrl: string;
}

export interface ContactInquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  college?: string;
  subject: string;
  message: string;
  submittedAt: string;
  status: 'Pending' | 'Answered';
  replyText?: string;
  repliedAt?: string;
}

export interface HeaderConfig {
  logoTitle: string;
  logoSubtitle: string;
  logoIconUrl?: string;
  navItems: { name: string; path: string }[];
  ctaText: string;
  ctaPath: string;
}

export interface HeroSlide {
  id: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  image: string;
  ctaText: string;
  ctaLink: string;
}

export interface HomeAboutConfig {
  badge: string;
  title: string;
  description: string;
  imageUrl: string;
  ctaText: string;
  ctaLink: string;
}

export interface PillarItem {
  id: number;
  title: string;
  description: string;
}

export interface PillarsSectionConfig {
  badge: string;
  title: string;
  showcaseImage: string;
  pillars: PillarItem[];
}

export interface NewsMarqueeItem {
  id: string;
  tag: string;
  date: string;
  title: string;
  link: string;
}

export interface MetricItem {
  id: string;
  number: string;
  label: string;
}

export interface CoreValueItem {
  title: string;
  desc: string;
}

export interface CommitteeMember {
  id: string;
  name: string;
  designation: string;
  photo: string;
  collegeAddress: string;
  contactDetails: string;
}

export interface PhysicalEducationDirector {
  id: string;
  name: string;
  photo: string;
  mobile: string;
  email: string;
  collegeAddress: string;
}

export interface VisionMissionConfig {
  visionTitle: string;
  visionText: string;
  missions: string[];
  coreValues: CoreValueItem[];
}

export interface FooterConfig {
  logoTitle: string;
  logoSubtitle: string;
  description: string;
  copyrightText: string;
  affiliationText: string;
}

export interface AboutUsConfig {
  historyBadge: string;
  historyTitle: string;
  historyBody: string;
  historyImage: string;
  objectivesTitle: string;
  objectivesBody: string;
  presidentTitle: string;
  presidentSubtitle: string;
  presidentBody: string;
  presidentHighlightTitle: string;
  presidentHighlightBody: string;
  presidentName?: string;
  presidentPhoto?: string;
  presidentRole: string;
  presidentOrganization: string;
  presidentUniversity: string;
}

export interface SubPageHeroConfig {
  category: string;
  title: string;
  subtitle: string;
  bgImageUrl: string;
}

export interface SubPagesHeroStore {
  about: SubPageHeroConfig;
  documents: SubPageHeroConfig;
  gallery: SubPageHeroConfig;
  contact: SubPageHeroConfig;
}

interface CMSContextType {
  isAdmin: boolean;
  isEditMode: boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  toggleEditMode: () => void;
  // Header Config
  headerConfig: HeaderConfig;
  updateHeaderConfig: (config: HeaderConfig) => void;
  // Hero Slides (Home Page)
  heroSlides: HeroSlide[];
  updateHeroSlides: (slides: HeroSlide[]) => void;
  addHeroSlide: (slide: Omit<HeroSlide, 'id'>) => void;
  deleteHeroSlide: (id: string) => void;
  // Home About Section
  homeAboutConfig: HomeAboutConfig;
  updateHomeAboutConfig: (cfg: HomeAboutConfig) => void;
  // Key Pillars Section
  pillarsConfig: PillarsSectionConfig;
  updatePillarsConfig: (cfg: PillarsSectionConfig) => void;
  // SubPage Hero Store (All Other Pages)
  subPagesHeroStore: SubPagesHeroStore;
  updateSubPageHero: (
    pageKey: 'about' | 'documents' | 'gallery' | 'contact',
    config: SubPageHeroConfig
  ) => void;
  // News Marquee
  newsMarquee: NewsMarqueeItem[];
  marqueeSpeed: number;
  updateNewsMarquee: (items: NewsMarqueeItem[]) => void;
  addNewsMarqueeItem: (item: Omit<NewsMarqueeItem, 'id'>) => void;
  deleteNewsMarqueeItem: (id: string) => void;
  updateMarqueeSpeed: (speed: number) => void;
  // Metrics
  metrics: MetricItem[];
  updateMetrics: (metrics: MetricItem[]) => void;
  // Vision & Mission
  visionMission: VisionMissionConfig;
  updateVisionMission: (vm: VisionMissionConfig) => void;
  // About Us Config
  aboutUsConfig: AboutUsConfig;
  updateAboutUsConfig: (cfg: AboutUsConfig) => void;
  // Footer Config
  footerConfig: FooterConfig;
  updateFooterConfig: (config: FooterConfig) => void;
  // Contact Info
  contactInfo: ContactInfo;
  updateContactInfo: (info: ContactInfo) => void;
  // Contact Inquiries & Replies
  contactInquiries: ContactInquiry[];
  addContactInquiry: (inquiry: Omit<ContactInquiry, 'id' | 'submittedAt' | 'status'>) => void;
  answerContactInquiry: (id: string, replyText: string) => void;
  deleteContactInquiry: (id: string) => void;
  // Documents
  documents: DocumentItem[];
  addDocument: (doc: Omit<DocumentItem, 'id' | 'srNo'>) => void;
  editDocument: (id: string, doc: Partial<DocumentItem>) => void;
  deleteDocument: (id: string) => void;
  toggleDocumentNewsMarquee: (id: string) => void;
  // Gallery & Dynamic Categories
  galleryCategories: string[];
  addGalleryCategory: (category: string) => void;
  deleteGalleryCategory: (category: string) => void;
  galleryItems: GalleryItem[];
  addGalleryItem: (item: Omit<GalleryItem, 'id'>) => void;
  deleteGalleryItem: (id: string) => void;
  // Dynamic Sections
  homeSections: SectionContent[];
  aboutSections: SectionContent[];
  updateSection: (page: 'home' | 'about', section: SectionContent) => void;
  addSection: (page: 'home' | 'about', section: Omit<SectionContent, 'id'>) => void;
  toggleHideSection: (page: 'home' | 'about', id: string) => void;
  deleteSection: (page: 'home' | 'about', id: string) => void;
  // Committee Members
  committeeMembers: CommitteeMember[];
  addCommitteeMember: (member: Omit<CommitteeMember, 'id'>) => void;
  editCommitteeMember: (id: string, member: Partial<CommitteeMember>) => void;
  deleteCommitteeMember: (id: string) => void;
  resetCommitteeMembers: () => void;
  // Directors of Physical Education & Sports
  peDirectors: PhysicalEducationDirector[];
  addPEDirector: (director: Omit<PhysicalEducationDirector, 'id'>) => void;
  editPEDirector: (id: string, director: Partial<PhysicalEducationDirector>) => void;
  deletePEDirector: (id: string) => void;
  // SEO & Meta Tags Configuration Store
  seoStore: SEOStore;
  updatePageSEO: (pageKey: string, config: PageSEOConfig) => void;
  resetPageSEO: (pageKey: string) => void;
}

const defaultHeaderConfig: HeaderConfig = {
  logoTitle: "PCZSC",
  logoSubtitle: "Pune City Zonal Sports Committee",
  navItems: [
    { name: 'Home', path: '/en/home' },
    { name: 'About', path: '/en/about-us' },
    { name: 'Downloads', path: '/en/documents' },
    { name: 'Photo Gallery', path: '/en/gallery' },
    { name: 'Contact Us', path: '/en/contact-us' },
  ],
  ctaText: "Contact Us",
  ctaPath: "/en/contact-us"
};

const defaultHeroSlides: HeroSlide[] = [
  {
    id: 'hero-1',
    eyebrow: "Savitribai Phule Pune University (SPPU)",
    title: "Pune City Zonal Sports Committee (PCZSC)",
    subtitle: "Empowering Student-Athletes, Organizing Intercollegiate Championships & Fostering Sporting Excellence across Pune Colleges",
    image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=2000&q=80",
    ctaText: "About PCZSC",
    ctaLink: "/en/about-us"
  },
  {
    id: 'hero-2',
    eyebrow: "Intercollegiate Championships",
    title: "Official Schedules, Draws & Competition Circulars",
    subtitle: "Access complete sports calendars, inter-zonal fixtures, selection trial notices, and official tournament results.",
    image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=2000&q=80",
    ctaText: "View Documents",
    ctaLink: "/en/documents"
  },
  {
    id: 'hero-3',
    eyebrow: "Innovation in Sports",
    title: "Live Streaming & Modern Tournament Technology",
    subtitle: "Bringing collegiate sports live to students, faculty, parents, and alumni worldwide with high-definition coverage.",
    image: "https://images.unsplash.com/photo-1517649763962-0c623266010b?auto=format&fit=crop&w=2000&q=80",
    ctaText: "Explore Gallery",
    ctaLink: "/en/gallery"
  }
];

const defaultHomeAboutConfig: HomeAboutConfig = {
  badge: "About PCZSC",
  title: "Pune City Zonal Sports Committee (PCZSC)",
  description: "Officially authorized body under Savitribai Phule Pune University (SPPU) entrusted with organizing, coordinating, and managing intercollegiate sports competitions across affiliated colleges and institutes in Pune City.",
  imageUrl: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=1200&q=80",
  ctaText: "READ FULL ABOUT US",
  ctaLink: "/en/about-us"
};

const defaultPillarsConfig: PillarsSectionConfig = {
  badge: "Key Pillars",
  title: "Four Core Pillars Driving Collegiate Sports Excellence in Pune",
  showcaseImage: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=2000&q=80",
  pillars: [
    {
      id: 0,
      title: "Fair Intercollegiate Competitions",
      description: "Organizing transparent, rule-abiding championships across multiple sporting disciplines for all affiliated Pune City colleges."
    },
    {
      id: 1,
      title: "Coaching & Selection Camps",
      description: "Identifying promising talent and hosting specialized university coaching camps to prepare athletes for Inter-Zonal tournaments."
    },
    {
      id: 2,
      title: "Live Streaming & Digital Tech",
      description: "Broadcasting tournament finals live online to enable faculty, parents, alumni, and sports fans to cheer for student-athletes remotely."
    },
    {
      id: 3,
      title: "Holistic Character Building",
      description: "Instilling lifelong values of sportsmanship, leadership, discipline, and ethical conduct through higher education sports."
    }
  ]
};

const defaultSubPagesHeroStore: SubPagesHeroStore = {
  about: {
    category: "Savitribai Phule Pune University (SPPU)",
    title: "About Pune City Zonal Sports Committee",
    subtitle: "Empowering student-athletes, fostering sporting excellence, and organizing transparent collegiate sports across Pune City colleges.",
    bgImageUrl: "https://images.unsplash.com/photo-1517649763962-0c623266010b?auto=format&fit=crop&w=2000&q=80"
  },
  documents: {
    category: "Official Document Center",
    title: "Circulars, Schedules & Results Repository",
    subtitle: "Access intercollegiate sports calendars, tournament draws, souvenirs, annual reports, circulars, and competition results.",
    bgImageUrl: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=2000&q=80"
  },
  gallery: {
    category: "PCZSC Media Center",
    title: "Official Photo & Video Gallery",
    subtitle: "Explore action photographs and video highlights from intercollegiate championships, coaching camps, live streaming events, and prize distribution ceremonies.",
    bgImageUrl: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=2000&q=80"
  },
  contact: {
    category: "Get In Touch",
    title: "Contact PCZSC Secretariat",
    subtitle: "Reach out to Pune City Zonal Sports Committee office at Poona College Camp, Pune for inquiries, event schedules, and sports administration.",
    bgImageUrl: "https://images.unsplash.com/photo-1517649763962-0c623266010b?auto=format&fit=crop&w=2000&q=80"
  }
};

const defaultNewsMarquee: NewsMarqueeItem[] = allSportsCalendarDocuments
  .filter((doc) => doc.showOnNewsMarquee)
  .map((doc) => ({
    id: `news-doc-${doc.id}`,
    tag: doc.category,
    date: doc.date,
    title: doc.title,
    link: doc.viewUrl || '/en/documents'
  }));

const defaultMetrics: MetricItem[] = [
  { id: 'm-1', number: '20+', label: 'Years of Excellence' },
  { id: 'm-2', number: '3000+', label: 'Student Athletes' },
  { id: 'm-3', number: '60+', label: 'Affiliated Colleges' },
  { id: 'm-4', number: '100+', label: 'Annual Tournaments' }
];

const defaultVisionMission: VisionMissionConfig = {
  visionTitle: "Vision Statement",
  visionText: "To be a leading collegiate sports organisation that inspires excellence, promotes holistic student development, and builds a strong sporting culture by providing equal opportunities for every student-athlete to excel at the university, state, national, and international levels.",
  missions: [
    "To organise fair, transparent, and professionally managed Intercollegiate Sports Competitions for all affiliated colleges and institutes under the Pune City Zone.",
    "To identify, nurture, and develop talented student-athletes through coaching camps, training programmes, and competitive exposure.",
    "To prepare and support university teams for Inter-Zonal, State, National, and other prestigious competitions by providing quality training and selection opportunities.",
    "To promote the values of sportsmanship, discipline, teamwork, leadership, integrity, and respect through participation in sports.",
    "To encourage maximum student participation by creating an inclusive and motivating sporting environment for all.",
    "To leverage modern technology and innovation, including digital platforms and live streaming, to make collegiate sports more accessible and engaging for students, institutions, alumni, and sports enthusiasts.",
    "To strengthen collaboration among Principals, Directors, Directors of Physical Education, coaches, officials, and affiliated colleges for the continuous growth of university sports.",
    "To preserve the rich legacy of collegiate sports while continually improving the quality, standards, and management of sporting events through innovation and best practices.",
    "To contribute to the overall physical, mental, and social well-being of students by promoting sports as an essential part of higher education.",
    "To establish Pune City as a centre of sporting excellence by creating opportunities for athletes to achieve success at every competitive level."
  ],
  coreValues: [
    { title: "Excellence", desc: "Striving for the highest standards in sports organisation and athletic performance." },
    { title: "Integrity", desc: "Ensuring fairness, transparency, and ethical conduct in every competition." },
    { title: "Sportsmanship", desc: "Respecting opponents, officials, rules, and the spirit of the game." },
    { title: "Teamwork", desc: "Building strong partnerships among colleges, athletes, coaches, and stakeholders." },
    { title: "Inclusivity", desc: "Providing equal opportunities for participation irrespective of background or ability." },
    { title: "Innovation", desc: "Embracing technology and modern practices to enhance the sporting experience." },
    { title: "Leadership", desc: "Developing confident, disciplined, and responsible student leaders through sports." },
    { title: "Commitment", desc: "Working with dedication to advance collegiate sports and inspire future generations." }
  ]
};

const defaultAboutUsConfig: AboutUsConfig = {
  historyBadge: "Authorized Governing Body",
  historyTitle: "Fostering Sporting Excellence Across Pune Higher Educational Institutions",
  historyBody: `The Pune City Zonal Sports Committee (PCZSC) is the officially authorized body entrusted with planning, coordinating, and promoting intercollegiate sports activities among the affiliated colleges and institutes within Pune City under the jurisdiction of Savitribai Phule Pune University (formerly the University of Pune).\n\nEstablished with the vision of fostering sporting excellence and encouraging a healthy competitive spirit, the committee plays a pivotal role in developing a vibrant sports culture across higher educational institutions.\n\nEvery academic year, the committee is democratically constituted through the unanimous support and election of the Principals of affiliated colleges, Directors of Institutes, and Directors of Physical Education. This collaborative governance model ensures transparent administration, effective coordination, and equal representation of all participating institutions.`,
  historyImage: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=1200&q=80",
  objectivesTitle: "Intercollegiate Competitions & Character Development",
  objectivesBody: `PCZSC is primarily responsible for organizing a wide range of Intercollegiate Sports Competitions across various disciplines, providing talented student-athletes with opportunities to compete at the highest collegiate level. The committee also identifies promising players and conducts specialized coaching camps, training programmes, and selection trials to prepare university teams for Inter-Zonal Competitions and other prestigious tournaments organized by Savitribai Phule Pune University.\n\nBeyond organizing competitions, the committee is committed to nurturing sporting talent, encouraging participation, and promoting values such as discipline, teamwork, leadership, perseverance, and sportsmanship. Through systematic planning and professional management, PCZSC ensures that competitions are conducted according to established rules and regulations, maintaining fairness, transparency, and the highest standards of sports administration.\n\nSport is much more than physical activity—it is a powerful medium for character building, personal development, and social integration. It develops physical fitness, mental resilience, strategic thinking, and the ability to perform under pressure. Participation in sports cultivates confidence, respect for opponents, ethical conduct, and lifelong healthy habits that contribute to the holistic development of students.\n\nOver the years, Pune City has established itself as one of the strongest sporting zones within the university system, producing numerous athletes who have represented the university at state, national, and international levels. PCZSC remains dedicated to sustaining this legacy by providing quality sporting opportunities, improving competitive standards, and strengthening collaboration among affiliated colleges.`,
  presidentTitle: "President's Message",
  presidentSubtitle: "Official Leadership Address",
  presidentBody: `It gives me immense pleasure and pride to present the successful completion of the Pune City Zonal Sports Committee (PCZSC) Intercollegiate Sports Competitions. Every edition of these competitions reflects our collective commitment to promoting excellence in sports, encouraging healthy competition, and nurturing the all-round development of students.\n\nThis year's sporting calendar has been a remarkable journey of dedication, discipline, teamwork, and outstanding performances. Our student-athletes displayed exceptional determination, resilience, and true sportsmanship, making every event memorable. Their achievements stand as a testament to the spirit of collegiate sports and the values that sports instill in young minds.`,
  presidentHighlightTitle: "Key Highlight: Introduction of Live Streaming",
  presidentHighlightBody: "One of the significant highlights this year was the introduction of Live Streaming of selected sporting events. This initiative enabled students, faculty members, parents, alumni, and sports enthusiasts to witness the competitions from anywhere, ensuring that academic commitments or geographical distance did not limit participation.",
  presidentName: "Prin. Dr. Iqbal N. Shaikh",
  presidentPhoto: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80",
  presidentRole: "President",
  presidentOrganization: "Pune City Zonal Sports Committee (PCZSC)",
  presidentUniversity: "Anjuman Khairul Islam Poona College, Camp, Pune"
};

const defaultFooterConfig: FooterConfig = {
  logoTitle: "PCZSC",
  logoSubtitle: "Pune City Zonal Sports Committee",
  description: "The Pune City Zonal Sports Committee (PCZSC) is the authorized body entrusted with planning, coordinating, and promoting intercollegiate sports activities under Savitribai Phule Pune University (SPPU).",
  copyrightText: "© 2026 Pune City Zonal Sports Committee (PCZSC). All rights reserved.",
  affiliationText: "Affiliated with Savitribai Phule Pune University (SPPU), Pune, Maharashtra."
};

const defaultContactInfo: ContactInfo = {
  organisation: "Pune City Zonal Sports Committee",
  contactPerson: "Dr. Shaikh Aiyaz Hussain Jiyaull Hussain",
  address: "C/o Anjuman Khairul Islam's Poona College, 1647, Camp, New Modikhana, Pune, Maharashtra, India.",
  mobile: "9422517809",
  email: "aiyaz9422@yahoo.co.in",
  mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3783.376829777598!2d73.8724652758836!3d18.50580556934371!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2c069b2b528b7%3A0x7d01878d655f464d!2sPoona%20College%20of%20Arts%2C%20Science%20and%20Commerce!5e0!3m2!1sen!2sin!4v1722080000000!5m2!1sen!2sin"
};

const initialInquiries: ContactInquiry[] = [
  {
    id: 'inq-1',
    name: 'Prof. Rahul Deshmukh',
    email: 'rahul.deshmukh@moderncollege.edu',
    phone: '9822012345',
    college: 'Modern College of Arts, Science and Commerce, Shivajinagar',
    subject: 'Intercollegiate Athletics Championship Registration Date Extension',
    message: 'Respected Secretary, We request a 2-day extension for submitting entry forms for the upcoming Intercollegiate Athletics Meet due to university semester exams.',
    submittedAt: '2026-07-26 14:30',
    status: 'Pending'
  },
  {
    id: 'inq-2',
    name: 'Dr. Priya Sharma',
    email: 'priya.sharma@fergusson.edu',
    phone: '9890123456',
    college: 'Fergusson College, Pune',
    subject: 'Host Selection Request for Inter-Zonal Basketball Tournament',
    message: 'Our college physical education department wishes to offer our indoor wooden basketball court as the venue for the upcoming Inter-Zonal selection trials.',
    submittedAt: '2026-07-25 10:15',
    status: 'Answered',
    replyText: 'Dear Dr. Priya, Thank you for your email. Your proposal has been approved by the executive committee.',
    repliedAt: '2026-07-25 16:45'
  }
];

const initialDocuments: DocumentItem[] = allSportsCalendarDocuments;

const initialCommitteeMembers: CommitteeMember[] = [
  {
    id: 'cm-1',
    name: 'Prin. Dr. Iqbal N. Shaikh',
    designation: 'President',
    photo: '/committee/Prin. Dr. Iqbal N. Shaikh.jpg',
    collegeAddress: 'Anjuman Khairul Islam Poona College, 1647, Camp, New Modikhana, Pune.',
    contactDetails: 'Mobile No. : -'
  },
  {
    id: 'cm-2',
    name: 'Dr. Shaikh Aiyaz Hussain Jiyaull Hussain',
    designation: 'Secretary',
    photo: '/committee/DrShaikh.jpg',
    collegeAddress: 'Anjuman Khairul Islam Poona College, 1647, Camp, New Modikhana, Pune',
    contactDetails: 'Mobile No. : 9422517809'
  },
  {
    id: 'cm-3',
    name: 'Prof. (Dr.) Amrule Mohan Namdeo',
    designation: 'Joint Secretary',
    photo: '/committee/ProfAmrule.jpg',
    collegeAddress: "Deccan Education Society's B.M. College of Commerce, 845, Shivajinagar, Daccan Gymkhana, Pune",
    contactDetails: 'Mobile No. : 9881600118'
  },
  {
    id: 'cm-4',
    name: 'Prof. (Dr.) Bengle Asha Vijaykumar',
    designation: 'Joint Secretary',
    photo: '/committee/Prof.Bengle.jpg',
    collegeAddress: "Maharashtra Education Society's Abasaheb Garware Mahavidyalay, Karve Road, Pune",
    contactDetails: 'Mobile No. : 9922223233'
  },
  {
    id: 'cm-5',
    name: 'Mr. Sharma Anirudha Mahesh',
    designation: 'Joint Secretary',
    photo: '/committee/Mr.Sharma .jpg',
    collegeAddress: "Symbiosis International Cultural Center's Symbiosis College of Arts & Commerce, Senapati Bapat Road, Pune",
    contactDetails: 'Mobile No. : 7709999997'
  },
  {
    id: 'cm-6',
    name: 'Dr. Bibave Umesh Arun',
    designation: 'Treasurer',
    photo: '/committee/Dr.Bibave .jpg',
    collegeAddress: "Maharashtra Education Society's Garware College Of Commerce, Off Karve Road, Pune",
    contactDetails: 'Mobile No. : 7350509990'
  },
  {
    id: 'cm-7',
    name: 'Dr. Chikte Anagha Sunil',
    designation: 'Member',
    photo: '/committee/Dr Chikte .jpg',
    collegeAddress: "Maharshi Karve Stree Shikshan Sanstha's Shri Sidhvinayak Mahila Mahavidyalaya, Karvenagar, Pune",
    contactDetails: 'Mobile No. : 9850710713'
  },
  {
    id: 'cm-8',
    name: 'Prof. (Dr.) Dhamale Shantaram Dattu',
    designation: 'Member',
    photo: '/committee/Prof.Dhamale .jpg',
    collegeAddress: "Shri Shivaji Maratha Society's Samajbhushan Baburao Alias Appasaheb Jedhe Arts, Commerce & Science College, 425, Shukrwar Peth, Pune",
    contactDetails: 'Mobile No. : 9421077180'
  },
  {
    id: 'cm-9',
    name: 'Dr. Shendkar Deepak Tanaji',
    designation: 'Member',
    photo: '/committee/Dr.Shendkar.jpg',
    collegeAddress: "Progressive Education Society's Modern Arts, Commerce & Science College, Ganeshkhind, Pune",
    contactDetails: 'Mobile No. : 9823839014'
  },
  {
    id: 'cm-10',
    name: 'Dr. More Shirish Vijay',
    designation: 'Member',
    photo: '/committee/Dr.More .jpg',
    collegeAddress: "Maharashtriy Mandal's Chandrashekhar Agashe College of Physical Eduaction, Gultekadi, Pune",
    contactDetails: 'Mobile No. : 9545455910'
  },
  {
    id: 'cm-11',
    name: 'Dr. Kondhare Manisha Manoj',
    designation: 'Member',
    photo: '/committee/Dr.Kondhare.jpg',
    collegeAddress: "All India Shri Shivaji Memorial Society's AISSMS College of Engineering, Kennedy Road, Pune",
    contactDetails: 'Mobile No. : 9881294721'
  },
  {
    id: 'cm-12',
    name: 'Mr. Parse Abhijit Venkat',
    designation: 'Member',
    photo: '/committee/mrparse.jpg',
    collegeAddress: "Sanskar Mandir Sanstha's Art's & Commerce College, Opp. Ganpati Mandir, Warje Malwadi, Pune",
    contactDetails: 'Mobile No. : 9028088199'
  },
  {
    id: 'cm-13',
    name: 'Dr. Abhijeet Kadam',
    designation: 'Member',
    photo: '/committee/Dr.AbhijeetKadam.jpg',
    collegeAddress: 'Dept. of Sports & Physical Education, Savitribai Phule Pune University, Pune',
    contactDetails: 'Mobile No. : 9689827038'
  },
  {
    id: 'cm-14',
    name: 'Mr. Tribhuvan Mithun Prakash',
    designation: 'Invitee Member',
    photo: '/committee/mrtribhuvan.jpg',
    collegeAddress: "Modern Education Society's Ness Wadia College of Commerce, 19, V.K Joag Path, Pune",
    contactDetails: 'Mobile No. : 9890776333'
  }
];

const initialPEDirectors: PhysicalEducationDirector[] = initialPEDirectorsList;

const initialGallery: GalleryItem[] = [
  {
    id: 'gal-1',
    title: 'Intercollegiate Championship Opening Ceremony',
    category: 'Intercollegiate Competitions',
    imageUrl: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=1200&q=80',
    description: 'Principals, Directors, and student-athletes gathered at Poona College ground for the annual sports inauguration.',
    date: '2024'
  },
  {
    id: 'gal-2',
    title: 'Live Streaming Setup for Final Match',
    category: 'Live Streaming Events',
    imageUrl: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1200&q=80',
    description: 'Introducing high-definition live streaming for parents and alumni to watch intercollegiate finals remotely.',
    date: '2024'
  }
];

const defaultGalleryCategories = [
  'Intercollegiate Competitions',
  'Coaching Camps',
  'Live Streaming Events',
  'Award Ceremonies'
];

const CMSContext = createContext<CMSContextType | undefined>(undefined);

export const CMSProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    return localStorage.getItem('pczsc_is_admin') === 'true';
  });

  const [isEditMode, setIsEditMode] = useState<boolean>(false);

  const [headerConfig, setHeaderConfig] = useState<HeaderConfig>(() => {
    const saved = localStorage.getItem('pczsc_header_cfg');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.navItems && Array.isArray(parsed.navItems)) {
          parsed.navItems = parsed.navItems.map((item: any) => {
            if (item.name === 'About Us') return { ...item, name: 'About' };
            if (item.name === 'Documents & Circulars') return { ...item, name: 'Downloads' };
            return item;
          });
        }
        return parsed;
      } catch (e) {}
    }
    return defaultHeaderConfig;
  });

  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>(() => {
    const saved = localStorage.getItem('pczsc_hero_slides');
    return saved ? JSON.parse(saved) : defaultHeroSlides;
  });

  const [homeAboutConfig, setHomeAboutConfig] = useState<HomeAboutConfig>(() => {
    const saved = localStorage.getItem('pczsc_home_about');
    return saved ? JSON.parse(saved) : defaultHomeAboutConfig;
  });

  const [pillarsConfig, setPillarsConfig] = useState<PillarsSectionConfig>(() => {
    const saved = localStorage.getItem('pczsc_pillars_cfg');
    return saved ? JSON.parse(saved) : defaultPillarsConfig;
  });

  const [subPagesHeroStore, setSubPagesHeroStore] = useState<SubPagesHeroStore>(() => {
    const saved = localStorage.getItem('pczsc_subpages_hero');
    return saved ? JSON.parse(saved) : defaultSubPagesHeroStore;
  });

  const [newsMarquee, setNewsMarquee] = useState<NewsMarqueeItem[]>(() => {
    const saved = localStorage.getItem('pczsc_news_marquee');
    return saved ? JSON.parse(saved) : defaultNewsMarquee;
  });

  const [marqueeSpeed, setMarqueeSpeed] = useState<number>(() => {
    const saved = localStorage.getItem('pczsc_marquee_speed');
    return saved ? Number(saved) : 18;
  });

  const [metrics, setMetrics] = useState<MetricItem[]>(() => {
    const saved = localStorage.getItem('pczsc_metrics');
    return saved ? JSON.parse(saved) : defaultMetrics;
  });

  const [visionMission, setVisionMission] = useState<VisionMissionConfig>(() => {
    const saved = localStorage.getItem('pczsc_vision_mission');
    return saved ? JSON.parse(saved) : defaultVisionMission;
  });

  const [aboutUsConfig, setAboutUsConfig] = useState<AboutUsConfig>(() => {
    const saved = localStorage.getItem('pczsc_about_cfg');
    return saved ? JSON.parse(saved) : defaultAboutUsConfig;
  });

  const [footerConfig, setFooterConfig] = useState<FooterConfig>(() => {
    const saved = localStorage.getItem('pczsc_footer_cfg');
    return saved ? JSON.parse(saved) : defaultFooterConfig;
  });

  const [contactInfo, setContactInfo] = useState<ContactInfo>(() => {
    const saved = localStorage.getItem('pczsc_contact');
    return saved ? JSON.parse(saved) : defaultContactInfo;
  });

  const [contactInquiries, setContactInquiries] = useState<ContactInquiry[]>(() => {
    const saved = localStorage.getItem('pczsc_contact_inquiries');
    return saved ? JSON.parse(saved) : initialInquiries;
  });

  const [documents, setDocuments] = useState<DocumentItem[]>(() => {
    const saved = localStorage.getItem('pczsc_docs');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const hasRules = Array.isArray(parsed) && parsed.some((d: any) => d.category === 'Rules & Regulations' || d.category === 'Rules and Regulations');
        if (Array.isArray(parsed) && parsed.length >= 41 && hasRules) {
          return parsed;
        }
      } catch (e) {}
    }
    safeSaveStorage('pczsc_docs', allSportsCalendarDocuments);
    return allSportsCalendarDocuments;
  });

  const [galleryCategories, setGalleryCategories] = useState<string[]>(() => {
    const saved = localStorage.getItem('pczsc_gallery_categories');
    return saved ? JSON.parse(saved) : defaultGalleryCategories;
  });

  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>(() => {
    const saved = localStorage.getItem('pczsc_gallery');
    return saved ? JSON.parse(saved) : initialGallery;
  });

  const [committeeMembers, setCommitteeMembers] = useState<CommitteeMember[]>(() => {
    const saved = localStorage.getItem('pczsc_committee_members');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          if (parsed.length <= 4 && parsed[0]?.name === 'Dr. Aftab Anwar Shaikh') {
            safeSaveStorage('pczsc_committee_members', initialCommitteeMembers);
            return initialCommitteeMembers;
          }
          const updated = parsed.map((m: any) => {
            const match = initialCommitteeMembers.find((icm) => icm.id === m.id);
            if (match && (m.photo?.startsWith('data:image') || !m.photo || m.photo === defaultBlankAvatar)) {
              return { ...m, photo: match.photo };
            }
            return m;
          });
          safeSaveStorage('pczsc_committee_members', updated);
          return updated;
        }
      } catch (e) {}
    }
    safeSaveStorage('pczsc_committee_members', initialCommitteeMembers);
    return initialCommitteeMembers;
  });

  const [peDirectors, setPEDirectors] = useState<PhysicalEducationDirector[]>(() => {
    const saved = localStorage.getItem('pczsc_pe_directors');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const updated = parsed.map((d: any) => {
            const match = initialPEDirectorsList.find((ipd) => ipd.id === d.id);
            if (match && match.photo !== defaultBlankAvatar && (d.photo?.startsWith('data:image') || !d.photo || d.photo === defaultBlankAvatar)) {
              return { ...d, photo: match.photo };
            }
            return d;
          });
          safeSaveStorage('pczsc_pe_directors', updated);
          return updated;
        }
      } catch (e) {}
    }
    safeSaveStorage('pczsc_pe_directors', initialPEDirectorsList);
    return initialPEDirectorsList;
  });

  const [homeSections, setHomeSections] = useState<SectionContent[]>([]);
  const [aboutSections, setAboutSections] = useState<SectionContent[]>([]);

  useEffect(() => {
    localStorage.setItem('pczsc_is_admin', isAdmin ? 'true' : 'false');
  }, [isAdmin]);

  useEffect(() => {
    async function hydrateStores() {
      try {
        // Hydrate from Neon PostgreSQL database
        const dbDocs = await fetchDocumentsFromDB();
        const hasDbRules = dbDocs && dbDocs.some((d: any) => d.category === 'Rules & Regulations' || d.category === 'Rules and Regulations');
        if (dbDocs && dbDocs.length >= 41 && hasDbRules) {
          setDocuments(dbDocs);
        } else {
          setDocuments(allSportsCalendarDocuments);
          safeSaveStorage('pczsc_docs', allSportsCalendarDocuments);
          for (const doc of allSportsCalendarDocuments) {
            saveDocumentToDB(doc);
          }
        }
        // --- Gallery: fetch from Neon DB, hydrate idb: refs, fallback to localStorage ---
        const dbGal = await fetchGalleryFromDB();
        if (dbGal && dbGal.length > 0) {
          // Hydrate idb: image references back to real data URLs
          const hydratedGal = await hydrateImagesFromIDB(dbGal);
          setGalleryItems(hydratedGal && Array.isArray(hydratedGal) ? hydratedGal : dbGal);
        } else {
          // DB is empty — fall back to localStorage (may have user-uploaded items with idb: refs)
          const lsGal = localStorage.getItem('pczsc_gallery');
          if (lsGal) {
            try {
              const parsed = JSON.parse(lsGal);
              if (Array.isArray(parsed) && parsed.length > 0) {
                const hydratedLs = await hydrateImagesFromIDB(parsed);
                setGalleryItems(hydratedLs && Array.isArray(hydratedLs) ? hydratedLs : parsed);
              }
            } catch (_e) {}
          }
        }

        const dbInq = await fetchContactInquiriesFromDB();
        if (dbInq && dbInq.length > 0) {
          setContactInquiries(dbInq);
        }
        const dbHero = await fetchHeroSlidesFromDB();
        if (dbHero && dbHero.length > 0) {
          const hydratedHero = await hydrateImagesFromIDB(dbHero);
          setHeroSlides(hydratedHero && Array.isArray(hydratedHero) ? hydratedHero : dbHero);
        } else {
          const hHero = await hydrateImagesFromIDB(heroSlides);
          if (hHero && Array.isArray(hHero)) {
            setHeroSlides(hHero);
          }
        }

        const dbDirectors = await fetchPEDirectorsFromDB();
        if (dbDirectors && dbDirectors.length >= 100) {
          const syncedDirectors = dbDirectors.map((d: any) => {
            const match = initialPEDirectorsList.find((ipd) => ipd.id === d.id);
            if (match && match.photo !== defaultBlankAvatar && (d.photo?.startsWith('data:image') || !d.photo || d.photo === defaultBlankAvatar)) {
              return { ...d, photo: match.photo };
            }
            return d;
          });
          setPEDirectors(syncedDirectors);
          safeSaveStorage('pczsc_pe_directors', syncedDirectors);
        } else {
          setPEDirectors(initialPEDirectorsList);
          safeSaveStorage('pczsc_pe_directors', initialPEDirectorsList);
          for (const d of initialPEDirectorsList) {
            savePEDirectorToDB(d);
          }
        }

        const dbSubHero = await fetchSiteSettingFromDB<SubPagesHeroStore | null>('pczsc_subpages_hero', null);
        if (dbSubHero) {
          const hydratedSub = await hydrateImagesFromIDB(dbSubHero);
          setSubPagesHeroStore(hydratedSub || dbSubHero);
        } else {
          const hSub = await hydrateImagesFromIDB(subPagesHeroStore);
          if (hSub) setSubPagesHeroStore(hSub);
        }

        const dbHomeAbout = await fetchSiteSettingFromDB<HomeAboutConfig | null>('pczsc_home_about', null);
        if (dbHomeAbout) {
          const hydrated = await hydrateImagesFromIDB(dbHomeAbout);
          setHomeAboutConfig(hydrated || dbHomeAbout);
        }

        const dbPillars = await fetchSiteSettingFromDB<PillarsSectionConfig | null>('pczsc_pillars_cfg', null);
        if (dbPillars) {
          const hydrated = await hydrateImagesFromIDB(dbPillars);
          setPillarsConfig(hydrated || dbPillars);
        }

        const dbAbout = await fetchSiteSettingFromDB<AboutUsConfig | null>('pczsc_about_cfg', null);
        if (dbAbout) {
          const hydrated = await hydrateImagesFromIDB(dbAbout);
          setAboutUsConfig(hydrated || dbAbout);
        } else {
          const hAbt = await hydrateImagesFromIDB(aboutUsConfig);
          if (hAbt) setAboutUsConfig(hAbt);
        }

        const dbCom = await fetchSiteSettingFromDB<CommitteeMember[] | null>('pczsc_committee_members', null);
        if (dbCom && Array.isArray(dbCom) && dbCom.length > 0) {
          const hydrated = await hydrateImagesFromIDB(dbCom);
          setCommitteeMembers(hydrated && Array.isArray(hydrated) ? hydrated : dbCom);
        } else {
          const hCom = await hydrateImagesFromIDB(committeeMembers);
          if (hCom && Array.isArray(hCom)) setCommitteeMembers(hCom);
        }

        const dbFooter = await fetchSiteSettingFromDB<FooterConfig | null>('pczsc_footer_cfg', null);
        if (dbFooter) {
          setFooterConfig(dbFooter);
        }

        const dbContact = await fetchSiteSettingFromDB<ContactInfo | null>('pczsc_contact', null);
        if (dbContact) {
          setContactInfo(dbContact);
        }

        const dbSEO = await fetchSiteSettingFromDB<SEOStore | null>('pczsc_seo_store', null);
        if (dbSEO) {
          setSeoStore(dbSEO);
        }

        const dbMarquee = await fetchSiteSettingFromDB<NewsMarqueeItem[] | null>('pczsc_news_marquee', null);
        if (dbMarquee && Array.isArray(dbMarquee)) {
          setNewsMarquee(dbMarquee);
        }

        const dbMetrics = await fetchSiteSettingFromDB<MetricItem[] | null>('pczsc_metrics', null);
        if (dbMetrics && Array.isArray(dbMetrics)) {
          setMetrics(dbMetrics);
        }

        const dbVision = await fetchSiteSettingFromDB<VisionMissionConfig | null>('pczsc_vision_mission', null);
        if (dbVision) {
          setVisionMission(dbVision);
        }

        const dbHeader = await fetchSiteSettingFromDB<HeaderConfig | null>('pczsc_header_cfg', null);
        if (dbHeader) {
          const hydratedHdr = await hydrateImagesFromIDB(dbHeader);
          setHeaderConfig(hydratedHdr || dbHeader);
        } else {
          const hHdr = await hydrateImagesFromIDB(headerConfig);
          if (hHdr) setHeaderConfig(hHdr);
        }
      } catch (e) {
        console.warn("Storage hydration warning:", e);
      }
    }
    hydrateStores();
  }, []);

  const login = (username: string, password: string): boolean => {
    if (username === 'admin' && password === 'admin123') {
      setIsAdmin(true);
      setIsEditMode(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAdmin(false);
    setIsEditMode(false);
  };

  const toggleEditMode = () => {
    setIsEditMode((prev) => !prev);
  };

  const updateHeaderConfig = (config: HeaderConfig) => {
    setHeaderConfig(config);
    safeSaveStorage('pczsc_header_cfg', config);
    saveSiteSettingToDB('pczsc_header_cfg', config);
  };

  const updateHeroSlides = (slides: HeroSlide[]) => {
    setHeroSlides(slides);
    slides.forEach((slide, idx) => {
      saveHeroSlideToDB(slide, idx);
    });
    safeSaveStorage('pczsc_hero_slides', slides);
  };

  const updateHomeAboutConfig = (cfg: HomeAboutConfig) => {
    setHomeAboutConfig(cfg);
    safeSaveStorage('pczsc_home_about', cfg);
    saveSiteSettingToDB('pczsc_home_about', cfg);
  };

  const updatePillarsConfig = (cfg: PillarsSectionConfig) => {
    setPillarsConfig(cfg);
    safeSaveStorage('pczsc_pillars_cfg', cfg);
    saveSiteSettingToDB('pczsc_pillars_cfg', cfg);
  };

  const updateSubPageHero = (
    pageKey: 'about' | 'documents' | 'gallery' | 'contact',
    config: SubPageHeroConfig
  ) => {
    const updated = { ...subPagesHeroStore, [pageKey]: config };
    setSubPagesHeroStore(updated);
    safeSaveStorage('pczsc_subpages_hero', updated);
    saveSiteSettingToDB('pczsc_subpages_hero', updated);
  };

  const addHeroSlide = (slide: Omit<HeroSlide, 'id'>) => {
    const newSlide: HeroSlide = { ...slide, id: `hero-${Date.now()}` };
    const updated = [...heroSlides, newSlide];
    updateHeroSlides(updated);
    saveHeroSlideToDB(newSlide, updated.length - 1);
  };

  const deleteHeroSlide = (id: string) => {
    const updated = heroSlides.filter((s) => s.id !== id);
    updateHeroSlides(updated);
    deleteHeroSlideFromDB(id);
  };

  const updateNewsMarquee = (items: NewsMarqueeItem[]) => {
    setNewsMarquee(items);
    try {
      localStorage.setItem('pczsc_news_marquee', JSON.stringify(items));
    } catch (e) {
      console.warn("Storage warning:", e);
    }
    saveSiteSettingToDB('pczsc_news_marquee', items);
  };

  const addNewsMarqueeItem = (item: Omit<NewsMarqueeItem, 'id'>) => {
    const newItem: NewsMarqueeItem = { ...item, id: `news-${Date.now()}` };
    const updated = [...newsMarquee, newItem];
    updateNewsMarquee(updated);
  };

  const deleteNewsMarqueeItem = (id: string) => {
    const updated = newsMarquee.filter((n) => n.id !== id);
    updateNewsMarquee(updated);
  };

  const updateMarqueeSpeed = (speed: number) => {
    setMarqueeSpeed(speed);
    try {
      localStorage.setItem('pczsc_marquee_speed', String(speed));
    } catch (e) {
      console.warn("Storage warning:", e);
    }
    saveSiteSettingToDB('pczsc_marquee_speed', speed);
  };

  const updateMetrics = (m: MetricItem[]) => {
    setMetrics(m);
    try {
      localStorage.setItem('pczsc_metrics', JSON.stringify(m));
    } catch (e) {
      console.warn("Storage warning:", e);
    }
    saveSiteSettingToDB('pczsc_metrics', m);
  };

  const updateVisionMission = (vm: VisionMissionConfig) => {
    setVisionMission(vm);
    safeSaveStorage('pczsc_vision_mission', vm);
    saveSiteSettingToDB('pczsc_vision_mission', vm);
  };

  const updateAboutUsConfig = (cfg: AboutUsConfig) => {
    setAboutUsConfig(cfg);
    safeSaveStorage('pczsc_about_cfg', cfg);
    saveSiteSettingToDB('pczsc_about_cfg', cfg);
  };

  const updateFooterConfig = (config: FooterConfig) => {
    setFooterConfig(config);
    safeSaveStorage('pczsc_footer_cfg', config);
    saveSiteSettingToDB('pczsc_footer_cfg', config);
  };

  const updateContactInfo = (info: ContactInfo) => {
    setContactInfo(info);
    safeSaveStorage('pczsc_contact', info);
    saveSiteSettingToDB('pczsc_contact', info);
  };

  const addContactInquiry = (inquiry: Omit<ContactInquiry, 'id' | 'submittedAt' | 'status'>) => {
    const newInquiry: ContactInquiry = {
      ...inquiry,
      id: `inq-${Date.now()}`,
      submittedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      status: 'Pending'
    };
    const updated = [newInquiry, ...contactInquiries];
    setContactInquiries(updated);
    saveContactInquiryToDB(newInquiry);
    try {
      localStorage.setItem('pczsc_contact_inquiries', JSON.stringify(updated));
    } catch (e) {
      console.warn("Storage warning:", e);
    }
  };

  const answerContactInquiry = (id: string, replyText: string) => {
    const updated = contactInquiries.map((inq) => {
      if (inq.id === id) {
        const item = {
          ...inq,
          status: 'Answered' as const,
          replyText,
          repliedAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
        };
        saveContactInquiryToDB(item);
        return item;
      }
      return inq;
    });
    setContactInquiries(updated);
    try {
      localStorage.setItem('pczsc_contact_inquiries', JSON.stringify(updated));
    } catch (e) {
      console.warn("Storage warning:", e);
    }
  };

  const deleteContactInquiry = (id: string) => {
    const updated = contactInquiries.filter((inq) => inq.id !== id);
    setContactInquiries(updated);
    try {
      localStorage.setItem('pczsc_contact_inquiries', JSON.stringify(updated));
    } catch (e) {
      console.warn("Storage warning:", e);
    }
  };

  const addDocument = (doc: Omit<DocumentItem, 'id' | 'srNo'>) => {
    const newDoc: DocumentItem = {
      ...doc,
      id: `doc-${Date.now()}`,
      srNo: documents.length + 1
    };
    const updated = [newDoc, ...documents];
    setDocuments(updated);
    saveDocumentToDB(newDoc);
    try {
      localStorage.setItem('pczsc_docs', JSON.stringify(updated));
    } catch (e) {
      console.warn("Storage warning:", e);
    }
  };

  const editDocument = (id: string, updatedFields: Partial<DocumentItem>) => {
    const newDocs = documents.map((d) => {
      if (d.id === id) {
        const merged = { ...d, ...updatedFields };
        saveDocumentToDB(merged);
        return merged;
      }
      return d;
    });
    setDocuments(newDocs);
    try {
      localStorage.setItem('pczsc_docs', JSON.stringify(newDocs));
    } catch (e) {
      console.warn("Storage warning:", e);
    }
  };

  const deleteDocument = (id: string) => {
    const newDocs = documents.filter((d) => d.id !== id);
    setDocuments(newDocs);
    deleteDocumentFromDB(id);
    try {
      localStorage.setItem('pczsc_docs', JSON.stringify(newDocs));
    } catch (e) {
      console.warn("Storage warning:", e);
    }
  };

  const toggleDocumentNewsMarquee = (id: string) => {
    const docToToggle = documents.find((d) => d.id === id);
    if (!docToToggle) return;

    const willShow = !docToToggle.showOnNewsMarquee;
    const updatedDocs = documents.map((d) => {
      if (d.id === id) {
        const item = { ...d, showOnNewsMarquee: willShow };
        saveDocumentToDB(item);
        return item;
      }
      return d;
    });
    setDocuments(updatedDocs);
    try {
      localStorage.setItem('pczsc_docs', JSON.stringify(updatedDocs));
    } catch (e) {
      console.warn("Storage warning:", e);
    }

    // Sync with newsMarquee
    const marqueeId = `news-doc-${id}`;
    if (willShow) {
      if (!newsMarquee.some((item) => item.id === marqueeId)) {
        const marqueeItem: NewsMarqueeItem = {
          id: marqueeId,
          tag: docToToggle.category,
          date: docToToggle.date,
          title: docToToggle.title,
          link: docToToggle.viewUrl || '/en/documents'
        };
        const updatedMarquee = [marqueeItem, ...newsMarquee];
        updateNewsMarquee(updatedMarquee);
      }
    } else {
      const updatedMarquee = newsMarquee.filter((item) => item.id !== marqueeId);
      updateNewsMarquee(updatedMarquee);
    }
  };

  const addGalleryCategory = (category: string) => {
    const trimmed = category.trim();
    if (trimmed && !galleryCategories.includes(trimmed)) {
      const updated = [...galleryCategories, trimmed];
      setGalleryCategories(updated);
      try {
        localStorage.setItem('pczsc_gallery_categories', JSON.stringify(updated));
      } catch (e) {
        console.warn("Storage warning:", e);
      }
    }
  };

  const deleteGalleryCategory = (category: string) => {
    const updated = galleryCategories.filter((c) => c !== category);
    setGalleryCategories(updated);
    try {
      localStorage.setItem('pczsc_gallery_categories', JSON.stringify(updated));
    } catch (e) {
      console.warn("Storage warning:", e);
    }
  };

  const addGalleryItem = (item: Omit<GalleryItem, 'id'>) => {
    const newItem: GalleryItem = {
      ...item,
      id: `gal-${Date.now()}`
    };
    const updated = [newItem, ...galleryItems];
    setGalleryItems(updated);
    safeSaveStorage('pczsc_gallery', updated);
    saveGalleryItemToDB(newItem);
  };

  const deleteGalleryItem = (id: string) => {
    const updated = galleryItems.filter((g) => g.id !== id);
    setGalleryItems(updated);
    deleteGalleryItemFromDB(id);
    safeSaveStorage('pczsc_gallery', updated);
  };

  const updateSection = (page: 'home' | 'about', section: SectionContent) => {
    const setSec = page === 'home' ? setHomeSections : setAboutSections;
    setSec((prev) => prev.map((s) => (s.id === section.id ? section : s)));
  };

  const addSection = (page: 'home' | 'about', section: Omit<SectionContent, 'id'>) => {
    const newSec: SectionContent = {
      ...section,
      id: `sec-${Date.now()}`
    };
    const setSec = page === 'home' ? setHomeSections : setAboutSections;
    setSec((prev) => [...prev, newSec]);
  };

  const toggleHideSection = (page: 'home' | 'about', id: string) => {
    const setSec = page === 'home' ? setHomeSections : setAboutSections;
    setSec((prev) =>
      prev.map((s) => (s.id === id ? { ...s, isHidden: !s.isHidden } : s))
    );
  };

  const deleteSection = (page: 'home' | 'about', id: string) => {
    const setSec = page === 'home' ? setHomeSections : setAboutSections;
    setSec((prev) => prev.filter((s) => s.id !== id));
  };

  const addCommitteeMember = (member: Omit<CommitteeMember, 'id'>) => {
    const newMember: CommitteeMember = {
      ...member,
      id: `cm-${Date.now()}`
    };
    const updated = [...committeeMembers, newMember];
    setCommitteeMembers(updated);
    safeSaveStorage('pczsc_committee_members', updated);
    saveSiteSettingToDB('pczsc_committee_members', updated);
  };

  const editCommitteeMember = (id: string, member: Partial<CommitteeMember>) => {
    const updated = committeeMembers.map((m) =>
      m.id === id ? { ...m, ...member } : m
    );
    setCommitteeMembers(updated);
    safeSaveStorage('pczsc_committee_members', updated);
    saveSiteSettingToDB('pczsc_committee_members', updated);
  };

  const deleteCommitteeMember = (id: string) => {
    const updated = committeeMembers.filter((m) => m.id !== id);
    setCommitteeMembers(updated);
    safeSaveStorage('pczsc_committee_members', updated);
    saveSiteSettingToDB('pczsc_committee_members', updated);
  };

  const resetCommitteeMembers = () => {
    setCommitteeMembers(initialCommitteeMembers);
    safeSaveStorage('pczsc_committee_members', initialCommitteeMembers);
    saveSiteSettingToDB('pczsc_committee_members', initialCommitteeMembers);
  };

  const addPEDirector = (director: Omit<PhysicalEducationDirector, 'id'>) => {
    const newDir: PhysicalEducationDirector = {
      ...director,
      id: `dir-${Date.now()}`
    };
    const updated = [...peDirectors, newDir];
    setPEDirectors(updated);
    safeSaveStorage('pczsc_pe_directors', updated);
    savePEDirectorToDB(newDir);
  };

  const editPEDirector = (id: string, updatedFields: Partial<PhysicalEducationDirector>) => {
    const updated = peDirectors.map((d) => {
      if (d.id === id) {
        const merged = { ...d, ...updatedFields };
        savePEDirectorToDB(merged);
        return merged;
      }
      return d;
    });
    setPEDirectors(updated);
    safeSaveStorage('pczsc_pe_directors', updated);
  };

  const [seoStore, setSeoStore] = useState<SEOStore>(() => {
    const saved = localStorage.getItem('pczsc_seo_store');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') {
          return { ...DEFAULT_PAGE_SEO, ...parsed };
        }
      } catch (_e) {}
    }
    return DEFAULT_PAGE_SEO;
  });

  const updatePageSEO = (pageKey: string, config: PageSEOConfig) => {
    const updated = { ...seoStore, [pageKey]: config };
    setSeoStore(updated);
    safeSaveStorage('pczsc_seo_store', updated);
    saveSiteSettingToDB('pczsc_seo_store', updated);
  };

  const resetPageSEO = (pageKey: string) => {
    const defaultCfg = DEFAULT_PAGE_SEO[pageKey];
    if (defaultCfg) {
      updatePageSEO(pageKey, defaultCfg);
    }
  };

  const deletePEDirector = (id: string) => {
    const updated = peDirectors.filter((d) => d.id !== id);
    setPEDirectors(updated);
    deletePEDirectorFromDB(id);
    safeSaveStorage('pczsc_pe_directors', updated);
  };

  return (
    <CMSContext.Provider
      value={{
        isAdmin,
        isEditMode,
        login,
        logout,
        toggleEditMode,
        headerConfig,
        updateHeaderConfig,
        heroSlides,
        updateHeroSlides,
        homeAboutConfig,
        updateHomeAboutConfig,
        pillarsConfig,
        updatePillarsConfig,
        subPagesHeroStore,
        updateSubPageHero,
        addHeroSlide,
        deleteHeroSlide,
        newsMarquee,
        marqueeSpeed,
        updateNewsMarquee,
        addNewsMarqueeItem,
        deleteNewsMarqueeItem,
        updateMarqueeSpeed,
        metrics,
        updateMetrics,
        visionMission,
        updateVisionMission,
        aboutUsConfig,
        updateAboutUsConfig,
        footerConfig,
        updateFooterConfig,
        contactInfo,
        updateContactInfo,
        contactInquiries,
        addContactInquiry,
        answerContactInquiry,
        deleteContactInquiry,
        documents,
        addDocument,
        editDocument,
        deleteDocument,
        toggleDocumentNewsMarquee,
        galleryCategories,
        addGalleryCategory,
        deleteGalleryCategory,
        galleryItems,
        addGalleryItem,
        deleteGalleryItem,
        homeSections,
        aboutSections,
        updateSection,
        addSection,
        toggleHideSection,
        deleteSection,
        committeeMembers,
        addCommitteeMember,
        editCommitteeMember,
        deleteCommitteeMember,
        resetCommitteeMembers,
        peDirectors,
        addPEDirector,
        editPEDirector,
        deletePEDirector,
        seoStore,
        updatePageSEO,
        resetPageSEO
      }}
    >
      {children}
    </CMSContext.Provider>
  );
};

export const useCMS = () => {
  const context = useContext(CMSContext);
  if (!context) {
    throw new Error('useCMS must be used within a CMSProvider');
  }
  return context;
};
