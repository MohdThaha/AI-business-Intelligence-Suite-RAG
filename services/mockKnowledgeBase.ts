// services/mockKnowledgeBase.ts

interface Document {
  id: string;
  title: string;
  content: string;
  metadata: {
    date: string; // YYYY-MM-DD
    source: string;
    tags: string[];
  };
}

// --- Start of Programmatic Data Generation ---
// This script generates a large, realistic mock knowledge base to simulate
// a real-world enterprise environment for the RAG system.

const products = ["Pro Widget", "Mega Gadget", "Eco Module", "Synergy Hub", "Quantum Link", "Nova Core", "Flexi-Connector", "Data-Streamer"];
const regions = ["North America", "Europe", "Asia-Pacific", "Latin America", "MEA"];
const sources = ["Salesforce", "Marketing Hub", "Zendesk", "Jira", "HRIS", "Finance Dept", "Competitive Intel Team", "Product Board"];
const competitors = ["InnovateCorp", "FutureTech", "QuantumLeap Inc.", "DataWeavers", "Synergy Solutions"];
const sentiments = ["overwhelmingly positive", "generally positive", "mixed", "somewhat negative", "largely negative"];

const getRandomElement = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
const getRandomNumber = (min: number, max: number, decimals: number = 2): number => {
    const str = (Math.random() * (max - min) + min).toFixed(decimals);
    return parseFloat(str);
};

const getRandomDate = (startYear: number, endYear: number): Date => {
    const year = Math.floor(Math.random() * (endYear - startYear + 1)) + startYear;
    const month = Math.floor(Math.random() * 12);
    const day = Math.floor(Math.random() * 28) + 1;
    return new Date(year, month, day);
};

const formatDate = (date: Date): string => {
    return date.toISOString().split('T')[0];
};

const generatedDocs: Document[] = [];
const NUM_DOCS_TO_GENERATE = 500;

