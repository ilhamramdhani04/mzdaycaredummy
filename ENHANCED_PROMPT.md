# Enhanced Prompt: Daycare Daily Reporting Demo Application

## Task Definition

Build a complete, functional web-based daycare daily reporting demo application using React that demonstrates role-based access control with three distinct user roles. The application must support creating, viewing, and editing daily reports for children in a daycare setting.

**Success Criteria:**
- A fully functional React application running locally
- Three distinct user roles (superadmin, guru, Eltern) with proper access controls
- Complete CRUD operations for daily reports
- All data persisted in localStorage and JSON files
- Clean, responsive UI with sidebar navigation
- No external dependencies or backend required

---

## Context & Background

### Domain
Early childhood education and childcare management, specifically daily activity and health reporting for daycare centers.

### Current Situation
Daycare centers need a systematic way to track children's daily activities, health conditions, meals, and developmental stimulation. Currently, this process is manual and paper-based, leading to:
- Inconsistent data collection
- Difficulty for parents to access their child's daily reports
- No centralized access for administrators to oversee all children
- Teachers lack an efficient digital tool for daily reporting

### Target Users
1. **Superadmin** - Daycare administrators/owners who need oversight of all children and reports
2. **Guru (Teachers)** - Staff members responsible for daily care and report entry
3. **Orangtua (Parents)** - Parents who can only view their own child's reports

### Constraints & Limitations
- No backend server (frontend-only application)
- No external database (use local JSON files and localStorage)
- No authentication libraries (implement custom auth)
- Must run locally with simple npm commands
- Single-page application (SPA) architecture

---

## Technical Requirements

### Technology Stack
| Technology | Purpose | Version |
|------------|---------|---------|
| React | UI Framework | 18+ |
| Vite | Build Tool & Dev Server | 5+ |
| React Router | Client-side Routing | 6+ |
| useState | Local State Management | React Built-in |
| useEffect | Side Effects & Data Fetching | React Built-in |
| localStorage | Client-side Data Persistence | Browser API |
| JSON Files | Static Dummy Database | N/A |

### Technical Specifications

#### Performance Requirements
- Initial load time under 3 seconds
- Route transitions under 500ms
- Form submission response under 1 second

#### Compatibility Requirements
- Modern browsers (Chrome, Firefox, Safari, Edge)
- Responsive design for mobile and desktop
- Minimum screen width: 320px

#### Security Requirements
- Client-side session management via localStorage
- Route protection (redirect unauthenticated users)
- Input validation on all forms

---

## Role-Based Permission Matrix

### User Roles

| Role | Description | Capabilities |
|------|-------------|--------------|
| superadmin | Administrator | View all children, view all reports, read-only access |
| guru | Teacher/Caregiver | View all children, create/edit/save reports |
| Eltern | Parent | View only own children, read-only access |

### Permission Details

#### Superadmin Permissions
- [x] View all children in dashboard
- [x] Access any child's report via URL
- [x] Read-only mode on all report sections
- [x] No save button displayed
- [x] Cannot modify any report data

#### Guru Permissions
- [x] View all children in dashboard
- [x] Access any child's report via URL
- [x] Edit all report fields
- [x] Save reports to localStorage
- [x] Redirect to dashboard after save

#### Orangtua Permissions
- [x] View only assigned children (where parentId matches user.id)
- [x] Access only their children's reports
- [x] Read-only mode on all report sections
- [x] No save button displayed
- [x] Cannot modify any report data

---

## Data Structure Specifications

### Users Data (`/data/users.json`)

```json
[
  {
    "id": 1,
    "username": "admin",
    "password": "password",
    "role": "superadmin",
    "displayName": "Administrator"
  },
  {
    "id": 2,
    "username": "guru",
    "password": "password",
    "role": "guru",
    "displayName": "Guru / Teacher"
  },
  {
    "id": 3,
    "username": "parent",
    "password": "password",
    "role": "orangtua",
    "displayName": "Parent / Orang Tua"
  }
]
```

### Children Data (`/data/children.json`)

