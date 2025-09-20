import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'
import { Box, Typography, Card, CardContent } from '@mui/material'
import { TrendingUp } from '@mui/icons-material'
import { type SavedCalculation } from '../utils/storage'

// Chart.js bileşenlerini kaydet
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

interface GPAChartProps {
  calculations: SavedCalculation[]
}

export default function GPAChart({ calculations }: GPAChartProps) {
  // En az 2 hesaplama olması gerekiyor grafik için
  if (calculations.length < 2) {
    return (
      <Card elevation={3}>
        <CardContent sx={{ textAlign: 'center', py: 4 }}>
          <TrendingUp sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            GPA Trend Grafiği
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Grafik görüntülemek için en az 2 hesaplama yapmanız gerekiyor.
          </Typography>
        </CardContent>
      </Card>
    )
  }

  // Verileri tarih sırasına göre sırala (eskiden yeniye)
  const sortedCalculations = [...calculations]
    .sort((a, b) => a.timestamp - b.timestamp)
    .slice(-10) // Son 10 hesaplama

  // Grafik verileri hazırla
  const labels = sortedCalculations.map((calc, index) => {
    const date = new Date(calc.timestamp)
    return `${index + 1}. Hesaplama\n${date.toLocaleDateString('tr-TR', { 
      day: '2-digit', 
      month: '2-digit' 
    })}`
  })

  const termGPAData = sortedCalculations.map(calc => calc.results.termGPA)
  const cumulativeGPAData = sortedCalculations.map(calc => calc.results.cumulativeGPA)

  const data = {
    labels,
    datasets: [
      {
        label: 'Dönemlik GPA',
        data: termGPAData,
        borderColor: 'rgb(99, 102, 241)',
        backgroundColor: 'rgba(99, 102, 241, 0.2)',
        borderWidth: 4,
        pointBackgroundColor: 'rgb(99, 102, 241)',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 3,
        pointRadius: 8,
        pointHoverRadius: 12,
        tension: 0.4,
        fill: true,
        shadowColor: 'rgba(99, 102, 241, 0.5)',
        shadowBlur: 10
      },
      {
        label: 'Genel GPA',
        data: cumulativeGPAData,
        borderColor: 'rgb(236, 72, 153)',
        backgroundColor: 'rgba(236, 72, 153, 0.2)',
        borderWidth: 4,
        pointBackgroundColor: 'rgb(236, 72, 153)',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 3,
        pointRadius: 8,
        pointHoverRadius: 12,
        tension: 0.4,
        fill: true,
        shadowColor: 'rgba(236, 72, 153, 0.5)',
        shadowBlur: 10
      }
    ]
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: '#ffffff',
          font: {
            size: 16,
            weight: 'bold' as const
          },
          padding: 20,
          usePointStyle: true,
          pointStyle: 'circle'
        }
      },
      title: {
        display: true,
        text: 'GPA Trend Analizi',
        color: '#ffffff',
        font: {
          size: 20,
          weight: 'bold' as const
        },
        padding: {
          top: 10,
          bottom: 30
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: 'rgba(255, 255, 255, 0.2)',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true,
        callbacks: {
          title: (context: any) => {
            const index = context[0].dataIndex
            const calc = sortedCalculations[index]
            const date = new Date(calc.timestamp)
            return `${calc.label || `Hesaplama ${index + 1}`}\n${date.toLocaleString('tr-TR')}`
          },
          label: (context: any) => {
            return `${context.dataset.label}: ${context.parsed.y.toFixed(2)}`
          },
          afterBody: (context: any) => {
            const index = context[0].dataIndex
            const calc = sortedCalculations[index]
            return [`\nDers Sayısı: ${calc.courses.length}`]
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: false,
        min: 0,
        max: 4,
        grid: {
          color: 'rgba(255, 255, 255, 0.3)',
          lineWidth: 1.5
        },
        ticks: {
          color: '#ffffff',
          font: {
            size: 14,
            weight: 'bold' as const
          },
          stepSize: 0.5,
          callback: function(value: any) {
            return value.toFixed(1)
          }
        },
        title: {
          display: true,
          text: 'GPA Değeri',
          color: '#ffffff',
          font: {
            size: 16,
            weight: 'bold' as const
          }
        }
      },
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.15)',
          lineWidth: 1
        },
        ticks: {
          color: '#ffffff',
          font: {
            size: 13,
            weight: 'bold' as const
          },
          maxRotation: 45
        },
        title: {
          display: true,
          text: 'Hesaplama Sırası',
          color: '#ffffff',
          font: {
            size: 16,
            weight: 'bold' as const
          }
        }
      }
    },
    interaction: {
      intersect: false,
      mode: 'index' as const
    },
    elements: {
      point: {
        hoverBackgroundColor: '#ffffff'
      }
    }
  }

  // İstatistikler
  const latestGPA = sortedCalculations[sortedCalculations.length - 1]
  const firstGPA = sortedCalculations[0]
  const termGPAChange = latestGPA.results.termGPA - firstGPA.results.termGPA
  const cumulativeGPAChange = latestGPA.results.cumulativeGPA - firstGPA.results.cumulativeGPA

  return (
    <Card elevation={3}>
      <CardContent>
        <Box display="flex" alignItems="center" gap={1} mb={3}>
          <TrendingUp sx={{ color: 'primary.main' }} />
          <Typography variant="h6" fontWeight={600}>
            GPA Trend Analizi
          </Typography>
        </Box>

        {/* İstatistikler */}
        <Box 
          display="flex" 
          justifyContent="space-around" 
          mb={3}
          sx={{
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: 2,
            p: 3,
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}
        >
          <Box textAlign="center">
            <Typography 
              variant="body2" 
              sx={{ 
                color: 'rgba(255, 255, 255, 0.9)',
                fontWeight: 600,
                mb: 1
              }}
            >
              Dönemlik GPA Değişimi
            </Typography>
            <Typography 
              variant="h5" 
              fontWeight={800}
              color={termGPAChange >= 0 ? '#4ade80' : '#f87171'}
              sx={{ textShadow: '0 0 10px rgba(255,255,255,0.3)' }}
            >
              {termGPAChange >= 0 ? '+' : ''}{termGPAChange.toFixed(2)}
            </Typography>
          </Box>
          <Box textAlign="center">
            <Typography 
              variant="body2" 
              sx={{ 
                color: 'rgba(255, 255, 255, 0.9)',
                fontWeight: 600,
                mb: 1
              }}
            >
              Genel GPA Değişimi
            </Typography>
            <Typography 
              variant="h5" 
              fontWeight={800}
              color={cumulativeGPAChange >= 0 ? '#4ade80' : '#f87171'}
              sx={{ textShadow: '0 0 10px rgba(255,255,255,0.3)' }}
            >
              {cumulativeGPAChange >= 0 ? '+' : ''}{cumulativeGPAChange.toFixed(2)}
            </Typography>
          </Box>
          <Box textAlign="center">
            <Typography 
              variant="body2" 
              sx={{ 
                color: 'rgba(255, 255, 255, 0.9)',
                fontWeight: 600,
                mb: 1
              }}
            >
              Toplam Hesaplama
            </Typography>
            <Typography 
              variant="h5" 
              fontWeight={800}
              color="#ffffff"
              sx={{ textShadow: '0 0 10px rgba(255,255,255,0.3)' }}
            >
              {calculations.length}
            </Typography>
          </Box>
        </Box>

        {/* Grafik */}
        <Box sx={{ height: 400, position: 'relative' }}>
          <Line data={data} options={options} />
        </Box>
      </CardContent>
    </Card>
  )
}
