import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, collection, addDoc, query, where, getDocs, orderBy, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyDbc7m-zB3KmgKgsACKwDJFMUT3pQYbONs",
    authDomain: "yks-analiz-merkezi.firebaseapp.com",
    projectId: "yks-analiz-merkezi",
    storageBucket: "yks-analiz-merkezi.firebasestorage.app",
    messagingSenderId: "985219990894",
    appId: "1:985219990894:web:802f31c78060bdd1c6ad7f",
    measurementId: "G-N6E47G9KVX"
  };
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app); // İşte bu satır eksik veya aşağıda kalmış olabilir!
  // --- KAYIT OLMA FONKSİYONU ---
const signUpBtn = document.getElementById('signUpBtn');
if (signUpBtn) {
    signUpBtn.onclick = async () => {
        const email = document.getElementById('email').value;
        const pass = document.getElementById('password').value;
        console.log("Kayıt denemesi yapılıyor:", email); // Log ekledik

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
            console.log("Kayıt başarılı!", userCredential.user);
            alert("Başarıyla kayıt oldun!");
        } catch (error) {
            console.error("Kayıt hatası:", error.code, error.message);
            alert("Kayıt hatası: " + error.message);
        }
    };
}

// --- GİRİŞ YAPMA FONKSİYONU ---
const loginBtn = document.getElementById('loginBtn');
if (loginBtn) {
    loginBtn.onclick = async () => {
        const email = document.getElementById('email').value;
        const pass = document.getElementById('password').value;
        console.log("Giriş denemesi yapılıyor:", email);

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, pass);
            console.log("Giriş başarılı!", userCredential.user);
        } catch (error) {
            console.error("Giriş hatası:", error.code, error.message);
            alert("Giriş hatası: " + error.message);
        }
    };
}

