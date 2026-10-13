import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('data/posts.json', 'r', encoding='utf-8') as f:
    posts = json.load(f)

# 1. youtube-izlenme-nasil-sayilir-24-agustos-2026-yeni-kural
p1 = next(x for x in posts if x['slug'] == 'youtube-izlenme-nasil-sayilir-24-agustos-2026-yeni-kural')
p1['title_en'] = 'How YouTube Views Are Counted: The August 2026 Policy Update'
p1['summary_en'] = 'YouTube now registers views the moment playback begins. Here is what the new rule means for music artists, ad campaigns, and YouTube Studio analytics.'
p1['category_en'] = 'How-To Guide'
p1['readTime_en'] = '6 min'
p1['authorRole_en'] = 'YouTube Ads Specialist'
p1['quickFact_en'] = 'Effective August 24, 2026, YouTube counts a public view the moment playback initiates across Shorts, long-form videos, and live streams. However, ad billing metrics and partner program watch time remain governed by separate verification criteria.'
p1['table_en'] = {
    'caption': 'YouTube View Counting Metrics & Policy Comparison',
    'headers': ['Metric / Surface', 'Pre-August 2026 Rule', 'New August 2026 Policy', 'Studio Analytics Impact'],
    'rows': [
        ['Public View Count', '~30 Seconds Threshold', 'Playback Start Trigger', 'Early interest indicator'],
        ['Shorts Views', 'Dynamic swipe threshold', 'Immediate playback start', 'Reflects stream initiation'],
        ['TrueView Ad Billing', '30s or full completion', 'Unchanged (10-30s / interaction)', 'Separately billed & reported'],
        ['Watch Time (Hours)', 'Cumulative actual duration', 'Unchanged (Actual minutes)', 'Core metric for algorithm']
    ]
}
p1['faqs_en'] = [
    {
        'question': 'Does YouTube count a view immediately when a video starts?',
        'answer': 'Yes. Under the updated policy effective August 24, 2026, a public view starts logging as playback begins. However, low-quality or automated impressions are filtered retrospectively by YouTube spam algorithms.'
    },
    {
        'question': 'Does this change how YouTube Partner Program (monetization) watch time is calculated?',
        'answer': 'No. The 4,000 valid public watch hours threshold still relies strictly on actual minutes watched, not on raw start triggers.'
    },
    {
        'question': 'How does this affect Google Ads video campaigns?',
        'answer': 'Official Google Ads views contribute to public counters upon playback start, while TrueView ad billing strictly adheres to its contract standards (30 seconds, completion, or user click).'
    },
    {
        'question': 'Which metric should music artists focus on most?',
        'answer': 'Audience retention and average percentage viewed remain the top algorithmic ranking signals. The opening 5 to 15 seconds determine whether YouTube suggests the music video to wider audiences.'
    }
]
p1['paragraphs_en'] = [
    "YouTube now counts a view the moment a video begins playing. According to Google's official \"How engagement metrics are counted\" support documentation, this rule applies across Shorts, long-form uploads, and live streams starting August 24, 2026. This means the public counter reflects how many playbacks have started, rather than how many viewers watched through to the end.",
    "In this guide, we break down what the policy update shifts, which analytics music artists should prioritize, and how advertising impressions fit into this new structure, backed by official Google documentation and verified industry reports.",
    "### What does the updated rule state?",
    "Google's support documentation specifies that views are registered \"the moment playback begins.\" The same guidelines note that low-quality plays may be excluded, and numbers can be adjusted retrospectively as spam detection audits finalize.",
    "Previously, an informal \"approximately 30-second\" benchmark was widely cited across the industry for long-form content. Because YouTube never formalized that threshold everywhere, conflicting interpretations persisted. The updated wording provides clarity across formats.",
    "### Why raw view count is no longer a standalone success metric",
    "Because an impression registers upon playback start, that count includes viewers who exit within the first second. Consequently, public view counts now serve as an indicator of initial discovery interest, while deeper metrics determine genuine engagement.",
    "For artists launching a music video, the following analytics are far more critical:",
    "1. Average view duration: The average number of minutes watched, revealing precisely where listeners drop off in the arrangement.",
    "2. Audience retention curve: Located in YouTube Studio under Analytics > Engagement, showing second-by-second retention and replay spikes.",
    "3. Traffic source breakdown: How views distribute between Suggested Videos, YouTube Search, Shorts Feed, External, and YouTube Advertising. For promoted videos, this verifies official origin.",
    "### Do advertising views count toward the public view total?",
    "Yes. Google's support documentation confirms that views from video ads contribute to a video's public view counter. The platform distinguishes between TrueView billed views (charged to advertisers based on duration or action) and general YouTube views that increment the public tally upon playback start.",
    "To learn how to verify this traffic in YouTube Studio and review specific thresholds, explore our detailed guide on [Are views from YouTube ads included in public counts?](/en/blog/youtube-reklamindan-gelen-izlenme-sayiya-dahil-mi-studio).",
    "### Are monetization and the YouTube Partner Program affected?",
    "Earnings and YouTube Partner Program eligibility depend on watch hours and qualified Shorts views, not on raw start counters. Always consult YouTube Studio's Earn tab and official support pages for current thresholds. Our [4,000 Watch Hours Guide](/en/blog/youtube-4000-saat-izlenme-suresi-nasil-doldurulur-para-kazanma-rehberi) details monetization milestones.",
    "### Key takeaways for musicians and record labels",
    "While view counts may climb faster in the first 48 hours, YouTube algorithms evaluate session depth, completion rates, and audience response. Strong visual hooks and immediate song engagement in the first 10 seconds are more vital than ever.",
    "For strategic launch preparation, read our [First 48 Hours Algorithm Guide for Music Videos](/en/blog/muzik-kliplerinde-ilk-48-saat-algoritma-rehberi) and our [YouTube Premiere Launch Guide](/en/blog/youtube-premiere-nasil-yapilir-muzik-klibi-lansman-adimlari)."
]
p1['tags_en'] = ['YouTube View Counting', 'YouTube Algorithm 2026', 'YouTube Analytics', 'Music Video Promotion', 'Video PR Strategy']

