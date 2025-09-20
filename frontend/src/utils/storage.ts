// LocalStorage yönetimi için utility fonksiyonlar

export interface SavedCalculation {
  id: string
  timestamp: number
  hasExisting: boolean
  existingGPA?: number
  existingCredits?: number
  courses: Array<{
    grade: string | number
    credit: number
  }>
  results: {
    termGPA: number
    cumulativeGPA: number
  }
  label?: string // "Güz 2024" gibi kullanıcı etiketi
}

export interface FormData {
  hasExisting: boolean
  existing_gpa: string
  existing_credits: number
  courses: Array<{
    grade: string | number
    credit: number
  }>
}

const STORAGE_KEYS = {
  CALCULATIONS: 'gpa_calculations',
  LAST_FORM_DATA: 'gpa_last_form_data',
  SETTINGS: 'gpa_settings'
} as const

// Hesaplamaları kaydetme
export function saveCalculation(calculation: Omit<SavedCalculation, 'id' | 'timestamp'>): string {
  const calculations = getSavedCalculations()
  const newCalculation: SavedCalculation = {
    ...calculation,
    id: generateId(),
    timestamp: Date.now()
  }
  
  calculations.unshift(newCalculation) // En yenisi başta
  
  // Son 10 hesaplamayı tut
  const trimmedCalculations = calculations.slice(0, 10)
  
  localStorage.setItem(STORAGE_KEYS.CALCULATIONS, JSON.stringify(trimmedCalculations))
  return newCalculation.id
}

// Kayıtlı hesaplamaları getirme
export function getSavedCalculations(): SavedCalculation[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.CALCULATIONS)
    return data ? JSON.parse(data) : []
  } catch (error) {
    console.error('Error loading calculations:', error)
    return []
  }
}

// Hesaplama silme
export function deleteCalculation(id: string): void {
  const calculations = getSavedCalculations()
  const filtered = calculations.filter(calc => calc.id !== id)
  localStorage.setItem(STORAGE_KEYS.CALCULATIONS, JSON.stringify(filtered))
}

// Form verilerini kaydetme (otomatik kaydetme için)
export function saveFormData(formData: FormData): void {
  try {
    localStorage.setItem(STORAGE_KEYS.LAST_FORM_DATA, JSON.stringify(formData))
  } catch (error) {
    console.error('Error saving form data:', error)
  }
}

// Son form verilerini getirme
export function getLastFormData(): FormData | null {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.LAST_FORM_DATA)
    return data ? JSON.parse(data) : null
  } catch (error) {
    console.error('Error loading form data:', error)
    return null
  }
}

// Ayarları kaydetme
export function saveSettings(settings: Record<string, any>): void {
  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings))
  } catch (error) {
    console.error('Error saving settings:', error)
  }
}

// Ayarları getirme
export function getSettings(): Record<string, any> {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.SETTINGS)
    return data ? JSON.parse(data) : {}
  } catch (error) {
    console.error('Error loading settings:', error)
    return {}
  }
}

// Tüm verileri temizleme
export function clearAllData(): void {
  Object.values(STORAGE_KEYS).forEach(key => {
    localStorage.removeItem(key)
  })
}

// ID generator
function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}
