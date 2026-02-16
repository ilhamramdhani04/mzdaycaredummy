/**
 * Centralized Navigation Configuration
 * Mannazentrum Daycare Management System
 */

import { ROUTES } from './routes.js'

// Navigation items by role
export const NAVIGATION_CONFIG = {
  owner: [
    { 
      path: ROUTES.OWNER.DASHBOARD, 
      label: 'Dashboard', 
      icon: '📊',
      mobileIcon: '📊',
      description: 'Overview bisnis & KPI'
    },
    { 
      path: ROUTES.OWNER.BRANCHES, 
      label: 'Cabang', 
      icon: '🏢',
      mobileIcon: '🏢',
      description: 'Kelola cabang daycare'
    },
    { 
      path: ROUTES.OWNER.INVOICES, 
      label: 'Invoice', 
      icon: '📄',
      mobileIcon: '📄',
      description: 'Approval & monitoring'
    },
    { 
      path: ROUTES.OWNER.FINANCE, 
      label: 'Keuangan', 
      icon: '💰',
      mobileIcon: '💰',
      description: 'Laporan keuangan'
    },
  ],
  
  superadmin: [
    { 
      path: ROUTES.SUPERADMIN.DASHBOARD, 
      label: 'Dashboard', 
      icon: '📊',
      mobileIcon: '📊',
      description: 'Overview operasional'
    },
    { 
      path: ROUTES.SUPERADMIN.ATTENDANCE, 
      label: 'Absensi', 
      icon: '⏰',
      mobileIcon: '⏰',
      description: 'Monitoring kehadiran'
    },
    { 
      path: ROUTES.SUPERADMIN.REPORTS, 
      label: 'Laporan', 
      icon: '📝',
      mobileIcon: '📝',
      description: 'Review & kunci laporan'
    },
    { 
      path: ROUTES.SUPERADMIN.USERS, 
      label: 'Pengguna', 
      icon: '👥',
      mobileIcon: '👥',
      description: 'Manajemen pengguna'
    },
    { 
      path: ROUTES.SUPERADMIN.TEACHER_CONFIG, 
      label: 'Konfigurasi Guru', 
      icon: '🔧',
      mobileIcon: '🔧',
      description: 'Konfigurasi default untuk guru'
    },
    { 
      path: ROUTES.SUPERADMIN.MENUS, 
      label: 'Menu Makanan', 
      icon: '🍽️',
      mobileIcon: '🍽️',
      description: 'Kelola menu makan'
    },
    { 
      path: ROUTES.SUPERADMIN.BATHING, 
      label: 'Jadwal Mandi', 
      icon: '🛁',
      mobileIcon: '🛁',
      description: 'Kelola jadwal mandi'
    },
    { 
      path: ROUTES.SUPERADMIN.STIMULASI, 
      label: 'Stimulasi', 
      icon: '🎨',
      mobileIcon: '🎨',
      description: 'Kelola aktivitas stimulasi'
    },
    { 
      path: ROUTES.SUPERADMIN.MEDICATION, 
      label: 'Obat & Susu', 
      icon: '💊',
      mobileIcon: '💊',
      description: 'Kelola obat & susu'
    },
    { 
      path: ROUTES.SUPERADMIN.INVENTORY, 
      label: 'Inventaris', 
      icon: '📦',
      mobileIcon: '📦',
      description: 'Kelola inventaris'
    },
    { 
      path: ROUTES.SUPERADMIN.MEDIA, 
      label: 'Foto & Video', 
      icon: '📷',
      mobileIcon: '📷',
      description: 'Kelola media anak'
    },
    { 
      path: ROUTES.SUPERADMIN.OVERTIME, 
      label: 'Overtime', 
      icon: '⏰',
      mobileIcon: '⏰',
      description: 'Konfigurasi overtime'
    },
  ],
  
  guru: [
    { 
      path: ROUTES.GURU.DASHBOARD, 
      label: 'Dashboard', 
      icon: '📊',
      mobileIcon: '📊',
      description: 'Overview hari ini'
    },
    { 
      path: ROUTES.GURU.ATTENDANCE, 
      label: 'Absensi', 
      icon: '⏰',
      mobileIcon: '⏰',
      description: 'Check-in & check-out'
    },
    { 
      path: ROUTES.GURU.REPORTS, 
      label: 'Laporan', 
      icon: '📝',
      mobileIcon: '📝',
      description: 'Buat laporan harian'
    },
    { 
      path: ROUTES.GURU.MENUS, 
      label: 'Menu Makanan', 
      icon: '🍽️',
      mobileIcon: '🍽️',
      description: 'Kelola menu makan'
    },
    { 
      path: ROUTES.GURU.BATHING, 
      label: 'Jadwal Mandi', 
      icon: '🛁',
      mobileIcon: '🛁',
      description: 'Kelola jadwal mandi'
    },
    { 
      path: ROUTES.GURU.STIMULASI, 
      label: 'Stimulasi', 
      icon: '🎨',
      mobileIcon: '🎨',
      description: 'Kelola aktivitas stimulasi'
    },
    { 
      path: ROUTES.GURU.MEDICATION, 
      label: 'Obat & Susu', 
      icon: '💊',
      mobileIcon: '💊',
      description: 'Kelola obat & susu'
    },
    { 
      path: ROUTES.GURU.INVENTORY, 
      label: 'Inventaris', 
      icon: '📦',
      mobileIcon: '📦',
      description: 'Kelola inventaris'
    },
    { 
      path: ROUTES.GURU.MEDIA, 
      label: 'Foto & Video', 
      icon: '📷',
      mobileIcon: '📷',
      description: 'Kelola media anak'
    },
    { 
      path: ROUTES.GURU.OVERTIME, 
      label: 'Overtime', 
      icon: '⏰',
      mobileIcon: '⏰',
      description: 'Konfigurasi overtime'
    },
  ],
  
  orangtua: [
    { 
      path: ROUTES.ORANGTUA.DASHBOARD, 
      label: 'Overview', 
      icon: '🏠',
      mobileIcon: '🏠',
      description: 'Hari ini'
    },
    { 
      path: ROUTES.ORANGTUA.ATTENDANCE, 
      label: 'Absensi', 
      icon: '⏰',
      mobileIcon: '⏰',
      description: 'Riwayat kehadiran'
    },
    { 
      path: ROUTES.ORANGTUA.REPORTS, 
      label: 'Laporan', 
      icon: '📝',
      mobileIcon: '📝',
      description: 'Perkembangan anak'
    },
    { 
      path: ROUTES.ORANGTUA.INVOICES, 
      label: 'Invoice', 
      icon: '📄',
      mobileIcon: '📄',
      description: 'Tagihan & pembayaran'
    },
  ],
}

// Get navigation items for role
export const getNavigationItems = (role) => {
  return NAVIGATION_CONFIG[role] || []
}

// Get mobile navigation items (max 5 items)
export const getMobileNavigationItems = (role) => {
  const items = NAVIGATION_CONFIG[role] || []
  return items.slice(0, 5).map(item => ({
    ...item,
    icon: item.mobileIcon || item.icon
  }))
}

// Role labels
export const ROLE_LABELS = {
  owner: 'Owner',
  superadmin: 'Super Admin',
  guru: 'Guru',
  orangtua: 'Orang Tua',
}

// Role avatars
export const ROLE_AVATARS = {
  owner: '👑',
  superadmin: '⚙️',
  guru: '👩‍🏫',
  orangtua: '👨‍👩‍👧',
}