```json
[
  {
    "id": 1,
    "name": "Alya",
    "ageGroup": "Toddler",
    "parentId": 3,
    "photo": "alya.jpg",
    "dateOfBirth": "2022-03-15"
  },
  {
    "id": 2,
    "name": "Raka",
    "ageGroup": "Baby",
    "parentId": 3,
    "photo": "raka.jpg",
    "dateOfBirth": "2023-01-20"
  }
]
```

### Report Data Structure (`/data/reports.json` and localStorage)

```json
{
  "id": "auto-generated-unique-id",
  "childId": 1,
  "date": "2024-02-13",
  "reportedBy": 2,
  "createdAt": "2024-02-13T08:00:00Z",
  "updatedAt": "2024-02-13T16:30:00Z",
  "sections": {
    "umum": {
      "jamDatang": "07:30",
      "suhuDatang": 36.5,
      "kondisiDatang": "sehat",
      "adaLuka": false,
      "tidurSiang": true,
      "durasiTidur": "90",
      "jamBangun": "10:30",
      "suhuBangun": 36.6,
      "alasanTidakTidur": null
    },
    "makan": {
      "sarapan": {
        "ikut": true,
        "menu": "Nasi goreng, telur",
        "habis": true,
        "alasanTidakIkut": null,
        "alasanTidakHabis": null
      },
      "makanSiang": {
        "ikut": true,
        "menu": "Nasi, ayam, sayur",
        "habis": false,
        "alasanTidakIkut": null,
        "alasanTidakHabis": "Tidak suka sayur"
      },
      "snackBuah": {
        "ikut": true,
        "menu": "Pisang",
        "habis": true,
        "alasanTidakIkut": null,
        "alasanTidakHabis": null
      },
      "snackSehat": {
        "ikut": false,
        "menu": null,
        "habis": null,
        "alasanTidakIkut": "Belum lapar",
        "alasanTidakHabis": null
      }
    },
    "mandi": {
      "mandiPagi": true,
      "mandiSore": true,
      "alasanTidakMandiPagi": null,
      "alasanTidakMandiSore": null,
      "poop1": "08:30",
      "poop2": "14:00"
    },
    "stimulasi": {
      "grossMotor": {
        "ikut": true,
        "kegiatan": "Berlari di halaman",
        "program": "Toddler",
        "penilaian": "BSB",
        "alasanTidakIkut": null
      },
      "fineMotor": {
        "ikut": true,
        "kegiatan": "Menggambar dengan krayon",
        "program": "Toddler",
        "penilaian": "BB",
        "alasanTidakIkut": null
      }
    },
    "obatSusu": {
      "susu": {
        "jam": "09:00",
        "volume": 120,
        "tipe": "ASI"
      },
      "obat": [
        {
          "namaObat": "Vitamin C",
          "jam": "10:00",
          "diberikan": true
        }
      ]
    }
  }
}
```

### localStorage Keys
- `mz_session` - Current logged-in user object
- `mz_reports` - All saved reports (array)

---

## Application Routes

### Route Configuration

| Path | Component | Protected | Access |
|------|-----------|-----------|--------|
| `/login` | Login | No | Public |
| `/dashboard` | Dashboard | Yes | All authenticated roles |
| `/report/:childId` | Report | Yes | All authenticated roles (filtered by role) |
| `*` | 404/Redirect | - | - |

### Route Protection Logic

```javascript
// Pseudocode for route protection
if (!localStorage.getItem('mz_session')) {
  navigate('/login');
  return;
}

const user = JSON.parse(localStorage.getItem('mz_session'));
const requestedChildId = params.childId;

// For Orangtua, verify child belongs to them
if (user.role === 'orangtua') {
  const child = children.find(c => c.id === requestedChildId);
  if (!child || child.parentId !== user.id) {
    navigate('/dashboard');
    return;
  }
}
```

---

## Page Specifications

### 1. Login Page (`/login`)

**Components:**
- Username input field
- Password input field
- Submit/Login button
- Error message display area