# 2. youtube-reklamindan-gelen-izlenme-sayiya-dahil-mi-studio
p2 = next(x for x in posts if x['slug'] == 'youtube-reklamindan-gelen-izlenme-sayiya-dahil-mi-studio')
p2['title_en'] = 'Are Views from YouTube Ads Included in Public Counts? Studio Verification'
p2['summary_en'] = 'Views from official ads count toward your public counter. Learn the difference between TrueView and general views, and how to verify YouTube Advertising traffic in Studio.'
p2['category_en'] = 'Official Video PR & Google Ads'
p2['readTime_en'] = '7 min'
p2['authorRole_en'] = 'Google Partner Ads Strategist'
p2['quickFact_en'] = 'Yes, views generated through official Google Ads video campaigns are fully included in YouTube public view counts. In YouTube Studio Analytics, they are permanently recorded under the "YouTube Advertising" traffic source with zero risk of algorithmic penalties.'
p2['table_en'] = {
    'caption': 'YouTube Ads vs Bot Traffic Verification in YouTube Studio',
    'headers': ['Verification Metric', 'Official Google Ads (MedyaPR)', 'Third-Party SMM / Bot Panels'],
    'rows': [
        ['Traffic Source Log', 'YouTube Advertising (Legitimate)', 'Direct or Unknown (High Risk)'],
        ['Public View Increment', 'Permanent & Verified by Google', 'Routinely purged during audits'],
        ['Channel Safety', '100% YPP & Monetization Safe', 'Risk of shadowban or termination'],
        ['Audience Interaction', 'Real listeners: likes, comments, subs', 'Zero organic engagement or fans'],
        ['Reporting Quality', 'Detailed Google Ads analytics report', 'Unverified panel screenshots']
    ]
}
p2['faqs_en'] = [
    {
        'question': 'Do views purchased through Google Ads count toward public views?',
        'answer': 'Yes. When an ad runs on YouTube, qualifying playbacks increment the public view counter displayed on the video page.'
    },
    {
        'question': 'How do I confirm my views came from official ads in YouTube Studio?',
        'answer': 'Go to YouTube Studio > Analytics > Content > Traffic Source. You will see "YouTube Advertising" clearly listed with detailed view counts and watch time.'
    },
    {
        'question': 'What is the difference between TrueView views and public counter views?',
        'answer': 'TrueView views determine advertiser billing (typically 30 seconds or user click), whereas the public view count follows YouTube playback metrics.'
    },
    {
        'question': 'Do ad views count toward 4,000 hours for channel monetization?',
        'answer': 'No. Google policy explicitly excludes paid ad watch hours from the 4,000 public watch hours requirement for the YouTube Partner Program, preventing artificial qualification.'
    },
    {
        'question': 'Can my channel be banned for running YouTube ads?',
        'answer': 'Never. Google Ads is YouTube\'s native, official promotion platform and fully adheres to Community Guidelines and Partner Program policies.'
    }
]
p2['paragraphs_en'] = [
    "One of the most frequent questions from artists and labels is whether views generated through YouTube ads count toward the public view tally visible on the video. The answer is an unequivocal yes: official advertising views increment your public counter and are permanently logged.",
    "In this guide, we clarify the technical distinction between TrueView billing and public view counters, explain how to verify your traffic source inside YouTube Studio, and demonstrate why official Google Ads campaigns protect channel authority.",
    "### How Google Ads views increment the public counter",
    "When a skippable In-Stream or Shorts feed ad is delivered, Google's playback engine registers the view on the video's public counter. Unlike illegitimate third-party panels that send automated bot requests, Google Ads operates within YouTube's native video delivery architecture.",
    "This means the numbers reflected on your video page are legitimate, certified by Google, and immune to algorithmic wipeouts during routine platform cleanups.",
    "### Understanding TrueView vs. General Public Views",
    "Google separates two core concepts:",
    "1. TrueView Billed Views: The metric that determines advertiser charges. For skippable in-stream ads, a TrueView view occurs when a viewer watches 30 seconds (or the full video if shorter) or engages with an interactive element.",
    "2. General YouTube Views: The public counter on the video page. Under current platform rules, public view counters increment upon playback start while filtering malicious or bot activity.",
    "### How to verify your traffic in YouTube Studio",
    "To independently verify that your campaign was executed through official Google Ads channels:",
    "1. Open YouTube Studio on your computer or mobile app.",
    "2. Navigate to Content and select your music video.",
    "3. Click Analytics and switch to the Reach tab.",
    "4. Scroll down to Traffic Source Types. You should see \"YouTube Advertising\" clearly displayed.",
    "5. Click \"See More\" to examine country-by-country breakdown, average watch time, and demographics.",
    "If an agency claims to run Google Ads but your analytics show \"Direct or Unknown\" or \"External\" traffic without \"YouTube Advertising,\" the views were likely delivered via third-party emulators rather than official ad inventory.",
    "### Why official ads trigger organic recommendations",
    "When targeted correctly by musical genre, geography, and age demographics, real viewers engage with your music video. YouTube's recommendation engine evaluates positive interaction signals—such as likes, comments, and playlist adds—which often spurs organic distribution in Suggested Videos.",
    "### Phased security with MedyaPR",
    "MedyaPR operates certified Google Partner video campaigns with a 50/50 phased payment framework: 50% upon official Google Ads approval, and the remaining 50% upon verified campaign delivery.",
    "Check our transparent [pricing calculator](/en#calculator) to configure your release package."
]
p2['tags_en'] = ['YouTube Ad Views', 'TrueView Analytics', 'YouTube Advertising Source', 'Google Ads Video Campaign', 'YouTube Studio Verification']

