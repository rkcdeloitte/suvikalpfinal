// ─── Local demo data store (localStorage-backed) ─────────────────
// Stands in for Firebase Auth + Firestore so the whole flow can be
// clicked through without a real backend. Not used by the real
// testimonials.html / admin.html (those use Firebase).
const DemoStore = {
  USERS_KEY: 'suvikalp_demo_users',
  TESTIMONIALS_KEY: 'suvikalp_demo_testimonials',
  CURRENT_USER_KEY: 'suvikalp_demo_current_user',
  ADMIN_SESSION_KEY: 'suvikalp_demo_admin_session',

  ADMIN_EMAIL: 'admin@suvikalp.test',
  ADMIN_PASSWORD: 'admin123',

  getUsers() { return JSON.parse(localStorage.getItem(this.USERS_KEY) || '{}'); },
  setUsers(u) { localStorage.setItem(this.USERS_KEY, JSON.stringify(u)); },

  getTestimonials() { return JSON.parse(localStorage.getItem(this.TESTIMONIALS_KEY) || '[]'); },
  setTestimonials(t) { localStorage.setItem(this.TESTIMONIALS_KEY, JSON.stringify(t)); },

  getCurrentUser() { return localStorage.getItem(this.CURRENT_USER_KEY); },
  setCurrentUser(email) {
    if (email) localStorage.setItem(this.CURRENT_USER_KEY, email);
    else localStorage.removeItem(this.CURRENT_USER_KEY);
  },

  isAdminSignedIn() { return localStorage.getItem(this.ADMIN_SESSION_KEY) === '1'; },
  setAdminSignedIn(v) {
    if (v) localStorage.setItem(this.ADMIN_SESSION_KEY, '1');
    else localStorage.removeItem(this.ADMIN_SESSION_KEY);
  },

  seedIfEmpty() {
    if (localStorage.getItem(this.USERS_KEY)) return; // already seeded

    const users = {
      'test1@example.com': { password:'test123', profileComplete:true, name:'Priya Sharma', designation:'Project Manager', company:'GreenTech Renewables', companySize:'51–200 employees' },
      'test2@example.com': { password:'test123', profileComplete:true, name:'Arjun Mehta', designation:'Director', company:'Coalfield Solutions Pvt Ltd', companySize:'500+ employees' },
      'test3@example.com': { password:'test123', profileComplete:false }
    };
    this.setUsers(users);

    const now = Date.now();
    const testimonials = [
      { id:'t1', email:'test1@example.com', name:'Priya Sharma', designation:'Project Manager', company:'GreenTech Renewables', companySize:'51–200 employees',
        message:'SUVIKALP helped us identify a viable solar repurposing plan for our closed mine site within days instead of months of manual study.',
        status:'approved', createdAt: now - 1000*60*60*24*5 },
      { id:'t2', email:'test2@example.com', name:'Arjun Mehta', designation:'Director', company:'Coalfield Solutions Pvt Ltd', companySize:'500+ employees',
        message:'The PRISM framework made stakeholder buy-in so much easier — everyone could see the implementation pathway clearly.',
        status:'approved', createdAt: now - 1000*60*60*24*3 },
      { id:'t3', email:'test1@example.com', name:'Priya Sharma', designation:'Project Manager', company:'GreenTech Renewables', companySize:'51–200 employees',
        message:'Would love to see more detailed case studies specifically for logistics parks in the next update.',
        status:'pending', createdAt: now - 1000*60*60*12 },
      { id:'t4', email:'test2@example.com', name:'Arjun Mehta', designation:'Director', company:'Coalfield Solutions Pvt Ltd', companySize:'500+ employees',
        message:'This is just a spam test entry to demonstrate the reject flow.',
        status:'rejected', createdAt: now - 1000*60*60*24*1 }
    ];
    this.setTestimonials(testimonials);
  },

  resetAll() {
    localStorage.removeItem(this.USERS_KEY);
    localStorage.removeItem(this.TESTIMONIALS_KEY);
    localStorage.removeItem(this.CURRENT_USER_KEY);
    localStorage.removeItem(this.ADMIN_SESSION_KEY);
  }
};