for (let i = 0; i < NUM_DOCS_TO_GENERATE; i++) {
    const category = getRandomElement(['Sales', 'Marketing', 'Support', 'Product', 'HR', 'Competitive']);
    const date = getRandomDate(2022, 2024);
    const year = date.getFullYear();
    const quarter = Math.floor(date.getMonth() / 3) + 1;
    const monthName = date.toLocaleString('default', { month: 'long' });
    const product = getRandomElement(products);
    const id = `${category.toLowerCase()}_${i}_${date.getTime()}`;

    let title = '';
    let content = '';
    let source = '';
    let tags: string[] = [];
    
    switch (category) {
        case 'Sales':
            const region = getRandomElement(regions);
            const revenue = getRandomNumber(0.5, 5.0, 1);
            const change = getRandomNumber(-15, 25, 1);
            const changeDir = change >= 0 ? 'increase' : 'decrease';
            title = `Q${quarter} ${year} Sales Summary for ${product} in ${region}`;
            content = `In Q${quarter} ${year}, sales for the ${product} in ${region} reached $${revenue}M. This represents a ${Math.abs(change)}% ${changeDir} compared to the previous quarter. The performance was driven by strong demand in the enterprise segment and successful upselling initiatives.`;
            source = 'Salesforce';
            tags = ['sales', `q${quarter}`, `${year}`, product.toLowerCase().replace(' ', '-'), region.toLowerCase().replace(' ', '-')];
            break;
        
        case 'Marketing':
            const campaignName = `${getRandomElement(['Spring', 'Summer', 'Fall', 'Winter'])} ${getRandomElement(['Ignite', 'Growth', 'Connect', 'Launch'])}`;
            const cpa = getRandomNumber(15, 50, 2);
            const signups = Math.floor(getRandomNumber(1000, 20000, 0));
            title = `Performance Review: '${campaignName}' Campaign`;
            content = `The '${campaignName}' campaign, which ran in ${monthName} ${year}, concluded successfully. It generated ${signups} new user sign-ups with an average Cost Per Acquisition (CPA) of $${cpa}. The primary channels were Google Ads and Social Media, with email marketing providing strong support.`;
            source = 'Marketing Hub';
            tags = ['marketing', 'campaign', `${year}`, 'cpa', 'sign-ups'];
            break;

        case 'Support':
            const ticketVolume = Math.floor(getRandomNumber(500, 2500, 0));
            const satisfaction = getRandomNumber(85, 98, 1);
            const issue = getRandomElement(['data sync errors', 'login authentication problems', 'UI rendering bugs', 'billing questions', 'feature requests']);
            title = `${monthName} ${year} Customer Support Ticket Analysis for ${product}`;
            content = `During ${monthName} ${year}, we handled ${ticketVolume} support tickets related to ${product}. The overall customer satisfaction score was ${satisfaction}%. The most frequently reported issue was '${issue}', accounting for approximately ${getRandomNumber(5, 25, 0)}% of the tickets. Our engineering team is investigating the root cause.`;
            source = 'Zendesk';
            tags = ['support', 'tickets', `${year}`, product.toLowerCase().replace(' ', '-'), 'csat'];
            break;

        case 'Product':
            const version = `${getRandomNumber(1, 4, 0)}.${getRandomNumber(0, 9, 0)}.${getRandomNumber(0, 9, 0)}`;
            const sentiment = getRandomElement(sentiments);
            title = `User Feedback on ${product} v${version} Release`;
            content = `The release of ${product} version ${version} on ${formatDate(new Date(date.getTime() - 15 * 24 * 60 * 60 * 1000))} has garnered significant user feedback. Initial sentiment analysis indicates that the response is ${sentiment}. Users are praising the new customizable dashboard but have raised concerns about changes to the export workflow.`;
            source = 'Product Board';
            tags = ['product', 'feedback', 'release', `v${version}`, sentiment.split(' ')[1]];
            break;

        case 'HR':
            const headcount = Math.floor(getRandomNumber(500, 1500, 0));
            const turnover = getRandomNumber(1, 5, 1);
            const engagement = getRandomNumber(70, 90, 0);
            title = `Q${quarter} ${year} Human Resources & People Operations Report`;
            content = `As of the end of Q${quarter} ${year}, total company headcount stands at ${headcount} employees. Quarterly employee turnover was ${turnover}%. The recent employee engagement survey yielded a participation rate of 92% and an overall engagement score of ${engagement}%.`;
            source = 'HRIS';
            tags = ['hr', 'headcount', 'turnover', 'engagement', `q${quarter}`, `${year}`];
            break;

        case 'Competitive':
            const competitor = getRandomElement(competitors);
            const competitorProduct = `${getRandomElement(['Apex', 'Zenith', 'Fusion', 'Matrix'])} ${getRandomElement(['Platform', 'Suite', 'OS', 'Connect'])}`;
            title = `Competitive Intel Brief: ${competitor}'s Latest Move`;
            content = `Our intelligence team has confirmed that ${competitor} is launching a new product, the '${competitorProduct}', on ${formatDate(new Date(date.getTime() + 30 * 24 * 60 * 60 * 1000))}. This product appears to be a direct competitor to our ${product}. Initial reports suggest their pricing will be highly aggressive to capture market share.`;
            source = 'Competitive Intel Team';
            tags = ['competitor', competitor.toLowerCase(), 'strategy', product.toLowerCase().replace(' ', '-')];
            break;
    }
    
    generatedDocs.push({ id, title, content, metadata: { date: formatDate(date), source, tags } });
}

// --- End of Programmatic Data Generation ---