**Behavior:**
1. Validate credentials against `/data/users.json`
2. On success:
   - Save user object to `localStorage.setItem('mz_session', JSON.stringify(user))`
   - Redirect to `/dashboard`
3. On failure:
   - Display "Invalid username or password" error
   - Clear password field
   - Keep username filled

**UI Requirements:**
- Centered login form
- Clean white background
- Input validation feedback
- Enter key submits form

---

### 2. Dashboard Page (`/dashboard`)

**Components:**
- Sidebar (fixed left)
- Header with user info and logout button
- Children grid/card layout

**Sidebar Items:**
- Dashboard (active on this page)
- Logout button

**Children Display:**
- Card-based layout
- Each card shows:
  - Child name
  - Age group badge
  - View Report button

**Filtering Logic:**
```javascript
const getVisibleChildren = () => {
  const user = JSON.parse(localStorage.getItem('mz_session'));
  
  switch (user.role) {
    case 'superadmin':
    case 'guru':
      return allChildren; // Show all children
    case 'orangtua':
      return children.filter(child => child.parentId === user.id);
    default:
      return [];
  }
};
```

**Actions:**
- Click child card → Navigate to `/report/${child.id}`
- Click Logout → Clear session, redirect to `/login`

---

### 3. Report Page (`/report/:childId`)

**Components:**
- Sidebar (fixed left)
- Child info header
- 5 section components (tabbed or scrollable)
- Save button (guru only)

**Section 1: UMUM (General)**

| Field | Type | Required | Conditional Logic |
|-------|------|----------|-------------------|
| jamDatang | time | Yes | - |
| suhuDatang | number | Yes | - |
| kondisiDatang | dropdown | Yes | Options: sehat, sakit, lesu |
| adaLuka | checkbox | Yes | - |
| lukaFile | file upload | No | Show only if adaLuka = true |
| tidurSiang | radio | Yes | Options: yes, no |
| durasiTidur | number | Yes | Show only if tidurSiang = yes |
| jamBangun | time | Yes | Show only if tidurSiang = yes |
| suhuBangun | number | Yes | Show only if tidurSiang = yes |
| alasanTidakTidur | textarea | No | Show only if tidurSiang = no |

**Section 2: MAKAN (Meals)**

Meals to include:
1. Sarapan (Breakfast)
2. Makan Siang (Lunch)
3. Snack Buah (Fruit Snack)
4. Snack Sehat (Healthy Snack)

**Per Meal Fields:**

| Field | Type | Required | Conditional |
|-------|------|----------|-------------|
| ikut | radio | Yes | Options: yes, no |
| menu | text | Yes | Show only if ikut = yes |
| habis | radio | Yes | Show only if ikut = yes |
| alasanTidakIkut | textarea | No | Show only if ikut = no |
| alasanTidakHabis | textarea | No | Show only if habis = no |

**Section 3: MANDI & TOILET**

| Field | Type | Required | Conditional |
|-------|------|----------|-------------|
| mandiPagi | radio | Yes | Options: yes, no |
| mandiSore | radio | Yes | Options: yes, no |
| alasanTidakMandiPagi | dropdown | No | Show only if mandiPagi = no |
| alasanTidakMandiSore | dropdown | No | Show only if mandiSore = no |
| poop1 | time | No | - |
| poop2 | time | No | - |

**Alasan Tidak Mandi Options:**
- pulang lebih awal (left early)
- mandi di rumah (bathed at home)
- kurang sehat (not feeling well)
- lainnya (other)

**Section 4: STIMULASI (Stimulation)**

Activities:
1. Gross Motor Skill
2. Fine Motor Skill

**Per Activity Fields:**

| Field | Type | Required | Conditional |
|-------|------|----------|-------------|
| ikut | radio | Yes | Options: yes, no |
| kegiatan | text | Yes | Show only if ikut = yes |
| program | dropdown | Yes | Show only if ikut = yes |
| penilaian | dropdown | Yes | Show only if ikut = yes |
| alasanTidakIkut | dropdown | No | Show only if ikut = no |