// --- OTURUM DURUMU TAKİBİ ---
onAuthStateChanged(auth, (user) => {
    if (user) {
        console.log("Kullanıcı şu an içeride:", user.email);
        document.getElementById('auth-container').style.display = 'none';
        document.getElementById('app-container').style.display = 'flex';
        // Giriş yapınca dashboard'u yükle (bu fonksiyonu sonra yazacağız)
        // loadDashboard(); 
    } else {
        console.log("Giriş yapmış kullanıcı yok.");
        document.getElementById('auth-container').style.display = 'flex';
        document.getElementById('app-container').style.display = 'none';
    }
});
  const db = getFirestore(app);
  
  console.log("Firebase bağlantısı kuruldu.");
  let currentUser = null;
  let selectedMistakes = [];
  
  // KONU LİSTESİ (Readme'deki tam liste)
  const subjectsData = {
      "TYT": {
        "Türkçe": ["Sözcükte Anlam", "Cümlede Anlam", "Paragraf", "Paragraf - Anlatım Teknikleri", "Paragraf - Düşünceyi Geliştirme Yolları", "Paragraf - Yapı", "Paragraf - Konu-Ana Düşünce", "Paragraf - Yardımcı Düşünce", "Ses Bilgisi", "Yazım Kuralları", "Noktalama İşaretleri", "Sözcükte Yapı", "Sözcük Türleri", "Sözcük Türleri - İsimler", "Sözcük Türleri - Zamirler", "Sözcük Türleri - Sıfatlar", "Sözcük Türleri - Zarflar", "Sözcük Türleri - Edat-Bağlaç-Ünlem", "Fiiller", "Fiiller - Fiilde Anlam", "Fiiller - Ek Fiil", "Fiiller - Fiilimsi", "Fiiller - Fiilde Çatı", "Cümlenin Ögeleri", "Cümle Türleri", "Anlatım Bozukluğu"],
        "Matematik": ["Temel Kavramlar", "Sayı Basamakları", "Bölme ve Bölünebilme", "EBOB – EKOK", "Rasyonel Sayılar", "Basit Eşitsizlikler", "Mutlak Değer", "Üslü Sayılar", "Köklü Sayılar", "Çarpanlara Ayırma", "Oran Orantı", "Denklem Çözme", "Problemler", "Problemler - Sayı", "Problemler - Kesir", "Problemler - Yaş", "Problemler - Yüzde", "Problemler - Kar Zarar", "Problemler - Karışım", "Problemler - Hareket", "Problemler - İşçi", "Problemler - Tablo-Grafik", "Problemler - Rutin Olmayan", "Kümeler", "Mantık", "Fonksiyonlar", "Polinomlar", "2.Dereceden Denklemler", "Permütasyon ve Kombinasyon", "Olasılık", "Veri – İstatistik"],
        "Geometri": ["Doğruda Açı", "Üçgende Açı", "Ek Çizimler", "Özel Üçgenler", "Dik Üçgen", "İkizkenar Üçgen", "Eşkenar Üçgen", "Açıortay", "Kenarortay", "Üçgende Eşlik – Benzerlik", "Açı – Kenar Bağıntıları", "Üçgende Alan", "Üçgende Merkezler", "Çokgenler", "Dörtgenler", "Deltoid", "Paralelkenar", "Eşkenar Dörtgen", "Dikdörtgen", "Kare", "Yamuk", "Çember ve Daire", "Çemberde Açı", "Çemberde Uzunluk", "Dairede Alan", "Analitik Geometri", "Noktanın Analitiği", "Doğrunun Analitiği", "Katı Cisimler", "Prizmalar", "Küp", "Silindir", "Piramit", "Koni", "Küre"],
        "Fizik": ["Fizik Bilimine Giriş", "Madde ve Özellikleri", "Hareket ve Kuvvet", "İş, Güç ve Enerji", "Isı, Sıcaklık ve Genleşme", "Basınç", "Kaldırma Kuvveti", "Elektrostatik", "Elektrik ve Manyetizma", "Dalgalar", "Optik"],
        "Kimya": ["Kimya Bilimi", "Atom ve Periyodik Sistem", "Kimyasal Türler Arası Etkileşimler", "Maddenin Halleri", "Doğa ve Kimya", "Kimyanın Temel Kanunları", "Kimyasal Hesaplamalar", "Karışımlar", "Asit, Baz ve Tuz", "Kimya Her Yerde"],
        "Biyoloji": ["Canlıların Ortak Özellikleri", "Canlıların Temel Bileşenleri", "Hücre ve Organelleri", "Hücre Zarından Madde Geçişi", "Canlıların Sınıflandırılması", "Mitoz ve Eşeysiz Üreme", "Mayoz ve Eşeyli Üreme", "Kalıtım", "Ekosistem Ekolojisi", "Güncel Çevre Sorunları"],
        "Tarih": ["Tarih ve Zaman", "İnsanlığın İlk Dönemleri", "İlk ve Orta Çağlarda Türk Dünyası", "İslam Medeniyetinin Doğuşu", "İlk Türk İslam Devletleri", "Orta Çağ’da Dünya", "Selçuklu Türkiyesi", "Osmanlı Siyaseti", "Osmanlı Medeniyeti", "Dünya Gücü Osmanlı", "Osmanlı Toplum Düzeni", "Milli Mücadele", "Atatürkçülük ve İnkılap"],
        "Coğrafya": ["Doğa ve İnsan", "Dünya’nın Şekli ve Hareketleri", "Coğrafi Konum", "Harita Bilgisi", "İklim Bilgisi", "İç ve Dış Kuvvetler", "Türkiye’nin Yer Şekilleri", "Nüfus", "Göç", "Bölgeler", "Doğal Afetler"],
        "Felsefe": ["Felsefe’nin Konusu", "Bilgi Felsefesi", "Varlık Felsefesi", "Ahlak Felsefesi", "Sanat Felsefesi", "Din Felsefesi", "Siyaset Felsefesi", "Bilim Felsefesi"],
        "Din Kültürü": ["Bilgi ve İnanç", "Din ve İslam", "İslam ve İbadet", "Gençlik ve Değerler", "Allah İnancı", "Hz. Muhammed", "Ahlaki Tutumlar"]
      },
      "AYT": {
        "Matematik": ["Temel Kavramlar", "Sayı Basamakları", "Mantık", "Kümeler", "Fonksiyonlar", "Polinomlar", "2.Dereceden Denklemler", "Binom", "Permütasyon ve Kombinasyon", "Olasılık", "Karmaşık Sayılar", "2.Dereceden Eşitsizlikler", "Parabol", "Trigonometri", "Logaritma", "Diziler", "Limit", "Türev", "İntegral"],
        "Geometri": ["Doğruda ve Üçgende Açı", "Özel Üçgenler", "Açıortay-Kenarortay", "Çokgenler", "Dörtgenler", "Çember ve Daire", "Analitik Geometri", "Dönüşüm Geometrisi", "Katı Cisimler", "Çemberin Analitiği"],
        "Fizik": ["Vektörler", "Kuvvet, Tork ve Denge", "Basit Makineler", "Newton’un Hareket Yasaları", "Atışlar", "İtme ve Momentum", "Elektrik Alan ve Potansiyel", "Manyetik Alan ve Kuvvet", "Alternatif Akım", "Çembersel Hareket", "Kepler Yasaları", "Basit Harmonik Hareket", "Dalga Mekaniği", "Modern Fizik"],
        "Kimya": ["Modern Atom Teorisi", "Gazlar", "Sıvı Çözeltiler", "Kimyasal Tepkimelerde Enerji", "Kimyasal Tepkimelerde Hız", "Kimyasal Tepkimelerde Denge", "Asit-Baz Dengesi", "Kimya ve Elektrik", "Organik Kimya"],
        "Biyoloji": ["Sinir Sistemi", "Endokrin Sistem", "Duyu Organları", "Destek ve Hareket Sistemi", "Sindirim Sistemi", "Dolaşım ve Bağışıklık", "Solunum Sistemi", "Boşaltım Sistemi", "Üreme Sistemi", "Genden Proteine", "Fotosentez ve Kemosentez", "Bitki Biyolojisi"],
        "Edebiyat": ["Anlam Bilgisi", "Şiir Bilgisi", "Söz Sanatları", "Halk Edebiyatı", "Divan Edebiyatı", "Tanzimat Edebiyatı", "Servet-i Fünun Edebiyatı", "Milli Edebiyat", "Cumhuriyet Dönemi Edebiyatı", "Edebi Akımlar"],
        "Tarih": ["Tarih ve Zaman", "İlk Türk İslam Devletleri", "Osmanlı Siyaseti", "Milli Mücadele", "Atatürkçülük", "II. Dünya Savaşı", "Soğuk Savaş Dönemi", "XXI. Yüzyılın Eşiğinde Dünya"],
        "Coğrafya": ["Ekosistem", "Biyoçeşitlilik", "Nüfus Politikaları", "Türkiye’de Ekonomi", "Küresel Ticaret", "Türkiye Turizmi", "Jeopolitik Konum", "Çevre ve Toplum"],
        "Felsefe Grubu": ["Mantığa Giriş", "Klasik Mantık", "Sembolik Mantık", "Psikoloji Bilimi", "Öğrenme Bellek Düşünme", "Sosyolojiye Giriş", "Toplumsal Yapı", "Toplumsal Kurumlar"],
        "Din Kültürü": ["Dünya ve Ahiret", "Kur’an’a Göre Hz. Muhammed", "İnançla İlgili Meseleler", "İslam ve Bilim", "Anadolu’da İslam", "Tasavvufi Yorumlar"]
    }
 };
  
  function renderTags() {
      const container = document.getElementById('selectedSubjects');
      container.innerHTML = '';
      selectedMistakes.forEach(s => {
          const tag = document.createElement('span');
          tag.className = 'tag';
          tag.innerHTML = `${s} <b onclick="removeTag('${s}')">x</b>`;
          container.appendChild(tag);
      });
  }
  
  window.removeTag = function(s) {
      selectedMistakes = selectedMistakes.filter(m => m !== s);
      renderTags();
  };
  
  // --- VERİLERİ FİREBASE'E KAYDETME ---
  window.saveDenemeData = async function() {
      if(!currentUser) return alert("Önce giriş yapmalısın!");
  
      const examType = document.getElementById('examType').value;
      const dersler = examType === 'TYT' ? tytDersler : aytDersler;
      const netler = {};
      
      dersler.forEach(ders => {
          if (subjectsData[examType]?.[ders]) {
              const dersId = ders.toLowerCase().replace(/\s+/g, '');
              const d = document.getElementById(`${dersId}D`)?.value || 0;
              const y = document.getElementById(`${dersId}Y`)?.value || 0;
              const b = document.getElementById(`${dersId}B`)?.value || 0;
              netler[dersId] = { 
                  d: parseInt(d) || 0, 
                  y: parseInt(y) || 0,
                  b: parseInt(b) || 0 
              };
              
              // TYT için soru sayısı kontrolü
              if (examType === 'TYT' && tytSoruSayilari[ders]) {
                  const toplam = parseInt(d) + parseInt(y) + parseInt(b);
                  if (toplam > tytSoruSayilari[ders]) {
                      alert(`${ders} dersinde toplam soru sayısı ${tytSoruSayilari[ders]}'u geçemez! (Girilen: ${toplam})`);
                      return;
                  }
              }
          }
      });
  
      const deneme = {
          userId: currentUser.uid,
          ad: document.getElementById('denemeName').value || 'İsimsiz Deneme',
          tarih: document.getElementById('denemeDate').value || new Date().toISOString().split('T')[0],
          tip: examType,
          netler: netler,
          yanlislar: selectedMistakes,
          createdAt: serverTimestamp()
      };
  
      try {
          await addDoc(collection(db, "denemeler"), deneme);
          alert("Deneme başarıyla kaydedildi! ✅");
          document.getElementById('denemeName').value = '';
          document.getElementById('denemeDate').value = new Date().toISOString().split('T')[0];
          selectedMistakes = [];
          renderTags();
          updateNetInputs();
          loadDashboard();
      } catch (e) {
          alert("Hata: " + e.message);
      }
  };
  
  // TYT ve AYT Ders Listeleri
  const tytDersler = ["Türkçe", "Matematik", "Geometri", "Fizik", "Kimya", "Biyoloji", "Tarih", "Coğrafya", "Felsefe", "Din Kültürü"];
  const aytDersler = ["Matematik", "Fizik", "Kimya", "Biyoloji", "Edebiyat", "Tarih", "Coğrafya", "Felsefe Grubu", "Din Kültürü"];
  
  // TYT Soru Sayıları (Doğru + Yanlış + Boş = Toplam)
  const tytSoruSayilari = {
      "Türkçe": 40,
      "Matematik": 30,
      "Geometri": 10,
      "Fizik": 7,
      "Kimya": 7,
      "Biyoloji": 6,
      "Tarih": 5,
      "Coğrafya": 5,
      "Felsefe": 5,
      "Din Kültürü": 5
  };
  
  // AYT Soru Sayıları (Toplam 160 soru)
  const aytSoruSayilari = {
      "Matematik": 40,
      "Geometri": 10,
      "Fizik": 14,
      "Kimya": 13,
      "Biyoloji": 13,
      "Edebiyat": 24,
      "Tarih": 10,
      "Coğrafya": 6,
      "Felsefe Grubu": 12,
      "Din Kültürü": 6
  };
  
  const AYT_TOPLAM_SORU = 160;
  
  let netChart = null;
  
  // --- SEKME DEĞİŞTİRME ---
  window.changeTab = function(tabId) {
      document.querySelectorAll('.tab-content').forEach(tab => tab.style.display = 'none');
      document.getElementById(tabId).style.display = 'block';
      
      if (tabId === 'dashboard') {
          loadDashboard();
      } else if (tabId === 'add-deneme') {
          updateMistakeArea();
      } else if (tabId === 'calisma-takip') {
          loadCalismaReports();
      } else if (tabId === 'deneme-gecmisi') {
          loadDenemeGecmisiTable();
      }
  };
  
  // --- HİBRİT ARAMA VE KONU EKLEME ---
  window.updateMistakeArea = function() {
      const examType = document.getElementById('examType').value;
      const dersSelect = document.getElementById('searchDersSecim');
      if (!dersSelect) return;
      
      dersSelect.innerHTML = '<option value="">Ders Seç</option>';
      const dersler = examType === 'TYT' ? tytDersler : aytDersler;
      
      dersler.forEach(ders => {
          if (subjectsData[examType]?.[ders]) {
              const option = document.createElement('option');
              option.value = ders;
              option.textContent = ders;
              dersSelect.appendChild(option);
          }
      });
      
      updateNetInputs();
  };
  
  function updateNetInputs() {
      const examType = document.getElementById('examType').value;
      const container = document.getElementById('netInputsContainer');
      if (!container) return;
      
      const dersler = examType === 'TYT' ? tytDersler : aytDersler;
      container.innerHTML = '';
      
      dersler.forEach(ders => {
          if (subjectsData[examType]?.[ders]) {
              const row = document.createElement('div');
              row.className = 'subject-row';
              const dersId = ders.toLowerCase().replace(/\s+/g, '');
              const maxSoru = examType === 'TYT' ? (tytSoruSayilari[ders] || 0) : '';
              const maxAttr = examType === 'TYT' ? `max="${maxSoru}"` : '';
              
              row.innerHTML = `
                  <span>${ders}${examType === 'TYT' ? ` (${maxSoru} soru)` : ''}:</span>
                  <input type="number" id="${dersId}D" placeholder="Doğru" min="0" ${maxAttr} onchange="autoCalculateBos('${dersId}', ${maxSoru || 0}); validateSoruSayisi('${dersId}', ${maxSoru || 0})">
                  <input type="number" id="${dersId}Y" placeholder="Yanlış" min="0" ${maxAttr} onchange="autoCalculateBos('${dersId}', ${maxSoru || 0}); validateSoruSayisi('${dersId}', ${maxSoru || 0})">
                  <input type="number" id="${dersId}B" placeholder="Boş" min="0" ${maxAttr} onchange="validateSoruSayisi('${dersId}', ${maxSoru || 0})" readonly>
              `;
              container.appendChild(row);
          }
      });
  }
  
  // Boş soru sayısını otomatik hesapla
  window.autoCalculateBos = function(dersId, maxSoru) {
      if (maxSoru === 0) return; // AYT için hesaplama yok
      
      const d = parseInt(document.getElementById(`${dersId}D`)?.value || 0);
      const y = parseInt(document.getElementById(`${dersId}Y`)?.value || 0);
      const bosInput = document.getElementById(`${dersId}B`);
      
      if (bosInput) {
          const bos = Math.max(0, maxSoru - d - y);
          bosInput.value = bos;
      }
  };
  
  // Soru sayısı kontrolü (Doğru + Yanlış + Boş <= Toplam)
  window.validateSoruSayisi = function(dersId, maxSoru) {
      if (maxSoru === 0) return; // AYT için kontrol yok
      
      const d = parseInt(document.getElementById(`${dersId}D`)?.value || 0);
      const y = parseInt(document.getElementById(`${dersId}Y`)?.value || 0);
      const b = parseInt(document.getElementById(`${dersId}B`)?.value || 0);
      const toplam = d + y + b;
      
      if (toplam > maxSoru) {
          alert(`${dersId.toUpperCase()} dersinde toplam soru sayısı ${maxSoru}'u geçemez! (Doğru: ${d}, Yanlış: ${y}, Boş: ${b} = ${toplam})`);
          // Fazlalığı boştan düş
          const fazlalik = toplam - maxSoru;
          const yeniBos = Math.max(0, b - fazlalik);
          document.getElementById(`${dersId}B`).value = yeniBos;
      }
  };
  
  window.updateSubjectSearch = function() {
      const ders = document.getElementById('searchDersSecim').value;
      const type = document.getElementById('examType').value;
      const sugBox = document.getElementById('searchSuggestions');
      
      if (!sugBox) return;
      
      // Ders seçildiğinde direkt tüm konuları göster
      if (ders) {
          const list = subjectsData[type]?.[ders] || [];
          sugBox.innerHTML = '';
          
          if (list.length > 0) {
              list.forEach(s => {
                  const item = document.createElement('div');
                  item.innerText = s;
                  item.onclick = () => addSubject(s);
                  sugBox.appendChild(item);
              });
          } else {
              sugBox.innerHTML = '<div style="padding: 0.75rem; color: var(--text-secondary);">Bu ders için konu bulunamadı.</div>';
          }
      } else {
          sugBox.innerHTML = '';
      }
      
      document.getElementById('subjectSearch').value = '';
  };
  
  window.filterSubjects = function() {
      const input = document.getElementById('subjectSearch').value.toLowerCase();
      const type = document.getElementById('examType').value;
      const ders = document.getElementById('searchDersSecim').value;
      const sugBox = document.getElementById('searchSuggestions');
      if (!sugBox || !ders) return;
      
      sugBox.innerHTML = '';
      
      const list = subjectsData[type]?.[ders] || [];
      
      // Eğer input boşsa tüm konuları göster
      if (input.length < 1) {
          list.forEach(s => {
              const item = document.createElement('div');
              item.innerText = s;
              item.onclick = () => addSubject(s);
              sugBox.appendChild(item);
          });
          return;
      }
  
      // Input varsa filtrele
      const filtered = list.filter(s => s.toLowerCase().includes(input));
  
      filtered.forEach(s => {
          const item = document.createElement('div');
          item.innerText = s;
          item.onclick = () => addSubject(s);
          sugBox.appendChild(item);
      });
  
      if(filtered.length === 0 && input.length > 0) {
          const newItem = document.createElement('div');
          newItem.innerText = `"${input}" (Yeni Ekle)`;
          newItem.onclick = () => addSubject(input);
          sugBox.appendChild(newItem);
      }
  };
  
  function addSubject(s) {
      // Aynı konudan birden fazla eklenebilir
          selectedMistakes.push(s);
          renderTags();
      document.getElementById('subjectSearch').value = '';
      document.getElementById('searchSuggestions').innerHTML = '';
  }
  
  // Dashboard Functions
  async function loadDashboard() {
      if (!currentUser) return;
      
      try {
          // Firestore'da composite index gerektirmemek için önce where ile çek, sonra JavaScript'te sırala
          const denemelerQuery = query(
              collection(db, "denemeler"),
              where("userId", "==", currentUser.uid)
          );
          const denemelerSnapshot = await getDocs(denemelerQuery);
          let denemeler = denemelerSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          
          // Tarihe göre sırala (en yeni önce)
          denemeler.sort((a, b) => {
              const tarihA = a.tarih || (a.createdAt?.toDate ? a.createdAt.toDate().toISOString() : '');
              const tarihB = b.tarih || (b.createdAt?.toDate ? b.createdAt.toDate().toISOString() : '');
              return tarihB.localeCompare(tarihA);
          });
          
          console.log("Yüklenen denemeler:", denemeler.length, denemeler);
          
          const tytDenemeler = denemeler.filter(d => d.tip === 'TYT');
          const aytDenemeler = denemeler.filter(d => d.tip === 'AYT');
          
          if (tytDenemeler.length > 0) {
              const lastTYT = tytDenemeler[0];
              console.log("Son TYT Denemesi:", lastTYT);
              console.log("Netler objesi:", lastTYT.netler);
              const tytNet = calculateTotalNet(lastTYT);
              console.log("Hesaplanan TYT Net:", tytNet);
              document.getElementById('lastTYTNet').textContent = tytNet.toFixed(2);
          } else {
              document.getElementById('lastTYTNet').textContent = '-';
          }
          
          if (aytDenemeler.length > 0) {
              const lastAYT = aytDenemeler[0];
              const aytNet = calculateTotalNet(lastAYT);
              document.getElementById('lastAYTNet').textContent = aytNet.toFixed(2);
          } else {
              document.getElementById('lastAYTNet').textContent = '-';
          }
          
          document.getElementById('totalDeneme').textContent = denemeler.length;
          createNetChart(denemeler);
          showCriticalTopics(denemeler);
          showAverageNets(denemeler);
          createBransCharts(denemeler);
      } catch (error) {
          console.error("Dashboard yükleme hatası:", error);
          alert("Dashboard yüklenirken bir hata oluştu: " + error.message);
      }
  }
  
  function calculateTotalNet(deneme) {
      let toplamSoru = 0;
      let toplamYanlis = 0;
      let toplamBos = 0;
      const netler = deneme.netler || {};
      const detaylar = [];
      const examType = deneme.tip || 'TYT';
      
      // TYT için toplam soru sayısını hesapla
      if (examType === 'TYT') {
          Object.keys(netler).forEach(dersId => {
              const ders = netler[dersId];
              const d = parseInt(ders.d) || 0;
              const y = parseInt(ders.y) || 0;
              const b = parseInt(ders.b) || 0;
              toplamSoru += (d + y + b);
              toplamYanlis += y;
              toplamBos += b;
              
              // Ders adını bul
              const dersAdi = Object.keys(tytSoruSayilari).find(d => 
                  d.toLowerCase().replace(/\s+/g, '') === dersId
              ) || dersId;
              const maxSoru = tytSoruSayilari[dersAdi] || 0;
              // Net = Toplam Soru - ((Yanlış × 1.25) + Boş)
              const dersNet = maxSoru - ((y * 1.25) + b);
              detaylar.push(`${dersAdi}: ${maxSoru} soru - ((${y}Y × 1.25) + ${b}B) = ${dersNet.toFixed(2)} net`);
          });
      } else {
          // AYT için toplam soru sayısını hesapla
          Object.keys(netler).forEach(dersId => {
              const ders = netler[dersId];
              const d = parseInt(ders.d) || 0;
              const y = parseInt(ders.y) || 0;
              const b = parseInt(ders.b) || 0;
              toplamSoru += (d + y + b);
              toplamYanlis += y;
              toplamBos += b;
              
              // Ders adını bul
              const dersAdi = Object.keys(aytSoruSayilari).find(d => 
                  d.toLowerCase().replace(/\s+/g, '') === dersId
              ) || dersId;
              const maxSoru = aytSoruSayilari[dersAdi] || 0;
              // Net = Toplam Soru - ((Yanlış × 1.25) + Boş)
              const dersNet = maxSoru - ((y * 1.25) + b);
              detaylar.push(`${dersAdi}: ${maxSoru} soru - ((${y}Y × 1.25) + ${b}B) = ${dersNet.toFixed(2)} net`);
          });
      }
      
      // Net hesaplama: TYT ve AYT için toplam soru - ((yanlış × 1.25) + boş)
      const total = examType === 'TYT' 
          ? toplamSoru - ((toplamYanlis * 1.25) + toplamBos)
          : AYT_TOPLAM_SORU - ((toplamYanlis * 1.25) + toplamBos);
      
      console.log(`Toplam Net Hesaplama (${deneme.ad || 'Deneme'} - ${examType}):`, {
          detaylar: detaylar,
          toplamSoru: toplamSoru,
          toplamYanlis: toplamYanlis,
          toplamBos: toplamBos,
          hesaplananNet: total.toFixed(2),
          hamVeri: netler
      });
      
      detaylar.forEach(detay => console.log("  " + detay));
      if (examType === 'TYT') {
          console.log(`  TOPLAM: ${toplamSoru} Soru - ((${toplamYanlis} Yanlış × 1.25) + ${toplamBos} Boş) = ${total.toFixed(2)} net`);
      } else {
          console.log(`  TOPLAM: ${AYT_TOPLAM_SORU} Soru - ((${toplamYanlis} Yanlış × 1.25) + ${toplamBos} Boş) = ${total.toFixed(2)} net`);
      }
      
      return total;
  }
  
  // Branş ders neti hesapla
  function calculateBransNet(deneme, dersAdi) {
      const netler = deneme.netler || {};
      const dersId = dersAdi.toLowerCase().replace(/\s+/g, '');
      const dersData = netler[dersId];
      if (!dersData) return 0;
      const d = parseInt(dersData.d) || 0;
      const y = parseInt(dersData.y) || 0;
      const b = parseInt(dersData.b) || 0;
      const examType = deneme.tip || 'TYT';
      
      // TYT için: Toplam soru - ((yanlış × 1.25) + boş)
      if (examType === 'TYT' && tytSoruSayilari[dersAdi]) {
          const toplamSoru = tytSoruSayilari[dersAdi];
          return toplamSoru - ((y * 1.25) + b);
      }
      
      // AYT için: Toplam soru - ((yanlış × 1.25) + boş)
      if (examType === 'AYT' && aytSoruSayilari[dersAdi]) {
          const toplamSoru = aytSoruSayilari[dersAdi];
          return toplamSoru - ((y * 1.25) + b);
      }
      
      // Fallback: Doğru - ((yanlış × 1.25) + boş)
      return d - ((y * 1.25) + b);
  }
  
  function createNetChart(denemeler) {
      const ctx = document.getElementById('netChart');
      if (!ctx) return;
      
      if (netChart) netChart.destroy();
      
      const tytData = denemeler.filter(d => d.tip === 'TYT').slice(0, 10).reverse();
      const aytData = denemeler.filter(d => d.tip === 'AYT').slice(0, 10).reverse();
      
      const labels = [];
      const tytNets = [];
      const aytNets = [];
      
      const tytDogru = [];
      const tytYanlis = [];
      const tytBos = [];
      
      tytData.forEach(d => {
          const date = d.tarih ? new Date(d.tarih).toLocaleDateString('tr-TR', { month: 'short', day: 'numeric' }) : 'Tarih yok';
          labels.push(date);
          
          // TYT toplam doğru/yanlış/boş hesapla
          let toplamDogru = 0, toplamYanlis = 0, toplamBos = 0;
          if (d.netler) {
              Object.keys(d.netler).forEach(dersId => {
                  toplamDogru += parseInt(d.netler[dersId].d) || 0;
                  toplamYanlis += parseInt(d.netler[dersId].y) || 0;
                  toplamBos += parseInt(d.netler[dersId].b) || 0;
              });
          }
          tytDogru.push(toplamDogru);
          tytYanlis.push(toplamYanlis);
          tytBos.push(toplamBos);
          tytNets.push(calculateTotalNet(d));
      });
      
      labels.forEach((label, idx) => {
          const aytDeneme = aytData.find(d => {
              const date = d.tarih ? new Date(d.tarih).toLocaleDateString('tr-TR', { month: 'short', day: 'numeric' }) : 'Tarih yok';
              return date === label;
          });
          aytNets.push(aytDeneme ? calculateTotalNet(aytDeneme) : null);
      });
      
      netChart = new Chart(ctx, {
          type: 'bar',
          data: {
              labels: labels.length > 0 ? labels : ['Henüz veri yok'],
              datasets: [
                  {
                      label: 'TYT Doğru',
                      data: tytDogru.length > 0 ? tytDogru : [0],
                      backgroundColor: '#10b981',
                      yAxisID: 'y'
                  },
                  {
                      label: 'TYT Yanlış',
                      data: tytYanlis.length > 0 ? tytYanlis : [0],
                      backgroundColor: '#ef4444',
                      yAxisID: 'y'
                  },
                  {
                      label: 'TYT Boş',
                      data: tytBos.length > 0 ? tytBos : [0],
                      backgroundColor: '#f59e0b',
                      yAxisID: 'y'
                  },
                  {
                      label: 'TYT Net',
                      data: tytNets.length > 0 ? tytNets : [0],
                      type: 'line',
                      borderColor: '#3b82f6',
                      borderWidth: 2,
                      fill: false,
                      yAxisID: 'y1'
                  },
                  {
                      label: 'AYT Net',
                      data: aytNets.length > 0 ? aytNets : [0],
                      type: 'line',
                      borderColor: '#10b981',
                      borderWidth: 2,
                      fill: false,
                      yAxisID: 'y1'
                  }
              ]
          },
          options: {
              responsive: true,
              maintainAspectRatio: true,
              plugins: {
                  legend: {
                      labels: { color: '#f1f5f9' }
                  }
              },
              scales: {
                  x: { ticks: { color: '#cbd5e1' }, grid: { color: '#475569' } },
                  y: {
                      beginAtZero: true,
                      max: 120, // TYT maksimum soru sayısı
                      ticks: { color: '#cbd5e1' },
                      grid: { color: '#475569' },
                      title: {
                          display: true,
                          text: 'Doğru / Yanlış / Boş (TYT - Max: 120)',
                          color: '#cbd5e1'
                      }
                  },
                  y1: {
                      beginAtZero: true,
                      position: 'right',
                      ticks: { color: '#cbd5e1' },
                      grid: { display: false },
                      title: {
                          display: true,
                          text: 'Net',
                          color: '#cbd5e1'
                      }
                  }
              }
          }
      });
  }
  
  function showCriticalTopics(denemeler) {
      const topicCounts = {};
      denemeler.forEach(deneme => {
          if (deneme.yanlislar && Array.isArray(deneme.yanlislar)) {
              deneme.yanlislar.forEach(konu => {
                  topicCounts[konu] = (topicCounts[konu] || 0) + 1;
              });
          }
      });
      
      // Tüm konuları göster (sadece ilk 3 değil)
      const sortedTopics = Object.entries(topicCounts).sort((a, b) => b[1] - a[1]);
      const container = document.getElementById('criticalTopicsList');
      
      if (sortedTopics.length === 0) {
          container.innerHTML = '<p class="empty-state">Henüz yeterli veri yok. Deneme ekleyerek başla!</p>';
          return;
      }
      
      container.innerHTML = '';
      sortedTopics.forEach(([konu, count]) => {
          const item = document.createElement('div');
          item.className = 'topic-item';
          item.innerHTML = `<span class="topic-name">${konu}</span><span class="topic-count">${count} kez yanlış</span>`;
          container.appendChild(item);
      });
  }
  
  // Ortalama netleri göster
  function showAverageNets(denemeler) {
      if (denemeler.length === 0) return;
      
      // TYT ve AYT ortalamaları
      const tytDenemeler = denemeler.filter(d => d.tip === 'TYT');
      const aytDenemeler = denemeler.filter(d => d.tip === 'AYT');
      
      let tytOrtalama = 0;
      let aytOrtalama = 0;
      
      if (tytDenemeler.length > 0) {
          tytOrtalama = tytDenemeler.reduce((sum, d) => sum + calculateTotalNet(d), 0) / tytDenemeler.length;
      }
      
      if (aytDenemeler.length > 0) {
          aytOrtalama = aytDenemeler.reduce((sum, d) => sum + calculateTotalNet(d), 0) / aytDenemeler.length;
      }
      
      // Branş ders ortalamaları
      const bransOrtalamalari = {};
      const tumDersler = [...new Set([...tytDenemeler, ...aytDenemeler].flatMap(d => {
          return Object.keys(d.netler || {});
      }))];
      
      tumDersler.forEach(dersId => {
          const dersAdi = dersId.charAt(0).toUpperCase() + dersId.slice(1);
          const ilgiliDenemeler = [...tytDenemeler, ...aytDenemeler].filter(d => d.netler?.[dersId]);
          if (ilgiliDenemeler.length > 0) {
              const ortalama = ilgiliDenemeler.reduce((sum, d) => sum + calculateBransNet(d, dersAdi), 0) / ilgiliDenemeler.length;
              bransOrtalamalari[dersAdi] = ortalama;
          }
      });
      
      // Ortalama kartlarını göster
      let averageHTML = '<div class="average-nets"><h3>📊 Ortalama Netler</h3>';
      if (tytOrtalama > 0) {
          averageHTML += `<div class="average-item"><span>TYT Ortalama:</span><strong>${tytOrtalama.toFixed(2)}</strong></div>`;
      }
      if (aytOrtalama > 0) {
          averageHTML += `<div class="average-item"><span>AYT Ortalama:</span><strong>${aytOrtalama.toFixed(2)}</strong></div>`;
      }
      
      if (Object.keys(bransOrtalamalari).length > 0) {
          averageHTML += '<div class="brans-averages"><h4>Branş Ders Ortalamaları:</h4>';
          Object.entries(bransOrtalamalari)
              .sort((a, b) => b[1] - a[1])
              .forEach(([ders, net]) => {
                  averageHTML += `<div class="average-item"><span>${ders}:</span><strong>${net.toFixed(2)}</strong></div>`;
              });
          averageHTML += '</div>';
      }
      
      averageHTML += '</div>';
      
      // Dashboard'a ekle
      const dashboard = document.getElementById('dashboard');
      let averageContainer = document.getElementById('averageNetsContainer');
      if (!averageContainer) {
          averageContainer = document.createElement('div');
          averageContainer.id = 'averageNetsContainer';
          dashboard.appendChild(averageContainer);
      }
      averageContainer.innerHTML = averageHTML;
  }
  
  // Deneme Listesi Göster
  
  // Ders bazlı grafikler oluştur
  function createBransCharts(denemeler) {
      const container = document.getElementById('bransChartsContainer');
      if (!container) return;
      
      if (denemeler.length === 0) {
          container.innerHTML = '<p class="empty-state">Henüz yeterli veri yok.</p>';
          return;
      }
      
      // Tüm dersleri topla
      const tumDersler = new Set();
      denemeler.forEach(d => {
          if (d.netler) {
              Object.keys(d.netler).forEach(dersId => tumDersler.add(dersId));
          }
      });
      
      if (tumDersler.size === 0) {
          container.innerHTML = '<p class="empty-state">Henüz ders verisi yok.</p>';
          return;
      }
      
      container.innerHTML = '';
      container.style.display = 'grid';
      container.style.gridTemplateColumns = 'repeat(auto-fit, minmax(400px, 1fr))';
      container.style.gap = '1.5rem';
      
      tumDersler.forEach(dersId => {
          const dersAdi = dersId.charAt(0).toUpperCase() + dersId.slice(1);
          const chartDiv = document.createElement('div');
          chartDiv.className = 'brans-chart-card';
          chartDiv.style.background = 'var(--bg-secondary)';
          chartDiv.style.padding = '1.5rem';
          chartDiv.style.borderRadius = '12px';
          chartDiv.style.border = '1px solid var(--border)';
          
          const canvas = document.createElement('canvas');
          canvas.id = `chart-${dersId}`;
          chartDiv.innerHTML = `<h4 style="margin-bottom: 1rem;">${dersAdi} Gelişimi</h4>`;
          chartDiv.appendChild(canvas);
          container.appendChild(chartDiv);
          
          // Bu ders için veri hazırla
          const dersVerileri = denemeler
              .filter(d => d.netler && d.netler[dersId])
              .map(d => {
                  const dersData = d.netler[dersId];
                  const tarih = d.tarih || (d.createdAt?.toDate ? d.createdAt.toDate().toISOString().split('T')[0] : '');
                  return {
                      tarih: tarih,
                      dogru: parseInt(dersData.d) || 0,
                      yanlis: parseInt(dersData.y) || 0,
                      bos: parseInt(dersData.b) || 0,
                      net: calculateBransNet(d, dersAdi)
                  };
              })
              .sort((a, b) => a.tarih.localeCompare(b.tarih));
          
          if (dersVerileri.length === 0) return;
          
          // Dersin maksimum soru sayısını bul
          let maxSoru = 0;
          const firstDeneme = denemeler.find(d => d.netler && d.netler[dersId]);
          if (firstDeneme && firstDeneme.tip === 'TYT' && tytSoruSayilari[dersAdi]) {
              maxSoru = tytSoruSayilari[dersAdi];
          } else if (firstDeneme && firstDeneme.tip === 'AYT' && aytSoruSayilari[dersAdi]) {
              maxSoru = aytSoruSayilari[dersAdi];
          } else {
              // Maksimum soru sayısını verilerden bul
              maxSoru = Math.max(...dersVerileri.map(v => v.dogru + v.yanlis + v.bos), 0);
          }
          
          // Bar Chart oluştur (Sütun grafiği)
          new Chart(canvas, {
              type: 'bar',
              data: {
                  labels: dersVerileri.map(v => new Date(v.tarih).toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit' })),
                  datasets: [
                      {
                          label: 'Doğru',
                          data: dersVerileri.map(v => v.dogru),
                          backgroundColor: '#10b981',
                          yAxisID: 'y'
                      },
                      {
                          label: 'Yanlış',
                          data: dersVerileri.map(v => v.yanlis),
                          backgroundColor: '#ef4444',
                          yAxisID: 'y'
                      },
                      {
                          label: 'Boş',
                          data: dersVerileri.map(v => v.bos),
                          backgroundColor: '#f59e0b',
                          yAxisID: 'y'
                      },
                      {
                          label: 'Net',
                          data: dersVerileri.map(v => v.net),
                          backgroundColor: '#3b82f6',
                          type: 'line',
                          borderColor: '#3b82f6',
                          borderWidth: 2,
                          fill: false,
                          yAxisID: 'y1'
                      }
                  ]
              },
              options: {
                  responsive: true,
                  maintainAspectRatio: true,
                  plugins: {
                      legend: {
                          display: true,
                          position: 'top',
                          labels: {
                              color: '#f1f5f9'
                          }
                      }
                  },
                  scales: {
                      y: {
                          beginAtZero: true,
                          max: maxSoru > 0 ? maxSoru : undefined,
                          position: 'left',
                          ticks: { color: '#cbd5e1' },
                          grid: { color: '#475569' },
                          title: {
                              display: true,
                              text: `Doğru / Yanlış / Boş (Max: ${maxSoru})`,
                              color: '#cbd5e1'
                          }
                      },
                      y1: {
                          beginAtZero: true,
                          position: 'right',
                          ticks: { color: '#cbd5e1' },
                          grid: { display: false },
                          title: {
                              display: true,
                              text: 'Net',
                              color: '#cbd5e1'
                          }
                      },
                      x: {
                          ticks: { color: '#cbd5e1' },
                          grid: { color: '#475569' }
                      }
                  }
              }
          });
      });
  }
  
  // Deneme geçmişi tablosu - TYT ve AYT ayrı
  async function loadDenemeGecmisiTable() {
      if (!currentUser) return;
      
      const tytTbody = document.getElementById('tytTableBody');
      const aytTbody = document.getElementById('aytTableBody');
      
      if (!tytTbody || !aytTbody) return;
      
      tytTbody.innerHTML = '<tr><td colspan="14" class="empty-state">Yükleniyor...</td></tr>';
      aytTbody.innerHTML = '<tr><td colspan="14" class="empty-state">Yükleniyor...</td></tr>';
      
      try {
          const denemelerQuery = query(
              collection(db, "denemeler"),
              where("userId", "==", currentUser.uid)
          );
          const denemelerSnapshot = await getDocs(denemelerQuery);
          let denemeler = denemelerSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          
          denemeler.sort((a, b) => {
              const tarihA = a.tarih || (a.createdAt?.toDate ? a.createdAt.toDate().toISOString() : '');
              const tarihB = b.tarih || (b.createdAt?.toDate ? b.createdAt.toDate().toISOString() : '');
              return tarihB.localeCompare(tarihA);
          });
          
          const tytDenemeler = denemeler.filter(d => d.tip === 'TYT');
          const aytDenemeler = denemeler.filter(d => d.tip === 'AYT');
          
          // TYT Tablosu
          if (tytDenemeler.length === 0) {
              tytTbody.innerHTML = '<tr><td colspan="14" class="empty-state">Henüz TYT denemesi yok.</td></tr>';
          } else {
              tytTbody.innerHTML = '';
              tytDenemeler.forEach(deneme => {
                  const tr = createDenemeRow(deneme, 'TYT');
                  tytTbody.appendChild(tr);
              });
          }
          
          // AYT Tablosu
          if (aytDenemeler.length === 0) {
              aytTbody.innerHTML = '<tr><td colspan="14" class="empty-state">Henüz AYT denemesi yok.</td></tr>';
          } else {
              aytTbody.innerHTML = '';
              aytDenemeler.forEach(deneme => {
                  const tr = createDenemeRow(deneme, 'AYT');
                  aytTbody.appendChild(tr);
              });
          }
      } catch (error) {
          console.error("Deneme geçmişi yükleme hatası:", error);
          tytTbody.innerHTML = '<tr><td colspan="14" class="empty-state">Hata: ' + error.message + '</td></tr>';
          aytTbody.innerHTML = '<tr><td colspan="14" class="empty-state">Hata: ' + error.message + '</td></tr>';
      }
  }
  
  function createDenemeRow(deneme, tip) {
      const tr = document.createElement('tr');
      tr.className = 'deneme-row';
      tr.style.cursor = 'pointer';
      tr.onclick = (e) => {
          // Butonlara tıklanırsa modal açılmasın
          if (e.target.tagName === 'BUTTON') return;
          showYanlisKonularModal(deneme);
      };
      
      const totalNet = calculateTotalNet(deneme);
      const tarih = deneme.tarih ? new Date(deneme.tarih).toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric' }) : '-';
      
      const getDersCell = (dersId) => {
          if (!deneme.netler || !deneme.netler[dersId]) return '-';
          const d = deneme.netler[dersId];
          const dVal = parseInt(d.d) || 0;
          const yVal = parseInt(d.y) || 0;
          const bVal = parseInt(d.b) || 0;
          const net = calculateBransNet(deneme, dersId.charAt(0).toUpperCase() + dersId.slice(1));
          return `${dVal}D / ${yVal}Y / ${bVal}B<br><small style="color: var(--accent);">${net.toFixed(2)} net</small>`;
      };
      
      if (tip === 'TYT') {
          tr.innerHTML = `
              <td>${tarih}</td>
              <td><strong>${deneme.ad || 'İsimsiz'}</strong></td>
              <td><strong style="color: var(--accent);">${totalNet.toFixed(2)}</strong></td>
              <td>${getDersCell('türkçe')}</td>
              <td>${getDersCell('matematik')}</td>
              <td>${getDersCell('geometri')}</td>
              <td>${getDersCell('fizik')}</td>
              <td>${getDersCell('kimya')}</td>
              <td>${getDersCell('biyoloji')}</td>
              <td>${getDersCell('tarih')}</td>
              <td>${getDersCell('coğrafya')}</td>
              <td>${getDersCell('felsefe')}</td>
              <td>${getDersCell('dinkültürü')}</td>
              <td>
                  <button class="edit-btn" onclick="event.stopPropagation(); editDeneme('${deneme.id}')" style="margin-right: 0.5rem;">✏️</button>
                  <button class="delete-btn" onclick="event.stopPropagation(); deleteDeneme('${deneme.id}')">🗑️</button>
              </td>
          `;
      } else {
          tr.innerHTML = `
              <td>${tarih}</td>
              <td><strong>${deneme.ad || 'İsimsiz'}</strong></td>
              <td><strong style="color: var(--accent);">${totalNet.toFixed(2)}</strong></td>
              <td>${getDersCell('matematik')}</td>
              <td>${getDersCell('geometri')}</td>
              <td>${getDersCell('fizik')}</td>
              <td>${getDersCell('kimya')}</td>
              <td>${getDersCell('biyoloji')}</td>
              <td>${getDersCell('edebiyat')}</td>
              <td>${getDersCell('tarih')}</td>
              <td>${getDersCell('coğrafya')}</td>
              <td>${getDersCell('felsefe')}</td>
              <td>${getDersCell('dinkültürü')}</td>
              <td>
                  <button class="edit-btn" onclick="event.stopPropagation(); editDeneme('${deneme.id}')" style="margin-right: 0.5rem;">✏️</button>
                  <button class="delete-btn" onclick="event.stopPropagation(); deleteDeneme('${deneme.id}')">🗑️</button>
              </td>
          `;
      }
      
      return tr;
  }
  
  // Yanlış konular modal
  window.showYanlisKonularModal = function(deneme) {
      const modal = document.getElementById('yanlisKonularModal');
      const modalAdi = document.getElementById('modalDenemeAdi');
      const modalKonular = document.getElementById('modalYanlisKonular');
      
      if (!modal || !modalAdi || !modalKonular) return;
      
      modalAdi.textContent = `${deneme.ad || 'İsimsiz Deneme'} - ${deneme.tip}`;
      
      if (deneme.yanlislar && deneme.yanlislar.length > 0) {
          modalKonular.innerHTML = `
              <div class="yanlis-konular-list">
                  ${deneme.yanlislar.map(konu => `<div class="konu-tag">${konu}</div>`).join('')}
              </div>
          `;
      } else {
          modalKonular.innerHTML = '<p class="empty-state">Bu denemede yanlış konu kaydı bulunmuyor.</p>';
      }
      
      modal.style.display = 'flex';
  };
  
  window.closeYanlisKonularModal = function() {
      const modal = document.getElementById('yanlisKonularModal');
      if (modal) modal.style.display = 'none';
  };
  
  // TYT/AYT tab değiştirme
  window.showExamType = function(type) {
      document.querySelectorAll('.exam-tab-btn').forEach(btn => {
          if (btn.textContent === type) {
              btn.classList.add('active');
          } else {
              btn.classList.remove('active');
          }
      });
      
      if (type === 'TYT') {
          document.getElementById('tytTableContainer').style.display = 'block';
          document.getElementById('aytTableContainer').style.display = 'none';
      } else {
          document.getElementById('tytTableContainer').style.display = 'none';
          document.getElementById('aytTableContainer').style.display = 'block';
      }
  };
  
  // Deneme Düzenle
  window.editDeneme = async function(denemeId) {
      if (!currentUser) return;
      
      try {
          const denemeQuery = query(
              collection(db, "denemeler"),
              where("userId", "==", currentUser.uid)
          );
          const denemeSnapshot = await getDocs(denemeQuery);
          const deneme = denemeSnapshot.docs.find(doc => doc.id === denemeId);
          
          if (!deneme) {
              alert("Deneme bulunamadı!");
              return;
          }
          
          const denemeData = deneme.data();
          
          // Deneme Ekle sekmesine geç
          changeTab('add-deneme');
          
          // Formu doldur
          document.getElementById('denemeName').value = denemeData.ad || '';
          document.getElementById('denemeDate').value = denemeData.tarih || '';
          document.getElementById('examType').value = denemeData.tip || 'TYT';
          
          updateMistakeArea();
          
          // Netleri doldur
          setTimeout(() => {
              const netler = denemeData.netler || {};
              Object.keys(netler).forEach(dersId => {
                  const ders = netler[dersId];
                  const dInput = document.getElementById(`${dersId}D`);
                  const yInput = document.getElementById(`${dersId}Y`);
                  const bInput = document.getElementById(`${dersId}B`);
                  
                  if (dInput) dInput.value = ders.d || 0;
                  if (yInput) yInput.value = ders.y || 0;
                  if (bInput) bInput.value = ders.b || 0;
              });
              
              // Yanlış konuları doldur
              selectedMistakes = denemeData.yanlislar || [];
      renderTags();
              
              // Kaydet butonunu güncelle
              const saveBtn = document.querySelector('.save-btn');
              if (saveBtn) {
                  saveBtn.textContent = '💾 Denemeyi Güncelle';
                  saveBtn.setAttribute('data-deneme-id', denemeId);
                  saveBtn.onclick = () => updateDenemeData(denemeId);
              }
          }, 100);
      } catch (error) {
          console.error("Deneme düzenleme hatası:", error);
          alert("Deneme düzenlenirken bir hata oluştu: " + error.message);
      }
  };
  
  // Deneme Güncelle
  async function updateDenemeData(denemeId) {
      if (!currentUser) return alert("Önce giriş yapmalısın!");
      
      const examType = document.getElementById('examType').value;
      const dersler = examType === 'TYT' ? tytDersler : aytDersler;
      const netler = {};
      
      dersler.forEach(ders => {
          if (subjectsData[examType]?.[ders]) {
              const dersId = ders.toLowerCase().replace(/\s+/g, '');
              const d = document.getElementById(`${dersId}D`)?.value || 0;
              const y = document.getElementById(`${dersId}Y`)?.value || 0;
              const b = document.getElementById(`${dersId}B`)?.value || 0;
              netler[dersId] = { 
                  d: parseInt(d) || 0, 
                  y: parseInt(y) || 0,
                  b: parseInt(b) || 0 
              };
              
              if (examType === 'TYT' && tytSoruSayilari[ders]) {
                  const toplam = parseInt(d) + parseInt(y) + parseInt(b);
                  if (toplam > tytSoruSayilari[ders]) {
                      alert(`${ders} dersinde toplam soru sayısı ${tytSoruSayilari[ders]}'u geçemez!`);
                      return;
                  }
              }
          }
      });
      
      try {
          const { updateDoc, doc } = await import("https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js");
          await updateDoc(doc(db, "denemeler", denemeId), {
              ad: document.getElementById('denemeName').value || 'İsimsiz Deneme',
              tarih: document.getElementById('denemeDate').value || new Date().toISOString().split('T')[0],
              tip: examType,
              netler: netler,
              yanlislar: selectedMistakes
          });
          
          alert("Deneme başarıyla güncellendi! ✅");
          
          // Formu temizle ve kaydet butonunu sıfırla
          document.getElementById('denemeName').value = '';
          document.getElementById('denemeDate').value = new Date().toISOString().split('T')[0];
          selectedMistakes = [];
          renderTags();
          updateNetInputs();
          
          const saveBtn = document.querySelector('.save-btn');
          if (saveBtn) {
              saveBtn.textContent = '💾 Denemeyi Kaydet';
              saveBtn.removeAttribute('data-deneme-id');
              saveBtn.onclick = () => saveDenemeData();
          }
          
          loadDashboard();
      } catch (e) {
          alert("Hata: " + e.message);
      }
  }
  
  // Deneme Sil
  window.deleteDeneme = async function(denemeId) {
      if (!confirm("Bu denemeyi silmek istediğinize emin misiniz?")) return;
      
      try {
          const { deleteDoc, doc } = await import("https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js");
          await deleteDoc(doc(db, "denemeler", denemeId));
          alert("Deneme başarıyla silindi! ✅");
          loadDashboard();
      } catch (error) {
          console.error("Deneme silme hatası:", error);
          alert("Deneme silinirken bir hata oluştu: " + error.message);
      }
  };
  
  // Ayarlar
  function loadAyarlar() {
      const apiKeyInput = document.getElementById('apiKeyInput');
      const apiKeyStatus = document.getElementById('apiKeyStatus');
      const apiKeyStatusText = document.getElementById('apiKeyStatusText');
      
      if (!apiKeyInput || !apiKeyStatus || !apiKeyStatusText) {
          console.error("Ayarlar elementi bulunamadı!");
          return;
      }
      
      const savedKey = localStorage.getItem('gemini_api_key');
      
      // Input'u kesinlikle yazılabilir yap
      apiKeyInput.value = '';
      apiKeyInput.disabled = false;
      apiKeyInput.readOnly = false;
      apiKeyInput.removeAttribute('readonly');
      apiKeyInput.removeAttribute('disabled');
      apiKeyInput.style.pointerEvents = 'auto';
      apiKeyInput.style.cursor = 'text';
      apiKeyInput.style.userSelect = 'text';
      apiKeyInput.style.webkitUserSelect = 'text';
      apiKeyInput.tabIndex = 0;
      apiKeyInput.placeholder = savedKey ? 'Yeni API key girin veya mevcut keyi güncelleyin' : 'API keyinizi buraya yapıştırın';
      
      // Input'a tıklandığında kesinlikle aktif olsun
      apiKeyInput.addEventListener('click', function(e) {
          e.stopPropagation();
          this.focus();
          this.select();
          console.log('Input tıklandı, focus yapıldı');
      });
      
      // Input'a odaklanıldığında aktif olsun
      apiKeyInput.addEventListener('focus', function(e) {
          e.stopPropagation();
          this.style.borderColor = '#3b82f6';
          this.style.outline = 'none';
          console.log('Input focus oldu');
      });
      
      // Yapıştırma olayını kesinlikle çalıştır - preventDefault YAPMA!
      apiKeyInput.addEventListener('paste', function(e) {
          e.stopPropagation();
          // preventDefault YAPMA - yapıştırmayı engeller!
          const pastedText = (e.clipboardData || window.clipboardData).getData('text');
          console.log('Yapıştırılan metin:', pastedText);
          // Normal paste işlemi devam etsin
      }, false);
      
      // Input'a yazı yazılabilir olduğundan emin ol
      apiKeyInput.addEventListener('input', function(e) {
          e.stopPropagation();
          console.log('Input değeri değişti:', this.value);
      });
      
      // Tüm keyboard event'leri için
      apiKeyInput.addEventListener('keydown', function(e) {
          e.stopPropagation();
          console.log('Key pressed:', e.key);
      });
      
      // Context menu için (sağ tık yapıştır)
      apiKeyInput.addEventListener('contextmenu', function(e) {
          e.stopPropagation();
      });
      
      // Input'a odaklanıp odaklanmaması için test
      console.log('API Key Input:', {
          disabled: apiKeyInput.disabled,
          readOnly: apiKeyInput.readOnly,
          value: apiKeyInput.value,
          placeholder: apiKeyInput.placeholder,
          style: apiKeyInput.style.cssText
      });
      
      if (savedKey) {
          // Key var, durum göster
          apiKeyStatus.style.background = 'rgba(16, 185, 129, 0.2)';
          apiKeyStatus.style.border = '1px solid #10b981';
          apiKeyStatusText.innerHTML = `✅ API key kaydedilmiş. (${savedKey.substring(0, 10)}...${savedKey.substring(savedKey.length - 4)}) AI Mentor kullanılabilir.`;
      } else {
          apiKeyStatus.style.background = 'rgba(239, 68, 68, 0.2)';
          apiKeyStatus.style.border = '1px solid #ef4444';
          apiKeyStatusText.innerHTML = '⚠️ API key girilmemiş. AI Mentor kullanmak için API key gerekli.';
      }
  }
  
  window.saveAPIKey = function() {
      const apiKeyInput = document.getElementById('apiKeyInput');
      const apiKeyStatus = document.getElementById('apiKeyStatus');
      const apiKeyStatusText = document.getElementById('apiKeyStatusText');
      
      if (!apiKeyInput || !apiKeyStatus || !apiKeyStatusText) return;
      
      const apiKey = apiKeyInput.value.trim();
      
      if (!apiKey) {
          alert("Lütfen API key girin!");
          return;
      }
      
      if (!apiKey.startsWith('AIza')) {
          alert("Geçersiz API key formatı! API key 'AIza' ile başlamalı.");
          return;
      }
      
      localStorage.setItem('gemini_api_key', apiKey);
      apiKeyStatus.style.background = 'rgba(16, 185, 129, 0.2)';
      apiKeyStatus.style.border = '1px solid #10b981';
      apiKeyStatusText.innerHTML = `✅ API key başarıyla kaydedildi! (${apiKey.substring(0, 10)}...${apiKey.substring(apiKey.length - 4)}) AI Mentor kullanılabilir.`;
      apiKeyInput.value = ''; // Input'u temizle
      
      alert("API key kaydedildi! ✅ Artık AI Mentor'u kullanabilirsiniz.");
  }
  
  // Çalışma Takibi
  window.saveCalismaData = async function() {
      if(!currentUser) return alert("Önce giriş yapmalısın!");
  
      const calisma = {
          userId: currentUser.uid,
          ders: document.getElementById('calismaDers').value,
          konu: document.getElementById('calismaKonu').value,
          soruSayisi: parseInt(document.getElementById('calismaSoru').value) || 0,
          sure: parseFloat(document.getElementById('calismaSure').value) || 0,
          tarih: document.getElementById('calismaDate').value || new Date().toISOString().split('T')[0],
          createdAt: serverTimestamp()
      };
      
      if (!calisma.konu) {
          alert("Lütfen konu adı girin!");
          return;
      }
      
      try {
          await addDoc(collection(db, "calismalar"), calisma);
          alert("Çalışma kaydedildi! ✅");
          document.getElementById('calismaKonu').value = '';
          document.getElementById('calismaSoru').value = '';
          document.getElementById('calismaSure').value = '';
          loadCalismaReports();
      } catch (e) {
          alert("Hata: " + e.message);
      }
  };
  
  async function loadCalismaReports() {
      if (!currentUser) return;
      
      try {
          const calismalarQuery = query(
              collection(db, "calismalar"),
              where("userId", "==", currentUser.uid)
          );
          const calismalarSnapshot = await getDocs(calismalarQuery);
          const calismalar = calismalarSnapshot.docs.map(doc => doc.data());
          
          const now = new Date();
          const weekStart = new Date(now.setDate(now.getDate() - now.getDay()));
          weekStart.setHours(0, 0, 0, 0);
          
          const haftalikCalismalar = calismalar.filter(c => new Date(c.tarih) >= weekStart);
          const haftalikSure = haftalikCalismalar.reduce((sum, c) => sum + (c.sure || 0), 0);
          const haftalikSoru = haftalikCalismalar.reduce((sum, c) => sum + (c.soruSayisi || 0), 0);
          
          const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
          const aylikCalismalar = calismalar.filter(c => new Date(c.tarih) >= monthStart);
          const aylikSure = aylikCalismalar.reduce((sum, c) => sum + (c.sure || 0), 0);
          const aylikSoru = aylikCalismalar.reduce((sum, c) => sum + (c.soruSayisi || 0), 0);
          
          document.getElementById('haftalikSure').textContent = haftalikSure.toFixed(1) + ' saat';
          document.getElementById('haftalikSoru').textContent = haftalikSoru + ' soru';
          document.getElementById('aylikSure').textContent = aylikSure.toFixed(1) + ' saat';
          document.getElementById('aylikSoru').textContent = aylikSoru + ' soru';
      } catch (error) {
          console.error("Çalışma raporları yükleme hatası:", error);
      }
  }
  
  // AI Mentor
  window.handleChatKeyPress = function(event) {
      if (event.key === 'Enter') sendChatMessage();
  };
  
  window.sendChatMessage = async function() {
      const input = document.getElementById('chatInput');
      const message = input.value.trim();
      if (!message) return;
      
      addChatMessage(message, 'user');
      input.value = '';
      const loadingId = addChatMessage('Analiz ediliyor...', 'bot', true);
      
      try {
          const context = await buildAIContext();
          const aiResponse = await callGeminiAPI(message, context);
          removeChatMessage(loadingId);
          addChatMessage(aiResponse, 'bot');
      } catch (error) {
          removeChatMessage(loadingId);
          console.error("AI Mentor hatası:", error);
          addChatMessage(`Üzgünüm, bir hata oluştu: ${error.message || error}. Lütfen konsolu kontrol edin (F12).`, 'bot');
      }
  };
  
  async function buildAIContext() {
      if (!currentUser) return '';
      
      try {
          // Firestore index sorununu önlemek için önce where ile al, sonra JavaScript'te sırala
          const denemelerQuery = query(
              collection(db, "denemeler"),
              where("userId", "==", currentUser.uid)
          );
          const denemelerSnapshot = await getDocs(denemelerQuery);
          let denemeler = denemelerSnapshot.docs.map(doc => doc.data());
          
          // JavaScript'te tarihe göre sırala ve en son 5'i al
          denemeler.sort((a, b) => {
              const tarihA = a.tarih || (a.createdAt?.toDate ? a.createdAt.toDate().toISOString() : '');
              const tarihB = b.tarih || (b.createdAt?.toDate ? b.createdAt.toDate().toISOString() : '');
              return tarihB.localeCompare(tarihA);
          });
          denemeler = denemeler.slice(0, 5);
          
          const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
          const calismalarQuery = query(collection(db, "calismalar"), where("userId", "==", currentUser.uid));
          const calismalarSnapshot = await getDocs(calismalarQuery);
          const calismalar = calismalarSnapshot.docs.map(doc => doc.data()).filter(c => new Date(c.tarih) >= weekAgo);
          
          let context = "Kullanıcının son 5 deneme sonucu:\n\n";
          denemeler.forEach((d, i) => {
              const net = calculateTotalNet(d);
              context += `${i + 1}. ${d.ad || 'Deneme'} (${d.tip}) - Toplam Net: ${net.toFixed(2)}\n`;
              context += `   Tarih: ${d.tarih || 'Belirtilmemiş'}\n`;
              
              // Ders bazlı detaylar
              if (d.netler && Object.keys(d.netler).length > 0) {
                  context += `   Ders Detayları:\n`;
                  Object.keys(d.netler).forEach(dersId => {
                      const dersData = d.netler[dersId];
                      const dersAdi = dersId.charAt(0).toUpperCase() + dersId.slice(1);
                      const d = parseInt(dersData.d) || 0;
                      const y = parseInt(dersData.y) || 0;
                      const b = parseInt(dersData.b) || 0;
                      const dersNet = calculateBransNet(d, dersAdi);
                      context += `     - ${dersAdi}: ${d} Doğru, ${y} Yanlış, ${b} Boş → Net: ${dersNet.toFixed(2)}\n`;
                  });
              }
              
              // Yanlış yapılan konular (önemli!)
              if (d.yanlislar && d.yanlislar.length > 0) {
                  context += `   🔴 Yanlış Yapılan Konular (${d.yanlislar.length} adet):\n`;
                  d.yanlislar.forEach((konu, idx) => {
                      context += `     ${idx + 1}. ${konu}\n`;
                  });
              } else {
                  context += `   ⚠️ Bu denemede yanlış konu kaydı bulunmuyor.\n`;
              }
              context += '\n';
          });
          
          // Yanlış konular özet istatistiği
          if (denemeler.length > 0) {
              const tumYanlislar = [];
              denemeler.forEach(d => {
                  if (d.yanlislar && d.yanlislar.length > 0) {
                      tumYanlislar.push(...d.yanlislar);
                  }
              });
              
              if (tumYanlislar.length > 0) {
                  // En çok yanlış yapılan konular
                  const konuSayilari = {};
                  tumYanlislar.forEach(konu => {
                      konuSayilari[konu] = (konuSayilari[konu] || 0) + 1;
                  });
                  
                  const enCokYanlis = Object.entries(konuSayilari)
                      .sort((a, b) => b[1] - a[1])
                      .slice(0, 5);
                  
                  context += "\n📊 ÖNEMLİ İSTATİSTİKLER:\n";
                  context += `En çok yanlış yapılan konular (son 5 denemede):\n`;
                  enCokYanlis.forEach(([konu, sayi], idx) => {
                      context += `  ${idx + 1}. ${konu}: ${sayi} kez yanlış\n`;
                  });
                  context += '\n';
              }
          }
          
          context += "\n📚 Son 1 haftalık çalışma verileri:\n";
          const toplamSure = calismalar.reduce((sum, c) => sum + (c.sure || 0), 0);
          const toplamSoru = calismalar.reduce((sum, c) => sum + (c.soruSayisi || 0), 0);
          context += `Toplam çalışma: ${toplamSure.toFixed(1)} saat, ${toplamSoru} soru\n`;
          
          if (calismalar.length > 0) {
              context += "\nÇalışılan konular:\n";
              calismalar.forEach(c => {
                  context += `- ${c.ders}: ${c.konu} (${c.soruSayisi} soru, ${c.sure} saat)\n`;
              });
          } else {
              context += "Bu hafta henüz çalışma kaydı bulunmuyor.\n";
          }
          
          return context;
      } catch (error) {
          console.error("Context oluşturma hatası:", error);
          return '';
      }
  }
  
  async function callGeminiAPI(userMessage, context) {
      // API key'i direkt kodda veya localStorage'dan al
      let API_KEY = localStorage.getItem('gemini_api_key') || "AIzaSyDlG7fILSR0KICILkw0qrFCjEcTVOburfo";
      
      if (!API_KEY) {
          return `Merhaba! Senin için analiz yapmak isterim ama Gemini API key'i gerekiyor. 

🔑 API Key Nasıl Alınır:
1. https://makersuite.google.com/app/apikey adresine git
2. Google hesabınla giriş yap
3. "Create API Key" butonuna tıkla
4. Oluşturulan key'i kopyala ve Ayarlar sekmesinden girebilirsin

Şu anki verilerin:\n${context}`;
      }
      
      const prompt = `Sen bir YKS hazırlık öğrencisinin eğitim koçusun. Öğrencinin verileri:\n\n${context}\n\nÖğrencinin sorusu: ${userMessage}\n\nKısa, samimi ve motive edici bir şekilde cevap ver. Türkçe yaz.`;
      
      console.log("Gemini API çağrılıyor...", { API_KEY: API_KEY.substring(0, 10) + "...", promptLength: prompt.length });
      
      try {
          // Gemini API v1 endpoint - Çalışan modelleri dene
          // Araştırmaya göre: Gemini 1.5 serisi kesinlikle çalışıyor, yeni modeller için format belirsiz
          // Önce garantili çalışan modelleri dene, sonra yeni modelleri
          const modelsToTry = [
              // Gemini 1.5 serisi - GARANTİLİ ÇALIŞIR (en yaygın kullanılan)
              'gemini-1.5-flash',
              'gemini-1.5-pro',
              'gemini-1.5-flash-001',
              'gemini-1.5-pro-001',
              // Gemini 2.5 serisi - Yeni ama format belirsiz
              'gemini-2.5-flash',
              'gemini-2.5-pro',
              'gemini-2.5-flash-lite',
              // Gemini 2.0 serisi
              'gemini-2.0-flash',
              'gemini-2.0-flash-lite',
              // Gemini 3 serisi - En yeni ama format belirsiz
              'gemini-3-flash',
              'gemini-3-pro',
              // Son çare: eski modeller
              'gemini-pro',
              'gemini-flash'
          ];
          
          let response;
          let modelName;
          let lastError;
          
          for (const testModel of modelsToTry) {
              modelName = testModel;
              const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${API_KEY}`;
              console.log(`Model deneniyor: ${modelName}`);
              
              response = await fetch(API_URL, {
                  method: 'POST',
                  headers: { 
                      'Content-Type': 'application/json'
                  },
                  body: JSON.stringify({ 
                      contents: [{ 
                          parts: [{ text: prompt }] 
                      }]
                  })
              });
              
              console.log(`${modelName} - Response Status:`, response.status);
              
              if (response.ok) {
                  console.log(`✅ Başarılı model: ${modelName}`);
                  break;
              } else if (response.status === 404) {
                  const errorData = await response.json().catch(() => ({}));
                  console.log(`${modelName} bulunamadı:`, errorData.error?.message);
                  lastError = errorData.error?.message || 'Model bulunamadı';
                  if (testModel === modelsToTry[modelsToTry.length - 1]) {
                      // Son model de başarısız oldu
                      throw new Error(`Tüm modeller denenildi ama hiçbiri çalışmadı. Son hata: ${lastError}`);
                  }
                  continue; // Bir sonraki modeli dene
              } else {
                  // 404 dışı hata varsa dur ve hata fırlat
                  let errorData;
                  try {
                      errorData = await response.json();
                      console.error("API Error Data:", errorData);
                  } catch (e) {
                      errorData = { error: { message: await response.text() } };
                  }
                  
                  if (response.status === 400 || response.status === 403) {
                      localStorage.removeItem('gemini_api_key');
                      throw new Error(`API key geçersiz veya yetkilendirme hatası: ${errorData.error?.message || response.statusText}`);
                  }
                  throw new Error(`API hatası (${response.status}): ${errorData.error?.message || response.statusText}`);
              }
          }
          
          if (!response || !response.ok) {
              throw new Error(`Tüm modeller denenildi ama hiçbiri çalışmadı. Son hata: ${lastError || 'Bilinmeyen hata'}`);
          }
          
          const data = await response.json();
          console.log("API Response Data:", data);
          
          if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
              console.error("API Response yapısı beklenen formatta değil:", data);
              throw new Error("API'den geçerli yanıt alınamadı. Response: " + JSON.stringify(data));
          }
          
          const text = data.candidates[0].content.parts[0].text;
          if (!text) {
              throw new Error("API yanıtı metin içermiyor: " + JSON.stringify(data.candidates[0]));
          }
          
          return text;
      } catch (error) {
          console.error("Gemini API Çağrı Hatası:", error);
          if (error.message.includes("API key")) {
              localStorage.removeItem('gemini_api_key');
          }
          throw error;
      }
  }
  
  function addChatMessage(text, type, isLoading = false) {
      const container = document.getElementById('chatMessages');
      if (!container) return null;
      
      const messageDiv = document.createElement('div');
      messageDiv.className = `chat-message ${type}`;
      messageDiv.id = 'msg-' + Date.now();
      
      const contentDiv = document.createElement('div');
      contentDiv.className = 'message-content';
      if (isLoading) {
          contentDiv.innerHTML = '<span class="loading"></span> ' + text;
      } else {
          contentDiv.textContent = text;
      }
      
      messageDiv.appendChild(contentDiv);
      container.appendChild(messageDiv);
      container.scrollTop = container.scrollHeight;
      return messageDiv.id;
  }
  
  function removeChatMessage(messageId) {
      const message = document.getElementById(messageId);
      if (message) message.remove();
  }
  
  // GİRİŞ KONTROLÜ (güncellenmiş)
  onAuthStateChanged(auth, (user) => {
      if (user) {
          currentUser = user;
          document.getElementById('auth-container').style.display = 'none';
          document.getElementById('app-container').style.display = 'flex';
          if (document.getElementById('userEmail')) {
              document.getElementById('userEmail').textContent = user.email;
          }
          const today = new Date().toISOString().split('T')[0];
          if (document.getElementById('denemeDate')) document.getElementById('denemeDate').value = today;
          if (document.getElementById('calismaDate')) document.getElementById('calismaDate').value = today;
          loadDashboard();
      } else {
          document.getElementById('auth-container').style.display = 'flex';
          document.getElementById('app-container').style.display = 'none';
      }
  });
  
  // Çıkış Yap
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
      logoutBtn.onclick = () => signOut(auth);
  }