# 3. youtube-premiere-nasil-yapilir-muzik-klibi-lansman-adimlari
p3 = next(x for x in posts if x['slug'] == 'youtube-premiere-nasil-yapilir-muzik-klibi-lansman-adimlari')
p3['title_en'] = 'How to Host a YouTube Premiere: Music Video Launch Playbook'
p3['summary_en'] = 'Set up a YouTube Premiere step by step: scheduling, countdown themes, live chat, and reminders. Official best practices and key limits for music video launches.'
p3['category_en'] = 'How-To Guide'
p3['readTime_en'] = '8 min'
p3['authorRole_en'] = 'Music Video Producer'
p3['quickFact_en'] = 'YouTube Premiere creates a shareable watch page with live countdown and real-time chat before public release. Viewers watching the Premiere contribute directly to the video\'s cumulative view counter once the broadcast finishes.'
p3['table_en'] = {
    'caption': 'YouTube Premiere Launch Timeline for Music Videos',
    'headers': ['Phase', 'Timeframe', 'Key Actions', 'Algorithmic Goal'],
    'rows': [
        ['Pre-Launch Setup', '3-7 Days Before', 'Schedule Premiere, custom thumbnail, teaser trailer', 'Build watch page notifications'],
        ['Countdown Window', '30 Minutes Before', 'Join Live Chat, pin social links, greet early fans', 'Maximize initial live concurrency'],
        ['Live Broadcast', 'Release Time (00:00)', 'Live chat interaction, observe real-time retention', 'Concentrate initial velocity'],
        ['Post-Premiere Phase', 'First 48 Hours', 'Review analytics, trigger Google Ads video push', 'Sustain organic recommendations']
    ]
}
p3['faqs_en'] = [
    {
        'question': 'How far in advance should I schedule a YouTube Premiere for a music video?',
        'answer': '3 to 7 days in advance is optimal. This provides sufficient time for fans to set reminders without losing campaign momentum.'
    },
    {
        'question': 'Do views during a YouTube Premiere count toward total views?',
        'answer': 'Yes. All views accumulated during the Premiere broadcast transfer seamlessly to the video\'s permanent view counter.'
    },
    {
        'question': 'Can I edit or replace the video file after scheduling a Premiere?',
        'answer': 'No. Once a video is uploaded and scheduled as a Premiere, the file cannot be replaced without deleting the upload and creating a new watch page.'
    },
    {
        'question': 'Is live chat saved after the Premiere concludes?',
        'answer': 'Yes, if you keep \"Chat Replay\" enabled in video settings, subsequent viewers can re-watch the live comments synchronized with the song.'
    }
]
p3['paragraphs_en'] = [
    "A YouTube Premiere transforms a standard video upload into a live collective event. For musicians and record labels, it provides a dedicated landing page where fans can chat, set reminders, and experience the video debut together in real time.",
    "In this comprehensive walkthrough, we explain how to set up a YouTube Premiere step-by-step, utilize countdown themes, moderate live chat, and leverage launch momentum for algorithmic success.",
    "### Why use YouTube Premiere for music releases?",
    "A Premiere offers unique advantages over a standard scheduled release:",
    "1. Shareable Watch Page: You receive a public URL days before release to distribute across Instagram, TikTok, and press releases.",
    "2. Reminder Notifications: Viewers who click \"Notify Me\" receive an automated push notification 30 minutes before launch and at broadcast start.",
    "3. Real-Time Fan Engagement: Artists can actively engage in live chat while the video plays without managing a live streaming rig.",
    "### Step-by-Step: Setting up your Premiere",
    "1. Upload your finished video in full resolution via YouTube Studio.",
    "2. On the Visibility tab, select \"Schedule\" and check \"Set as Premiere.\"",
    "3. Choose your release date and time. Friday afternoons or evenings generally capture optimal weekend traffic.",
    "4. Customize Premiere settings: select a countdown theme that matches your music genre (e.g., Cinematic, Retro, Dramatic) and pick a countdown duration (1 to 5 minutes).",
    "5. Upload a high-contrast thumbnail designed specifically for the waiting room page.",
    "### Moderating live chat like a pro",
    "1. Pin a welcoming comment with streaming links (Spotify, Apple Music) and social channels.",
    "2. Assign trusted moderators to monitor spam and abusive language.",
    "3. Enable slow mode if you anticipate high message velocity.",
    "4. Ensure \"Chat Replay\" remains active so later viewers can experience the community excitement.",
    "### What happens after the Premiere finishes?",
    "Once the broadcast concludes, the video automatically transitions into a standard public YouTube upload. All concurrent viewers and playbacks convert into permanent video views, preserving launch momentum.",
    "To maximize post-premiere reach, review our [First 48 Hours Algorithm Guide](/en/blog/muzik-kliplerinde-ilk-48-saat-algoritma-rehberi) and consider amplifying your release with an official [Google Ads Video Campaign](/en/blog/youtube-klip-tanitimi-google-ads-rehberi)."
]
p3['tags_en'] = ['YouTube Premiere', 'Music Video Launch', 'YouTube Premiere Setup', 'Release Strategy', 'Artist Playbook']

