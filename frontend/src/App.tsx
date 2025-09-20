import { useState, useEffect } from 'react'
import './App.css'
import {
  Container,
  Card,
  CardContent,
  Typography,
  Grid,
  TextField,
  Button,
  IconButton,
  Switch,
  FormControlLabel,
  Divider,
  Box,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Collapse,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Chip
} from '@mui/material'
import { AddCircle, RemoveCircle, History, Delete } from '@mui/icons-material'
import { useForm, Controller, useFieldArray } from 'react-hook-form'
import { calculateBothGPA, type Course } from './utils/gpaCalculator'
import { 
  saveCalculation, 
  getSavedCalculations, 
  deleteCalculation, 
  saveFormData, 
  getLastFormData,
  type SavedCalculation 
} from './utils/storage'
import GPAChart from './components/GPAChart'
import ThemeToggle from './components/ThemeToggle'

const gradeOptions = [
  'AA','BA','BB','CB','CC','DC','DD','FF'
]

interface FormValues {
  hasExisting: boolean
  existing_gpa: string
  existing_credits: number
  courses: {
    grade: string | number
    credit: number
  }[]
}

type GPAResult = {
  termGPA: number
  cumulativeGPA: number
}

function App() {
  const [result, setResult] = useState<GPAResult | null>(null)
  const [savedCalculations, setSavedCalculations] = useState<SavedCalculation[]>([])
  const [showHistory, setShowHistory] = useState(false)

  const { control, handleSubmit, watch, setValue, reset } = useForm<FormValues>({
    defaultValues: {
      hasExisting: false,
      existing_gpa: '',
      existing_credits: 0,
      courses: [{ grade: 'AA', credit: 3 }]
    }
  })

  // Component mount olduğunda kayıtlı verileri yükle
  useEffect(() => {
    const savedCalcs = getSavedCalculations()
    setSavedCalculations(savedCalcs)

    // Son form verilerini yükle
    const lastFormData = getLastFormData()
    if (lastFormData) {
      reset(lastFormData)
    }
  }, [])

  const { fields, append, remove } = useFieldArray({ control, name: 'courses' })
  const hasExisting = watch('hasExisting')

  const onSubmit = (values: FormValues) => {
    try {
      // Validate courses
      if (!values.courses || values.courses.length === 0) {
        alert('En az bir ders eklemelisiniz.')
        return
      }

      const existingGPA = values.hasExisting && values.existing_gpa && values.existing_gpa.trim() !== '' ? Number(values.existing_gpa) : null
      const existingCredits = values.hasExisting ? Number(values.existing_credits) : 0
      
      const courses: Course[] = values.courses.map((c) => ({
        grade: c.grade,
        credit: Number(c.credit)
      }))

      const calculationResult = calculateBothGPA(existingGPA, existingCredits, courses)
      
      const finalResult = {
        termGPA: Number(calculationResult.termGPA.toFixed(2)),
        cumulativeGPA: Number(calculationResult.cumulativeGPA.toFixed(2))
      }
      
      setResult(finalResult)

      // Form verilerini kaydet (otomatik kaydetme)
      saveFormData(values)

      // Hesaplamayı kaydet
      const calculationId = saveCalculation({
        hasExisting: values.hasExisting,
        existingGPA: existingGPA || undefined,
        existingCredits: existingCredits || undefined,
        courses: values.courses,
        results: finalResult,
        label: `Hesaplama ${new Date().toLocaleDateString('tr-TR')}`
      })

      // Kayıtlı hesaplamaları güncelle
      setSavedCalculations(getSavedCalculations())

      console.log('Hesaplama kaydedildi:', calculationId)
    } catch (error) {
      console.error('Hesaplama hatası:', error)
      alert('Hesaplama sırasında bir hata oluştu. Lütfen girdiğiniz değerleri kontrol edin.')
    }
  }

  const toggleExisting = (_: unknown, checked: boolean) => {
    setValue('hasExisting', checked)
    if (!checked) {
      setValue('existing_gpa', '')
      setValue('existing_credits', 0)
    }
  }

  // Geçmiş hesaplamayı yükle
  const loadCalculation = (calculation: SavedCalculation) => {
    reset({
      hasExisting: calculation.hasExisting,
      existing_gpa: calculation.existingGPA?.toString() || '',
      existing_credits: calculation.existingCredits || 0,
      courses: calculation.courses
    })
    setResult(calculation.results)
    setShowHistory(false)
  }

  // Hesaplamayı sil
  const handleDeleteCalculation = (id: string) => {
    deleteCalculation(id)
    setSavedCalculations(getSavedCalculations())
  }

  // Tarih formatı
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString('tr-TR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      {/* Header with Title and Theme Toggle */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography 
          variant="h3" 
          fontWeight={800} 
          sx={{
            background: 'linear-gradient(45deg, #6366f1 30%, #ec4899 90%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            textShadow: '0 0 30px rgba(99, 102, 241, 0.3)',
            flexGrow: 1,
            textAlign: 'center',
            letterSpacing: '-0.02em'
          }}
        >
          GPA Hesaplayıcı
        </Typography>
        <ThemeToggle />
      </Box>

      {/* Geçmiş Hesaplamalar */}
      {savedCalculations.length > 0 && (
        <Card elevation={2} sx={{ mb: 3 }}>
          <CardContent>
            <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
              <Typography variant="h6" display="flex" alignItems="center" gap={1}>
                <History />
                Geçmiş Hesaplamalar ({savedCalculations.length})
              </Typography>
              <Button
                startIcon={<History />}
                onClick={() => setShowHistory(!showHistory)}
                size="small"
              >
                {showHistory ? 'Gizle' : 'Göster'}
              </Button>
            </Box>
            
            <Collapse in={showHistory}>
              <List dense>
                {savedCalculations.map((calc) => (
                  <ListItem 
                    key={calc.id}
                    sx={{ 
                      border: '1px solid rgba(255,255,255,0.1)', 
                      borderRadius: '8px', 
                      mb: 1,
                      cursor: 'pointer',
                      '&:hover': {
                        backgroundColor: 'rgba(255,255,255,0.05)'
                      }
                    }}
                    onClick={() => loadCalculation(calc)}
                  >
                    <ListItemText
                      primary={
                        <Box display="flex" alignItems="center" gap={1}>
                          <Typography variant="subtitle2">
                            {calc.label}
                          </Typography>
                          <Chip 
                            label={`Dönem: ${calc.results.termGPA}`} 
                            size="small" 
                            color="primary"
                          />
                          <Chip 
                            label={`Genel: ${calc.results.cumulativeGPA}`} 
                            size="small" 
                            color="secondary"
                          />
                        </Box>
                      }
                      secondary={
                        <Typography variant="caption" color="text.secondary">
                          {formatDate(calc.timestamp)} • {calc.courses.length} ders
                        </Typography>
                      }
                    />
                    <ListItemSecondaryAction>
                      <IconButton
                        edge="end"
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDeleteCalculation(calc.id)
                        }}
                        sx={{ color: 'error.main' }}
                      >
                        <Delete />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            </Collapse>
          </CardContent>
        </Card>
      )}

      <Card elevation={4}>
        <CardContent>
          <Grid container spacing={2}>
            <Grid size={12}>
              <FormControlLabel
                control={<Switch color="primary" onChange={toggleExisting} />}
                label="Daha önceki GPA'n var mı?"
                sx={{ 
                  '& .MuiFormControlLabel-label': { 
                    fontSize: '1.1rem', 
                    fontWeight: 500,
                    color: 'rgba(255,255,255,0.9)'
                  }
                }}
              />
            </Grid>

            {hasExisting && (
              <>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Controller
                    name="existing_gpa"
                    control={control}
                    render={({ field }) => (
                      <TextField {...field} fullWidth label="Mevcut GPA" placeholder="3.20" value={field.value || ''} />
                    )}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Controller
                    name="existing_credits"
                    control={control}
                    render={({ field }) => (
                      <TextField {...field} fullWidth label="Mevcut Toplam Kredi" placeholder="40" />
                    )}
                  />
                </Grid>
                <Grid size={12}>
                  <Divider sx={{ my: 1 }} />
                </Grid>
              </>
            )}

            <Grid size={12}>
              <Typography 
                variant="h6" 
                gutterBottom
                sx={{
                  fontWeight: 600,
                  color: 'rgba(255,255,255,0.95)',
                  mb: 2
                }}
              >
                Bu Dönem Dersleri
              </Typography>
            </Grid>

            {fields.map((f, idx) => (
              <Grid container key={f.id} spacing={2} alignItems="center">
                <Grid size={{ xs: 12, sm: 5 }}>
                  <Controller
                    name={`courses.${idx}.grade` as const}
                    control={control}
                    render={({ field }) => (
                      <FormControl fullWidth>
                        <InputLabel>Not</InputLabel>
                        <Select
                          label="Not"
                          value={field.value}
                          onChange={(e) => field.onChange(e.target.value)}
                          renderValue={(v) => String(v)}
                        >
                          {gradeOptions.map((g) => (
                            <MenuItem key={g} value={g}>{g}</MenuItem>
                          ))}
                          <MenuItem value={4.0}>4.0</MenuItem>
                          <MenuItem value={3.5}>3.5</MenuItem>
                          <MenuItem value={3.0}>3.0</MenuItem>
                          <MenuItem value={2.5}>2.5</MenuItem>
                          <MenuItem value={2.0}>2.0</MenuItem>
                          <MenuItem value={1.5}>1.5</MenuItem>
                          <MenuItem value={1.0}>1.0</MenuItem>
                          <MenuItem value={0.0}>0.0</MenuItem>
                        </Select>
                      </FormControl>
                    )}
                  />
                </Grid>
                <Grid size={{ xs: 10, sm: 5 }}>
                  <Controller
                    name={`courses.${idx}.credit` as const}
                    control={control}
                    render={({ field }) => (
                      <TextField {...field} fullWidth label="Kredi" type="number" inputProps={{ min: 0 }} />
                    )}
                  />
                </Grid>
                <Grid size={{ xs: 2, sm: 2 }}>
                  <IconButton color="error" onClick={() => remove(idx)} aria-label="Ders Sil">
                    <RemoveCircle />
                  </IconButton>
                </Grid>
              </Grid>
            ))}

            <Grid size={12}>
              <Button 
                startIcon={<AddCircle />} 
                onClick={() => append({ grade: 'AA', credit: 3 })}
                sx={{
                  borderRadius: '12px',
                  textTransform: 'none',
                  fontWeight: 500,
                  fontSize: '15px'
                }}
              >
                Ders Ekle
              </Button>
            </Grid>

            <Grid size={12}>
              <Box textAlign="right">
                  <Button 
                  variant="contained" 
                  size="large" 
                  onClick={handleSubmit(onSubmit)}
                  sx={{
                    fontSize: '18px',
                    fontWeight: 600,
                    py: 1.5,
                    px: 4,
                    borderRadius: '16px',
                    textTransform: 'none',
                    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #5855f7 0%, #7c3aed 50%, #db2777 100%)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 8px 24px rgba(99, 102, 241, 0.5)'
                    }
                  }}
                >
                  Hesapla
                </Button>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {result && (
        <Grid container spacing={3} sx={{ mt: 3 }}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Card elevation={3} className="result-card">
              <CardContent sx={{ textAlign: 'center', py: 4 }}>
                <Typography 
                  variant="subtitle1" 
                  sx={{ 
                    color: 'rgba(255,255,255,0.8)', 
                    fontWeight: 500, 
                    mb: 2,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}
                >
                  Dönemlik GPA
                </Typography>
                <Typography 
                  variant="h2" 
                  fontWeight={700}
                  sx={{
                    color: 'rgba(255, 255, 255, 0.95)',
                    textShadow: '0 2px 10px rgba(0,0,0,0.3)',
                    letterSpacing: '-0.02em'
                  }}
                >
                  {result.termGPA.toFixed(2)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Card elevation={3} className="result-card">
              <CardContent sx={{ textAlign: 'center', py: 4 }}>
                <Typography 
                  variant="subtitle1" 
                  sx={{ 
                    color: 'rgba(255,255,255,0.8)', 
                    fontWeight: 500, 
                    mb: 2,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}
                >
                  Genel GPA
                </Typography>
                <Typography 
                  variant="h2" 
                  fontWeight={700}
                  sx={{
                    color: 'rgba(255, 255, 255, 0.95)',
                    textShadow: '0 2px 10px rgba(0,0,0,0.3)',
                    letterSpacing: '-0.02em'
                  }}
                >
                  {result.cumulativeGPA.toFixed(2)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* GPA Trend Grafiği */}
      {savedCalculations.length > 0 && (
        <Box sx={{ mt: 3 }}>
          <GPAChart calculations={savedCalculations} />
        </Box>
      )}

    </Container>
  )
}

export default App
