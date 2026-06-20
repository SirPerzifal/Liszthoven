import { useParams, Link } from "react-router";
import {
  Calendar,
  User,
  Clock,
  ArrowLeft,
  ArrowRight,
  Share2,
} from "lucide-react";
import { motion } from "motion/react";

const articleData: Record<string, any> = {
  "summer-program": {
    title: "Summer Intensive Program Announced",
    date: "May 10, 2026",
    category: "Programs",
    author: "Emily Rodriguez",
    readTime: "5 min read",
    image:
      "https://images.unsplash.com/photo-1511379938547-c1f69419868d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1200",
    content: `
      <p>We're thrilled to announce our Summer Intensive Program, a transformative 6-week experience designed for serious music students who want to take their skills to the next level.</p>

      <h2>Program Highlights</h2>
      <p>The Summer Intensive offers an unparalleled opportunity to immerse yourself in music education under the guidance of our world-class faculty. From June 20 to August 1, students will experience:</p>

      <ul>
        <li>Daily one-on-one instruction with master teachers</li>
        <li>Weekly masterclasses with guest artists</li>
        <li>Ensemble and chamber music coaching</li>
        <li>Music theory and ear training workshops</li>
        <li>Performance opportunities every week</li>
        <li>Recording session experience</li>
      </ul>

      <h2>Who Should Apply</h2>
      <p>This program is ideal for intermediate to advanced students aged 14-18 who are considering a career in music or preparing for college auditions. We accept students on piano, strings, woodwinds, brass, percussion, voice, and guitar.</p>

      <h2>Schedule & Structure</h2>
      <p>Students will participate in 6 hours of instruction daily, Monday through Friday, with optional Saturday workshops. The program culminates in a grand finale concert featuring all participants.</p>

      <h2>Tuition & Registration</h2>
      <p>Early bird tuition (register by May 31): $2,400<br/>
      Regular tuition: $2,800<br/>
      Scholarships available based on merit and need.</p>

      <p>Registration opens on May 15. Space is limited to 40 students to ensure personalized attention. Don't miss this opportunity to accelerate your musical growth!</p>
    `,
    relatedArticles: ["competition-winners", "new-instructor"],
  },
  "competition-winners": {
    title: "Students Win Regional Competition",
    date: "May 8, 2026",
    category: "Achievements",
    author: "Michael Chen",
    readTime: "4 min read",
    image:
      "https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1200",
    content: `
      <p>In a stunning display of musical excellence, three Liszthoven Academy students took top honors at the Regional Music Competition last weekend, showcasing exceptional performances that left judges and audiences in awe.</p>

      <h2>First Place Winners</h2>
      <p>Sophia Chen, 16, won first place in the piano division with a breathtaking performance of Rachmaninoff's Piano Concerto No. 2. "Sophia's technical mastery combined with her emotional depth made for an unforgettable performance," said head judge Dr. Robert Williams.</p>

      <p>In the strings division, Marcus Johnson, 15, took top honors with his interpretation of Sibelius' Violin Concerto. His impeccable intonation and passionate delivery earned him a standing ovation from the audience.</p>

      <h2>Excellence in Vocal Performance</h2>
      <p>Emma Rodriguez, 17, secured first place in the vocal category with a stunning rendition of "Song to the Moon" from Dvořák's Rusalka. Her crystalline tone and dramatic interpretation showcased the exceptional vocal training she's received at Liszthoven Academy.</p>

      <h2>Preparation & Training</h2>
      <p>All three students credit their success to the dedicated instruction and support they've received from Liszthoven Academy faculty. "The one-on-one attention and performance opportunities we get here are invaluable," said Sophia.</p>

      <p>Congratulations to our winners! We're incredibly proud of their achievements and look forward to seeing them continue to excel.</p>
    `,
    relatedArticles: ["summer-program", "practice-tips"],
  },
  "new-instructor": {
    title: "Welcoming Renowned Violinist to Faculty",
    date: "May 5, 2026",
    category: "Faculty",
    author: "Sarah Mitchell",
    readTime: "3 min read",
    image:
      "https://images.unsplash.com/photo-1566913485268-1287f67f87fe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1200",
    content: `
      <p>Liszthoven Academy is proud to welcome Maria Santos, an internationally acclaimed violinist, to our distinguished faculty beginning this fall.</p>

      <h2>A Distinguished Career</h2>
      <p>Maria brings over 25 years of performing and teaching experience to Liszthoven Academy. She has performed as a soloist with major orchestras worldwide, including the New York Philharmonic, London Symphony Orchestra, and Vienna Philharmonic.</p>

      <p>Her discography includes critically acclaimed recordings of violin concertos by Brahms, Tchaikovsky, and Sibelius. She has won numerous awards, including the prestigious Paganini Competition and the Queen Elisabeth Competition.</p>

      <h2>Educational Background</h2>
      <p>Maria is a graduate of the Juilliard School, where she studied with the legendary Dorothy DeLay. She also holds a doctorate in music from Indiana University and has served on the faculty of the Curtis Institute of Music.</p>

      <h2>Teaching Philosophy</h2>
      <p>"I believe in nurturing each student's unique musical voice while building a solid technical foundation," says Maria. "My goal is to help students discover the joy and depth of musical expression while preparing them for successful careers."</p>

      <h2>Available Lessons</h2>
      <p>Maria will be accepting a limited number of advanced violin students for private lessons starting in September. She will also offer monthly masterclasses open to all string students.</p>

      <p>We're honored to have Maria join our team and look forward to the invaluable expertise she'll bring to our students.</p>
    `,
    relatedArticles: ["summer-program", "scholarship-announcement"],
  },
};