# 4. cover-sarki-youtube-telif-content-id-rehberi
p4 = next(x for x in posts if x['slug'] == 'cover-sarki-youtube-telif-content-id-rehberi')
p4['title_en'] = 'Can You Upload Cover Songs to YouTube? Content ID & Copyright Guide'
p4['summary_en'] = 'What happens when you upload a cover? How Content ID claims work, revenue sharing guidelines, and what Studio notifications mean under official YouTube rules.'
p4['category_en'] = 'How-To Guide'
p4['readTime_en'] = '6 min'
p4['authorRole_en'] = 'Music Copyright Consultant'
p4['quickFact_en'] = 'Uploading your own vocal/instrumental recording of a copyright-protected song triggers a Content ID claim from music publishers. For monetized YouTube Partner channels, eligible covers qualify for automated ad revenue sharing rather than copyright strikes.'
p4['table_en'] = {
    'caption': 'Content ID Claim vs. Copyright Strike on YouTube Covers',
    'headers': ['Feature', 'Content ID Claim (Standard)', 'Copyright Strike (DMCA Takedown)'],
    'rows': [
        ['Origin', 'Automated audio/composition match', 'Formal legal takedown notice'],
        ['Channel Health', 'Zero negative impact on standing', 'Penalizes account standing (3 strikes = termination)'],
        ['Monetization', 'Revenue shared or claimed by publisher', 'Video removed, zero monetization'],
        ['Action Needed', 'None (if composition claim accepted)', 'Submit counter-notification or resolve with claimant']
    ]
}
p4['faqs_en'] = [
    {
        'question': 'Can I make money from cover songs on YouTube?',
        'answer': 'Yes, if your channel is in the YouTube Partner Program and the music publisher agrees to revenue sharing, ads run and earnings are divided proportionally.'
    },
    {
        'question': 'Is a Content ID claim the same as a copyright strike?',
        'answer': 'No. A Content ID claim is an automated administrative notification that manages monetization or tracking without penalizing channel standing.'
    },
    {
        'question': 'Can I use the original artist\'s instrumental backing track?',
        'answer': 'No. Using the master recording infringes sound recording rights and can result in takedowns. A true cover requires 100% original instrumentation and vocals.'
    },
    {
        'question': 'How do I check copyright claims on my cover video?',
        'answer': 'Go to YouTube Studio > Content. Hover over the Restrictions column next to your video to view detailed claim information and monetization status.'
    }
]
p4['paragraphs_en'] = [
    "Uploading a cover song is one of the fastest ways for vocalists and musicians to gain initial traction on YouTube. However, navigating music copyright, automated Content ID claims, and monetization requires a clear understanding of platform policies.",
    "This guide explains what happens behind the scenes in YouTube Studio when you release a cover, how automated revenue sharing operates, and how to protect your channel from copyright strikes.",
    "### Understanding Content ID on cover songs",
    "Every musical work involves two separate copyright layers:",
    "1. The Composition Right (Lyrics and Melody): Owned by songwriters and music publishers.",
    "2. The Sound Recording / Master Right: Owned by the recording artist and record label.",
    "When you record your own vocals and instrumentation, you are creating a new sound recording of an existing composition. YouTube's Content ID system identifies the melodic progression and automatically files a composition claim on behalf of publishers.",
    "### Content ID claim vs. Copyright Strike",
    "It is vital to distinguish between a routine Content ID claim and a severe Copyright Strike:",
    "- Content ID Claim: An automated notice stating that music in your video belongs to a publisher. It does not issue a strike, damage channel health, or restrict account privileges.",
    "- Copyright Strike: A formal legal DMCA takedown notice submitted by a copyright holder. Receiving 3 active copyright strikes results in account termination.",
    "### How revenue sharing works on eligible covers",
    "Under YouTube Partner Program policies, creators can share ad revenue on eligible cover songs once publishers claim the composition. When eligible, YouTube Studio displays a green and grey split revenue icon, dividing ad proceeds proportionally between creator and publisher.",
    "To enable revenue sharing:",
    "1. Ensure your channel is an approved YouTube Partner Program member.",
    "2. Record 100% original vocals and backing tracks (never use third-party karaoke files or original masters).",
    "3. Set monetization to \"On\" in YouTube Studio and accept automated publisher terms.",
    "### 4 rules before uploading your cover",
    "1. Re-record all audio elements independently from scratch.",
    "2. Credit the original songwriters and artists prominently in the description.",
    "3. Monitor YouTube Studio Restrictions immediately after uploading.",
    "4. Use cover videos to direct traffic toward your original music and discography.",
    "For advice on converting cover viewers into fans of your original work, explore our [YouTube Channel Growth Playbook](/en/blog/youtube-sifirdan-100-bin-aboneye-ulasma-tavsiyeleri) and our [Official Artist Channel Guide](/en/blog/youtube-resmi-sanatci-kanali-notasi-nasil-alinir)."
]
p4['tags_en'] = ['Cover Song Copyright', 'Content ID YouTube', 'Music Licensing', 'Cover Monetization', 'Musician Guide']

