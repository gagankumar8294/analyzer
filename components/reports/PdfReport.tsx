import React from 'react';
import {
  Document, Page, Text, View, StyleSheet, Font
} from '@react-pdf/renderer';
import type { AnalysisResult } from '@/lib/types/analysis';
import { formatCount } from '@/lib/utils/engagement';

// ── Styles ──────────────────────────────────────────────────────────────────
const S = StyleSheet.create({
  page: { fontFamily: 'Helvetica', backgroundColor: '#0A0A0F', color: '#F0F0F8', padding: 40, fontSize: 10 },
  pageLight: { fontFamily: 'Helvetica', backgroundColor: '#F8F8FC', color: '#111', padding: 40, fontSize: 10 },

  // Cover
  coverBrand: { backgroundColor: '#E1306C', borderRadius: 8, padding: '4 12', marginBottom: 20, alignSelf: 'flex-start' },
  coverBrandText: { color: '#fff', fontSize: 9, fontFamily: 'Helvetica-Bold', letterSpacing: 1 },
  coverTitle: { fontSize: 28, fontFamily: 'Helvetica-Bold', color: '#F0F0F8', marginBottom: 6, lineHeight: 1.2 },
  coverSubtitle: { fontSize: 13, color: '#888', marginBottom: 30 },

  // Sections
  sectionTitle: { fontSize: 14, fontFamily: 'Helvetica-Bold', color: '#F0F0F8', marginBottom: 12, paddingBottom: 6, borderBottom: '1 solid #222' },
  sectionTitleLight: { fontSize: 14, fontFamily: 'Helvetica-Bold', color: '#111', marginBottom: 12, paddingBottom: 6, borderBottom: '1 solid #ddd' },

  // Profile
  profileRow: { flexDirection: 'row', gap: 20, marginBottom: 20, alignItems: 'flex-start' },
  profileName: { fontSize: 18, fontFamily: 'Helvetica-Bold', color: '#F0F0F8', marginBottom: 2 },
  profileHandle: { fontSize: 10, color: '#888', marginBottom: 4 },
  profileBio: { fontSize: 9, color: '#aaa', lineHeight: 1.5, maxWidth: 380 },

  // Stat cards row
  statsRow: { flexDirection: 'row', gap: 10, marginBottom: 20, flexWrap: 'wrap' },
  statCard: { flex: 1, backgroundColor: '#151520', border: '1 solid #222', borderRadius: 8, padding: 12, minWidth: 90, alignItems: 'center' },
  statValue: { fontSize: 16, fontFamily: 'Helvetica-Bold', color: '#E1306C', marginBottom: 2 },
  statLabel: { fontSize: 8, color: '#888', textAlign: 'center' },

  // Score row
  scoreRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap', marginBottom: 20 },
  scoreCard: { backgroundColor: '#151520', border: '1 solid #222', borderRadius: 8, padding: 10, alignItems: 'center', minWidth: 80 },
  scoreVal: { fontSize: 18, fontFamily: 'Helvetica-Bold', color: '#E1306C' },
  scoreLabel: { fontSize: 7, color: '#888', marginTop: 2, textAlign: 'center' },

  // SWOT
  swotGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 16 },
  swotCard: { flex: 1, minWidth: '45%', border: '1 solid #222', borderRadius: 8, padding: 12, backgroundColor: '#151520' },
  swotTitle: { fontSize: 9, fontFamily: 'Helvetica-Bold', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 },
  swotItem: { fontSize: 8, color: '#bbb', marginBottom: 4, lineHeight: 1.4 },

  // Calendar
  calGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  calCard: { width: '30%', border: '1 solid #222', borderRadius: 6, padding: 8, backgroundColor: '#151520', marginBottom: 8 },
  calWeek: { fontSize: 7, color: '#E1306C', fontFamily: 'Helvetica-Bold', marginBottom: 2 },
  calTheme: { fontSize: 8, fontFamily: 'Helvetica-Bold', color: '#F0F0F8', marginBottom: 1 },
  calFormat: { fontSize: 7, color: '#888' },

  // Recs
  recItem: { flexDirection: 'row', gap: 8, marginBottom: 8, alignItems: 'flex-start' },
  recBullet: { width: 16, height: 16, backgroundColor: '#1a0a10', borderRadius: 8, border: '1 solid #E1306C', alignItems: 'center', justifyContent: 'center' },
  recNum: { fontSize: 7, color: '#E1306C', fontFamily: 'Helvetica-Bold' },
  recText: { fontSize: 8, color: '#bbb', flex: 1, lineHeight: 1.4 },

  // Footer
  footer: { position: 'absolute', bottom: 24, left: 40, right: 40, flexDirection: 'row', justifyContent: 'space-between', borderTop: '1 solid #1a1a2a', paddingTop: 8 },
  footerText: { fontSize: 7, color: '#444' },

  // Competitor card
  compCard: { border: '1 solid #222', borderRadius: 8, padding: 12, backgroundColor: '#151520', marginBottom: 8 },
  compHandle: { fontSize: 10, fontFamily: 'Helvetica-Bold', color: '#F0F0F8', marginBottom: 2 },
  compReason: { fontSize: 8, color: '#999', lineHeight: 1.4 },

  mb4: { marginBottom: 4 },
  mb8: { marginBottom: 8 },
  mb16: { marginBottom: 16 },
  mb24: { marginBottom: 24 },
});

