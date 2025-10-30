# 🚀 HƯỚNG DẪN CHẠY APP

## Cài Đặt & Chạy

```bash
# Đã cài dependencies rồi, chỉ cần chạy:
npm start
```

App sẽ mở tại: `http://localhost:3000`

---

## 📸 Screenshots Features

### 1. Home Page
- **Hero Section**: Title gradient "Discover Amazing Polls 🎯"
- **Search Bar**: Real-time search polls
- **Stats**: Hiển thị total polls & votes
- **Tabs**: Recent / Popular / Trending
- **Poll Cards**: 
  - Top border màu theo category
  - Trending badge khi >50 votes
  - Avatar creator
  - Category chips có màu

### 2. Login & Register
- **Glassmorphism Card**: Transparent background
- **Floating Icon**: Gradient icon box with animation
- **Gradient Text**: Title với gradient effect
- **Password Strength** (Register): 
  - Weak (Red) < 50%
  - Good (Orange) 50-75%
  - Strong (Green) > 75%

### 3. Create Poll
- **Category Selection**: Click chips để chọn category
- **Dynamic Colors**: Mỗi category khác màu
- **Add/Remove Options**: Min 2 options
- **Gradient Submit**: Pink/Purple gradient button

### 4. Poll Detail (⭐ Most Important)
**Khi chưa vote:**
- Vote cards với border color theo category
- Hover effect slide right
- Selected state với background color
- Submit button gradient category color

**Khi chưa login:**
- Beautiful CTA card
- "Login Now" button navigate to /login

**Results:**
- LinearProgress bars với gradient
- Percentage display
- Pie chart
- Share buttons (FB, Twitter, LinkedIn)
- Download PNG/PDF

### 5. My Polls & Liked Polls
- Hero section với icon animation
- Grid responsive
- Empty state friendly

---

## 🎨 Tùy Chỉnh

### Thay đổi màu category:
File: `src/pages/PollDetail.js`, `src/components/PollCard.js`, `src/pages/CreatePoll.js`

```javascript
const categoryColors = {
  general: '#6366f1',      // Thay màu tại đây
  sports: '#10b981',
  entertainment: '#ec4899',
  technology: '#8b5cf6',
  politics: '#f59e0b',
  other: '#64748b',
};
```

### Thay đổi background gradient:
File: `src/App.css`

```css
.App {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  /* Thay gradient tại đây */
}
```

### Thay đổi primary color:
File: `src/App.js` trong theme

```javascript
primary: {
  main: '#6366f1',  // Thay màu chính
},
```

---

## 🔥 New Features UI

### 1. Search Polls
- Real-time search by title, description, category
- Icon search đẹp mắt

### 2. Filter Tabs
- **Recent**: Polls mới nhất
- **Popular**: Sort by total votes
- **Trending**: Sort by likes

### 3. Password Strength Indicator
- Visual bar hiển thị độ mạnh password
- Color coded: Red/Orange/Green

### 4. Mobile Responsive
- Navbar collapse thành drawer
- Avatar + menu items
- Full features on mobile

### 5. Animations
- Fade in khi load
- Float animation cho icons
- Hover lift effects
- Smooth transitions

---

## 🐛 Troubleshooting

### Port đã được sử dụng:
```bash
# Kill process trên port 3000
npx kill-port 3000
npm start
```

### Font không load:
- Kiểm tra internet connection
- Font Inter từ Google Fonts cần internet

### Gradient không hiển thị:
- Clear browser cache
- Hard refresh: Ctrl + Shift + R (Windows) / Cmd + Shift + R (Mac)

---

## 📦 Build Production

```bash
npm run build
```

Build folder sẽ chứa optimized production files.

---

## 🎯 Test Checklist

- [ ] Home page load và search hoạt động
- [ ] Login/Register với validation
- [ ] Create poll với category selection
- [ ] Vote trên poll (khi đã login)
- [ ] Like/Unlike poll
- [ ] Real-time updates khi có vote mới
- [ ] Share buttons hoạt động
- [ ] Download PNG/PDF
- [ ] Mobile responsive
- [ ] Animations smooth

---

**Enjoy your beautiful polling app! 🎉**