# 5. youtube-shorts-reklami-nasil-verilir-muzik-klibi-demand-gen
p5 = next(x for x in posts if x['slug'] == 'youtube-shorts-reklami-nasil-verilir-muzik-klibi-demand-gen')
p5['title_en'] = 'How to Run YouTube Shorts Ads: Demand Gen Guide for Musicians'
p5['summary_en'] = 'Shorts ads cannot be bought as standalone inventory. Demand Gen campaigns deliver across Shorts, Discover, and YouTube. Here is what artists need to know.'
p5['category_en'] = 'Official Video PR & Google Ads'
p5['readTime_en'] = '6 min'
p5['authorRole_en'] = 'Demand Gen & Video PR Specialist'
p5['quickFact_en'] = 'YouTube Shorts ads are delivered through Google Ads Demand Gen and Video Reach campaigns rather than isolated standalone inventory. Viewers can swipe directly to the full music video, Spotify link, or channel page.'
p5['table_en'] = {
    'caption': 'YouTube Shorts Ads vs In-Stream Video Ads for Music Releases',
    'headers': ['Advertising Format', 'Primary Placement', 'Aspect Ratio', 'Optimal Objective'],
    'rows': [
        ['YouTube Shorts Ads', 'Shorts Vertical Feed', '9:16 Vertical (1080x1920)', 'Viral song hook & discovery'],
        ['Skippable In-Stream Ads', 'Before/during long videos', '16:9 Landscape (1920x1080)', 'Complete music video view'],
        ['In-Feed Discovery Ads', 'Search & Suggested lists', '16:9 Landscape thumbnail', 'Intent-based fan acquisition'],
        ['Demand Gen Multi-Format', 'Shorts + Discover + Gmail', 'Vertical + Landscape mixed', 'Omnichannel music campaign']
    ]
}
p5['faqs_en'] = [
    {
        'question': 'Can I run ads exclusively on YouTube Shorts without other placements?',
        'answer': 'Google Ads distributes video inventory across multiple surfaces within campaign types like Demand Gen and Video Reach. However, by providing 9:16 vertical creative assets, the system prioritizes Shorts inventory.'
    },
    {
        'question': 'How are views counted on YouTube Shorts ads?',
        'answer': 'TrueView billed views occur when a user watches at least 10 seconds or clicks an ad call-to-action. Public counters follow standard playback start guidelines.'
    },
    {
        'question': 'What is the ideal video duration for a Shorts music ad?',
        'answer': '15 to 30 seconds focusing on the catchiest chorus or visual highlight delivers the highest view completion and click-through rates.'
    },
    {
        'question': 'Can a Shorts ad direct listeners to Spotify or Apple Music?',
        'answer': 'Yes. You can configure the call-to-action button to navigate to an external landing page, SmartURL, or directly to the full music video on YouTube.'
    }
]
p5['paragraphs_en'] = [
    "With billions of daily views, YouTube Shorts has become a premier engine for music discovery and viral trends. However, setting up paid advertising in the Shorts feed requires navigating Google Ads campaign structures effectively.",
    "In this guide, we explain how Shorts ads operate within Demand Gen and Video campaigns, how impressions are measured, and how musicians can craft compelling vertical creatives that drive streams.",
    "### How Shorts ads are structured in Google Ads",
    "A frequent misconception is that Google Ads offers an isolated \"Shorts Only\" campaign toggle. Under official Google advertising architecture, Shorts placements are served through Demand Gen campaigns, Video Reach campaigns, and Video Views campaigns.",
    "Demand Gen automatically distributes creative assets across YouTube Shorts, in-stream inventory, Google Discover, and Gmail to maximize viewer conversion.",
    "### How views are counted in Shorts advertising",
    "Measurement in the Shorts feed operates on two distinct tiers:",
    "1. TrueView Billed Views: The advertiser is charged when a user engages with a call-to-action button or watches the vertical video for at least 10 seconds.",
    "2. Public YouTube Views: General public counters increment upon playback initiation, with automated spam filtering applied continuously.",
    "For full details on verification thresholds, read our breakdown on [Are views from YouTube ads included in public counts?](/en/blog/youtube-reklamindan-gelen-izlenme-sayiya-dahil-mi-studio).",
    "### 5 steps to prepare a high-converting Shorts ad",
    "1. Cut a dedicated 9:16 vertical snippet highlighting your most infectious chorus or visual climax.",
    "2. Hook viewers in the first 3 seconds with on-screen kinetic captions and immediate melody.",
    "3. Set a clear Call to Action (e.g., \"Listen Now\" or \"Watch Full Video\").",
    "4. Target listeners by musical genre, competitor artist affinities, and regional demographics.",
    "5. Monitor your traffic in YouTube Studio under Reach > Traffic Source > YouTube Advertising.",
    "### Combining organic Shorts with paid promotion",
    "Organic Shorts uploads build authentic community over time, while targeted Google Ads campaigns inject immediate volume during release week. Running both concurrently accelerates algorithm recognition.",
    "Learn organic strategies in our [How to Make Your Song Viral on YouTube Shorts Guide](/en/blog/youtube-shorts-ile-sarkinizi-nasil-viral-yaparsiniz) or calculate custom promotion packages on our [pricing calculator](/en#calculator)."
]
p5['tags_en'] = ['YouTube Shorts Ads', 'Demand Gen Campaign', 'Vertical Video PR', 'Music Video Marketing', 'Google Ads Shorts']

with open('data/posts.json', 'w', encoding='utf-8') as f:
    json.dump(posts, f, ensure_ascii=False, indent=2)

print("Successfully translated and saved all 5 blog posts!")
