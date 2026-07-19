export interface Quote {
  text: string;
  author: string;
}

export const motivationalQuotes: Quote[] = [
  {
    text: "Pendidikan adalah senjata paling ampuh yang bisa kamu gunakan untuk mengubah dunia.",
    author: "Nelson Mandela",
  },
  {
    text: "Ingatlah bahwa mengajar bukan sekedar mentransfer ilmu, tetapi juga mentransfer semangat dan inspirasi.",
    author: "Ki Hajar Dewantara",
  },
  {
    text: "Pendidikan bukan persiapan untuk hidup. Pendidikan adalah hidup itu sendiri.",
    author: "John Dewey",
  },
  {
    text: "Guru yang hebat tidak memberikan jawaban, tetapi memunculkan keingintahuan untuk mencari jawaban.",
    author: "William Butler Yeats",
  },
  {
    text: "Seni mengajar adalah seni membantu penemuan.",
    author: "Mark Van Doren",
  },
  {
    text: "Pendidikan adalah kunci yang membuka pintu kebebasan.",
    author: "George Washington Carver",
  },
  {
    text: "Guru yang baik seperti lilin, ia menghabiskan dirinya untuk menerangi jalan bagi orang lain.",
    author: "Mustafa Kemal Atatürk",
  },
  {
    text: "Tujuan pendidikan bukanlah pengetahuan, melainkan tindakan.",
    author: "Herbert Spencer",
  },
  {
    text: "Anak-anak membutuhkan teladan daripada kritik.",
    author: "Joseph Joubert",
  },
  {
    text: "Pendidikan adalah fondasi dari segala sesuatu yang bisa kita capai.",
    author: "Kofi Annan",
  },
  {
    text: "Mendidik pikiran tanpa mendidik hati bukanlah pendidikan sama sekali.",
    author: "Aristoteles",
  },
  {
    text: "Satu buku, satu pena, satu anak, dan satu guru dapat mengubah dunia.",
    author: "Malala Yousafzai",
  },
  {
    text: "Pendidikan terbaik datang dari pengalaman, bukan hanya dari buku.",
    author: "Albert Einstein",
  },
  {
    text: "Guru membuka pintu, tetapi kamu harus masuk sendiri.",
    author: "Pepatah Tiongkok",
  },
  {
    text: "Harga diri seorang guru terletak pada keberhasilan murid-muridnya.",
    author: "Anonim",
  },
  {
    text: "Pendidikan bukanlah mengisi ember, melainkan menyalakan api.",
    author: "William Butler Yeats",
  },
  {
    text: "Setiap anak memiliki bakat yang berbeda. Tugas kita adalah menemukan dan mengembangkannya.",
    author: "Howard Gardner",
  },
  {
    text: "Mengajar adalah belajar dua kali.",
    author: "Joseph Joubert",
  },
  {
    text: "Pendidikan adalah investasi terbaik untuk masa depan.",
    author: "Benjamin Franklin",
  },
  {
    text: "Guru yang baik adalah guru yang menginspirasi siswa untuk belajar sepanjang hayat.",
    author: "Nadiem Makarim",
  },
  {
    text: "Didiklah anak-anakmu, karena sesungguhnya kamu akan dimintai pertanggungjawaban tentang mereka.",
    author: "Ali bin Abi Thalib",
  },
  {
    text: "Kesabaran adalah kunci keberhasilan dalam mengajar.",
    author: "Confucius",
  },
  {
    text: "Pendidikan mengubah dunia. Setiap langkah kecilmu di kelas adalah langkah besar bagi masa depan bangsa.",
    author: "Ki Hajar Dewantara",
  },
  {
    text: "Guru adalah pahlawan tanpa tanda jasa yang dampaknya dirasakan sepanjang masa.",
    author: "Anonim",
  },
];

export function getDailyQuote(): Quote {
  const today = new Date();
  const startOfYear = new Date(today.getFullYear(), 0, 0);
  const diff = today.getTime() - startOfYear.getTime();
  const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
  const index = dayOfYear % motivationalQuotes.length;
  return motivationalQuotes[index];
}

export function getGreeting(): { greeting: string; emoji: string } {
  const hour = new Date().getHours();
  
  if (hour >= 4 && hour < 11) {
    return { greeting: "Selamat Pagi", emoji: "🌅" };
  } else if (hour >= 11 && hour < 15) {
    return { greeting: "Selamat Siang", emoji: "☀️" };
  } else if (hour >= 15 && hour < 18) {
    return { greeting: "Selamat Sore", emoji: "🌇" };
  } else {
    return { greeting: "Selamat Malam", emoji: "🌙" };
  }
}
