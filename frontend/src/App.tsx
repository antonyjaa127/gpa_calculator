import { useState } from 'react'
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
  FormControl
} from '@mui/material'
import { AddCircle, RemoveCircle } from '@mui/icons-material'
import { useForm, Controller, useFieldArray } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { calculateBothGPA, type Course } from './utils/gpaCalculator'

const gradeOptions = [
  'AA','BA','BB','CB','CC','DC','DD','FF'
]

const CourseSchema = z.object({
  grade: z.union([
    z.string().min(1),
    z.number()
  ]),
  credit: z.coerce.number().int().nonnegative()
})

const FormSchema = z.object({
  hasExisting: z.boolean(),
  existing_gpa: z.coerce.number().nullable().optional(),
  existing_credits: z.coerce.number().int().nonnegative().default(0),
  courses: z.array(CourseSchema).min(1, 'En az bir ders ekleyiniz')
})

type FormValues = z.infer<typeof FormSchema>

type GPAResult = {
  termGPA: number
  cumulativeGPA: number
}

function App() {
  const [result, setResult] = useState<GPAResult | null>(null)

  const { control, handleSubmit, watch, setValue } = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      hasExisting: false,
      existing_gpa: '',
      existing_credits: 0,
      courses: [{ grade: 'AA', credit: 3 }]
    }
  })

  const { fields, append, remove } = useFieldArray({ control, name: 'courses' })
  const hasExisting = watch('hasExisting')

  const onSubmit = (values: FormValues) => {
    try {
      const existingGPA = values.hasExisting && values.existing_gpa ? Number(values.existing_gpa) : null
      const existingCredits = values.hasExisting ? values.existing_credits : 0
      
      const courses: Course[] = values.courses.map((c) => ({
        grade: typeof c.grade === 'string' && /^\d+(\.\d+)?$/.test(c.grade) ? Number(c.grade) : c.grade,
        credit: c.credit
      }))

      const result = calculateBothGPA(existingGPA, existingCredits, courses)
      
      setResult({
        termGPA: Number(result.termGPA.toFixed(2)),
        cumulativeGPA: Number(result.cumulativeGPA.toFixed(2))
      })
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

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography 
        variant="h3" 
        fontWeight={800} 
        textAlign="center" 
        gutterBottom
        sx={{
          background: 'linear-gradient(135deg, #ffffff 0%, #e0e7ff 50%, #c7d2fe 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          textShadow: '0 4px 20px rgba(255,255,255,0.3)',
          mb: 4,
          letterSpacing: '-0.02em'
        }}
      >
        GPA Hesaplayıcı
      </Typography>

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

    </Container>
  )
}

export default App