const Footer = ({ username }: { username: string }) => (
  <View style={S.footer} fixed>
    <Text style={S.footerText}>InstaAnalyzer · @{username}</Text>
    <Text style={S.footerText} render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} />
  </View>
);

// ── Main PDF Document ────────────────────────────────────────────────────────
export function PdfReport({ data }: { data: AnalysisResult }) {
  const { profile, scores, posts, insights, competitors, calendar } = data;

  const totalEng = posts.reduce((s, p) => s + p.likes + p.comments, 0);
  const avgEng = posts.length ? totalEng / posts.length : 0;
  const er = profile.followers > 0 ? ((avgEng / profile.followers) * 100).toFixed(2) : '0.00';
  const overallScore = Math.round(
    [scores.engagement, scores.branding, scores.seo, scores.postingConsistency]
      .reduce((a, b) => a + (b ?? 0), 0) / 4
  );

  const generatedAt = new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <Document title={`${profile.username} Instagram Analysis`} author="InstaAnalyzer" subject="Instagram Growth Intelligence Report">

      {/* ── Page 1: Cover ── */}
      <Page size="A4" style={S.page}>
        <View style={S.coverBrand}><Text style={S.coverBrandText}>INSTAGRAM GROWTH INTELLIGENCE</Text></View>
        <Text style={S.coverTitle}>{profile.fullName || profile.username}</Text>
        <Text style={S.coverSubtitle}>@{profile.username} · Generated {generatedAt}</Text>
        {profile.bio ? <Text style={{ fontSize: 10, color: '#888', lineHeight: 1.5, maxWidth: 420, marginBottom: 30 }}>{profile.bio}</Text> : null}

        {/* Key stats */}
        <View style={S.statsRow}>
          <View style={S.statCard}><Text style={S.statValue}>{formatCount(profile.followers)}</Text><Text style={S.statLabel}>Followers</Text></View>
          <View style={S.statCard}><Text style={S.statValue}>{profile.totalPosts}</Text><Text style={S.statLabel}>Total Posts</Text></View>
          <View style={S.statCard}><Text style={S.statValue}>{er}%</Text><Text style={S.statLabel}>Eng. Rate</Text></View>
          <View style={S.statCard}><Text style={S.statValue}>{overallScore}</Text><Text style={S.statLabel}>Overall Score</Text></View>
        </View>

        {/* Performance scores */}
        <Text style={S.sectionTitle}>Performance Scores</Text>
        <View style={S.scoreRow}>
          {[
            { label: 'Engagement', value: scores.engagement ?? 0 },
            { label: 'Branding', value: scores.branding ?? 0 },
            { label: 'SEO & Tags', value: scores.seo ?? 0 },
            { label: 'Consistency', value: scores.postingConsistency ?? 0 },
            { label: 'Growth', value: scores.growth ?? scores.engagement ?? 0 },
          ].map(s => (
            <View key={s.label} style={S.scoreCard}>
              <Text style={S.scoreVal}>{s.value}%</Text>
              <Text style={S.scoreLabel}>{s.label}</Text>
            </View>
          ))}
        </View>

        {data.aiSummary && (
          <>
            <Text style={[S.sectionTitle, { marginTop: 16 }]}>AI Profile Summary</Text>
            <Text style={{ fontSize: 9, color: '#ccc', lineHeight: 1.6 }}>{data.aiSummary}</Text>
          </>
        )}

        <Footer username={profile.username} />
      </Page>

      {/* ── Page 2: SWOT Analysis ── */}
      <Page size="A4" style={S.page}>
        <Text style={S.sectionTitle}>SWOT Analysis</Text>
        <View style={S.swotGrid}>
          {[
            { title: 'Strengths', color: '#4ADE80', items: insights?.strengths ?? [] },
            { title: 'Weaknesses', color: '#FCD34D', items: insights?.weaknesses ?? [] },
            { title: 'Opportunities', color: '#60A5FA', items: insights?.opportunities ?? [] },
            { title: 'Threats', color: '#F87171', items: insights?.threats ?? [] },
          ].map(section => (
            <View key={section.title} style={S.swotCard}>
              <Text style={[S.swotTitle, { color: section.color }]}>{section.title}</Text>
              {section.items.slice(0, 5).map((item: string, i: number) => (
                <Text key={i} style={S.swotItem}>• {item}</Text>
              ))}
            </View>
          ))}
        </View>

        {/* Recommendations */}
        {insights?.recommendations?.length > 0 && (
          <>
            <Text style={[S.sectionTitle, { marginTop: 20 }]}>AI Recommendations</Text>
            {(insights.recommendations as string[]).slice(0, 8).map((rec, i) => (
              <View key={i} style={S.recItem}>
                <View style={S.recBullet}><Text style={S.recNum}>{i + 1}</Text></View>
                <Text style={S.recText}>{rec}</Text>
              </View>
            ))}
          </>
        )}

        <Footer username={profile.username} />
      </Page>

      {/* ── Page 3: Competitors ── */}
      {competitors && competitors.length > 0 && (
        <Page size="A4" style={S.page}>
          <Text style={S.sectionTitle}>Competitor Analysis</Text>
          {(competitors as any[]).slice(0, 6).map((comp: any, i: number) => {
            const handle = comp.username ?? comp.handle ?? `competitor${i + 1}`;
            return (
              <View key={i} style={S.compCard}>
                <Text style={S.compHandle}>@{handle}</Text>
                {comp.followers > 0 && <Text style={{ fontSize: 8, color: '#888', marginBottom: 4 }}>Followers: {formatCount(comp.followers)}</Text>}
                {comp.reason && <Text style={S.compReason}>{comp.reason}</Text>}
                {comp.strengths?.length > 0 && <Text style={{ fontSize: 7, color: '#4ADE80', marginTop: 4 }}>✓ {comp.strengths[0]}</Text>}
              </View>
            );
          })}
          <Footer username={profile.username} />
        </Page>
      )}

      {/* ── Page 4: 90-Day Content Calendar ── */}
      {calendar && (calendar as any[]).length > 0 && (
        <Page size="A4" style={S.page}>
          <Text style={S.sectionTitle}>90-Day Content Calendar</Text>
          <View style={S.calGrid}>
            {(calendar as any[]).slice(0, 12).map((entry: any, i: number) => (
              <View key={i} style={S.calCard}>
                <Text style={S.calWeek}>{entry.week ?? `Week ${i + 1}`}</Text>
                <Text style={S.calTheme}>{entry.theme ?? entry.topic ?? 'Content Theme'}</Text>
                <Text style={S.calFormat}>{entry.format ?? entry.type ?? 'Mixed'}</Text>
              </View>
            ))}
          </View>
          <Footer username={profile.username} />
        </Page>
      )}

    </Document>
  );
}
