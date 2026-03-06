# 🔗 ІНТЕГРАЦІЇ З ЗОВНІШНІМИ СЕРВІСАМИ

## Детальне пояснення кожної інтеграції

---

## 1. 💳 **COMGATE - ПЛАТІЖНА СИСТЕМА**

### **Що це:**
Платіжний шлюз для приймання онлайн платежів картками.

### **Як працює:**
```
1. Клієнт додає товар в кошик
2. Натискає "Zaplatit"
3. Перенаправляється на Comgate.cz
4. Вводить дані картки на безпечній сторінці Comgate
5. Платить
6. Comgate перевіряє платіж
7. Гроші йдуть на ваш банківський рахунок
8. Клієнт повертається на ваш сайт
9. Ви отримуєте email про оплату
10. Відправляєте товар
```

### **Що потрібно від вас:**
```
📄 ДОКУМЕНТИ:
✅ IČO (ідентифікаційний номер компанії)
✅ DIČ (податковий номер)
✅ Výpis z obchodního rejstříku (виписка з реєстру)
✅ Číslo bankovního účtu (IBAN)
✅ Kontaktní osoba (ім'я, email, telefon)

⏱️ ЧАС:
- Заповнення форми: 30 хвилин
- Підписання договору: 15 хвилин
- Очікування схвалення: 2-5 робочих днів
- Інтеграція (моя робота): 12-16 годин
```

### **Процес реєстрації:**
```
КРОК 1: Відкрити www.comgate.cz
КРОК 2: Клікнути "Registrace"
КРОК 3: Заповнити:
        - Název firmy (назва компанії)
        - IČO
        - Jméno kontaktní osoby (ваше ім'я)
        - Email
        - Telefon
        - Číslo účtu
КРОК 4: Надіслати документи:
        - Sken výpisu z OR
        - Kopie OP/pasu
КРОК 5: Підписати smlouvu (договір)
КРОК 6: Чекати schválení (схвалення)
КРОК 7: Отримати:
        - Merchant ID (ваш ідентифікатор)
        - API Key (секретний ключ)
        - Test API Key (для тестів)
```

### **Вартість:**
```
💰 Měsíční poplatek: 0 Kč (немає абонентської плати)
💰 Poplatek za transakci: 1.9% + 2 Kč

ПРИКЛАД:
Prodej: 10,000 Kč
Poplatek: 192 Kč (1.9%) + 2 Kč = 194 Kč
Dostanete: 9,806 Kč

Prodej: 1,000 Kč  
Poplatek: 19 Kč + 2 Kč = 21 Kč
Dostanete: 979 Kč
```

### **Виплати:**
```
⏰ Kdy: Každý den
💵 Minimum: Žádné
📅 T+2: Za 2 pracovní dny

PŘÍKLAD:
Pondělí → zákazník zaplatil
Středa → peníze na vašem účtu
```

### **Що я зроблю (технічна інтеграція):**
```
Backend (Node.js):
✅ API pro vytvoření platby
✅ Callback handler (potvrzení platby)
✅ Webhook (okamžité upozornění)
✅ Ověření podpisu (bezpečnost)
✅ Uložení platby do databáze

Frontend:
✅ Tlačítko "Zaplatit kartou"
✅ Přesměrování na Comgate
✅ Zpracování návratu
✅ Zobrazení výsledku
```

### **Bezpečnost:**
```
✅ PCI DSS certifikace
✅ 3D Secure (dodatečné ověření)
✅ Šifrování SSL/TLS
✅ Vy NIKDY neuvidíte čísla karet
✅ Vše probíhá na Comgate serverech
```

---

## 2. 💬 **TAWK.TO - LIVE CHAT**

### **Що це:**
Bezplatný live chat pro komunikaci se zákazníky přímo na webu.

### **Як працює:**
```
1. Zákazník otevře web
2. Vidí zelené tlačítko v rohu
3. Klikne a napíše zprávu
4. Vy dostanete:
   - Email upozornění
   - Push notifikace (mobil)
   - Notifikace v prohlížeči
5. Odpovíte z:
   - Počítače (web)
   - Telefonu (app)
   - Tabletu (app)
6. Konverzace se uloží
```

### **Що потрібно від вас:**
```
📧 EMAIL: Pro registraci
⏱️ ČAS: 10 minut
📱 TELEFON: Pro instalaci aplikace (doporučeno)
```

### **Процес реєстрації:**
```
KROK 1: Jít na www.tawk.to
KROK 2: Kliknout "Sign up free"
KROK 3: Zadat:
        - Email
        - Heslo
        - Jméno
KROK 4: Vytvořit "Property" (váš web)
KROK 5: Zadat:
        - Název: "IKarden"
        - URL: ikarden.cz
KROK 6: Zkopírovat kód
KROK 7: Poslat mi kód → já přidám na web
```