**Program Options:**
- Nursery - Baby
- Nursery - Pre Toddler
- Toddler
- Kinder

**Penilaian Options:**
- BB (Below Basic)
- MB (Meeting Basic)
- BSH (Satisfactory)
- BSB (Excellent)

**Alasan Tidak Ikut Options:**
- Tidur (Sleeping)
- Masih beradaptasi (Still adapting)
- Sakit (Sick)
- Menolak (Refused)
- Lainnya (Other)

**Section 5: OBAT & SUSU (Medicine & Milk)**

**Susu (Milk):**

| Field | Type | Required | Options |
|-------|------|----------|---------|
| jam | time | Yes | - |
| volume | number | Yes | - |
| tipe | dropdown | Yes | ASI, UHT, Sufor, Soya |

**Obat (Medicine):**

| Field | Type | Required |
|-------|------|----------|
| namaObat | text | Yes |
| jam | time | Yes |
| diberikan | checkbox | Yes |

- Add/Remove medicine entries

---

## UI/UX Design Requirements (MANNAZENTRUM Style)

**⚠️ CRITICAL: The UI must visually replicate the PDF design style.**

### Design Vision

| Aspect | Description |
|--------|-------------|
| **Tone** | Warm, friendly, daycare-themed |
| **Dominant Color** | Yellow |
| **Style** | Soft rounded UI, modern but playful (not childish) |

### Color System (Strictly Match PDF)

| Color Role | Color Code | Usage |
|------------|------------|-------|
| **Primary Yellow** | `#F4B400` | Header, Section Cards, Primary Actions |
| **Secondary Soft Yellow** | `#F6D57A` | Section background |
| **Outer Page Background** | `#F3EBD8` | Soft cream beige |
| **Input Background** | `#EDEDED` | Light grey |
| **Active Red Accent** | `#D62828` | Selected tab, Selected options border |
| **Text Primary** | `#2B1D0E` | Dark brownish black |
| **Text Secondary** | `#6B5E4A` | Secondary text |
| **Border Soft** | `#E0C97A` | Soft borders |

**PROHIBITED:**
- ❌ Blue theme
- ❌ Corporate SaaS colors
- ❌ Stark black text

---

### Header Design

```
┌────────────────────────────────────────────────────────────────────┐
│  [LOGO]  MZdaycare           Umum  Makan  Mandi  Stimulasi  Obat/│
│           Admin Dashboard    Susu  Stok Barang  Foto&video  Manaj│
│────────────────────────────────────────────────────────────────────┤
│              Welcome, Guru / Teacher          [Logout]            │
└────────────────────────────────────────────────────────────────────┘
```

**Top Bar Specifications:**
- **Background:** Primary Yellow (`#F4B400`)
- **Border Radius:** 24px (full-width rounded)
- **Padding:** 16px 32px
- **Logo Position:** Left side
- **Logo Text:** "MZdaycare" (large)
- **Subtitle:** "Admin Dashboard" (smaller, below logo)

**Menu Items (Right Side):**
- Horizontal alignment
- Active tab indicator: Red rounded outline (`#D62828`)
- Slightly darker yellow background for active state

**Menu Items List:**
1. Umum
2. Makan
3. Mandi
4. Stimulasi
5. Obat/Susu
6. Stok Barang
7. Foto&video
8. Manajemen User

---

### Page Background

| Element | Value |
|---------|-------|
| **Whole Page Background** | `#F3EBD8` (Soft cream beige) |
| **Content Container** | Max width 1200px, centered |
| **Container Padding** | 40px |

---

### Card Style (IMPORTANT)

**Each form section must be inside rounded yellow cards.**

| Property | Value |
|----------|-------|
| **Background** | `#F6D57A` (Soft Yellow) |
| **Border Radius** | 28px |
| **Padding** | 32px |
| **Shadow** | Very soft, subtle shadow |
| **Spacing Between Cards** | 40px |

**Card Layout Example:**

