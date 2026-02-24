/* ============================================================
   HIRUSH GLOBAL — SEO TRAINING PROGRAM
   app.js — All JavaScript: App Logic + Question Bank + Quiz Engine
   ============================================================ */

/* ── LOADING SCREEN ── */
(function(){
document.addEventListener('DOMContentLoaded', function(){
  var loading = document.getElementById('hg-loading');
  setTimeout(function(){
    loading.classList.add('fade-out');
    setTimeout(function(){
      loading.style.display='none';
      document.querySelector('.main').style.display='block';
    },650);
  },2600);
});
})();

const sections    = ['home','m1','m2','m3','m4','m5','m6','m7','m8','m9','m10','m11','m12','assignments'];
const moduleOrder = ['m1','m2','m3','m4','m5','m6','m7','m8','m9','m10','m11','m12'];
const moduleNames = {
  m1:'Module 1: Intro to SEO', m2:'Module 2: Keyword Research',
  m3:'Module 3: On-Page SEO',  m4:'Module 4: Technical SEO',
  m5:'Module 5: GSC & Analytics', m6:'Module 6: Off-Page SEO',
  m7:'Module 7: Local SEO',    m8:'Module 8: Content Strategy',
  m9:'Module 9: SEO Tools & Audits', m10:'Module 10: Advanced SEO',
  m11:'Module 11: E-Commerce SEO', m12:'Module 12: AI & Future SEO'
};
const titles = {
  home:'SEO Training Dashboard', m1:'Module 1: Intro to SEO',
  m2:'Module 2: Keyword Research', m3:'Module 3: On-Page SEO',
  m4:'Module 4: Technical SEO',   m5:'Module 5: GSC & Analytics',
  m6:'Module 6: Off-Page SEO',    m7:'Module 7: Local SEO',
  m8:'Module 8: Content Strategy',m9:'Module 9: SEO Tools & Audits',
  m10:'Module 10: Advanced SEO',  m11:'Module 11: E-Commerce SEO',
  m12:'Module 12: AI & Future SEO', assignments:'Assignments & Projects'
};

let unlockedModules  = new Set(['m1','m2','m3','m4','m5','m6','m7','m8','m9','m10','m11','m12','assignments']);
let completedModules = new Set();
let visited          = new Set(['home']);
let pendingLockedModule = null;

function isUnlocked(mid) { return unlockedModules.has(mid); }

function unlockModule(mid) {
  if (unlockedModules.has(mid)) return;
  unlockedModules.add(mid);
  const navEl = document.getElementById('nav-' + mid);
  if (navEl) navEl.classList.remove('locked');
  showUnlockToast(mid);
}

function markCompleted(mid) {
  if (completedModules.has(mid)) return;
  completedModules.add(mid);
  const navEl = document.getElementById('nav-' + mid);
  if (navEl) navEl.classList.add('completed');
  const idx = moduleOrder.indexOf(mid);
  if (idx >= 0 && idx < moduleOrder.length - 1) {
    unlockModule(moduleOrder[idx + 1]);
    enableNextButton(mid);
  }
  if (mid === 'm12') {
    unlockedModules.add('assignments');
    enableNextButton(mid);
  }
}

function enableNextButton(mid) {
  const section = document.getElementById(mid);
  if (!section) return;
  const nextBtn = section.querySelector('.btn-primary.btn-next-locked');
  if (nextBtn) nextBtn.classList.remove('btn-next-locked');
  const hint = section.querySelector('.quiz-pass-hint');
  if (hint) hint.remove();
}

function showUnlockToast(mid) {
  const toast = document.createElement('div');
  toast.style.cssText = 'position:fixed;bottom:28px;right:28px;z-index:9999;background:linear-gradient(135deg,#1e3a8a,#3b5fc0);color:white;padding:16px 22px;border-radius:14px;font-size:0.88rem;font-weight:600;box-shadow:0 8px 24px rgba(30,58,138,0.35);max-width:300px;line-height:1.5;transition:opacity 0.5s;';
  toast.innerHTML = '🔓 <strong>' + moduleNames[mid] + '</strong> is now unlocked!';
  document.body.appendChild(toast);
  setTimeout(() => { toast.style.opacity = '0'; }, 2800);
  setTimeout(() => { toast.remove(); }, 3400);
}

function navClick(id) {
  if (moduleOrder.includes(id) && !isUnlocked(id)) {
    const idx = moduleOrder.indexOf(id);
    pendingLockedModule = id;
    const prevName = idx > 0 ? moduleNames[moduleOrder[idx - 1]] : 'the previous module';
    document.getElementById('lock-prev-name').textContent = prevName;
    document.getElementById('lock-overlay').classList.add('show');
    return;
  }
  showSection(id);
}

function goToPrevModule() {
  closeLockOverlay();
  if (!pendingLockedModule) return;
  const idx = moduleOrder.indexOf(pendingLockedModule);
  if (idx > 0) showSection(moduleOrder[idx - 1]);
}

function closeLockOverlay() {
  document.getElementById('lock-overlay').classList.remove('show');
  pendingLockedModule = null;
}

