import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

const articlesMeta: Record<string, { title: string; excerpt: string; imageUrl: string }> = {
  art_01: {
    title: 'Mengenal Angkatan Muda Rasio (PAMUR): Sejarah, Asas, dan Filosofi Perguruan',
    excerpt: 'Menelusuri jejak langkah pendirian PAMUR sejak 1951 di Madura oleh Raden Hasan Habudin serta prinsip rasio dalam gerak pencak silat.',
    imageUrl: 'https://images.unsplash.com/photo-1555597673-b21d5c935865?w=1200&auto=format&fit=crop&q=80',
  },
  art_02: {
    title: 'Tips Mempersiapkan Diri Menghadapi Ujian Kenaikan Tingkat (UKT) Sabuk',
    excerpt: 'Panduan lengkap bagi anggota sabuk Putih, Kuning, dan Hijau untuk menguasai materi fisik, jurus wajib, dan ketahanan mental.',
    imageUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=1200&auto=format&fit=crop&q=80',
  },
  art_03: {
    title: 'Kontingen PAMUR Raih 5 Emas di Kejuaraan Pencak Silat Antar Paguyuban 2026',
    excerpt: 'Prestasi gemilang diraih pesilat muda PAMUR cabang Jawa Timur dan Madura dalam kategori tanding dan seni ganda.',
    imageUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=1200&auto=format&fit=crop&q=80',
  },
  art_04: {
    title: 'Pendaftaran Program Pemusatan Latihan Atlet Tanding Periode Semester II',
    excerpt: 'Pengumuman resmi pembukaan seleksi atlet tanding dan pembinaan khusus bagi pesilat berprestasi usia 15-24 tahun.',
    imageUrl: 'https://images.unsplash.com/photo-1517438322307-e67111335449?w=1200&auto=format&fit=crop&q=80',
  },
};

function dynamicOpenGraphPlugin() {
  return {
    name: 'dynamic-opengraph-plugin',
    transformIndexHtml(html: string, ctx?: { originalUrl?: string; req?: { url?: string } }) {
      const url = ctx?.originalUrl || ctx?.req?.url || '';
      const match = url.match(/[?&]articleId=([^&#]+)/);
      if (match) {
        const articleId = decodeURIComponent(match[1]);
        const art = articlesMeta[articleId];
        if (art) {
          let res = html;
          res = res.replace(/<title>.*?<\/title>/, `<title>${art.title} - PAMUR Pencak Silat</title>`);
          res = res.replace(/<meta property="og:title" content=".*?" \/>/, `<meta property="og:title" content="${art.title}" />`);
          res = res.replace(/<meta property="og:description" content=".*?" \/>/, `<meta property="og:description" content="${art.excerpt}" />`);
          res = res.replace(/<meta property="og:image" content=".*?" \/>/, `<meta property="og:image" content="${art.imageUrl}" />`);
          res = res.replace(/<meta property="og:image:secure_url" content=".*?" \/>/, `<meta property="og:image:secure_url" content="${art.imageUrl}" />`);
          res = res.replace(/<meta property="og:image:alt" content=".*?" \/>/, `<meta property="og:image:alt" content="${art.title}" />`);
          res = res.replace(/<meta name="twitter:title" content=".*?" \/>/, `<meta name="twitter:title" content="${art.title}" />`);
          res = res.replace(/<meta name="twitter:description" content=".*?" \/>/, `<meta name="twitter:description" content="${art.excerpt}" />`);
          res = res.replace(/<meta name="twitter:image" content=".*?" \/>/, `<meta name="twitter:image" content="${art.imageUrl}" />`);
          res = res.replace(/<meta name="twitter:image:alt" content=".*?" \/>/, `<meta name="twitter:image:alt" content="${art.title}" />`);
          return res;
        }
      }
      return html;
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), dynamicOpenGraphPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    base: '/',
    build: {
      outDir: 'dist',
      chunkSizeWarningLimit: 2000,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules/xlsx/')) {
              return 'vendor-xlsx';
            }
            if (id.includes('node_modules/firebase/')) {
              return 'vendor-firebase';
            }
            if (id.includes('node_modules/lucide-react/')) {
              return 'vendor-icons';
            }
          },
        },
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