### **Funkce:**
```
✅ Neomezený počet chatů
✅ Neomezený počet agentů (zaměstnanců)
✅ Historie konverzací
✅ Soubory (obrázky, dokumenty)
✅ Offline zprávy (když nejste online)
✅ Automatické odpovědi
✅ Návštěvnická statistika
✅ Hodnocení konverzací
✅ Mobilní aplikace (iOS/Android)
```

### **Вартість:**
```
💰 ZDARMA navždy!
```

### **Aplikace:**
```
📱 iOS: App Store → "tawk.to"
📱 Android: Google Play → "tawk.to"

Co dělá:
- Push notifikace
- Odpovídání odkudkoliv
- Historie chatů
- Rychlé odpovědi
```

### **Що я зроблю:**
```
✅ Přidám kód na web
✅ Nastavím barvu (zelená)
✅ Upravím pozici (vpravo dole)
✅ Přidám powítací zprávu:
   "Dobrý den! Jak vám mohu pomoci?"
```

---

## 3. 📊 **GOOGLE ANALYTICS**

### **Що це:**
Bezplatný nástroj od Google pro sledování návštěvníků webu.

### **Що показує:**
```
📈 NÁVŠTĚVNÍCI:
   - Kolik lidí přišlo
   - Odkud přišli (Google, Facebook...)
   - Které stránky navštívili
   - Jak dlouho zůstali

📊 OBJEDNÁVKY:
   - Kolik prodejů
   - Průměrná hodnota
   - Konverzní poměr
   - Opuštěné košíky

📱 ZAŘÍZENÍ:
   - Mobil / Počítač / Tablet
   - Prohlížeč (Chrome, Safari...)
   - Operační systém

🌍 LOKACE:
   - Z jakých měst
   - Z jakých zemí
```

### **Що потрібно від вас:**
```
📧 GMAIL ÚČET: Už máte nebo vytvořit nový
⏱️ ČAS: 15 minut registrace
```

### **Процес реєстрації:**
```
KROK 1: Jít na analytics.google.com
KROK 2: Přihlásit se Gmail
KROK 3: "Vytvořit účet"
KROK 4: Zadat:
        - Název účtu: "IKarden"
        - Název vlastnosti: "IKarden Web"
        - URL: ikarden.cz
        - Kategorie: "Shopping"
KROK 5: Souhlasit s podmínkami
KROK 6: Zkopírovat "Measurement ID" (G-XXXXXXXXX)
KROK 7: Poslat mi ID → já přidám na web
```

### **Що я зроблю:**
```
✅ Přidám tracking kód
✅ Nastavím cíle:
   - Přidání do košíku
   - Zahájení objednávky
   - Dokončení platby
✅ Nastavím e-commerce tracking
✅ Propojím s Search Console
```

### **Příklady reportů:**
```
📊 "Máte 500 návštěvníků měsíčně"
📊 "30% návštěvníků přišlo z Google"
📊 "Průměrný čas: 3 minuty"
📊 "10 prodejů, průměrná hodnota 8,000 Kč"
📊 "80% mobilních návštěvníků"
```

### **Вартість:**
```
💰 ZDARMA navždy!
```

---

## 4. 🔍 **GOOGLE SEARCH CONSOLE**

### **Що це:**
Nástroj pro monitorování výkonu webu v Google vyhledávání.

### **Що показує:**
```
🔍 VYHLEDÁVÁNÍ:
   - Jaká slova lidé hledají
   - Na jaké pozici jste
   - Kolik kliků dostanete
   - CTR (míra prokliků)

🐛 CHYBY:
   - Chyby indexace
   - Mobilní problémy
   - Rychlost načítání
   - Bezpečnostní problémy

📄 INDEXACE:
   - Kolik stránek je v Google
   - Které stránky nejsou indexované
   - Sitemap status
```

### **Що потрібно від вас:**
```
📧 GMAIL ÚČET: Stejný jako Analytics
⏱️ ČAS: 10 minut
```

### **Процес реєстрації:**
```
KROK 1: Jít na search.google.com/search-console
KROK 2: "Přidat vlastnost"
KROK 3: Zadat: ikarden.cz
KROK 4: Ověření (já pomohu):
        - HTML tag metoda
        - Nebo Google Analytics metoda
KROK 5: Odeslat sitemap:
        - ikarden.cz/sitemap.xml
```

### **Що я зроблю:**
```
✅ Přidám ověřovací kód
✅ Vytvořím sitemap.xml
✅ Odešlu sitemap
✅ Nastavím upozornění
✅ Opravím chyby indexace
```

### **Вартість:**
```
💰 ZDARMA navždy!
```

---

## 5. 🖥️ **FIREBASE (BACKEND)**