function showSection(id) {
  if (moduleOrder.includes(id) && !isUnlocked(id)) { navClick(id); return; }
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  document.querySelectorAll('.nav-item').forEach(n => {
    n.classList.remove('active');
    const oc = n.getAttribute('onclick') || '';
    if (oc.includes("'" + id + "'")) n.classList.add('active');
  });
  const navEl = document.getElementById('nav-' + id);
  if (navEl) navEl.classList.add('active');
  document.getElementById('page-title').textContent = titles[id] || id;
  visited.add(id);
  updateProgress();
  updateModuleCardProgress(id);
  window.scrollTo(0, 0);
}

function updateProgress() {
  const pct = Math.round((visited.size / sections.length) * 100);
  document.getElementById('progress-fill').style.width = pct + '%';
  document.getElementById('progress-text').textContent = pct + '% Complete';
}

function updateModuleCardProgress(sectionId) {
  const section = document.getElementById(sectionId);
  if (!section) return;
  const bar    = section.querySelector('.module-progress-fill');
  const label  = section.querySelector('.module-progress-label');
  const all    = section.querySelectorAll('.card');
  const opened = section.querySelectorAll('.card.open');
  if (bar)   bar.style.width = all.length ? Math.round((opened.length / all.length) * 100) + '%' : '0%';
  if (label) label.textContent = opened.length + ' / ' + all.length + ' opened';
}

function toggleCard(cardEl) {
  cardEl.classList.toggle('open');
  const sectionEl = cardEl.closest('.section');
  if (sectionEl) updateModuleCardProgress(sectionEl.id);
}

function expandAll(sId)  { document.getElementById(sId).querySelectorAll('.card').forEach(c => c.classList.add('open'));    updateModuleCardProgress(sId); }
function collapseAll(sId){ document.getElementById(sId).querySelectorAll('.card').forEach(c => c.classList.remove('open')); updateModuleCardProgress(sId); }

function initCards() {
  document.querySelectorAll('.section:not(#home):not(#assignments) .card').forEach(card => {
    if (card.querySelector('.card-header')) return;
    const h3 = card.querySelector('h3');
    if (!h3) return;
    const header = document.createElement('div');
    header.className = 'card-header';
    const toggle = document.createElement('div');
    toggle.className = 'card-toggle';
    toggle.innerHTML = '▼';
    header.appendChild(h3.cloneNode(true));
    header.appendChild(toggle);
    const body = document.createElement('div');
    body.className = 'card-body';
    Array.from(card.children).forEach(child => { if (child !== h3) body.appendChild(child); });
    card.innerHTML = '';
    card.appendChild(header);
    card.appendChild(body);
    const allInSection = card.closest('.section').querySelectorAll('.card');
    if (allInSection[0] === card) card.classList.add('open');
    header.addEventListener('click', () => toggleCard(card));
  });
}

updateProgress();
initCards();

