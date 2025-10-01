"use client"

import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Brain, LogOut, BookOpen, TrendingUp, AlertCircle, Award, CheckCircle, Target } from "lucide-react"
import {
  mockStudents,
  getStudentGrades,
  calculateAverage,
  getStudentBehavior,
  getStudentRecommendations,
  getSubjectById,
} from "@/lib/mock-data"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

export default function ParentDashboard() {
  const { user, logout } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!user || user.role !== "parent") {
      router.push("/")
    }
  }, [user, router])

  if (!user) return null

  // Get child data (linked by studentId)
  const child = mockStudents.find((s) => s.id === user.studentId)!
  const grades = getStudentGrades(child.id)
  const behavior = getStudentBehavior(child.id)
  const recommendations = getStudentRecommendations(child.id)
  const average = calculateAverage(grades)

  // Trend data (mock)
  const trendData = [
    { month: "Ene", score: 78 },
    { month: "Feb", score: 82 },
    { month: "Mar", score: 85 },
    { month: "Abr", score: average },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Brain className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-foreground">EduCeriAI</h1>
              <p className="text-xs text-muted-foreground">Portal de Padres</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <Avatar className="w-9 h-9">
                <AvatarImage src={user.avatar || "/placeholder.svg"} />
                <AvatarFallback>
                  {user.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="hidden sm:block">
                <p className="text-sm font-medium text-foreground">{user.name}</p>
                <p className="text-xs text-muted-foreground">Padre/Madre</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                logout()
                router.push("/")
              }}
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Child Info Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Avatar className="w-16 h-16">
              <AvatarImage src={child.avatar || "/placeholder.svg"} />
              <AvatarFallback>
                {child.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-2xl font-bold text-foreground">{child.name}</h2>
              <p className="text-muted-foreground">Grado {child.grade} - Reporte Académico</p>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Promedio General</CardTitle>
              <TrendingUp className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{average}%</div>
              <p className="text-xs text-green-500 mt-1">+7% vs mes anterior</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Comportamiento</CardTitle>
              <Award className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">4.5/5</div>
              <p className="text-xs text-muted-foreground mt-1">Excelente desempeño</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Asistencia</CardTitle>
              <CheckCircle className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">98%</div>
              <p className="text-xs text-muted-foreground mt-1">Muy buena asistencia</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Alertas</CardTitle>
              <AlertCircle className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">1</div>
              <p className="text-xs text-muted-foreground mt-1">Área de refuerzo</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-6 mb-6">
          {/* Performance Trend */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Tendencia de Rendimiento</CardTitle>
              <CardDescription>Evolución del promedio en los últimos meses</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  score: {
                    label: "Promedio",
                    color: "hsl(var(--chart-1))",
                  },
                }}
                className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trendData}>
                    <defs>
                      <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} domain={[0, 100]} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Area
                      type="monotone"
                      dataKey="score"
                      stroke="hsl(var(--chart-1))"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#colorScore)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Quick Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Resumen Rápido</CardTitle>
              <CardDescription>Estado actual</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Rendimiento</span>
                  <Badge variant="default">Bueno</Badge>
                </div>
                <Progress value={average} />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Comportamiento</span>
                  <Badge variant="default">Excelente</Badge>
                </div>
                <Progress value={90} />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Participación</span>
                  <Badge variant="default">Muy buena</Badge>
                </div>
                <Progress value={80} />
              </div>

              <div className="pt-4 border-t border-border">
                <p className="text-sm font-medium text-foreground mb-2">Próxima reunión:</p>
                <p className="text-sm text-muted-foreground">15 de Febrero, 2025</p>
                <Button variant="outline" size="sm" className="w-full mt-3 bg-transparent">
                  Agendar cita con docente
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Grades by Subject */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Calificaciones por Materia</CardTitle>
            <CardDescription>Desempeño detallado en cada asignatura</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {grades.map((grade) => {
                const subject = getSubjectById(grade.subjectId)
                const percentage = Math.round((grade.score / grade.maxScore) * 100)

                return (
                  <div key={grade.id} className="flex items-center gap-4 p-4 rounded-lg border border-border">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <BookOpen className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-foreground">{subject?.name}</h4>
                        <Badge variant={percentage >= 80 ? "default" : percentage >= 70 ? "secondary" : "destructive"}>
                          {percentage}%
                        </Badge>
                      </div>
                      <Progress value={percentage} />
                      <p className="text-xs text-muted-foreground">
                        Última evaluación: {new Date(grade.date).toLocaleDateString("es")}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* AI Recommendations */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-primary" />
              Recomendaciones de la IA para Apoyar en Casa
            </CardTitle>
            <CardDescription>Sugerencias personalizadas para reforzar el aprendizaje</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recommendations.map((rec) => {
                const subject = rec.subjectId ? getSubjectById(rec.subjectId) : null

                return (
                  <div key={rec.id} className="p-4 rounded-lg border border-border space-y-3">
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                          rec.priority === "high"
                            ? "bg-destructive/20"
                            : rec.priority === "medium"
                              ? "bg-primary/20"
                              : "bg-muted"
                        }`}
                      >
                        {rec.type === "reinforcement" && <Target className="w-5 h-5" />}
                        {rec.type === "learning-path" && <Brain className="w-5 h-5" />}
                        {rec.type === "resource" && <BookOpen className="w-5 h-5" />}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-foreground">{rec.title}</h4>
                          {subject && (
                            <Badge variant="outline" className="text-xs">
                              {subject.name}
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">{rec.description}</p>

                        {rec.type === "reinforcement" && (
                          <div className="p-3 rounded-lg bg-muted space-y-2">
                            <p className="text-sm font-medium text-foreground">Cómo puede ayudar:</p>
                            <ul className="space-y-1 text-sm text-muted-foreground">
                              <li className="flex items-center gap-2">
                                <CheckCircle className="w-3 h-3 text-primary" />
                                Dediquen 20-30 minutos diarios a repasar juntos
                              </li>
                              <li className="flex items-center gap-2">
                                <CheckCircle className="w-3 h-3 text-primary" />
                                Utilicen videos educativos de Khan Academy
                              </li>
                              <li className="flex items-center gap-2">
                                <CheckCircle className="w-3 h-3 text-primary" />
                                Practiquen con ejercicios interactivos
                              </li>
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}

              {/* General Tips */}
              <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
                    <Award className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Fortalezas Identificadas</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      {child.name} muestra excelente participación en clase y hábitos de estudio consistentes. Su estilo
                      de aprendizaje visual es una gran ventaja que pueden aprovechar en casa.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline">Aprendizaje visual</Badge>
                      <Badge variant="outline">Buena participación</Badge>
                      <Badge variant="outline">Responsable con tareas</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