### **Що це:**
Cloudová platforma od Google pro backend aplikací.

### **Що poskytuje:**
```
💾 DATABÁZE:
   - Firestore (NoSQL)
   - Real-time synchronizace
   - Offline mode

🔐 AUTENTIZACE:
   - Přihlášení (admin panel)
   - Zabezpečení

☁️ HOSTING:
   - Rychlý hosting
   - CDN (po celém světě)
   - SSL zdarma

📦 STORAGE:
   - Ukládání obrázků
   - Soubory
```

### **Що потрібно від вас:**
```
📧 GMAIL ÚČET: Stejný jako Analytics
💳 PLATEBNÍ KARTA: Pro upgrade (později)
⏱️ ČAS: Nic, já vše nastavím
```

### **Процес налаштування:**
```
JÁ UDĚLÁM VŠE:
✅ Vytvořím Firebase projekt
✅ Nastavím Firestore databázi
✅ Nakonfiguruji pravidla
✅ Propojím s webem
✅ Vytvořím admin účet
✅ Dám vám přístup
```

### **Вартість:**
```
💰 SPARK PLAN (ZDARMA):
   - 1GB ukládání
   - 10GB přenos/měsíc
   - 50,000 čtení/den
   - 20,000 zápis/den
   
   Stačí pro:
   - 100-200 objednávek/měsíc
   - 1000-2000 návštěvníků/měsíc

💰 BLAZE PLAN (PAY AS YOU GO):
   - První GB zdarma
   - Pak: 0.18$/GB (~4.3 Kč/GB)
   - Přibližně: 100-200 Kč/měsíc
```

---

## 6. 📧 **SENDGRID (EMAIL)**

### **Що це:**
Služba pro odesílání automatických emailů.

### **Які emaili:**
```
📧 ZÁKAZNÍKOVI:
   - Potvrzení objednávky
   - Změna stavu
   - Sledování zásilky
   - Doručeno

📧 VÁM (adminovi):
   - Nová objednávka
   - Nový dotaz z formuláře
   - Chyba platby
```

### **Що потрібно від вас:**
```
📧 EMAIL: Pro registraci
⏱️ ČAS: 15 minut
💳 KARTA: Ne pro Free tier
```

### **Процес реєстрації:**
```
KROK 1: Jít na sendgrid.com
KROK 2: "Sign up"
KROK 3: Zadat:
        - Email
        - Heslo
        - Jméno firmy
KROK 4: Ověřit email
KROK 5: Vytvořit API klíč
KROK 6: Poslat mi API klíč
```

### **Що я зроблю:**
```
✅ Vytvořím šablony emailů
✅ Design (se stylem webu)
✅ Propojím s backend
✅ Nastavím odesílání
✅ Otestuji
```

### **Вартість:**
```
💰 FREE TIER:
   - 100 emailů/den
   - 3,000 emailů/měsíc
   - Zdarma navždy

💰 ESSENTIALS:
   - 50,000 emailů/měsíc
   - $19.95/měsíc (~480 Kč)
```

---

## 📊 **SROVNÁNÍ PLÁNŮ:**

### **BEZ JAKÝCHKOLIV INTEGRACÍ:**
```
✅ Statický web
✅ Produkty v localStorage
✅ Email formulář
✅ Ručn processing objednávek

💰 Náklady: 0 Kč
⏱️ Čas: Hotovo
```

### **ZÁKLADNÍ INTEGRACE:**
```
✅ Google Analytics
✅ Google Search Console
✅ Tawk.to Live Chat

💰 Náklady: 0 Kč
⏱️ Čas: 2-3 dny
```

### **POKROČILÉ (BEZ PLATEB):**
```
✅ Základní integrace
✅ Firebase (Spark)
✅ SendGrid (Free)
✅ Backend s databází

💰 Náklady: 0 Kč
⏱️ Čas: 2 týdny
```

### **KOMPLETNÍ E-SHOP:**
```
✅ Pokročilé integrace
✅ Comgate platby
✅ Firebase (Blaze)
✅ SendGrid (možná paid)

💰 Náklady: 
   - Comgate: 1.9% z prodeje
   - Firebase: ~100-200 Kč/měsíc
   - SendGrid: možná 480 Kč/měsíc
   CELKEM: ~500-700 Kč/měsíc + komise

⏱️ Čas: 4 týdny
```

---

## 🎯 **MŮJ DOPORUČENÍ:**

```
ZAČÍT S: Základní integrace
   ↓
   (Analytics, Search Console, Chat)
   ↓
POTOM: Pokročilé bez plateb
   ↓
   (Firebase, Backend)
   ↓
NAKONEC: Comgate platby
   ↓
   (Když už máte objednávky)
```

---

**MÁTE OTÁZKY? PTEJTE SE! 💬**