/* ── QUESTION BANK ── */
const QUESTION_BANK = {
m1:[
  {q:"What does SEO stand for?",opts:["Search Engine Operation","Search Engine Optimization","Site Engine Optimization","Social Engagement Optimization"],correct:1,explain:"SEO = Search Engine Optimization — improving your site so Google ranks it higher in search results."},
  {q:"What does 'organic traffic' mean?",opts:["Traffic from paid Google Ads","Visitors from social media","Visitors who clicked a free search result","Traffic from email campaigns"],correct:2,explain:"Organic traffic comes from free search results — people who found you via Google without you paying for an ad."},
  {q:"What is the FIRST step Google takes before it can rank a page?",opts:["Rank it","Read the content","Crawl it — discover it exists","Check its design"],correct:2,explain:"Google must first crawl (discover) a page. No crawl = no index = no ranking."},
  {q:"Which type of SEO focuses on earning links from OTHER websites?",opts:["On-Page SEO","Technical SEO","Off-Page SEO","Mobile SEO"],correct:2,explain:"Off-Page SEO covers activity outside your website — primarily building backlinks from other sites."},
  {q:"Someone searches 'best budget laptops 2024'. What is their search intent?",opts:["Transactional — ready to buy now","Commercial — researching before buying","Informational — just learning","Navigational — looking for a specific site"],correct:1,explain:"'Best budget' = comparing options before buying = commercial investigation intent."},
  {q:"Which SEO practice can get your website REMOVED from Google entirely?",opts:["Writing long-form content","Using HTTPS","Black Hat SEO (buying links, keyword stuffing)","Submitting an XML sitemap"],correct:2,explain:"Black Hat SEO tricks can lead to a manual Google penalty — wiping all rankings overnight."},
  {q:"What is the 'index' in Google's context?",opts:["A list of paid advertisers","Google's massive database of crawled web pages","A website's navigation menu","A file that blocks crawlers"],correct:1,explain:"Google's index is the database where it stores all crawled pages. Pages not indexed cannot appear in search results."},
  {q:"What does the 'Ranking' step involve?",opts:["Visiting web pages to discover them","Storing page content in a database","Using 200+ signals to order pages by relevance and quality","Sending emails to website owners"],correct:2,explain:"During ranking, Google compares all indexed pages and sorts them by quality, relevance and user signals."}
],
m2:[
  {q:"A brand-new website should target keywords with which KD score?",opts:["KD 70–100","KD 40–60","KD 0–20","KD doesn't matter"],correct:2,explain:"New sites have low authority. Targeting KD under 20 gives the best chance of ranking on page 1."},
  {q:"Which keyword type is BEST for a brand-new website?",opts:["Short-tail: 'shoes'","Mid-tail: 'running shoes'","Long-tail: 'best running shoes for flat feet under ₹3000'","Brand keywords"],correct:2,explain:"Long-tail keywords have low competition and high conversion rates — perfect for new sites."},
  {q:"A HIGH CPC on a keyword tells you what?",opts:["It's easy to rank for","Nobody searches for it","It has commercial value","It should be avoided"],correct:2,explain:"High CPC means advertisers find this keyword valuable — it's worth targeting organically too."},
  {q:"'How to tie a tie step by step' is what type of keyword?",opts:["Short-tail","Local keyword","Transactional","Question/long-tail keyword"],correct:3,explain:"It's a question format AND 4+ words — best for informational blog posts and featured snippets."},
  {q:"What does Google Keyword Planner's 'competitor URL trick' do?",opts:["Shows competitor traffic","Suggests keywords based on competitor's page content","Copies competitor backlinks","Auto-creates content"],correct:1,explain:"Pasting a competitor URL reveals what keywords their pages are targeting — finding what works for them."},
  {q:"LSI keywords are:",opts:["Misspelled keywords","Keywords competitors use","Related terms giving Google context about your topic","Only relevant for paid ads"],correct:2,explain:"LSI keywords are semantically related words that help Google understand your content's topic more fully."},
  {q:"Search Volume of 100–1,000/month is ideal for:",opts:["Large established brands","New websites looking to rank","Paid ad campaigns only","Social media posts"],correct:1,explain:"New sites should aim for 100–1,000 monthly searches. Big volumes are dominated by major brands."},
  {q:"What tool is FREE for checking if a keyword is growing or declining?",opts:["Ahrefs","SEMrush","Google Trends","Moz"],correct:2,explain:"Google Trends is completely free and shows whether search interest is rising or falling over time."}
],
m3:[
  {q:"How many H1 tags should a web page have?",opts:["As many as needed","At least 3","Exactly one","None"],correct:2,explain:"Every page needs exactly ONE H1 containing the primary keyword."},
  {q:"What is the ideal character length for a Title Tag?",opts:["10–20 characters","50–60 characters","100–120 characters","200+ characters"],correct:1,explain:"Title tags should be 50–60 characters. Longer titles get cut off in search results."},
  {q:"What does alt text on an image do for SEO?",opts:["Makes the image load faster","Changes the image color on mobile","Describes the image to Google and screen readers","Creates a clickable link"],correct:2,explain:"Alt text tells Google what an image shows — helping with Image Search and accessibility."},
  {q:"What is the BEST anchor text for an internal link to your keyword research page?",opts:["Click here","Read more","keyword research guide","this page"],correct:2,explain:"Descriptive anchor text like 'keyword research guide' tells Google what the linked page is about."},
  {q:"Which URL format is best for SEO?",opts:["yoursite.com/page?id=45","yoursite.com/SEO_GUIDE","yoursite.com/seo-guide-beginners","yoursite.com/p/123"],correct:2,explain:"Clean lowercase URLs with hyphens and keywords are best. Avoid query parameters and underscores."},
  {q:"A meta description should be approximately how long?",opts:["50 characters","150–160 characters","300 characters","500+ characters"],correct:1,explain:"Meta descriptions should be 150–160 characters. They don't rank directly but heavily influence CTR."},
  {q:"What image format gives the best quality-to-file-size ratio for web?",opts:["BMP","PNG","JPEG","WebP"],correct:3,explain:"WebP images are typically 25–35% smaller than JPEGs at the same quality."},
  {q:"'Hub-and-Spoke' internal linking means:",opts:["All pages link to homepage only","A pillar page links to cluster pages and vice versa","Linking only to external sites","Randomly linking pages"],correct:1,explain:"Hub-and-spoke: one pillar page links to detailed cluster pages, which all link back — building topical authority."}
],
m4:[
  {q:"What is an XML Sitemap used for?",opts:["Styling your website","Telling Google all your pages so it can find them","Blocking pages from Google","Speeding up JavaScript"],correct:1,explain:"An XML sitemap lists all your pages, submitted to Google Search Console so Googlebot can find and index them."},
  {q:"Your LCP is 4.5 seconds. What does this mean?",opts:["Excellent","Poor — main content loads too slowly","Average","LCP doesn't affect rankings"],correct:1,explain:"LCP should be under 2.5s. A 4.5s score is 'Poor' and can negatively impact rankings."},
  {q:"When should you use a 301 redirect?",opts:["A/B testing","Temporary page moves","Permanent URL moves","Broken pages"],correct:2,explain:"301 = permanent redirect (passes full SEO authority). Always use 301 when permanently moving pages."},
  {q:"What does robots.txt do?",opts:["Adds robot design to your site","Tells Googlebot which pages to crawl or skip","Speeds up page loading","Generates meta tags"],correct:1,explain:"robots.txt instructs crawlers which pages they're allowed to visit and which to skip."},
  {q:"Since 2023, Google primarily uses which version of your site for ranking?",opts:["Desktop version","Tablet version","Mobile version","AMP version"],correct:2,explain:"Google switched to mobile-first indexing — it crawls and ranks based on the mobile version."},
  {q:"CLS (Cumulative Layout Shift) measures:",opts:["How fast your page loads","How quickly your page responds to clicks","How much content jumps while loading","How many images are on your page"],correct:2,explain:"CLS measures visual stability — does content shift position while loading? Above 0.1 is considered poor."},
  {q:"A canonical tag tells Google:",opts:["To block a page","Which version of a duplicated URL is the 'official' one","How fast to crawl your site","Your preferred language"],correct:1,explain:"Canonical tags resolve duplicate content — they point Google to the 'master' version of a page."},
  {q:"The free tool to check your Core Web Vitals score is:",opts:["Google Keyword Planner","Google Trends","PageSpeed Insights","Google Business Profile"],correct:2,explain:"PageSpeed Insights is Google's free tool giving LCP, INP and CLS scores with specific recommendations."}
],
m5:[
  {q:"Google Search Console is primarily used for:",opts:["Running Google Ads","Monitoring search performance, errors and index status","Designing your website","Managing social media"],correct:1,explain:"GSC is Google's free tool showing how your site appears in search — clicks, impressions, coverage errors, and indexed pages."},
  {q:"In GSC, 'Impressions' means:",opts:["How many people bought your product","How many times your page appeared in search results","How many people clicked your page","Your site's load speed score"],correct:1,explain:"Impressions = how many times your page showed up in Google results, even if no one clicked it."},
  {q:"A page has 5,000 impressions and 25 clicks. Its CTR is:",opts:["0.05%","5%","0.5%","20%"],correct:2,explain:"CTR = (25 ÷ 5,000) × 100 = 0.5%. Low CTR usually means your title tag isn't compelling enough."},
  {q:"After creating a new page, the fastest way to get Google to index it is:",opts:["Wait 6 months","Submit the URL in GSC's URL Inspection → Request Indexing","Share it on Instagram","Delete and republish"],correct:1,explain:"GSC's URL Inspection lets you request indexing immediately — Google usually crawls it within hours."},
  {q:"Which GSC report shows what search queries bring visitors to your site?",opts:["Coverage Report","Core Web Vitals Report","Performance Report","Sitemaps Report"],correct:2,explain:"The Performance Report shows every query that triggered your site, with clicks, impressions, CTR and average position."},
  {q:"A 'Coverage Error' in GSC means:",opts:["Your site is too slow","A page couldn't be indexed because of an issue","You have too many keywords","Your images aren't optimized"],correct:1,explain:"Coverage errors mean Google tried to index a page but couldn't — these need to be fixed."},
  {q:"What does 'Average Position' mean in GSC?",opts:["Average page load speed","Average ranking position for queries","Number of indexed pages","Average CTR across pages"],correct:1,explain:"Average Position is the mean rank across all queries. Position 1 = top result. Position 11 = first result on page 2."},
  {q:"Google Analytics tracks:",opts:["How your pages rank","What keywords to target","What visitors do on your site — pages, time, source","Your backlink profile"],correct:2,explain:"Google Analytics shows visitor behaviour: where they came from, pages visited, time on site, and conversions."}
],
m6:[
  {q:"What is a backlink?",opts:["A link from one of your pages to another","A link from another website pointing to your site","A broken link","A paid advertisement"],correct:1,explain:"A backlink is any link from an external website to yours — they act as 'votes of trust' to Google."},
  {q:"Which backlink passes the MOST SEO authority?",opts:["A nofollow link from a major news site","A dofollow link from a high-authority niche site","A link from a link farm","A paid link from any site"],correct:1,explain:"Dofollow links from high-DR, topically relevant sites pass the most link equity."},
  {q:"The Skyscraper Technique means:",opts:["Building the tallest website","Find top-linked content → create better version → email linking sites","Copy competitor content","Buy links from popular sites"],correct:1,explain:"Find most-linked content → make a superior version → email sites that linked to the original."},
  {q:"You find a broken link on a popular blog. What should you do?",opts:["Nothing","Report to Google","Create replacement content and email the blogger","Copy their content"],correct:2,explain:"Broken Link Building: create quality replacement content, then politely email the webmaster."},
  {q:"Why should you NEVER buy links from '$5 for 100 backlinks' services?",opts:["Too expensive","Google detects unnatural links and can penalize your site","Takes too long","Backlinks don't affect rankings"],correct:1,explain:"Google's Penguin algorithm detects spammy link profiles. Bought links can trigger manual penalties — erasing all rankings."},
  {q:"What is Domain Rating (DR)?",opts:["How fast your domain loads","Ahrefs' score for your website's overall backlink authority (0–100)","Number of pages on your site","Your site's age"],correct:1,explain:"DR measures the strength of a site's entire backlink profile. Higher DR = more authority."},
  {q:"What does 'nofollow' mean on a link?",opts:["The link is broken","Google is told NOT to pass link authority through this link","The link opens in a new tab","The link is hidden"],correct:1,explain:"Nofollow tells Google not to pass PageRank through that link."},
  {q:"Digital PR for link building means:",opts:["Running Facebook ads","Creating newsworthy content and pitching to journalists","Paying influencers","Commenting on blogs with your link"],correct:1,explain:"Digital PR involves creating original research/surveys that journalists cover — earning links from major publications."}
],
m7:[
  {q:"The three factors Google uses to rank businesses in the Local Pack are:",opts:["Budget, Followers, Website Age","Proximity, Relevance, Prominence","Speed, Design, Content Length","Reviews, Photos, Phone Number"],correct:1,explain:"Google's local ranking uses: Proximity (distance), Relevance (does your business match?) and Prominence (how well-known online)."},
  {q:"NAP consistency means:",opts:["Your site loads fast","Name, Address and Phone must be identical everywhere online","Three versions of your website","No advertising policies"],correct:1,explain:"NAP = Name, Address, Phone. Inconsistencies across platforms confuse Google and hurt local rankings."},
  {q:"A Google Business Profile (GBP) is:",opts:["A paid advertising account","Google's FREE tool to manage how your business appears in Search and Maps","A website builder","A Google Analytics account"],correct:1,explain:"GBP is the free listing making your business appear in Google Maps and the local 3-pack."},
  {q:"A customer leaves a 3-star negative review. What is the BEST response?",opts:["Delete the review","Ignore it","Respond professionally, acknowledge the issue, and offer to make it right","Reply defensively"],correct:2,explain:"Professional responses show future customers you care — and signal to Google you're an active, trustworthy business."},
  {q:"A local dentist in Chennai should prioritize which keywords?",opts:["'dentist' (short-tail)","'best dental tips for health'","'dentist in Chennai' and 'teeth cleaning Chennai price'","'dental colleges in India'"],correct:2,explain:"Local businesses should target location + service keywords. 'Dentist in Chennai' brings patients ready to book."},
  {q:"What does the Local Pack (map box) show?",opts:["Paid Google Ads","The top 3 nearby businesses matching a local search","News articles about local events","Shopping product listings"],correct:1,explain:"The Local Pack shows 3 businesses on a map, appearing above organic results for location-intent searches."},
  {q:"Local citations are:",opts:["Customer reviews on your website","Mentions of your business NAP on other websites and directories","Backlinks from other cities","Paid listings"],correct:1,explain:"Citations are any online mention of your business Name, Address and Phone — on directories like Justdial, Sulekha etc."},
  {q:"What schema type should a local business add to their website?",opts:["Article Schema","Product Schema","LocalBusiness Schema","FAQ Schema"],correct:2,explain:"LocalBusiness Schema tells Google your exact business name, address, phone, hours and coordinates."}
],
m8:[
  {q:"E-E-A-T stands for:",opts:["Editing, Engaging, Analyzing, Tracking","Experience, Expertise, Authoritativeness, Trustworthiness","External, Embedded, Alt-text, Title","Engagement, Exposure, Authority, Traffic"],correct:1,explain:"E-E-A-T = Experience, Expertise, Authoritativeness, Trustworthiness — Google's framework for judging content quality."},
  {q:"Before writing a blog post, you should ALWAYS:",opts:["Think about website design","Count how many words to write","Analyze the top 5 SERP results to understand expected format and intent","Decide which social platform to share on"],correct:2,explain:"Analyzing top SERP results tells you what content format Google expects and how comprehensive your post needs to be."},
  {q:"A Pillar Page is:",opts:["Your first ever published page","A comprehensive page on a broad topic linking to detailed cluster sub-pages","Your homepage","A page with lots of images"],correct:1,explain:"A pillar page covers a broad topic and links to cluster pages that go deeper on each subtopic — building topical authority."},
  {q:"YMYL stands for:",opts:["Your Marketing Yearly Loss","Your Money or Your Life — topics where wrong information can seriously harm users","A YouTube marketing strategy","A keyword research technique"],correct:1,explain:"YMYL = Your Money or Your Life. Health, finance, legal topics get the strictest E-E-A-T review."},
  {q:"How long should a typical SEO blog post be?",opts:["Always exactly 300 words","Always 10,000+ words","Long enough to fully answer the query better than competitors","Word count doesn't matter"],correct:2,explain:"There's no magic word count. Match or exceed the depth of the top-ranking pages."},
  {q:"What is a 'content cluster' strategy?",opts:["Publishing random unrelated articles","Grouping related content around a pillar page to build topical authority","Only publishing in clusters of 10 articles","Copying clustered keywords"],correct:1,explain:"Content clusters group related articles around a central pillar page — signaling deep topical expertise to Google."},
  {q:"Which content format is BEST for targeting featured snippets?",opts:["Long-form 5,000 word essays","Paginated content split across many pages","Short direct answers to specific questions (100–300 words)","Image-only content"],correct:2,explain:"Featured snippets reward concise, direct answers formatted as a short paragraph or numbered list."},
  {q:"What makes AI-generated content acceptable to Google?",opts:["Using GPT-4","Adding personal experience, original data and genuine insights to the AI draft","Publishing more than 100 articles per day","Nothing — Google bans all AI content"],correct:1,explain:"Google allows AI content but penalizes 'scaled content abuse'. Enrich AI drafts with firsthand experience and original research."}
],
m9:[
  {q:"Screaming Frog is used for:",opts:["Social media automation","Crawling websites to find technical issues: broken links, missing tags, duplicate content","Keyword research","Building backlinks"],correct:1,explain:"Screaming Frog crawls every page and reports all technical SEO issues — identical to how Googlebot visits your site."},
  {q:"In Google Analytics, 'Bounce Rate' means:",opts:["How fast your pages load","% of visitors who leave after viewing only one page without interacting","Total pages on your site","How many backlinks you have"],correct:1,explain:"Bounce rate = visitors who land and leave without clicking anything else."},
  {q:"The correct fix for 404 errors on important pages is:",opts:["Delete them from your sitemap","Ignore them","Set up 301 redirects from old URLs to new page","Create brand new pages with different URLs"],correct:2,explain:"301 redirects preserve the SEO authority of deleted/moved pages."},
  {q:"DR (Domain Rating) measures:",opts:["How fast your domain loads","Overall strength of your website's backlink profile (0–100)","Number of pages on your site","Your website's age"],correct:1,explain:"DR is Ahrefs' metric for the strength of a site's entire backlink profile."},
  {q:"In an SEO audit, what should you fix FIRST?",opts:["Minor image filename improvements","Adding more social media buttons","Crawl errors and pages accidentally blocked from Google","Changing your website's color scheme"],correct:2,explain:"If Google can't crawl and index your pages, nothing else matters. Fixing crawl/index errors is always the highest priority."},
  {q:"What does 'Ahrefs Site Explorer' allow you to do?",opts:["Build a new website","Analyze any website's backlink profile, top pages and organic keywords","Auto-generate meta tags","Post content to social media"],correct:1,explain:"Site Explorer shows any website's backlinks, organic keywords, top pages and traffic estimates."},
  {q:"A 'redirect chain' in technical SEO is:",opts:["A backlink strategy","Multiple consecutive redirects (A→B→C→D) wasting crawl budget and diluting link equity","A list of all redirects","A way to speed up loading"],correct:1,explain:"Redirect chains (A→B→C) slow loads, confuse Googlebot and pass less link equity with each hop. Always redirect directly A→D."},
  {q:"Google's PageSpeed Insights scores pages on a scale of:",opts:["A to F letter grades","1 to 1,000","0 to 100 (Good 90+, Needs Improvement 50–89, Poor under 50)","Slow/Medium/Fast only"],correct:2,explain:"PageSpeed Insights scores 0–100. Above 90 = Good. 50–89 = Needs Improvement. Under 50 = Poor."}
],
m10:[
  {q:"Schema Markup (Structured Data) is:",opts:["A CSS framework","Special code helping Google understand your content to enable rich results","A type of XML sitemap","A Google Ads feature"],correct:1,explain:"Schema markup (JSON-LD) describes your content's details so Google can show richer results — star ratings, FAQs, prices."},
  {q:"Star ratings in Google search results are enabled by:",opts:["Having lots of reviews on your site","A large advertising budget","Product Schema with Review/Rating markup","Using WordPress"],correct:2,explain:"Rich snippet star ratings require Product + Review Schema markup."},
  {q:"Topical authority means:",opts:["Being popular on Twitter","Google recognizing your site as an expert by covering a subject comprehensively","Having the most backlinks","Ranking #1 for one keyword"],correct:1,explain:"Topical authority = Google's recognized expert on a subject, built through comprehensive pillar and cluster content."},
  {q:"Hreflang attributes tell Google:",opts:["Your site's load speed","Which language/region version to show to users in different countries","To translate content automatically","To block non-English users"],correct:1,explain:"hreflang tells Google which version to show to which audience — critical for international/multi-language sites."},
  {q:"A Featured Snippet is called 'Position 0' because:",opts:["It's the first paid ad","It appears ABOVE the #1 organic result","It's a Google Business Profile result","It's a YouTube video"],correct:1,explain:"Featured snippets appear above the #1 organic result — hence Position 0, often getting 20–50% of all clicks."},
  {q:"'Crawl budget' refers to:",opts:["Your SEO agency fee","The number of pages Googlebot will crawl on your site in a given time","The cost of Google Ads","How many backlinks Google tracks"],correct:1,explain:"Crawl budget is how many pages Google will crawl per day. Large sites need to ensure budget isn't wasted on low-value pages."},
  {q:"The Google Penguin update targeted:",opts:["Low-quality thin content","Slow-loading pages","Unnatural, spammy backlink profiles","Mobile-unfriendly websites"],correct:2,explain:"Penguin (2012) penalized sites with manipulative backlink profiles — fundamentally changing link building."},
  {q:"Log file analysis reveals:",opts:["What keywords to target","Exactly how Googlebot crawls your site — pages visited, frequency, errors","Your social media performance","Your email open rates"],correct:1,explain:"Server log files contain records of every Googlebot visit — invaluable for technical SEO audits."}
],
m11:[
  {q:"The biggest duplicate content challenge in e-commerce SEO is:",opts:["Having too many product images","Product variations (color, size) creating multiple near-identical URLs","Writing product descriptions","Managing shipping pages"],correct:1,explain:"Product variants (/shirt-blue, /shirt-red) create dozens of near-duplicate pages. Use canonical tags pointing to the main product page."},
  {q:"Which Schema type shows price and availability in Google results?",opts:["Article Schema","LocalBusiness Schema","Product Schema with Offer and Review types","FAQ Schema"],correct:2,explain:"Product Schema + Offer (price/availability) + Review (ratings) enables rich product snippets in search results."},
  {q:"Faceted navigation can harm SEO because:",opts:["It makes sites look unprofessional","Filter systems create thousands of URL combinations with thin, duplicate content","It slows product photography","It's not supported on mobile"],correct:1,explain:"Faceted navigation (filters like ?color=red&size=M) causes URL explosion — thousands of near-duplicate pages wasting crawl budget."},
  {q:"'Buy Nike Air Max size 10 India' is what type of keyword?",opts:["Informational","Navigational","Commercial research","Transactional — ready to purchase"],correct:3,explain:"'Buy' + specific product + size + location = clear transactional intent. This user is ready to purchase."},
  {q:"Breadcrumbs on e-commerce sites serve what purpose?",opts:["Display product ingredients","Show navigation path (Home>Electronics>Phones) helping users and Google understand structure","A cookie-consent notification","A product image gallery"],correct:1,explain:"Breadcrumbs appear in Google results, help users navigate back, and support BreadcrumbList schema."},
  {q:"Category pages in e-commerce should be optimized with:",opts:["Only images — no text","A short unique intro paragraph with target keywords above the product grid","Copied manufacturer descriptions","The same title tag as product pages"],correct:1,explain:"Category pages need unique, keyword-rich intro content (100–300 words) above the product grid."},
  {q:"What is the best approach to product description SEO?",opts:["Copy from manufacturer","Use same description on all similar products","Write unique benefit-focused descriptions with relevant keywords for every product","Descriptions don't affect rankings"],correct:2,explain:"Unique product descriptions prevent duplicate content penalties and give Google something valuable to index."},
  {q:"Google Shopping results are triggered by:",opts:["Standard website SEO","Submitting a product feed to Google Merchant Center","Blog content about your products","Getting more customer reviews"],correct:1,explain:"Google Shopping requires a properly formatted product feed submitted to Google Merchant Center."}
],
m12:[
  {q:"Google's AI-powered search feature showing a summary at the top of results is called:",opts:["Google Bard Search","AI Overviews","Google RankBrain","Featured Snippets 2.0"],correct:1,explain:"Google AI Overviews shows an AI-generated summary at the top of search results, sometimes reducing organic click-through rates."},
  {q:"The correct approach to AI-generated content for SEO is:",opts:["Never use AI — Google bans all of it","Publish raw AI content in bulk","Use AI as a starting point, then add personal experience, original data and insights","AI content always ranks better"],correct:2,explain:"Google allows AI content but penalizes 'scaled content abuse'. Always enrich AI drafts with firsthand experience."},
  {q:"Voice search optimization requires targeting:",opts:["Only podcast content","Conversational natural-language question phrases","Audio files on every page","Voice search doesn't affect SEO"],correct:1,explain:"Voice searches are conversational and longer. Target natural question phrases and FAQ content."},
  {q:"Entity SEO is about:",opts:["SEO for entity websites only","Google's shift to understanding real-world entities (people, brands, places) and their relationships","A type of technical audit","Schema markup only"],correct:1,explain:"Google's Knowledge Graph understands entities. Entity SEO means making your brand a recognizable, authoritative entity."},
  {q:"After completing this course, the MOST important next step is:",opts:["Re-read everything before doing anything","Build your own website and apply what you've learned","Wait for SEO to change before starting","Master only one module at a time"],correct:1,explain:"Hands-on practice is irreplaceable. Build a real site, target real keywords, and apply every concept."},
  {q:"What is 'First-Party Data' and why does it matter?",opts:["Data bought from third parties","Data you collect directly from your audience (emails, accounts) which remains valuable as cookies phase out","Google Analytics data only","Social media follower counts"],correct:1,explain:"As third-party cookies disappear, first-party data (email lists, user accounts you own) becomes crucial."},
  {q:"The March 2024 Google Core Update primarily targeted:",opts:["Sites with slow page speed","Sites with unnatural backlinks","Sites with mass AI-generated content with no human review or value","Sites without HTTPS"],correct:2,explain:"The March 2024 update deindexed hundreds of sites relying on mass AI content. Always add genuine human value."},
  {q:"'Visual Search' optimization means:",opts:["Making your website look beautiful","Optimizing images for Google Lens: high-quality images, descriptive filenames, alt text, Image Schema","Adding more videos to homepage","Using only vector graphics"],correct:1,explain:"Google Lens searches are growing 50% YoY. Optimize images with descriptive filenames, alt text, Image Schema and an image sitemap."}
]
};