```
┌─────────────────────┐    ┌─────────────────────┐
│    LEFT CARD        │    │    RIGHT CARD       │
│    Jam Datang       │    │    Tidur Siang      │
│    Suhu Datang      │    │    Durasi Tidur     │
│    Kondisi Datang    │    │    Jam Bangun       │
│    Ada Luka?        │    │    Suhu Bangun      │
└─────────────────────┘    └─────────────────────┘
```

---

### Input Style

| Property | Value |
|----------|-------|
| **Background** | `#EDEDED` (Light grey) |
| **Border Radius** | 14px |
| **Border** | No hard border |
| **Padding** | 12px 16px |
| **Font Size** | Large, readable |
| **Height** | 40–48px (comfortable) |

---

### Dropdown Style

| Property | Value |
|----------|-------|
| **Background** | `#EDEDED` (Light grey) |
| **Border Radius** | 14px |
| **Style** | Same as inputs |

---

### Radio / Selection Button Style

**Used for options like "sehat / sakit / lesu"**

| Property | Value |
|----------|-------|
| **Shape** | Pill shape |
| **Default Background** | Grey |
| **Active State:** | |
|   - Border | Red outline (`#D62828`) |
|   - Background | Slight white |
|   - Content | Emoji inside label |

**Example Options with Emojis:**
```
[ 😊 sehat ]    [ 🥺 sakit ]    [ 😢 lesu ]
```

---

### Typography

| Property | Value |
|----------|-------|
| **Font Family** | Poppins, Nunito, or Inter (fallback) |
| **Section Title Weight** | 600 |
| **Label Weight** | 500 |
| **Input Text Weight** | 400 |
| **Section Title Size** | 20–22px |
| **Label Size** | 14–15px |
| **Body Text Size** | 14px |

---

### Section Structure (Match Visual PDF)

**Layout Pattern:**
```
┌────────────────────────────────────────┐
│           SECTION TITLE               │
├────────────────────────────────────────┤
│  LEFT CARD           │  RIGHT CARD    │
│  ───────────         │  ──────────    │
│  Field Group 1       │  Field Group 2 │
│  Field Group 2       │  Field Group 3 │
└────────────────────────────────────────┘

┌────────────────────────────────────────┐
│  ADDITIONAL CARD (stacked below)       │
│  ───────────────────────────────────   │
│  More fields...                        │
└────────────────────────────────────────┘
```

**Example UMUM Section Layout:**

```
┌─────────────────────────────────────────────────────────────┐
│  UMUM                                                        │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────────────┐    ┌─────────────────────────────┐  │
│  │ Jam Datang          │    │ Tidur Siang                 │  │
│  │ [    07:30     ]    │    │ ● Ya    ○ Tidak             │  │
│  ├─────────────────────┤    ├─────────────────────────────┤  │
│  │ Suhu Tubuh Datang   │    │ Durasi Tidur Siang          │  │
│  │ [     36.5      ] °C│    │ [        90          ] menit │  │
│  ├─────────────────────┤    ├─────────────────────────────┤  │
│  │ Kondisi Datang       │    │ Jam Bangun Tidur            │  │
│  │ [ 😊 sehat ]        │    │ [        10:30         ]     │  │
│  │ [ 🥺 sakit ]        │    ├─────────────────────────────┤  │
│  │ [ 😢 lesu  ]        │    │ Suhu Tubuh Bangun Tidur     │  │
│  ├─────────────────────┤    │ [        36.6         ] °C   │  │
│  │ Ada Luka?           │    └─────────────────────────────┘  │
│  │ ☑ Yes  ☐ No         │                                     │
│  └─────────────────────┘                                     │
└─────────────────────────────────────────────────────────────┘
```

---

### Active Element Style

**Active state must use:**
| Property | Value |
|----------|-------|
| **Border Color** | `#D62828` (Red) |
| **Border Style** | Rounded outline |
| **Background** | Slightly darker yellow |

**Examples:**
- Active tab: Red rounded outline around text
- Selected option: Red border on pill button
- Active input: Subtle yellow border (not blue focus ring)

---

### Icon Style