export default function ArticleDetail() {
  const { id } = useParams();
  const article = articleData[id || "summer-program"];

  if (!article) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Article Not Found</h1>
          <Link to="/news" className="text-gold hover:underline">
            Back to News
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background">
      {/* Hero */}
      <section className="relative h-[60vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={article.image}
            alt={article.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/50" />
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-white">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Link
              to="/news"
              className="inline-flex items-center gap-2 text-gold hover:text-gold-light transition-colors mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to News
            </Link>
            <div className="inline-block mb-4 px-4 py-2 bg-gold/20 border border-gold rounded-full text-gold text-sm">
              {article.category}
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              {article.title}
            </h1>
            <div className="flex flex-wrap gap-6 text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gold" />
                <span>{article.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-gold" />
                <span>{article.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-gold" />
                <span>{article.readTime}</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Article Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="prose prose-lg max-w-none prose-headings:text-foreground prose-p:text-muted-foreground prose-strong:text-foreground prose-a:text-gold prose-a:no-underline hover:prose-a:underline prose-ul:text-muted-foreground prose-ol:text-muted-foreground"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />

        {/* Share */}
        <div className="mt-12 pt-8 border-t border-border">
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Published on {article.date} by {article.author}
            </div>
            <button className="flex items-center gap-2 text-gold hover:text-gold-light transition-colors">
              <Share2 className="w-4 h-4" />
              <span className="text-sm font-medium">Share Article</span>
            </button>
          </div>
        </div>

        {/* Related Articles */}
        {article.relatedArticles && article.relatedArticles.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold mb-8">Related Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {article.relatedArticles.map((relatedId: string) => {
                const related = articleData[relatedId];
                if (!related) return null;

                return (
                  <Link
                    key={relatedId}
                    to={`/news/${relatedId}`}
                    className="group bg-card rounded-xl overflow-hidden border border-border hover:border-gold transition-all duration-300"
                  >
                    <div className="relative h-40 overflow-hidden">
                      <img
                        src={related.image}
                        alt={related.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-6">
                      <div className="text-xs text-gold mb-2">
                        {related.category}
                      </div>
                      <h3 className="font-semibold mb-2 group-hover:text-gold transition-colors">
                        {related.title}
                      </h3>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span>{related.date}</span>
                        <span>•</span>
                        <span>{related.readTime}</span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* CTA */}
      <section className="py-16 bg-muted">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Subscribe to our newsletter for the latest news and updates
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 bg-gold text-primary px-8 py-4 rounded-lg font-semibold hover:bg-gold-light transition-all"
            >
              Subscribe Now
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