/* ── QUIZ ENGINE ── */
const PASS_THRESHOLD = 40; // 40% = 2 out of 5 correct
const lastShownQuestions = {};

function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pickQuestions(moduleId, count) {
  const pool    = QUESTION_BANK[moduleId] || [];
  const last    = lastShownQuestions[moduleId] || [];
  let shuffled  = shuffleArray(pool);
  let preferred = shuffled.filter((_, i) => !last.includes(i));
  if (preferred.length < count) preferred = shuffled;
  const picked  = preferred.slice(0, count);
  lastShownQuestions[moduleId] = picked.map(q => pool.indexOf(q));
  return picked;
}

function renderQuiz(moduleId) {
  const container = document.getElementById(moduleId + '-quiz');
  if (!container) return;

  const questions = pickQuestions(moduleId, 5);
  container.innerHTML = '';

  questions.forEach((qData, i) => {
    const indices = shuffleArray([0, 1, 2, 3]);
    const qEl     = document.createElement('div');
    qEl.className = 'quiz-q';
    qEl.id        = moduleId + '-q' + i;

    let optionsHTML = '';
    indices.forEach((origIdx, newIdx) => {
      const letter      = ['A', 'B', 'C', 'D'][newIdx];
      const isCorrect   = origIdx === qData.correct;
      const typeArg     = isCorrect ? ",'correct'" : ",'wrong'";
      optionsHTML += `<button class="quiz-option" onclick="checkAnswer(this${typeArg},'${moduleId}-q${i}')">${letter}. ${qData.opts[origIdx]}</button>\n`;
    });

    qEl.innerHTML = `
      <p>${i + 1}. ${qData.q}</p>
      ${optionsHTML}
      <div class="quiz-explain" style="display:none">\u{1F4A1} ${qData.explain}</div>
    `;
    container.appendChild(qEl);
  });
}