| Property | Value |
|----------|-------|
| **Style** | Soft rounded icons |
| **Type** | NOT sharp material icons |
| **Recommendation** | Lucide icons or simple emoji |

---

### Overall Visual Feel Checklist

| Criterion | Must Match PDF |
|-----------|----------------|
| Warm yellow dominant | ✅ Yes |
| Friendly daycare dashboard | ✅ Yes |
| Rounded and soft | ✅ Yes |
| NOT corporate | ✅ Yes |
| NOT minimal monochrome | ✅ Yes |
| NOT startup SaaS style | ✅ Yes |
| Playful but professional | ✅ Yes |

---

### CSS Variables Reference

```css
:root {
  /* Primary Colors */
  --primary-yellow: #F4B400;
  --secondary-soft-yellow: #F6D57A;
  
  /* Background Colors */
  --page-bg: #F3EBD8;
  --input-bg: #EDEDED;
  
  /* Accent Colors */
  --active-red: #D62828;
  
  /* Text Colors */
  --text-primary: #2B1D0E;
  --text-secondary: #6B5E4A;
  
  /* Border Colors */
  --border-soft: #E0C97A;
  
  /* Spacing */
  --card-padding: 32px;
  --card-radius: 28px;
  --input-radius: 14px;
  --header-radius: 24px;
  
  /* Layout */
  --container-width: 1200px;
  --card-spacing: 40px;
}
```

---

## Save Behavior

### Guru (Teacher) Flow
1. Fill out all relevant sections
2. Click "Simpan Laporan" button
3. Validate required fields
4. Create/update report object
5. Save to `localStorage.getItem('mz_reports')`
6. Show success notification
7. Redirect to `/dashboard`

### Superadmin & Orangtua Flow
- All input fields disabled (readOnly)
- No save button displayed
- Cannot modify any data
- Can only view existing reports

---

## UI/UX Requirements

### Design System
- **Color Scheme:** Clean white background, primary color for actions
- **Typography:** System fonts, readable sizes (14px+ body)
- **Spacing:** Consistent padding (16px standard)
- **Borders:** Subtle borders on inputs and cards
- **Shadows:** Light shadows on cards

### Layout Structure
```
┌─────────────────────────────────────┐
│  SIDEBAR          │  MAIN CONTENT   │
│  ───────────────  │  ─────────────  │
│  Dashboard        │  Page Header    │
│  Logout           │                 │
│                   │  Content        │
│                   │                 │
└─────────────────────────────────────┘
```

### Component Hierarchy
```
App.jsx
├── BrowserRouter
│   ├── Routes
│   │   ├── Route /login → Login.jsx
│   │   ├── Route /dashboard → Dashboard.jsx
│   │   └── Route /report/:childId → Report.jsx
│   └── Layout (Sidebar + Outlet)
├── Sidebar.jsx
├── Login.jsx
├── Dashboard.jsx
└── Report.jsx
    ├── SectionUmum.jsx
    ├── SectionMakan.jsx
    ├── SectionMandi.jsx
    ├── SectionStimulasi.jsx
    └── SectionObatSusu.jsx
```

### Responsive Behavior
- **Desktop (>1024px):** Sidebar fixed left, content takes remaining width
- **Tablet (768-1024px):** Sidebar becomes collapsible or top navigation
- **Mobile (<768px):** Single column layout, stacked components

---

## Project Structure

```
src/
├── components/
│   ├── Sidebar.jsx              # Navigation sidebar
│   ├── SectionUmum.jsx          # General information section
│   ├── SectionMakan.jsx         # Meals section
│   ├── SectionMandi.jsx         # Bath & toilet section
│   ├── SectionStimulasi.jsx     # Stimulation activities section
│   └── SectionObatSusu.jsx      # Medicine & milk section
├── pages/
│   ├── Login.jsx                # Login page
│   ├── Dashboard.jsx            # Children overview page
│   └── Report.jsx              # Full report editing/viewing page
├── data/
│   ├── users.json               # User credentials (3 users)
│   ├── children.json            # Children data (2+ children)
│   └── reports.json             # Report templates/empty structure
├── App.jsx                      # Main app with routing
├── main.jsx                     # Entry point
└── index.css                    # Global styles

data/
└── reports.json                 # LocalStorage backup file (optional)
```