// We include the original, hand-crafted documents to ensure that the
// example prompts on the UI have guaranteed, high-quality context available.
const handCraftedDocuments: Document[] = [
  // --- Sales Data ---
  {
    id: 'sales_q1_2024',
    title: 'Q1 2024 Sales Report',
    content: 'Q1 2024 concluded with total revenue of $6.8M, a strong 12% increase YoY. North America was the leading region with $3.1M. Europe followed with $2.5M, and Asia contributed $1.2M. The "Pro Widget" was the top seller at $2.2M, while the "Mega Gadget" brought in $1.8M. The newly launched "Eco Module" had a promising start with $0.5M in sales.',
    metadata: { date: '2024-04-05', source: 'Salesforce', tags: ['sales', 'revenue', 'q1', '2024', 'pro widget', 'mega gadget'] }
  },
  {
    id: 'sales_q2_2024',
    title: 'Q2 2024 Sales Report',
    content: 'Q2 2024 saw continued growth, with total revenue reaching $7.5M. This marks a 10% increase from Q1. North America sales grew to $3.5M, while Europe saw a slight increase to $2.7M. Asia experienced strong growth, reaching $1.3M. "Pro Widget" sales were particularly strong in Europe, totaling $1.1M for the region. The "Eco Module" sales doubled to $1.0M, showing strong market adoption.',
    metadata: { date: '2024-07-08', source: 'Salesforce', tags: ['sales', 'revenue', 'q2', '2024', 'pro widget', 'eco module'] }
  },
  {
    id: 'sales_na_deepdive_q1_2024',
    title: 'North America Sales Deep Dive - Q1 2024',
    content: 'In North America, Q1 sales of the "Pro Widget" were $1.2M. The "Mega Gadget" accounted for $0.9M. The enterprise sales team closed 3 major deals worth over $250k each, contributing significantly to the regional performance.',
    metadata: { date: '2024-04-10', source: 'Sales Analytics Team', tags: ['sales', 'north america', 'q1', '2024', 'pro widget'] }
  },
    {
    id: 'sales_eu_deepdive_q1_2024',
    title: 'Europe Sales Deep Dive - Q1 2024',
    content: 'European sales for the "Pro Widget" in Q1 were $0.8M. The "Mega Gadget" performed well, with $0.7M in sales. The UK and Germany were the top two performing countries in the region.',
    metadata: { date: '2024-04-12', source: 'Sales Analytics Team', tags: ['sales', 'europe', 'q1', '2024', 'pro widget'] }
  },
  // --- Marketing Data ---
  {
    id: 'mktg_q2_2024_campaign',
    title: "Q2 'Summer Splash' Campaign Performance",
    content: "The 'Summer Splash' marketing campaign ran from May to June 2024 with a total budget of $400k. The campaign generated 15,000 new user sign-ups. Google Ads had the lowest CPA at $22, driving 8,000 sign-ups. Social media (Meta/TikTok) had a CPA of $30 and drove 5,000 sign-ups. The campaign correlated with a 15% increase in website traffic and a notable lift in 'Eco Module' sales during the period.",
    metadata: { date: '2024-07-02', source: 'Marketing Hub', tags: ['marketing', 'campaign', 'q2', '2024', 'roi', 'cpa', 'sign-ups'] }
  },
  {
    id: 'mktg_content_2024',
    title: 'Content Marketing Performance H1 2024',
    content: 'In the first half of 2024, our blog traffic grew by 30%. The top-performing articles were "5 Ways to Boost Productivity with the Pro Widget" and "Is the Eco Module Right For Your Business?". These two articles generated over 500 marketing qualified leads (MQLs).',
    metadata: { date: '2024-07-15', source: 'Marketing Hub', tags: ['marketing', 'content', 'h1', '2024', 'mqls'] }
  },
  // --- Product & Customer Support ---
  {
    id: 'support_phoenix_update',
    title: 'Customer Feedback on Phoenix App Update (v3.0)',
    content: 'The Phoenix v3.0 update was released on May 15, 2024. Initial sentiment is mixed. A post-update survey with 1,000 users showed a 65% positive sentiment score, down from 75% for v2.9. Users praise the new customizable dashboard but criticize the removal of the legacy reporting feature. Support tickets increased by 20% in the week following the release. The most common bug report is a data synchronization issue on Android devices, affecting an estimated 5% of the user base. A hotfix is planned.',
    metadata: { date: '2024-05-25', source: 'Zendesk Analytics', tags: ['product', 'customer support', 'app update', 'phoenix', 'sentiment', 'bugs'] }
  },
    {
    id: 'product_roadmap_h2_2024',
    title: 'Product Roadmap H2 2024',
    content: 'Key initiatives for the second half of 2024 include: 1) Internationalization of the Phoenix App, adding support for Spanish and German. 2) Launching "Pro Widget v2" with enhanced AI features. 3) Re-introducing an improved version of the legacy reporting feature based on user feedback.',
    metadata: { date: '2024-06-20', source: 'Product Board', tags: ['product', 'roadmap', 'h2', '2024', 'phoenix'] }
  },
  // --- Competitive Analysis ---
  {
    id: 'comp_innovatecorp_q2',
    title: 'Competitive Analysis: InnovateCorp Q2 2024',
    content: "Our main competitor, InnovateCorp, launched their 'Synergy Hub' product in April. It directly competes with our 'Mega Gadget'. Their pricing is 10% lower than ours. Marketing intelligence suggests they are heavily investing in influencer marketing and have poached a key sales director from a rival firm. They appear to be targeting mid-market customers, a segment where we have been traditionally strong.",
    metadata: { date: '2024-06-30', source: 'Competitive Intel Team', tags: ['competitor', 'innovatecorp', 'q2', '2024', 'strategy'] }
  },
];


export const documents: Document[] = [...handCraftedDocuments, ...generatedDocs];