// ── KEY FIX: checkAnswer stores data-user-correct so scoreQuiz is accurate ──
function checkAnswer(el, type, qId) {
  const quizQ = qId ? document.getElementById(qId) : el.closest('.quiz-q');
  if (!quizQ || quizQ.dataset.answered) return;

  quizQ.dataset.answered   = '1';
  // ★ This is what was missing: tracking correctness via a data attribute
  quizQ.dataset.userCorrect = (type === 'correct') ? '1' : '0';

  quizQ.querySelectorAll('.quiz-option').forEach(opt => {
    opt.style.pointerEvents = 'none';
    opt.classList.remove('correct', 'wrong');
  });

  el.classList.add(type);

  if (type === 'wrong') {
    // Highlight the correct answer so the learner can see what was right.
    // This adds .correct to the correct button — but scoreQuiz no longer
    // counts .correct elements; it reads data-user-correct instead.
    quizQ.querySelectorAll('.quiz-option').forEach(opt => {
      const oc = opt.getAttribute('onclick') || '';
      if (oc.includes(",'correct'")) opt.classList.add('correct');
    });
  }

  const explain = quizQ.querySelector('.quiz-explain');
  if (explain) explain.style.display = 'block';

  if (!quizQ.querySelector('.answer-msg')) {
    const msg = document.createElement('div');
    msg.className = 'answer-msg';
    msg.style.cssText = 'margin-top:8px;font-size:0.82rem;font-weight:600;padding:8px 12px;border-radius:8px;';
    if (type === 'correct') {
      msg.style.cssText += 'background:#f0fdf4;color:#166534;';
      msg.textContent = '✅ Correct!';
    } else {
      msg.style.cssText += 'background:#fef2f2;color:#991b1b;';
      msg.textContent = '❌ Not quite — correct answer highlighted above.';
    }
    quizQ.appendChild(msg);
  }
}