---

## Implementation Instructions

### Setup Commands

```bash
# Navigate to project directory
cd MZdaycare

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### Development Workflow

1. **Initialize Vite project:**
   ```bash
   npm create vite@latest src -- --template react
   ```

2. **Install React Router:**
   ```bash
   npm install react-router-dom
   ```

3. **Create folder structure:**
   ```bash
   mkdir -p src/components src/pages src/data
   mkdir -p data
   ```

4. **Create dummy data files** in `src/data/` and `data/`

5. **Implement components** in order:
   - Sidebar.jsx
   - Login.jsx
   - Dashboard.jsx
   - Section components
   - Report.jsx

6. **Configure routing** in App.jsx

7. **Test all roles** and permissions

---

## Quality Assurance Checklist

### Functional Testing

- [ ] Login with each role (admin, guru, parent)
- [ ] Verify dashboard shows correct children for each role
- [ ] Test report viewing for all roles
- [ ] Test report editing (guru only)
- [ ] Test save functionality
- [ ] Test logout and session clearing
- [ ] Test route protection
- [ ] Verify localStorage persistence
- [ ] Test conditional field visibility

### UI Testing

- [ ] Verify all sections render correctly
- [ ] Test form inputs (all types)
- [ ] Test dropdown selections
- [ ] Test radio buttons and checkboxes
- [ ] Verify responsive layout
- [ ] Check sidebar visibility
- [ ] Test navigation between pages

### Edge Cases

- [ ] Empty reports (new day)
- [ ] Multiple saves for same child/date
- [ ] Access denied scenarios
- [ ] Missing optional fields
- [ ] Large data sets (if applicable)

---

## Deliverable Checklist

- [ ] Complete React application with all components
- [ ] Properly configured React Router
- [ ] All 3 user roles implemented
- [ ] Role-based permissions working
- [ ] 5 report sections implemented
- [ ] localStorage persistence
- [ ] JSON data files
- [ ] Responsive sidebar navigation
- [ ] Clean, functional UI
- [ ] README with setup instructions
- [ ] All code commented where necessary

---

## Success Criteria Summary

| Criterion | Target | Measurement |
|-----------|--------|-------------|
| **Functional Criteria** |
| Application starts | Yes | `npm run dev` executes successfully |
| Login works | Yes | All 3 users can authenticate |
| Role filtering | Yes | Parents see only their children |
| Report sections | 5 | All sections implemented |
| Save functionality | Yes | Guru can save, others cannot |
| Data persistence | Yes | Refresh page, data remains |
| Route protection | Yes | Cannot access dashboard without login |
| Responsive design | Basic | Works on mobile and desktop |
| **Visual Design Criteria (PDF Match)** |
| Primary yellow color | `#F4B400` | Hex code matches exactly |
| Header styling | Rounded yellow bar | Border radius 24px |
| Card background | `#F6D57A` | Soft yellow cards |
| Page background | `#F3EBD8` | Cream beige |
| Active red accent | `#D62828` | Used for tabs/selections |
| Card border radius | 28px | Rounded yellow cards |
| Input border radius | 14px | Rounded inputs |
| Typography | Poppins/Nunito/Inter | Rounded sans-serif |
| Pill-shaped selections | Yes | With emojis for kondisi |
| Active state border | Red | `#D62828` (NOT blue) |
| Section layout | Card pairs | Left/Right card format |
| Overall feel | Warm/friendly/daycare | Not corporate/SaaS |


---

## Additional Notes

### Polish Items (If Time Permits)
- Loading states during data fetch
- Form validation error messages
- Success/error notifications
- Confirm dialog on logout
- Date picker for report date
- Print/Export to PDF functionality
- Child profile photos

### Future Enhancements (Out of Scope)
- Backend integration
- Real authentication
- Multi-daycare support
- Parent notifications
- Report analytics
- Multi-language support
