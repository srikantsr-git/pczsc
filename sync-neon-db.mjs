import { neon } from '@neondatabase/serverless';
import fs from 'fs';

const DEFAULT_DATABASE_URL =
  'postgresql://neondb_owner:npg_Ko7RbCqA5lsG@ep-winter-bar-azhp79jj.c-3.ap-southeast-1.aws.neon.tech/neondb?sslmode=require';

const sql = neon(process.env.VITE_DATABASE_URL || DEFAULT_DATABASE_URL);

async function runSync() {
  console.log('Connecting to Neon PostgreSQL Database...');

  // 1. Create tables if not exist
  await sql`
    CREATE TABLE IF NOT EXISTS site_settings (
      key TEXT PRIMARY KEY,
      value JSONB NOT NULL,
      updated_at TIMESTAMP DEFAULT NOW()
    );
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS documents (
      id TEXT PRIMARY KEY,
      sr_no INT,
      title TEXT,
      category TEXT,
      date TEXT,
      view_url TEXT,
      download_url TEXT,
      show_on_news_marquee BOOLEAN,
      created_at TIMESTAMP DEFAULT NOW()
    );
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS gallery (
      id TEXT PRIMARY KEY,
      title TEXT,
      category TEXT,
      image_url TEXT,
      description TEXT,
      date TEXT,
      created_at TIMESTAMP DEFAULT NOW()
    );
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS hero_slides (
      id TEXT PRIMARY KEY,
      slide_order INT,
      eyebrow TEXT,
      title TEXT,
      subtitle TEXT,
      media_url TEXT,
      cta_text TEXT,
      cta_link TEXT,
      created_at TIMESTAMP DEFAULT NOW()
    );
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS physical_education_directors (
      id TEXT PRIMARY KEY,
      name TEXT,
      photo TEXT,
      mobile TEXT,
      email TEXT,
      college_address TEXT,
      created_at TIMESTAMP DEFAULT NOW()
    );
  `;

  console.log('Database tables verified.');

  // 2. Active Theme Config
  const activeTheme = {
    id: 'default-light',
    name: 'Official PCZSC Light Mode',
    presetId: 'default-light',
    primaryColors: {
      accentRed: '#D9232D',
      slateDark: '#0B0F19',
      blueHighlight: '#1E40AF',
      bgLight: '#FFFFFF',
      textPrimary: '#0F172A'
    },
    darkMode: {
      mode: 'light',
      isDark: false
    },
    updatedAt: new Date().toISOString()
  };
  await sql`
    INSERT INTO site_settings (key, value, updated_at)
    VALUES ('pczsc_active_theme', ${JSON.stringify(activeTheme)}::jsonb, NOW())
    ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW();
  `;

  // 3. Header Config
  const headerConfig = {
    logoTitle: 'PCZSC',
    logoSubtitle: 'Pune City Zonal Sports Committee',
    logoIconUrl: '/pczsc-logo.png',
    navItems: [
      { name: 'Home', path: '/en/home' },
      { name: 'About', path: '/en/about-us' },
      { name: 'Downloads', path: '/en/documents' },
      { name: 'Photo Gallery', path: '/en/gallery' },
      { name: 'Contact Us', path: '/en/contact-us' }
    ],
    ctaText: 'Contact Us',
    ctaPath: '/en/contact-us'
  };
  await sql`
    INSERT INTO site_settings (key, value, updated_at)
    VALUES ('pczsc_header_cfg', ${JSON.stringify(headerConfig)}::jsonb, NOW())
    ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW();
  `;

  // 4. Committee Members
  const committeeMembers = [
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
  await sql`
    INSERT INTO site_settings (key, value, updated_at)
    VALUES ('pczsc_committee_members', ${JSON.stringify(committeeMembers)}::jsonb, NOW())
    ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW();
  `;

  // 5. About Us Config
  const aboutUsConfig = {
    historyBadge: 'Authorized Governing Body',
    historyTitle: 'Fostering Sporting Excellence Across Pune Higher Educational Institutions',
    historyBody: `The Pune City Zonal Sports Committee (PCZSC) is the officially authorized body entrusted with planning, coordinating, and promoting intercollegiate sports activities among the affiliated colleges and institutes within Pune City under the jurisdiction of Savitribai Phule Pune University (formerly the University of Pune).\n\nEstablished with the vision of fostering sporting excellence and encouraging a healthy competitive spirit, the committee plays a pivotal role in developing a vibrant sports culture across higher educational institutions.\n\nEvery academic year, the committee is democratically constituted through the unanimous support and election of the Principals of affiliated colleges, Directors of Institutes, and Directors of Physical Education. This collaborative governance model ensures transparent administration, effective coordination, and equal representation of all participating institutions.`,
    historyImage: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=1200&q=80',
    objectivesTitle: 'Intercollegiate Competitions & Character Development',
    objectivesBody: `PCZSC is primarily responsible for organizing a wide range of Intercollegiate Sports Competitions across various disciplines, providing talented student-athletes with opportunities to compete at the highest collegiate level. The committee also identifies promising players and conducts specialized coaching camps, training programmes, and selection trials to prepare university teams for Inter-Zonal Competitions and other prestigious tournaments organized by Savitribai Phule Pune University.\n\nBeyond organizing competitions, the committee is committed to nurturing sporting talent, encouraging participation, and promoting values such as discipline, teamwork, leadership, perseverance, and sportsmanship. Through systematic planning and professional management, PCZSC ensures that competitions are conducted according to established rules and regulations, maintaining fairness, transparency, and the highest standards of sports administration.`,
    presidentTitle: "President's Message",
    presidentSubtitle: 'Official Leadership Address',
    presidentBody: `It gives me immense pleasure and pride to present the successful completion of the Pune City Zonal Sports Committee (PCZSC) Intercollegiate Sports Competitions. Every edition of these competitions reflects our collective commitment to promoting excellence in sports, encouraging healthy competition, and nurturing the all-round development of students.`,
    presidentHighlightTitle: 'Key Highlight: Introduction of Live Streaming',
    presidentHighlightBody: 'One of the significant highlights this year was the introduction of Live Streaming of selected sporting events. This initiative enabled students, faculty members, parents, alumni, and sports enthusiasts to witness the competitions from anywhere, ensuring that academic commitments or geographical distance did not limit participation.',
    presidentName: 'Prin. Dr. Iqbal N. Shaikh',
    presidentPhoto: '/committee/Prin. Dr. Iqbal N. Shaikh.jpg',
    presidentRole: 'President',
    presidentOrganization: 'Pune City Zonal Sports Committee (PCZSC)',
    presidentUniversity: 'Anjuman Khairul Islam Poona College, Camp, Pune'
  };
  await sql`
    INSERT INTO site_settings (key, value, updated_at)
    VALUES ('pczsc_about_cfg', ${JSON.stringify(aboutUsConfig)}::jsonb, NOW())
    ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW();
  `;

  // 6. Hero Slides Table
  const heroSlides = [
    {
      id: 'hero-1',
      slide_order: 0,
      eyebrow: 'Savitribai Phule Pune University (SPPU)',
      title: 'Pune City Zonal Sports Committee (PCZSC)',
      subtitle: 'Empowering Student-Athletes, Organizing Intercollegiate Championships & Fostering Sporting Excellence across Pune Colleges',
      media_url: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=2000&q=80',
      cta_text: 'About PCZSC',
      cta_link: '/en/about-us'
    },
    {
      id: 'hero-2',
      slide_order: 1,
      eyebrow: 'Intercollegiate Championships',
      title: 'Official Schedules, Draws & Competition Circulars',
      subtitle: 'Access complete sports calendars, inter-zonal fixtures, selection trial notices, and official tournament results.',
      media_url: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=2000&q=80',
      cta_text: 'View Documents',
      cta_link: '/en/documents'
    },
    {
      id: 'hero-3',
      slide_order: 2,
      eyebrow: 'Innovation in Sports',
      title: 'Live Streaming & Modern Tournament Technology',
      subtitle: 'Bringing collegiate sports live to students, faculty, parents, and alumni worldwide with high-definition coverage.',
      media_url: 'https://images.unsplash.com/photo-1517649763962-0c623266010b?auto=format&fit=crop&w=2000&q=80',
      cta_text: 'Explore Gallery',
      cta_link: '/en/gallery'
    }
  ];
  for (const h of heroSlides) {
    await sql`
      INSERT INTO hero_slides (id, slide_order, eyebrow, title, subtitle, media_url, cta_text, cta_link)
      VALUES (${h.id}, ${h.slide_order}, ${h.eyebrow}, ${h.title}, ${h.subtitle}, ${h.media_url}, ${h.cta_text}, ${h.cta_link})
      ON CONFLICT (id) DO UPDATE SET
        slide_order = EXCLUDED.slide_order,
        eyebrow = EXCLUDED.eyebrow,
        title = EXCLUDED.title,
        subtitle = EXCLUDED.subtitle,
        media_url = EXCLUDED.media_url,
        cta_text = EXCLUDED.cta_text,
        cta_link = EXCLUDED.cta_link;
    `;
  }

  // 7. Gallery Table
  const galleryItems = [
    {
      id: 'gal-1',
      title: 'Intercollegiate Championship Opening Ceremony',
      category: 'Intercollegiate Competitions',
      image_url: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=1200&q=80',
      description: 'Principals, Directors, and student-athletes gathered at Poona College ground for the annual sports inauguration.',
      date: '2024'
    },
    {
      id: 'gal-2',
      title: 'Live Streaming Setup for Final Match',
      category: 'Live Streaming Events',
      image_url: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1200&q=80',
      description: 'Introducing high-definition live streaming for parents and alumni to watch intercollegiate finals remotely.',
      date: '2024'
    }
  ];
  for (const g of galleryItems) {
    await sql`
      INSERT INTO gallery (id, title, category, image_url, description, date)
      VALUES (${g.id}, ${g.title}, ${g.category}, ${g.image_url}, ${g.description}, ${g.date})
      ON CONFLICT (id) DO UPDATE SET
        title = EXCLUDED.title,
        category = EXCLUDED.category,
        image_url = EXCLUDED.image_url,
        description = EXCLUDED.description,
        date = EXCLUDED.date;
    `;
  }

  // 8. Documents Table
  try {
    const docData = JSON.parse(fs.readFileSync('./src/data/documents_data.json', 'utf-8'));
    for (const doc of docData) {
      await sql`
        INSERT INTO documents (id, sr_no, title, category, date, view_url, download_url, show_on_news_marquee)
        VALUES (${doc.id}, ${doc.srNo}, ${doc.title}, ${doc.category}, ${doc.date}, ${doc.viewUrl}, ${doc.downloadUrl}, ${Boolean(doc.showOnNewsMarquee)})
        ON CONFLICT (id) DO UPDATE SET
          sr_no = EXCLUDED.sr_no,
          title = EXCLUDED.title,
          category = EXCLUDED.category,
          date = EXCLUDED.date,
          view_url = EXCLUDED.view_url,
          download_url = EXCLUDED.download_url,
          show_on_news_marquee = EXCLUDED.show_on_news_marquee;
      `;
    }
    console.log(`✅ Seeded ${docData.length} documents into Neon DB.`);
  } catch (e) {
    console.warn('Note on document seeding:', e.message);
  }

  console.log('✅ Successfully populated Neon DB with all site settings, themes, photos, and committee members!');
}

runSync().catch((err) => {
  console.error('❌ Sync failed:', err);
  process.exit(1);
});