// ── KEY FIX: scoreQuiz reads data-user-correct, not .quiz-option.correct ──
function scoreQuiz(moduleId) {
  const quizDiv  = document.getElementById(moduleId + '-quiz');
  const scoreDiv = document.getElementById(moduleId + '-score');
  if (!quizDiv || !scoreDiv) return;

  const questions = quizDiv.querySelectorAll('.quiz-q');
  const total     = questions.length;

  // --- Require all questions to be answered before scoring ---
  let unanswered = 0;
  questions.forEach(q => { if (!q.dataset.answered) unanswered++; });

  if (unanswered > 0) {
    scoreDiv.style.cssText = 'display:block;padding:16px 20px;border-radius:12px;font-size:0.9rem;line-height:1.6;background:#fffbeb;color:#92400e;border:1.5px solid rgba(245,158,11,0.4);';
    scoreDiv.innerHTML = '⚠️ <strong>Please answer all ' + total + ' questions before checking your score.</strong> You have <strong>' + unanswered + '</strong> unanswered question(s) remaining.';
    scoreDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    return;
  }

  // --- Count correct answers using data-user-correct (the fix!) ---
  let correct = 0;
  questions.forEach(q => {
    if (q.dataset.userCorrect === '1') correct++;
  });

  const pct    = Math.round((correct / total) * 100);
  const passed = pct >= PASS_THRESHOLD;

  let emoji, msg, bg, color;
  if (pct === 100)    { emoji = '🏆'; msg = 'Perfect score! Outstanding work.';                                                   bg = '#f0fdf4'; color = '#166534'; }
  else if (pct >= 80) { emoji = '🌟'; msg = 'Excellent! Module unlocked.';                                                       bg = '#eff6ff'; color = '#1e3a8a'; }
  else if (pct >= 60) { emoji = '👍'; msg = 'Good job! Review the explanations below.';                                          bg = '#fffbeb'; color = '#92400e'; }
  else if (pct >= 40) { emoji = '✅'; msg = 'Passed! Next module unlocked. Review what you missed and keep going!';              bg = '#f0fdf4'; color = '#166534'; }
  else                { emoji = '📚'; msg = 'Score below 40% — review the module content and click "New Questions" to try again!'; bg = '#fef2f2'; color = '#991b1b'; }

  scoreDiv.style.cssText = 'display:block;padding:16px 20px;border-radius:12px;font-size:0.9rem;line-height:1.6;background:' + bg + ';color:' + color + ';border:1.5px solid ' + color + '33;';
  scoreDiv.innerHTML = '<strong style="font-size:1.1rem">' + emoji + ' ' + correct + ' / ' + total + ' correct (' + pct + '%)</strong><br>' + msg;
  scoreDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

  if (passed) {
    markCompleted(moduleId);
    const banner = document.getElementById(moduleId + '-unlock-banner');
    if (banner) banner.classList.add('show');
  }
}

function retryQuiz(moduleId) {
  const scoreDiv = document.getElementById(moduleId + '-score');
  if (scoreDiv) scoreDiv.style.display = 'none';
  const banner = document.getElementById(moduleId + '-unlock-banner');
  if (banner) banner.classList.remove('show');
  renderQuiz(moduleId);
  const card = document.getElementById(moduleId + '-quiz-card');
  if (card) card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Initialise all quizzes on load
moduleOrder.forEach(mid => renderQuiz(mid));
